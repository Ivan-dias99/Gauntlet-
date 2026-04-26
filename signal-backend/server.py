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
  GET  /health, /health/ready, /diagnostics
"""

from __future__ import annotations

import asyncio
import json as _json
import logging
import os
import sys
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import AsyncIterator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from config import (
    ALLOWED_ORIGIN,
    ALLOWED_ORIGINS,
    ANTHROPIC_API_KEY,
    DATA_DIR,
    SERVER_HOST,
    SERVER_PORT,
    SIGNAL_MOCK,
)
from chambers.profiles import ChamberKey, get_profile
from db import get_db, migrate_legacy_json_if_needed
from models import SignalQuery, SignalResponse, SpineSnapshot
from engine import SignalEngine
from memory import failure_memory
from runs import run_store
from spine import spine_store
from tools import ToolRegistry, SIGNAL_ALLOW_CODE_EXEC, default_tools

# Captured at import time so /diagnostics can report uptime honestly.
_PROCESS_START_MONO = time.monotonic()
_PROCESS_START_ISO = datetime.now(timezone.utc).isoformat()

# Single source of truth for the tool registry — also drives /diagnostics.
_TOOL_REGISTRY = ToolRegistry(default_tools())

# Heartbeat for SSE streams. Anthropic can pause for tens of seconds when
# the model is reasoning hard; without a periodic comment frame the edge
# proxy or browser may decide the connection is dead and drop it.
_SSE_HEARTBEAT_SECONDS: float = 12.0

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

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key and not SIGNAL_MOCK:
        logger.error(
            "═══════════════════════════════════════════════════════════\n"
            "  ANTHROPIC_API_KEY not set!\n"
            "  Export it before starting, or set SIGNAL_MOCK=1 to run\n"
            "  the full pipeline against canned responses.\n"
            "═══════════════════════════════════════════════════════════"
        )
        sys.exit(1)

    # One-shot SQLite migration from legacy JSON sidecars; idempotent.
    try:
        migration = await migrate_legacy_json_if_needed()
        if migration["runs"] or migration["spine"] or migration["failures"]:
            logger.info("Legacy JSON migration: %s", migration)
        if migration["errors"]:
            logger.warning("Migration partial errors: %s", migration["errors"])
    except Exception as exc:  # noqa: BLE001
        logger.error("Migration failed (server still booting): %s", exc, exc_info=True)

    engine = SignalEngine()
    logger.info(
        "═══════════════════════════════════════════════════════════\n"
        "  Signal — sovereign AI workspace\n"
        f"  Listening: http://{SERVER_HOST}:{SERVER_PORT}\n"
        f"  CORS Origins: {', '.join(_cors_origins)}\n"
        "  Chambers: Insight · Surface · Terminal · Archive · Core\n"
        "  Doctrine: ACTIVE\n"
        "  Self-Consistency: 3x parallel triad\n"
        "  Judge: IMPLACABLE\n"
        "  Failure Memory: PERSISTENT\n"
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
    db_err = get_db().last_load_error
    if db_err:
        out.append({"store": "db", "error": db_err})
    for name, store_attr in (
        ("spine", spine_store._last_load_error),
        ("runs", run_store._last_load_error),
        ("memory", failure_memory._last_load_error),
    ):
        if store_attr:
            out.append({"store": name, "error": store_attr})
    return out


# ── SSE helpers ─────────────────────────────────────────────────────────────

async def _heartbeat_stream(
    source: AsyncIterator[dict],
    error_kind: str,
) -> AsyncIterator[str]:
    """Wrap an async event source with a heartbeat comment frame.

    Emits ``: keepalive\\n\\n`` every _SSE_HEARTBEAT_SECONDS seconds whenever the
    upstream generator goes quiet. Comment frames (lines starting with ``:``)
    are mandated by the SSE spec to be ignored by clients, so they cost nothing
    semantically but keep the TCP connection from being reaped by intermediate
    proxies (Vercel edge, nginx, browsers) during long Anthropic calls.
    """
    iterator = source.__aiter__()
    next_task: asyncio.Task | None = None
    try:
        while True:
            if next_task is None:
                next_task = asyncio.create_task(iterator.__anext__())
            try:
                event = await asyncio.wait_for(
                    asyncio.shield(next_task), timeout=_SSE_HEARTBEAT_SECONDS
                )
            except asyncio.TimeoutError:
                yield ": keepalive\n\n"
                continue
            except StopAsyncIteration:
                next_task = None
                break
            except Exception as exc:  # noqa: BLE001
                next_task = None
                logger.error("Stream %s error: %s", error_kind, exc, exc_info=True)
                yield (
                    "data: "
                    + _json.dumps({"type": "error", **_error_envelope(error_kind, exc)})
                    + "\n\n"
                )
                break
            next_task = None
            yield f"data: {_json.dumps(event)}\n\n"
    finally:
        if next_task is not None and not next_task.done():
            next_task.cancel()


def _stream_response(
    source: AsyncIterator[dict],
    error_kind: str,
) -> StreamingResponse:
    return StreamingResponse(
        _heartbeat_stream(source, error_kind),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


# ── Health ──────────────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    """
    Liveness probe. Always returns 200 as long as the HTTP layer is up —
    Railway / Vercel need a stable yes/no to keep routing traffic, and
    flipping this to 5xx on a degraded engine would trigger a
    crash-restart loop that never resolves.

    Callers that need a hard yes/no for degraded state must use
    `/health/ready`.
    """
    return {
        "status": "operational",
        "system": "Signal",
        "doctrine": "active",
        "engine": "ready" if engine else "not_initialized",
        "mode": "mock" if SIGNAL_MOCK else "real",
        "persistence_degraded": bool(_collect_load_errors()),
    }


@app.get("/health/ready")
async def health_ready():
    """
    Readiness probe. Returns 503 if the system is degraded in any way
    that would make its answers untrustworthy — engine uninitialised,
    running in mock mode, or a store booted on a quarantined file.
    """
    load_errors = _collect_load_errors()
    reasons: list[str] = []
    if not engine:
        reasons.append("engine_not_initialized")
    if SIGNAL_MOCK:
        reasons.append("mock_mode")
    if load_errors:
        reasons.append("persistence_degraded")

    body = {
        "ready": not reasons,
        "reasons": reasons,
        "engine": "ready" if engine else "not_initialized",
        "mode": "mock" if SIGNAL_MOCK else "real",
        "load_errors": load_errors,
    }
    if reasons:
        raise HTTPException(status_code=503, detail=body)
    return body


# ── Engine endpoints (canonical names; no ask_ruberra_* aliases left) ───────

@app.post("/ask", response_model=SignalResponse)
async def ask(query: SignalQuery):
    """Submit a question to Signal's triad + judge pipeline."""
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())

    try:
        return await engine.process_query(query)
    except Exception as e:
        logger.error("Engine error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=_error_envelope("engine_error", e))


@app.post("/dev")
async def dev(query: SignalQuery):
    """Force the agent (tool-use) pipeline. Returns the final answer + tool trace."""
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())
    try:
        agent_response = await engine.process_dev_query(query)
        return agent_response.to_dict()
    except Exception as e:
        logger.error("Agent error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=_error_envelope("agent_error", e))


@app.post("/route/stream")
async def route_stream(query: SignalQuery):
    """Streaming auto-router. Emits route + per-stage events + done."""
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())
    return _stream_response(engine.process_auto_streaming(query), "router_error")


@app.post("/dev/stream")
async def dev_stream(query: SignalQuery):
    """Streaming agent loop. Emits per-iteration tool_use/tool_result/done."""
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())
    return _stream_response(engine.process_dev_query_streaming(query), "agent_error")


@app.post("/crew/stream")
async def crew_stream(query: SignalQuery):
    """Streaming multi-agent crew: planner → researcher → coder → critic."""
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())
    return _stream_response(engine.process_crew_query_streaming(query), "crew_error")


@app.post("/route")
async def route(query: SignalQuery):
    """Auto-router: dev-intent → agent loop; rest → triad + judge."""
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())
    try:
        return await engine.process_auto(query)
    except Exception as e:
        logger.error("Router error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=_error_envelope("router_error", e))


class BatchQuery(BaseModel):
    """Multiple questions in one request."""
    questions: list[SignalQuery] = Field(..., max_length=5)


@app.post("/ask/batch")
async def ask_batch(batch: BatchQuery):
    """Submit up to 5 questions in batch."""
    if not engine:
        raise HTTPException(status_code=503, detail=_engine_unavailable_envelope())

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
    return await failure_memory.get_stats()


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
        logger.error("Spine persist failed: %s", e, exc_info=True)
        raise HTTPException(
            status_code=503,
            detail=_error_envelope("spine_persist_failed", e),
        )


# ── Diagnostic Endpoint ─────────────────────────────────────────────────────

# Static slice of the Signal doctrine surfaced to Core/Policies. The frontend
# was rendering "no principles" because it had no way to see the system
# constitution that lives in code; Operator Constitution is user-defined and
# remains separate.
SYSTEM_DOCTRINE: list[dict] = [
    {
        "id": "refuse_before_guessing",
        "title": "Refuse before guessing",
        "summary": "Prefer not to answer over the risk of being wrong.",
        "anchor": "doctrine.SYSTEM_PROMPT",
    },
    {
        "id": "triad_before_answer",
        "title": "Triad before answer",
        "summary": "Three parallel completions before any user-visible response.",
        "anchor": "engine.SignalEngine.run_triad",
    },
    {
        "id": "judge_decides_confidence",
        "title": "Judge decides confidence",
        "summary": "An implacable judge collapses the triad into HIGH or refusal.",
        "anchor": "doctrine.JUDGE_PROMPT",
    },
    {
        "id": "failure_memory_reinforces_caution",
        "title": "Failure memory reinforces caution",
        "summary": "Past refusals fingerprint future questions; repeats refuse faster.",
        "anchor": "memory.FailureMemoryStore",
    },
    {
        "id": "tool_execution_is_gated",
        "title": "Tool execution is gated",
        "summary": "Mutating tools require SIGNAL_ALLOW_CODE_EXEC; deny by default.",
        "anchor": "tools.SIGNAL_ALLOW_CODE_EXEC",
    },
    {
        "id": "archive_preserves_provenance",
        "title": "Archive preserves provenance",
        "summary": "Every run is recorded; refused runs without judgment are quarantined, not silenced.",
        "anchor": "runs.RunStore.record",
    },
]


def _serialize_tool_registry() -> list[dict]:
    """Snapshot of every tool the agent can dispatch. Single source of truth."""
    out: list[dict] = []
    for tool in _TOOL_REGISTRY._tools.values():
        gated = tool.name in {"execute_python", "run_command"}
        if tool.name in {"read_file", "list_directory"}:
            kind = "filesystem"
        elif tool.name == "git":
            kind = "vcs"
        elif tool.name in {"web_search", "fetch_url", "package_info"}:
            kind = "network"
        elif tool.name in {"run_command", "execute_python"}:
            kind = "process"
        else:
            kind = "other"
        chambers_allowed: list[str] = []
        for key in ChamberKey:
            profile = get_profile(key)
            if not profile:
                continue
            if profile.allowed_tools is None:
                chambers_allowed.append(key.value)
            elif tool.name in profile.allowed_tools:
                chambers_allowed.append(key.value)
        out.append({
            "name": tool.name,
            "kind": kind,
            "gated": gated,
            "description": tool.description,
            "chambers": chambers_allowed,
        })
    return out


@app.get("/diagnostics")
async def diagnostics():
    """Full system diagnostics. Single source of truth for UI registries."""
    from config import MODEL_ID, TRIAD_TEMPERATURE, JUDGE_TEMPERATURE, TRIAD_COUNT

    mem_stats = await failure_memory.get_stats()

    boot = {
        "start_iso": _PROCESS_START_ISO,
        "uptime_seconds": int(time.monotonic() - _PROCESS_START_MONO),
        "mode": "mock" if SIGNAL_MOCK else "real",
        "anthropic_api_key_present": bool(ANTHROPIC_API_KEY),
        "data_dir": str(DATA_DIR),
        "allowed_origins": ALLOWED_ORIGINS,
        "host": SERVER_HOST,
        "port": SERVER_PORT,
        "allow_code_exec": SIGNAL_ALLOW_CODE_EXEC,
    }

    return {
        "system": "Signal",
        "model": MODEL_ID,
        "triad_temperature": TRIAD_TEMPERATURE,
        "judge_temperature": JUDGE_TEMPERATURE,
        "triad_count": TRIAD_COUNT,
        "engine_status": "ready" if engine else "not_initialized",
        "boot": boot,
        "failure_memory": mem_stats,
        "tools": _serialize_tool_registry(),
        "system_doctrine": SYSTEM_DOCTRINE,
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
