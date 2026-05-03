"""
Signal — JSON → Postgres backfill (Wave O / P-10).

One-shot script that walks the existing JSON stores under MEMORY_DIR
and seeds the Postgres tables defined by migrations/0001_initial_schema.sql.

Usage:
    cd backend
    GAUNTLET_DATABASE_URL=postgres://user:pass@host:5432/db \
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

logger = logging.getLogger("gauntlet.migrate")
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")


SPINE_FILE = MEMORY_DIR / "spine.json"
RUNS_FILE = MEMORY_DIR / "runs.json"
FAILURE_FILE = MEMORY_DIR / "failure_memory.json"


def _load_json(path: Path) -> Optional[dict]:
    """Return the parsed JSON body, or None when the file does not
    exist (the legitimate "nothing to seed" case).

    Read or parse failures are RAISED — never swallowed — so the
    backfill aborts with a non-zero exit instead of silently skipping
    a corrupt section under a "backfill complete" log. The operator
    must see partial parity as a failure before advancing to the
    dual-write window.
    """
    if not path.exists():
        logger.info("skip — %s does not exist", path)
        return None
    try:
        raw = path.read_text(encoding="utf-8")
    except OSError as exc:
        # Filesystem-level failure — surface it so main() exits non-zero.
        raise RuntimeError(f"unreadable file {path}: {exc}") from exc
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        # Corrupt JSON — never silently skip. The operator must fix the
        # source file (or quarantine it) before the backfill is trusted.
        raise RuntimeError(f"corrupt JSON in {path}: {exc}") from exc


async def _migrate_spine(pool: Any, snapshot: dict) -> None:
    """Mirror the spine snapshot using the migration pool directly.

    Bypasses ``db.mirror_spine_snapshot`` because that helper is gated on
    ``SIGNAL_DUAL_WRITE_PG`` (it returns immediately when the toggle is
    off) and swallows DB exceptions. The backfill is the documented
    pre-window seed: it must write regardless of the dual-write toggle
    and must surface failures so the operator sees a non-zero exit.
    """
    from db import write_spine_snapshot
    await write_spine_snapshot(pool, snapshot)
    logger.info(
        "spine: mirrored %d missions, %d principles, %d distillations",
        len(snapshot.get("missions") or []),
        len(snapshot.get("principles") or []),
        sum(
            len((m.get("truthDistillations") or []))
            for m in (snapshot.get("missions") or [])
        ),
    )


async def _migrate_runs(pool: Any, body: dict) -> None:
    records = body.get("records") or []
    # runs.mission_id is FK to missions(id). Legacy snapshots may carry
    # mission_ids for missions that have since been deleted (or otherwise
    # drifted out of spine.json). Inserting those raw would trip the FK
    # and abort the whole transaction. Coalesce orphans to NULL — the
    # schema allows NULL on runs.mission_id (ON DELETE SET NULL).
    #
    # Source-of-truth for valid mission ids is the database itself after
    # _migrate_spine committed — querying missions(id) directly avoids
    # a TOCTOU mismatch with spine.json and duplicating the schema mapping.
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT id FROM missions")
    valid_mission_ids = {r["id"] for r in rows}
    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.execute("DELETE FROM runs")
            for r in records:
                rid = r.get("id")
                if not rid:
                    continue
                raw_mid = r.get("mission_id")
                mid = raw_mid if raw_mid in valid_mission_ids else None
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
                    mid,
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
    # Each section runs in its own transaction. Any failure must surface
    # (non-zero exit) so the operator does not ship an incomplete seed
    # under a "backfill complete" log. _load_json now raises on
    # unreadable / corrupt files instead of returning None, so a
    # partial seed is impossible.
    sections: list[tuple[str, Path, Any]] = [
        ("spine", SPINE_FILE, _migrate_spine),
        ("runs", RUNS_FILE, _migrate_runs),
        ("failure_memory", FAILURE_FILE, _migrate_failure),
    ]
    try:
        for name, path, fn in sections:
            try:
                body = _load_json(path)
            except Exception as exc:  # noqa: BLE001
                logger.error(
                    "backfill aborted in %s (load): %s: %s",
                    name, type(exc).__name__, exc,
                )
                return 1
            # Only skip when the file is absent (_load_json returned None).
            # Present-but-empty payloads ({} / []) must still run the section's
            # DELETE/reseed transaction so the replace-all/idempotent contract
            # holds when a JSON store has been intentionally truncated.
            if body is None:
                continue
            # The section migrators all expect dict-shaped bodies and call
            # `.get(...)` on them. A truncated store that decodes to `[]` (or
            # any non-dict) would raise AttributeError before the DELETE runs,
            # defeating the replace-all contract. Coerce non-dict payloads to
            # {} so the migrator runs its DELETE + empty-INSERT pass and
            # clears the destination tables.
            if not isinstance(body, dict):
                body = {}
            try:
                await fn(pool, body)
            except Exception as exc:  # noqa: BLE001
                logger.error(
                    "backfill aborted in %s: %s: %s",
                    name, type(exc).__name__, exc,
                )
                return 1
        logger.info("backfill complete")
        return 0
    finally:
        await pool.close()


if __name__ == "__main__":
    import sys
    sys.exit(asyncio.run(main()))
