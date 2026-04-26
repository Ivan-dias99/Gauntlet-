"""Surface generator: mock path returns a structured, validated plan."""

import pytest

from chambers.surface import SurfaceBrief, process_surface_streaming


@pytest.mark.asyncio
async def test_surface_mock_emits_start_plan_done():
    brief = SurfaceBrief(
        mode="prototype", fidelity="hi-fi", design_system="signal_canon",
    )
    types = []
    plan_payload = None
    async for event in process_surface_streaming("desenhar onboarding", brief):
        types.append(event["type"])
        if event["type"] == "surface_plan":
            plan_payload = event["plan"]
    assert types[0] == "start"
    assert "surface_plan" in types
    assert types[-1] == "done"
    assert plan_payload is not None
    assert plan_payload["design_system_binding"] == "signal_canon"
    assert plan_payload["mock"] is True


@pytest.mark.asyncio
async def test_surface_mock_uses_default_brief_when_none():
    types = []
    async for event in process_surface_streaming("intent", None):
        types.append(event["type"])
    assert types[-1] == "done"
