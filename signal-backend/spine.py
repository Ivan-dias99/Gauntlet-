"""
Signal — Spine Store

SQLite-backed persistence for the mission workspace (missions, notes,
tasks, events, principles, active selection). Single-row table —
``put`` replaces the snapshot under an asyncio lock; ``get`` returns
the parsed Pydantic model.
"""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timezone

from db import get_db
from models import SpineSnapshot

logger = logging.getLogger("signal.spine")


class SpineStore:
    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._last_save_error: str | None = None
        self._last_load_error: str | None = None

    async def get(self) -> SpineSnapshot:
        db = get_db()
        try:
            row = await db.fetch_one("SELECT payload FROM spine WHERE id = 1")
        except Exception as e:  # noqa: BLE001
            self._last_load_error = f"{type(e).__name__}: {e}"
            logger.error("Spine read failed: %s", e)
            return SpineSnapshot()
        if not row:
            return SpineSnapshot()
        try:
            return SpineSnapshot(**json.loads(row["payload"]))
        except Exception as e:  # noqa: BLE001
            self._last_load_error = f"{type(e).__name__}: {e}"
            logger.error("Spine parse failed: %s", e)
            return SpineSnapshot()

    async def put(self, snapshot: SpineSnapshot) -> SpineSnapshot:
        db = get_db()
        async with self._lock:
            snapshot.last_updated = datetime.now(timezone.utc).isoformat()
            try:
                await db.execute(
                    "INSERT INTO spine(id, payload, last_updated)"
                    " VALUES (1, ?, ?)"
                    " ON CONFLICT(id) DO UPDATE SET"
                    "   payload = excluded.payload,"
                    "   last_updated = excluded.last_updated",
                    (snapshot.model_dump_json(), snapshot.last_updated),
                )
                self._last_save_error = None
            except Exception as e:  # noqa: BLE001
                self._last_save_error = f"{type(e).__name__}: {e}"
                logger.error("Spine persist failed: %s", e)
                raise
        return snapshot


spine_store = SpineStore()
