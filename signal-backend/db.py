"""
Signal — SQLite store

Single ``signal.db`` file, three tables:
  * runs       — append-only run log (one row per agent/triad/crew/surface call)
  * spine      — single-row workspace snapshot
  * failures   — failure-memory records keyed by question fingerprint

Why SQLite over the previous JSON approach:
  * implicit per-write lock via WAL mode, no separate fcntl dance
  * indexable mission_id / fingerprint queries (was O(n) over JSON)
  * one file to back up, one volume mount, no rotation logic
  * a quarantined-corrupt fallback still applies if the DB itself is unreadable

Schema is created at first connect; migrations run idempotently. The
one-shot import of legacy JSON sidecars happens here so the rest of the
backend never has to think about the old layout.
"""

from __future__ import annotations

import asyncio
import json
import logging
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Optional

from config import (
    DATA_DIR,
    LEGACY_FAILURE_MEMORY_FILE,
    LEGACY_RUNS_FILE,
    LEGACY_SPINE_FILE,
    SIGNAL_DB_FILE,
)
from persistence import quarantine_corrupt_file

logger = logging.getLogger("signal.db")


_SCHEMA = """
CREATE TABLE IF NOT EXISTS runs (
  id              TEXT PRIMARY KEY,
  timestamp       TEXT NOT NULL,
  route           TEXT NOT NULL,
  mission_id      TEXT,
  refused         INTEGER NOT NULL DEFAULT 0,
  payload         TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_runs_mission ON runs(mission_id);
CREATE INDEX IF NOT EXISTS idx_runs_timestamp ON runs(timestamp);

CREATE TABLE IF NOT EXISTS spine (
  id              INTEGER PRIMARY KEY CHECK (id = 1),
  payload         TEXT NOT NULL,
  last_updated    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS failures (
  id              TEXT PRIMARY KEY,
  fingerprint     TEXT NOT NULL,
  payload         TEXT NOT NULL,
  times_failed    INTEGER NOT NULL DEFAULT 1,
  last_seen       TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_failures_fingerprint ON failures(fingerprint);
CREATE INDEX IF NOT EXISTS idx_failures_last_seen ON failures(last_seen);
"""


class SignalDB:
    """Async-friendly wrapper over a single SQLite file."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self._lock = asyncio.Lock()
        self._conn: sqlite3.Connection | None = None
        self._last_load_error: str | None = None

    # ── lifecycle ────────────────────────────────────────────────────────
    def _connect(self) -> sqlite3.Connection:
        if self._conn is not None:
            return self._conn
        self.path.parent.mkdir(parents=True, exist_ok=True)
        try:
            conn = sqlite3.connect(
                str(self.path),
                isolation_level=None,  # autocommit; we use explicit transactions
                check_same_thread=False,
            )
        except sqlite3.DatabaseError as exc:
            sidecar = quarantine_corrupt_file(self.path)
            self._last_load_error = (
                f"{type(exc).__name__}: {exc}"
                + (f" (quarantined to {sidecar.name})" if sidecar else "")
            )
            logger.error("SQLite open failed: %s", self._last_load_error)
            # Recreate fresh after quarantine.
            conn = sqlite3.connect(
                str(self.path),
                isolation_level=None,
                check_same_thread=False,
            )
        conn.row_factory = sqlite3.Row
        conn.executescript("PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;")
        conn.executescript(_SCHEMA)
        self._conn = conn
        return conn

    async def execute(self, sql: str, params: Iterable[Any] = ()) -> None:
        async with self._lock:
            conn = self._connect()
            await asyncio.to_thread(conn.execute, sql, tuple(params))

    async def fetch_one(self, sql: str, params: Iterable[Any] = ()) -> sqlite3.Row | None:
        async with self._lock:
            conn = self._connect()
            cur = await asyncio.to_thread(conn.execute, sql, tuple(params))
            return await asyncio.to_thread(cur.fetchone)

    async def fetch_all(self, sql: str, params: Iterable[Any] = ()) -> list[sqlite3.Row]:
        async with self._lock:
            conn = self._connect()
            cur = await asyncio.to_thread(conn.execute, sql, tuple(params))
            return await asyncio.to_thread(cur.fetchall)

    @property
    def last_load_error(self) -> Optional[str]:
        return self._last_load_error


_db = SignalDB(SIGNAL_DB_FILE)


def get_db() -> SignalDB:
    return _db


# ── One-shot migration from the legacy JSON sidecars ────────────────────────

async def migrate_legacy_json_if_needed() -> dict:
    """Import legacy JSON files into SQLite once.

    Idempotent: runs only if the legacy files exist *and* the corresponding
    table is empty. After a successful import the legacy file is renamed to
    ``<name>.migrated`` so a second boot does not re-import or report it as
    pending. Failures are logged but never raised — a broken legacy file
    must not block the server from starting on a fresh DB.

    Returns a small report so /diagnostics can show what happened.
    """
    report: dict[str, Any] = {"runs": 0, "spine": False, "failures": 0, "errors": []}
    db = get_db()

    # ── runs.json ────────────────────────────────────────────────────────
    if LEGACY_RUNS_FILE.exists():
        existing = await db.fetch_one("SELECT COUNT(*) AS n FROM runs")
        if (existing["n"] if existing else 0) == 0:
            try:
                raw = json.loads(LEGACY_RUNS_FILE.read_text(encoding="utf-8"))
                records = raw.get("records", []) if isinstance(raw, dict) else []
                imported = 0
                for rec in records:
                    rid = rec.get("id")
                    if not rid:
                        continue
                    await db.execute(
                        "INSERT OR IGNORE INTO runs(id, timestamp, route, mission_id, refused, payload)"
                        " VALUES (?, ?, ?, ?, ?, ?)",
                        (
                            rid,
                            rec.get("timestamp") or _now_iso(),
                            rec.get("route") or "unknown",
                            rec.get("mission_id"),
                            1 if rec.get("refused") else 0,
                            json.dumps(rec, ensure_ascii=False),
                        ),
                    )
                    imported += 1
                report["runs"] = imported
                LEGACY_RUNS_FILE.rename(LEGACY_RUNS_FILE.with_suffix(".json.migrated"))
                logger.info("Migrated %d run records from legacy JSON", imported)
            except Exception as exc:  # noqa: BLE001
                report["errors"].append({"file": "runs.json", "error": str(exc)})
                logger.error("Run log migration failed: %s", exc)

    # ── spine.json ───────────────────────────────────────────────────────
    if LEGACY_SPINE_FILE.exists():
        existing = await db.fetch_one("SELECT COUNT(*) AS n FROM spine")
        if (existing["n"] if existing else 0) == 0:
            try:
                raw = LEGACY_SPINE_FILE.read_text(encoding="utf-8")
                # Sanity-parse so a corrupt JSON is not silently stored.
                json.loads(raw)
                await db.execute(
                    "INSERT INTO spine(id, payload, last_updated) VALUES (1, ?, ?)",
                    (raw, _now_iso()),
                )
                report["spine"] = True
                LEGACY_SPINE_FILE.rename(LEGACY_SPINE_FILE.with_suffix(".json.migrated"))
                logger.info("Migrated spine snapshot from legacy JSON")
            except Exception as exc:  # noqa: BLE001
                report["errors"].append({"file": "spine.json", "error": str(exc)})
                logger.error("Spine migration failed: %s", exc)

    # ── failure_memory.json ──────────────────────────────────────────────
    if LEGACY_FAILURE_MEMORY_FILE.exists():
        existing = await db.fetch_one("SELECT COUNT(*) AS n FROM failures")
        if (existing["n"] if existing else 0) == 0:
            try:
                raw = json.loads(LEGACY_FAILURE_MEMORY_FILE.read_text(encoding="utf-8"))
                records = raw.get("records", []) if isinstance(raw, dict) else []
                imported = 0
                for rec in records:
                    rid = rec.get("id")
                    if not rid:
                        continue
                    await db.execute(
                        "INSERT OR IGNORE INTO failures"
                        "(id, fingerprint, payload, times_failed, last_seen)"
                        " VALUES (?, ?, ?, ?, ?)",
                        (
                            rid,
                            rec.get("question_fingerprint") or "",
                            json.dumps(rec, ensure_ascii=False),
                            int(rec.get("times_failed") or 1),
                            rec.get("timestamp") or _now_iso(),
                        ),
                    )
                    imported += 1
                report["failures"] = imported
                LEGACY_FAILURE_MEMORY_FILE.rename(
                    LEGACY_FAILURE_MEMORY_FILE.with_suffix(".json.migrated")
                )
                logger.info("Migrated %d failure records from legacy JSON", imported)
            except Exception as exc:  # noqa: BLE001
                report["errors"].append({"file": "failure_memory.json", "error": str(exc)})
                logger.error("Failure memory migration failed: %s", exc)

    return report


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
