"""
Signal — Insight chamber (Wave 5 base + Wave 6a Truth Distillation).

Reasoning · evidence pressure · direction. Wave 5 dispatches the regular
ask path to the self-consistency triad + judge. Wave 6a adds a second
operating mode: when the operator asks for a *distillation* of the
mission so far, Insight forces the model through a structured tool call
(``submit_truth_distillation``) so the output is a versioned, validated
TruthDistillation artefact instead of free prose.

The distillation handler lives here (not in engine.py) because it is
chamber-specific: it consumes the mission's notes + auto-derived
ProjectContract, calls the provider with a forced tool, validates the
return via Pydantic, and yields SSE events identical in shape to the
Wave 5 Surface generator. Frontend's openStream consumer reuses the
same envelope.
"""

from __future__ import annotations

import logging
import os
import time
import uuid
from typing import Any, AsyncIterator, Optional

from pydantic import ValidationError

from doctrine import SYSTEM_PROMPT as _DOCTRINE_SYSTEM

# NB: avoid top-level `from models import ...` — models.py imports
# chambers.profiles which imports this module, creating a circular
# import. Lazy-import inside the functions that need them.
if False:  # type-check only
    from models import (
        MissionRecord,
        ProjectContractRecord,
        SurfaceSeedRecord,
        TerminalSeedRecord,
        TruthDistillationRecord,
    )

logger = logging.getLogger("signal.chamber.insight")


# ── Wave 5 base profile (triad path) ────────────────────────────────────────

SYSTEM_PROMPT = _DOCTRINE_SYSTEM
TEMPERATURE = 0.15  # Matches TRIAD_TEMPERATURE default.
ALLOWED_TOOLS: tuple[str, ...] = ()  # No tool use — triad path only.


# ── Wave 6a — Truth Distillation generator ─────────────────────────────────

DISTILL_SYSTEM_PROMPT = """És o destilador da câmara Insight do sistema Signal.

Recebes:
- O contrato actual do projecto (auto-derivado da spine: conceito, princípios,
  missão, riscos conhecidos)
- As notas da missão activa (conversa do utilizador + respostas anteriores)

Devolves UMA destilação estruturada de verdade — sempre através da ferramenta
`submit_truth_distillation`. Nunca em texto solto.

Princípios:
- A doutrina da Signal é "recusa antes de adivinhar". Mantém-na: se o material
  não dá para apurar uma direcção sólida, escreve isso explicitamente em
  `unknowns` e baixa `confidence`.
- `validatedDirection` é a frase mais curta e honesta da direcção do projecto
  baseada SÓ no que está em notas / contrato. Não inventes contexto.
- `coreDecisions` são decisões que o utilizador já tomou implícita ou
  explicitamente nas notas. Cita ou parafraseia, não inventes.
- `unknowns` são as perguntas que ficaram em aberto. Sê concreto.
- `risks` são riscos que se podem deduzir do material. Marca low/medium/high
  no texto se quiseres.
- `surfaceSeed.question` é o primeiro brief candidato para a Surface — uma
  frase pronta para ser colada no composer. Mantém-no curto.
- `terminalSeed.task` é a primeira task candidata para o Terminal — verbo no
  imperativo, escopo pequeno.
- `confidence`: high só quando o material é forte; medium quando há base mas
  falta detalhe; low quando estás a destilar mais do que o material aguenta.

Idioma: português europeu, espelhando o resto da chamber.
"""

DISTILL_TEMPERATURE = 0.25

_DISTILL_TOOL: dict[str, Any] = {
    "name": "submit_truth_distillation",
    "description": (
        "Submit the structured Truth Distillation for the active mission. "
        "MUST be called exactly once. No free-text answer is accepted."
    ),
    "input_schema": {
        "type": "object",
        "required": [
            "summary", "validatedDirection", "coreDecisions",
            "unknowns", "risks", "surfaceSeed", "terminalSeed", "confidence",
        ],
        "properties": {
            "summary": {
                "type": "string",
                "description": "Uma frase resumo do que foi destilado.",
            },
            "validatedDirection": {
                "type": "string",
                "description": "A direcção apurada — frase curta, honesta.",
            },
            "coreDecisions": {
                "type": "array",
                "items": {"type": "string"},
                "maxItems": 8,
            },
            "unknowns": {
                "type": "array",
                "items": {"type": "string"},
                "maxItems": 8,
            },
            "risks": {
                "type": "array",
                "items": {"type": "string"},
                "maxItems": 8,
            },
            "surfaceSeed": {
                "type": "object",
                "required": ["question"],
                "properties": {
                    "question": {"type": "string"},
                    "designSystemSuggestion": {"type": ["string", "null"]},
                    "screenCountEstimate": {"type": ["integer", "null"]},
                    "fidelityHint": {
                        "type": ["string", "null"],
                        "enum": ["wireframe", "hi-fi", None],
                    },
                },
            },
            "terminalSeed": {
                "type": "object",
                "required": ["task"],
                "properties": {
                    "task": {"type": "string"},
                    "fileTargets": {
                        "type": "array",
                        "items": {"type": "string"},
                        "maxItems": 12,
                    },
                    "riskLevel": {
                        "type": ["string", "null"],
                        "enum": ["low", "medium", "high", None],
                    },
                    "requiresGate": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["typecheck", "build", "test"],
                        },
                        "maxItems": 3,
                    },
                },
            },
            "confidence": {
                "type": "string",
                "enum": ["low", "medium", "high"],
            },
        },
    },
}


def _distill_mock_active() -> bool:
    """Mock fallback for offline dev / no-key environments. Same posture
    rule as the Surface chamber — keeps Wave 6a smokeable without burning
    tokens."""
    from config import ANTHROPIC_API_KEY, RUBERRA_MOCK
    if RUBERRA_MOCK:
        return True
    if os.environ.get("SIGNAL_INSIGHT_MOCK", "").strip().lower() in (
        "1", "true", "yes", "on",
    ):
        return True
    if not ANTHROPIC_API_KEY:
        return True
    return False


def derive_project_contract_v0(mission, principles: list[str]):
    """Wave 6a — auto-derive ProjectContract v0 from spine state.

    Lazy authoring per V3.1 Tier-1 Addition #1. Operator edits inline
    later. Concept seeded from mission title + last user note; principles
    from the spine; risks left empty (failure_memory integration is a
    Wave 6b polish).
    """
    from models import ProjectContractRecord

    user_notes = [n for n in mission.notes if (n.role or "user") == "user"]
    last_user = user_notes[-1].text if user_notes else None
    concept = mission.title
    if last_user:
        concept = f"{mission.title} · {last_user[:120]}"
    now = int(time.time() * 1000)
    return ProjectContractRecord(
        version=1,
        concept=concept,
        mission=None,
        principles=principles,
        derivedFromSpine=True,
        createdAt=now,
        updatedAt=now,
    )


def _build_distill_user_prompt(mission, contract) -> str:
    """Compose the input for the distillation call."""
    lines: list[str] = []
    lines.append("# Project Contract (auto-derivado)")
    if contract.concept:
        lines.append(f"- concept: {contract.concept}")
    if contract.principles:
        lines.append("- principles:")
        for p in contract.principles:
            lines.append(f"  · {p}")
    if contract.knownRisks:
        lines.append("- knownRisks:")
        for r in contract.knownRisks:
            lines.append(f"  · {r}")

    lines.append("")
    lines.append("# Notas da missão (mais antigas → mais recentes)")
    if not mission.notes:
        lines.append("(missão sem notas — destilar com cautela e baixar confidence)")
    else:
        for n in mission.notes[-30:]:  # cap to last 30 to fit prompt
            role = n.role or "user"
            lines.append(f"[{role}] {n.text}")

    lines.append("")
    lines.append(
        "Devolve a destilação através da ferramenta submit_truth_distillation."
    )
    return "\n".join(lines)


def _compose_mock_distillation(mission, contract) -> dict[str, Any]:
    """Canned distillation for offline dev. Shape-checks the contract end
    to end without burning Anthropic tokens. Does not pretend to think."""
    last_user = ""
    for n in reversed(mission.notes):
        if (n.role or "user") == "user":
            last_user = n.text
            break
    return {
        "summary": f"Destilação mock da missão {mission.title!r}.",
        "validatedDirection": (
            last_user or contract.concept or mission.title
        )[:160],
        "coreDecisions": [
            f"Iniciada na chamber {mission.chamber}.",
            f"Princípios activos: {len(contract.principles)}.",
        ],
        "unknowns": [
            "Mock mode — direcção não foi realmente apurada por modelo.",
            "Activar provider real para destilação de verdade.",
        ],
        "risks": [
            "Decisões baseadas nesta destilação são mock — não confiar em produção.",
        ],
        "surfaceSeed": {
            "question": last_user[:200] or f"Esboço da {mission.title}",
        },
        "terminalSeed": {
            "task": (
                f"Implementar primeiro passo da {mission.title}"
                if not last_user else f"Começar: {last_user[:140]}"
            ),
        },
        "confidence": "low",
    }


async def process_distillation_streaming(
    mission,
    principles: list[str],
) -> AsyncIterator[dict[str, Any]]:
    """Wave 6a Truth Distillation generator. Mock-fallback under env flag.

    Event envelope:
        {type: "start"}
        {type: "project_contract", contract: {...auto-derived ProjectContract...}}
        {type: "truth_distillation", distillation: {...validated record...}}
        {type: "done", distillation, mock, processing_time_ms,
                       input_tokens, output_tokens}
        {type: "error", message, error?, reason?}
    """
    started = time.monotonic()
    yield {"type": "start"}

    contract = derive_project_contract_v0(mission, principles)
    yield {"type": "project_contract", "contract": contract.model_dump()}

    # Mock fallback path
    if _distill_mock_active():
        from models import (
            SurfaceSeedRecord,
            TerminalSeedRecord,
            TruthDistillationRecord,
        )
        mock_payload = _compose_mock_distillation(mission, contract)
        try:
            now = int(time.time() * 1000)
            distillation = TruthDistillationRecord(
                id=str(uuid.uuid4()),
                version=1,
                status="draft",
                sourceMissionId=mission.id,
                summary=mock_payload["summary"],
                validatedDirection=mock_payload["validatedDirection"],
                coreDecisions=mock_payload["coreDecisions"],
                unknowns=mock_payload["unknowns"],
                risks=mock_payload["risks"],
                surfaceSeed=SurfaceSeedRecord(**mock_payload["surfaceSeed"]),
                terminalSeed=TerminalSeedRecord(**mock_payload["terminalSeed"]),
                confidence=mock_payload["confidence"],
                createdAt=now,
                updatedAt=now,
            )
        except ValidationError as exc:
            yield {
                "type": "error",
                "error": "schema_invalid",
                "reason": "ValidationError",
                "message": str(exc),
            }
            return
        yield {
            "type": "truth_distillation",
            "distillation": distillation.model_dump(),
        }
        yield {
            "type": "done",
            "distillation": distillation.model_dump(),
            "mock": True,
            "processing_time_ms": int((time.monotonic() - started) * 1000),
            "input_tokens": 0,
            "output_tokens": 0,
        }
        return

    # Real provider path
    from anthropic import AsyncAnthropic
    from config import ANTHROPIC_API_KEY, MAX_TOKENS, MODEL_ID

    try:
        client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        response = await client.messages.create(
            model=MODEL_ID,
            max_tokens=MAX_TOKENS,
            temperature=DISTILL_TEMPERATURE,
            system=DISTILL_SYSTEM_PROMPT,
            tools=[_DISTILL_TOOL],
            tool_choice={"type": "tool", "name": "submit_truth_distillation"},
            messages=[
                {"role": "user", "content": _build_distill_user_prompt(mission, contract)},
            ],
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning("Distillation provider call failed: %s", exc)
        yield {
            "type": "error",
            "error": "tool_unavailable",
            "reason": type(exc).__name__,
            "message": str(exc),
        }
        return

    tool_block = None
    for block in response.content:
        if (
            getattr(block, "type", None) == "tool_use"
            and getattr(block, "name", None) == "submit_truth_distillation"
        ):
            tool_block = block
            break

    if tool_block is None:
        yield {
            "type": "error",
            "error": "schema_invalid",
            "reason": "MissingToolBlock",
            "message": "Model did not call submit_truth_distillation despite tool_choice forcing.",
        }
        return

    from models import (
        SurfaceSeedRecord,
        TerminalSeedRecord,
        TruthDistillationRecord,
    )
    raw_input = dict(tool_block.input) if tool_block.input else {}
    now = int(time.time() * 1000)
    try:
        surface_seed_raw = raw_input.get("surfaceSeed") or {}
        terminal_seed_raw = raw_input.get("terminalSeed") or {}
        distillation = TruthDistillationRecord(
            id=str(uuid.uuid4()),
            version=1,
            status="draft",
            sourceMissionId=mission.id,
            summary=raw_input.get("summary", ""),
            validatedDirection=raw_input.get("validatedDirection", ""),
            coreDecisions=list(raw_input.get("coreDecisions", []) or []),
            unknowns=list(raw_input.get("unknowns", []) or []),
            risks=list(raw_input.get("risks", []) or []),
            surfaceSeed=SurfaceSeedRecord(**surface_seed_raw) if surface_seed_raw.get("question") else None,
            terminalSeed=TerminalSeedRecord(**terminal_seed_raw) if terminal_seed_raw.get("task") else None,
            confidence=raw_input.get("confidence", "medium"),
            createdAt=now,
            updatedAt=now,
        )
    except ValidationError as exc:
        logger.warning("Distillation failed validation: %s", exc)
        yield {
            "type": "error",
            "error": "schema_invalid",
            "reason": "ValidationError",
            "message": str(exc),
        }
        return

    yield {"type": "truth_distillation", "distillation": distillation.model_dump()}
    yield {
        "type": "done",
        "distillation": distillation.model_dump(),
        "mock": False,
        "processing_time_ms": int((time.monotonic() - started) * 1000),
        "input_tokens": getattr(response.usage, "input_tokens", 0) or 0,
        "output_tokens": getattr(response.usage, "output_tokens", 0) or 0,
    }
