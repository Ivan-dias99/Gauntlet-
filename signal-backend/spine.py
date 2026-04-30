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
        # ── Mirror serialization (Wave O / P-6) ──────────────────────
        # Concurrent put() calls would otherwise launch independent
        # mirror tasks via asyncio.create_task — and asyncpg
        # acquire+transaction has no ordering guarantee, so an older
        # snapshot can commit after a newer one. We collapse to "always
        # mirror the latest pending snapshot" with a single-slot holder
        # plus a single worker task. Bursts of N writes commit at most
        # twice (in-flight + latest); intermediate snapshots are
        # superseded, which is correct for a replace-all mirror.
        self._mirror_pending_json: str | None = None
        self._mirror_worker_task: asyncio.Task | None = None
        self._mirror_lock = asyncio.Lock()

    async def _ensure_loaded(self) -> None:
        if self._loaded:
            return
        async with self._lock:
            if self._loaded:
                return
            await self._load()
            self._loaded = True

    async def _load(self) -> None:
        # Wave P-22 — Postgres read cutover.
        # When SIGNAL_PG_CANONICAL=1 + dual-write is enabled, prefer the
        # database as source-of-truth. Fall back to JSON automatically
        # if PG returns None (driver missing, pool failure, exception)
        # — that lets a deploy unset the flag for instant rollback
        # without losing data, since dual-write keeps JSON warm.
        try:
            from config import PG_CANONICAL
        except Exception:  # noqa: BLE001
            PG_CANONICAL = False
        if PG_CANONICAL:
            try:
                from db import read_spine_snapshot
                pg_dict = await read_spine_snapshot()
            except Exception as exc:  # noqa: BLE001
                pg_dict = None
                self._last_load_error = (
                    f"pg_read_failed: {type(exc).__name__}: {exc}"
                )
                logger.warning("PG canonical read failed — falling back to JSON: %s", exc)
            if pg_dict is not None:
                try:
                    self._snapshot = SpineSnapshot(**pg_dict)
                    logger.info(
                        "Loaded spine snapshot from Postgres: %d missions, %d principles",
                        len(self._snapshot.missions),
                        len(self._snapshot.principles),
                    )
                    return
                except Exception as exc:  # noqa: BLE001
                    self._last_load_error = (
                        f"pg_parse_failed: {type(exc).__name__}: {exc}"
                    )
                    logger.warning("PG snapshot parse failed — falling back to JSON: %s", exc)
        # JSON read path (default; or PG fallback after a degraded read).
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
        # Wave O / P-6 — serialized mirror to Postgres when
        # SIGNAL_DUAL_WRITE_PG=1 + SIGNAL_DATABASE_URL is set. We stash
        # the freshest snapshot and ensure one worker is running; bursts
        # collapse to "in-flight + latest" so older snapshots can never
        # overwrite a newer commit. db.mirror_spine_snapshot is a no-op
        # when dual-write is disabled, so this stays free in that mode.
        try:
            from db import is_enabled as _db_enabled
            if _db_enabled():
                await self._enqueue_mirror(snapshot.model_dump_json())
        except Exception:  # noqa: BLE001
            # Mirror scheduling failure must never break the JSON write
            # that already succeeded.
            pass
        return self._snapshot

    async def _enqueue_mirror(self, snapshot_json: str) -> None:
        """Queue the latest snapshot for mirroring and ensure a single
        worker is draining it. Safe to call from any put()."""
        async with self._mirror_lock:
            # Collapse-by-latest: only the most recent snapshot matters
            # for a replace-all mirror, so we just overwrite.
            self._mirror_pending_json = snapshot_json
            if self._mirror_worker_task is None or self._mirror_worker_task.done():
                self._mirror_worker_task = asyncio.create_task(self._mirror_worker())

    async def _mirror_worker(self) -> None:
        """Drain pending mirror snapshots one at a time. Always picks up
        the freshest snapshot at the start of each iteration so older
        ones get superseded without an extra DB round trip."""
        from db import mirror_spine_snapshot
        while True:
            async with self._mirror_lock:
                pending = self._mirror_pending_json
                self._mirror_pending_json = None
                if pending is None:
                    # Nothing left — drop the worker. A future put()
                    # will spawn a new one. The lock keeps this race-
                    # free against a concurrent enqueue.
                    self._mirror_worker_task = None
                    return
            try:
                await mirror_spine_snapshot(pending)
            except Exception:  # noqa: BLE001
                # mirror_spine_snapshot already swallows DB errors, but
                # if scheduling itself blows up we must not kill the
                # worker silently — log and keep draining.
                logger.exception("spine mirror worker iteration failed")


spine_store = SpineStore()
