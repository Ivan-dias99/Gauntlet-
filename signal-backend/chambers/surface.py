"""
Signal — Surface chamber (Wave 3, mock-first backend).

Surface is the design workstation chamber: mode × fidelity × design-system
binding × brief → structured SurfacePlan. The handler in this module is
INTENTIONALLY A MOCK. No multimodal provider is wired, no real generation
happens — the function returns a canned plan shaped by the input so the
frontend can exercise the contract end-to-end.

The mock flag is carried in the response envelope (``mock: True``) so the
UI can display an explicit badge. Silent pretend-AI is worse than nothing.

Wave 5 swaps the mock for a real provider-backed implementation with an
output contract validator in front of the SSE ``done`` event.
"""

from __future__ import annotations

import time
from typing import AsyncIterator, Literal, Optional

from pydantic import BaseModel, Field

from chambers.profiles import ChamberKey


# ── Input brief (carried alongside SignalQuery.surface) ────────────────────

Mode = Literal["prototype", "slide_deck", "from_template", "other"]
Fidelity = Literal["wireframe", "hi-fi"]


class SurfaceBrief(BaseModel):
    mode: Mode = "prototype"
    fidelity: Fidelity = "hi-fi"
    design_system: Optional[str] = Field(
        None,
        max_length=64,
        description="Selected design system name. Optional in Wave 3; becomes a "
                    "hard requirement in Wave 5 once real generation wires up.",
    )


# ── Output contract (carried in the SSE `surface_plan` and `done` events) ──

class SurfaceScreen(BaseModel):
    name: str
    purpose: str


class SurfaceComponent(BaseModel):
    screen: str
    name: str
    kind: str  # "button" | "card" | "rail" | "input" | "nav" | "list"


class SurfacePlan(BaseModel):
    mode: Mode
    fidelity: Fidelity
    design_system_binding: Optional[str]
    screens: list[SurfaceScreen]
    components: list[SurfaceComponent]
    notes: list[str] = Field(default_factory=list)
    mock: bool = True


# ── Mock handler ────────────────────────────────────────────────────────────

def _compose_mock_plan(question: str, brief: SurfaceBrief) -> SurfacePlan:
    """Build a canned plan shaped by the input. Deterministic on the brief."""
    q = (question or "").strip()[:80]
    mode = brief.mode
    fidelity = brief.fidelity
    ds = brief.design_system

    # Screens depend on mode. Keep the sets small and labelled in Portuguese,
    # matching the default shell locale.
    if mode == "slide_deck":
        screens = [
            SurfaceScreen(name="Capa", purpose=f"Título: {q}"),
            SurfaceScreen(name="Contexto", purpose="Problema e tese"),
            SurfaceScreen(name="Direção", purpose="Escolhas, consequências"),
            SurfaceScreen(name="Fecho", purpose="Próxima decisão"),
        ]
    elif mode == "from_template":
        screens = [
            SurfaceScreen(name="Template base", purpose=ds or "sem design system"),
            SurfaceScreen(name="Home adaptada", purpose=q),
            SurfaceScreen(name="Detalhe adaptado", purpose="layout derivado"),
        ]
    elif mode == "other":
        screens = [
            SurfaceScreen(name="Superfície livre", purpose=q),
        ]
    else:  # prototype (default)
        screens = [
            SurfaceScreen(name="Entrada", purpose=q or "ponto de entrada"),
            SurfaceScreen(name="Fluxo", purpose="passos principais"),
            SurfaceScreen(name="Resultado", purpose="estado aceite ou recusado"),
        ]

    # Components list thickness tracks fidelity — wireframes are sparser.
    if fidelity == "wireframe":
        components = [
            SurfaceComponent(screen=s.name, name=f"{s.name} · bloco", kind="card")
            for s in screens
        ]
    else:
        components = []
        for s in screens:
            components.append(SurfaceComponent(screen=s.name, name=f"{s.name} · nav", kind="nav"))
            components.append(SurfaceComponent(screen=s.name, name=f"{s.name} · corpo", kind="card"))
            components.append(SurfaceComponent(screen=s.name, name=f"{s.name} · ação", kind="button"))

    notes = [
        "Plano gerado em modo mock — nenhum provider multimodal foi chamado.",
        f"Brief: mode={mode}, fidelity={fidelity}, design_system={ds or 'não definido'}.",
    ]
    if ds is None:
        notes.append(
            "Wave 5: design system passará a ser obrigatório antes de gerar. "
            "Em Wave 3 é apenas opcional para não bloquear o smoke do shell."
        )

    return SurfacePlan(
        mode=mode,
        fidelity=fidelity,
        design_system_binding=ds,
        screens=screens,
        components=components,
        notes=notes,
        mock=True,
    )


async def process_surface_mock_streaming(
    question: str,
    brief: Optional[SurfaceBrief],
) -> AsyncIterator[dict]:
    """Emit an SSE stream that matches the shape of the agent/triad streams
    so the frontend's openStream helper does not need a parallel code path.

    Event envelope:
        {type: "start"}
        {type: "surface_plan", plan: {...SurfacePlan dict...}}
        {type: "done", answer, plan, mock, processing_time_ms, input_tokens,
                       output_tokens, terminated_early, termination_reason}
    """
    started = time.monotonic()
    yield {"type": "start"}

    effective_brief = brief or SurfaceBrief()
    plan = _compose_mock_plan(question, effective_brief)

    yield {"type": "surface_plan", "plan": plan.model_dump()}

    answer_lines = [
        f"Surface plan — {plan.mode} / {plan.fidelity}",
        f"Design system: {plan.design_system_binding or 'não definido'}",
        f"Screens: {', '.join(s.name for s in plan.screens)}",
        f"Components: {len(plan.components)}",
        "Mock: true",
    ]
    answer = "\n".join(answer_lines)

    yield {
        "type": "done",
        "answer": answer,
        "plan": plan.model_dump(),
        "mock": True,
        "chamber": ChamberKey.SURFACE.value,
        "processing_time_ms": int((time.monotonic() - started) * 1000),
        "input_tokens": 0,
        "output_tokens": 0,
        "terminated_early": False,
        "termination_reason": None,
    }
