"""
Mission primitive — Gauntlet IDE.

A Mission is a unit of operator intent that spans multiple runs and may
involve multiple agents. Missions are time-extended: they live across
sessions, can be paused, resumed, blocked, completed, or abandoned.

A Mission groups `runs.json` entries via `intent_id` correlation that
the composer pipeline already produces. The mission layer is what turns
"sequence of episodic runs" into "continuous operation".

Canonical path:  backend/missions.py
Storage:         data/missions.jsonl (append-only)
"""
from __future__ import annotations

import json
import os
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal, Optional

from pydantic import BaseModel, Field

# ─── Model ────────────────────────────────────────────────────────────

MissionStatus = Literal["draft", "active", "blocked", "completed", "abandoned"]


class Mission(BaseModel):
    """Operator intent spanning multiple runs and agents."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    objective: str = ""  # one-paragraph statement of intent
    status: MissionStatus = "draft"
    assigned_agent_ids: list[str] = Field(default_factory=list)
    run_ids: list[str] = Field(default_factory=list)  # links to runs.json
    intent_ids: list[str] = Field(default_factory=list)  # composer correlations
    tags: list[str] = Field(default_factory=list)
    blocked_reason: Optional[str] = None
    success: Optional[bool] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None


class MissionUpdate(BaseModel):
    """Partial update — all fields optional."""
    title: Optional[str] = None
    objective: Optional[str] = None
    status: Optional[MissionStatus] = None
    assigned_agent_ids: Optional[list[str]] = None
    tags: Optional[list[str]] = None
    blocked_reason: Optional[str] = None
    success: Optional[bool] = None


class RunLink(BaseModel):
    """Payload to link a run to a mission."""
    run_id: str
    intent_id: Optional[str] = None


# ─── Store ────────────────────────────────────────────────────────────

_DATA_DIR = Path(os.environ.get("GAUNTLET_DATA_DIR", "data"))
_STORE_PATH = _DATA_DIR / "missions.jsonl"
_LOCK = threading.RLock()
_CACHE: dict[str, Mission] = {}
_CACHE_LOADED = False


def _ensure_data_dir() -> None:
    _DATA_DIR.mkdir(parents=True, exist_ok=True)


def _load_cache() -> None:
    global _CACHE_LOADED
    with _LOCK:
        if _CACHE_LOADED:
            return
        _ensure_data_dir()
        if _STORE_PATH.exists():
            with _STORE_PATH.open("r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        data = json.loads(line)
                        mission = Mission(**data)
                        _CACHE[mission.id] = mission
                    except Exception:
                        continue
        _CACHE_LOADED = True


def _append(mission: Mission) -> None:
    _ensure_data_dir()
    payload = mission.model_dump_json()
    with _STORE_PATH.open("a", encoding="utf-8") as f:
        f.write(payload + "\n")


# ─── Public API ───────────────────────────────────────────────────────

def list_missions(
    status: Optional[MissionStatus] = None,
    agent_id: Optional[str] = None,
) -> list[Mission]:
    """Return missions, optionally filtered by status or assigned agent."""
    _load_cache()
    with _LOCK:
        missions = list(_CACHE.values())
        if status:
            missions = [m for m in missions if m.status == status]
        if agent_id:
            missions = [m for m in missions if agent_id in m.assigned_agent_ids]
        return sorted(missions, key=lambda m: m.updated_at, reverse=True)


def get_mission(mission_id: str) -> Optional[Mission]:
    _load_cache()
    with _LOCK:
        return _CACHE.get(mission_id)


def create_mission(mission: Mission) -> Mission:
    """Persist a new mission. Status defaults to 'draft'."""
    _load_cache()
    with _LOCK:
        _CACHE[mission.id] = mission
        _append(mission)
        return mission


def update_mission(mission_id: str, patch: MissionUpdate) -> Optional[Mission]:
    """Apply partial update; auto-stamps updated_at and completed_at."""
    _load_cache()
    with _LOCK:
        existing = _CACHE.get(mission_id)
        if not existing:
            return None
        updates = patch.model_dump(exclude_unset=True)
        if not updates:
            return existing
        now = datetime.now(timezone.utc)
        if updates.get("status") in ("completed", "abandoned") and existing.completed_at is None:
            updates["completed_at"] = now
        updated = existing.model_copy(update={**updates, "updated_at": now})
        _CACHE[mission_id] = updated
        _append(updated)
        return updated


def link_run(mission_id: str, run_id: str, intent_id: Optional[str] = None) -> Optional[Mission]:
    """Append a run_id (and optional intent_id) to a mission."""
    _load_cache()
    with _LOCK:
        existing = _CACHE.get(mission_id)
        if not existing:
            return None
        run_ids = list(existing.run_ids)
        if run_id not in run_ids:
            run_ids.append(run_id)
        intent_ids = list(existing.intent_ids)
        if intent_id and intent_id not in intent_ids:
            intent_ids.append(intent_id)
        updated = existing.model_copy(
            update={
                "run_ids": run_ids,
                "intent_ids": intent_ids,
                "updated_at": datetime.now(timezone.utc),
            }
        )
        _CACHE[mission_id] = updated
        _append(updated)
        return updated


def assign_agent(mission_id: str, agent_id: str) -> Optional[Mission]:
    """Assign an agent to a mission (idempotent)."""
    _load_cache()
    with _LOCK:
        existing = _CACHE.get(mission_id)
        if not existing:
            return None
        if agent_id in existing.assigned_agent_ids:
            return existing
        agents = list(existing.assigned_agent_ids) + [agent_id]
        updated = existing.model_copy(
            update={"assigned_agent_ids": agents, "updated_at": datetime.now(timezone.utc)}
        )
        _CACHE[mission_id] = updated
        _append(updated)
        return updated


# ─── Civilization status helpers ──────────────────────────────────────

def civilization_summary() -> dict:
    """Snapshot used by OverviewPage."""
    _load_cache()
    with _LOCK:
        all_missions = list(_CACHE.values())
        active = [m for m in all_missions if m.status == "active"]
        completed = [m for m in all_missions if m.status == "completed"]
        blocked = [m for m in all_missions if m.status == "blocked"]
        return {
            "missions_total": len(all_missions),
            "missions_active": len(active),
            "missions_completed": len(completed),
            "missions_blocked": len(blocked),
            "missions_abandoned": len([m for m in all_missions if m.status == "abandoned"]),
        }


def mission_tree() -> list[dict]:
    """Tree shape for LedgerPage: missions as roots, runs as children."""
    _load_cache()
    with _LOCK:
        return [
            {
                "id": m.id,
                "title": m.title,
                "status": m.status,
                "run_ids": list(m.run_ids),
                "assigned_agent_ids": list(m.assigned_agent_ids),
                "created_at": m.created_at.isoformat(),
                "updated_at": m.updated_at.isoformat(),
            }
            for m in sorted(_CACHE.values(), key=lambda m: m.updated_at, reverse=True)
        ]
