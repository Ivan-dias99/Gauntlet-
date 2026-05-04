"""
Gauntlet — Composer Surface (Wave V0)

Four routes — context, intent, preview, apply — wrapping the existing
brain (engine.py · agent.py · runs.py · memory.py) without rewriting it.

Canonical flow:
    POST /composer/context  → context_id  (capture authorized payload)
    POST /composer/intent   → intent_id   (classify + route to model)
    POST /composer/preview  → preview_id  (generate artifact, no apply)
    POST /composer/apply    → run_id      (apply or reject, record run)

Every preview→apply cycle is one mission slice, recorded in runs.json
with route="composer" for full provenance.

Security: the P-31 middleware stack (auth, rate limit, body cap,
headers, log redaction) wraps these routes automatically since they
mount on the same FastAPI app. No per-route work needed here.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from collections import OrderedDict
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException, status

from models import (
    ApplyResult,
    ComposerApplyRequest,
    ComposerArtifact,
    ComposerIntentRequest,
    ComposerPreviewRequest,
    ContextCaptureRequest,
    ContextCaptureResponse,
    ContextPackage,
    DomAction,
    DomPlanRequest,
    DomPlanResult,
    IntentKind,
    IntentResult,
    ModelRoute,
    PreviewResult,
    RiskLevel,
    RunRecord,
    SignalQuery,
    SuggestedAction,
)
from model_gateway import GatewayCall, gateway
from pydantic import TypeAdapter, ValidationError
from runs import run_store

logger = logging.getLogger("gauntlet.composer")

router = APIRouter(prefix="/composer", tags=["composer"])


# ── In-memory TTL cache for ContextPackage / IntentResult / PreviewResult ──
# V0: in-process, single-replica. Wave 8c: swap for Redis with same interface.

_CONTEXT_TTL_SECONDS = 300       # 5 min
_INTENT_TTL_SECONDS = 300
_PREVIEW_TTL_SECONDS = 600       # 10 min — survives a coffee break
_MAX_ENTRIES = 1000              # LRU cap per store

DEFAULT_REFUSAL = (
    "Não tenho confiança suficiente para responder a isto. "
    "Reformula com mais contexto ou escolhe uma intenção mais concreta."
)


class _TTLStore:
    """Tiny TTL + LRU dict. Async-safe via lock."""

    def __init__(self, ttl_seconds: int, max_entries: int = _MAX_ENTRIES):
        self._data: "OrderedDict[UUID, tuple[float, object]]" = OrderedDict()
        self._ttl = ttl_seconds
        self._max = max_entries
        self._lock = asyncio.Lock()

    async def put(self, key: UUID, value: object) -> None:
        async with self._lock:
            self._data[key] = (time.monotonic() + self._ttl, value)
            self._data.move_to_end(key)
            while len(self._data) > self._max:
                self._data.popitem(last=False)

    async def get(self, key: UUID) -> Optional[object]:
        async with self._lock:
            entry = self._data.get(key)
            if entry is None:
                return None
            expires_at, value = entry
            if time.monotonic() > expires_at:
                self._data.pop(key, None)
                return None
            self._data.move_to_end(key)
            return value


_contexts: _TTLStore = _TTLStore(_CONTEXT_TTL_SECONDS)
_intents: _TTLStore = _TTLStore(_INTENT_TTL_SECONDS)
_previews: _TTLStore = _TTLStore(_PREVIEW_TTL_SECONDS)


# ── Engine bridge ──────────────────────────────────────────────────────────
# The server's SignalEngine instance is created in lifespan; we read it
# at request time so the composer module loads even before lifespan runs
# (e.g. during pytest collection or `import server`).

def _get_engine():
    """Return the live SignalEngine instance from server, or 503."""
    import server  # local import — server imports composer, mutual avoidance
    if server.engine is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "engine_not_initialized",
                "reason": "EngineNotInitialized",
                "message": "Composer cannot run before the engine is up.",
            },
        )
    return server.engine


# ── Intent classification (V0 heuristic) ───────────────────────────────────
# V0: deterministic keyword router. Wave 1 swaps to engine.classify() once
# that surface is exposed. Cheap and auditable beats flashy and opaque.

async def _classify_intent(
    ctx: ContextPackage, user_input: str, chamber_hint: Optional[str]
) -> tuple[IntentKind, float, str, list[str]]:
    text = user_input.lower().strip()

    if any(w in text for w in ("summarize", "tl;dr", "resumo", "resume")):
        return "summarize", 0.92, f"Summarize selection from {ctx.source.value}", []
    if any(w in text for w in ("rewrite", "rephrase", "reescrever")):
        return "rewrite", 0.90, "Rewrite the selected text", []
    if any(w in text for w in ("debug", "fix", "patch", "error", "traceback", "bug")):
        return "debug_code", 0.88, "Diagnose and patch the code/error", []
    if any(w in text for w in ("fastapi", "endpoint", "route", "api", "backend", "schema")):
        return "generate_code", 0.85, "Generate backend code from context", []
    if any(w in text for w in ("design", "landing", "component", "ui", "tokens")):
        return "create_design", 0.80, "Compose a design artifact", []
    if any(w in text for w in ("report", "executive", "summary report", "relatório")):
        return "create_report", 0.85, "Create an executive report", []
    if any(w in text for w in ("image", "imagem", "picture", "render")):
        return "generate_image", 0.80, "Generate an image from context", []
    if any(w in text for w in ("save to memory", "remember", "lembra", "guarda")):
        return "save_memory", 0.95, "Save this to memory", []
    if any(w in text for w in ("search memory", "find in memory", "what did i save")):
        return "search_memory", 0.95, "Search saved memory", []

    # Any non-empty input that didn't match a specific keyword goes to
    # the engine (triad + judge). The engine's doctrine decides whether to
    # answer or refuse — the classifier should not preemptively refuse for
    # the user. Ambiguous is reserved for truly empty input.
    if text:
        source_note = f"with selection from {ctx.source.value}" if ctx.selection else f"from {ctx.source.value}"
        return "analyze", 0.60, f"Answer or analyse input {source_note}", []

    return "ambiguous", 0.35, "No input provided", ["What would you like to do?"]



def _route_model(intent: IntentKind, ctx: ContextPackage) -> ModelRoute:
    """Map intent → model selection. V0 static policy."""
    code_intents = {"generate_code", "debug_code"}
    image_intents = {"generate_image"}
    heavy_intents = {"create_report", "analyze", "execute_plan"}

    if intent in code_intents:
        return ModelRoute(
            primary_model="claude-opus-4-7",
            fallback_models=["claude-sonnet-4-6"],
            reason="Code generation/debug requires strong reasoning + tool use",
            expected_latency_ms=3500,
            tool_requirements=["filesystem", "code_validator"],
        )
    if intent in image_intents:
        return ModelRoute(
            primary_model="image-generator-v1",
            fallback_models=[],
            reason="Image synthesis route",
            expected_latency_ms=8000,
            tool_requirements=["image_runtime"],
        )
    if intent in heavy_intents:
        return ModelRoute(
            primary_model="claude-opus-4-7",
            fallback_models=["claude-sonnet-4-6"],
            reason="Reasoning-heavy synthesis",
            expected_latency_ms=4000,
        )
    if intent in {"summarize", "rewrite", "extract"}:
        return ModelRoute(
            primary_model="claude-haiku-4-5",
            fallback_models=["claude-sonnet-4-6"],
            reason="Fast/cheap path for short transformations",
            expected_latency_ms=1200,
        )
    return ModelRoute(
        primary_model="claude-sonnet-4-6",
        fallback_models=["claude-haiku-4-5"],
        reason="Default balanced route",
        expected_latency_ms=2000,
    )


def _risk_for(intent: IntentKind, ctx: ContextPackage) -> tuple[RiskLevel, bool]:
    """Risk + approval policy. Anything that writes or executes → approval."""
    write_intents = {"generate_code", "debug_code", "execute_plan", "automate_flow"}
    if intent in write_intents:
        return RiskLevel.medium, True
    return RiskLevel.low, False


def _suggested_actions_for(intent: IntentKind, ctx: ContextPackage) -> list[SuggestedAction]:
    base: list[SuggestedAction] = []
    if ctx.selection:
        base += [
            SuggestedAction(id="summarize", label="Summarize", intent="summarize"),
            SuggestedAction(id="rewrite", label="Rewrite", intent="rewrite"),
            SuggestedAction(id="extract", label="Extract", intent="extract"),
        ]
    if ctx.source.value in ("ide", "terminal"):
        base += [
            SuggestedAction(id="debug", label="Debug & Patch", intent="debug_code", risk=RiskLevel.medium),
            SuggestedAction(id="generate", label="Generate Code", intent="generate_code", risk=RiskLevel.medium),
        ]
    if ctx.source.value == "browser":
        base += [
            SuggestedAction(id="report", label="Create Report", intent="create_report"),
        ]
    return base[:6]


# ── Routes ─────────────────────────────────────────────────────────────────

@router.post("/context", response_model=ContextCaptureResponse)
async def capture_context(req: ContextCaptureRequest) -> ContextCaptureResponse:
    """Stage 1 — capture authorized context. Returns a context_id for the next call."""
    confidence = 1.0
    if not req.selection and not req.url and not req.app_name:
        confidence = 0.5  # weak context → downstream may need to clarify

    pkg = ContextPackage(
        source=req.source,
        url=req.url,
        page_title=req.page_title,
        app_name=req.app_name,
        window_title=req.window_title,
        selection=req.selection,
        clipboard=req.clipboard,
        screenshot_ref=req.screenshot_ref,
        files=req.files,
        metadata=req.metadata,
        permission_scope=req.permission_scope,
        confidence=confidence,
    )
    await _contexts.put(pkg.context_id, pkg)
    logger.info(
        "composer.context.captured context_id=%s source=%s",
        pkg.context_id, pkg.source.value,
    )

    return ContextCaptureResponse(
        context_id=pkg.context_id,
        confidence=confidence,
        expires_at=datetime.now(timezone.utc) + timedelta(seconds=_CONTEXT_TTL_SECONDS),
    )


@router.post("/intent", response_model=IntentResult)
async def detect_intent(req: ComposerIntentRequest) -> IntentResult:
    """Stage 2 — context + user input → typed intent + model route."""
    ctx = await _contexts.get(req.context_id)
    if ctx is None:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail={"error": "context_expired", "message": "context_id not found or expired"},
        )
    assert isinstance(ctx, ContextPackage)

    intent, confidence, summary, clarifying = await _classify_intent(
        ctx, req.user_input, req.chamber_hint
    )
    route = _route_model(intent, ctx)
    risk, requires_approval = _risk_for(intent, ctx)
    actions = _suggested_actions_for(intent, ctx)

    result = IntentResult(
        context_id=ctx.context_id,
        intent=intent,
        confidence=confidence,
        summary=summary,
        user_input=req.user_input,
        suggested_actions=actions,
        model_route=route,
        tools_needed=route.tool_requirements,
        risk_estimate=risk,
        requires_approval=requires_approval,
        clarifying_questions=clarifying,
    )
    await _intents.put(result.intent_id, result)
    logger.info(
        "composer.intent.detected intent_id=%s intent=%s confidence=%.2f model=%s",
        result.intent_id, intent, confidence, route.primary_model,
    )
    return result


@router.post("/preview", response_model=PreviewResult)
async def generate_preview(req: ComposerPreviewRequest) -> PreviewResult:
    """Stage 3 — run the model, produce the artifact, do NOT apply yet.

    Routes through SignalEngine.process_query for synthesis intents
    (triad+judge) and SignalEngine.process_dev_query for code intents
    (agent loop). Refusals come back as `refused=True` with
    `judge_verdict="low"` — the capsule UI shows DEFAULT_REFUSAL,
    not fluent invention.
    """
    intent = await _intents.get(req.intent_id)
    if intent is None:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail={"error": "intent_expired", "message": "intent_id not found or expired"},
        )
    assert isinstance(intent, IntentResult)
    ctx = await _contexts.get(intent.context_id)
    if ctx is None:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail={"error": "context_expired"},
        )
    assert isinstance(ctx, ContextPackage)

    started = time.perf_counter()

    artifact: ComposerArtifact
    refused = False
    refusal_reason: Optional[str] = None
    judge_verdict: Optional[str] = None
    tools_used: list[str] = []
    model_used = intent.model_route.primary_model

    try:
        if intent.intent in {"generate_code", "debug_code", "execute_plan"}:
            # Agent path — tool use
            engine = _get_engine()
            agent_query = SignalQuery(
                question=_compose_agent_question(intent, req.intent_id),
                context=_compose_context_blob(ctx),
                chamber="terminal",
            )
            agent_result = await engine.process_dev_query(agent_query)
            tools_used = [tc.get("name", "") for tc in agent_result.tool_calls]
            artifact = ComposerArtifact(
                kind="code_patch",
                content=agent_result.answer or DEFAULT_REFUSAL,
                files_impacted=ctx.files or [],
                metadata={
                    "iterations": agent_result.iterations,
                    "stop_reason": agent_result.stop_reason,
                    "terminated_early": agent_result.terminated_early,
                    "termination_reason": agent_result.termination_reason,
                },
            )
            if agent_result.terminated_early:
                refused = True
                refusal_reason = agent_result.termination_reason or "agent_terminated_early"
                judge_verdict = "low"

        elif intent.intent in {"summarize", "rewrite", "analyze", "create_report", "extract"}:
            # Triad path — engine.process_query → judge verdict propagates
            engine = _get_engine()
            triad_query = SignalQuery(
                question=_compose_triad_question(intent, req.intent_id),
                context=_compose_context_blob(ctx),
            )
            signal_response = await engine.process_query(triad_query)
            judge_verdict = "high" if signal_response.confidence.value == "high" else "low"
            if signal_response.refused:
                refused = True
                refusal_reason = (
                    signal_response.refusal_reason.value
                    if signal_response.refusal_reason else "judge_low_confidence"
                )
            artifact = ComposerArtifact(
                kind="report" if intent.intent == "create_report" else "text",
                content=(
                    signal_response.answer
                    if signal_response.answer and not refused
                    else (signal_response.refusal_message or DEFAULT_REFUSAL)
                ),
                metadata={
                    "judge_reasoning": signal_response.judge_reasoning,
                    "triad_agreement": signal_response.triad_agreement,
                },
            )

        elif intent.intent == "save_memory":
            # V0: acknowledge — real memory.save_record wiring lands in Wave 1.
            artifact = ComposerArtifact(
                kind="text",
                content=f"Saved to memory: {(ctx.selection or '')[:200]}",
                metadata={"wire_pending": "memory.save_record"},
            )

        elif intent.intent == "ambiguous":
            refused = True
            refusal_reason = "ambiguous_intent"
            artifact = ComposerArtifact(
                kind="text",
                content=DEFAULT_REFUSAL,
            )
            judge_verdict = "low"

        else:
            # search_memory, generate_image, create_design, automate_flow, unsupported
            artifact = ComposerArtifact(
                kind="text",
                content=f"Intent '{intent.intent}' not yet wired in V0.",
                metadata={"wire_pending": f"intent_handler:{intent.intent}"},
            )
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001 — boundary node logs and degrades
        logger.exception("composer.preview.engine_error")
        refused = True
        refusal_reason = f"engine_error:{type(exc).__name__}"
        artifact = ComposerArtifact(
            kind="text",
            content=DEFAULT_REFUSAL,
        )
        judge_verdict = "low"

    latency_ms = int((time.perf_counter() - started) * 1000)

    result = PreviewResult(
        intent_id=intent.intent_id,
        context_id=intent.context_id,
        artifact=artifact,
        risk=intent.risk_estimate,
        requires_approval=intent.requires_approval,
        model_used=model_used,
        tools_used=tools_used,
        latency_ms=latency_ms,
        judge_verdict=judge_verdict,  # type: ignore[arg-type]
        refused=refused,
        refusal_reason=refusal_reason,
    )
    await _previews.put(result.preview_id, result)
    logger.info(
        "composer.preview.generated preview_id=%s refused=%s latency_ms=%d model=%s",
        result.preview_id, refused, latency_ms, result.model_used,
    )
    return result


_DOM_ACTION_ADAPTER = TypeAdapter(list[DomAction])


_DOM_PLAN_SYSTEM_PROMPT = """You are Gauntlet's DOM-action planner.

The user is on a live web page. Your job is to translate their request
into a precise list of DOM actions the browser will execute on the
page. Only emit actions whose selectors are present in the dom_skeleton
context section.

Output ONLY a JSON object of the form:
  {"actions":[<action>,...]}

Action shapes (the "type" field is the discriminator):
  {"type":"fill","selector":"<css>","value":"<string>"}
  {"type":"click","selector":"<css>"}
  {"type":"highlight","selector":"<css>","duration_ms":<int 100..10000>}
  {"type":"scroll_to","selector":"<css>"}

Hard rules:
  * No prose, no markdown fences, no explanation — JSON only.
  * Selectors must be valid CSS selectors. Prefer #id or
    [name="..."] over fragile structural paths.
  * If you cannot plan (ambiguous request, missing element, dangerous
    action like submitting payment forms without explicit confirmation),
    return {"actions":[],"reason":"<short why in user's language>"}.
  * Never include actions that target the Gauntlet capsule itself
    (selectors starting with "gauntlet-" or inside #gauntlet-capsule-host).
"""


def _strip_json_fence(raw: str) -> str:
    """Some models still wrap JSON in ```json ... ``` despite the
    instruction. Strip a single leading + trailing fence; everything
    else is left to the JSON parser to flag."""
    s = raw.strip()
    if s.startswith("```"):
        first_nl = s.find("\n")
        if first_nl != -1:
            s = s[first_nl + 1 :]
        if s.endswith("```"):
            s = s[: -3]
    return s.strip()


@router.post("/dom_plan", response_model=DomPlanResult)
async def dom_plan(req: DomPlanRequest) -> DomPlanResult:
    """Translate a natural-language request into a typed list of DOM
    actions the browser content script will execute on approval.

    Single-shot model call routed through the gateway. The response is
    JSON-only; we strip any stray markdown fence and validate against
    the DomAction discriminated union. Actions that fail validation are
    dropped silently — the user still sees what survived plus a reason
    line when the model refused.
    """
    ctx = await _contexts.get(req.context_id)
    if ctx is None:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail={"error": "context_expired"},
        )
    assert isinstance(ctx, ContextPackage)

    engine = _get_engine()
    choice = gateway.select("default")
    model_id = choice.model_id

    user_msg = (
        f"Page context:\n{_compose_context_blob(ctx)}\n\n"
        f"Request: {req.user_input}"
    )

    started = time.perf_counter()
    raw_text = ""
    try:
        response = await engine._client.messages.create(
            model=model_id,
            max_tokens=2000,
            temperature=0.1,
            system=_DOM_PLAN_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_msg}],
        )
        for block in response.content:
            if getattr(block, "type", None) == "text":
                raw_text += block.text
        gateway.record(GatewayCall(
            role="default", model_id=model_id, provider=choice.provider,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
        ))
    except Exception as exc:  # noqa: BLE001
        gateway.record(GatewayCall(
            role="default", model_id=model_id, provider=choice.provider,
            succeeded=False, error_kind=type(exc).__name__,
        ))
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={"error": "dom_plan_model_failed", "message": str(exc)},
        )

    latency_ms = int((time.perf_counter() - started) * 1000)

    cleaned = _strip_json_fence(raw_text)
    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        logger.warning("dom_plan: model returned non-JSON: %r", raw_text[:300])
        return DomPlanResult(
            context_id=req.context_id,
            actions=[],
            reason="model returned non-JSON; refusing to execute",
            model_used=model_id,
            latency_ms=latency_ms,
            raw_response=raw_text[:1000],
        )

    raw_actions = parsed.get("actions") if isinstance(parsed, dict) else None
    reason = parsed.get("reason") if isinstance(parsed, dict) else None

    actions: list[DomAction] = []
    if isinstance(raw_actions, list):
        try:
            actions = _DOM_ACTION_ADAPTER.validate_python(raw_actions)
        except ValidationError:
            # Try to salvage: validate one-by-one, drop the rotten ones.
            for a in raw_actions:
                try:
                    actions.append(_DOM_ACTION_ADAPTER.validate_python([a])[0])
                except ValidationError:
                    continue

    logger.info(
        "composer.dom_plan model=%s latency_ms=%d actions=%d reason=%r",
        model_id, latency_ms, len(actions), reason,
    )

    return DomPlanResult(
        context_id=req.context_id,
        actions=actions,
        reason=reason if isinstance(reason, str) else None,
        model_used=model_id,
        latency_ms=latency_ms,
        raw_response=None if actions else raw_text[:1000],
    )


@router.post("/apply", response_model=ApplyResult)
async def apply_preview(req: ComposerApplyRequest) -> ApplyResult:
    """Stage 4 — apply (or reject) the preview, record the run."""
    preview = await _previews.get(req.preview_id)
    if preview is None:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail={"error": "preview_expired"},
        )
    assert isinstance(preview, PreviewResult)

    run_id = uuid4()

    if not req.approved:
        ledger_event = await _record_composer_run(
            run_id=run_id,
            preview=preview,
            status_="rejected",
            reason=req.approval_reason or "user_rejected",
        )
        return ApplyResult(
            run_id=run_id,
            preview_id=preview.preview_id,
            status="rejected",
            ledger_event_id=ledger_event,
        )

    if preview.refused:
        ledger_event = await _record_composer_run(
            run_id=run_id,
            preview=preview,
            status_="skipped",
            reason=preview.refusal_reason or "refused_at_preview",
        )
        return ApplyResult(
            run_id=run_id,
            preview_id=preview.preview_id,
            status="skipped",
            error=preview.refusal_reason or "refused_at_preview",
            ledger_event_id=ledger_event,
        )

    # V0: server does NOT auto-write files. The frontend capsule owns the
    # apply gesture (Copy / Apply-to-file / Save) — server records it.
    # Wave 1 wires real connectors (filesystem, github, vercel) here.
    try:
        ledger_event = await _record_composer_run(
            run_id=run_id,
            preview=preview,
            status_="applied",
            reason=req.approval_reason,
        )
        return ApplyResult(
            run_id=run_id,
            preview_id=preview.preview_id,
            status="applied",
            artifacts=[preview.artifact],
            ledger_event_id=ledger_event,
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("composer.apply.failed")
        await _record_composer_run(
            run_id=run_id,
            preview=preview,
            status_="failed",
            reason=str(exc),
        )
        return ApplyResult(
            run_id=run_id,
            preview_id=preview.preview_id,
            status="failed",
            error=str(exc),
        )


# ── Helpers ────────────────────────────────────────────────────────────────

async def _record_composer_run(
    run_id: UUID,
    preview: PreviewResult,
    status_: str,
    reason: Optional[str],
) -> Optional[str]:
    """Append the composer envelope to runs.json with route='composer'.

    The underlying engine already records its own row (route='agent' or
    'triad') with the model latency and tokens. This composer row is the
    envelope marker — preview_id, intent_id, status, refused — so the
    operator can correlate the two layers in the ledger viewer.
    """
    try:
        record = RunRecord(
            id=str(run_id),
            route="composer",
            question=f"composer:{preview.intent_id}",
            context=f"context_id={preview.context_id} preview_id={preview.preview_id} status={status_}",
            answer=preview.artifact.content[:2000],
            refused=preview.refused,
            confidence=preview.judge_verdict,
            judge_reasoning=preview.refusal_reason,
            tool_calls=[{"name": t, "ok": True} for t in preview.tools_used],
            iterations=None,
            processing_time_ms=preview.latency_ms,
            terminated_early=preview.refused,
            termination_reason=reason,
        )
        await run_store.record(record)
        logger.info(
            "composer.ledger.append run_id=%s preview_id=%s status=%s",
            run_id, preview.preview_id, status_,
        )
        return str(run_id)
    except Exception:  # noqa: BLE001
        logger.exception("composer.ledger.append_failed")
        return None


def _compose_agent_question(intent: IntentResult, intent_id: UUID) -> str:
    lines = [f"[composer:{intent_id}] intent={intent.intent}"]
    if intent.user_input:
        lines.append(f"user: {intent.user_input}")
    lines.append(f"task: {intent.summary}")
    lines.append("Produce a working code patch or command sequence. If the request is unclear, ask one clarifying question.")
    return "\n".join(lines)


def _compose_triad_question(intent: IntentResult, intent_id: UUID) -> str:
    lines = [f"[composer:{intent_id}] intent={intent.intent}"]
    if intent.user_input:
        lines.append(f"user: {intent.user_input}")
    lines.append(f"task: {intent.summary}")
    return "\n".join(lines)


def _compose_context_blob(ctx: ContextPackage) -> str:
    lines: list[str] = [f"source: {ctx.source.value}"]
    if ctx.url:
        lines.append(f"url: {ctx.url}")
    if ctx.page_title:
        lines.append(f"page_title: {ctx.page_title}")
    if ctx.app_name:
        lines.append(f"app: {ctx.app_name}")
    if ctx.window_title:
        lines.append(f"window: {ctx.window_title}")
    if ctx.files:
        lines.append(f"files: {', '.join(ctx.files[:8])}")
    if ctx.selection:
        lines.append("---")
        lines.append("selection:")
        lines.append(ctx.selection[:8000])
    if ctx.clipboard:
        lines.append("---")
        lines.append("clipboard:")
        lines.append(ctx.clipboard[:4000])
    # The browser content script forwards a capped slice of the live page's
    # innerText through metadata.page_text. Without this block the model
    # only ever saw url+title+selection and answered "I can't see the
    # page". Keep the cap conservative — page_text is a fuzzy fallback,
    # not the primary signal. Selection (when present) still wins.
    page_text = ctx.metadata.get("page_text") if ctx.metadata else None
    if isinstance(page_text, str) and page_text.strip():
        lines.append("---")
        lines.append("page_text:")
        lines.append(page_text[:6000])
    # dom_skeleton is a structured listing of fillable/clickable elements
    # with their selectors. The DOM-action planner needs real selectors
    # to avoid hallucinating CSS; without this it would guess and fail.
    dom_skeleton = ctx.metadata.get("dom_skeleton") if ctx.metadata else None
    if isinstance(dom_skeleton, str) and dom_skeleton.strip():
        lines.append("---")
        lines.append("dom_skeleton:")
        lines.append(dom_skeleton[:4000])
    return "\n".join(lines)
