"""
Signal — Spine Store
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
from typing import Optional

from config import MEMORY_DIR
from models import SpineSnapshot
from persistence import atomic_write_text_async, quarantine_corrupt_file

logger = logging.getLogger("signal.spine")

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
        # In-flight Postgres mirror task. Each put() awaits the prior
        # mirror before spawning the next one so snapshots land on the
        # DB in put() order. Without this, two quick put() calls fire
        # overlapping create_task()s and the older snapshot can land
        # after the newer one, leaving the mirror stale.
        self._mirror_task: Optional[asyncio.Task] = None

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
                "Loaded spine snapshot: %d missions, %d principles",
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
        # Wave O / P-6 — fire-and-forget mirror to Postgres when
        # SIGNAL_DUAL_WRITE_PG=1 + SIGNAL_DATABASE_URL is set. Runs
        # outside the lock so the caller never waits on the DB and
        # JSON remains the canonical store. db.mirror_spine_snapshot
        # is a no-op when dual-write is disabled.
        #
        # Ordering — each put() chains its mirror onto the previous
        # one. Without that chain, two back-to-back put() calls fire
        # overlapping create_task()s and asyncpg may commit them in
        # the wrong order, leaving the mirror behind. We still keep
        # the chain off the snapshot lock so the JSON write returns
        # immediately; only the mirror itself serializes.
        try:
            from db import mirror_spine_snapshot, is_enabled as _db_enabled
            if _db_enabled():
                payload = snapshot.model_dump_json()
                prior = self._mirror_task
                self._mirror_task = asyncio.create_task(
                    self._run_mirror(prior, payload, mirror_spine_snapshot)
                )
        except Exception:  # noqa: BLE001
            # Mirror failure must never break the JSON write that
            # already succeeded.
            pass
        return self._snapshot

    async def _run_mirror(self, prior: Optional[asyncio.Task],
                          payload: str, mirror_fn) -> None:
        """Wait for the previous mirror, then run this one. Keeps
        snapshot writes ordered on the Postgres side without forcing
        the caller to block on the DB."""
        if prior is not None:
            try:
                await prior
            except Exception:  # noqa: BLE001
                # Prior failure is already logged inside mirror_fn; we
                # still need to run our own write so the mirror doesn't
                # stall on a single bad snapshot.
                pass
        try:
            await mirror_fn(payload)
        except Exception as e:  # noqa: BLE001
            # mirror_spine_snapshot already swallows DB errors, but a
            # bare guard here keeps the task from blowing up the loop
            # if the import or call site itself raises.
            logger.warning("spine mirror task failed: %s", e)


spine_store = SpineStore()
