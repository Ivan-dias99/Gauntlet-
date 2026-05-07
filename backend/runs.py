"""
Gauntlet — Run Log
Append-only on-disk log of every query that hits the engine.

This is the first step toward real domain persistence. Missions, artifacts,
reviews, and binding records can follow the same pattern.
"""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from config import MEMORY_DIR
from models import RunRecord, RunsLog
from persistence import atomic_write_text_async, quarantine_corrupt_file

logger = logging.getLogger("gauntlet.runs")

RUNS_FILE: Path = MEMORY_DIR / "runs.json"
MAX_RUNS: int = 2000


class RunStore:
    """Thread-safe, JSON-backed run log."""

    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._log = RunsLog()
        self._loaded = False
        # Disk-write failures are surfaced through diagnostics rather than
        # raised — a broken run log must not crash a user query mid-stream.
        self._last_save_error: str | None = None
        # Load-path errors are surfaced the same way. Corrupt files are
        # quarantined so record() does not overwrite the evidence.
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
        if not RUNS_FILE.exists():
            logger.info("No run log file found — starting fresh")
            return
        try:
            raw = RUNS_FILE.read_text(encoding="utf-8")
            self._log = RunsLog(**json.loads(raw))
            logger.info("Loaded %d run records from disk", len(self._log.records))
        except Exception as e:
            sidecar = quarantine_corrupt_file(RUNS_FILE)
            detail = f"{type(e).__name__}: {e}"
            if sidecar is not None:
                detail += f" (quarantined to {sidecar.name})"
            self._last_load_error = detail
            logger.error("Failed to load run log: %s", detail)
            self._log = RunsLog()

    async def _write_log(self) -> None:
        await atomic_write_text_async(
            RUNS_FILE, self._log.model_dump_json(indent=2)
        )

    async def record(self, run: RunRecord) -> RunRecord:
        await self._ensure_loaded()
        async with self._lock:
            self._log.records.append(run)
            if len(self._log.records) > MAX_RUNS:
                self._log.records = self._log.records[-MAX_RUNS:]
            self._log.last_updated = datetime.now(timezone.utc).isoformat()
            try:
                await self._write_log()
                self._last_save_error = None
            except Exception as e:
                self._last_save_error = f"{type(e).__name__}: {e}"
                logger.error("Failed to save run log: %s", e)
        return run

    async def list(
        self,
        mission_id: Optional[str] = None,
        limit: int = 50,
    ) -> list[RunRecord]:
        await self._ensure_loaded()
        records = self._log.records
        if mission_id:
            records = [r for r in records if r.mission_id == mission_id]
        return list(reversed(records[-limit:]))

    async def get(self, run_id: str) -> Optional[RunRecord]:
        await self._ensure_loaded()
        for r in self._log.records:
            if r.id == run_id:
                return r
        return None

    async def stats(self, mission_id: Optional[str] = None) -> dict:
        await self._ensure_loaded()
        records = self._log.records
        if mission_id:
            records = [r for r in records if r.mission_id == mission_id]
        by_route: dict[str, int] = {}
        refused = 0
        latency_sum = 0
        total_in = 0
        total_out = 0
        tool_calls = 0
        for r in records:
            by_route[r.route] = by_route.get(r.route, 0) + 1
            if r.refused:
                refused += 1
            latency_sum += r.processing_time_ms
            total_in += r.input_tokens
            total_out += r.output_tokens
            tool_calls += len(r.tool_calls)
        n = len(records)
        return {
            "total": n,
            "mission_id": mission_id,
            "by_route": by_route,
            "refused": refused,
            "refusal_rate": (refused / n) if n else 0.0,
            "avg_latency_ms": int(latency_sum / n) if n else 0,
            "total_input_tokens": total_in,
            "total_output_tokens": total_out,
            "tool_calls": tool_calls,
            "last_updated": self._log.last_updated,
        }

    async def clear_since(self, hours_ago: int) -> dict:
        """Drop runs whose timestamp falls within the last `hours_ago`
        hours. Returns the count removed + remaining. Used by the
        Settings page "danger zone" to wipe a noisy testing window
        without nuking the whole ledger."""
        await self._ensure_loaded()
        if hours_ago <= 0:
            return {"removed": 0, "remaining": len(self._log.records)}
        cutoff = datetime.now(timezone.utc).timestamp() - (hours_ago * 3600)
        async with self._lock:
            kept: list[RunRecord] = []
            removed = 0
            for r in self._log.records:
                try:
                    ts = datetime.fromisoformat(
                        str(r.timestamp).replace("Z", "+00:00")
                    ).timestamp()
                except Exception:
                    ts = 0
                if ts >= cutoff:
                    removed += 1
                else:
                    kept.append(r)
            self._log.records = kept
            self._log.last_updated = datetime.now(timezone.utc).isoformat()
            try:
                await self._write_log()
                self._last_save_error = None
            except Exception as e:  # noqa: BLE001
                self._last_save_error = f"{type(e).__name__}: {e}"
                logger.error("Failed to save run log after clear: %s", e)
        return {"removed": removed, "remaining": len(self._log.records)}


# Module-level singleton
run_store = RunStore()
