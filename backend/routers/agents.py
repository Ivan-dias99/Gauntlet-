"""
Agents HTTP router — Gauntlet IDE.

Canonical path: backend/routers/agents.py
Mounted at:     /agents
Spec:           docs/canon/AGENTIC_IDE_NATIVE.md
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

import agents as agent_store
from agents import Agent, AgentStatus, AgentUpdate

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("", response_model=list[Agent])
async def list_agents(status: Optional[AgentStatus] = Query(None)):
    """List all agents; filter by status if provided."""
    return agent_store.list_agents(status=status)


@router.get("/status", response_model=dict)
async def civilization_status():
    """Snapshot of agent civilization. Powers OverviewPage hero KPIs."""
    return agent_store.civilization_status()


@router.get("/{agent_id}", response_model=Agent)
async def get_agent(agent_id: str):
    agent = agent_store.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    return agent


@router.post("", response_model=Agent, status_code=201)
async def create_agent(agent: Agent):
    """Create a new agent. Idempotent on id."""
    return agent_store.create_agent(agent)


@router.patch("/{agent_id}", response_model=Agent)
async def update_agent(agent_id: str, patch: AgentUpdate):
    """Partial update — fields not in payload are unchanged."""
    updated = agent_store.update_agent(agent_id, patch)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    return updated


@router.post("/{agent_id}/heartbeat", response_model=Agent)
async def heartbeat(agent_id: str):
    """Signal liveness — updates last_seen_at."""
    updated = agent_store.heartbeat(agent_id)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    return updated


@router.post("/{agent_id}/events/success", response_model=Agent)
async def record_success(agent_id: str):
    """Increment success counter for this agent."""
    updated = agent_store.record_success(agent_id)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    return updated


@router.post("/{agent_id}/events/failure", response_model=Agent)
async def record_failure(agent_id: str):
    """Increment failure counter for this agent."""
    updated = agent_store.record_failure(agent_id)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
    return updated
