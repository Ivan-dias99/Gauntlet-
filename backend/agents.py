"""
Agent primitive — Gauntlet IDE.

An Agent is a persistent entity with identity, state, and continuity across
sessions. Not the per-execution loop in `agent.py` (that's a role); this is
the *entity* the operator directs.

Canonical path:  backend/agents.py
Storage:         data/agents.jsonl (append-only, last-write wins per id)
Spec source:     docs/canon/AGENTIC_IDE_NATIVE.md
"""
from __future__ import annotations

import json
import os
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator

# ─── Model ────────────────────────────────────────────────────────────

AgentStatus = Literal["idle", "active", "paused", "offline"]
AgentRole = Literal["composer", "agent", "triad", "memory_curator", "custom"]


class Agent(BaseModel):
    """Persistent agent entity. Lives across sessions; not per-execution."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # human-friendly: "Composer Daemon", "Memory Curator"
    role: AgentRole
    status: AgentStatus = "idle"
    current_mission_id: Optional[str] = None
    memory_budget_kb: int = 256
    memory_used_kb: int = 0
    last_seen_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    success_count: int = 0
    failure_count: int = 0
    failure_count_24h: int = 0
    color: str = "#0EA5C7"  # cyan default; IDE assigns from accent ramp
    description: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @field_validator("color")
    @classmethod
    def _validate_color(cls, v: str) -> str:
        if not v.startswith("#") or len(v) not in (4, 7):
            raise ValueError("color must be hex like #0EA5C7")
        return v

    @property
    def success_rate(self) -> float:
        total = self.success_count + self.failure_count
        return self.success_count / total if total > 0 else 0.0


class AgentUpdate(BaseModel):
    """Partial update payload — all fields optional."""
    name: Optional[str] = None
    status: Optional[AgentStatus] = None
    current_mission_id: Optional[str] = None
    memory_budget_kb: Optional[int] = None
    memory_used_kb: Optional[int] = None
    color: Optional[str] = None
    description: Optional[str] = None


# ─── Store ────────────────────────────────────────────────────────────

_DATA_DIR = Path(os.environ.get("GAUNTLET_DATA_DIR", "data"))
_STORE_PATH = _DATA_DIR / "agents.jsonl"
_LOCK = threading.RLock()
_CACHE: dict[str, Agent] = {}
_CACHE_LOADED = False


def _ensure_data_dir() -> None:
    _DATA_DIR.mkdir(parents=True, exist_ok=True)


def _load_cache() -> None:
    """Replay jsonl into in-memory cache. Last write per id wins."""
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
                        agent = Agent(**data)
                        _CACHE[agent.id] = agent
                    except Exception:
                        # Skip corrupt rows; observability layer will surface
                        continue
        _CACHE_LOADED = True


def _append(agent: Agent) -> None:
    """Append a single record to the jsonl file (atomic via lock)."""
    _ensure_data_dir()
    payload = agent.model_dump_json()
    with _STORE_PATH.open("a", encoding="utf-8") as f:
        f.write(payload + "\n")


# ─── Public API ───────────────────────────────────────────────────────

def list_agents(status: Optional[AgentStatus] = None) -> list[Agent]:
    """Return all known agents, optionally filtered by status."""
    _load_cache()
    with _LOCK:
        agents = list(_CACHE.values())
        if status:
            agents = [a for a in agents if a.status == status]
        return sorted(agents, key=lambda a: a.last_seen_at, reverse=True)


def get_agent(agent_id: str) -> Optional[Agent]:
    """Return one agent by id, or None."""
    _load_cache()
    with _LOCK:
        return _CACHE.get(agent_id)


def create_agent(agent: Agent) -> Agent:
    """Persist a new agent. Idempotent on id."""
    _load_cache()
    with _LOCK:
        _CACHE[agent.id] = agent
        _append(agent)
        return agent


def update_agent(agent_id: str, patch: AgentUpdate) -> Optional[Agent]:
    """Apply a partial update and append the new state. Returns updated agent."""
    _load_cache()
    with _LOCK:
        existing = _CACHE.get(agent_id)
        if not existing:
            return None
        updates = patch.model_dump(exclude_unset=True)
        if updates:
            updated = existing.model_copy(
                update={**updates, "last_seen_at": datetime.now(timezone.utc)}
            )
            _CACHE[agent_id] = updated
            _append(updated)
            return updated
        return existing


def heartbeat(agent_id: str) -> Optional[Agent]:
    """Update last_seen_at. Used by agent loops to signal liveness."""
    return update_agent(agent_id, AgentUpdate())


def record_success(agent_id: str) -> Optional[Agent]:
    """Increment success counter. Append state."""
    _load_cache()
    with _LOCK:
        existing = _CACHE.get(agent_id)
        if not existing:
            return None
        updated = existing.model_copy(
            update={
                "success_count": existing.success_count + 1,
                "last_seen_at": datetime.now(timezone.utc),
            }
        )
        _CACHE[agent_id] = updated
        _append(updated)
        return updated


def record_failure(agent_id: str) -> Optional[Agent]:
    """Increment failure counter. Append state."""
    _load_cache()
    with _LOCK:
        existing = _CACHE.get(agent_id)
        if not existing:
            return None
        updated = existing.model_copy(
            update={
                "failure_count": existing.failure_count + 1,
                "failure_count_24h": existing.failure_count_24h + 1,
                "last_seen_at": datetime.now(timezone.utc),
            }
        )
        _CACHE[agent_id] = updated
        _append(updated)
        return updated


# ─── Civilization status helpers ──────────────────────────────────────

def civilization_status() -> dict:
    """Snapshot used by OverviewPage hero KPIs."""
    _load_cache()
    with _LOCK:
        all_agents = list(_CACHE.values())
        active = [a for a in all_agents if a.status == "active"]
        idle = [a for a in all_agents if a.status == "idle"]
        return {
            "agents_total": len(all_agents),
            "agents_active": len(active),
            "agents_idle": len(idle),
            "agents_offline": len([a for a in all_agents if a.status == "offline"]),
            "memory_used_kb": sum(a.memory_used_kb for a in all_agents),
            "memory_budget_kb": sum(a.memory_budget_kb for a in all_agents),
        }
