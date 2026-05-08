"""Run log + ledger-clear endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from runs import run_store

router = APIRouter()


@router.get("/runs")
async def list_runs(mission_id: str | None = None, limit: int = 50):
    """List recent runs, optionally filtered by mission_id."""
    records = await run_store.list(mission_id=mission_id, limit=limit)
    return {
        "count": len(records),
        "mission_id": mission_id,
        "records": [r.model_dump() for r in records],
    }


@router.get("/runs/stats")
async def runs_stats(mission_id: str | None = None):
    """Aggregate stats, optionally filtered by mission_id."""
    return await run_store.stats(mission_id=mission_id)


@router.get("/runs/{run_id}")
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


# ── Danger zone ────────────────────────────────────────────────────────────

class DangerConfirmation(BaseModel):
    confirm: bool = False
    since_hours: int | None = None  # only used by /ledger/clear


@router.post("/ledger/clear")
async def clear_ledger(payload: DangerConfirmation):
    """Drop runs in the last `since_hours` (default: 24). Requires
    `confirm: true`. Returns counts so the UI can show a toast."""
    if not payload.confirm:
        return {"cleared": False, "message": "Confirmation required (confirm=true)"}
    hours = payload.since_hours if payload.since_hours is not None else 24
    result = await run_store.clear_since(hours)
    return {"cleared": True, "since_hours": hours, **result}
