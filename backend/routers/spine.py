"""Mission workspace (spine) endpoints."""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from models import SpineSnapshot
from runtime import error_envelope
from spine import spine_store

router = APIRouter()
logger = logging.getLogger("gauntlet.routers.spine")


@router.get("/spine", response_model=SpineSnapshot)
async def get_spine():
    """Return the full mission workspace snapshot."""
    return await spine_store.get()


@router.post("/spine", response_model=SpineSnapshot)
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
            detail=error_envelope("spine_persist_failed", e),
        )
