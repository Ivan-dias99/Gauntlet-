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
from fastapi.responses import StreamingResponse

from models import (
    ApplyResult,
    ComposerApplyRequest,
    ComposerArtifact,
    ComposerIntentRequest,
    ComposerPreviewRequest,
    ComposerSettings,
    ContextCaptureRequest,
    ContextCaptureResponse,
    ContextPackage,
    DomAction,
    DomPlanRequest,
    DomPlanResult,
    ExecutionReportRequest,
    ExecutionReportResponse,
    IntentKind,
    IntentResult,
    ModelRoute,
    PreviewResult,
    RiskLevel,
    RunRecord,
    SignalQuery,
    SuggestedAction,
)
from composer_settings import settings_store
from model_gateway import GatewayCall, gateway
from pydantic import TypeAdapter, ValidationError
from runs import run_store
from runtime import require_engine
from urllib.parse import urlparse

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
# Lifespan in server.py constructs the Engine and stores it in runtime
# via runtime.set_engine(...). require_engine raises a typed 503 when the
# engine isn't ready, matching what every other router (ask/agent/runs/…)
# uses. Kept as a thin alias so existing call sites stay untouched.

def _get_engine():
    """Return the live Engine instance, or raise 503."""
    return require_engine()


# ── Governance Lock (Sprint 4) — settings application helpers ──────────────

def _hostname_of(url: Optional[str]) -> Optional[str]:
    """Lower-case hostname for policy lookup. Returns None when the URL
    is missing or unparseable; callers treat None as 'default policy'."""
    if not url:
        return None
    try:
        parsed = urlparse(url)
        host = (parsed.hostname or "").lower()
        return host or None
    except Exception:  # noqa: BLE001
        return None


def _domain_policy_for(settings: ComposerSettings, url: Optional[str]):
    """Resolve the effective DomainPolicy for a URL.

    Lookup order:
      1. Exact hostname match in settings.domains
      2. settings.default_domain_policy
    """
    host = _hostname_of(url)
    if host and host in settings.domains:
        return settings.domains[host]
    return settings.default_domain_policy


def _action_policy_for(settings: ComposerSettings, action_type: str):
    """Resolve the effective ActionPolicy for a DomAction.type."""
    if action_type in settings.actions:
        return settings.actions[action_type]
    return settings.default_action_policy


def _apply_context_caps(
    metadata: dict,
    settings: ComposerSettings,
) -> dict:
    """Truncate page_text + dom_skeleton on /composer/context per settings.

    Defense-in-depth: the extension already pre-caps in selection.ts but
    settings let the operator tighten further (or loosen, up to the
    Pydantic max). Returns a new dict — never mutates the caller's."""
    if not metadata:
        return metadata
    out = dict(metadata)
    page_text = out.get("page_text")
    if isinstance(page_text, str) and len(page_text) > settings.max_page_text_chars:
        out["page_text"] = page_text[: settings.max_page_text_chars] + "…"
    dom_skel = out.get("dom_skeleton")
    if isinstance(dom_skel, str) and len(dom_skel) > settings.max_dom_skeleton_chars:
        out["dom_skeleton"] = dom_skel[: settings.max_dom_skeleton_chars] + "…"
    return out


def _filter_actions_by_policy(
    actions: list[DomAction],
    settings: ComposerSettings,
) -> tuple[list[DomAction], list[str]]:
    """Drop actions whose type policy disallows them. Returns (kept, dropped_types)."""
    kept: list[DomAction] = []
    dropped: list[str] = []
    for a in actions:
        action_type = getattr(a, "type", None) or "unknown"
        policy = _action_policy_for(settings, action_type)
        if policy.allowed:
            kept.append(a)
        else:
            dropped.append(action_type)
    return kept, dropped


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

    # Sprint 4 — apply governance caps before stashing the context.
    # max_page_text_chars / max_dom_skeleton_chars truncate metadata
    # blobs at intake so downstream stages never see oversized payloads.
    settings = await settings_store.get()
    capped_metadata = _apply_context_caps(req.metadata or {}, settings)

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
        metadata=capped_metadata,
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

    Routes through Engine.process_query for synthesis intents
    (triad+judge) and Engine.process_dev_query for code intents
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

    # Sprint 7 — memory recovery applies to both paths. Computed once
    # here so the agent and triad branches share the same recovered
    # context instead of querying twice.
    memory_block = await _compose_memory_block(ctx, intent.user_input)

    try:
        if intent.intent in {"generate_code", "debug_code", "execute_plan"}:
            # Agent path — tool use
            engine = _get_engine()
            agent_query = SignalQuery(
                question=_compose_agent_question(intent, req.intent_id),
                context=_compose_context_blob(ctx, memory_block),
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
                context=_compose_context_blob(ctx, memory_block),
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


_DOM_PLAN_SYSTEM_PROMPT = """You are Gauntlet's planner.

The user is on a live surface — either a web page (browser shell) or
the operating system (desktop shell). The context blob below carries
`source: browser` or `source: desktop`. Their input is one of:
  (A) a request to ACT on the surface (DOM actions on web; shell or
      filesystem actions on desktop),
  (B) a question or short request for a TEXT answer (explain, summarise,
      translate, suggest wording),
  (C) neither — ambiguous, dangerous, or impossible given the surface.

You must decide which case applies and respond in JSON only.

Case A — emit a typed action plan:
  {"actions":[<action>,...]}

Web actions (only when source: browser). Each action is one of:
  {"type":"fill","selector":"<css>","value":"<string>"}
  {"type":"click","selector":"<css>"}
  {"type":"highlight","selector":"<css>","duration_ms":<int 100..10000>}
  {"type":"scroll_to","selector":"<css>"}
Selectors must come from the dom_skeleton context section. Prefer
#id or [name="..."] over fragile structural paths. Never target the
Gauntlet capsule itself (selectors starting with "gauntlet-" or
inside #gauntlet-capsule-host).

Desktop actions (only when source: desktop). Each action is one of:
  {"type":"shell.run","cmd":"<binary>","args":[<string>,...],"cwd":"<path or null>"}
  {"type":"fs.read","path":"<absolute path>"}
  {"type":"fs.write","path":"<absolute path>","content":"<full new file content>"}
  {"type":"computer_use","action":{"kind":"move","x":<int>,"y":<int>,"reason":"<short why>"}}
  {"type":"computer_use","action":{"kind":"click","button":"left|right|middle","reason":"<short why>"}}
  {"type":"computer_use","action":{"kind":"type","text":"<plain text up to 10000 chars>","reason":"<short why>"}}
  {"type":"computer_use","action":{"kind":"press","key":"Enter|Tab|Escape|Backspace|<single char>|...","reason":"<short why>"}}
Use shell.run for commands the operator's request implies (listing
files, git status, etc.). The cápsula's allowlist is OBSERVABILITY +
VERSION CONTROL + READ-ONLY filesystem inspection: git, ls, pwd,
cat, echo, head, tail, ps, whoami, uname, hostname, date, df, du,
wc, grep, find, which, where, rg. Generic interpreters (node, npm,
npx, python, pip, …) are NOT in the cápsula allowlist — they are
wildcard code-exec primitives. If the operator's request needs a
runtime, refuse (case C) and explain that interpreter exec belongs
in the agent flow (Control Center), not the cápsula.
Use fs.read to inspect a single file before transforming it. Use
fs.write to save the operator's requested output to disk. Paths
should be absolute. Use computer_use to drive the OS-level mouse
and keyboard — useful when the user asks to interact with an app
that has no DOM (native windows, IDEs, video calls, etc.). Each
computer_use action is gated CLIENT-SIDE: the cápsula renders a
modal showing the described action and only fires the OS event
after explicit approval, so the `reason` field is what the operator
reads to decide. The cápsula will surface a confirmation gate
before any shell.run / fs.write / computer_use executes — the
operator approves each batch. Pair move + click as TWO actions
in sequence (the operator approves each separately).

Case B — emit a compose text:
  {"compose":"<your answer in the user's language, markdown ok>"}
Keep it tight. The user is reading inside a small capsule, not a chat.
Three short paragraphs max unless they explicitly asked for more.

Case C — refuse and explain:
  {"actions":[],"reason":"<short why in user's language>"}

Hard rules:
  * No prose outside the JSON object. No markdown fences around the
    JSON. JSON only.
  * Pick exactly one case. Do not return both `actions` and `compose`
    populated simultaneously.
  * When in doubt between A and B, prefer B (text answer) — actions
    have side effects, text doesn't.
  * Refuse (case C) for: payment confirmations, account deletion,
    sending money, posting on someone's behalf without an explicit
    instruction to do so.
  * NEVER emit shell.run / fs.read / fs.write / computer_use when
    source is browser — those actions will be rejected by the
    cápsula's dispatcher. Refuse (case C) and explain that desktop
    is required.
  * NEVER emit shell.run for binaries outside the documented allowlist
    above. Anything else gets refused at the cápsula gate. If the
    operator's request needs an unsupported binary, refuse (case C)
    with a clear explanation.
"""


def _provider_supports_images(engine) -> bool:
    """True only when the underlying SDK client is the real Anthropic
    one. Groq and Gemini adapters reject Anthropic's image content
    blocks; sending one would 502 on the user. We detect by class
    name to avoid importing the Anthropic SDK just for an isinstance
    check (also: in MOCK mode the client is MockAsyncAnthropic which
    we treat as image-capable for parity testing)."""
    cls = type(engine._client).__name__
    return cls in ("AsyncAnthropic", "MockAsyncAnthropic")


async def _build_user_messages(
    ctx: ContextPackage, user_input: str, engine=None,
) -> list[dict]:
    """Compose the messages array for the planner, including a base64
    image block when the content script forwarded an opt-in viewport
    screenshot AND the active provider supports image inputs.
    Anthropic accepts a content list mixing image and text; when the
    screenshot is absent we send a plain string content (the SDK
    accepts both shapes interchangeably). On Groq/Gemini adapters we
    quietly drop the image block — those adapters only do text and
    would 502 on a list-shaped content with image blocks.

    Sprint 7 — pulls memory records relevant to the request and prepends
    them inside the context blob so the model sees prior decisions and
    canon as authoritative context."""
    memory_block = await _compose_memory_block(ctx, user_input)
    user_msg = (
        f"Page context:\n{_compose_context_blob(ctx, memory_block)}\n\n"
        f"Request: {user_input}"
    )
    image_blocks = _collect_image_blocks(ctx, engine)
    if image_blocks:
        return [
            {
                "role": "user",
                "content": [*image_blocks, {"type": "text", "text": user_msg}],
            }
        ]
    return [{"role": "user", "content": user_msg}]


def _collect_image_blocks(ctx: ContextPackage, engine) -> list[dict]:
    """Walk metadata for everything image-shaped that an Anthropic
    content list can carry. Two sources today:

      * `screenshot_data_url` — single viewport screenshot the content
        script captured at summon time (legacy path, still used when the
        operator opted in via SettingsDrawer).
      * `attachments` — list of image files / screenshots the operator
        pinned via the desktop ambient (A1). Shape:
            [{name, mime, base64, bytes}, ...]
        Text attachments stay inlined into user_input upstream and
        never reach this path.

    Both paths funnel through the same Anthropic image content shape.
    Groq and Gemini adapters reject images; we drop the blocks with a
    log line so the operator can see why the picture was ignored.
    """
    if not ctx.metadata:
        return []
    if engine is None or not _provider_supports_images(engine):
        if (
            ctx.metadata.get("screenshot_data_url")
            or ctx.metadata.get("attachments")
        ):
            logger.info(
                "composer.images_dropped provider=%s — adapter does not accept image blocks",
                type(engine._client).__name__ if engine is not None else "<none>",
            )
        return []

    blocks: list[dict] = []
    # Total payload cap across ALL images. Anthropic's 5MB-per-image
    # plus a soft global ceiling so a runaway batch doesn't burn 30 MB
    # of input tokens.
    PER_IMAGE_CAP = 1_500_000  # ~1 MB binary, fits 1280x800 PNG
    TOTAL_CAP = 6_000_000  # ~4.5 MB total
    used = 0

    raw_screenshot = ctx.metadata.get("screenshot_data_url")
    if (
        isinstance(raw_screenshot, str)
        and raw_screenshot.startswith("data:image/")
        and ";base64," in raw_screenshot
    ):
        prefix, b64 = raw_screenshot.split(";base64,", 1)
        if len(b64) <= PER_IMAGE_CAP and used + len(b64) <= TOTAL_CAP:
            media_type = prefix[len("data:") :] or "image/png"
            blocks.append(
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": media_type,
                        "data": b64,
                    },
                }
            )
            used += len(b64)

    raw_attachments = ctx.metadata.get("attachments")
    if isinstance(raw_attachments, list):
        for att in raw_attachments:
            if not isinstance(att, dict):
                continue
            mime = att.get("mime")
            b64 = att.get("base64")
            if not isinstance(mime, str) or not isinstance(b64, str):
                continue
            if not mime.startswith("image/"):
                continue
            if len(b64) > PER_IMAGE_CAP or used + len(b64) > TOTAL_CAP:
                logger.info(
                    "composer.attachment_skipped name=%r reason=size_cap",
                    att.get("name"),
                )
                continue
            blocks.append(
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": mime,
                        "data": b64,
                    },
                }
            )
            used += len(b64)
    return blocks


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

    # Sprint 4 — domain gate. Refuse to plan actions on a hostname the
    # operator disallowed. Compose-only paths are NOT blocked by the
    # domain policy — text answers about a page are read-only and don't
    # touch the DOM. This short-circuits before the model call so we
    # don't burn tokens on a request that would be filtered to nothing.
    settings = await settings_store.get()
    domain_policy = _domain_policy_for(settings, ctx.url)
    domain_blocked = not domain_policy.allowed

    engine = _get_engine()
    choice = gateway.select("default")
    model_id = choice.model_id

    messages = await _build_user_messages(ctx, req.user_input, engine)

    started = time.perf_counter()
    raw_text = ""
    try:
        response = await engine._client.messages.create(
            model=model_id,
            max_tokens=2000,
            temperature=0.1,
            system=_DOM_PLAN_SYSTEM_PROMPT,
            messages=messages,
        )
        for block in response.content:
            if getattr(block, "type", None) == "text":
                raw_text += block.text
        gateway.record(GatewayCall(
            role="default", model_id=model_id, provider=engine._provider_name,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
        ))
    except Exception as exc:  # noqa: BLE001
        gateway.record(GatewayCall(
            role="default", model_id=model_id, provider=engine._provider_name,
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
    raw_compose = parsed.get("compose") if isinstance(parsed, dict) else None
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

    # Sprint 4 — apply policy gates before returning. Order matters:
    # domain block wins (everything dropped, reason carries the why),
    # then per-action filter strips disallowed types.
    policy_reason: Optional[str] = None
    if domain_blocked and actions:
        host = _hostname_of(ctx.url) or "this domain"
        policy_reason = f"domain '{host}' is disallowed by Composer policy"
        logger.info(
            "composer.policy.domain_blocked host=%s dropped_actions=%d",
            host, len(actions),
        )
        actions = []
    elif actions:
        actions, dropped = _filter_actions_by_policy(actions, settings)
        if dropped:
            uniq = sorted(set(dropped))
            policy_reason = (
                f"action type(s) not permitted by policy: {', '.join(uniq)}"
            )
            logger.info(
                "composer.policy.action_filtered dropped=%s remaining=%d",
                uniq, len(actions),
            )

    # Compose is mutually exclusive with actions. If the model returned
    # both (against instructions), prefer the actions — they're the
    # higher-fidelity intent. The compose text is only kept when there
    # are no executable actions, which is the case-B branch the prompt
    # asks for.
    compose: Optional[str] = None
    if not actions and isinstance(raw_compose, str) and raw_compose.strip():
        compose = raw_compose.strip()
    # Surface the policy filter reason when it fired and there's no
    # other narrative to show — keep any model-supplied reason if the
    # planner already had one.
    if policy_reason and not reason:
        reason = policy_reason

    logger.info(
        "composer.dom_plan model=%s latency_ms=%d actions=%d compose=%s reason=%r",
        model_id, latency_ms, len(actions),
        "yes" if compose else "no", reason,
    )

    return DomPlanResult(
        context_id=req.context_id,
        actions=actions,
        compose=compose,
        reason=reason if isinstance(reason, str) else None,
        model_used=model_id,
        latency_ms=latency_ms,
        # Keep raw response only when neither path produced anything —
        # that's the only case the operator might want to debug.
        raw_response=None if (actions or compose) else raw_text[:1000],
    )


@router.post("/dom_plan_stream")
async def dom_plan_stream(req: DomPlanRequest) -> StreamingResponse:
    """Same as /dom_plan but server-sent events.

    The user perceives a 1.5–4s wait as "the capsule is alive" instead
    of "the spinner has frozen". Two SSE event names are emitted:
      * delta — raw text chunks straight from the model (the capsule
                regex-extracts the partial `compose` value to render
                token-by-token).
      * done  — the parsed DomPlanResult after the stream closes.

    Any failure mid-stream emits an `error` event and ends. The
    underlying provider must support Anthropic's streaming API
    (engine._client.messages.stream); the Groq and Gemini adapters
    don't expose it, so this route is best-effort: callers that hit
    those providers will get an error event and should fall back to
    the non-streaming /dom_plan.
    """
    ctx = await _contexts.get(req.context_id)
    if ctx is None:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail={"error": "context_expired"},
        )
    assert isinstance(ctx, ContextPackage)

    # Sprint 4 — domain gate (mirror of /composer/dom_plan). The
    # streaming path can't short-circuit before opening the stream
    # without breaking the SSE contract the cápsula expects, so we
    # collect the policy here and apply it inside event_stream after
    # the model finishes.
    settings = await settings_store.get()
    domain_policy = _domain_policy_for(settings, ctx.url)
    domain_blocked = not domain_policy.allowed

    engine = _get_engine()
    choice = gateway.select("default")
    model_id = choice.model_id

    messages = await _build_user_messages(ctx, req.user_input, engine)

    async def event_stream():
        raw_text = ""
        started = time.perf_counter()
        in_tokens = 0
        out_tokens = 0
        try:
            async with engine._client.messages.stream(
                model=model_id,
                max_tokens=2000,
                temperature=0.1,
                system=_DOM_PLAN_SYSTEM_PROMPT,
                messages=messages,
            ) as stream:
                async for text in stream.text_stream:
                    raw_text += text
                    payload = json.dumps({"text": text})
                    yield f"event: delta\ndata: {payload}\n\n"
                final = await stream.get_final_message()
                in_tokens = final.usage.input_tokens
                out_tokens = final.usage.output_tokens
        except Exception as exc:  # noqa: BLE001
            gateway.record(GatewayCall(
                role="default", model_id=model_id, provider=engine._provider_name,
                succeeded=False, error_kind=type(exc).__name__,
            ))
            err_payload = json.dumps({
                "error": str(exc),
                "kind": type(exc).__name__,
            })
            yield f"event: error\ndata: {err_payload}\n\n"
            return

        gateway.record(GatewayCall(
            role="default", model_id=model_id, provider=engine._provider_name,
            input_tokens=in_tokens, output_tokens=out_tokens,
        ))

        latency_ms = int((time.perf_counter() - started) * 1000)
        cleaned = _strip_json_fence(raw_text)
        try:
            parsed = json.loads(cleaned)
        except json.JSONDecodeError:
            parsed = {}

        raw_actions = parsed.get("actions") if isinstance(parsed, dict) else None
        raw_compose = parsed.get("compose") if isinstance(parsed, dict) else None
        reason = parsed.get("reason") if isinstance(parsed, dict) else None

        actions_validated: list[DomAction] = []
        if isinstance(raw_actions, list):
            try:
                actions_validated = _DOM_ACTION_ADAPTER.validate_python(raw_actions)
            except ValidationError:
                for a in raw_actions:
                    try:
                        v = _DOM_ACTION_ADAPTER.validate_python([a])[0]
                        actions_validated.append(v)
                    except ValidationError:
                        continue

        # Sprint 4 — apply policy gates after parse, before yield.
        # Mirror of /composer/dom_plan logic.
        policy_reason: Optional[str] = None
        if domain_blocked and actions_validated:
            host = _hostname_of(ctx.url) or "this domain"
            policy_reason = f"domain '{host}' is disallowed by Composer policy"
            logger.info(
                "composer.policy.domain_blocked host=%s dropped_actions=%d (stream)",
                host, len(actions_validated),
            )
            actions_validated = []
        elif actions_validated:
            actions_validated, dropped = _filter_actions_by_policy(
                actions_validated, settings,
            )
            if dropped:
                uniq = sorted(set(dropped))
                policy_reason = (
                    f"action type(s) not permitted by policy: {', '.join(uniq)}"
                )
                logger.info(
                    "composer.policy.action_filtered dropped=%s remaining=%d (stream)",
                    uniq, len(actions_validated),
                )
        actions_data: list[dict] = [a.model_dump() for a in actions_validated]

        compose: Optional[str] = None
        if not actions_data and isinstance(raw_compose, str) and raw_compose.strip():
            compose = raw_compose.strip()
        if policy_reason and not reason:
            reason = policy_reason

        result_payload = json.dumps({
            "actions": actions_data,
            "compose": compose,
            "reason": reason if isinstance(reason, str) else None,
            "model_used": model_id,
            "latency_ms": latency_ms,
            "context_id": str(req.context_id),
        })
        logger.info(
            "composer.dom_plan_stream model=%s latency_ms=%d actions=%d compose=%s",
            model_id, latency_ms, len(actions_data),
            "yes" if compose else "no",
        )
        yield f"event: done\ndata: {result_payload}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            # Defensive headers for proxies that buffer SSE by default.
            # Without X-Accel-Buffering, nginx/CloudFront/Cloudflare
            # will hold the stream until it ends and the user sees no
            # token-by-token effect.
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
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


# ── Governance Lock (Sprint 4) — settings routes ───────────────────────────
#
# /composer/settings — single document store. The Control Center always
# PUTs the full ComposerSettings payload (no PATCH) because the document
# is small and round-tripping it sidesteps three-way-merge headaches.
# The cápsula GETs at mount and applies the screenshot_default + the
# execution_reporting_required flag.

@router.get("/settings", response_model=ComposerSettings)
async def get_composer_settings() -> ComposerSettings:
    """Read the current governance contract."""
    return await settings_store.get()


@router.put("/settings", response_model=ComposerSettings)
async def put_composer_settings(req: ComposerSettings) -> ComposerSettings:
    """Replace the governance contract. updated_at is overwritten.
    The previous document is snapshotted automatically so the operator
    can roll back via /composer/settings/restore — see Sprint 8 close."""
    saved = await settings_store.replace(req)
    return saved


@router.get("/settings/snapshots")
async def list_settings_snapshots():
    """Sprint 8 close — list rollback snapshots written before each PUT.
    Newest first; capped at MAX_SNAPSHOTS by the store."""
    return {"snapshots": await settings_store.list_snapshots()}


@router.post("/settings/restore")
async def restore_settings_snapshot(req: dict):
    """Sprint 8 close — restore a snapshot by its file name. The current
    document is itself snapshotted first, so the restore is reversible
    via another /settings/restore against the new snapshot. Operator
    sees a typed envelope when the file is missing or the name escapes
    the snapshot dir."""
    file_name = req.get("file") if isinstance(req, dict) else None
    if not isinstance(file_name, str) or not file_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "missing_file",
                "reason": "ValueError",
                "message": "POST body must include {'file': '<snapshot-filename>'}",
            },
        )
    try:
        restored = await settings_store.restore(file_name)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "snapshot_not_found",
                "reason": "FileNotFoundError",
                "message": str(exc),
            },
        )
    except ValueError as exc:
        # Snapshot file exists but is corrupt or schema-mismatched.
        # The store quarantined it; operator gets 422 with the cause.
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": "snapshot_corrupt",
                "reason": "ValueError",
                "message": str(exc),
            },
        )
    return restored


# ── Execution Contract (Sprint 3) ──────────────────────────────────────────
#
# After the cápsula runs the planner's actions on the live page, it
# reports the outcome back here. We record one ledger row per call with
# route="composer:execution" so the Control Center can show the full
# lifecycle (context → plan → approval → execution → result) without a
# second store. The cápsula is authoritative on what actually ran on the
# page — the backend just records.

@router.post("/execution", response_model=ExecutionReportResponse)
async def report_execution(req: ExecutionReportRequest) -> ExecutionReportResponse:
    """Stage 5 — record the outcome of executeDomActions on the live page."""
    run_id = uuid4()
    ledger_event = await _record_execution(run_id, req)
    logger.info(
        "composer.execution.recorded run_id=%s status=%s actions=%d url=%s",
        run_id, req.status, len(req.results), req.url or "—",
    )
    return ExecutionReportResponse(
        run_id=run_id,
        ledger_event_id=ledger_event,
    )


async def _record_execution(
    run_id: UUID,
    req: ExecutionReportRequest,
) -> Optional[str]:
    """Append one execution row to runs.json with route='composer:execution'.

    Layout intentional so the existing LedgerPage renders without a new
    schema:
      * tool_calls — one entry per executed action (name=type, ok,
        selector, error). The Ledger table already shows tool_calls
        count, so the action count surfaces for free.
      * answer — JSON summary (URL, title, danger gate, full action+result
        list) so the Run detail panel can render the full story.
      * context — one-line header (status / url / context_id / plan_id)
        for the table preview.
      * refused — true on user rejection.
      * terminated_early + termination_reason — true when execution
        failed or any action failed.
    """
    failures = sum(1 for r in req.results if not r.ok)
    refused = req.status == "rejected"
    terminated = req.status == "failed" or (req.status == "executed" and failures > 0)
    termination_reason: Optional[str] = None
    if req.status == "failed":
        termination_reason = req.error or "execution_failed"
    elif req.status == "executed" and failures > 0:
        termination_reason = f"{failures}/{len(req.results)} action(s) failed"
    elif req.status == "rejected":
        termination_reason = "user_rejected"

    tool_calls: list[dict] = []
    for ar in req.results:
        action_dict = ar.action.model_dump()
        tool_calls.append({
            "name": action_dict.get("type", "unknown"),
            "ok": ar.ok,
            "selector": action_dict.get("selector"),
            "error": ar.error,
            "danger": ar.danger,
        })

    summary = {
        "status": req.status,
        "url": req.url,
        "page_title": req.page_title,
        "model_used": req.model_used,
        "plan_latency_ms": req.plan_latency_ms,
        "has_danger": req.has_danger,
        "danger_acknowledged": req.danger_acknowledged,
        "sequence_danger_reason": req.sequence_danger_reason,
        "user_input": req.user_input,
        "actions": [r.action.model_dump() for r in req.results],
        "results": [
            {
                "ok": r.ok,
                "error": r.error,
                "danger": r.danger,
                "danger_reason": r.danger_reason,
            }
            for r in req.results
        ],
    }

    question = (
        req.user_input
        or f"composer:execution {req.status} on {req.url or 'unknown page'}"
    )
    context_parts: list[str] = [f"status={req.status}"]
    if req.url:
        context_parts.append(f"url={req.url}")
    if req.context_id:
        context_parts.append(f"context_id={req.context_id}")
    if req.plan_id:
        context_parts.append(f"plan_id={req.plan_id}")
    if req.has_danger:
        context_parts.append(
            f"danger={'acknowledged' if req.danger_acknowledged else 'unacknowledged'}"
        )

    try:
        record = RunRecord(
            id=str(run_id),
            route="composer:execution",
            question=question,
            context=" ".join(context_parts),
            answer=json.dumps(summary, ensure_ascii=False, indent=2),
            refused=refused,
            confidence=None,
            judge_reasoning=req.error or req.sequence_danger_reason,
            tool_calls=tool_calls,
            iterations=None,
            processing_time_ms=req.plan_latency_ms or 0,
            terminated_early=terminated,
            termination_reason=termination_reason,
        )
        await run_store.record(record)
        return str(run_id)
    except Exception:  # noqa: BLE001
        logger.exception("composer.execution.record_failed")
        return None


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


async def _compose_memory_block(ctx: ContextPackage, user_input: str) -> str:
    """Sprint 7 — context recovery. Pull the top-N similar memory
    records for the current request and format them into a compact
    block the model treats as authoritative prior. Failures here
    degrade silently: a missing memory store must not block the
    composer flow."""
    try:
        from memory_records import memory_records_store
        # Compose query: user input + selection prefix (the "what is the
        # user pointing at" handle). Both inform similarity.
        query_parts = [user_input]
        if ctx.selection:
            query_parts.append(ctx.selection[:200])
        query = " ".join(query_parts).strip()
        if not query:
            return ""
        # Project hint travels in metadata.project_id — set by the
        # cápsula or the operator's tool call. None falls through to
        # global user-scoped recovery.
        project_id = None
        if ctx.metadata:
            pid = ctx.metadata.get("project_id")
            if isinstance(pid, str) and pid:
                project_id = pid
        matches = await memory_records_store.find_relevant(
            query=query, project_id=project_id, max_results=5,
        )
        if not matches:
            return ""
        lines = ["memory (prior context — authoritative when canon):"]
        for m in matches:
            tag = f"[{m.kind}/{m.scope}]"
            head = f"  · {tag} {m.topic}"
            if m.times_seen > 1:
                head += f"  ×{m.times_seen}"
            lines.append(head)
            if m.body:
                lines.append(f"    {m.body[:400]}")
        return "\n".join(lines)
    except Exception:  # noqa: BLE001
        # Never break the composer flow over a memory store hiccup.
        logger.exception("composer.memory_block.failed")
        return ""


def _compose_context_blob(ctx: ContextPackage, memory_block: str = "") -> str:
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
    if memory_block:
        lines.append("---")
        lines.append(memory_block)
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
