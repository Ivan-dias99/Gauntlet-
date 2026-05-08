"""Tool manifest endpoint (read side of the permissions matrix)."""

from __future__ import annotations

from fastapi import APIRouter

router = APIRouter()


@router.get("/tools/manifests")
async def get_tool_manifests():
    """Sprint 5 — declarative governance shape for every registered tool.
    Read by the Control Center to render the permissions matrix. The
    agent's per-call gate consults ComposerSettings.tool_policies; this
    endpoint is the read side that lets the operator know what tools
    exist and their declared risk/mode/scopes.

    Uses the canonical default_tools() bundle rather than the agent's
    live registry — manifests are static, declared on the class, and
    independent of which subset the active agent has filtered in.
    Surfacing them all here lets the operator opt-out of any tool even
    before the agent boots."""
    from tools import ToolRegistry
    return {"tools": ToolRegistry().manifests()}
