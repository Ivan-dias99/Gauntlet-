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
import time
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
    dual-write is off — returns immediately with no side effects.

    This is the **dual-write** entrypoint: it is gated on
    ``is_enabled()`` and swallows any DB exception (logger.warning +
    return) because JSON remains canonical and we do not want a
    transient Postgres hiccup to fail the request path. The one-shot
    backfill (``migrate.py``) MUST NOT use this entrypoint — it should
    call ``write_spine_snapshot`` directly with the migration pool so
    failures surface and the dual-write toggle does not gate the seed.
    """
    pool = await _get_pool()
    if pool is None:
        return
    try:
        snapshot = json.loads(snapshot_json)
    except json.JSONDecodeError as exc:
        logger.warning("spine mirror skipped — bad JSON: %s", exc)
        return

    try:
        await write_spine_snapshot(pool, snapshot)
    except Exception as exc:  # noqa: BLE001
        logger.warning(
            "spine mirror write failed (%s) — JSON remains canonical",
            type(exc).__name__,
        )
        return


async def write_spine_snapshot(pool: Any, snapshot: dict) -> None:
    """Write the full spine snapshot to Postgres with the given pool.

    Bypasses the dual-write gate (``is_enabled()``) and propagates any
    exception. Used by the one-shot backfill so the operator sees a
    non-zero exit if the seed fails, and so a backfill works even when
    ``SIGNAL_DUAL_WRITE_PG`` is still off (the documented pre-window
    flow).
    """
    missions = snapshot.get("missions") or []
    principles = snapshot.get("principles") or []
    active_id = snapshot.get("activeMissionId")

    async with pool.acquire() as conn:
        async with conn.transaction():
            # Principles — replace the whole table per snapshot.
            # The table is small (operator's doctrine) and this avoids
            # incremental delete/insert ordering bugs. No FK references
            # principles, so DELETE is safe here.
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

            # Missions — UPSERT, then prune orphans. The original
            # implementation used `DELETE FROM missions` + reinsert,
            # but `runs.mission_id` and `telemetry_events.mission_id`
            # are FK ON DELETE SET NULL (see migrations/0001), so
            # every snapshot write would orphan every historical
            # run/telemetry row. We now upsert each mission row in
            # place, rebuild its CASCADE child tables (notes, tasks,
            # mission_events, mission_artifacts, truth_distillations,
            # handoffs) by id-scoped DELETE + INSERT, then delete
            # only the missions that disappeared from the snapshot.
            # The orphan delete still cascades (rare path: explicit
            # mission deletion), but the steady-state PUT no longer
            # touches runs / telemetry mission references.
            snapshot_ids = [m["id"] for m in missions if m.get("id")]
            if snapshot_ids:
                await conn.execute(
                    "DELETE FROM missions WHERE id <> ALL($1::text[])",
                    snapshot_ids,
                )
            else:
                await conn.execute("DELETE FROM missions")
            for m in missions:
                await _insert_mission(conn, m, m["id"] == active_id if active_id else False)


async def _insert_mission(conn: Any, m: dict, is_active: bool) -> None:
    """Upsert one mission + rebuild its child rows. Caller wraps the
    whole snapshot in a transaction so partial inserts can't survive.

    The mission row is upserted in place (ON CONFLICT DO UPDATE) so
    runs.mission_id / telemetry_events.mission_id never see the row
    disappear — those FKs are ON DELETE SET NULL and would corrupt
    cross-mission history if we deleted the mission each snapshot. The
    child tables (notes/tasks/events/artifacts/distillations/handoffs)
    are CASCADE; we clear them by mission_id and rebuild from the
    snapshot, which is the truth.

    NOT NULL columns use ``(value or default)`` instead of
    ``dict.get(key, default)`` because legacy snapshots can carry
    explicit ``null`` for keys that are present — ``.get`` only
    falls back when the key is missing, so an explicit null would
    sail through to the DB and trip the NOT NULL constraint, aborting
    the whole transaction. The coalesce keeps backfills from older
    JSON payloads working without a separate sanitiser step.
    """
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
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            chamber = EXCLUDED.chamber,
            status = EXCLUDED.status,
            created_at = EXCLUDED.created_at,
            updated_at = EXCLUDED.updated_at,
            project_contract = EXCLUDED.project_contract,
            last_artifact = EXCLUDED.last_artifact
        """,
        mid,
        m.get("title") or "",
        m.get("chamber") or "insight",
        m.get("status") or "active",
        int(m.get("createdAt") or 0),
        # Codex re-review (#264 round 4): MissionRecord has no
        # `updatedAt` field, so the writer used to fall back to 0 for
        # this column on every UPSERT. That blinded the freshness
        # watermark to mission-only edits (status flips, title
        # renames, chamber moves) — none of which touch any child
        # table. Bump `updated_at` to the current write time so
        # GREATEST(..., MAX(missions.updated_at)) advances on every
        # persisted mutation regardless of which row it touched.
        int((m.get("updatedAt") or (time.time() * 1000))),
        json.dumps(m.get("projectContract")) if m.get("projectContract") else None,
        json.dumps(m.get("lastArtifact")) if m.get("lastArtifact") else None,
    )

    # Clear child rows scoped to this mission, then rebuild from the
    # snapshot. Scoped DELETE keeps other missions' rows intact and
    # avoids the global cascade on missions we just removed above.
    await conn.execute("DELETE FROM notes WHERE mission_id = $1", mid)
    await conn.execute("DELETE FROM tasks WHERE mission_id = $1", mid)
    await conn.execute("DELETE FROM mission_events WHERE mission_id = $1", mid)
    await conn.execute("DELETE FROM mission_artifacts WHERE mission_id = $1", mid)
    await conn.execute("DELETE FROM truth_distillations WHERE mission_id = $1", mid)
    await conn.execute("DELETE FROM handoffs WHERE mission_id = $1", mid)

    for n in (m.get("notes") or []):
        if not n.get("id"):
            continue
        await conn.execute(
            "INSERT INTO notes (id, mission_id, text, role, created_at) "
            "VALUES ($1, $2, $3, $4, $5)",
            n["id"], mid, n.get("text") or "", (n.get("role") or "user"), int(n.get("createdAt") or 0),
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
            t["id"], mid, t.get("title") or "",
            (t.get("state") or "open"), (t.get("source") or "manual"),
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
            ev["id"], mid, ev.get("type") or "note_added",
            ev.get("label") or "", int(ev.get("at") or 0),
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

    # Truth distillations — versioned Insight artefacts. Mirror every
    # record so the Postgres copy keeps full distillation history; the
    # mission-scoped DELETE above already cleared the prior rows so we
    # always rebuild from the snapshot's truth.
    for d in (m.get("truthDistillations") or []):
        if not d.get("id"):
            continue
        await conn.execute(
            """
            INSERT INTO truth_distillations (
                id, mission_id, version, status, summary, validated_direction,
                core_decisions, unknowns, risks, surface_seed, terminal_seed,
                confidence, supersedes_version, stale_since, stale_reason,
                failure_state, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
                    $14, $15, $16, $17, $18)
            """,
            d["id"], mid,
            int(d.get("version") or 1),
            (d.get("status") or "draft"),
            (d.get("summary") or ""),
            (d.get("validatedDirection") or ""),
            json.dumps(d.get("coreDecisions") or []),
            json.dumps(d.get("unknowns") or []),
            json.dumps(d.get("risks") or []),
            json.dumps(d["surfaceSeed"]) if d.get("surfaceSeed") is not None else None,
            json.dumps(d["terminalSeed"]) if d.get("terminalSeed") is not None else None,
            (d.get("confidence") or "medium"),
            int(d["supersedesVersion"]) if d.get("supersedesVersion") is not None else None,
            int(d["staleSince"]) if d.get("staleSince") is not None else None,
            d.get("staleReason"),
            d.get("failureState"),
            int(d.get("createdAt") or 0),
            int(d.get("updatedAt") or 0),
        )

    # Handoffs (Wave D) — chamber-to-chamber transfer queue. Without
    # this loop the mirror silently drops the queue, breaking the
    # receiving chamber's pending-action banner after cutover. The
    # mission-scoped DELETE above already cleared prior rows.
    for h in (m.get("handoffs") or []):
        if not h.get("id"):
            continue
        await conn.execute(
            """
            INSERT INTO handoffs (
                id, mission_id, from_chamber, to_chamber, artifact_type,
                artifact_ref, summary, risks, next_action, status,
                created_at, resolved_at, resolution
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            """,
            h["id"], mid,
            (h.get("fromChamber") or ""),
            (h.get("toChamber") or ""),
            (h.get("artifactType") or "note"),
            h.get("artifactRef"),
            (h.get("summary") or ""),
            json.dumps(h.get("risks") or []),
            (h.get("nextAction") or ""),
            (h.get("status") or "pending"),
            int(h.get("createdAt") or 0),
            int(h["resolvedAt"]) if h.get("resolvedAt") is not None else None,
            h.get("resolution"),
        )


async def read_spine_snapshot() -> Optional[dict]:
    """Wave P-22 — reverse of write_spine_snapshot.

    Reads the full spine state from Postgres into a dict shaped like
    SpineSnapshot. Returns None when the pool is unavailable so the
    caller can fall back to JSON.

    Empty database returns an empty snapshot (`missions=[]`,
    `principles=[]`) — that's a valid state, not a failure. The caller
    distinguishes via `None` vs. an empty-but-present dict.
    """
    pool = await _get_pool()
    if pool is None:
        return None
    try:
        async with pool.acquire() as conn:
            # Codex re-review (#264 round 4 P2): the previous SELECT had
            # no ORDER BY, so Postgres returned rows in physical /
            # planner-dependent order — unstable across restarts /
            # vacuum. JSON preserved write order; this would be a UI-
            # rendering regression. Order by created_at DESC so the
            # most recent mission lands first; tiebreak by id so two
            # missions created in the same millisecond stay stable.
            mission_rows = await conn.fetch(
                "SELECT id, title, chamber, status, created_at, updated_at, "
                "project_contract, last_artifact FROM missions "
                "ORDER BY created_at DESC, id"
            )
            note_rows = await conn.fetch(
                "SELECT id, mission_id, text, role, created_at FROM notes "
                "ORDER BY mission_id, created_at DESC"
            )
            task_rows = await conn.fetch(
                "SELECT id, mission_id, title, state, source, created_at, "
                "done_at, last_update_at, artifact_id FROM tasks "
                "ORDER BY mission_id, created_at"
            )
            event_rows = await conn.fetch(
                "SELECT id, mission_id, type, label, at FROM mission_events "
                "ORDER BY mission_id, at DESC"
            )
            artifact_rows = await conn.fetch(
                "SELECT id, mission_id, body FROM mission_artifacts "
                "ORDER BY mission_id, accepted_at DESC"
            )
            distillation_rows = await conn.fetch(
                "SELECT id, mission_id, version, status, summary, "
                "validated_direction, core_decisions, unknowns, risks, "
                "surface_seed, terminal_seed, confidence, supersedes_version, "
                "stale_since, stale_reason, failure_state, created_at, updated_at "
                "FROM truth_distillations ORDER BY mission_id, version DESC"
            )
            handoff_rows = await conn.fetch(
                "SELECT id, mission_id, from_chamber, to_chamber, artifact_type, "
                "artifact_ref, summary, risks, next_action, status, created_at, "
                "resolved_at, resolution FROM handoffs ORDER BY mission_id, created_at DESC"
            )
            principle_rows = await conn.fetch(
                "SELECT id, text, created_at FROM principles ORDER BY created_at"
            )
            # Wave P-22 — derive snapshot updatedAt from child timestamps.
            #
            # TS hydration (`SpineContext.tsx`) decides whether the server
            # snapshot wins via `remote.updatedAt > prev.updatedAt`. Codex
            # rounds 1-3 caught two bad approaches:
            #   1. `MAX(missions.updated_at)` returns 0 because the writer
            #      never sets that column (MissionRecord has no updatedAt).
            #   2. `time.time()` always wins over local — but it overwrites
            #      offline edits made while server was unreachable.
            #
            # Real freshness lives in the child rows: notes.created_at,
            # tasks.created_at + last_update_at, mission_events.at,
            # mission_artifacts.accepted_at, truth_distillations.updated_at,
            # handoffs.created_at, principles.created_at. Take the MAX
            # across all of them — it's the actual "last activity"
            # timestamp the DB has seen. No mutation bumps anything else,
            # so this is provably the highest persisted timestamp.
            # Codex re-review (#264 round 4): mission-only edits (status
            # flips, title renames) don't touch any child table, so
            # GREATEST over child timestamps alone misses them. Include
            # missions.created_at AND missions.updated_at — the writer
            # now bumps updated_at on every UPSERT, so any persisted
            # mission mutation advances the watermark.
            freshness_row = await conn.fetchrow("""
                SELECT GREATEST(
                    COALESCE((SELECT MAX(created_at) FROM missions), 0),
                    COALESCE((SELECT MAX(updated_at) FROM missions), 0),
                    COALESCE((SELECT MAX(created_at) FROM notes), 0),
                    COALESCE((SELECT MAX(created_at) FROM tasks), 0),
                    COALESCE((SELECT MAX(last_update_at) FROM tasks), 0),
                    COALESCE((SELECT MAX(at) FROM mission_events), 0),
                    COALESCE((SELECT MAX(accepted_at) FROM mission_artifacts), 0),
                    COALESCE((SELECT MAX(updated_at) FROM truth_distillations), 0),
                    COALESCE((SELECT MAX(created_at) FROM handoffs), 0),
                    COALESCE((SELECT MAX(created_at) FROM principles), 0)
                ) AS m
            """)
    except Exception as exc:  # noqa: BLE001
        logger.warning("read_spine_snapshot failed — %s: %s", type(exc).__name__, exc)
        return None

    # Index children by mission_id for stitching.
    notes_by: dict[str, list[dict]] = {}
    for r in note_rows:
        notes_by.setdefault(r["mission_id"], []).append({
            "id": r["id"], "text": r["text"] or "",
            "role": r["role"] or "user",
            "createdAt": int(r["created_at"] or 0),
        })
    tasks_by: dict[str, list[dict]] = {}
    for r in task_rows:
        tasks_by.setdefault(r["mission_id"], []).append({
            "id": r["id"], "title": r["title"] or "",
            "state": r["state"] or "open",
            "source": r["source"] or "manual",
            "createdAt": int(r["created_at"] or 0),
            "doneAt": int(r["done_at"]) if r["done_at"] is not None else None,
            "lastUpdateAt": int(r["last_update_at"]) if r["last_update_at"] is not None else None,
            "artifactId": r["artifact_id"],
            # `done` is derived for back-compat with TS clients reading the flag.
            # Codex re-review (#264 round 5): legacy rows can have
            # `done_at` populated but `state` defaulted to "open" (the
            # writer/backfill never sets state on those rows). Without
            # this fallback, those tasks come back as incomplete on
            # cutover even though completion data exists. Derive
            # done from either signal — explicit state OR a recorded
            # completion timestamp.
            "done": (r["state"] or "open") == "done" or r["done_at"] is not None,
        })
    events_by: dict[str, list[dict]] = {}
    for r in event_rows:
        events_by.setdefault(r["mission_id"], []).append({
            "id": r["id"], "type": r["type"] or "note_added",
            "label": r["label"] or "", "at": int(r["at"] or 0),
        })
    artifacts_by: dict[str, list[dict]] = {}
    for r in artifact_rows:
        # `body` is JSONB — asyncpg returns it as a string; parse defensively.
        body = r["body"]
        if isinstance(body, str):
            try:
                body = json.loads(body)
            except Exception:  # noqa: BLE001
                body = {}
        if not isinstance(body, dict):
            body = {}
        artifacts_by.setdefault(r["mission_id"], []).append(body)
    distillations_by: dict[str, list[dict]] = {}
    for r in distillation_rows:
        def _jload(v: Any) -> Any:
            if v is None:
                return None
            if isinstance(v, str):
                try:
                    return json.loads(v)
                except Exception:  # noqa: BLE001
                    return None
            return v
        distillations_by.setdefault(r["mission_id"], []).append({
            "id": r["id"],
            "version": int(r["version"] or 1),
            "status": r["status"] or "draft",
            "sourceMissionId": r["mission_id"],
            "summary": r["summary"] or "",
            "validatedDirection": r["validated_direction"] or "",
            "coreDecisions": _jload(r["core_decisions"]) or [],
            "unknowns": _jload(r["unknowns"]) or [],
            "risks": _jload(r["risks"]) or [],
            "surfaceSeed": _jload(r["surface_seed"]),
            "terminalSeed": _jload(r["terminal_seed"]),
            "confidence": r["confidence"] or "medium",
            "supersedesVersion": int(r["supersedes_version"]) if r["supersedes_version"] is not None else None,
            "staleSince": int(r["stale_since"]) if r["stale_since"] is not None else None,
            "staleReason": r["stale_reason"],
            "failureState": r["failure_state"],
            "createdAt": int(r["created_at"] or 0),
            "updatedAt": int(r["updated_at"] or 0),
        })
    handoffs_by: dict[str, list[dict]] = {}
    for r in handoff_rows:
        risks = r["risks"]
        if isinstance(risks, str):
            try:
                risks = json.loads(risks)
            except Exception:  # noqa: BLE001
                risks = []
        handoffs_by.setdefault(r["mission_id"], []).append({
            "id": r["id"],
            "fromChamber": r["from_chamber"] or "",
            "toChamber": r["to_chamber"] or "",
            "artifactType": r["artifact_type"] or "note",
            "artifactRef": r["artifact_ref"],
            "summary": r["summary"] or "",
            "risks": risks if isinstance(risks, list) else [],
            "nextAction": r["next_action"] or "",
            "status": r["status"] or "pending",
            "createdAt": int(r["created_at"] or 0),
            "resolvedAt": int(r["resolved_at"]) if r["resolved_at"] is not None else None,
            "resolution": r["resolution"],
        })

    missions: list[dict] = []
    for r in mission_rows:
        mid = r["id"]
        contract = r["project_contract"]
        if isinstance(contract, str):
            try:
                contract = json.loads(contract)
            except Exception:  # noqa: BLE001
                contract = None
        last_art = r["last_artifact"]
        if isinstance(last_art, str):
            try:
                last_art = json.loads(last_art)
            except Exception:  # noqa: BLE001
                last_art = None
        missions.append({
            "id": mid,
            "title": r["title"] or "",
            "chamber": r["chamber"] or "core",
            "status": r["status"] or "active",
            "createdAt": int(r["created_at"] or 0),
            "notes": notes_by.get(mid, []),
            "tasks": tasks_by.get(mid, []),
            "events": events_by.get(mid, []),
            "artifacts": artifacts_by.get(mid, []),
            "lastArtifact": last_art,
            "projectContract": contract,
            "truthDistillations": distillations_by.get(mid, []),
            "handoffs": handoffs_by.get(mid, []),
        })

    principles = [
        {"id": r["id"], "text": r["text"] or "", "createdAt": int(r["created_at"] or 0)}
        for r in principle_rows
    ]
    # Codex re-review (#264 round 3): use real persisted freshness, not
    # server wall-clock. `time.time()` always wins over local even when
    # the local cache had legitimate offline edits — that overwrites
    # those edits silently on the next push. Real freshness comes from
    # the MAX of every child timestamp the writer actually populates
    # (notes, tasks, events, artifacts, distillations, handoffs,
    # principles). Empty DB → 0; client compares 0 > prev.updatedAt and
    # only wins if the local state was also fresh-empty, which is
    # exactly the right behaviour.
    pg_freshness = freshness_row["m"] if freshness_row is not None else 0
    updated_at_ms = int(pg_freshness or 0)
    return {
        # `updatedAt` first so the TS hydration check
        # (`remote.updatedAt > prev.updatedAt`) sees a real timestamp,
        # not the `None → 0` coercion that made fresh clients ignore
        # the server snapshot before this fix.
        "updatedAt": updated_at_ms,
        "missions": missions,
        "principles": principles,
        # activeMissionId is not stored separately in the schema — the
        # TS client persists it via localStorage. After cutover the
        # client repopulates it from its own cache; we return None so
        # the spine snapshot stays valid.
        "activeMissionId": None,
    }


async def shutdown() -> None:
    """Close the pool (test cleanup, server shutdown). Safe to call
    when never opened."""
    global _pool
    if _pool is not None:
        try:
            await _pool.close()
        finally:
            _pool = None
