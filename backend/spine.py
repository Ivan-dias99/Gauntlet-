"""
Gauntlet — Spine Store
JSON-backed persistence for the mission workspace (missions, notes, tasks,
events, principles, active selection).

Full-state sync: the client pushes a complete snapshot; the server writes it
atomically under an asyncio lock. Single-user MVP — no merge, no CRDT.

JSON-on-disk is the canonical (and only) source of truth. The Postgres
dual-write / cutover code was dropped before v1.0 — it was never read in
production and made the store harder to reason about. If load justifies
it later, re-introduce with a clean design under a single feature flag.
"""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timezone
from pathlib import Path

from config import MEMORY_DIR
from models import SpineSnapshot
from persistence import atomic_write_text_async, quarantine_corrupt_file

logger = logging.getLogger("gauntlet.spine")

SPINE_FILE: Path = MEMORY_DIR / "spine.json"


class SpineStore:
    """Thread-safe, JSON-backed snapshot of the mission workspace."""

    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._snapshot = SpineSnapshot()
        self._loaded = False
        # Honest surface for disk-write failures. put() raises, but for
        # diagnostics / health checks we keep the last error message.
        self._last_save_error: str | None = None
        # Load-path errors — corrupt files, unreadable filesystem. The
        # store still boots on an empty snapshot so the server stays up,
        # but the degraded state is visible via /diagnostics.
        self._last_load_error: str | None = None

    async def _ensure_loaded(self) -> None:
        if self._loaded:
            return
        async with self._lock:
            if self._loaded:
                return
            await self._load()
            self._loaded = True

    async def _load(self) -> None:
        if not SPINE_FILE.exists():
            logger.info("No spine file found — starting fresh")
            return
        try:
            raw = SPINE_FILE.read_text(encoding="utf-8")
            self._snapshot = SpineSnapshot(**json.loads(raw))
            logger.info(
                "Loaded spine snapshot from JSON: %d missions, %d principles",
                len(self._snapshot.missions),
                len(self._snapshot.principles),
            )
        except Exception as e:
            # Corrupt or unparseable — quarantine the file so the next
            # put() does not overwrite the only evidence. Server keeps
            # booting on an empty snapshot; /diagnostics surfaces the
            # error and the sidecar path.
            sidecar = quarantine_corrupt_file(SPINE_FILE)
            detail = f"{type(e).__name__}: {e}"
            if sidecar is not None:
                detail += f" (quarantined to {sidecar.name})"
            self._last_load_error = detail
            logger.error("Failed to load spine: %s", detail)
            self._snapshot = SpineSnapshot()

    async def _write_snapshot(self, snapshot: SpineSnapshot) -> None:
        # Offloaded to a worker thread via atomic_write_text_async so the
        # event loop stays responsive while the snapshot persists. Called
        # under the asyncio lock, so still no concurrent writer.
        await atomic_write_text_async(
            SPINE_FILE, snapshot.model_dump_json(indent=2)
        )

    async def get(self) -> SpineSnapshot:
        await self._ensure_loaded()
        return self._snapshot

    async def put(self, snapshot: SpineSnapshot) -> SpineSnapshot:
        # Disk first, memory second. If the write fails the in-memory
        # snapshot stays consistent with disk and the caller sees the
        # raised exception — the API must not claim a persisted state
        # it cannot back up on the filesystem.
        await self._ensure_loaded()
        async with self._lock:
            snapshot.last_updated = datetime.now(timezone.utc).isoformat()
            try:
                await self._write_snapshot(snapshot)
            except Exception as e:
                self._last_save_error = f"{type(e).__name__}: {e}"
                logger.error("Failed to save spine: %s", e)
                raise
            self._last_save_error = None
            self._snapshot = snapshot
        return self._snapshot


spine_store = SpineStore()
