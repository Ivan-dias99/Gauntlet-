"""
Signal — Pause Registry (Wave P-29, Tool 7 of the 10×10 doctrine matrix).

A small JSON-backed map ``task_id → PausedEntry`` recording which tasks
are currently paused. The agent loop polls ``is_paused(task_id)`` at
the top of every iteration; when the flag is set the loop yields a
``paused`` event and breaks out cleanly with
``terminated_early=True, termination_reason="paused"``.

Pause is therefore an *iteration-boundary* check, not a mid-tool kill.
Tool calls already in flight finish; the next iteration is the one that
sees the flag and stops. Keeping the semantics conservative — partial
tool work is still recorded, the run log still closes — matches the
rest of Signal's "prefer refusal over the risk of being wrong" doctrine.

Persistence shape mirrors ``runs.py`` / ``memory.py``:
  * single-writer asyncio.Lock
  * lazy load on first access
  * atomic JSON write via ``persistence.atomic_write_text_async``
  * load failures quarantine the corrupt file via
    ``persistence.quarantine_corrupt_file`` and surface through
    ``_last_load_error`` / ``_last_save_error`` for ``/diagnostics``.

Survives restart by reading ``MEMORY_DIR/paused_tasks.json`` on first
access. Single-writer matches the rest of Signal's persistence floor —
no fan-out / merge logic.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Optional

from config import MEMORY_DIR
from persistence import atomic_write_text_async, quarantine_corrupt_file

logger = logging.getLogger("gauntlet.pause")

PAUSED_FILE: Path = MEMORY_DIR / "paused_tasks.json"


@dataclass
class PausedEntry:
    """One pause record. ``paused_at`` is epoch milliseconds (matches the
    spine event log + the frontend timestamps so the doctrine timeline
    can render them on the same axis without a unit conversion)."""

    task_id: str
    paused_at: int
    reason: Optional[str] = None
    # Optional — recorded so /dev/paused can show "paused on mission X"
    # without the operator hopping to /spine.
    mission_id: Optional[str] = None

    def to_dict(self) -> dict:
        return asdict(self)

    @staticmethod
    def from_dict(raw: dict) -> "PausedEntry":
        return PausedEntry(
            task_id=str(raw.get("task_id", "")),
            paused_at=int(raw.get("paused_at", 0)),
            reason=raw.get("reason"),
            mission_id=raw.get("mission_id"),
        )


class PauseRegistry:
    """JSON-backed pause registry. Single-writer; concurrent reads are
    cheap (the in-memory dict is consulted under the lock only when
    mutating)."""

    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._entries: dict[str, PausedEntry] = {}
        self._loaded = False
        self._last_save_error: Optional[str] = None
        self._last_load_error: Optional[str] = None

    async def _ensure_loaded(self) -> None:
        if self._loaded:
            return
        async with self._lock:
            if self._loaded:
                return
            await self._load()
            self._loaded = True

    async def _load(self) -> None:
        if not PAUSED_FILE.exists():
            logger.info("No paused-tasks file found — starting empty")
            return
        try:
            raw = PAUSED_FILE.read_text(encoding="utf-8")
            data = json.loads(raw) if raw.strip() else {}
            entries: dict[str, PausedEntry] = {}
            # Accept both shapes: {entries: [...]} (preferred) and a bare
            # array of records (forward-compat tolerance — the persistence
            # tax for one extra branch is cheap and the alternative is
            # quarantining a hand-edited file).
            records = (
                data.get("entries", []) if isinstance(data, dict) else data
            )
            if isinstance(records, list):
                for r in records:
                    if not isinstance(r, dict):
                        continue
                    e = PausedEntry.from_dict(r)
                    if e.task_id:
                        entries[e.task_id] = e
            self._entries = entries
            logger.info("Loaded %d paused-task entries from disk", len(entries))
        except Exception as e:  # noqa: BLE001
            sidecar = quarantine_corrupt_file(PAUSED_FILE)
            detail = f"{type(e).__name__}: {e}"
            if sidecar is not None:
                detail += f" (quarantined to {sidecar.name})"
            self._last_load_error = detail
            logger.error("Failed to load paused-tasks file: %s", detail)
            self._entries = {}

    async def _write(self) -> None:
        body = {
            "entries": [e.to_dict() for e in self._entries.values()],
            "last_updated": int(time.time() * 1000),
        }
        try:
            await atomic_write_text_async(
                PAUSED_FILE, json.dumps(body, indent=2)
            )
            self._last_save_error = None
        except Exception as e:  # noqa: BLE001
            self._last_save_error = f"{type(e).__name__}: {e}"
            logger.error("Failed to save paused-tasks file: %s", e)

    async def mark_paused(
        self,
        task_id: str,
        reason: Optional[str] = None,
        mission_id: Optional[str] = None,
    ) -> PausedEntry:
        """Record ``task_id`` as paused. Idempotent: re-pausing an
        already-paused task overwrites the entry with the new reason
        but keeps the original ``paused_at`` timestamp so the operator
        sees how long the pause has been in force."""
        if not task_id:
            raise ValueError("task_id is required")
        await self._ensure_loaded()
        async with self._lock:
            existing = self._entries.get(task_id)
            paused_at = existing.paused_at if existing else int(time.time() * 1000)
            entry = PausedEntry(
                task_id=task_id,
                paused_at=paused_at,
                reason=reason if reason is not None else (existing.reason if existing else None),
                mission_id=mission_id if mission_id is not None else (existing.mission_id if existing else None),
            )
            self._entries[task_id] = entry
            await self._write()
            return entry

    async def unmark(self, task_id: str) -> Optional[PausedEntry]:
        """Remove the pause flag for ``task_id``. Returns the removed
        entry (or None if no such pause was active) so callers can log
        ``resumed_at`` honestly."""
        if not task_id:
            raise ValueError("task_id is required")
        await self._ensure_loaded()
        async with self._lock:
            entry = self._entries.pop(task_id, None)
            if entry is not None:
                await self._write()
            return entry

    async def is_paused(self, task_id: str) -> bool:
        """Cheap predicate used inside the agent loop. Falsey for
        empty/None task ids so the caller doesn't have to guard."""
        if not task_id:
            return False
        await self._ensure_loaded()
        return task_id in self._entries

    async def get(self, task_id: str) -> Optional[PausedEntry]:
        await self._ensure_loaded()
        return self._entries.get(task_id)

    async def list_paused(self) -> list[dict]:
        """Snapshot of all currently-paused tasks for the
        ``GET /dev/paused`` endpoint. Sorted newest-first by
        ``paused_at`` so the operator dashboard renders "what was just
        paused" at the top."""
        await self._ensure_loaded()
        items = [e.to_dict() for e in self._entries.values()]
        items.sort(key=lambda d: d.get("paused_at", 0), reverse=True)
        return items


# Module-level singleton — same pattern as run_store / failure_memory.
pause_registry = PauseRegistry()
