"""Failure memory + memory_records endpoints."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from memory import failure_memory
from models import MemoryRecordCreate, MemoryRecoverRequest, MemoryRecoverResponse

router = APIRouter()


# ── Failure memory ─────────────────────────────────────────────────────────

@router.get("/memory/stats")
async def memory_stats():
    """Get failure memory statistics."""
    stats = await failure_memory.get_stats()
    return stats


@router.get("/memory/failures")
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


@router.post("/memory/clear")
async def clear_memory(confirmation: ClearConfirmation):
    """Clear all failure memory. Requires explicit confirmation."""
    if not confirmation.confirm:
        return {"cleared": False, "message": "Confirmation required (confirm=true)"}

    async with failure_memory._lock:
        from models import FailureMemory
        failure_memory._memory = FailureMemory()
        await failure_memory._save_to_disk()

    return {"cleared": True, "message": "Failure memory cleared"}


# ── memory_records (Sprint 7) — danger zone forget_all + CRUD + recover ───

class _ForgetConfirmation(BaseModel):
    confirm: bool = False


@router.post("/memory/forget_all")
async def forget_all_memory(payload: _ForgetConfirmation):
    """Drop every memory record (notes, decisions, canon, preferences,
    failure_patterns). Failure memory (failure_memory.json) is wiped via
    the existing /memory/clear endpoint — this one targets the operator-
    facing memory_records.json store. Snapshots first; sidecar path
    returned so the operator can recover from a misclick."""
    if not payload.confirm:
        return {"forgotten": False, "message": "Confirmation required (confirm=true)"}
    from memory_records import memory_records_store

    result = await memory_records_store.forget_all()
    return {"forgotten": True, **result}


@router.get("/memory/records")
async def list_memory_records(
    kind: Optional[str] = None,
    scope: Optional[str] = None,
    project_id: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 200,
):
    """Sprint 7 — list operator-callable memory entries. Filters compose:
    pass kind, scope, project_id, search (substring on topic+body) to
    narrow. Newest first."""
    from memory_records import memory_records_store
    records = await memory_records_store.list(
        kind=kind, scope=scope, project_id=project_id, search=search, limit=limit,
    )
    return {
        "count": len(records),
        "records": [r.model_dump() for r in records],
    }


@router.post("/memory/records")
async def create_memory_record(req: MemoryRecordCreate):
    """Create or merge-by-fingerprint a memory entry. Operator + cápsula
    + memory_save tool all funnel through here. Pydantic validates the
    body so malformed payloads get a clean 422 instead of a 500."""
    from memory_records import memory_records_store

    record = await memory_records_store.record(
        topic=req.topic,
        body=req.body,
        kind=req.kind,
        scope=req.scope,
        project_id=req.project_id,
    )
    return record.model_dump()


@router.delete("/memory/records/{record_id}")
async def delete_memory_record(record_id: str):
    from memory_records import memory_records_store
    deleted = await memory_records_store.delete(record_id)
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "memory_record_not_found",
                "reason": "KeyError",
                "message": f"no record with id {record_id}",
            },
        )
    return {"deleted": True, "id": record_id}


@router.get("/memory/projects")
async def list_memory_projects():
    from memory_records import memory_records_store
    return {"projects": await memory_records_store.projects()}


@router.post("/memory/recover", response_model=MemoryRecoverResponse)
async def recover_memory(req: MemoryRecoverRequest):
    """Sprint 7 — context recovery hook. Returns up to N similar prior
    records for a query, scoped to project_id when supplied. The composer
    pipeline calls this to inject continuity into model context; ad-hoc
    operator queries hit it too."""
    from memory_records import memory_records_store

    matches = await memory_records_store.find_relevant(
        query=req.query,
        project_id=req.project_id,
        max_results=req.max_results,
    )
    return MemoryRecoverResponse(
        matches=matches,
        query=req.query,
        project_id=req.project_id,
    )


@router.get("/memory/records/stats")
async def memory_records_stats():
    from memory_records import memory_records_store
    return await memory_records_store.stats()
