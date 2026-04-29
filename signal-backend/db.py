"""
Signal — Postgres connection pool + spine mirror writer (Wave O / P-6).

Read path is JSON (spine.py). This module ships the **mirror writer**
that, when SIGNAL_DUAL_WRITE_PG is on, replicates the spine snapshot
into Postgres tables defined by migrations/0001_initial_schema.sql.

The mirror is fire-and-forget from the JSON path's perspective: it
runs after the JSON write succeeds and never blocks the response.
Failures are logged once per session (we don't spam) and don't raise
to the caller — JSON is canonical until the cutover wave flips reads.

Two-week dual-write doctrine:
  1. SIGNAL_DATABASE_URL set + SIGNAL_DUAL_WRITE_PG=1     → mirror on
  2. After parity is observed (spot-check) → flip read flag (future)
  3. Drop JSON paths in a final cleanup wave
"""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Optional

from config import DATABASE_URL, DUAL_WRITE_PG

logger = logging.getLogger("signal.db")


# ── Lazy connection pool ─────────────────────────────────────────────────
#
# asyncpg is imported only when the dual-writer actually needs it so a
# deployment without SIGNAL_DATABASE_URL never pays the import cost and
# absent-on-pip environments boot cleanly.

_pool: Optional[Any] = None
_pool_lock = asyncio.Lock()
_disabled_reason: Optional[str] = None  # logged once, then we go quiet


def is_enabled() -> bool:
    """True when the operator opted into dual-write AND the URL is set."""
    return bool(DUAL_WRITE_PG and DATABASE_URL)


async def _get_pool() -> Optional[Any]:
    """Return a shared asyncpg pool, lazily creating it. Returns None
    when dual-write is disabled or the driver is missing."""
    global _pool, _disabled_reason
    if not is_enabled():
        return None
    if _pool is not None:
        return _pool
    async with _pool_lock:
        if _pool is not None:
            return _pool
        if _disabled_reason is not None:
            return None
        try:
            import asyncpg  # type: ignore
        except ImportError as exc:
            _disabled_reason = f"asyncpg import failed: {exc}"
            logger.warning("Postgres dual-write disabled — %s", _disabled_reason)
            return None
        try:
            _pool = await asyncpg.create_pool(
                dsn=DATABASE_URL,
                min_size=1,
                max_size=4,
                command_timeout=10,
            )
        except Exception as exc:  # noqa: BLE001
            _disabled_reason = f"pool create failed: {type(exc).__name__}: {exc}"
            logger.warning("Postgres dual-write disabled — %s", _disabled_reason)
            _pool = None
            return None
    return _pool


# ── Spine mirror writer ──────────────────────────────────────────────────
#
# Writes the full snapshot atomically per-mission inside one transaction.
# Replace-by-pk semantics so the mirror never drifts: each put() rebuilds
# the rows that actually live in the snapshot. No incremental diffing —
# that's the trade-off for treating JSON as canonical.

async def mirror_spine_snapshot(snapshot_json: str) -> None:
    """Mirror the full spine snapshot to Postgres. Safe to call when
    dual-write is off — returns immediately with no side effects."""
    pool = await _get_pool()
    if pool is None:
        return
    try:
        snapshot = json.loads(snapshot_json)
    except json.JSONDecodeError as exc:
        logger.warning("spine mirror skipped — bad JSON: %s", exc)
        return

    missions = snapshot.get("missions") or []
    principles = snapshot.get("principles") or []
    active_id = snapshot.get("activeMissionId")
    updated_at = snapshot.get("last_updated") or snapshot.get("updatedAt")

    try:
        async with pool.acquire() as conn:
            async with conn.transaction():
                # Principles — replace the whole table per snapshot.
                # The table is small (operator's doctrine) and this avoids
                # incremental delete/insert ordering bugs.
                await conn.execute("DELETE FROM principles")
                for p in principles:
                    pid = p.get("id")
                    text = p.get("text")
                    created = p.get("createdAt")
                    if not pid or not text or created is None:
                        continue
                    await conn.execute(
                        "INSERT INTO principles (id, text, created_at) VALUES ($1, $2, $3)",
                        pid, text, int(created),
                    )

                # Missions — same replace-all strategy. Cascade clears
                # notes/tasks/handoffs/distillations/events/artifacts so
                # the rebuild stays consistent.
                await conn.execute("DELETE FROM missions")
                for m in missions:
                    await _insert_mission(conn, m, m["id"] == active_id if active_id else False)
    except Exception as exc:  # noqa: BLE001
        logger.warning(
            "spine mirror write failed (%s) — JSON remains canonical",
            type(exc).__name__,
        )
        return


async def _insert_mission(conn: Any, m: dict, is_active: bool) -> None:
    """Insert one mission + its child rows. Caller wraps the whole
    snapshot in a transaction so partial inserts can't survive."""
    mid = m.get("id")
    if not mid:
        return
    # Schema mirror — columns match migrations/0001_initial_schema.sql.
    # active_mission tracking lives at the snapshot level, not the row,
    # so is_active is intentionally not stored here. The reader can
    # join against a future spine_meta table if needed.
    _ = is_active  # reserved for a follow-up wave that adds spine_meta
    await conn.execute(
        """
        INSERT INTO missions (id, title, chamber, status, created_at,
                              updated_at, project_contract, last_artifact)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        """,
        mid,
        m.get("title", ""),
        m.get("chamber", "insight"),
        m.get("status", "active"),
        int(m.get("createdAt") or 0),
        int(m.get("updatedAt") or 0),
        json.dumps(m.get("projectContract")) if m.get("projectContract") else None,
        json.dumps(m.get("lastArtifact")) if m.get("lastArtifact") else None,
    )

    for n in (m.get("notes") or []):
        if not n.get("id"):
            continue
        await conn.execute(
            "INSERT INTO notes (id, mission_id, text, role, created_at) "
            "VALUES ($1, $2, $3, $4, $5)",
            n["id"], mid, n.get("text", ""), n.get("role"), int(n.get("createdAt") or 0),
        )

    for t in (m.get("tasks") or []):
        if not t.get("id"):
            continue
        await conn.execute(
            """
            INSERT INTO tasks (id, mission_id, title, state, source,
                               created_at, done_at, last_update_at, artifact_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            """,
            t["id"], mid, t.get("title", ""),
            t.get("state", "open"), t.get("source", "manual"),
            int(t.get("createdAt") or 0),
            int(t["doneAt"]) if t.get("doneAt") is not None else None,
            int(t["lastUpdateAt"]) if t.get("lastUpdateAt") is not None else None,
            t.get("artifactId"),
        )

    for ev in (m.get("events") or []):
        if not ev.get("id"):
            continue
        await conn.execute(
            "INSERT INTO mission_events (id, mission_id, type, label, at) "
            "VALUES ($1, $2, $3, $4, $5)",
            ev["id"], mid, ev.get("type", "note_added"),
            ev.get("label", ""), int(ev.get("at") or 0),
        )

    for art in (m.get("artifacts") or []):
        if not art.get("id"):
            continue
        await conn.execute(
            "INSERT INTO mission_artifacts (id, mission_id, task_id, accepted_at, body) "
            "VALUES ($1, $2, $3, $4, $5)",
            art["id"], mid, art.get("taskId"),
            int(art.get("acceptedAt") or 0),
            json.dumps(art),
        )


async def shutdown() -> None:
    """Close the pool (test cleanup, server shutdown). Safe to call
    when never opened."""
    global _pool
    if _pool is not None:
        try:
            await _pool.close()
        finally:
            _pool = None
