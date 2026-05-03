"""
Gauntlet — Failure Memory System
Persistent memory of questions where Signal failed to achieve consistency.
The system learns from its own failures and becomes more cautious on repeat topics.
"""

from __future__ import annotations

import asyncio
import json
import re
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from config import FAILURE_MEMORY_FILE, MAX_FAILURE_ENTRIES, FAILURE_CONTEXT_WINDOW, MEMORY_DIR
from models import FailureRecord, FailureMemory, RefusalReason
from persistence import atomic_write_text_async, quarantine_corrupt_file

logger = logging.getLogger("gauntlet.memory")


class FailureMemoryStore:
    """
    Append-only failure memory with disk persistence.
    
    Design principles:
    - Failures are never deleted, only pruned when exceeding MAX_FAILURE_ENTRIES
    - Matching uses normalized fingerprints (lowered, stripped, no punctuation)
    - Thread-safe via asyncio.Lock
    - Loads from disk on init, writes on every mutation
    """
    
    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._memory = FailureMemory()
        self._loaded = False
        # Disk-write failures are surfaced through diagnostics; the engine
        # must not crash because failure memory could not be persisted.
        self._last_save_error: str | None = None
        # Load-path errors use the same channel. Corrupt files are moved
        # aside so the next record_failure() does not overwrite evidence.
        self._last_load_error: str | None = None
    
    async def _ensure_loaded(self) -> None:
        """Lazy-load from disk on first access."""
        if self._loaded:
            return
        async with self._lock:
            if self._loaded:
                return
            await self._load_from_disk()
            self._loaded = True
    
    async def _load_from_disk(self) -> None:
        """Load failure memory from JSON file."""
        if not FAILURE_MEMORY_FILE.exists():
            logger.info("No failure memory file found — starting fresh")
            return
        try:
            raw = FAILURE_MEMORY_FILE.read_text(encoding="utf-8")
            data = json.loads(raw)
            self._memory = FailureMemory(**data)
            logger.info(
                f"Loaded {len(self._memory.records)} failure records from disk"
            )
        except Exception as e:
            sidecar = quarantine_corrupt_file(FAILURE_MEMORY_FILE)
            detail = f"{type(e).__name__}: {e}"
            if sidecar is not None:
                detail += f" (quarantined to {sidecar.name})"
            self._last_load_error = detail
            logger.error(f"Failed to load failure memory: {detail}")
            self._memory = FailureMemory()
    
    async def _save_to_disk(self) -> None:
        """Persist failure memory to JSON file. Logs + surfaces errors.

        Disk I/O is offloaded to a worker thread via atomic_write_text_async
        so the event loop is not stalled while the file flushes."""
        try:
            await atomic_write_text_async(
                FAILURE_MEMORY_FILE,
                self._memory.model_dump_json(indent=2),
            )
            self._last_save_error = None
        except Exception as e:
            self._last_save_error = f"{type(e).__name__}: {e}"
            logger.error(f"Failed to save failure memory: {e}")
    
    @staticmethod
    def _fingerprint(question: str) -> str:
        """
        Normalize a question into a matching fingerprint.
        Strips punctuation, lowercases, collapses whitespace.
        """
        text = question.lower().strip()
        text = re.sub(r"[^\w\s]", "", text)  # remove punctuation
        text = re.sub(r"\s+", " ", text)     # collapse whitespace
        return text
    
    @staticmethod
    def _similarity(fp1: str, fp2: str) -> float:
        """
        Simple word-overlap similarity between two fingerprints.
        Returns 0.0–1.0. Used for fuzzy matching against prior failures.
        """
        words1 = set(fp1.split())
        words2 = set(fp2.split())
        if not words1 or not words2:
            return 0.0
        intersection = words1 & words2
        union = words1 | words2
        return len(intersection) / len(union)
    
    async def record_failure(
        self,
        question: str,
        failure_type: RefusalReason,
        triad_divergence_summary: str = "",
        judge_reasoning: str = "",
    ) -> FailureRecord:
        """
        Record a new failure. If a similar question already failed,
        increment its counter instead of creating a duplicate.
        """
        await self._ensure_loaded()
        
        fp = self._fingerprint(question)
        
        async with self._lock:
            # Check for existing similar failure
            for record in self._memory.records:
                if self._similarity(fp, record.question_fingerprint) > 0.75:
                    record.times_failed += 1
                    record.timestamp = datetime.now(timezone.utc).isoformat()
                    if triad_divergence_summary:
                        record.triad_divergence_summary = triad_divergence_summary
                    if judge_reasoning:
                        record.judge_reasoning = judge_reasoning
                    self._memory.last_updated = datetime.now(timezone.utc).isoformat()
                    await self._save_to_disk()
                    logger.info(
                        f"Updated existing failure record (times_failed={record.times_failed}): "
                        f"{question[:80]}..."
                    )
                    return record
            
            # Create new failure record
            record = FailureRecord(
                question=question,
                question_fingerprint=fp,
                failure_type=failure_type,
                triad_divergence_summary=triad_divergence_summary,
                judge_reasoning=judge_reasoning,
            )
            
            self._memory.records.append(record)
            self._memory.total_failures += 1
            self._memory.last_updated = datetime.now(timezone.utc).isoformat()
            
            # Prune if over limit (remove oldest)
            if len(self._memory.records) > MAX_FAILURE_ENTRIES:
                self._memory.records = self._memory.records[-MAX_FAILURE_ENTRIES:]
            
            await self._save_to_disk()
            logger.info(f"Recorded new failure: {question[:80]}...")
            return record
    
    async def find_matching_failures(
        self,
        question: str,
        threshold: float = 0.45,
        max_results: int = FAILURE_CONTEXT_WINDOW,
    ) -> list[dict]:
        """
        Find past failures that are similar to the current question.
        Returns dicts suitable for injection into the system prompt.
        """
        await self._ensure_loaded()
        
        fp = self._fingerprint(question)
        matches: list[tuple[float, FailureRecord]] = []
        
        for record in self._memory.records:
            sim = self._similarity(fp, record.question_fingerprint)
            if sim >= threshold:
                matches.append((sim, record))
        
        # Sort by similarity descending, then by times_failed descending
        matches.sort(key=lambda x: (x[0], x[1].times_failed), reverse=True)
        
        return [
            {
                "question": m.question,
                "failure_type": m.failure_type.value if isinstance(m.failure_type, RefusalReason) else m.failure_type,
                "times_failed": m.times_failed,
                "triad_divergence_summary": m.triad_divergence_summary,
                "similarity": round(sim, 3),
            }
            for sim, m in matches[:max_results]
        ]
    
    async def get_stats(self) -> dict:
        """Return summary statistics about failure memory."""
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
                    reverse=True
                )[:5]
            ],
        }


# Module-level singleton
failure_memory = FailureMemoryStore()
