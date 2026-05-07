"""
Gauntlet — Memory / Canon Lock (Sprint 7).

Operator-callable memory store: user-scoped + project-scoped + canon
records. Sits alongside the legacy failure_memory.json (which records
the triad's consensus failures) and the runs.json ledger (per-execution
provenance). This store carries operator intent: notes, decisions,
preferences, ratified canon.

The composer pipeline calls `find_relevant` on every preview/dom_plan
to inject continuity into the model context — that's the "uses memory
on next execution" deliverable from Sprint 7.

Design:
* Append-mostly: `times_seen` increments on duplicate fingerprint hits.
* Atomic JSON write via persistence.atomic_write_text_async.
* Corrupt files quarantine; missing file = empty store.
* No global lock around find_relevant — that path is read-only on the
  loaded list, the only writer is record() under self._lock.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from config import MAX_MEMORY_RECORDS, MEMORY_RECORDS_FILE
from models import MemoryRecord, MemoryStoreSnapshot
from persistence import atomic_write_text_async, quarantine_corrupt_file

logger = logging.getLogger("gauntlet.memory_records")


def _fingerprint(topic: str, body: str) -> str:
    """Normalize topic + leading body slice into a matching key.
    Same intent as memory.py's _fingerprint, kept local so the two
    stores stay independent."""
    text = f"{topic} :: {body[:200]}".lower().strip()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text


def _similarity(fp_a: str, fp_b: str) -> float:
    words_a = set(fp_a.split())
    words_b = set(fp_b.split())
    if not words_a or not words_b:
        return 0.0
    inter = words_a & words_b
    union = words_a | words_b
    return len(inter) / len(union)


class MemoryRecordsStore:
    """Async-safe JSON-backed memory store."""

    def __init__(self, file: Path = MEMORY_RECORDS_FILE) -> None:
        self._file = file
        self._lock = asyncio.Lock()
        self._snapshot = MemoryStoreSnapshot()
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
            logger.info("No memory_records file found — starting fresh")
            return
        try:
            raw = self._file.read_text(encoding="utf-8")
            self._snapshot = MemoryStoreSnapshot(**json.loads(raw))
            logger.info(
                "Loaded %d memory records from disk", len(self._snapshot.records)
            )
        except Exception as e:  # noqa: BLE001
            sidecar = quarantine_corrupt_file(self._file)
            detail = f"{type(e).__name__}: {e}"
            if sidecar is not None:
                detail += f" (quarantined to {sidecar.name})"
            self._last_load_error = detail
            logger.error("Failed to load memory_records: %s", detail)
            self._snapshot = MemoryStoreSnapshot()

    async def _write(self) -> None:
        try:
            await atomic_write_text_async(
                self._file, self._snapshot.model_dump_json(indent=2)
            )
            self._last_save_error = None
        except Exception as e:  # noqa: BLE001
            self._last_save_error = f"{type(e).__name__}: {e}"
            logger.error("Failed to save memory_records: %s", e)

    async def list(
        self,
        kind: Optional[str] = None,
        scope: Optional[str] = None,
        project_id: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 200,
    ) -> list[MemoryRecord]:
        await self._ensure_loaded()
        items = self._snapshot.records
        if kind:
            items = [r for r in items if r.kind == kind]
        if scope:
            items = [r for r in items if r.scope == scope]
        if project_id:
            items = [r for r in items if r.project_id == project_id]
        if search:
            q = search.lower()
            items = [
                r for r in items
                if q in r.topic.lower() or q in r.body.lower()
            ]
        # Newest first.
        items_sorted = sorted(items, key=lambda r: r.updated_at, reverse=True)
        return items_sorted[:limit]

    async def record(
        self,
        topic: str,
        body: str,
        kind: str = "note",
        scope: str = "user",
        project_id: Optional[str] = None,
    ) -> MemoryRecord:
        """Insert a new record OR bump times_seen on a near-duplicate
        within the same scope+project. Fingerprint matches at 0.85+
        merge into the existing entry."""
        await self._ensure_loaded()
        fp = _fingerprint(topic, body)
        async with self._lock:
            # Look for a near-duplicate in the same scope/project.
            for r in self._snapshot.records:
                if r.scope != scope or r.project_id != project_id:
                    continue
                if _similarity(fp, r.fingerprint) >= 0.85:
                    r.times_seen += 1
                    r.updated_at = datetime.now(timezone.utc).isoformat()
                    # Refresh body if the new body is meaningfully longer
                    # (operator added detail) — preserves the most-
                    # informative version.
                    if len(body) > len(r.body) + 40:
                        r.body = body
                    self._snapshot.last_updated = r.updated_at
                    await self._write()
                    return r
            record = MemoryRecord(
                kind=kind,  # type: ignore[arg-type]
                scope=scope,  # type: ignore[arg-type]
                project_id=project_id,
                topic=topic,
                body=body,
                fingerprint=fp,
            )
            self._snapshot.records.append(record)
            if len(self._snapshot.records) > MAX_MEMORY_RECORDS:
                self._snapshot.records = self._snapshot.records[-MAX_MEMORY_RECORDS:]
            self._snapshot.last_updated = record.updated_at
            await self._write()
            logger.info(
                "memory_records.recorded id=%s kind=%s scope=%s project=%s topic=%r",
                record.id, kind, scope, project_id, topic[:60],
            )
            return record

    async def delete(self, record_id: str) -> bool:
        await self._ensure_loaded()
        async with self._lock:
            before = len(self._snapshot.records)
            self._snapshot.records = [
                r for r in self._snapshot.records if r.id != record_id
            ]
            if len(self._snapshot.records) == before:
                return False
            self._snapshot.last_updated = datetime.now(timezone.utc).isoformat()
            await self._write()
            return True

    async def forget_all(self) -> int:
        """Drop every record. Returns the count removed. Backs the
        Settings page "memory forget all" button — irreversible by
        design (no snapshotting, the operator confirmed twice client-side)."""
        await self._ensure_loaded()
        async with self._lock:
            removed = len(self._snapshot.records)
            self._snapshot.records = []
            self._snapshot.last_updated = datetime.now(timezone.utc).isoformat()
            await self._write()
            return removed

    async def projects(self) -> list[str]:
        await self._ensure_loaded()
        seen: set[str] = set()
        for r in self._snapshot.records:
            if r.project_id:
                seen.add(r.project_id)
        return sorted(seen)

    async def find_relevant(
        self,
        query: str,
        project_id: Optional[str] = None,
        threshold: float = 0.18,
        max_results: int = 5,
    ) -> list[MemoryRecord]:
        """Return top-N similar records by fingerprint, scoped to the
        active project (project records win) plus user-scoped records.
        Used by composer.py to inject continuity into model context."""
        await self._ensure_loaded()
        fp = _fingerprint(query, "")
        scored: list[tuple[float, MemoryRecord]] = []
        for r in self._snapshot.records:
            if r.scope == "project" and r.project_id != project_id:
                continue
            sim = _similarity(fp, r.fingerprint)
            # Boost canon entries — they're authoritative.
            if r.kind == "canon":
                sim += 0.15
            # Boost project-scoped records over global user notes when
            # both match — locality wins on ties.
            if r.scope == "project":
                sim += 0.05
            if sim >= threshold:
                scored.append((sim, r))
        scored.sort(key=lambda t: (t[0], t[1].times_seen), reverse=True)
        return [r for _, r in scored[:max_results]]

    async def stats(self) -> dict:
        await self._ensure_loaded()
        by_kind: dict[str, int] = {}
        by_scope: dict[str, int] = {}
        for r in self._snapshot.records:
            by_kind[r.kind] = by_kind.get(r.kind, 0) + 1
            by_scope[r.scope] = by_scope.get(r.scope, 0) + 1
        return {
            "total": len(self._snapshot.records),
            "by_kind": by_kind,
            "by_scope": by_scope,
            "last_updated": self._snapshot.last_updated,
        }


# Module-level singleton, mirroring run_store / failure_memory.
memory_records_store = MemoryRecordsStore()
