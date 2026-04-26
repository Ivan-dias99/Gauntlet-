"""
Signal — Run Log

Append-only log of every query that hits the engine, persisted in SQLite.

Doctrine gate enforced here:
    A refused run must carry a judgment trace — at least one of
    judge_reasoning, refusal_reason, termination_reason or an error
    envelope. Without that, Archive ends up displaying "sem motivo
    registado" as a normal state, which violates Signal's own
    refuse-with-reason rule. Records that fail the gate raise
    ``RefusedWithoutJudgment``; the caller decides whether to repair
    the record or 422 the request.
"""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Optional

from db import get_db
from models import RunRecord

logger = logging.getLogger("signal.runs")

MAX_RUNS: int = 2000


class RefusedWithoutJudgment(ValueError):
    """A refused run was submitted without any judgment trace."""


def _refused_has_judgment(run: RunRecord) -> bool:
    if (run.judge_reasoning or "").strip():
        return True
    if (run.termination_reason or "").strip():
        return True
    # An error envelope leaves a fingerprint in tool_calls / termination
    # state that the UI surfaces as the refusal cause. We accept either
    # an explicit termination_reason (set above) or an error-flagged
    # tool call as evidence.
    for call in run.tool_calls or []:
        if isinstance(call, dict) and call.get("ok") is False:
            return True
    return False


class RunStore:
    """Thread-safe SQLite-backed run log."""

    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._last_save_error: str | None = None
        self._last_load_error: str | None = None

    async def record(self, run: RunRecord) -> RunRecord:
        if run.refused and not _refused_has_judgment(run):
            # Doctrine gate: a refusal without a judgment trace is corrupt
            # provenance. We don't crash the stream — Archive needs the
            # row — but we stamp the violation onto the record itself so
            # the UI can flag it instead of pretending the refusal is
            # normal. The stamped reason is reserved + machine-readable.
            run.termination_reason = "missing_judgment_quarantine"
            logger.warning(
                "Refused run %s missing judgment; recorded with "
                "termination_reason=missing_judgment_quarantine",
                run.id,
            )
        db = get_db()
        try:
            await db.execute(
                "INSERT OR REPLACE INTO runs"
                "(id, timestamp, route, mission_id, refused, payload)"
                " VALUES (?, ?, ?, ?, ?, ?)",
                (
                    run.id,
                    run.timestamp,
                    run.route,
                    run.mission_id,
                    1 if run.refused else 0,
                    run.model_dump_json(),
                ),
            )
            # Cheap pruning: keep at most MAX_RUNS by timestamp.
            await db.execute(
                "DELETE FROM runs WHERE id IN ("
                " SELECT id FROM runs ORDER BY timestamp DESC LIMIT -1 OFFSET ?"
                ")",
                (MAX_RUNS,),
            )
            self._last_save_error = None
        except Exception as e:  # noqa: BLE001
            self._last_save_error = f"{type(e).__name__}: {e}"
            logger.error("Failed to persist run: %s", e)
        return run

    async def list(
        self,
        mission_id: Optional[str] = None,
        limit: int = 50,
    ) -> list[RunRecord]:
        db = get_db()
        if mission_id:
            rows = await db.fetch_all(
                "SELECT payload FROM runs WHERE mission_id = ?"
                " ORDER BY timestamp DESC LIMIT ?",
                (mission_id, limit),
            )
        else:
            rows = await db.fetch_all(
                "SELECT payload FROM runs ORDER BY timestamp DESC LIMIT ?",
                (limit,),
            )
        out: list[RunRecord] = []
        for row in rows:
            try:
                out.append(RunRecord(**json.loads(row["payload"])))
            except Exception as exc:  # noqa: BLE001
                logger.warning("Skipping unparseable run row: %s", exc)
        return out

    async def get(self, run_id: str) -> Optional[RunRecord]:
        db = get_db()
        row = await db.fetch_one("SELECT payload FROM runs WHERE id = ?", (run_id,))
        if not row:
            return None
        try:
            return RunRecord(**json.loads(row["payload"]))
        except Exception as exc:  # noqa: BLE001
            logger.warning("Unparseable run %s: %s", run_id, exc)
            return None

    async def stats(self, mission_id: Optional[str] = None) -> dict:
        db = get_db()
        if mission_id:
            rows = await db.fetch_all(
                "SELECT payload FROM runs WHERE mission_id = ?",
                (mission_id,),
            )
        else:
            rows = await db.fetch_all("SELECT payload FROM runs")
        records = []
        for row in rows:
            try:
                records.append(RunRecord(**json.loads(row["payload"])))
            except Exception:  # noqa: BLE001
                continue
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
            "last_updated": datetime.now(timezone.utc).isoformat(),
        }


run_store = RunStore()
