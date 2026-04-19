"""
Ruberra — Run Log
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

logger = logging.getLogger("ruberra.runs")

RUNS_FILE: Path = MEMORY_DIR / "runs.json"
MAX_RUNS: int = 2000


class RunStore:
    """Thread-safe, JSON-backed run log."""

    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._log = RunsLog()
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
            if RUNS_FILE.exists():
                raw = RUNS_FILE.read_text(encoding="utf-8")
                self._log = RunsLog(**json.loads(raw))
                logger.info("Loaded %d run records from disk", len(self._log.records))
            else:
                logger.info("No run log file found — starting fresh")
        except Exception as e:
            logger.error("Failed to load run log: %s", e)
            self._log = RunsLog()

    async def _save(self) -> None:
        try:
            MEMORY_DIR.mkdir(parents=True, exist_ok=True)
            RUNS_FILE.write_text(self._log.model_dump_json(indent=2), encoding="utf-8")
        except Exception as e:
            logger.error("Failed to save run log: %s", e)

    async def record(self, run: RunRecord) -> RunRecord:
        await self._ensure_loaded()
        async with self._lock:
            self._log.records.append(run)
            if len(self._log.records) > MAX_RUNS:
                self._log.records = self._log.records[-MAX_RUNS:]
            self._log.last_updated = datetime.now(timezone.utc).isoformat()
            await self._save()
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


# Module-level singleton
run_store = RunStore()
