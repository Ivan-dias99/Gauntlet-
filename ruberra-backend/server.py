"""
Ruberra V1 — FastAPI Server
HTTP interface for the Ruberra intelligence system.

Endpoints:
  POST /ask              — Submit a question to Ruberra
  GET  /health           — Health check
  GET  /memory/stats     — Failure memory statistics
  GET  /memory/failures  — List recent failures
  POST /memory/clear     — Clear failure memory (admin)
"""

from __future__ import annotations

import json as _json
import logging
import os
import sys
from typing import Any, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from config import ALLOWED_ORIGIN, RUBERRA_MOCK, SERVER_HOST, SERVER_PORT
from models import RuberraQuery, RuberraResponse, SpineSnapshot
from engine import RuberraEngine
from memory import failure_memory
from mcp_adapter import mcp_manager
from runs import run_store
from spine import spine_store
from tools import ToolRegistry

from pathlib import Path as _Path
# Evals surface two directories. ``data/evals/`` is gitignored local-run
# output. ``evals/results/`` is the tracked copy promoted by CI so a
# fresh prod deploy shows the latest numbers instead of an empty state.
_EVALS_LOCAL_DIR = _Path(__file__).parent / "data" / "evals"
_EVALS_TRACKED_DIR = _Path(__file__).parent / "evals" / "results"

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

    # Connect to MCP servers (if any are configured) and plug their tools
    # into the shared registry used by every AgentOrchestrator.
    shared_registry = ToolRegistry()
    await mcp_manager.start(shared_registry)
    if mcp_manager.tool_count:
        # Rebuild agent + crew singletons with the enriched registry
        from agent import AgentOrchestrator
        import engine as engine_mod
        engine_mod._agent_singleton = AgentOrchestrator(registry=shared_registry)
        from crew import CrewOrchestrator
        engine_mod._crew_singleton = CrewOrchestrator(registry=shared_registry)

    logger.info(
        "═══════════════════════════════════════════════════════════\n"
        "  Ruberra V1 — Conservative Intelligence System\n"
        f"  Listening: http://{SERVER_HOST}:{SERVER_PORT}\n"
        f"  CORS Origin: {ALLOWED_ORIGIN}\n"
        "  Doctrine: ACTIVE\n"
        "  Self-Consistency: 3x parallel triad\n"
        "  Judge: IMPLACABLE\n"
        "  Failure Memory: PERSISTENT\n"
        f"  MCP: {mcp_manager.server_count} servers, {mcp_manager.tool_count} tools\n"
        "═══════════════════════════════════════════════════════════"
    )

    yield

    logger.info("Ruberra shutting down.")
    await mcp_manager.stop()


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

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Endpoints ───────────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "operational",
        "system": "Ruberra V1",
        "doctrine": "active",
        "engine": "ready" if engine else "not_initialized",
    }


@app.post("/ask", response_model=RuberraResponse)
async def ask_ruberra(query: RuberraQuery):
    """
    Submit a question to Ruberra.
    
    The system will:
    1. Check failure memory for prior failures on similar questions
    2. Fire 3 parallel calls to Claude Sonnet (self-consistency)
    3. Send responses to the implacable Judge
    4. Return answer (high/medium confidence) or refusal (low confidence)
    """
    if not engine:
        raise HTTPException(status_code=503, detail="Engine not initialized")
    
    try:
        response = await engine.process_query(query)
        return response
    except Exception as e:
        logger.error(f"Engine error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal engine error: {str(e)}",
        )


@app.post("/dev")
async def ask_ruberra_dev(query: RuberraQuery):
    """
    Force the agent (tool-use) pipeline.

    Skips the triad/judge and runs an agentic loop where Claude may call
    ``read_file``, ``git``, ``run_command``, ``web_search`` and friends. The
    response includes the final answer plus the full tool-call trace.
    """
    if not engine:
        raise HTTPException(status_code=503, detail="Engine not initialized")
    try:
        agent_response = await engine.process_dev_query(query)
        return agent_response.to_dict()
    except Exception as e:
        logger.error(f"Agent error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Agent error: {e}")


@app.post("/route/stream")
async def ask_ruberra_auto_stream(query: RuberraQuery):
    """
    Streaming variant of ``/route``. Emits the ``route`` decision first, then
    either agent events (``tool_use``, ``tool_result``, ...) or triad events
    (``triad_done``, ``judge_done``, ...) and finally ``done``.
    """
    if not engine:
        raise HTTPException(status_code=503, detail="Engine not initialized")

    async def event_source():
        try:
            async for event in engine.process_auto_streaming(query):
                yield f"data: {_json.dumps(event)}\n\n"
        except Exception as e:
            logger.error(f"Route stream error: {e}", exc_info=True)
            yield f"data: {_json.dumps({'type': 'error', 'message': str(e)})}\n\n"

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
        raise HTTPException(status_code=503, detail="Engine not initialized")

    async def event_source():
        try:
            async for event in engine.process_dev_query_streaming(query):
                yield f"data: {_json.dumps(event)}\n\n"
        except Exception as e:
            logger.error(f"Agent stream error: {e}", exc_info=True)
            yield f"data: {_json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


BASELINE_SYSTEM_PROMPT = (
    "You are a helpful assistant. Answer the user's question directly and "
    "concisely. If the question is ambiguous or unanswerable, do your best."
)


@app.post("/baseline/stream")
async def ask_ruberra_baseline_stream(query: RuberraQuery):
    """
    Raw-Claude baseline. No triad, no judge, no crew, no doctrine, no tools.
    Used by the eval runner to measure the delta that Ruberra actually
    earns over a naked model call. The SSE envelope is identical to the
    other pipelines so the runner reuses its classifier.

    Events emitted::

        {"type": "start"}
        {"type": "text_delta", "text": "..."}            # streaming tokens
        {"type": "done", "answer": "...", "input_tokens": n, "output_tokens": n,
         "processing_time_ms": ms}
    """
    if not engine:
        raise HTTPException(status_code=503, detail="Engine not initialized")

    from anthropic import AsyncAnthropic
    from config import ANTHROPIC_API_KEY, MAX_TOKENS, MODEL_ID, RUBERRA_MOCK
    from mock_client import MockAsyncAnthropic
    from streaming import stream_messages

    if RUBERRA_MOCK:
        client = MockAsyncAnthropic()
    else:
        client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)

    async def event_source():
        import time as _time
        started = _time.monotonic()
        try:
            yield f"data: {_json.dumps({'type': 'start'})}\n\n"
            answer = ""
            response = None
            async for sev in stream_messages(
                client,
                model=MODEL_ID,
                max_tokens=MAX_TOKENS,
                temperature=0.3,
                system=BASELINE_SYSTEM_PROMPT,
                messages=[{"role": "user", "content": query.question}],
            ):
                if sev["type"] == "text_delta":
                    answer += sev["text"]
                    yield f"data: {_json.dumps({'type': 'text_delta', 'text': sev['text']})}\n\n"
                elif sev["type"] == "final":
                    response = sev["message"]
            in_tok = response.usage.input_tokens if response else 0
            out_tok = response.usage.output_tokens if response else 0
            done = {
                "type": "done",
                "answer": answer,
                "input_tokens": in_tok,
                "output_tokens": out_tok,
                "processing_time_ms": int((_time.monotonic() - started) * 1000),
            }
            yield f"data: {_json.dumps(done)}\n\n"
        except Exception as e:  # noqa: BLE001
            logger.error(f"Baseline stream error: {e}", exc_info=True)
            yield f"data: {_json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
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
        raise HTTPException(status_code=503, detail="Engine not initialized")

    async def event_source():
        try:
            async for event in engine.process_crew_query_streaming(query):
                yield f"data: {_json.dumps(event)}\n\n"
        except Exception as e:
            logger.error(f"Crew stream error: {e}", exc_info=True)
            yield f"data: {_json.dumps({'type': 'error', 'message': str(e)})}\n\n"

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
        raise HTTPException(status_code=503, detail="Engine not initialized")
    try:
        return await engine.process_auto(query)
    except Exception as e:
        logger.error(f"Router error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Router error: {e}")



class BatchQuery(BaseModel):
    """Multiple questions in one request."""
    questions: list[RuberraQuery] = Field(..., max_length=5)


@app.post("/ask/batch")
async def ask_ruberra_batch(batch: BatchQuery):
    """Submit up to 5 questions in batch."""
    if not engine:
        raise HTTPException(status_code=503, detail="Engine not initialized")
    
    import asyncio
    results = await asyncio.gather(
        *[engine.process_query(q) for q in batch.questions],
        return_exceptions=True,
    )
    
    responses = []
    for r in results:
        if isinstance(r, Exception):
            responses.append({"error": str(r)})
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
        raise HTTPException(status_code=404, detail="run not found")
    return record.model_dump()


# ── Spine (Workspace) Endpoints ─────────────────────────────────────────────

@app.get("/spine", response_model=SpineSnapshot)
async def get_spine():
    """Return the full mission workspace snapshot."""
    return await spine_store.get()


@app.post("/spine", response_model=SpineSnapshot)
async def put_spine(snapshot: SpineSnapshot):
    """Replace the full mission workspace snapshot. Full-state sync."""
    return await spine_store.put(snapshot)


# ── Evals Endpoints ─────────────────────────────────────────────────────────


def _read_eval_json(filename: str) -> Any:
    """Try the local dir first, fall back to the tracked (CI-promoted) dir."""
    for base in (_EVALS_LOCAL_DIR, _EVALS_TRACKED_DIR):
        path = base / filename
        if not path.is_file():
            continue
        try:
            return _json.loads(path.read_text(encoding="utf-8"))
        except Exception as e:  # noqa: BLE001
            logger.error("failed to read %s: %s", path, e)
    return None


@app.get("/evals/latest")
async def evals_latest(endpoint: str | None = None):
    """Most recent eval run: full per-case outcomes + summary.

    ``endpoint=baseline`` surfaces the raw-Claude comparison artifact
    (``latest-baseline.json``); the default reads ``latest.json``, which
    is whichever pipeline last ran (typically crew).

    Returns 200 with ``{"available": false}`` when no eval has run yet,
    so the UI renders an empty state instead of treating it as an error.
    """
    filename = "latest-baseline.json" if endpoint == "baseline" else "latest.json"
    data = _read_eval_json(filename)
    if data is None:
        return {"available": False}
    return {"available": True, **data}


@app.get("/evals/history")
async def evals_history(limit: int = 100):
    """Append-only time series of summary rows for the Evals dashboard."""
    data = _read_eval_json("history.json")
    if data is None:
        return {"rows": []}
    rows = data if isinstance(data, list) else []
    return {"rows": rows[-limit:]}


class EvalFeedback(BaseModel):
    """A user marking a real run as an eval regression.

    kind=false_answer    the run answered something wrong → we want Ruberra
                         to refuse this (or an equivalent) next time.
    kind=false_refusal   the run refused a reasonable question → we want
                         Ruberra to answer next time.
    """
    run_id: str = Field(..., min_length=1, max_length=128)
    kind: str = Field(..., pattern="^(false_answer|false_refusal)$")
    notes: Optional[str] = Field(None, max_length=1000)


@app.post("/evals/feedback")
async def evals_feedback(payload: EvalFeedback):
    """Append a user-reported regression to the live cases-feedback.yaml.

    The runner picks this file up alongside the seed cases, so the next
    scheduled eval run catches regressions that real users flagged.
    """
    record = await run_store.get(payload.run_id)
    if record is None:
        raise HTTPException(status_code=404, detail="run not found")

    feedback_path = _EVALS_LOCAL_DIR / "cases-feedback.yaml"
    feedback_path.parent.mkdir(parents=True, exist_ok=True)

    # Minimal YAML dialect — no external dep at runtime.
    def _yaml_escape(s: str) -> str:
        return s.replace("\\", "\\\\").replace('"', '\\"')

    case_id = f"feedback-{payload.run_id[:8]}-{payload.kind}"
    expect = "refuse" if payload.kind == "false_answer" else "answer"
    question = record.question.replace("\n", " ")
    block = [
        "",
        f"  - id: {case_id}",
        "    category: bait" if payload.kind == "false_answer" else "    category: factual",
        f'    question: "{_yaml_escape(question[:500])}"',
        f"    expect: {expect}",
    ]
    if expect == "answer":
        # We don't know the gold, so require only that the system doesn't
        # refuse. must_contain left empty; the classifier's "missing"
        # verdict absorbs off-target answers.
        block.append("    must_contain: []")
    reason = f"user-flagged {payload.kind} at {record.timestamp}"
    if payload.notes:
        reason += f" · {payload.notes[:300]}"
    block.append(f'    notes: "{_yaml_escape(reason)}"')

    if not feedback_path.exists():
        feedback_path.write_text("cases:\n", encoding="utf-8")

    # Idempotent: don't append duplicate id.
    existing = feedback_path.read_text(encoding="utf-8")
    if f"id: {case_id}" in existing:
        return {"ok": True, "case_id": case_id, "duplicate": True}

    with feedback_path.open("a", encoding="utf-8") as f:
        f.write("\n".join(block) + "\n")

    return {"ok": True, "case_id": case_id, "duplicate": False}


# ── Diagnostic Endpoint ─────────────────────────────────────────────────────

@app.get("/diagnostics")
async def diagnostics():
    """Full system diagnostics."""
    from config import MODEL_ID, TRIAD_TEMPERATURE, JUDGE_TEMPERATURE, TRIAD_COUNT
    
    mem_stats = await failure_memory.get_stats()
    
    return {
        "system": "Ruberra V1",
        "model": MODEL_ID,
        "triad_temperature": TRIAD_TEMPERATURE,
        "judge_temperature": JUDGE_TEMPERATURE,
        "triad_count": TRIAD_COUNT,
        "engine_status": "ready" if engine else "not_initialized",
        "failure_memory": mem_stats,
        "doctrine": "Conservative Intelligence — prefer refusal over error",
    }
