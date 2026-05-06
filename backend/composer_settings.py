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
        """Replace the whole document. Stamps updated_at fresh."""
        await self._ensure_loaded()
        async with self._lock:
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

    @property
    def last_save_error(self) -> Optional[str]:
        return self._last_save_error

    @property
    def last_load_error(self) -> Optional[str]:
        return self._last_load_error


# Module-level singleton.
settings_store = ComposerSettingsStore()
