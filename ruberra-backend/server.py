"""
Ruberra — FastAPI Server
HTTP interface for the Ruberra intelligence system.

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

import json as _json
import logging
import os
import sys
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from config import (
    ALLOWED_ORIGIN,
    ALLOWED_ORIGINS,
    ANTHROPIC_API_KEY,
    MEMORY_DIR,
    RUBERRA_MOCK,
    SERVER_HOST,
    SERVER_PORT,
)
from models import RuberraQuery, RuberraResponse, SpineSnapshot
from engine import RuberraEngine
from memory import failure_memory
from runs import run_store
from spine import spine_store

# Captured at import time so /diagnostics can report uptime honestly.
_PROCESS_START_MONO = time.monotonic()
_PROCESS_START_ISO = datetime.now(timezone.utc).isoformat()

# ── Logging ─────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("ruberra.server")

# ── App Lifecycle ───────────────────────────────────────────────────────────

engine: RuberraEngine | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize engine on startup, cleanup on shutdown."""
    global engine
    
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

    engine = RuberraEngine()
    logger.info(
        "═══════════════════════════════════════════════════════════\n"
        "  Ruberra V1 — Conservative Intelligence System\n"
        f"  Listening: http://{SERVER_HOST}:{SERVER_PORT}\n"
        f"  CORS Origins: {', '.join(_cors_origins)}\n"
        "  Doctrine: ACTIVE\n"
        "  Self-Consistency: 3x parallel triad\n"
        "  Judge: IMPLACABLE\n"
        "  Failure Memory: PERSISTENT\n"
        "═══════════════════════════════════════════════════════════"
    )
    
    yield
    
    logger.info("Ruberra shutting down.")


# ── FastAPI App ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="Ruberra V1",
    description=(
        "A conservative, honest AI system that prefers to say "
        "'I don't know' rather than risk being wrong."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — production origins come from RUBERRA_ORIGIN (comma-separated), with
# localhost dev origins always appended so the backend stays usable locally.
_cors_origins = sorted({
    *ALLOWED_ORIGINS,
    "http://localhost:5173",
    "http://localhost:3000",
})
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        "system": "Ruberra V1",
        "doctrine": "active",
        "engine": "ready" if engine else "not_initialized",
        "mode": "mock" if RUBERRA_MOCK else "real",
        "persistence_degraded": bool(_collect_load_errors()),
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

    body = {
        "ready": not reasons,
        "reasons": reasons,
        "engine": "ready" if engine else "not_initialized",
        "mode": "mock" if RUBERRA_MOCK else "real",
        "load_errors": load_errors,
    }
    if reasons:
        raise HTTPException(status_code=503, detail=body)
    return body


@app.post("/ask", response_model=RuberraResponse)
async def ask_ruberra(query: RuberraQuery):
    """
    Submit a question to Ruberra.
    
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
async def ask_ruberra_dev(query: RuberraQuery):
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
async def ask_ruberra_auto_stream(query: RuberraQuery):
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
async def ask_ruberra_dev_stream(query: RuberraQuery):
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
async def ask_ruberra_crew_stream(query: RuberraQuery):
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
async def ask_ruberra_auto(query: RuberraQuery):
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
    questions: list[RuberraQuery] = Field(..., max_length=5)


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
        "allowed_origins": ALLOWED_ORIGINS,
        "host": SERVER_HOST,
        "port": SERVER_PORT,
    }

    return {
        "system": "Ruberra V1",
        "model": MODEL_ID,
        "triad_temperature": TRIAD_TEMPERATURE,
        "judge_temperature": JUDGE_TEMPERATURE,
        "triad_count": TRIAD_COUNT,
        "engine_status": "ready" if engine else "not_initialized",
        "boot": boot,
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
