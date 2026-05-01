"""
Signal — FastAPI Server
HTTP interface for the Signal sovereign AI workspace.

Endpoints:
  POST /ask, /route, /route/stream  — triad+judge / auto-router
  POST /dev, /dev/stream            — agent loop (tool-use)
  POST /crew/stream                 — multi-agent crew
  GET  /runs, /runs/stats, /runs/{id}
  GET  /memory/stats, /memory/failures
  POST /memory/clear
  GET  /spine — POST /spine
  GET  /health, /diagnostics
"""

from __future__ import annotations

import asyncio as _asyncio
import json as _json
import logging
import os
import sys
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from fastapi import FastAPI, File, Form, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field
from starlette.middleware.base import BaseHTTPMiddleware

from auth import APIKeyAuthMiddleware
from log_redaction import install_redaction
from rate_limit import RateLimitMiddleware
from security_headers import SecurityHeadersMiddleware

from config import (
    ALLOWED_ORIGIN,
    ALLOWED_ORIGIN_REGEX,
    ALLOWED_ORIGINS,
    ANTHROPIC_API_KEY,
    BODY_SIZE_LIMIT_BYTES,
    FRAME_OPTIONS,
    LOG_REDACT,
    MEMORY_DIR,
    PERSISTENCE_EPHEMERAL,
    RATE_LIMIT_DISABLED,
    RUBERRA_MOCK,
    SECURITY_CSP,
    SECURITY_HSTS,
    SERVER_HOST,
    SERVER_PORT,
    SIGNAL_API_KEY,
    TRUST_PROXY,
    VERCEL_PROJECT_ID,
    VERCEL_TEAM_ID,
    VERCEL_TOKEN,
)
from models import SignalQuery, SignalResponse, SpineSnapshot, RunRecord
from engine import SignalEngine
from memory import failure_memory
from runs import run_store
from spine import spine_store
from tools import TOOL_WORKSPACE_ROOT

# Captured at import time so /diagnostics can report uptime honestly.
_PROCESS_START_MONO = time.monotonic()
_PROCESS_START_ISO = datetime.now(timezone.utc).isoformat()

# ── Logging ─────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("signal.server")

# ── App Lifecycle ───────────────────────────────────────────────────────────

engine: SignalEngine | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize engine on startup, cleanup on shutdown."""
    global engine

    # Wave P-31, Layer 5 — log redaction. Installed first so any
    # subsequent boot logs (engine init, missing-key warnings) are
    # already filtered. Default ON; SIGNAL_LOG_REDACT=0 disables for
    # local debugging of a real false-positive.
    if LOG_REDACT:
        install_redaction(("", "signal", "uvicorn", "uvicorn.error", "uvicorn.access"))

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key and not RUBERRA_MOCK:
        logger.error(
            "═══════════════════════════════════════════════════════════\n"
            "  ANTHROPIC_API_KEY not set!\n"
            "  Export it before starting, or set RUBERRA_MOCK=1 to run\n"
            "  the full pipeline against canned responses.\n"
            "═══════════════════════════════════════════════════════════"
        )
        sys.exit(1)

    engine = SignalEngine()
    memory_label = "EPHEMERAL (volume not configured)" if PERSISTENCE_EPHEMERAL else "PERSISTENT"
    logger.info(
        "═══════════════════════════════════════════════════════════\n"
        "  Signal — sovereign AI workspace\n"
        f"  Listening: http://{SERVER_HOST}:{SERVER_PORT}\n"
        f"  CORS Origins: {', '.join(_cors_origins)}\n"
        f"  CORS Regex: {ALLOWED_ORIGIN_REGEX or '(disabled)'}\n"
        f"  Data Dir: {MEMORY_DIR}\n"
        "  Chambers: Insight · Surface · Terminal · Archive · Core\n"
        "  Doctrine: ACTIVE\n"
        "  Self-Consistency: 3x parallel triad\n"
        "  Judge: IMPLACABLE\n"
        f"  Failure Memory: {memory_label}\n"
        "═══════════════════════════════════════════════════════════"
    )

    if PERSISTENCE_EPHEMERAL and not RUBERRA_MOCK:
        logger.warning(
            "═══════════════════════════════════════════════════════════\n"
            "  PERSISTENCE EPHEMERAL\n"
            "  SIGNAL_DATA_DIR is not set. failure_memory.json, runs.json,\n"
            "  and spine.json will be WIPED on every container restart.\n"
            "  Mount a Railway volume and set SIGNAL_DATA_DIR=/data\n"
            "═══════════════════════════════════════════════════════════"
        )

    yield

    logger.info("Signal backend shutting down.")


# ── FastAPI App ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="Signal",
    description=(
        "Signal — sovereign AI workspace over external models. Five "
        "chambers (Insight · Surface · Terminal · Archive · Core) "
        "sharing one shell and one conservative doctrine: prefer "
        "refusal over the risk of being wrong."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — production origins come from SIGNAL_ORIGIN (comma-separated), with
# localhost dev origins always appended so the backend stays usable locally.
# SIGNAL_ORIGIN_REGEX (default ^https://[a-z0-9-]+\.vercel\.app$) covers every
# Vercel preview/production subdomain without requiring a manual env edit per
# deploy. Either match path admits the request.
_cors_origins = sorted({
    *ALLOWED_ORIGINS,
    "http://localhost:5173",
    "http://localhost:3000",
})
_cors_kwargs: dict = {
    "allow_origins": _cors_origins,
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}
if ALLOWED_ORIGIN_REGEX:
    _cors_kwargs["allow_origin_regex"] = ALLOWED_ORIGIN_REGEX


# ── Wave P-31 · Defense-in-depth security middlewares ──────────────────────
#
# Five opt-in layers, each gated by env so local dev / unsecured deploys
# keep working unchanged. Middlewares are executed *outermost first* on
# the request path; FastAPI's ``add_middleware`` wraps in REVERSE order,
# so to get the desired outer→inner pipeline:
#
#   body cap  →  security headers  →  CORS  →  auth  →  rate limit  →  app
#
# we add them in the OPPOSITE sequence (rate limit first, body cap last).
#
# Why this order:
#   * Body-cap rejects oversize uploads before any work happens.
#   * Security headers stamp every response, including 413/401/429 so
#     even error frames don't drop the baseline.
#   * CORS sits inside body-cap so the preflight still gets the headers
#     but does NOT consume rate-limit tokens for legitimate browsers.
#   * Auth sits inside CORS — preflight (OPTIONS) bypasses auth by spec.
#   * Rate limit is the deepest layer so authenticated callers are
#     bucketed by IP; it skips OPTIONS to avoid penalising preflight.

# Per-route body-size overrides. /visual-diff already enforces a 16 MiB
# cap *during* the multipart stream (see _read_capped). Letting the
# global 1 MiB middleware reject the upload first would break the
# screenshot-diff flow before the operator even sees the upload page.
LARGE_BODY_ROUTES: dict[str, int] = {
    "/visual-diff": 16 * 1024 * 1024,
}


class BodySizeLimitMiddleware(BaseHTTPMiddleware):
    """Reject requests whose ``Content-Length`` exceeds the configured
    cap. Per-route overrides allow specific endpoints (e.g.
    ``/visual-diff``) to accept larger payloads.

    Note: the check is on ``Content-Length`` only — a chunked / no-CL
    upload still reaches the endpoint, where per-endpoint cap-as-you-read
    enforcement (see ``_read_capped``) takes over. The middleware's job
    is the cheap pre-rejection of well-formed oversized requests.
    """

    def __init__(self, app, default_limit: int, overrides: dict[str, int]) -> None:
        super().__init__(app)
        self._default_limit = int(default_limit)
        self._overrides = dict(overrides or {})

    async def dispatch(self, request, call_next):
        cl = request.headers.get("content-length")
        if cl is None:
            return await call_next(request)
        try:
            length = int(cl)
        except ValueError:
            return JSONResponse(
                status_code=400,
                content={
                    "detail": {
                        "error": "invalid_content_length",
                        "reason": "ValueError",
                        "message": "Content-Length header is not an integer.",
                    }
                },
            )
        limit = self._overrides.get(request.url.path, self._default_limit)
        if length > limit:
            return JSONResponse(
                status_code=413,
                content={
                    "detail": {
                        "error": "request_too_large",
                        "reason": "ContentLengthExceeded",
                        "message": (
                            f"Request body of {length} bytes exceeds limit "
                            f"of {limit} bytes for this route."
                        ),
                        "limit": limit,
                    }
                },
            )
        return await call_next(request)


# Add in REVERSE pipeline order so the resulting wrap matches the comment above.
# 1) Innermost: rate limit (last to wrap, runs nearest the app).
app.add_middleware(
    RateLimitMiddleware,
    disabled=RATE_LIMIT_DISABLED,
    trust_proxy=TRUST_PROXY,
)
# 2) Auth gate — reads SIGNAL_API_KEY at install time. Empty key = no-op.
app.add_middleware(APIKeyAuthMiddleware, api_key=SIGNAL_API_KEY)
# 3) CORS — must sit OUTSIDE auth so preflight gets the right headers
#    even when the inner gates would otherwise reject the request.
app.add_middleware(CORSMiddleware, **_cors_kwargs)
# 4) Security headers — stamps every outgoing response, including 4xx/5xx.
app.add_middleware(
    SecurityHeadersMiddleware,
    frame_options=FRAME_OPTIONS,
    csp=SECURITY_CSP,
    hsts=SECURITY_HSTS,
)
# 5) Outermost: body-size cap. Rejects oversize uploads before any
#    other middleware burns CPU on them.
app.add_middleware(
    BodySizeLimitMiddleware,
    default_limit=BODY_SIZE_LIMIT_BYTES,
    overrides=LARGE_BODY_ROUTES,
)


# ── Endpoints ───────────────────────────────────────────────────────────────

def _error_envelope(kind: str, exc: BaseException) -> dict:
    """Typed error body — `{error, reason, message}`. One shape across all endpoints."""
    return {
        "error": kind,
        "reason": type(exc).__name__,
        "message": str(exc),
    }


def _engine_unavailable_envelope() -> dict:
    """Typed body for the pre-call readiness gate — same shape as /health/ready reasons."""
    return {
        "error": "engine_not_initialized",
        "reason": "EngineNotInitialized",
        "message": "Engine not initialized",
    }


def _collect_load_errors() -> list[dict]:
    """Per-store load errors as visible to /health and /diagnostics."""
    out: list[dict] = []
    for name, store_attr in (
        ("spine", spine_store._last_load_error),
        ("runs", run_store._last_load_error),
        ("memory", failure_memory._last_load_error),
    ):
        if store_attr:
            out.append({"store": name, "error": store_attr})
    return out


@app.get("/health")
async def health_check():
    """
    Liveness probe. Always returns 200 as long as the HTTP layer is up —
    Railway / Vercel need a stable yes/no to keep routing traffic, and
    flipping this to 5xx on a degraded engine would trigger a
    crash-restart loop that never resolves.

    The body carries the real signal: engine readiness, run mode
    (mock vs real), and whether any store booted on a quarantined
    sidecar. Callers that need a hard yes/no for degraded state must
    use `/health/ready`.
    """
    return {
        "status": "operational",
        "system": "Signal",
        "doctrine": "active",
        "engine": "ready" if engine else "not_initialized",
        "mode": "mock" if RUBERRA_MOCK else "real",
        "persistence_degraded": bool(_collect_load_errors()),
        "persistence_ephemeral": PERSISTENCE_EPHEMERAL,
    }


@app.get("/health/ready")
async def health_ready():
    """
    Readiness probe. Returns 503 if the system is degraded in any way
    that would make its answers untrustworthy — engine uninitialised,
    running in mock mode, or a store booted on a quarantined file.

    Never flipped to the Railway healthcheck path: `/health` keeps the
    deploy alive; `/health/ready` is the honest yes/no for clients and
    operators.
    """
    load_errors = _collect_load_errors()
    reasons: list[str] = []
    if not engine:
        reasons.append("engine_not_initialized")
    if RUBERRA_MOCK:
        reasons.append("mock_mode")
    if load_errors:
        reasons.append("persistence_degraded")
    if PERSISTENCE_EPHEMERAL:
        reasons.append("persistence_ephemeral")

    body = {
        "ready": not reasons,
        "reasons": reasons,
        "engine": "ready" if engine else "not_initialized",
        "mode": "mock" if RUBERRA_MOCK else "real",
        "load_errors": load_errors,
        "persistence_ephemeral": PERSISTENCE_EPHEMERAL,
    }
    if reasons:
        raise HTTPException(status_code=503, detail=body)
    return body


@app.post("/ask", response_model=SignalResponse)
async def ask_ruberra(query: SignalQuery):
    """
    Submit a question to Signal.
    
    The system will:
    1. Check failure memory for prior failures on similar questions
    2. Fire 3 parallel calls to Claude Sonnet (self-consistency)
    3. Send responses to the implacable Judge
    4. Return answer (high confidence) or refusal (low confidence)
    """
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())

    try:
        response = await engine.process_query(query)
        return response
    except Exception as e:
        logger.error(f"Engine error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=_error_envelope("engine_error", e))


@app.post("/dev")
async def ask_ruberra_dev(query: SignalQuery):
    """
    Force the agent (tool-use) pipeline.

    Skips the triad/judge and runs an agentic loop where Claude may call
    ``read_file``, ``git``, ``run_command``, ``web_search`` and friends. The
    response includes the final answer plus the full tool-call trace.
    """
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())
    try:
        agent_response = await engine.process_dev_query(query)
        return agent_response.to_dict()
    except Exception as e:
        logger.error(f"Agent error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=_error_envelope("agent_error", e))


@app.post("/route/stream")
async def ask_ruberra_auto_stream(query: SignalQuery):
    """
    Streaming variant of ``/route``. Emits the ``route`` decision first, then
    either agent events (``tool_use``, ``tool_result``, ...) or triad events
    (``triad_done``, ``judge_done``, ...) and finally ``done``.
    """
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())

    async def event_source():
        try:
            async for event in engine.process_auto_streaming(query):
                yield f"data: {_json.dumps(event)}\n\n"
        except Exception as e:
            logger.error(f"Route stream error: {e}", exc_info=True)
            yield f"data: {_json.dumps({'type': 'error', **_error_envelope('router_error', e)})}\n\n"

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/dev/stream")
async def ask_ruberra_dev_stream(query: SignalQuery):
    """
    Streaming variant of ``/dev``. Emits one SSE event per agent step:
    ``start``, ``iteration``, ``assistant_text``, ``tool_use``, ``tool_result``,
    ``done`` (final). The run is recorded once ``done`` fires.
    """
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())

    async def event_source():
        try:
            async for event in engine.process_dev_query_streaming(query):
                yield f"data: {_json.dumps(event)}\n\n"
        except Exception as e:
            logger.error(f"Agent stream error: {e}", exc_info=True)
            yield f"data: {_json.dumps({'type': 'error', **_error_envelope('agent_error', e)})}\n\n"

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/crew/stream")
async def ask_ruberra_crew_stream(query: SignalQuery):
    """
    Streaming multi-agent pipeline: planner → (researcher) → coder → critic,
    with one automatic refinement round if the critic rejects.

    Emits ``crew_start``, ``plan``, ``role_start`` / ``role_event`` /
    ``role_done`` per specialist, ``critic_verdict`` and finally ``done``.
    """
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())

    async def event_source():
        try:
            async for event in engine.process_crew_query_streaming(query):
                yield f"data: {_json.dumps(event)}\n\n"
        except Exception as e:
            logger.error(f"Crew stream error: {e}", exc_info=True)
            yield f"data: {_json.dumps({'type': 'error', **_error_envelope('crew_error', e)})}\n\n"

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/route")
async def ask_ruberra_auto(query: SignalQuery):
    """
    Auto-router: dev-intent questions go through the agent loop; the rest
    go through the triad + judge. Response shape is ``{route, result}``.
    """
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())
    try:
        return await engine.process_auto(query)
    except Exception as e:
        logger.error(f"Router error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=_error_envelope("router_error", e))



class BatchQuery(BaseModel):
    """Multiple questions in one request."""
    questions: list[SignalQuery] = Field(..., max_length=5)


@app.post("/ask/batch")
async def ask_ruberra_batch(batch: BatchQuery):
    """Submit up to 5 questions in batch."""
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())

    import asyncio
    results = await asyncio.gather(
        *[engine.process_query(q) for q in batch.questions],
        return_exceptions=True,
    )

    responses = []
    for r in results:
        if isinstance(r, Exception):
            responses.append(_error_envelope("engine_error", r))
        else:
            responses.append(r.model_dump())

    return {"results": responses}


# ── Insight · Validate (Wave 6c) ────────────────────────────────────────────
#
# On-demand triad+judge over the conversation accumulated in Insight.
# Wave 6c moved Insight's default dispatch to the agent loop (research lab
# mode), which means the doctrine #1 stops governing every conversational
# turn. This endpoint puts triad+judge back on the table when the user
# wants explicit validation of where the conversation has landed —
# triggered by a button in the chamber, not automatically.
#
# Input: mission_id + optional inline notes/principles (same race-defence
#        contract as /insight/distill/stream).
# Output: SSE stream identical to /route/stream's triad path (triad_start,
#         triad_done×N, judge_start, judge_done with confidence +
#         nearest_answerable_question, done).


class ValidateRequest(BaseModel):
    mission_id: str = Field(..., min_length=1, max_length=128)
    # Same inline override pattern as DistillRequest. When omitted, the
    # endpoint reads from the spine snapshot.
    notes: Optional[list[DistillNoteInline]] = None
    principles: Optional[list[str]] = None


def _summarise_conversation(notes_list: list, principles_list: list[str]) -> str:
    """Build the question fed into triad+judge from the conversation
    accumulated so far. The summary is plain text — the existing
    triad pipeline expects a single ``question`` string.

    Note ordering: spine stores notes newest-first. We slice the
    newest 30 then reverse so the summary reads chronologically.
    """
    lines: list[str] = ["Validar a direcção apurada na conversa abaixo."]
    if principles_list:
        lines.append("")
        lines.append("Princípios em vigor:")
        for p in principles_list:
            lines.append(f"- {p}")
    lines.append("")
    lines.append("Conversa (mais antigas → mais recentes):")
    if not notes_list:
        lines.append("(missão sem notas — pedir refinamento)")
    else:
        recent = list(reversed(notes_list[:30]))
        for n in recent:
            role = getattr(n, "role", None) or "user"
            text = getattr(n, "text", "")
            lines.append(f"[{role}] {text}")
    lines.append("")
    lines.append(
        "Avalia se a direcção está sólida o suficiente para avançar para "
        "Surface/Terminal. Recusa se faltar evidência, contradições, ou "
        "ambiguidade material."
    )
    return "\n".join(lines)


@app.post("/insight/validate/stream")
async def insight_validate_stream(req: ValidateRequest):
    """Wave 6c — on-demand triad+judge validation of the Insight
    conversation. Returns the same envelope as /route/stream's triad
    path so the frontend's openStream consumer reuses the existing
    plumbing. Refusal carries `nearest_answerable_question` (Wave 6a
    Tier-1 Addition #2) so the chamber can offer a sharper reformulate.
    """
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())
    from models import NoteRecord

    snapshot = await spine_store.get()
    mission = next((m for m in snapshot.missions if m.id == req.mission_id), None)
    if mission is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "mission_not_found",
                "reason": "KeyError",
                "message": f"mission {req.mission_id} not found in spine",
            },
        )

    if req.notes is not None:
        inline_notes = [
            NoteRecord(
                id=f"inline-{idx}",
                text=n.text,
                createdAt=n.createdAt or int(time.time() * 1000),
                role=n.role,
            )
            for idx, n in enumerate(req.notes)
        ]
    else:
        inline_notes = list(mission.notes)

    principle_texts = (
        list(req.principles)
        if req.principles is not None
        else [p.text for p in snapshot.principles]
    )

    question = _summarise_conversation(inline_notes, principle_texts)
    triad_query = SignalQuery(
        question=question,
        mission_id=mission.id,
        principles=principle_texts or None,
    )

    async def event_source():
        try:
            async for event in engine.process_query_streaming(triad_query):
                yield f"data: {_json.dumps(event)}\n\n"
        except Exception as e:
            logger.error(f"Validate stream error: {e}", exc_info=True)
            yield f"data: {_json.dumps({'type': 'error', **_error_envelope('validate_error', e)})}\n\n"

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


# ── Insight · Distill (Wave 6a) ─────────────────────────────────────────────


class DistillNoteInline(BaseModel):
    """Inline note carried in the distill request body — defends against
    the spine-debounce race where the user edits a note and immediately
    asks to distill, before the snapshot has been pushed to disk."""
    text: str
    role: Optional[str] = None
    createdAt: Optional[int] = None


class DistillExistingInline(BaseModel):
    """Inline existing-distillation summary carried in the distill request.
    Only the fields the server needs for versioning — version + status —
    so version increment computes from the freshest client-side view
    instead of the persisted snapshot. Avoids the same debounce race
    when the user clicks 'refinar' twice in quick succession."""
    version: int
    status: Optional[str] = None


class DistillRequest(BaseModel):
    mission_id: str = Field(..., min_length=1, max_length=128)
    # Wave 6a — optional inline overrides of mission state. When sent,
    # the backend uses these instead of the persisted snapshot — avoids
    # the 500ms debounce race where the user types and immediately
    # distills. All fields are optional; omitted fields fall back to
    # the snapshot (back-compat with any external caller).
    notes: Optional[list[DistillNoteInline]] = None
    principles: Optional[list[str]] = None
    # Wave 6a Codex P1 follow-up — inline existing distillations so
    # version increment also avoids the snapshot race. Two quick
    # "refinar" clicks would otherwise both compute the same next
    # version from a stale snapshot, producing duplicates.
    existing_distillations: Optional[list[DistillExistingInline]] = None


@app.post("/insight/distill/stream")
async def insight_distill_stream(req: DistillRequest):
    """Wave 6a — generate a Truth Distillation for the active mission.

    Reads mission + principles from the spine store by default, but the
    client can send inline notes/principles in the request body to
    override — this defends against the debounced spine-push race so
    the user always distills against the latest content they typed.
    ProjectContract v0 is auto-derived inside the chamber handler.
    Mock-fallback under env flags so smoke path works without a key.
    """
    from chambers.insight import process_distillation_streaming
    from models import NoteRecord

    snapshot = await spine_store.get()
    mission = next((m for m in snapshot.missions if m.id == req.mission_id), None)
    if mission is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "mission_not_found",
                "reason": "KeyError",
                "message": f"mission {req.mission_id} not found in spine",
            },
        )

    # Inline override path — apply the request's notes / principles on
    # top of the snapshot mission. We mutate a *copy* (model_copy) so
    # the persisted snapshot stays untouched; the chamber handler reads
    # the merged view as the authoritative input for this run.
    if req.notes is not None:
        inline_notes = [
            NoteRecord(
                id=f"inline-{idx}",
                text=n.text,
                createdAt=n.createdAt or int(time.time() * 1000),
                role=n.role,
            )
            for idx, n in enumerate(req.notes)
        ]
        mission = mission.model_copy(update={"notes": inline_notes})

    # Inline existing distillations override — for the version helper.
    # Only version + status are needed; the helper looks at .version.
    # We construct minimal stub records (TruthDistillationRecord is
    # picky about required fields; we feed safe defaults).
    if req.existing_distillations is not None:
        from models import TruthDistillationRecord
        stubs = [
            TruthDistillationRecord(
                id=f"inline-stub-{idx}",
                version=int(d.version),
                status=d.status or "draft",
                sourceMissionId=mission.id,
                summary="",
                validatedDirection="",
                confidence="medium",
                createdAt=0,
                updatedAt=0,
            )
            for idx, d in enumerate(req.existing_distillations)
        ]
        mission = mission.model_copy(update={"truthDistillations": stubs})

    principle_texts = (
        list(req.principles)
        if req.principles is not None
        else [p.text for p in snapshot.principles]
    )

    async def event_source():
        try:
            async for event in process_distillation_streaming(mission, principle_texts):
                yield f"data: {_json.dumps(event)}\n\n"
                # Telemetry — Wave 6a Tier-1 Addition #3.
                # Record the generation event when a `done` frame fires so the
                # Archive ledger has visibility on distillation throughput.
                if event.get("type") == "done":
                    try:
                        await run_store.record(RunRecord(
                            route="distill",
                            mission_id=mission.id,
                            question=f"distill: {mission.title}",
                            context=None,
                            answer=event.get("distillation", {}).get("summary"),
                            processing_time_ms=event.get("processing_time_ms", 0),
                            input_tokens=event.get("input_tokens", 0),
                            output_tokens=event.get("output_tokens", 0),
                            terminated_early=bool(event.get("mock")),
                            termination_reason=(
                                "insight_mock" if event.get("mock") else None
                            ),
                        ))
                    except Exception as log_err:  # noqa: BLE001
                        logger.warning("distill run_store record failed: %s", log_err)
        except Exception as e:
            logger.error(f"Distill stream error: {e}", exc_info=True)
            yield f"data: {_json.dumps({'type': 'error', **_error_envelope('distill_error', e)})}\n\n"

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


# ── Telemetry (Wave 6a) ─────────────────────────────────────────────────────


class TelemetryEvent(BaseModel):
    """Lightweight client-fired telemetry event. Lands in the run log
    under a dedicated `route` so the Archive ledger can filter without
    a new store. Wave 6a minimum — the 4 consumer-side events that the
    backend cannot observe by itself."""
    event: str = Field(..., min_length=1, max_length=64)
    mission_id: Optional[str] = Field(None, max_length=128)
    payload: dict[str, Any] = Field(default_factory=dict)


@app.post("/telemetry/event")
async def telemetry_event(ev: TelemetryEvent):
    """Wave 6a Tier-1 Addition #3 — client-side event capture.

    Used for events the backend doesn't fire itself: distillation
    accepted (user clicked accept), surface_seed_consumed (Surface
    saw the seed and the user kept/edited/ignored), terminal_seed_consumed
    (same for Terminal), intent_switch_guard_fired (when implemented).
    """
    try:
        await run_store.record(RunRecord(
            route=f"telemetry:{ev.event}",
            mission_id=ev.mission_id,
            question=ev.event,
            context=None,
            answer=_json.dumps(ev.payload) if ev.payload else None,
            processing_time_ms=0,
            input_tokens=0,
            output_tokens=0,
            terminated_early=False,
            termination_reason=None,
        ))
        return {"ok": True}
    except Exception as e:  # noqa: BLE001
        logger.warning("telemetry record failed: %s", e)
        # Telemetry failures must never break the chamber. Return ok=false
        # so client can log locally if it cares; never surface as an error.
        return {"ok": False, "reason": str(e)}


# ── Issue draft endpoint (Wave N integration) ─────────────────────────────


class IssueDraftRequest(BaseModel):
    """Provider-agnostic draft. The chamber assembles this; the
    operator confirms; the orchestration layer (or the Claude Code
    session) calls the actual MCP/REST create. Backend just formats
    the kwargs."""
    title: str = Field(..., min_length=1, max_length=200)
    body: str = Field(..., max_length=8000)
    kind: str = Field("bug")          # bug|polish|feature|regression|design|perf
    severity: str = Field("medium")   # low|medium|high
    chamber: Optional[str] = None
    mission_id: Optional[str] = None
    artifact_ref: Optional[str] = None
    selector: Optional[str] = None
    screenshot_url: Optional[str] = None
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    labels: list[str] = Field(default_factory=list)
    provider: str = Field("github")   # github|linear|jira


@app.post("/issues/draft")
async def issues_draft(req: IssueDraftRequest):
    """Wave N — formats an IssueDraft for the requested provider.
    Returns the kwargs dict that the orchestration layer will pass
    to the actual create_issue MCP/REST call."""
    from issue_tracker import IssueDraft, format_for_github, format_for_linear
    valid_kinds = {"bug", "polish", "feature", "regression", "design", "perf"}
    valid_severity = {"low", "medium", "high"}
    if req.kind not in valid_kinds:
        raise HTTPException(status_code=422, detail=_error_envelope(
            "issue_draft_invalid_kind", ValueError(f"kind={req.kind!r} not in {valid_kinds}")
        ))
    if req.severity not in valid_severity:
        raise HTTPException(status_code=422, detail=_error_envelope(
            "issue_draft_invalid_severity", ValueError(f"severity={req.severity!r} not in {valid_severity}")
        ))
    draft = IssueDraft(
        title=req.title, body=req.body,
        kind=req.kind, severity=req.severity,  # type: ignore[arg-type]
        chamber=req.chamber, mission_id=req.mission_id,
        artifact_ref=req.artifact_ref, selector=req.selector,
        screenshot_url=req.screenshot_url, file_path=req.file_path,
        line_number=req.line_number, labels=list(req.labels or []),
    )
    if req.provider == "linear":
        return {"provider": "linear", "kwargs": format_for_linear(draft)}
    if req.provider == "github":
        return {"provider": "github", "kwargs": format_for_github(draft)}
    raise HTTPException(status_code=422, detail=_error_envelope(
        "issue_draft_invalid_provider", ValueError(f"provider={req.provider!r} not in [github, linear]")
    ))


@app.post("/issues/create")
async def issues_create(req: IssueDraftRequest):
    """Wave P-23 — actually create the GitHub issue via REST.

    When `SIGNAL_GITHUB_TOKEN` (`RUBERRA_GITHUB_TOKEN`) and
    `SIGNAL_GITHUB_REPO` are both set in the environment, this posts
    to GitHub and returns `{ok, number, url}`. When either is unset,
    we return `{ok: false, reason: "github_not_configured", draft: ...}`
    with HTTP 200 so the chamber can render a copy-paste fallback
    body instead of surfacing a 500 to the operator.

    Validation mirrors /issues/draft (kind/severity/provider).
    """
    import config as _config
    import observability
    from issue_tracker import IssueDraft, create_github_issue, format_for_github

    valid_kinds = {"bug", "polish", "feature", "regression", "design", "perf"}
    valid_severity = {"low", "medium", "high"}
    if req.kind not in valid_kinds:
        raise HTTPException(status_code=422, detail=_error_envelope(
            "issue_create_invalid_kind", ValueError(f"kind={req.kind!r} not in {valid_kinds}")
        ))
    if req.severity not in valid_severity:
        raise HTTPException(status_code=422, detail=_error_envelope(
            "issue_create_invalid_severity", ValueError(f"severity={req.severity!r} not in {valid_severity}")
        ))
    if req.provider != "github":
        # P-23 v1 only writes to GitHub. Linear/Jira REST clients land later;
        # for now, refuse other providers loudly so the chamber doesn't
        # silently drop the issue.
        raise HTTPException(status_code=422, detail=_error_envelope(
            "issue_create_unsupported_provider",
            ValueError(f"provider={req.provider!r} not supported by /issues/create yet (use /issues/draft for formatting)"),
        ))

    draft = IssueDraft(
        title=req.title, body=req.body,
        kind=req.kind, severity=req.severity,  # type: ignore[arg-type]
        chamber=req.chamber, mission_id=req.mission_id,
        artifact_ref=req.artifact_ref, selector=req.selector,
        screenshot_url=req.screenshot_url, file_path=req.file_path,
        line_number=req.line_number, labels=list(req.labels or []),
    )

    async with observability.record_route("/issues/create"):
        token = _config.GITHUB_TOKEN
        repo = _config.GITHUB_REPO
        if not token or not repo:
            # Friendly fallback — chamber renders a copy-paste form.
            # 200 with ok=false is intentional: operator did nothing wrong,
            # the deploy just isn't wired up.
            return {
                "ok": False,
                "reason": "github_not_configured",
                "draft": format_for_github(draft),
            }

        try:
            result = await create_github_issue(draft, token=token, repo=repo)
        except RuntimeError as e:
            # Upstream GitHub error (4xx/5xx). Surface a 502 with the raw
            # message so the operator can see "401 bad credentials" without
            # us having to guess the cause.
            logger.warning("issues/create github error: %s", e)
            raise HTTPException(status_code=502, detail=_error_envelope("github_api_error", e))
        except Exception as e:  # noqa: BLE001
            logger.exception("issues/create unexpected error")
            raise HTTPException(status_code=500, detail=_error_envelope("issue_create_error", e))

    return {
        "ok": True,
        "number": result.get("number"),
        "url": result.get("html_url"),
    }


# ── Figma token import endpoint (Wave M integration) ──────────────────────


class FigmaImportRequest(BaseModel):
    """The operator pastes a Figma file id + the file's REST API JSON
    body. v1 doesn't fetch live (no PAT in backend env yet) — caller
    posts the body directly. v2 will accept (file_id, personal_token)
    and fetch internally."""
    file_id: str = Field(..., min_length=1, max_length=64)
    body: dict[str, Any]
    name: Optional[str] = Field(None, max_length=128)


@app.post("/design/figma/import")
async def design_figma_import(req: FigmaImportRequest):
    """Wave M — parses a Figma file body into a normalised TokenSet
    (colors, spacings, types, radii). Surface can target the result
    as a custom design system."""
    from figma_tokens import tokens_from_figma_json
    ts = tokens_from_figma_json(req.file_id, req.body, name=req.name)
    return ts.to_dict()

# ── Surface · BuildSpec endpoint ────────────────────────────────────────────
#
# Wave J integration. Compiles a SurfacePlan dict into a structured
# BuildSpecification with per-component TSX scaffolds. Terminal can
# pull this and either commit the scaffolds verbatim or feed them
# into the agent loop for refinement. Pure compute, no provider call.


class BuildSpecRequest(BaseModel):
    """SurfacePlan + project context. Plan shape mirrors chambers/surface.py
    SurfacePlan: mode, fidelity, design_system_binding, screens[], components[]."""
    plan: dict[str, Any]
    project_id: str = Field("", max_length=128)
    output_dir: str = Field("src/components", max_length=256)


@app.post("/surface/build-spec")
async def surface_build_spec(req: BuildSpecRequest):
    """Wave J — deterministic SurfacePlan → BuildSpecification compile.

    Returns a JSON-serializable BuildSpecification with components[]
    (each with name, file_path, kind, props, states, acceptance,
    scaffold_tsx) and files_to_create[] for Terminal consumption.
    """
    from spec_to_code import compile_plan_to_spec
    spec = compile_plan_to_spec(
        req.plan,
        project_id=req.project_id or "",
        output_dir=req.output_dir or "src/components",
    )
    return spec.to_dict()


# ── Visual diff endpoint (Wave P-28) ───────────────────────────────────────
#
# Surface Final's "what changed?" surface. Operator uploads two PNGs
# (baseline + candidate); the backend runs the per-pixel diff and
# returns a DiffResult JSON. Pillow is the decoder; if it isn't
# installed we surface a typed 503 instead of crashing — every other
# endpoint stays up.


# Hard cap on per-image upload size — 16 MiB is well above realistic
# screenshot sizes (a 4K PNG is ~5–10 MiB) but small enough that an
# adversarial client can't OOM the worker. Each image is checked
# independently; the diff loop is per-pixel pure-Python so for very
# large pairs the request will get slow well before it gets dangerous.
_VISUAL_DIFF_MAX_BYTES = 16 * 1024 * 1024


async def _read_capped(upload: UploadFile, cap: int) -> bytes:
    """Read an UploadFile into memory with a hard byte cap.

    Streams in 64 KiB chunks and aborts with HTTP 413 the moment the
    accumulated buffer exceeds ``cap``. The previous shape did
    ``await upload.read()`` first and *then* checked ``len(...)``, so
    a malicious 1 GiB upload was already resident in RAM by the time
    we rejected it. Reading-as-we-cap keeps the worker's memory
    bounded by ``cap`` regardless of what the client sends.
    """
    out = bytearray()
    while True:
        chunk = await upload.read(64 * 1024)
        if not chunk:
            break
        out.extend(chunk)
        if len(out) > cap:
            raise HTTPException(status_code=413, detail=_error_envelope(
                "visual_diff_payload_too_large",
                ValueError(f"per-image cap is {cap} bytes"),
            ))
    return bytes(out)


@app.post("/visual-diff")
async def visual_diff_endpoint(
    before: UploadFile = File(..., description="Baseline image (PNG/JPEG)."),
    after: UploadFile = File(..., description="Candidate image (PNG/JPEG)."),
    threshold: float = 0.1,
    selector: Optional[str] = Form(
        default=None,
        description=(
            "Optional CSS selector — populated when the diff was scoped "
            "to a single picked element (Wave P-30). Recorded on the "
            "RunRecord so the Archive can show 'diff over body > main > div'."
        ),
        max_length=512,
    ),
):
    """Wave P-28 — pixel diff between two screenshots.

    Multipart form with `before` + `after` image fields. Returns a
    ``DiffResult`` (see signal-backend/visual_diff.py): one bbox per
    connected component of changed pixels (Wave P-30), the changed-
    pixel ratio, and a rolled-up severity. Pillow is loaded lazily so
    a Pillow-less deploy boots fine — only this endpoint fails with a
    typed 503.

    Wave P-30 also accepts an optional ``selector`` form field. When
    set, the chamber's element-pick → diff flow stamps the selector on
    the resulting RunRecord so the Archive can render
    ``diff over body > main > div`` instead of a bare ``visual_diff``
    blob.
    """
    from visual_diff import DiffUnavailable, compute_diff

    # Cap-as-you-read so the worker can't be OOM'd by a giant upload —
    # the 16 MiB ceiling is enforced *during* the stream, not after.
    before_bytes = await _read_capped(before, _VISUAL_DIFF_MAX_BYTES)
    after_bytes = await _read_capped(after, _VISUAL_DIFF_MAX_BYTES)
    if not before_bytes or not after_bytes:
        raise HTTPException(status_code=422, detail=_error_envelope(
            "visual_diff_empty_image",
            ValueError("both 'before' and 'after' must be non-empty"),
        ))

    try:
        result = await compute_diff(before_bytes, after_bytes, threshold=threshold)
    except DiffUnavailable as exc:
        # Pillow not installed — typed 503 mirrors /health/ready's
        # "degraded" shape so the chamber can show "diff engine
        # unavailable" instead of a generic 500.
        raise HTTPException(status_code=503, detail=_error_envelope(
            "diff_unavailable", exc,
        ))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=_error_envelope(
            "visual_diff_invalid_image", exc,
        ))

    # Telemetry — small payload, mirrors /telemetry/event's pattern so
    # operators can grep `route=visual_diff` in /runs. Wave P-30: when a
    # selector is supplied (element-scoped flow), it lands in
    # ``RunRecord.context`` so the Archive can render
    # ``diff over body > main > div``. The selector is clipped to the
    # context column's 5000-char cap defensively even though the form
    # field already enforces 512.
    selector_clean = (selector or "").strip()
    context_str: Optional[str] = None
    if selector_clean:
        context_str = f"selector={selector_clean[:480]}"
    try:
        await run_store.record(RunRecord(
            route="visual_diff",
            mission_id=None,
            question=f"diff:{len(before_bytes)}+{len(after_bytes)}",
            context=context_str,
            answer=_json.dumps({
                "ratio": result.ratio,
                "changed": result.changed_pixels,
                "total": result.total_pixels,
                "severity": result.severity,
                "regions": len(result.regions),
                "selector": selector_clean or None,
            }),
            processing_time_ms=0,
            input_tokens=0,
            output_tokens=0,
            terminated_early=False,
            termination_reason=None,
        ))
    except Exception as log_err:  # noqa: BLE001
        logger.warning("visual_diff run_store record failed: %s", log_err)

    return result.to_dict()


# ── Memory Endpoints ────────────────────────────────────────────────────────

@app.get("/memory/stats")
async def memory_stats():
    """Get failure memory statistics."""
    stats = await failure_memory.get_stats()
    return stats


@app.get("/memory/failures")
async def list_failures(limit: int = 20):
    """List recent failure records."""
    await failure_memory._ensure_loaded()
    records = failure_memory._memory.records[-limit:]
    return {
        "count": len(records),
        "records": [r.model_dump() for r in records],
    }


class ClearConfirmation(BaseModel):
    confirm: bool = Field(..., description="Must be true to clear memory")


@app.post("/memory/clear")
async def clear_memory(confirmation: ClearConfirmation):
    """Clear all failure memory. Requires explicit confirmation."""
    if not confirmation.confirm:
        return {"cleared": False, "message": "Confirmation required (confirm=true)"}
    
    async with failure_memory._lock:
        from models import FailureMemory
        failure_memory._memory = FailureMemory()
        await failure_memory._save_to_disk()
    
    return {"cleared": True, "message": "Failure memory cleared"}


# ── Runs Endpoints ──────────────────────────────────────────────────────────

@app.get("/runs")
async def list_runs(mission_id: str | None = None, limit: int = 50):
    """List recent runs, optionally filtered by mission_id."""
    records = await run_store.list(mission_id=mission_id, limit=limit)
    return {
        "count": len(records),
        "mission_id": mission_id,
        "records": [r.model_dump() for r in records],
    }


@app.get("/runs/stats")
async def runs_stats(mission_id: str | None = None):
    """Aggregate stats, optionally filtered by mission_id."""
    return await run_store.stats(mission_id=mission_id)


@app.get("/runs/{run_id}")
async def get_run(run_id: str):
    """Fetch a single run record by id."""
    record = await run_store.get(run_id)
    if not record:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "run_not_found",
                "reason": "KeyError",
                "message": f"run {run_id} not found",
            },
        )
    return record.model_dump()


# ── Spine (Workspace) Endpoints ─────────────────────────────────────────────

@app.get("/spine", response_model=SpineSnapshot)
async def get_spine():
    """Return the full mission workspace snapshot."""
    return await spine_store.get()


@app.post("/spine", response_model=SpineSnapshot)
async def put_spine(snapshot: SpineSnapshot):
    """Replace the full mission workspace snapshot. Full-state sync."""
    try:
        return await spine_store.put(snapshot)
    except OSError as e:
        # Disk full, permission denied, read-only volume, missing mount…
        # Never claim the spine was saved when the filesystem said no.
        logger.error("Spine persist failed: %s", e, exc_info=True)
        raise HTTPException(
            status_code=503,
            detail=_error_envelope("spine_persist_failed", e),
        )


# ── Git Status Endpoint ─────────────────────────────────────────────────────
#
# Frontend composer reads repo + branch live instead of relying on
# build-time env vars (VITE_SIGNAL_REPO / VITE_SIGNAL_BRANCH). The
# endpoint is a thin wrapper around the same `git --no-pager` invocation
# the GitTool uses, scoped to TOOL_WORKSPACE_ROOT. Read-only by design:
# only `rev-parse`, `symbolic-ref`, `status --porcelain`, `rev-list`. No
# subcommand args from the request body — there is no body. If the
# workspace is not a git repo (or git is missing), the endpoint returns
# a populated envelope with `repo: null`, `branch: null`, `error` set.
# The shell renders that as "REPO unavailable / BRANCH unavailable" —
# same legacy behaviour, but now driven by reality not a missing env var.

async def _git(args: list[str]) -> tuple[int, str, str]:
    """Run `git --no-pager <args>` inside TOOL_WORKSPACE_ROOT. Returns
    (exit_code, stdout, stderr)."""
    proc = await _asyncio.create_subprocess_exec(
        "git", "--no-pager", *args,
        stdout=_asyncio.subprocess.PIPE,
        stderr=_asyncio.subprocess.PIPE,
        cwd=str(TOOL_WORKSPACE_ROOT),
    )
    out, err = await proc.communicate()
    return (
        proc.returncode if proc.returncode is not None else -1,
        out.decode(errors="replace").strip(),
        err.decode(errors="replace").strip(),
    )


@app.get("/git/status")
async def git_status():
    """Live repo/branch state for the workspace. Read-only."""
    try:
        rc, _, _ = await _git(["rev-parse", "--is-inside-work-tree"])
    except FileNotFoundError as exc:
        return {
            "repo": None,
            "branch": None,
            "head": None,
            "dirty": False,
            "ahead": 0,
            "behind": 0,
            "error": "git_not_installed",
            "message": str(exc),
        }
    if rc != 0:
        return {
            "repo": None,
            "branch": None,
            "head": None,
            "dirty": False,
            "ahead": 0,
            "behind": 0,
            "error": "not_a_repository",
            "message": f"workspace at {TOOL_WORKSPACE_ROOT} is not a git work tree",
        }

    # Repo identifier: prefer remote origin URL → derive owner/name slug;
    # fall back to the workspace folder name. Branch: symbolic-ref short
    # form, falling back to "DETACHED@<sha>" when in detached HEAD.
    _, top, _ = await _git(["rev-parse", "--show-toplevel"])
    workspace_name = Path(top).name if top else TOOL_WORKSPACE_ROOT.name

    _, origin, _ = await _git(["config", "--get", "remote.origin.url"])
    repo_label = workspace_name
    if origin:
        slug = origin.rstrip("/")
        if slug.endswith(".git"):
            slug = slug[:-4]
        # Normalise SSH (git@host:owner/name) and HTTPS (https://host/owner/name)
        if "@" in slug and ":" in slug and not slug.startswith("http"):
            slug = slug.split(":", 1)[1]
        elif "://" in slug:
            slug = slug.split("://", 1)[1].split("/", 1)[1] if "/" in slug.split("://", 1)[1] else slug
        repo_label = slug or workspace_name

    rc_branch, branch, _ = await _git(["symbolic-ref", "--short", "HEAD"])
    head_sha = ""
    _, head_sha, _ = await _git(["rev-parse", "--short", "HEAD"])
    if rc_branch != 0 or not branch:
        branch = f"DETACHED@{head_sha}" if head_sha else "DETACHED"

    _, porcelain, _ = await _git(["status", "--porcelain"])
    dirty = bool(porcelain)

    ahead, behind = 0, 0
    rc_ab, ab, _ = await _git([
        "rev-list", "--left-right", "--count", "HEAD...@{upstream}",
    ])
    if rc_ab == 0 and ab:
        try:
            a_str, b_str = ab.split()
            ahead, behind = int(a_str), int(b_str)
        except ValueError:
            ahead, behind = 0, 0

    return {
        "repo": repo_label,
        "branch": branch,
        "head": head_sha or None,
        "dirty": dirty,
        "ahead": ahead,
        "behind": behind,
        "error": None,
        "message": None,
    }


# ── Observability + Gateway endpoints (Wave H + I integration) ────────────


@app.get("/observability/snapshot")
async def observability_snapshot():
    """Per-route p50/p95/error_rate/in_flight rolled from the in-process
    ring buffer. Live; resets on backend restart."""
    import observability
    return observability.snapshot()


@app.get("/gateway/summary")
async def gateway_summary():
    """Per-model + per-role call counts, token totals, estimated cost.
    Lives next to /diagnostics so the operator has a single place to
    audit routing + cost without scraping the run log."""
    from model_gateway import gateway as _gateway
    return _gateway.summary()


# ── Vercel API endpoints (Wave P-25) ──────────────────────────────────────
#
# Thin pass-through to vercel_client. Two reads only — list + detail.
# When VERCEL_TOKEN is unset (the audit's 🟡 stub state), endpoints
# return ``{ok: false, reason: "vercel_not_configured"}`` with HTTP 200
# so the Surface/Core dashboard can render an "unconfigured" chip
# instead of a 500. Same record_route envelope as the rest of Signal.


def _vercel_unconfigured() -> dict:
    """Friendly fallback body when VERCEL_TOKEN is empty. HTTP 200 by
    design — the chamber needs to know the integration is unconfigured,
    not that the backend exploded."""
    return {
        "ok": False,
        "reason": "vercel_not_configured",
        "message": (
            "Set SIGNAL_VERCEL_TOKEN (or RUBERRA_VERCEL_TOKEN) to enable "
            "Vercel deployment listing. SIGNAL_VERCEL_PROJECT_ID and "
            "SIGNAL_VERCEL_TEAM_ID are optional scopes."
        ),
    }


@app.get("/vercel/deployments")
async def vercel_deployments(
    limit: int = Query(default=20, ge=1, le=100),
):
    """List recent Vercel deployments scoped by VERCEL_PROJECT_ID /
    VERCEL_TEAM_ID env. Returns ``{ok, deployments, count}`` on
    success or the ``vercel_not_configured`` envelope when the token
    is unset.

    ``limit`` is clamped to Vercel's accepted range of 1..100; values
    outside that range yield a local 422 instead of being forwarded
    upstream and surfacing as a misleading ``vercel_api_error`` 502."""
    import observability as _obs
    from vercel_client import list_deployments

    if not VERCEL_TOKEN:
        return _vercel_unconfigured()

    _obs.start("vercel_deployments")
    started = time.monotonic()
    try:
        deployments = await list_deployments(
            token=VERCEL_TOKEN,
            project=VERCEL_PROJECT_ID or None,
            team=VERCEL_TEAM_ID or None,
            limit=limit,
        )
        _obs.end(
            "vercel_deployments",
            duration_ms=int((time.monotonic() - started) * 1000),
            succeeded=True,
        )
        return {
            "ok": True,
            "deployments": deployments,
            "count": len(deployments),
        }
    except Exception as e:  # noqa: BLE001
        _obs.end(
            "vercel_deployments",
            duration_ms=int((time.monotonic() - started) * 1000),
            succeeded=False,
            error_kind=type(e).__name__,
        )
        logger.error(f"Vercel list error: {e}", exc_info=True)
        raise HTTPException(
            status_code=502,
            detail=_error_envelope("vercel_api_error", e),
        )


@app.get("/vercel/deployments/{deployment_id}")
async def vercel_deployment(deployment_id: str):
    """Fetch a single Vercel deployment by id or host. Same shape /
    fallback contract as ``/vercel/deployments``."""
    import observability as _obs
    from vercel_client import get_deployment

    if not VERCEL_TOKEN:
        return _vercel_unconfigured()

    _obs.start("vercel_deployment")
    started = time.monotonic()
    try:
        deployment = await get_deployment(
            token=VERCEL_TOKEN,
            id=deployment_id,
            team=VERCEL_TEAM_ID or None,
        )
        _obs.end(
            "vercel_deployment",
            duration_ms=int((time.monotonic() - started) * 1000),
            succeeded=True,
        )
        return {
            "ok": True,
            "deployment": deployment,
            "count": 1,
        }
    except Exception as e:  # noqa: BLE001
        _obs.end(
            "vercel_deployment",
            duration_ms=int((time.monotonic() - started) * 1000),
            succeeded=False,
            error_kind=type(e).__name__,
        )
        logger.error(f"Vercel detail error: {e}", exc_info=True)
        raise HTTPException(
            status_code=502,
            detail=_error_envelope("vercel_api_error", e),
        )


# ── Railway GraphQL endpoints (Wave P-26) ────────────────────────────────


@app.get("/railway/services")
async def railway_services():
    """List Railway services for the configured project.

    Returns `{ok: false, reason: "railway_not_configured"}` (HTTP 200)
    when SIGNAL_RAILWAY_TOKEN or SIGNAL_RAILWAY_PROJECT_ID is unset, so
    the operator dashboard never sees a 500 just because the operator
    has not wired Railway credentials yet.

    On upstream failure, returns `{ok: false, reason: "railway_error",
    error: "..."}` so the panel can render a degraded badge instead of
    a stack trace.
    """
    import observability
    from config import RAILWAY_PROJECT_ID, RAILWAY_TOKEN, RAILWAY_TOKEN_KIND
    from railway_client import list_services

    if not RAILWAY_TOKEN or not RAILWAY_PROJECT_ID:
        return {"ok": False, "reason": "railway_not_configured"}

    # Catch RuntimeError OUTSIDE the record_route block so the context
    # manager observes the failure (sets error_kind, succeeded=False).
    # Catching inside would let the context manager exit cleanly and
    # /observability/snapshot would under-report Railway errors.
    try:
        async with observability.record_route("railway.services"):
            services = await list_services(
                token=RAILWAY_TOKEN,
                project_id=RAILWAY_PROJECT_ID,
                token_kind=RAILWAY_TOKEN_KIND,
            )
    except RuntimeError as exc:
        logger.warning("railway list_services failed: %s", exc)
        return {"ok": False, "reason": "railway_error", "error": str(exc)}

    return {
        "ok": True,
        "project_id": RAILWAY_PROJECT_ID,
        "services": services,
    }


@app.get("/railway/services/{service_id}/deployments")
async def railway_deployments(service_id: str, limit: int = 20):
    """List recent deployments for a service in the configured environment.

    Same fallback contract as `/railway/services`: missing token /
    environment yields `{ok: false, reason: "railway_not_configured"}`,
    upstream failures yield `{ok: false, reason: "railway_error", ...}`.
    """
    import observability
    from config import RAILWAY_ENVIRONMENT_ID, RAILWAY_TOKEN, RAILWAY_TOKEN_KIND
    from railway_client import list_deployments

    if not RAILWAY_TOKEN or not RAILWAY_ENVIRONMENT_ID:
        return {"ok": False, "reason": "railway_not_configured"}

    try:
        async with observability.record_route("railway.deployments"):
            deployments = await list_deployments(
                token=RAILWAY_TOKEN,
                service_id=service_id,
                environment_id=RAILWAY_ENVIRONMENT_ID,
                limit=limit,
                token_kind=RAILWAY_TOKEN_KIND,
            )
    except RuntimeError as exc:
        logger.warning(
            "railway list_deployments failed (service=%s): %s",
            service_id,
            exc,
        )
        return {"ok": False, "reason": "railway_error", "error": str(exc)}

    return {
        "ok": True,
        "service_id": service_id,
        "environment_id": RAILWAY_ENVIRONMENT_ID,
        "deployments": deployments,
    }


# ── Diagnostic Endpoint ─────────────────────────────────────────────────────

@app.get("/diagnostics")
async def diagnostics():
    """Full system diagnostics."""
    from config import MODEL_ID, TRIAD_TEMPERATURE, JUDGE_TEMPERATURE, TRIAD_COUNT
    from chambers.surface import _surface_mock_active

    mem_stats = await failure_memory.get_stats()

    # Honest boot signal: how the process was configured, not how the
    # operator intended it. Mock-mode and missing API key are the two
    # most common reasons the deployed brain silently returns canned
    # answers — both are surfaced here without exposing the key itself.
    boot = {
        "start_iso": _PROCESS_START_ISO,
        "uptime_seconds": int(time.monotonic() - _PROCESS_START_MONO),
        "mode": "mock" if RUBERRA_MOCK else "real",
        "anthropic_api_key_present": bool(ANTHROPIC_API_KEY),
        "data_dir": str(MEMORY_DIR),
        "persistence_ephemeral": PERSISTENCE_EPHEMERAL,
        "allowed_origins": ALLOWED_ORIGINS,
        "allowed_origin_regex": ALLOWED_ORIGIN_REGEX,
        "host": SERVER_HOST,
        "port": SERVER_PORT,
    }

    # Wave-5: surface posture is its own honesty axis. The chamber can be
    # in mock fallback for three distinct reasons; reporting "mock" alone
    # used to leave the operator guessing which lever to pull. Reasons
    # are listed in priority order — the first true wins the gate.
    _surface_flag = os.environ.get("SIGNAL_SURFACE_MOCK", "").strip().lower()
    surface_flag_on = _surface_flag in ("1", "true", "yes", "on")
    if RUBERRA_MOCK:
        surface_reason = "global_mock_flag"
    elif surface_flag_on:
        surface_reason = "surface_mock_flag"
    elif not ANTHROPIC_API_KEY:
        surface_reason = "anthropic_api_key_missing"
    else:
        surface_reason = None
    surface_status = {
        "mock_active": _surface_mock_active(),
        "reason": surface_reason,
        "global_mock_flag": RUBERRA_MOCK,
        "surface_mock_flag": surface_flag_on,
    }

    # Wave P-31 — visibility on which security layers are ACTIVE on this
    # process. Operators auditing a deploy need a single place to see
    # whether the auth gate is on, whether HSTS is being stamped, etc.
    # We never reveal the API key value — only the boolean.
    security = {
        "auth_required": bool(SIGNAL_API_KEY),
        "rate_limit_enabled": not RATE_LIMIT_DISABLED,
        "trust_proxy": TRUST_PROXY,
        "hsts": SECURITY_HSTS,
        "frame_options": FRAME_OPTIONS,
        "csp_overridden": bool(SECURITY_CSP),
        "body_size_limit_bytes": BODY_SIZE_LIMIT_BYTES,
        "log_redaction": LOG_REDACT,
    }

    return {
        "system": "Signal",
        "model": MODEL_ID,
        "triad_temperature": TRIAD_TEMPERATURE,
        "judge_temperature": JUDGE_TEMPERATURE,
        "triad_count": TRIAD_COUNT,
        "engine_status": "ready" if engine else "not_initialized",
        "boot": boot,
        "surface": surface_status,
        "security": security,
        "failure_memory": mem_stats,
        "persistence": {
            "spine_last_save_error": spine_store._last_save_error,
            "spine_last_load_error": spine_store._last_load_error,
            "runs_last_save_error": run_store._last_save_error,
            "runs_last_load_error": run_store._last_load_error,
            "memory_last_save_error": failure_memory._last_save_error,
            "memory_last_load_error": failure_memory._last_load_error,
        },
        "doctrine": "Conservative Intelligence — prefer refusal over error",
    }
