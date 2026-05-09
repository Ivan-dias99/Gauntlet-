"""Agent loop endpoints: /dev, /dev/stream."""

from __future__ import annotations

import json as _json
import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from models import SignalQuery
from runtime import error_envelope, require_engine

router = APIRouter()
logger = logging.getLogger("gauntlet.routers.agent")


@router.post("/dev")
async def dev(query: SignalQuery):
    """
    Force the agent (tool-use) pipeline.

    Skips the triad/judge and runs an agentic loop where Claude may call
    ``read_file``, ``git``, ``run_command``, ``web_search`` and friends. The
    response includes the final answer plus the full tool-call trace.
    """
    engine = require_engine()
    try:
        agent_response = await engine.process_dev_query(query)
        return agent_response.to_dict()
    except Exception as e:
        logger.error(f"Agent error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=error_envelope("agent_error", e))


@router.post("/dev/stream")
async def dev_stream(query: SignalQuery):
    """
    Streaming variant of ``/dev``. Emits one SSE event per agent step:
    ``start``, ``iteration``, ``assistant_text``, ``tool_use``, ``tool_result``,
    ``done`` (final). The run is recorded once ``done`` fires.
    """
    engine = require_engine()

    async def event_source():
        try:
            async for event in engine.process_dev_query_streaming(query):
                yield f"data: {_json.dumps(event)}\n\n"
        except Exception as e:
            logger.error(f"Agent stream error: {e}", exc_info=True)
            yield f"data: {_json.dumps({'type': 'error', **error_envelope('agent_error', e)})}\n\n"

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
