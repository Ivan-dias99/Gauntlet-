"""
Gauntlet — Mock Anthropic Client
Zero-network stand-in for ``AsyncAnthropic`` used when
``GAUNTLET_MOCK=1``. Emits deterministic canned responses so the full
pipeline (triad → judge, agent loop) can be exercised end-to-end
without an API key.

Detection rules:
  * ``tools`` present  →  agent loop → single text block, no tool calls
  * system starts with ``"You are the Gauntlet Judge"``  →  JSON verdict
  * otherwise  →  triad call → identical canned answer (HIGH consensus)
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Any


MOCK_TRIAD_ANSWER = (
    "Resposta de mock. Sistema em modo offline — sem chamadas à API."
)
MOCK_AGENT_ANSWER = (
    "Agent mock: sistema em modo offline. Nenhuma ferramenta foi executada."
)
MOCK_RESEARCHER_ANSWER = (
    "Researcher mock.\nFINDINGS\n- mock finding 1\nNOT VERIFIED\n- everything"
)
MOCK_CODER_ANSWER = (
    "Coder mock output.\n\n```\n# stub\n```\n\nTools used: (none — mock)"
)
MOCK_PLAN = {
    "analysis": "mock plan — one coder step only",
    "steps": [{"role": "coder", "goal": "mock goal"}],
}
MOCK_CRITIC_VERDICT = {
    "accept": True,
    "issues": [],
    "summary": "mock critic accepted by default",
}
# Composer dom_plan — quando GAUNTLET_MOCK=1 a cápsula não pode receber
# uma string literal "Resposta de mock..." porque o composer espera JSON
# estruturado e refusa-se a executar. Devolvemos a forma case B (compose
# text) — o mais inócuo dos três casos. Mantém o smoke desktop / browser
# útil sem chave Anthropic real.
MOCK_COMPOSER_PLAN = {
    "compose": (
        "Resposta de mock do composer.\n\n"
        "Sistema em modo offline — `GAUNTLET_MOCK=1`. Em produção esta "
        "resposta vem de Anthropic / Groq / Gemini através do model_gateway.\n\n"
        "Para testar com modelos reais define `ANTHROPIC_API_KEY` e relança "
        "o backend sem o flag MOCK."
    ),
}


@dataclass
class _Block:
    type: str
    text: str = ""
    id: str = ""
    name: str = ""
    input: dict[str, Any] = field(default_factory=dict)


@dataclass
class _Usage:
    input_tokens: int = 12
    output_tokens: int = 24


@dataclass
class _Response:
    content: list[_Block]
    model: str = "mock-sonnet-4-6"
    stop_reason: str = "end_turn"
    usage: _Usage = field(default_factory=_Usage)


class _MockMessages:
    async def create(
        self,
        *,
        system: str = "",
        messages: list[dict[str, Any]] | None = None,
        tools: list[dict[str, Any]] | None = None,
        **_: Any,
    ) -> _Response:
        head = system.lstrip()
        # Composer dom_plan — must return JSON {"compose": "..."} for
        # the cápsula's plan dispatcher to accept the response. Plain
        # text triggers "model returned non-JSON; refusing to execute".
        if head.startswith("You are Gauntlet's planner"):
            return _Response(
                content=[_Block(type="text", text=json.dumps(MOCK_COMPOSER_PLAN))],
            )
        # Crew: structured roles (no tools)
        if head.startswith("You are the Gauntlet Planner"):
            return _Response(
                content=[_Block(type="text", text=json.dumps(MOCK_PLAN))],
            )
        if head.startswith("You are the Gauntlet Critic"):
            return _Response(
                content=[_Block(type="text", text=json.dumps(MOCK_CRITIC_VERDICT))],
            )
        # Crew: execution roles (with tools) — detect by system prompt
        if tools and head.startswith("You are the Gauntlet Researcher"):
            return _Response(
                content=[_Block(type="text", text=MOCK_RESEARCHER_ANSWER)],
            )
        if tools and head.startswith("You are the Gauntlet Coder"):
            return _Response(
                content=[_Block(type="text", text=MOCK_CODER_ANSWER)],
            )
        # Generic agent path
        if tools:
            return _Response(
                content=[_Block(type="text", text=MOCK_AGENT_ANSWER)],
            )
        # Judge path
        if head.startswith("You are the Gauntlet Judge"):
            verdict = json.dumps({
                "confidence": "high",
                "should_refuse": False,
                "consensus_answer": MOCK_TRIAD_ANSWER,
                "reasoning": "Mock judge: triad convergiu.",
                "divergence_points": [],
            })
            return _Response(content=[_Block(type="text", text=verdict)])
        # Triad path
        return _Response(
            content=[_Block(type="text", text=MOCK_TRIAD_ANSWER)],
        )


class MockAsyncAnthropic:
    """Drop-in for ``anthropic.AsyncAnthropic`` — tool-use/text only."""

    def __init__(self, *_: Any, **__: Any) -> None:
        self.messages = _MockMessages()
