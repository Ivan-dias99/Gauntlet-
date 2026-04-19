"""
Ruberra — Mock Anthropic Client
Zero-network stand-in for ``AsyncAnthropic`` used when
``RUBERRA_MOCK=1``. Emits deterministic canned responses so the full
pipeline (triad → judge, agent loop) can be exercised end-to-end without
an API key.

Detection rules:
  * ``tools`` present  →  agent loop → single text block, no tool calls
  * system starts with ``"You are the Ruberra Judge"``  →  JSON verdict
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
MOCK_SECURITY_ANSWER = (
    "Security Reviewer mock.\nSECURITY FINDINGS\n- none\nRECOMMENDATIONS\n- (none)"
)
MOCK_TESTS_ANSWER = (
    "# file: tests/test_mock.py\n```python\ndef test_smoke():\n    assert True\n```"
)
MOCK_DOCS_ANSWER = (
    "## Changelog\n\n- Mock docs entry.\n"
)
MOCK_PLAN = {
    "analysis": "mock plan — research then code then review",
    "steps": [
        {"role": "researcher", "goal": "mock: gather context"},
        {"role": "coder", "goal": "mock: produce artifact"},
        {"role": "security-reviewer", "goal": "mock: audit"},
    ],
}
MOCK_CRITIC_VERDICT = {
    "accept": True,
    "issues": [],
    "summary": "mock critic accepted by default",
}
MOCK_REFLECTION = {
    "changed": False,
    "reason": "mock reflection — no defects found",
    "revised": MOCK_CODER_ANSWER,
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


class _MockStreamEvent:
    """A single event in the simulated stream."""

    def __init__(self, type: str, **kwargs: Any) -> None:
        self.type = type
        for k, v in kwargs.items():
            setattr(self, k, v)


class _MockStream:
    """Async-iterator + context-manager mimicking AsyncMessageStreamManager.

    Produces ``content_block_delta`` events by chunking the canned response
    into 24-char slices, then a final ``content_block_stop``. The full
    response is available via ``get_final_message`` after iteration ends.
    """

    def __init__(self, response: "_Response") -> None:
        self._response = response
        self._text = ""
        for block in response.content:
            if block.type == "text":
                self._text += block.text

    async def __aenter__(self) -> "_MockStream":
        return self

    async def __aexit__(self, *exc: Any) -> None:
        return None

    def __aiter__(self) -> "_MockStream":
        self._pos = 0
        return self

    async def __anext__(self) -> _MockStreamEvent:
        if self._pos >= len(self._text):
            # a stop event for the text block, then StopAsyncIteration
            if getattr(self, "_sent_stop", False):
                raise StopAsyncIteration
            self._sent_stop = True
            return _MockStreamEvent("content_block_stop")
        chunk_size = 24
        chunk = self._text[self._pos:self._pos + chunk_size]
        self._pos += chunk_size
        delta = _MockStreamEvent("text_delta", text=chunk)
        return _MockStreamEvent("content_block_delta", delta=delta)

    async def get_final_message(self) -> "_Response":
        return self._response


class _MockMessages:
    def stream(self, **kwargs: Any) -> _MockStream:
        """Synchronous factory that returns the async context manager — same
        shape as the real SDK's ``messages.stream``."""
        # Reuse create() synchronously by preparing the response now.
        import asyncio as _asyncio
        response = _asyncio.get_event_loop().run_until_complete(
            self.create(**kwargs)
        ) if False else None
        # Can't block here; instead, reconstruct the response inline using
        # the same detection rules as create().
        head = self._flatten_system(kwargs.get("system", "")).lstrip()
        tools = kwargs.get("tools")
        if head.startswith("You are the Ruberra Planner"):
            text = json.dumps(MOCK_PLAN)
        elif head.startswith("You are the Ruberra Critic"):
            text = json.dumps(MOCK_CRITIC_VERDICT)
        elif head.startswith("You are the Ruberra Coder reviewing"):
            text = json.dumps(MOCK_REFLECTION)
        elif tools and head.startswith("You are the Ruberra Researcher"):
            text = MOCK_RESEARCHER_ANSWER
        elif tools and head.startswith("You are the Ruberra Coder") and \
                not head.startswith("You are the Ruberra Coder reviewing"):
            text = MOCK_CODER_ANSWER
        elif tools and head.startswith("You are the Ruberra Security Reviewer"):
            text = MOCK_SECURITY_ANSWER
        elif tools and head.startswith("You are the Ruberra Test Writer"):
            text = MOCK_TESTS_ANSWER
        elif tools and head.startswith("You are the Ruberra Docs Writer"):
            text = MOCK_DOCS_ANSWER
        elif tools:
            text = MOCK_AGENT_ANSWER
        elif head.startswith("You are the Ruberra Judge"):
            text = json.dumps({
                "confidence": "high",
                "should_refuse": False,
                "consensus_answer": MOCK_TRIAD_ANSWER,
                "reasoning": "Mock judge: triad convergiu.",
                "divergence_points": [],
            })
        else:
            text = MOCK_TRIAD_ANSWER
        return _MockStream(_Response(content=[_Block(type="text", text=text)]))

    @staticmethod
    def _flatten_system(system: Any) -> str:
        if isinstance(system, list):
            return "".join(
                b.get("text", "") for b in system
                if isinstance(b, dict) and b.get("type") == "text"
            )
        return system or ""

    async def create(
        self,
        *,
        system: Any = "",
        messages: list[dict[str, Any]] | None = None,
        tools: list[dict[str, Any]] | None = None,
        **_: Any,
    ) -> _Response:
        # system may arrive as a str (legacy) or list[{type:"text",text,...}]
        # (prompt caching). Flatten for role detection either way.
        if isinstance(system, list):
            system_text = "".join(
                b.get("text", "") for b in system
                if isinstance(b, dict) and b.get("type") == "text"
            )
        else:
            system_text = system or ""
        head = system_text.lstrip()
        # Crew: structured roles (no tools)
        if head.startswith("You are the Ruberra Planner"):
            return _Response(
                content=[_Block(type="text", text=json.dumps(MOCK_PLAN))],
            )
        if head.startswith("You are the Ruberra Critic"):
            return _Response(
                content=[_Block(type="text", text=json.dumps(MOCK_CRITIC_VERDICT))],
            )
        if head.startswith("You are the Ruberra Coder reviewing"):
            return _Response(
                content=[_Block(type="text", text=json.dumps(MOCK_REFLECTION))],
            )
        # Crew: execution roles (with tools) — detect by system prompt
        if tools and head.startswith("You are the Ruberra Researcher"):
            return _Response(
                content=[_Block(type="text", text=MOCK_RESEARCHER_ANSWER)],
            )
        if tools and head.startswith("You are the Ruberra Coder") and \
                not head.startswith("You are the Ruberra Coder reviewing"):
            return _Response(
                content=[_Block(type="text", text=MOCK_CODER_ANSWER)],
            )
        if tools and head.startswith("You are the Ruberra Security Reviewer"):
            return _Response(
                content=[_Block(type="text", text=MOCK_SECURITY_ANSWER)],
            )
        if tools and head.startswith("You are the Ruberra Test Writer"):
            return _Response(
                content=[_Block(type="text", text=MOCK_TESTS_ANSWER)],
            )
        if tools and head.startswith("You are the Ruberra Docs Writer"):
            return _Response(
                content=[_Block(type="text", text=MOCK_DOCS_ANSWER)],
            )
        # Generic agent path
        if tools:
            return _Response(
                content=[_Block(type="text", text=MOCK_AGENT_ANSWER)],
            )
        # Judge path
        if head.startswith("You are the Ruberra Judge"):
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
