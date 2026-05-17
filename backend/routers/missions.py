"""
Missions HTTP router — Gauntlet IDE.

Canonical path: backend/routers/missions.py
Mounted at:     /missions
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

import missions as mission_store
from missions import Mission, MissionStatus, MissionUpdate, RunLink

router = APIRouter(prefix="/missions", tags=["missions"])


@router.get("", response_model=list[Mission])
async def list_missions(
    status: Optional[MissionStatus] = Query(None),
    agent_id: Optional[str] = Query(None),
):
    """List missions; optionally filter by status or assigned agent."""
    return mission_store.list_missions(status=status, agent_id=agent_id)


@router.get("/summary", response_model=dict)
async def civilization_summary():
    """Snapshot of mission civilization. Powers OverviewPage."""
    return mission_store.civilization_summary()


@router.get("/tree", response_model=list[dict])
async def mission_tree():
    """Tree shape — roots are missions, children are runs.
    Used by LedgerPage to render trajectory-by-mission instead of chronological."""
    return mission_store.mission_tree()


@router.get("/{mission_id}", response_model=Mission)
async def get_mission(mission_id: str):
    mission = mission_store.get_mission(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail=f"Mission {mission_id} not found")
    return mission


@router.post("", response_model=Mission, status_code=201)
async def create_mission(mission: Mission):
    """Create a new mission (defaults to 'draft' status)."""
    return mission_store.create_mission(mission)


@router.patch("/{mission_id}", response_model=Mission)
async def update_mission(mission_id: str, patch: MissionUpdate):
    """Partial update. Setting status to 'completed' or 'abandoned' stamps completed_at."""
    updated = mission_store.update_mission(mission_id, patch)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Mission {mission_id} not found")
    return updated


@router.post("/{mission_id}/runs", response_model=Mission)
async def link_run(mission_id: str, link: RunLink):
    """Link a run (and optional intent_id) to this mission. Idempotent."""
    updated = mission_store.link_run(mission_id, link.run_id, link.intent_id)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Mission {mission_id} not found")
    return updated


@router.post("/{mission_id}/agents/{agent_id}", response_model=Mission)
async def assign_agent(mission_id: str, agent_id: str):
    """Assign an agent to this mission. Idempotent."""
    updated = mission_store.assign_agent(mission_id, agent_id)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Mission {mission_id} not found")
    return updated
