"""Telemetry + observability + gateway summary endpoints."""

from __future__ import annotations

import json as _json
import logging
from typing import Any, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field, field_validator

from models import RunRecord
from runs import run_store

router = APIRouter()
logger = logging.getLogger("gauntlet.routers.observability")


# Telemetry payload is operator-controlled and lands in runs.json. Without
# a cap, a single client can post a multi-MB JSON blob (intentional or
# bug) and balloon the ledger / log surface. 64 KB serialised covers
# every legitimate Wave-6a event with room to spare.
_TELEMETRY_PAYLOAD_MAX_BYTES = 64 * 1024
_TELEMETRY_PAYLOAD_MAX_KEYS = 100


class TelemetryEvent(BaseModel):
    """Lightweight client-fired telemetry event. Lands in the run log
    under a dedicated `route` so the Archive ledger can filter without
    a new store. Wave 6a minimum — the 4 consumer-side events that the
    backend cannot observe by itself."""
    event: str = Field(..., min_length=1, max_length=64)
    mission_id: Optional[str] = Field(None, max_length=128)
    payload: dict[str, Any] = Field(default_factory=dict)

    @field_validator("payload")
    @classmethod
    def _cap_payload(cls, v: dict[str, Any]) -> dict[str, Any]:
        if len(v) > _TELEMETRY_PAYLOAD_MAX_KEYS:
            raise ValueError(
                f"payload has {len(v)} keys (max {_TELEMETRY_PAYLOAD_MAX_KEYS})"
            )
        try:
            serialised = _json.dumps(v, default=str)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"payload is not JSON-serialisable: {exc}") from exc
        if len(serialised.encode("utf-8")) > _TELEMETRY_PAYLOAD_MAX_BYTES:
            raise ValueError(
                f"payload exceeds {_TELEMETRY_PAYLOAD_MAX_BYTES} bytes serialised"
            )
        return v


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


@router.get("/gateway/catalogue")
async def gateway_catalogue():
    """Read-only snapshot of every model the gateway knows about, with
    provider attribution, cost hints, and a boolean `available` that
    reflects whether the corresponding provider key is set on this
    process. Consumed by the cápsula's ModelSelector — the user picks
    among models that will actually run, not against the full superset.

    Active provider gating mirrors engine.py's precedence
    (MOCK > Groq > Anthropic > Gemini). Missing api keys → available=false
    so the selector can render the model greyed/disabled instead of
    silently routing to a dead provider."""
    from config import (
        ANTHROPIC_API_KEY, GAUNTLET_MOCK, GEMINI_API_KEY, GROQ_API_KEY,
    )
    from model_gateway import CATALOGUE as _CATALOGUE

    if GAUNTLET_MOCK:
        active_provider = "mock"
    elif GROQ_API_KEY:
        active_provider = "groq"
    elif ANTHROPIC_API_KEY:
        active_provider = "anthropic"
    elif GEMINI_API_KEY:
        active_provider = "gemini"
    else:
        active_provider = "none"

    def _available(provider: str) -> bool:
        if GAUNTLET_MOCK:
            return True
        if provider == "anthropic":
            return bool(ANTHROPIC_API_KEY)
        if provider == "groq":
            return bool(GROQ_API_KEY)
        if provider == "gemini":
            return bool(GEMINI_API_KEY)
        return False

    models = [
        {
            "model_id": choice.model_id,
            "provider": choice.provider,
            "cost_per_1m_input_usd": choice.cost_per_1m_input_usd,
            "cost_per_1m_output_usd": choice.cost_per_1m_output_usd,
            "notes": choice.notes,
            "available": _available(choice.provider),
        }
        for choice in _CATALOGUE.values()
    ]
    return {"active_provider": active_provider, "models": models}
