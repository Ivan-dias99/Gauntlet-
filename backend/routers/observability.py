"""Telemetry + observability + gateway summary endpoints."""

from __future__ import annotations

import json as _json
import logging
from typing import Any, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from models import RunRecord
from runs import run_store

router = APIRouter()
logger = logging.getLogger("gauntlet.routers.observability")


class TelemetryEvent(BaseModel):
    """Lightweight client-fired telemetry event. Lands in the run log
    under a dedicated `route` so the Archive ledger can filter without
    a new store. Wave 6a minimum — the 4 consumer-side events that the
    backend cannot observe by itself."""
    event: str = Field(..., min_length=1, max_length=64)
    mission_id: Optional[str] = Field(None, max_length=128)
    payload: dict[str, Any] = Field(default_factory=dict)


@router.post("/telemetry/event")
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


@router.get("/observability/snapshot")
async def observability_snapshot():
    """Per-route p50/p95/error_rate/in_flight rolled from the in-process
    ring buffer. Live; resets on backend restart."""
    import observability
    return observability.snapshot()


@router.get("/gateway/summary")
async def gateway_summary():
    """Per-model + per-role call counts, token totals, estimated cost.
    Lives next to /diagnostics so the operator has a single place to
    audit routing + cost without scraping the run log."""
    from model_gateway import gateway as _gateway
    return _gateway.summary()
