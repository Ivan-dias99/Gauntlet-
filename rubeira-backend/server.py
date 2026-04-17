"""
Rubeira V1 — FastAPI Server
HTTP interface for the Rubeira intelligence system.

Endpoints:
  POST /ask              — Submit a question to Rubeira
  GET  /health           — Health check
  GET  /memory/stats     — Failure memory statistics
  GET  /memory/failures  — List recent failures
  POST /memory/clear     — Clear failure memory (admin)
"""

from __future__ import annotations

import logging
import os
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import ALLOWED_ORIGIN, SERVER_HOST, SERVER_PORT
from models import RubeiraQuery, RubeiraResponse
from engine import RubeiraEngine
from memory import failure_memory

# ── Logging ─────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("rubeira.server")

# ── App Lifecycle ───────────────────────────────────────────────────────────

engine: RubeiraEngine | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize engine on startup, cleanup on shutdown."""
    global engine
    
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        logger.error(
            "═══════════════════════════════════════════════════════════\n"
            "  ANTHROPIC_API_KEY not set!\n"
            "  Export it before starting:\n"
            "    $env:ANTHROPIC_API_KEY = 'sk-ant-...'\n"
            "═══════════════════════════════════════════════════════════"
        )
        sys.exit(1)
    
    engine = RubeiraEngine()
    logger.info(
        "═══════════════════════════════════════════════════════════\n"
        "  Rubeira V1 — Conservative Intelligence System\n"
        f"  Listening: http://{SERVER_HOST}:{SERVER_PORT}\n"
        f"  CORS Origin: {ALLOWED_ORIGIN}\n"
        "  Doctrine: ACTIVE\n"
        "  Self-Consistency: 3x parallel triad\n"
        "  Judge: IMPLACABLE\n"
        "  Failure Memory: PERSISTENT\n"
        "═══════════════════════════════════════════════════════════"
    )
    
    yield
    
    logger.info("Rubeira shutting down.")


# ── FastAPI App ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="Rubeira V1",
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
        "system": "Rubeira V1",
        "doctrine": "active",
        "engine": "ready" if engine else "not_initialized",
    }


@app.post("/ask", response_model=RubeiraResponse)
async def ask_rubeira(query: RubeiraQuery):
    """
    Submit a question to Rubeira.
    
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


class BatchQuery(BaseModel):
    """Multiple questions in one request."""
    questions: list[RubeiraQuery] = Field(..., max_length=5)


@app.post("/ask/batch")
async def ask_rubeira_batch(batch: BatchQuery):
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


# ── Diagnostic Endpoint ─────────────────────────────────────────────────────

@app.get("/diagnostics")
async def diagnostics():
    """Full system diagnostics."""
    from config import MODEL_ID, TRIAD_TEMPERATURE, JUDGE_TEMPERATURE, TRIAD_COUNT
    
    mem_stats = await failure_memory.get_stats()
    
    return {
        "system": "Rubeira V1",
        "model": MODEL_ID,
        "triad_temperature": TRIAD_TEMPERATURE,
        "judge_temperature": JUDGE_TEMPERATURE,
        "triad_count": TRIAD_COUNT,
        "engine_status": "ready" if engine else "not_initialized",
        "failure_memory": mem_stats,
        "doctrine": "Conservative Intelligence — prefer refusal over error",
    }
