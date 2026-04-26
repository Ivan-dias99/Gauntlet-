"""
Signal — Failure Memory System

Persistent memory of questions where Signal failed to achieve consistency,
backed by SQLite. The system learns from its own failures and becomes more
cautious on repeat topics.

Matching is fingerprint-based (lowercased, punctuation-stripped, whitespace
collapsed). Repeats increment ``times_failed`` rather than creating a new
row, so the failure surface stays bounded.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
from datetime import datetime, timezone
from typing import Optional

from config import FAILURE_CONTEXT_WINDOW, MAX_FAILURE_ENTRIES
from db import get_db
from models import FailureRecord, FailureMemory, RefusalReason

logger = logging.getLogger("signal.memory")


class FailureMemoryStore:
    """SQLite-backed failure memory with append-and-update semantics."""

    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._memory_cache_dirty = True
        self._memory = FailureMemory()
        self._last_save_error: str | None = None
        self._last_load_error: str | None = None

    @staticmethod
    def _fingerprint(question: str) -> str:
        text = question.lower().strip()
        text = re.sub(r"[^\w\s]", "", text)
        text = re.sub(r"\s+", " ", text)
        return text

    @staticmethod
    def _similarity(fp1: str, fp2: str) -> float:
        words1 = set(fp1.split())
        words2 = set(fp2.split())
        if not words1 or not words2:
            return 0.0
        intersection = words1 & words2
        union = words1 | words2
        return len(intersection) / len(union)

    async def _ensure_loaded(self) -> None:
        if not self._memory_cache_dirty:
            return
        async with self._lock:
            if not self._memory_cache_dirty:
                return
            await self._load()
            self._memory_cache_dirty = False

    async def _load(self) -> None:
        db = get_db()
        try:
            rows = await db.fetch_all(
                "SELECT payload, times_failed, last_seen FROM failures"
                " ORDER BY last_seen ASC"
            )
        except Exception as e:  # noqa: BLE001
            self._last_load_error = f"{type(e).__name__}: {e}"
            logger.error("Failure-memory load failed: %s", e)
            self._memory = FailureMemory()
            return
        records: list[FailureRecord] = []
        for row in rows:
            try:
                rec = FailureRecord(**json.loads(row["payload"]))
                rec.times_failed = int(row["times_failed"])
                records.append(rec)
            except Exception as exc:  # noqa: BLE001
                logger.warning("Skipping unparseable failure row: %s", exc)
        self._memory = FailureMemory(
            records=records,
            total_failures=sum(r.times_failed for r in records),
            last_updated=datetime.now(timezone.utc).isoformat(),
        )

    async def record_failure(
        self,
        question: str,
        failure_type: RefusalReason,
        triad_divergence_summary: str = "",
        judge_reasoning: str = "",
    ) -> FailureRecord:
        await self._ensure_loaded()
        db = get_db()
        fp = self._fingerprint(question)
        now_iso = datetime.now(timezone.utc).isoformat()

        async with self._lock:
            # Try to find a sufficiently-similar existing record.
            for record in self._memory.records:
                if self._similarity(fp, record.question_fingerprint) > 0.75:
                    record.times_failed += 1
                    record.timestamp = now_iso
                    if triad_divergence_summary:
                        record.triad_divergence_summary = triad_divergence_summary
                    if judge_reasoning:
                        record.judge_reasoning = judge_reasoning
                    try:
                        await db.execute(
                            "UPDATE failures SET payload = ?, times_failed = ?, last_seen = ?"
                            " WHERE id = ?",
                            (
                                record.model_dump_json(),
                                record.times_failed,
                                now_iso,
                                record.id,
                            ),
                        )
                        self._last_save_error = None
                    except Exception as e:  # noqa: BLE001
                        self._last_save_error = f"{type(e).__name__}: {e}"
                        logger.error("Failed to update failure record: %s", e)
                    return record

            # Otherwise insert a fresh record.
            record = FailureRecord(
                question=question,
                question_fingerprint=fp,
                failure_type=failure_type,
                triad_divergence_summary=triad_divergence_summary,
                judge_reasoning=judge_reasoning,
            )
            self._memory.records.append(record)
            self._memory.total_failures += 1
            self._memory.last_updated = now_iso
            try:
                await db.execute(
                    "INSERT INTO failures(id, fingerprint, payload, times_failed, last_seen)"
                    " VALUES (?, ?, ?, ?, ?)",
                    (
                        record.id,
                        fp,
                        record.model_dump_json(),
                        record.times_failed,
                        now_iso,
                    ),
                )
                # Cheap prune by oldest.
                await db.execute(
                    "DELETE FROM failures WHERE id IN ("
                    " SELECT id FROM failures ORDER BY last_seen ASC LIMIT -1 OFFSET ?"
                    ")",
                    (MAX_FAILURE_ENTRIES,),
                )
                self._last_save_error = None
            except Exception as e:  # noqa: BLE001
                self._last_save_error = f"{type(e).__name__}: {e}"
                logger.error("Failed to insert failure record: %s", e)
            return record

    async def find_matching_failures(
        self,
        question: str,
        threshold: float = 0.45,
        max_results: int = FAILURE_CONTEXT_WINDOW,
    ) -> list[dict]:
        await self._ensure_loaded()
        fp = self._fingerprint(question)
        matches: list[tuple[float, FailureRecord]] = []
        for record in self._memory.records:
            sim = self._similarity(fp, record.question_fingerprint)
            if sim >= threshold:
                matches.append((sim, record))
        matches.sort(key=lambda x: (x[0], x[1].times_failed), reverse=True)
        return [
            {
                "question": m.question,
                "failure_type": (
                    m.failure_type.value
                    if isinstance(m.failure_type, RefusalReason)
                    else m.failure_type
                ),
                "times_failed": m.times_failed,
                "triad_divergence_summary": m.triad_divergence_summary,
                "similarity": round(sim, 3),
            }
            for sim, m in matches[:max_results]
        ]

    async def get_stats(self) -> dict:
        await self._ensure_loaded()
        return {
            "total_records": len(self._memory.records),
            "total_failures": self._memory.total_failures,
            "last_updated": self._memory.last_updated,
            "top_repeat_offenders": [
                {"question": r.question[:100], "times_failed": r.times_failed}
                for r in sorted(
                    self._memory.records,
                    key=lambda r: r.times_failed,
                    reverse=True,
                )[:5]
            ],
        }


failure_memory = FailureMemoryStore()
