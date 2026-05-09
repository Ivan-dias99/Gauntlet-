"""
Gauntlet — ComputerUseTool tests (Phase 3 MVP, commit 4/N).

The tool is a *declared intent* — its `_run` returns a marker
`ToolResult` whose `metadata.client_action` carries the action shape;
the cápsula intercepts the tool_use frame in the SSE stream (commit
5/N) and routes it through the consent gate before the OS sees a
synthetic mouse / keyboard event. These tests pin the contract the
cápsula will rely on: schema validation, envelope shape, error paths.

Run:
    pytest -q test_computer_use_tool.py
"""

from __future__ import annotations

import pytest

from tools import ComputerUseTool, default_tools


@pytest.fixture
def tool() -> ComputerUseTool:
    return ComputerUseTool()


@pytest.mark.asyncio
async def test_move_action_emits_xy_envelope(tool: ComputerUseTool) -> None:
    result = await tool.execute(action="move", x=400, y=300, reason="smoke")
    assert result.ok is True
    assert result.metadata["client_action"] == {
        "kind": "move",
        "x": 400,
        "y": 300,
        "reason": "smoke",
    }


@pytest.mark.asyncio
async def test_click_action_defaults_to_left_button(tool: ComputerUseTool) -> None:
    result = await tool.execute(action="click")
    assert result.ok is True
    assert result.metadata["client_action"] == {"kind": "click", "button": "left"}


@pytest.mark.asyncio
@pytest.mark.parametrize("button", ["left", "right", "middle"])
async def test_click_accepts_each_canonical_button(
    tool: ComputerUseTool, button: str
) -> None:
    result = await tool.execute(action="click", button=button)
    assert result.ok is True
    assert result.metadata["client_action"]["button"] == button


@pytest.mark.asyncio
async def test_click_rejects_unknown_button(tool: ComputerUseTool) -> None:
    result = await tool.execute(action="click", button="x1")
    assert result.ok is False
    assert "bad button" in result.content


@pytest.mark.asyncio
async def test_type_action_carries_text(tool: ComputerUseTool) -> None:
    result = await tool.execute(action="type", text="hello")
    assert result.ok is True
    assert result.metadata["client_action"] == {"kind": "type", "text": "hello"}


@pytest.mark.asyncio
async def test_type_rejects_empty_text(tool: ComputerUseTool) -> None:
    result = await tool.execute(action="type", text="")
    assert result.ok is False
    assert "non-empty 'text'" in result.content


@pytest.mark.asyncio
async def test_type_rejects_overlong_text(tool: ComputerUseTool) -> None:
    # 10 001 chars — one past the 10 000 cap that mirrors the Rust-side
    # CU_MAX_TEXT_LEN. Aligned on purpose so a runaway loop bumping the
    # cap on either side stays consistent.
    result = await tool.execute(action="type", text="x" * 10_001)
    assert result.ok is False
    assert "too long" in result.content


@pytest.mark.asyncio
async def test_press_action_carries_key(tool: ComputerUseTool) -> None:
    result = await tool.execute(action="press", key="Enter")
    assert result.ok is True
    assert result.metadata["client_action"] == {"kind": "press", "key": "Enter"}


@pytest.mark.asyncio
async def test_press_rejects_empty_key(tool: ComputerUseTool) -> None:
    result = await tool.execute(action="press", key="")
    assert result.ok is False
    assert "non-empty 'key'" in result.content


@pytest.mark.asyncio
async def test_unknown_action_rejected(tool: ComputerUseTool) -> None:
    result = await tool.execute(action="explode")
    assert result.ok is False
    assert "unknown action" in result.content


@pytest.mark.asyncio
async def test_move_requires_integer_coordinates(tool: ComputerUseTool) -> None:
    # Float coordinates from a hallucinating model — reject so a Tauri
    # bridge truncate doesn't silently move the cursor to the floor of
    # the float.
    result = await tool.execute(action="move", x=1.5, y=2)
    assert result.ok is False
    assert "integer 'x' and 'y'" in result.content


@pytest.mark.asyncio
async def test_reason_is_optional_but_preserved_when_present(
    tool: ComputerUseTool,
) -> None:
    # No reason — envelope omits the field rather than carrying None.
    no_reason = await tool.execute(action="press", key="Tab")
    assert "reason" not in no_reason.metadata["client_action"]

    # With reason — surfaces verbatim on the gate.
    with_reason = await tool.execute(
        action="press", key="Tab", reason="navigate to next field"
    )
    assert with_reason.metadata["client_action"]["reason"] == "navigate to next field"


def test_governance_metadata_marks_high_risk_with_approval() -> None:
    """Gate visible in Control Center — operator must be able to disable."""
    tool = ComputerUseTool()
    assert tool.mode == "execute_with_approval"
    assert tool.risk == "high"
    assert tool.scopes == ("computer.use",)


def test_default_tools_bundle_includes_computer_use() -> None:
    """The standard registry bundle ships computer_use so the operator
    sees it on /tools/manifests immediately, not after a config opt-in."""
    bundle = default_tools()
    names = [t.name for t in bundle]
    assert "computer_use" in names


# ── ComputerUseAction Pydantic wire-format validation ─────────────────────
# These tests pin the contract the cápsula's plan-dispatcher relies on
# when the model emits `{"type":"computer_use","action":{...}}` as part
# of its DomPlanResult JSON. Mirrors the JS `ComputerUseAction` union
# 1:1 — drift here breaks end-to-end actuation.

import pytest as _pytest_for_models  # noqa: E402  (kept local to avoid
                                     #  reordering existing imports)
from pydantic import TypeAdapter, ValidationError

from models import ComputerUseAction, DomAction


_DOM_ADAPTER = TypeAdapter(list[DomAction])


def test_dom_action_union_accepts_computer_use_move() -> None:
    raw = [
        {
            "type": "computer_use",
            "action": {
                "kind": "move",
                "x": 400,
                "y": 300,
                "reason": "centre of viewport",
            },
        }
    ]
    parsed = _DOM_ADAPTER.validate_python(raw)
    assert isinstance(parsed[0], ComputerUseAction)
    assert parsed[0].action.kind == "move"
    assert parsed[0].action.x == 400
    assert parsed[0].action.y == 300
    assert parsed[0].action.reason == "centre of viewport"


def test_dom_action_union_accepts_computer_use_click_with_default_button() -> None:
    raw = [{"type": "computer_use", "action": {"kind": "click"}}]
    parsed = _DOM_ADAPTER.validate_python(raw)
    # Validator fills in the default 'left' so downstream consumers
    # don't have to second-guess.
    assert parsed[0].action.button == "left"


def test_dom_action_union_accepts_computer_use_type_and_press() -> None:
    raw = [
        {"type": "computer_use", "action": {"kind": "type", "text": "hello"}},
        {"type": "computer_use", "action": {"kind": "press", "key": "Enter"}},
    ]
    parsed = _DOM_ADAPTER.validate_python(raw)
    assert parsed[0].action.text == "hello"
    assert parsed[1].action.key == "Enter"


def test_computer_use_move_rejects_missing_coordinates() -> None:
    with _pytest_for_models.raises(ValidationError):
        _DOM_ADAPTER.validate_python(
            [{"type": "computer_use", "action": {"kind": "move", "x": 1}}]
        )


def test_computer_use_type_rejects_empty_text() -> None:
    with _pytest_for_models.raises(ValidationError):
        _DOM_ADAPTER.validate_python(
            [{"type": "computer_use", "action": {"kind": "type", "text": ""}}]
        )


def test_computer_use_press_rejects_empty_key() -> None:
    with _pytest_for_models.raises(ValidationError):
        _DOM_ADAPTER.validate_python(
            [{"type": "computer_use", "action": {"kind": "press", "key": ""}}]
        )


def test_computer_use_text_capped_at_10000_chars() -> None:
    # Cap mirrors the Rust CU_MAX_TEXT_LEN exactly — runaway loop on one
    # side stays consistent with the other.
    payload = [
        {
            "type": "computer_use",
            "action": {"kind": "type", "text": "x" * 10_001},
        }
    ]
    with _pytest_for_models.raises(ValidationError):
        _DOM_ADAPTER.validate_python(payload)


def test_computer_use_button_must_be_canonical() -> None:
    with _pytest_for_models.raises(ValidationError):
        _DOM_ADAPTER.validate_python(
            [
                {
                    "type": "computer_use",
                    "action": {"kind": "click", "button": "x1"},
                }
            ]
        )
