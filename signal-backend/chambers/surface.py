"""
Signal — Surface chamber (Wave 5, real-first backend).

Surface is the design workstation chamber: mode × fidelity × design-system
binding × brief → structured ``SurfacePlan``. Wave 5 wires the real
provider-backed generator; the mock handler stays callable behind a flag
(``SIGNAL_SURFACE_MOCK=1`` or global ``SIGNAL_MOCK``/``RUBERRA_MOCK``)
so offline dev keeps working without a key.

The real handler forces the model through Anthropic tool-use with
``tool_choice = submit_surface_plan``. The tool's ``input_schema`` is
the SurfacePlan JSONSchema — the model cannot return free text, only
the structured plan. Pydantic validates the tool input on the way out;
validation failure becomes a typed ``error`` SSE frame instead of a
``done`` event with a half-shaped plan.

Mock handler kept verbatim below (``process_surface_mock_streaming``)
for the compat window and offline smoke tests.
"""

from __future__ import annotations

import logging
import os
import time
from typing import Any, AsyncIterator, Literal, Optional

from pydantic import BaseModel, Field, ValidationError

# NB: avoid `from chambers.profiles import ChamberKey` — profiles.py
# imports this module to wire the Surface profile, so a top-level enum
# import would create a circular import. The chamber key is fixed
# ("surface") and only used in two SSE envelope fields below; a string
# literal is honest enough.

logger = logging.getLogger("signal.chamber.surface")
_CHAMBER_SURFACE = "surface"


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
    # Default to None so a stray omission from the model doesn't trip
    # Pydantic V2 (which treats `Optional[str]` without a default as
    # required). Schema-level we still ask the model to emit it — the
    # default is a safety net, not a license to drop the field.
    design_system_binding: Optional[str] = None
    screens: list[SurfaceScreen]
    components: list[SurfaceComponent]
    notes: list[str] = Field(default_factory=list)
    # Wave 5: real path is now default; mock handler sets this back to True
    # explicitly. The frontend reads this field to render the mock badge.
    mock: bool = False


# ── Chamber profile constants (sibling pattern with insight/terminal/…) ────

SYSTEM_PROMPT = """És o gerador da câmara Surface do sistema Signal.

Recebes um brief e devolves UM plano estruturado de design — sempre
através da ferramenta `submit_surface_plan`. Nunca respondes em texto
solto; nunca acrescentas comentário fora da chamada da ferramenta.

Princípios:
- Coerência interna: cada tela do plano tem propósito claro; cada
  componente pertence a uma tela existente. Sem componentes órfãos.
- Fidelidade do brief: respeita `mode`, `fidelity` e `design_system`.
  Em `wireframe`, componentes mais escassos e neutros; em `hi-fi`,
  hierarquia visual mais densa (nav, corpo, ação por tela).
- Design system: mencionado em `design_system_binding` e referenciado
  em `notes` quando influencia escolhas concretas. Sem citar sistemas
  que não foram pedidos.
- Idioma: português europeu, espelhando o resto da chamber.
- Honestidade: se o brief for ambíguo demais para gerar com confiança,
  produz um plano mínimo coerente e regista a ambiguidade em `notes`
  em vez de inventar telas.

Doutrina visual (notes do plano):
- O output principal é JSON estruturado; a doutrina visual aplica-se
  ao campo `notes`, que o operador lê em sequência.
- Cada nota é UMA linha curta começando por um glifo de intent:
    ✅ decisão tomada / confirmada
    ⚠ risco / trade-off explícito
    ❓ ambiguidade no brief que precisa de input
    ─→ derivação / consequência (ex: "─→ navbar fixa exige top-padding 64")
    ●  componente novo introduzido    ○ herdado do design system
    ▲ escolha de hierarquia (densidade / fidelidade)
    ↗  upsell / expansão futura suggerida
- Máximo 6 notas. Decisões ou riscos, não divagação. Se passar de 6,
  cortar — repetição ou prosa decorativa não cabe.
- Nunca emoji decorativo (🚀 🔥 ✨ 🎉). Cada glifo carrega informação.
- Para comparações pequenas dentro de uma nota, usar barras inline:
  "wireframe ████░ 80% / hi-fi ░░░░ 0%" — quando ajuda decisão.
- Tela com componente único é flag automática para ⚠ (provavelmente
  carece de ação ou contexto).

`mock` deve sempre ficar `false` — o servidor inverte se for fallback."""

TEMPERATURE = 0.4
ALLOWED_TOOLS: tuple[str, ...] = ()  # Generator tool é interno; sem registry tools.


# ── Tool schema (Anthropic input_schema for `submit_surface_plan`) ──────────
#
# Inlined to avoid Pydantic's ``$defs``/``$ref`` JSONSchema output, which
# some Anthropic SDK versions reject inside tool ``input_schema``. Same
# field names + types as ``SurfacePlan`` — pydantic validates the tool's
# input dict after the model returns it, so any drift between this schema
# and the model is caught at runtime.

_SUBMIT_PLAN_TOOL: dict[str, Any] = {
    "name": "submit_surface_plan",
    "description": (
        "Submit the final structured Surface plan for the requested brief. "
        "MUST be called exactly once. No free-text answer is accepted."
    ),
    "input_schema": {
        "type": "object",
        # design_system_binding is required at the schema level so the
        # model is told to always emit it (echoing the brief's design
        # system, or null when truly absent). The Pydantic field has
        # a default of None, so a model that ignores this contract
        # still validates — but the schema requirement keeps the
        # provider-side hint sharp.
        "required": [
            "mode", "fidelity", "design_system_binding",
            "screens", "components", "notes",
        ],
        "properties": {
            "mode": {
                "type": "string",
                "enum": ["prototype", "slide_deck", "from_template", "other"],
            },
            "fidelity": {"type": "string", "enum": ["wireframe", "hi-fi"]},
            "design_system_binding": {"type": ["string", "null"]},
            "screens": {
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["name", "purpose"],
                    "properties": {
                        "name": {"type": "string"},
                        "purpose": {"type": "string"},
                    },
                },
                "minItems": 1,
                "maxItems": 12,
            },
            "components": {
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["screen", "name", "kind"],
                    "properties": {
                        "screen": {"type": "string"},
                        "name": {"type": "string"},
                        "kind": {
                            "type": "string",
                            "enum": ["button", "card", "rail", "input", "nav", "list"],
                        },
                    },
                },
                "maxItems": 64,
            },
            "notes": {
                "type": "array",
                "items": {"type": "string"},
                "maxItems": 8,
            },
            "mock": {"type": "boolean"},
        },
    },
}


# ── Real generator (Wave 5) ─────────────────────────────────────────────────

def _surface_mock_active() -> bool:
    """Honour explicit per-chamber flag, global mock, or missing key.

    A real provider call requires (a) no per-chamber mock override,
    (b) no global mock, and (c) an Anthropic API key present. Any of
    those failing collapses to the canned mock handler so dev / smoke
    paths keep working without a key.
    """
    from config import ANTHROPIC_API_KEY, RUBERRA_MOCK

    if RUBERRA_MOCK:
        return True
    surface_flag = os.environ.get("SIGNAL_SURFACE_MOCK", "").strip().lower()
    if surface_flag in ("1", "true", "yes", "on"):
        return True
    if not ANTHROPIC_API_KEY:
        return True
    return False


def _build_user_prompt(question: str, brief: SurfaceBrief) -> str:
    """Compose the single-turn user message for the real generator."""
    lines = [
        "Brief recebido:",
        f"- mode: {brief.mode}",
        f"- fidelity: {brief.fidelity}",
        f"- design_system: {brief.design_system or '(não definido)'}",
        "",
        "Pedido do utilizador:",
        question.strip() or "(vazio — devolver plano mínimo coerente)",
        "",
        "Devolve o plano através da ferramenta submit_surface_plan.",
    ]
    return "\n".join(lines)


async def process_surface_streaming(
    question: str,
    brief: Optional[SurfaceBrief],
) -> AsyncIterator[dict]:
    """Wave-5 real Surface generator. Mock-fallback when the env says so.

    Event envelope (matches the Wave-3 mock so the frontend's openStream
    helper does not need a parallel code path):

        {type: "start"}
        {type: "surface_plan", plan: {...SurfacePlan dict...}}
        {type: "done", answer, plan, mock, processing_time_ms,
                       input_tokens, output_tokens, terminated_early,
                       termination_reason}
        {type: "error", message, error?, reason?}     ← validation/RPC fail

    The frontend already promotes ``error`` frames through the
    ``useSignal.openStream`` envelope into ErrorPanel, so a malformed
    plan never reaches the user as a half-rendered card.
    """
    effective_brief = brief or SurfaceBrief()

    # Mock fallback — delegated wholesale so it can emit its own ``start``.
    # Doing the wrap here would double the start frame (wrapper + mock).
    if _surface_mock_active():
        async for event in process_surface_mock_streaming(question, brief):
            yield event
        return

    started = time.monotonic()
    yield {"type": "start"}

    # Wave-5 honesty rule: design_system is required for the real path.
    # The mock accepts a missing system because it's just shape-checking.
    # The real generator refuses early — a typed error tells the shell
    # exactly what's missing instead of producing a hollow plan.
    if not (effective_brief.design_system or "").strip():
        yield {
            "type": "error",
            "error": "surface_design_system_required",
            "reason": "MissingDesignSystem",
            "message": (
                "Surface real generation requires a design_system on the brief. "
                "Set SIGNAL_SURFACE_MOCK=1 to fall back to the mock."
            ),
        }
        return

    # ── Real provider path ────────────────────────────────────────────────
    from anthropic import AsyncAnthropic  # local import; mock path skips it
    from config import ANTHROPIC_API_KEY, MAX_TOKENS, MODEL_ID

    try:
        client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        response = await client.messages.create(
            model=MODEL_ID,
            max_tokens=MAX_TOKENS,
            temperature=TEMPERATURE,
            system=SYSTEM_PROMPT,
            tools=[_SUBMIT_PLAN_TOOL],
            tool_choice={"type": "tool", "name": "submit_surface_plan"},
            messages=[
                {"role": "user", "content": _build_user_prompt(question, effective_brief)},
            ],
        )
    except Exception as exc:  # noqa: BLE001 — surface every provider failure typed
        logger.warning("Surface generator provider call failed: %s", exc)
        yield {
            "type": "error",
            "error": "surface_provider_error",
            "reason": type(exc).__name__,
            "message": str(exc),
        }
        return

    # Locate the forced tool_use block. tool_choice should guarantee one
    # but the Anthropic API can still emit text alongside; ignore text
    # blocks and pick the first tool_use whose name matches.
    tool_block = None
    for block in response.content:
        if getattr(block, "type", None) == "tool_use" and getattr(block, "name", None) == "submit_surface_plan":
            tool_block = block
            break

    if tool_block is None:
        yield {
            "type": "error",
            "error": "surface_no_tool_use",
            "reason": "MissingToolBlock",
            "message": "Model did not call submit_surface_plan despite tool_choice forcing.",
        }
        return

    # Validate via Pydantic. SurfacePlan-shaped dicts that don't validate
    # are refused, never half-emitted.
    raw_input = dict(tool_block.input) if tool_block.input else {}
    raw_input["mock"] = False  # always false on the real path
    try:
        plan = SurfacePlan.model_validate(raw_input)
    except ValidationError as exc:
        logger.warning("Surface plan failed validation: %s", exc)
        yield {
            "type": "error",
            "error": "surface_validation_failed",
            "reason": "ValidationError",
            "message": str(exc),
        }
        return

    plan_dict = plan.model_dump()
    yield {"type": "surface_plan", "plan": plan_dict}

    answer_lines = [
        f"Surface plan — {plan.mode} / {plan.fidelity}",
        f"Design system: {plan.design_system_binding or 'não definido'}",
        f"Screens: {', '.join(s.name for s in plan.screens)}",
        f"Components: {len(plan.components)}",
        "Mock: false",
    ]
    yield {
        "type": "done",
        "answer": "\n".join(answer_lines),
        "plan": plan_dict,
        "mock": False,
        "chamber": _CHAMBER_SURFACE,
        "processing_time_ms": int((time.monotonic() - started) * 1000),
        "input_tokens": getattr(response.usage, "input_tokens", 0) or 0,
        "output_tokens": getattr(response.usage, "output_tokens", 0) or 0,
        "terminated_early": False,
        "termination_reason": None,
    }


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
        "chamber": _CHAMBER_SURFACE,
        "processing_time_ms": int((time.monotonic() - started) * 1000),
        "input_tokens": 0,
        "output_tokens": 0,
        "terminated_early": False,
        "termination_reason": None,
    }
