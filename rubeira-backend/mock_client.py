"""
Rubeira — Mock Anthropic Client
Zero-network stand-in for ``AsyncAnthropic`` used when
``RUBEIRA_MOCK=1``. Emits deterministic canned responses so the full
pipeline (triad → judge, agent loop) can be exercised end-to-end without
an API key.

Detection rules:
  * ``tools`` present  →  agent loop → single text block, no tool calls
  * system starts with ``"You are the Rubeira Judge"``  →  JSON verdict
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
        # Agent path
        if tools:
            return _Response(
                content=[_Block(type="text", text=MOCK_AGENT_ANSWER)],
            )
        # Judge path
        if system.lstrip().startswith("You are the Rubeira Judge"):
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
