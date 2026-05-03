"""
Gauntlet — Gemini provider adapter.

Wraps google-genai (the AI Studio SDK) in an Anthropic-compatible shape so
engine.py / agent.py can swap providers without per-call-site branching.

Scope of the v1 adapter (mock + free-tier triad/judge path):
    - non-streaming `messages.create(...)` returning Anthropic-shaped result
    - text-only message blocks (system + user/assistant turns)
    - usage counters mapped from Gemini's prompt_token_count /
      candidates_token_count

Out of scope (Wave 1, will fall back to Anthropic when needed):
    - Streaming (`messages.stream`)
    - Tool use / function calling (the agent loop relies on Anthropic's
      tool_use / tool_result block shapes)
    - System prompt caching
    - Image / file inputs

The adapter intentionally never raises Anthropic-specific exceptions —
the engine's recoverable-error branching uses isinstance checks against
RateLimitError, APIConnectionError, APITimeoutError, InternalServerError
from the anthropic package. When the underlying google-genai call fails
we re-raise the original google exception. The fallback chain in
model_gateway is Anthropic-only today; treating Gemini failures as
non-recoverable keeps the run honest.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Optional

logger = logging.getLogger("gauntlet.gemini_provider")


# ── Anthropic-shaped response objects ──────────────────────────────────────
#
# These mirror the fields engine.py and agent.py read from an Anthropic
# response object. Only the read paths used today are populated.


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
    id: str = "gemini-msg"
    role: str = "assistant"
    type: str = "message"


# ── Shape mapping ──────────────────────────────────────────────────────────


def _to_gemini_contents(messages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Convert Anthropic messages list to Gemini `contents`.

    Anthropic shape:  [{role: 'user'|'assistant', content: str | list[block]}]
    Gemini shape:     [{role: 'user'|'model',     parts: [{text: str}]}]
    """
    out: list[dict[str, Any]] = []
    for m in messages:
        role = m.get("role", "user")
        gem_role = "model" if role == "assistant" else "user"
        raw = m.get("content", "")
        # Anthropic accepts either a string or a list of typed blocks.
        # We collapse to plain text — tools / images are out of scope.
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
        out.append({"role": gem_role, "parts": [{"text": text}]})
    return out


def _stop_reason(finish: Optional[str]) -> str:
    """Normalize Gemini finish_reason to Anthropic stop_reason vocabulary."""
    if not finish:
        return "end_turn"
    finish = str(finish).upper()
    if finish in ("STOP", "FINISH_REASON_STOP"):
        return "end_turn"
    if "MAX_TOKENS" in finish:
        return "max_tokens"
    if "SAFETY" in finish or "RECITATION" in finish:
        return "stop_sequence"
    return "end_turn"


# ── Adapter ────────────────────────────────────────────────────────────────


class _MessagesNamespace:
    """Mimics anthropic.AsyncAnthropic().messages — exposes create()."""

    def __init__(self, parent: "AsyncGeminiAnthropicAdapter") -> None:
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

        Ignores anthropic-only kwargs (tools, tool_choice, top_k, top_p,
        stop_sequences, metadata, …) — out of scope for the v1 adapter.
        Engine logs a warning at startup so the operator knows the agent
        loop will not fire when running on Gemini.
        """
        client = self._parent._client
        gemini_model = self._parent._model_id
        contents = _to_gemini_contents(messages)
        gen_config: dict[str, Any] = {
            "max_output_tokens": max_tokens,
        }
        if temperature is not None:
            gen_config["temperature"] = temperature
        if system:
            gen_config["system_instruction"] = system

        # The google-genai async surface lives under client.aio.models.
        # We feed the canonical free-tier model id from config; the
        # `model` arg from the caller (e.g. claude-sonnet-4-6) is recorded
        # back on the response so call ledgers stay informative.
        response = await client.aio.models.generate_content(
            model=gemini_model,
            contents=contents,
            config=gen_config,
        )

        text = (getattr(response, "text", None) or "").strip()
        if not text and getattr(response, "candidates", None):
            chunks = []
            for cand in response.candidates:
                cand_content = getattr(cand, "content", None)
                if cand_content is None:
                    continue
                for part in getattr(cand_content, "parts", []) or []:
                    chunks.append(getattr(part, "text", "") or "")
            text = "".join(chunks)

        usage_meta = getattr(response, "usage_metadata", None)
        in_tok = int(getattr(usage_meta, "prompt_token_count", 0) or 0)
        out_tok = int(getattr(usage_meta, "candidates_token_count", 0) or 0)
        finish = None
        cands = getattr(response, "candidates", None) or []
        if cands:
            finish = getattr(cands[0], "finish_reason", None)

        return _Response(
            content=[_Block(type="text", text=text)],
            model=model,
            stop_reason=_stop_reason(finish),
            usage=_Usage(input_tokens=in_tok, output_tokens=out_tok),
        )


class AsyncGeminiAnthropicAdapter:
    """Drop-in replacement for AsyncAnthropic for the non-streaming, no-tool
    code paths. Triad + judge work; agent loop falls back to mock prompt
    advice (no tool execution)."""

    def __init__(self, *, api_key: str, model: str = "gemini-2.5-flash") -> None:
        try:
            from google import genai  # type: ignore
        except ImportError as exc:  # noqa: BLE001
            raise RuntimeError(
                "google-genai is not installed. Add it to backend/requirements.txt "
                "and reinstall, or unset GEMINI_API_KEY."
            ) from exc
        self._client = genai.Client(api_key=api_key)
        self._model_id = model
        self.messages = _MessagesNamespace(self)
        logger.info(
            "Gemini adapter initialised (model=%s). Streaming and tool use "
            "are not supported on this provider — agent / SSE routes will "
            "degrade.", model,
        )
