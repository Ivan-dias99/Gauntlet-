"""
JSON ↔ Postgres parity check (Wave P-32).

Compares the on-disk spine.json snapshot against the Postgres mirror and
prints a visual report. Operator runs this BEFORE flipping
SIGNAL_PG_CANONICAL=1 to confirm the database holds the same state as
the canonical JSON store.

Usage:
    SIGNAL_DATABASE_URL=postgres://… \\
        python -m parity_check

Reads:
    MEMORY_DIR/spine.json   (config.MEMORY_DIR)
    SIGNAL_DATABASE_URL     (config.DATABASE_URL)

Exit code:
    0 — perfect parity
    1 — drift detected
    2 — configuration / connectivity error
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

# Make this script runnable both as `python -m parity_check` (from the
# signal-backend directory) and as `python parity_check.py`. Imports below
# match the existing module layout — config / db are siblings.
try:
    from config import DATABASE_URL, MEMORY_DIR
    from db import read_spine_snapshot
except ImportError:  # pragma: no cover — standalone invocation
    sys.path.insert(0, str(Path(__file__).parent))
    from config import DATABASE_URL, MEMORY_DIR  # type: ignore
    from db import read_spine_snapshot  # type: ignore


SPINE_FILE: Path = MEMORY_DIR / "spine.json"


# ── Visual helpers ──────────────────────────────────────────────────────────


def _bar(left: int, right: int, width: int = 24) -> str:
    """Bar visualizing |left - right| relative to max(left, right)."""
    span = max(left, right, 1)
    filled = int(round((abs(left - right) / span) * width))
    filled = max(0, min(width, filled))
    return "█" * filled + "░" * (width - filled)


def _mark(left: int, right: int) -> str:
    if left == right:
        return "ok"
    return f"DRIFT {left - right:+d}"


def _icon(left: int, right: int) -> str:
    return "✓" if left == right else "!"


def _row(label: str, left: int, right: int) -> str:
    icon = _icon(left, right)
    bar = _bar(left, right)
    return f"  {label:<14} JSON {left:>4}  ←→  PG {right:>4}   {icon}  {bar} {_mark(left, right)}"


def _box(title: str) -> str:
    line = "═" * 60
    return f"╔{line}╗\n║ {title:<58} ║\n╚{line}╝"


# ── Counters ────────────────────────────────────────────────────────────────


def _mission_totals(snapshot: dict[str, Any]) -> dict[str, int]:
    missions = snapshot.get("missions") or []
    totals: dict[str, int] = {
        "missions": len(missions),
        "notes": 0,
        "tasks": 0,
        "events": 0,
        "artifacts": 0,
        "distillations": 0,
        "handoffs": 0,
        "principles": len(snapshot.get("principles") or []),
    }
    for m in missions:
        totals["notes"] += len(m.get("notes") or [])
        totals["tasks"] += len(m.get("tasks") or [])
        totals["events"] += len(m.get("events") or [])
        totals["artifacts"] += len(m.get("artifacts") or [])
        totals["distillations"] += len(m.get("truthDistillations") or [])
        totals["handoffs"] += len(m.get("handoffs") or [])
    return totals


def _index_missions(snapshot: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {m["id"]: m for m in (snapshot.get("missions") or []) if m.get("id")}


def _per_mission_counts(m: dict[str, Any]) -> dict[str, int]:
    return {
        "notes": len(m.get("notes") or []),
        "tasks": len(m.get("tasks") or []),
        "events": len(m.get("events") or []),
        "artifacts": len(m.get("artifacts") or []),
        "distillations": len(m.get("truthDistillations") or []),
        "handoffs": len(m.get("handoffs") or []),
    }


# Mapping of logical category name → key used inside a mission dict. Centralized
# so counts and content hashes always traverse the same fields.
_MISSION_CHILD_KEYS: dict[str, str] = {
    "notes": "notes",
    "tasks": "tasks",
    "events": "events",
    "artifacts": "artifacts",
    "distillations": "truthDistillations",
    "handoffs": "handoffs",
}


def _stable_dump(value: Any) -> str:
    """Serialize value deterministically for hashing.

    JSON with sort_keys=True gives us a content-stable string regardless
    of insertion order on either side (asyncpg row → dict order may differ
    from the on-disk file). default=str absorbs datetimes / UUIDs without
    raising, which can appear in the PG snapshot.
    """
    return json.dumps(value, sort_keys=True, ensure_ascii=False, default=str)


def _hash_collection(items: list[Any] | None) -> str:
    """Hash an unordered collection of children.

    Each child is serialized stably, the resulting strings are sorted,
    and the concatenation is hashed. This means two collections compare
    equal iff they hold the same set of child payloads — order does not
    matter, but content does. SHA-256 is plenty for drift detection.
    """
    if not items:
        return hashlib.sha256(b"").hexdigest()
    parts = sorted(_stable_dump(item) for item in items)
    h = hashlib.sha256()
    for p in parts:
        h.update(p.encode("utf-8"))
        h.update(b"\x00")  # delimiter so concatenations cannot collide
    return h.hexdigest()


def _per_mission_hashes(m: dict[str, Any]) -> dict[str, str]:
    """Return content hash per child category for a single mission."""
    return {
        category: _hash_collection(m.get(field) or [])
        for category, field in _MISSION_CHILD_KEYS.items()
    }


# Mission-level scalar/object payload fields that are persisted snapshots
# but not children collections. Drift here is silent — counts stay equal
# even when the payload changes — so they need their own per-mission hash.
_MISSION_PAYLOAD_KEYS: tuple[str, ...] = ("projectContract", "lastArtifact")


def _hash_payload(value: Any) -> str | None:
    """Hash a single payload field stably, or return None when absent.

    None on either side is treated as "no payload"; (None, None) matches
    without triggering drift. This mirrors how the JSON snapshot omits
    these keys when never set, while the PG row may surface them as NULL.
    """
    if value is None:
        return None
    return hashlib.sha256(_stable_dump(value).encode("utf-8")).hexdigest()


def _per_mission_payload_hashes(m: dict[str, Any]) -> dict[str, str | None]:
    """Return content hash per payload field for a single mission."""
    return {field: _hash_payload(m.get(field)) for field in _MISSION_PAYLOAD_KEYS}


def _principles_hash(snapshot: dict[str, Any]) -> str:
    """Hash the ordered principles list.

    Principles are intentionally ORDERED (priority list), so we do not
    sort before hashing — order is part of the content here.
    """
    items = snapshot.get("principles") or []
    h = hashlib.sha256()
    for item in items:
        h.update(_stable_dump(item).encode("utf-8"))
        h.update(b"\x00")
    return h.hexdigest()


# ── Loaders ─────────────────────────────────────────────────────────────────


def _load_json_snapshot() -> dict[str, Any]:
    if not SPINE_FILE.exists():
        return {"missions": [], "principles": []}
    raw = SPINE_FILE.read_text(encoding="utf-8")
    data = json.loads(raw)
    if not isinstance(data, dict):
        return {"missions": [], "principles": []}
    return data


async def _load_pg_snapshot() -> dict[str, Any] | None:
    return await read_spine_snapshot()


# ── Report ──────────────────────────────────────────────────────────────────


def _render_report(json_snap: dict[str, Any], pg_snap: dict[str, Any]) -> tuple[str, bool]:
    j_totals = _mission_totals(json_snap)
    p_totals = _mission_totals(pg_snap)

    lines: list[str] = [_box("JSON ↔ POSTGRES PARITY"), ""]

    keys = ("missions", "notes", "tasks", "events", "artifacts", "distillations", "handoffs", "principles")
    drift = False
    for k in keys:
        j = j_totals[k]
        p = p_totals[k]
        if j != p:
            drift = True
        lines.append(_row(k.capitalize() + ":", j, p))

    # Root-level scalar / ordered fields. Counts above already cover the
    # principles count; here we additionally check ordered content of
    # principles and the activeMissionId pointer.
    j_active = json_snap.get("activeMissionId")
    p_active = pg_snap.get("activeMissionId")
    j_principles_h = _principles_hash(json_snap)
    p_principles_h = _principles_hash(pg_snap)

    # Per-mission detail — only emit rows where something disagrees.
    detail: list[str] = []
    if j_active != p_active:
        drift = True
        detail.append(
            f"  root / activeMissionId: JSON {j_active!r} ←→ PG {p_active!r}"
        )
    if j_principles_h != p_principles_h:
        drift = True
        detail.append(
            "  root / principles: content drift "
            f"(JSON {j_principles_h[:12]}… ←→ PG {p_principles_h[:12]}…)"
        )

    j_missions = _index_missions(json_snap)
    p_missions = _index_missions(pg_snap)
    all_ids = sorted(set(j_missions) | set(p_missions))
    for mid in all_ids:
        jm = j_missions.get(mid)
        pm = p_missions.get(mid)
        if jm is None:
            detail.append(f"  mission {mid[:12]}…  MISSING IN JSON   (only in PG)")
            drift = True
            continue
        if pm is None:
            detail.append(f"  mission {mid[:12]}…  MISSING IN PG     (only in JSON)")
            drift = True
            continue
        # Title / status / chamber drift.
        for field in ("title", "status", "chamber"):
            jv = jm.get(field) or ""
            pv = pm.get(field) or ""
            if jv != pv:
                drift = True
                detail.append(f"  mission {mid[:12]}… / {field}: JSON {jv!r} ←→ PG {pv!r}")
        # Children counts AND content hashes — counts catch the obvious
        # cases (added / removed rows); hashes catch silent edits where
        # the count stayed equal but a payload changed.
        jc = _per_mission_counts(jm)
        pc = _per_mission_counts(pm)
        jh = _per_mission_hashes(jm)
        ph = _per_mission_hashes(pm)
        for field, jcount in jc.items():
            pcount = pc[field]
            if jcount != pcount:
                drift = True
                detail.append(
                    f"  mission {mid[:12]}… / {field}: JSON {jcount} ←→ PG {pcount}"
                )
                # Count drift already implies content drift; skip the
                # hash comparison to avoid double-reporting the same row.
                continue
            if jh[field] != ph[field]:
                drift = True
                detail.append(
                    f"  mission {mid[:12]}… / {field}: content drift "
                    f"(count {jcount}, JSON {jh[field][:12]}… ←→ PG {ph[field][:12]}…)"
                )

        # Payload-shaped fields (projectContract, lastArtifact). These are
        # persisted snapshots that have no count to compare — without an
        # explicit hash check, silent payload drift would slip through and
        # the parity gate would flip canonical onto a divergent PG row.
        # (None, None) matches; everything else compares by stable hash.
        jph = _per_mission_payload_hashes(jm)
        pph = _per_mission_payload_hashes(pm)
        for field in _MISSION_PAYLOAD_KEYS:
            jhash = jph[field]
            phash = pph[field]
            if jhash == phash:
                continue
            drift = True
            if jhash is None:
                detail.append(
                    f"  mission {mid[:12]}… / {field}: MISSING IN JSON "
                    f"(PG {phash[:12]}…)"
                )
            elif phash is None:
                detail.append(
                    f"  mission {mid[:12]}… / {field}: MISSING IN PG "
                    f"(JSON {jhash[:12]}…)"
                )
            else:
                detail.append(
                    f"  mission {mid[:12]}… / {field}: content drift "
                    f"(JSON {jhash[:12]}… ←→ PG {phash[:12]}…)"
                )

    lines.append("")
    if detail:
        lines.append("Drift detail:")
        lines.extend(detail)
    else:
        lines.append("  (no per-mission drift)")

    lines.append("")
    if drift:
        lines.append("┌──────────────────────────────────────────┐")
        lines.append("│  RESULT: DRIFT — DO NOT FLIP CANONICAL   │")
        lines.append("└──────────────────────────────────────────┘")
    else:
        lines.append("┌──────────────────────────────────────────┐")
        lines.append("│  RESULT: PARITY — SAFE TO FLIP CANONICAL │")
        lines.append("└──────────────────────────────────────────┘")

    return "\n".join(lines), drift


# ── Entrypoint ──────────────────────────────────────────────────────────────


async def main() -> int:
    if not DATABASE_URL:
        print("[parity] SIGNAL_DATABASE_URL is not set — cannot compare.", file=sys.stderr)
        return 2

    try:
        json_snap = _load_json_snapshot()
    except Exception as exc:  # noqa: BLE001
        print(f"[parity] failed to read {SPINE_FILE}: {exc}", file=sys.stderr)
        return 2

    try:
        pg_snap = await _load_pg_snapshot()
    except Exception as exc:  # noqa: BLE001
        print(f"[parity] PG read failed: {exc}", file=sys.stderr)
        return 2

    if pg_snap is None:
        print("[parity] PG snapshot returned None (pool unavailable / driver missing).", file=sys.stderr)
        return 2

    report, drift = _render_report(json_snap, pg_snap)
    print(report)
    return 1 if drift else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
