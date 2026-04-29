"""
Signal — JSON → Postgres backfill (Wave O / P-10).

One-shot script that walks the existing JSON stores under MEMORY_DIR
and seeds the Postgres tables defined by migrations/0001_initial_schema.sql.

Usage:
    cd signal-backend
    SIGNAL_DATABASE_URL=postgres://user:pass@host:5432/db \
    python -m migrate

Idempotent: each section replaces the table contents (DELETE + reinsert)
inside a transaction so re-running the script after fresh JSON writes
keeps the mirror up to date without growing duplicates. JSON remains
canonical until the cutover wave flips reads.

Sections:
  - spine.json   → missions / notes / tasks / mission_events /
                   mission_artifacts / truth_distillations / handoffs +
                   principles
  - runs.json    → runs
  - failure_memory.json → failure_records

Designed to run once before the SIGNAL_DUAL_WRITE_PG window opens, so
parity checks during dual-write start from a known seed. Safe to run
again any time — the replace-all strategy keeps the DB in step with
JSON.
"""

from __future__ import annotations

import asyncio
import json
import logging
from pathlib import Path
from typing import Any, Optional

from config import DATABASE_URL, MEMORY_DIR

logger = logging.getLogger("signal.migrate")
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")


SPINE_FILE = MEMORY_DIR / "spine.json"
RUNS_FILE = MEMORY_DIR / "runs.json"
FAILURE_FILE = MEMORY_DIR / "failure_memory.json"


def _load_json(path: Path) -> Optional[dict]:
    if not path.exists():
        logger.info("skip — %s does not exist", path)
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001
        logger.error("skip — %s unreadable: %s", path, exc)
        return None


async def _migrate_spine(pool: Any, snapshot: dict) -> None:
    """Mirror the spine snapshot. Reuses db.mirror_spine_snapshot via
    the public entrypoint so the schema mapping stays in one place."""
    from db import mirror_spine_snapshot
    await mirror_spine_snapshot(json.dumps(snapshot))
    logger.info(
        "spine: mirrored %d missions, %d principles",
        len(snapshot.get("missions") or []),
        len(snapshot.get("principles") or []),
    )


async def _migrate_runs(pool: Any, body: dict) -> None:
    records = body.get("records") or []
    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.execute("DELETE FROM runs")
            for r in records:
                rid = r.get("id")
                if not rid:
                    continue
                await conn.execute(
                    """
                    INSERT INTO runs (
                        id, timestamp, route, mission_id, question, context,
                        answer, refused, confidence, judge_reasoning,
                        tool_calls, iterations, processing_time_ms,
                        input_tokens, output_tokens,
                        terminated_early, termination_reason
                    ) VALUES (
                        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
                    )
                    """,
                    rid,
                    r.get("timestamp", ""),
                    r.get("route", "unknown"),
                    r.get("mission_id"),
                    r.get("question", ""),
                    r.get("context"),
                    r.get("answer"),
                    bool(r.get("refused", False)),
                    r.get("confidence"),
                    r.get("judge_reasoning"),
                    json.dumps(r.get("tool_calls") or []),
                    r.get("iterations"),
                    int(r.get("processing_time_ms") or 0),
                    int(r.get("input_tokens") or 0),
                    int(r.get("output_tokens") or 0),
                    bool(r.get("terminated_early", False)),
                    r.get("termination_reason"),
                )
    logger.info("runs: mirrored %d records", len(records))


async def _migrate_failure(pool: Any, body: dict) -> None:
    records = body.get("records") or []
    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.execute("DELETE FROM failure_records")
            for r in records:
                rid = r.get("id")
                if not rid:
                    continue
                await conn.execute(
                    """
                    INSERT INTO failure_records (
                        id, timestamp, question, question_fingerprint,
                        failure_type, triad_divergence_summary,
                        judge_reasoning, times_failed
                    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                    """,
                    rid,
                    r.get("timestamp", ""),
                    r.get("question", ""),
                    r.get("question_fingerprint", ""),
                    r.get("failure_type", "inconsistency"),
                    r.get("triad_divergence_summary", ""),
                    r.get("judge_reasoning", ""),
                    int(r.get("times_failed") or 1),
                )
    logger.info("failure_memory: mirrored %d records", len(records))


async def main() -> int:
    if not DATABASE_URL:
        logger.error(
            "SIGNAL_DATABASE_URL is not set — cannot run backfill. "
            "Export it before running this script."
        )
        return 2

    try:
        import asyncpg  # type: ignore
    except ImportError as exc:
        logger.error("asyncpg is not installed: %s", exc)
        return 3

    pool = await asyncpg.create_pool(
        dsn=DATABASE_URL, min_size=1, max_size=2, command_timeout=30,
    )
    try:
        spine = _load_json(SPINE_FILE)
        if spine:
            await _migrate_spine(pool, spine)
        runs = _load_json(RUNS_FILE)
        if runs:
            await _migrate_runs(pool, runs)
        failures = _load_json(FAILURE_FILE)
        if failures:
            await _migrate_failure(pool, failures)
        logger.info("backfill complete")
        return 0
    finally:
        await pool.close()


if __name__ == "__main__":
    import sys
    sys.exit(asyncio.run(main()))
