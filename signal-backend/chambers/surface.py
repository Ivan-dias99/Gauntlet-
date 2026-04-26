"""
Signal — Surface chamber

Surface is the design workstation: mode × fidelity × design-system × brief
→ structured ``SurfacePlan``. The real generator drives Anthropic Sonnet 4.6
with a JSON-mode prompt and validates the response through Pydantic before
emitting the SSE ``done`` event. ``mock`` mode is reserved for the offline
``SIGNAL_MOCK=1`` smoke path.
"""

from __future__ import annotations

import json
import logging
import time
from typing import AsyncIterator, Literal, Optional

from anthropic import AsyncAnthropic
from pydantic import BaseModel, Field, ValidationError

from chambers.profiles import ChamberKey
from config import ANTHROPIC_API_KEY, MAX_TOKENS, MODEL_ID, SIGNAL_MOCK
from mock_client import MockAsyncAnthropic

logger = logging.getLogger("signal.surface")


# ── Input brief (carried alongside SignalQuery.surface) ────────────────────

Mode = Literal["prototype", "slide_deck", "from_template", "other"]
Fidelity = Literal["wireframe", "hi-fi"]
# Explicit design-system decision. ``signal_canon`` is the in-house token
# set; ``custom`` is anything the operator brings; ``none_declared`` is a
# valid explicit decision (silent ``None`` is no longer accepted).
DesignSystemDecision = Literal["signal_canon", "custom", "none_declared"]


class SurfaceBrief(BaseModel):
    mode: Mode = "prototype"
    fidelity: Fidelity = "hi-fi"
    design_system: DesignSystemDecision = Field(
        "none_declared",
        description=(
            "Explicit design-system decision. The previous Optional[str] was "
            "rejected because silent null hid 'I forgot' from 'I don't want one'."
        ),
    )
    design_system_label: Optional[str] = Field(
        None,
        max_length=64,
        description=(
            "Optional human-readable label that pairs with design_system='custom' "
            "(e.g. 'Material', 'Tailwind UI'). Ignored for the other decisions."
        ),
    )


# ── Output contract (carried in the SSE `surface_plan` and `done` events) ──

class SurfaceScreen(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    purpose: str = Field(..., min_length=1, max_length=240)


class SurfaceComponent(BaseModel):
    screen: str = Field(..., min_length=1, max_length=80)
    name: str = Field(..., min_length=1, max_length=80)
    kind: str = Field(..., min_length=1, max_length=32)


class SurfacePlan(BaseModel):
    mode: Mode
    fidelity: Fidelity
    design_system_binding: DesignSystemDecision
    design_system_label: Optional[str] = None
    screens: list[SurfaceScreen] = Field(..., min_length=1, max_length=20)
    components: list[SurfaceComponent] = Field(default_factory=list, max_length=200)
    notes: list[str] = Field(default_factory=list, max_length=20)
    mock: bool = False


# ── Real generator ──────────────────────────────────────────────────────────

_SURFACE_SYSTEM_PROMPT = """\
You are the Signal Surface generator. Translate a design brief into a
strictly typed visual contract: screens with explicit purpose and a
component inventory tied to those screens.

Rules:
- Output MUST be a single JSON object — no prose, no markdown, no fences.
- Top-level keys: screens, components, notes.
- Each screen: { "name": str, "purpose": str }.
- Each component: { "screen": str (must match a screen.name), "name": str,
  "kind": one of: button, card, rail, input, nav, list, table, panel,
  modal, badge }.
- 1–8 screens; component count scales with fidelity (hi-fi denser,
  wireframe sparser).
- notes: 0–6 short strings. Surface concrete decisions, not platitudes.
- Use the user's input language for the labels. Default to Portuguese
  if the brief itself is empty.
- Do NOT fabricate features the brief did not ask for. If the brief is
  underspecified, mark assumptions in `notes`.
- Never emit `mock: true` — this generator is the real path.

The schema is strict; any deviation will be rejected and the user will
see an honest error.
"""


def _client() -> AsyncAnthropic | MockAsyncAnthropic:
    if SIGNAL_MOCK:
        return MockAsyncAnthropic()
    return AsyncAnthropic(api_key=ANTHROPIC_API_KEY)


def _user_prompt(question: str, brief: SurfaceBrief) -> str:
    ds_label = brief.design_system_label or "—"
    return (
        f"# Surface brief\n"
        f"- mode: {brief.mode}\n"
        f"- fidelity: {brief.fidelity}\n"
        f"- design_system: {brief.design_system}"
        f" ({ds_label})\n\n"
        f"# Intent\n{question.strip() or '(brief vazia)'}\n"
    )


def _extract_json(content: str) -> dict:
    """Anthropic sometimes wraps JSON in fences even when told not to.
    Strip the most common wrappers before parsing."""
    text = content.strip()
    if text.startswith("```"):
        # Drop opening fence (and optional ``json`` tag).
        text = text.split("\n", 1)[1] if "\n" in text else text
        if text.endswith("```"):
            text = text[: -3]
    return json.loads(text)


async def _generate_real_plan(question: str, brief: SurfaceBrief) -> SurfacePlan:
    """Call Sonnet 4.6 and parse the strict JSON plan."""
    client = _client()
    response = await client.messages.create(
        model=MODEL_ID,
        max_tokens=MAX_TOKENS,
        temperature=0.2,
        system=_SURFACE_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": _user_prompt(question, brief)}],
    )
    # Concatenate all text blocks (Anthropic returns a list of blocks).
    raw_text = "".join(
        getattr(block, "text", "")
        for block in response.content
        if getattr(block, "type", "") == "text"
    ).strip()
    if not raw_text:
        raise ValueError("Surface generator returned empty content")
    payload = _extract_json(raw_text)
    plan = SurfacePlan(
        mode=brief.mode,
        fidelity=brief.fidelity,
        design_system_binding=brief.design_system,
        design_system_label=(
            brief.design_system_label if brief.design_system == "custom" else None
        ),
        screens=payload.get("screens", []),
        components=payload.get("components", []),
        notes=payload.get("notes", []),
        mock=False,
    )
    # Component.screen must reference an existing screen.name — a model
    # that drifts here gets caught now, not later in the UI.
    screen_names = {s.name for s in plan.screens}
    for comp in plan.components:
        if comp.screen not in screen_names:
            raise ValidationError.from_exception_data(
                title="SurfacePlan",
                line_errors=[
                    {
                        "type": "value_error",
                        "loc": ("components", "screen"),
                        "msg": (
                            f"component '{comp.name}' references unknown "
                            f"screen '{comp.screen}'"
                        ),
                        "input": comp.screen,
                    }
                ],
            )
    return plan


def _compose_mock_plan(question: str, brief: SurfaceBrief) -> SurfacePlan:
    """Deterministic plan used only when SIGNAL_MOCK=1."""
    q = (question or "").strip()[:80] or "ponto de entrada"
    screens = [
        SurfaceScreen(name="Entrada", purpose=q),
        SurfaceScreen(name="Fluxo", purpose="passos principais"),
        SurfaceScreen(name="Resultado", purpose="estado aceite ou recusado"),
    ]
    components = [
        SurfaceComponent(screen=s.name, name=f"{s.name} · bloco", kind="card")
        for s in screens
    ]
    return SurfacePlan(
        mode=brief.mode,
        fidelity=brief.fidelity,
        design_system_binding=brief.design_system,
        design_system_label=(
            brief.design_system_label if brief.design_system == "custom" else None
        ),
        screens=screens,
        components=components,
        notes=[
            "Plano gerado em modo mock (SIGNAL_MOCK=1).",
            "Nenhum provider foi chamado.",
        ],
        mock=True,
    )


async def process_surface_streaming(
    question: str,
    brief: Optional[SurfaceBrief],
) -> AsyncIterator[dict]:
    """Emit an SSE stream that matches the agent/triad envelope so the
    frontend's openStream helper does not need a parallel code path.

    Event envelope:
        {type: "start"}
        {type: "surface_plan", plan: {...SurfacePlan dict...}}
        {type: "done", answer, plan, mock, processing_time_ms, ...}

    On generator failure a typed ``error`` frame closes the stream.
    """
    started = time.monotonic()
    yield {"type": "start"}

    effective_brief = brief or SurfaceBrief()

    try:
        if SIGNAL_MOCK:
            plan = _compose_mock_plan(question, effective_brief)
        else:
            plan = await _generate_real_plan(question, effective_brief)
    except (ValidationError, ValueError, json.JSONDecodeError) as exc:
        logger.error("Surface generator failed: %s", exc)
        yield {
            "type": "error",
            "message": str(exc),
            "error": "surface_generation_failed",
            "reason": type(exc).__name__,
        }
        return
    except Exception as exc:  # noqa: BLE001
        logger.exception("Surface generator crashed")
        yield {
            "type": "error",
            "message": str(exc),
            "error": "surface_generation_failed",
            "reason": type(exc).__name__,
        }
        return

    yield {"type": "surface_plan", "plan": plan.model_dump()}

    answer_lines = [
        f"Surface plan — {plan.mode} / {plan.fidelity}",
        f"Design system: {plan.design_system_binding}"
        + (f" ({plan.design_system_label})" if plan.design_system_label else ""),
        f"Screens: {', '.join(s.name for s in plan.screens)}",
        f"Components: {len(plan.components)}",
        f"Mock: {str(plan.mock).lower()}",
    ]
    answer = "\n".join(answer_lines)

    yield {
        "type": "done",
        "answer": answer,
        "plan": plan.model_dump(),
        "mock": plan.mock,
        "chamber": ChamberKey.SURFACE.value,
        "processing_time_ms": int((time.monotonic() - started) * 1000),
        "input_tokens": 0,
        "output_tokens": 0,
        "terminated_early": False,
        "termination_reason": None,
    }


# Compatibility alias for callers that imported the old name.
process_surface_mock_streaming = process_surface_streaming
