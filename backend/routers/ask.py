"""Triad+judge endpoints: /ask, /ask/batch, /route, /route/stream."""

from __future__ import annotations

import asyncio
import json as _json
import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from models import SignalQuery, SignalResponse
from runtime import error_envelope, require_engine

router = APIRouter()
logger = logging.getLogger("gauntlet.routers.ask")


@router.post("/ask", response_model=SignalResponse)
async def ask(query: SignalQuery):
    """
    Submit a question to Gauntlet.

    The system will:
    1. Check failure memory for prior failures on similar questions
    2. Fire 3 parallel calls to the configured provider (self-consistency)
    3. Send responses to the implacable Judge
    4. Return answer (high confidence) or refusal (low confidence)
    """
    engine = require_engine()
    try:
        return await engine.process_query(query)
    except Exception as e:
        logger.error(f"Engine error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=error_envelope("engine_error", e))


@router.post("/route")
async def route_auto(query: SignalQuery):
    """
    Auto-router: dev-intent questions go through the agent loop; the rest
    go through the triad + judge. Response shape is ``{route, result}``.
    """
    engine = require_engine()
    try:
        return await engine.process_auto(query)
    except Exception as e:
        logger.error(f"Router error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=error_envelope("router_error", e))


@router.post("/route/stream")
async def route_auto_stream(query: SignalQuery):
    """
    Streaming variant of ``/route``. Emits the ``route`` decision first, then
    either agent events (``tool_use``, ``tool_result``, ...) or triad events
    (``triad_done``, ``judge_done``, ...) and finally ``done``.
    """
    engine = require_engine()

    async def event_source():
        try:
            async for event in engine.process_auto_streaming(query):
                yield f"data: {_json.dumps(event)}\n\n"
        except Exception as e:
            logger.error(f"Route stream error: {e}", exc_info=True)
            yield f"data: {_json.dumps({'type': 'error', **error_envelope('router_error', e)})}\n\n"

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


class BatchQuery(BaseModel):
    """Multiple questions in one request."""
    questions: list[SignalQuery] = Field(..., max_length=5)


@router.post("/ask/batch")
async def ask_batch(batch: BatchQuery):
    """Submit up to 5 questions in batch."""
    engine = require_engine()

    results = await asyncio.gather(
        *[engine.process_query(q) for q in batch.questions],
        return_exceptions=True,
    )

    responses = []
    for r in results:
        if isinstance(r, Exception):
            responses.append(error_envelope("engine_error", r))
        else:
            responses.append(r.model_dump())

    return {"results": responses}
