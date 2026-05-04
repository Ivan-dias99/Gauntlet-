"""
Gauntlet — Groq provider adapter.

Wraps the official `groq` async SDK (OpenAI-compatible chat.completions
surface) in an Anthropic-compatible shape so engine.py can swap providers
without per-call-site branching. Mirrors the design of gemini_provider.py:
single non-streaming path that satisfies the triad + judge code paths.

Why Groq: free tier with generous RPM/RPD on Llama 3.x and very high
inference throughput (typical free-tier model: llama-3.3-70b-versatile).
Picked as a faster, more permissive alternative to the Gemini free tier
when the operator has hit Google AI Studio's per-minute cap.

Scope of the v1 adapter:
    - non-streaming `messages.create(...)` returning Anthropic-shaped result
    - text-only message blocks (system + user/assistant turns)
    - usage counters mapped from Groq's prompt_tokens / completion_tokens

Out of scope (will fall back to Anthropic when needed):
    - Streaming (`messages.stream`)
    - Tool use / function calling — Groq supports OpenAI tool-calls but the
      Gauntlet agent loop relies on Anthropic's tool_use / tool_result
      block shapes; bridging is a follow-up.
    - System prompt caching, image inputs.

The adapter never raises Anthropic-specific exceptions — engine.py's
recoverable-error branching uses isinstance against anthropic
RateLimitError/APIConnectionError/etc. Failures here re-raise the
underlying groq exception and the run is treated as non-recoverable,
mirroring gemini_provider.py.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Optional

logger = logging.getLogger("gauntlet.groq_provider")


# ── Anthropic-shaped response objects ──────────────────────────────────────
#
# Same minimal shape as gemini_provider — only the fields engine.py /
# agent.py read are populated.


@dataclass
class _Block:
    """Mimics anthropic.types.TextBlock — has .type and .text."""
    type: str
    text: str


@dataclass
class _Usage:
    """Mimics anthropic.types.Usage."""
    input_tokens: int = 0
    output_tokens: int = 0
    cache_creation_input_tokens: int = 0
    cache_read_input_tokens: int = 0


@dataclass
class _Response:
    """Mimics anthropic.types.Message."""
    content: list[_Block]
    model: str
    stop_reason: str
    usage: _Usage
    id: str = "groq-msg"
    role: str = "assistant"
    type: str = "message"


# ── Shape mapping ──────────────────────────────────────────────────────────


def _to_groq_messages(
    messages: list[dict[str, Any]], system: Optional[str]
) -> list[dict[str, Any]]:
    """Convert Anthropic messages list to Groq/OpenAI `messages` shape.

    Anthropic shape:  [{role: 'user'|'assistant', content: str | list[block]}]
                      + a separate `system` arg
    Groq shape:       [{role: 'system'|'user'|'assistant', content: str}]
    """
    out: list[dict[str, Any]] = []
    if system:
        out.append({"role": "system", "content": system})
    for m in messages:
        role = m.get("role", "user")
        # Anthropic only uses user/assistant in the messages list; other
        # roles fall back to user so a malformed turn does not break the
        # call.
        groq_role = "assistant" if role == "assistant" else "user"
        raw = m.get("content", "")
        if isinstance(raw, str):
            text = raw
        elif isinstance(raw, list):
            parts = []
            for block in raw:
                if isinstance(block, dict) and block.get("type") == "text":
                    parts.append(block.get("text", ""))
                elif isinstance(block, str):
                    parts.append(block)
            text = "\n".join(p for p in parts if p)
        else:
            text = str(raw)
        out.append({"role": groq_role, "content": text})
    return out


def _stop_reason(finish: Optional[str]) -> str:
    """Normalize Groq finish_reason to Anthropic stop_reason vocabulary."""
    if not finish:
        return "end_turn"
    finish = str(finish).lower()
    if finish == "stop":
        return "end_turn"
    if finish == "length":
        return "max_tokens"
    if finish in ("content_filter", "tool_calls", "function_call"):
        return "stop_sequence"
    return "end_turn"


# ── Adapter ────────────────────────────────────────────────────────────────


class _MessagesNamespace:
    """Mimics anthropic.AsyncAnthropic().messages — exposes create()."""

    def __init__(self, parent: "AsyncGroqAnthropicAdapter") -> None:
        self._parent = parent

    async def create(
        self,
        *,
        model: str,
        max_tokens: int,
        messages: list[dict[str, Any]],
        system: Optional[str] = None,
        temperature: Optional[float] = None,
        **_unused: Any,
    ) -> _Response:
        """Anthropic-shaped non-streaming completion.

        Ignores anthropic-only kwargs (tools, tool_choice, top_k,
        stop_sequences, metadata, …) — out of scope for the v1 adapter.
        Engine logs a warning at startup so the operator knows the agent
        loop will not fire when running on Groq.
        """
        client = self._parent._client
        groq_model = self._parent._model_id
        groq_messages = _to_groq_messages(messages, system)

        kwargs: dict[str, Any] = {
            "model": groq_model,
            "messages": groq_messages,
            "max_tokens": max_tokens,
        }
        if temperature is not None:
            kwargs["temperature"] = temperature

        # Groq SDK is OpenAI-compatible: chat.completions.create returns a
        # ChatCompletion object with .choices[0].message.content and
        # .usage.{prompt_tokens, completion_tokens}.
        response = await client.chat.completions.create(**kwargs)

        text = ""
        finish: Optional[str] = None
        choices = getattr(response, "choices", None) or []
        if choices:
            msg = getattr(choices[0], "message", None)
            text = (getattr(msg, "content", None) or "") if msg else ""
            finish = getattr(choices[0], "finish_reason", None)

        usage = getattr(response, "usage", None)
        in_tok = int(getattr(usage, "prompt_tokens", 0) or 0)
        out_tok = int(getattr(usage, "completion_tokens", 0) or 0)

        # Echo the caller's requested model id back on the response so the
        # call ledger keeps the gateway's intent (e.g. claude-sonnet-4-6).
        # The actual provider/model used is in the log via _model_id.
        return _Response(
            content=[_Block(type="text", text=text)],
            model=model,
            stop_reason=_stop_reason(finish),
            usage=_Usage(input_tokens=in_tok, output_tokens=out_tok),
        )


class AsyncGroqAnthropicAdapter:
    """Drop-in replacement for AsyncAnthropic for the non-streaming, no-tool
    code paths. Triad + judge work; agent loop falls back to mock prompt
    advice (no tool execution) — same scope as the Gemini adapter."""

    def __init__(
        self, *, api_key: str, model: str = "llama-3.3-70b-versatile"
    ) -> None:
        try:
            from groq import AsyncGroq  # type: ignore
        except ImportError as exc:  # noqa: BLE001
            raise RuntimeError(
                "groq SDK is not installed. Add it to backend/requirements.txt "
                "and reinstall, or unset GAUNTLET_GROQ_API_KEY."
            ) from exc
        self._client = AsyncGroq(api_key=api_key)
        self._model_id = model
        self.messages = _MessagesNamespace(self)
        logger.info(
            "Groq adapter initialised (model=%s). Streaming and tool use "
            "are not supported on this provider — agent / SSE routes will "
            "degrade.", model,
        )
