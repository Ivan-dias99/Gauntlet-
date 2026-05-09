"""
Gauntlet — Composer Settings (Sprint 4 — Governance Lock).

Single JSON document under MEMORY_DIR. Loaded lazily, written atomically.
Mirrors the persistence pattern of memory.py / runs.py. The store keeps a
single ComposerSettings instance and exposes get / replace.

Design notes:
* Everything in the model has a default, so a missing file is fine —
  the store materialises a fresh ComposerSettings and the engine boots.
* On corrupt JSON we quarantine the bad file and start fresh; the disk
  read failure is surfaced to /diagnostics via _last_load_error so the
  operator sees that something happened, but the cápsula keeps working.
* No partial-update ergonomic — the Control Center always PUTs the full
  document. Simpler to reason about than PATCH; the document is small.
"""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from config import COMPOSER_SETTINGS_FILE
from models import ComposerSettings
from persistence import atomic_write_text_async, quarantine_corrupt_file

logger = logging.getLogger("gauntlet.composer.settings")


class ComposerSettingsStore:
    """Async-safe, JSON-backed governance settings."""

    def __init__(self, file: Path = COMPOSER_SETTINGS_FILE) -> None:
        self._file = file
        self._lock = asyncio.Lock()
        self._settings = ComposerSettings()
        self._loaded = False
        self._last_save_error: str | None = None
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
        if not self._file.exists():
            logger.info("No composer settings file found — using defaults")
            return
        try:
            raw = self._file.read_text(encoding="utf-8")
            self._settings = ComposerSettings(**json.loads(raw))
            logger.info(
                "Loaded composer settings from disk (%d domains, %d actions)",
                len(self._settings.domains), len(self._settings.actions),
            )
        except Exception as e:  # noqa: BLE001
            sidecar = quarantine_corrupt_file(self._file)
            detail = f"{type(e).__name__}: {e}"
            if sidecar is not None:
                detail += f" (quarantined to {sidecar.name})"
            self._last_load_error = detail
            logger.error("Failed to load composer settings: %s", detail)
            self._settings = ComposerSettings()

    async def _write(self) -> None:
        try:
            await atomic_write_text_async(
                self._file, self._settings.model_dump_json(indent=2)
            )
            self._last_save_error = None
        except Exception as e:  # noqa: BLE001
            self._last_save_error = f"{type(e).__name__}: {e}"
            logger.error("Failed to save composer settings: %s", e)

    async def get(self) -> ComposerSettings:
        await self._ensure_loaded()
        # Returns the live instance; callers must not mutate it. The store
        # is the only writer.
        return self._settings

    async def replace(self, settings: ComposerSettings) -> ComposerSettings:
        """Replace the whole document. Stamps updated_at fresh.

        Sprint 8 close — snapshots the previous document to a
        timestamped backup file before overwriting, so the operator can
        restore via /composer/settings/restore. Snapshots cap at the
        last MAX_SNAPSHOTS so disk doesn't grow unbounded over time.
        """
        await self._ensure_loaded()
        async with self._lock:
            await self._snapshot_current()
            settings.updated_at = datetime.now(timezone.utc).isoformat()
            self._settings = settings
            await self._write()
        logger.info(
            "composer.settings.replaced domains=%d actions=%d page_text_cap=%d skeleton_cap=%d",
            len(self._settings.domains),
            len(self._settings.actions),
            self._settings.max_page_text_chars,
            self._settings.max_dom_skeleton_chars,
        )
        return self._settings

    async def _snapshot_current(self) -> None:
        """Atomic write of the current document to a timestamped sidecar.
        Run before every replace() so the previous state is recoverable.
        Failures here do NOT abort replace — disk full / permission
        denied is logged as last_save_error and the operator's mutation
        still goes through. Best-effort, by design."""
        if not self._loaded:
            return
        snap_dir = self._snapshot_dir()
        try:
            snap_dir.mkdir(parents=True, exist_ok=True)
        except Exception as e:  # noqa: BLE001
            logger.warning("composer.settings.snapshot_dir_failed: %s", e)
            return
        # Microsecond precision so two PUTs in the same wall-clock
        # second don't collide and overwrite each other (test discovered
        # this — back-to-back replace() calls happen all the time when
        # the operator ramps a knob).
        ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
        snap_path = snap_dir / f"settings-{ts}.json"
        try:
            await atomic_write_text_async(
                snap_path, self._settings.model_dump_json(indent=2)
            )
        except Exception as e:  # noqa: BLE001
            logger.warning("composer.settings.snapshot_failed: %s", e)
            return
        # Prune oldest beyond the cap. List + sort by name (timestamps
        # in the filename make this lexicographic == chronological).
        try:
            existing = sorted(snap_dir.glob("settings-*.json"))
            for stale in existing[: -MAX_SNAPSHOTS]:
                stale.unlink(missing_ok=True)
        except Exception as e:  # noqa: BLE001
            logger.warning("composer.settings.snapshot_prune_failed: %s", e)

    def _snapshot_dir(self) -> Path:
        return self._file.parent / "composer_settings_snapshots"

    async def list_snapshots(self) -> list[dict]:
        """Sprint 8 close — list available snapshots, newest first.
        Each entry: {file: <name>, timestamp: <iso>, bytes: <size>}.
        Returns empty list if the dir doesn't exist yet (no replace
        has happened on this deploy)."""
        snap_dir = self._snapshot_dir()
        if not snap_dir.exists():
            return []
        out: list[dict] = []
        for p in sorted(snap_dir.glob("settings-*.json"), reverse=True):
            try:
                stat = p.stat()
            except OSError:
                continue
            # Lift the embedded timestamp from filename for display.
            name_iso = p.stem.replace("settings-", "")
            out.append({
                "file": p.name,
                "timestamp": name_iso,
                "bytes": stat.st_size,
            })
        return out

    async def restore(self, file_name: str) -> ComposerSettings:
        """Sprint 8 close — restore a snapshot identified by its file
        name. The current document is itself snapshotted first so the
        restore is reversible. Raises FileNotFoundError when the
        target snapshot is missing or its name escapes the snapshot
        dir (defensive: file_name is operator-controlled)."""
        snap_dir = self._snapshot_dir()
        # Reject path traversal — only basenames inside the snapshot dir.
        if "/" in file_name or "\\" in file_name or file_name.startswith("."):
            raise FileNotFoundError(
                f"snapshot name rejected (must be a bare basename): {file_name!r}"
            )
        target = snap_dir / file_name
        # Read with a single open() call to avoid the TOCTOU window
        # between exists() and read_text() — another worker (or the
        # operator's own cleanup script) could remove the snapshot
        # between the two calls. We surface a clean FileNotFoundError
        # in either case so the route returns 404, not 500.
        try:
            raw = target.read_text(encoding="utf-8")
        except FileNotFoundError as exc:
            raise FileNotFoundError(
                f"snapshot not found: {file_name!r}"
            ) from exc
        try:
            restored = ComposerSettings(**json.loads(raw))
        except (ValueError, json.JSONDecodeError) as exc:
            # Quarantine the corrupt snapshot so subsequent list_snapshots
            # doesn't keep offering it to the operator. Re-raise as
            # ValueError so the route surfaces a typed 422 instead of a
            # 500. JSONDecodeError is itself a ValueError subclass; we
            # widen the catch to include schema mismatches too.
            quarantine_corrupt_file(target)
            raise ValueError(
                f"snapshot {file_name!r} is corrupt or schema-mismatched: {exc}"
            ) from exc
        # restore() goes through replace() so the current doc snapshots
        # first — operator can roll forward if the restore was wrong.
        return await self.replace(restored)

    @property
    def last_save_error(self) -> Optional[str]:
        return self._last_save_error

    @property
    def last_load_error(self) -> Optional[str]:
        return self._last_load_error


MAX_SNAPSHOTS: int = 10


# Module-level singleton.
settings_store = ComposerSettingsStore()
