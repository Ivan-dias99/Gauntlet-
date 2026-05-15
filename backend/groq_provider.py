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

    Anthropic shape:  [{role: 'user'|'assistant',
                        content: str | list[text|image block]}]
                      + a separate `system` arg
    Groq shape:       [{role: 'system'|'user'|'assistant',
                        content: str | list[{type:'text'|'image_url',...}]}]

    Vision-capable Groq models (Llama 4 Scout/Maverick) accept the
    OpenAI-style `image_url` block; we translate Anthropic's
    `image.source.base64` → `image_url.url = data:<mime>;base64,<b64>`.
    Older / text-only Groq models silently get the image dropped at the
    composer layer (_provider_supports_images = False), so this branch
    only fires when the operator pinned a vision id.
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
            out.append({"role": groq_role, "content": raw})
            continue
        if isinstance(raw, list):
            blocks: list[dict[str, Any]] = []
            for block in raw:
                if isinstance(block, str):
                    blocks.append({"type": "text", "text": block})
                    continue
                if not isinstance(block, dict):
                    continue
                btype = block.get("type")
                if btype == "text":
                    text = block.get("text", "")
                    if text:
                        blocks.append({"type": "text", "text": text})
                elif btype == "image":
                    src = block.get("source") or {}
                    if src.get("type") != "base64":
                        continue
                    mime = src.get("media_type") or "image/png"
                    data = src.get("data") or ""
                    if not data:
                        continue
                    blocks.append({
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime};base64,{data}"},
                    })
            # Single-text-block payloads collapse back to a string so the
            # request looks identical to the pre-vision path on Groq SDKs
            # that handle string content faster.
            if len(blocks) == 1 and blocks[0].get("type") == "text":
                out.append({"role": groq_role, "content": blocks[0]["text"]})
            else:
                out.append({"role": groq_role, "content": blocks})
            continue
        out.append({"role": groq_role, "content": str(raw)})
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


class _StreamContext:
    """Mimics anthropic's MessageStream context manager.

    The composer's /dom_plan_stream endpoint uses
    ``async with client.messages.stream(...) as stream:`` and consumes
    ``stream.text_stream`` (token-by-token deltas) plus
    ``stream.get_final_message()`` (usage tokens + stop_reason). We
    wrap Groq's ``client.chat.completions.create(stream=True)`` async
    iterator to fit that shape so the cápsula gets real streaming on
    Groq instead of the v1 adapter's hard-fail.
    """

    def __init__(
        self, parent: "AsyncGroqAnthropicAdapter", *, model: str,
        max_tokens: int, messages: list[dict[str, Any]],
        system: Optional[str] = None,
        temperature: Optional[float] = None, **_unused: Any,
    ) -> None:
        self._parent = parent
        self._model_anthropic = model
        self._max_tokens = max_tokens
        self._messages = messages
        self._system = system
        self._temperature = temperature
        self._stream: Any = None
        self._final_text = ""
        self._stop_reason: Optional[str] = None
        self._in_tokens = 0
        self._out_tokens = 0

    async def __aenter__(self) -> "_StreamContext":
        client = self._parent._client
        groq_model = _resolve_groq_model(self._model_anthropic, self._parent._model_id)
        groq_messages = _to_groq_messages(self._messages, self._system)
        kwargs: dict[str, Any] = {
            "model": groq_model,
            "messages": groq_messages,
            "max_tokens": self._max_tokens,
            "stream": True,
            # Groq adds usage to the final SSE chunk when this flag is on.
            # Without it stream.get_final_message() returns zeroed counters
            # and the gateway ledger loses the row.
            "stream_options": {"include_usage": True},
        }
        if self._temperature is not None:
            kwargs["temperature"] = self._temperature
        try:
            self._stream = await client.chat.completions.create(**kwargs)
        except TypeError as exc:
            # Older groq SDKs (< ~0.20) don't accept `stream_options` and
            # raise TypeError before the network call. Retry without it
            # so the user gets a successful stream — the cost is that the
            # ledger row for this turn shows 0 input/output tokens until
            # the operator upgrades the SDK. Better partial telemetry than
            # a hard fail at the cápsula.
            if "stream_options" not in str(exc):
                raise
            logger.warning(
                "Groq SDK rejected stream_options (likely outdated); "
                "retrying without — token counters will be 0 for this call. "
                "Upgrade with: pip install --upgrade 'groq>=0.20'.",
            )
            kwargs.pop("stream_options", None)
            self._stream = await client.chat.completions.create(**kwargs)
        return self

    async def __aexit__(self, *exc_info: Any) -> None:
        # The Groq SDK closes the underlying connection when the iterator
        # exhausts; nothing to clean up here.
        return None

    @property
    def text_stream(self) -> Any:
        # Returned as an async generator the caller iterates with
        # ``async for text in stream.text_stream``. Same shape as anthropic.
        return self._iterate_text()

    async def _iterate_text(self) -> Any:
        async for chunk in self._stream:
            choices = getattr(chunk, "choices", None) or []
            if choices:
                delta = getattr(choices[0], "delta", None)
                content = getattr(delta, "content", None) if delta else None
                if content:
                    self._final_text += content
                    yield content
                finish = getattr(choices[0], "finish_reason", None)
                if finish and not self._stop_reason:
                    self._stop_reason = finish
            # Groq emits a tail chunk with usage (no choices, no delta) when
            # stream_options.include_usage=True. Capture it for parity with
            # anthropic's get_final_message().
            usage = getattr(chunk, "usage", None)
            if usage is not None:
                self._in_tokens = int(getattr(usage, "prompt_tokens", 0) or 0)
                self._out_tokens = int(getattr(usage, "completion_tokens", 0) or 0)

    async def get_final_message(self) -> _Response:
        return _Response(
            content=[_Block(type="text", text=self._final_text)],
            model=self._model_anthropic,
            stop_reason=_stop_reason(self._stop_reason),
            usage=_Usage(
                input_tokens=self._in_tokens, output_tokens=self._out_tokens,
            ),
        )


class _MessagesNamespace:
    """Mimics anthropic.AsyncAnthropic().messages — exposes create() + stream()."""

    def __init__(self, parent: "AsyncGroqAnthropicAdapter") -> None:
        self._parent = parent

    def stream(self, **kwargs: Any) -> _StreamContext:
        """Return an async context manager that mimics
        anthropic's ``messages.stream(...)``. Synchronous return — the
        actual network call happens in __aenter__."""
        return _StreamContext(self._parent, **kwargs)

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
        groq_model = _resolve_groq_model(model, self._parent._model_id)
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


# Map gateway-emitted model ids (Anthropic-shaped) to actual Groq model
# ids. The gateway ROUTING speaks Claude-language because it grew out of
# an Anthropic-only deployment; the Groq adapter translates here so the
# fallback chain ("primary" claude-sonnet → "smaller" claude-haiku) does
# something meaningful on the Groq path:
#   * primary (sonnet-4-6) -> the operator's chosen Groq model (default
#     llama-3.3-70b-versatile)
#   * fallback (haiku-4-5) -> a smaller, faster Groq model so a 429 on
#     the big model can roll forward instead of dying terminally.
# Unknown ids fall through to the configured default — same behaviour
# as before this map landed.
_GROQ_FALLBACK_MODEL = "llama-3.1-8b-instant"

# Curated set of Groq production model ids the operator can pin via
# GAUNTLET_GROQ_MODEL. Not enforced — any id Groq accepts will still
# run — but the startup log warns when the pinned id isn't on the list
# so a typo surfaces immediately instead of as a runtime 404. Mix of
# Llama (Meta), Qwen (Alibaba), and gpt-oss (OpenAI weights, hosted by
# Groq); all three are on the free tier in 2026-05.
_GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile"
KNOWN_GROQ_MODELS: tuple[str, ...] = (
    "llama-3.3-70b-versatile",
    "openai/gpt-oss-120b",
    "qwen/qwen3-32b",
    "meta-llama/llama-4-scout-17b-16e-instruct",
)

# Vision-capable Groq model ids. The composer layer consults this set
# (via composer._provider_supports_images) to decide whether to attach
# a screenshot block to the planning request — pinning a non-vision
# Groq model means the cápsula plans blind on computer_use coords.
GROQ_VISION_MODELS: frozenset[str] = frozenset({
    "meta-llama/llama-4-scout-17b-16e-instruct",
})


def _resolve_groq_model(requested: str, configured: str) -> str:
    """Translate a gateway-emitted Anthropic id into a Groq id."""
    if requested.startswith("claude-haiku"):
        return _GROQ_FALLBACK_MODEL
    if requested.startswith("claude-"):
        return configured
    # Already a Groq id (operator pinned via GAUNTLET_GROQ_MODEL or the
    # gateway grew a real Groq route) — pass through.
    return requested


class AsyncGroqAnthropicAdapter:
    """Drop-in replacement for AsyncAnthropic. Streaming agora é suportado
    (messages.stream) via Groq SSE; só falta a tool-use / agent loop, que
    requer o protocolo anthropic-tool-call e fica fora do v1 adapter."""

    def __init__(
        self, *, api_key: str, model: str = _GROQ_DEFAULT_MODEL,
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
        if model not in KNOWN_GROQ_MODELS:
            logger.warning(
                "GAUNTLET_GROQ_MODEL=%s is not in the known set %s — "
                "passing through to Groq, but a typo will only surface as a "
                "runtime 404. Pick one of the curated ids if unsure.",
                model, KNOWN_GROQ_MODELS,
            )
        logger.info(
            "Groq adapter initialised (model=%s, fallback=%s, known=%s). "
            "Streaming SSE supported; tool use / agent loop continua fora do "
            "escopo v1.",
            model, _GROQ_FALLBACK_MODEL, KNOWN_GROQ_MODELS,
        )
