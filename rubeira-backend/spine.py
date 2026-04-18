"""
Rubeira — Spine Store
JSON-backed persistence for the mission workspace (missions, notes, tasks,
events, principles, active selection).

Full-state sync: the client pushes a complete snapshot; the server writes it
atomically under an asyncio lock. Single-user MVP — no merge, no CRDT.
"""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timezone
from pathlib import Path

from config import MEMORY_DIR
from models import SpineSnapshot

logger = logging.getLogger("rubeira.spine")

SPINE_FILE: Path = MEMORY_DIR / "spine.json"


class SpineStore:
    """Thread-safe, JSON-backed snapshot of the mission workspace."""

    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._snapshot = SpineSnapshot()
        self._loaded = False

    async def _ensure_loaded(self) -> None:
        if self._loaded:
            return
        async with self._lock:
            if self._loaded:
                return
            await self._load()
            self._loaded = True

    async def _load(self) -> None:
        try:
            if SPINE_FILE.exists():
                raw = SPINE_FILE.read_text(encoding="utf-8")
                self._snapshot = SpineSnapshot(**json.loads(raw))
                logger.info(
                    "Loaded spine snapshot: %d missions, %d principles",
                    len(self._snapshot.missions),
                    len(self._snapshot.principles),
                )
            else:
                logger.info("No spine file found — starting fresh")
        except Exception as e:
            logger.error("Failed to load spine: %s", e)
            self._snapshot = SpineSnapshot()

    async def _save(self) -> None:
        try:
            MEMORY_DIR.mkdir(parents=True, exist_ok=True)
            SPINE_FILE.write_text(
                self._snapshot.model_dump_json(indent=2),
                encoding="utf-8",
            )
        except Exception as e:
            logger.error("Failed to save spine: %s", e)

    async def get(self) -> SpineSnapshot:
        await self._ensure_loaded()
        return self._snapshot

    async def put(self, snapshot: SpineSnapshot) -> SpineSnapshot:
        await self._ensure_loaded()
        async with self._lock:
            snapshot.last_updated = datetime.now(timezone.utc).isoformat()
            self._snapshot = snapshot
            await self._save()
        return self._snapshot


spine_store = SpineStore()
