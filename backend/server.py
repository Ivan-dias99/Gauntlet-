"""
Gauntlet — FastAPI Server
HTTP interface for the Gauntlet backend (the maestro).

Endpoints:
  POST /ask, /route, /route/stream  — triad+judge / auto-router
  POST /dev, /dev/stream            — agent loop (tool-use)
  POST /composer/{context,intent,preview,apply}
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

from fastapi import FastAPI, HTTPException
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
)
from models import SignalQuery, SignalResponse, SpineSnapshot, RunRecord
from engine import SignalEngine
from memory import failure_memory
from runs import run_store
from spine import spine_store
from tools import TOOL_WORKSPACE_ROOT
from composer import router as composer_router

# Captured at import time so /diagnostics can report uptime honestly.
_PROCESS_START_MONO = time.monotonic()
_PROCESS_START_ISO = datetime.now(timezone.utc).isoformat()

# ── Logging ─────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("gauntlet.server")

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
        "  Gauntlet — inteligência na ponta do cursor\n"
        f"  Listening: http://{SERVER_HOST}:{SERVER_PORT}\n"
        f"  CORS Origins: {', '.join(_cors_origins)}\n"
        f"  CORS Regex: {ALLOWED_ORIGIN_REGEX or '(disabled)'}\n"
        f"  Data Dir: {MEMORY_DIR}\n"
        "  Composer routes: /composer/{context, intent, preview, apply}\n"
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

    logger.info("Gauntlet backend shutting down.")


# ── FastAPI App ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="Gauntlet",
    description=(
        "Gauntlet — intelligence at the cursor tip. The browser-extension "
        "capsule (Composer) speaks to this backend (the maestro), which "
        "owns model routing, tools, memory and the conservative doctrine: "
        "prefer refusal over the risk of being wrong."
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
# Chrome / Edge / Firefox extensions ship with a non-deterministic origin
# (chrome-extension://<id>, moz-extension://<uuid>) so they cannot be
# enumerated in ALLOWED_ORIGINS. Match them via regex so the cursor
# capsule can reach the local backend without per-install configuration.
# When the operator already supplied a regex, OR ours into theirs.
_extension_regex = r"^(chrome-extension|moz-extension|safari-web-extension):\/\/.+$"
if ALLOWED_ORIGIN_REGEX:
    _cors_kwargs["allow_origin_regex"] = (
        f"({ALLOWED_ORIGIN_REGEX})|({_extension_regex})"
    )
else:
    _cors_kwargs["allow_origin_regex"] = _extension_regex


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

# Per-route body-size overrides. Empty after the Gauntlet migration retired
# the /visual-diff endpoint; kept as a hook for future large-body routes.
LARGE_BODY_ROUTES: dict[str, int] = {}


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

# Composer surface (Wave V0) — context · intent · preview · apply.
# Mounted after middleware so the same defense-in-depth stack covers it.
app.include_router(composer_router)


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
        "system": "Gauntlet",
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


# ── Telemetry ───────────────────────────────────────────────────────────────


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


# ── Diagnostic Endpoint ─────────────────────────────────────────────────────

@app.get("/diagnostics")
async def diagnostics():
    """Full system diagnostics."""
    from config import MODEL_ID, TRIAD_TEMPERATURE, JUDGE_TEMPERATURE, TRIAD_COUNT

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
        "system": "Gauntlet",
        "model": MODEL_ID,
        "triad_temperature": TRIAD_TEMPERATURE,
        "judge_temperature": JUDGE_TEMPERATURE,
        "triad_count": TRIAD_COUNT,
        "engine_status": "ready" if engine else "not_initialized",
        "boot": boot,
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
