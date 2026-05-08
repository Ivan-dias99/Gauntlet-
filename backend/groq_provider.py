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


# ── Auto-fallback chain ────────────────────────────────────────────────────
#
# Groq free tier impõe quotas separadas por modelo. Quando o primário
# bate em rate limit (429), em vez de propagar o erro para o operador,
# tentamos o próximo modelo da chain — cada um com o seu pool de tokens.
# A chain é heurística: começa pelo modelo configurado pelo operador
# (GAUNTLET_GROQ_MODEL), depois alternativas estáveis ordenadas por
# capacidade descendente. O utilizador final só nota o fallback se o
# modelo for diferente — a resposta vem na mesma, sem erro vermelho.
#
# Fonte de modelos válidos: https://console.groq.com/docs/models
GROQ_FALLBACK_CHAIN: list[str] = [
    "llama-3.3-70b-versatile",   # primário razoável (100k TPD free)
    "llama-3.1-8b-instant",      # fallback rápido (quota separada)
    "openai/gpt-oss-120b",       # fallback OSS GPT
    "mixtral-8x7b-32768",        # último recurso (deprecated em alguns regions)
]


def _is_rate_limit_error(exc: BaseException) -> bool:
    """Detecta erros 429 / rate-limit do Groq sem depender da SDK
    expor um tipo concreto. groq SDK em versões diferentes usa
    groq.RateLimitError, groq.APIError, ou simplesmente APIStatusError —
    duck-type pelo status code + texto da mensagem."""
    status = getattr(exc, "status_code", None)
    if status == 429:
        return True
    msg = str(exc).lower()
    return (
        "rate_limit" in msg
        or "rate limit" in msg
        or "429" in msg
        or "tokens per day" in msg
        or "tpd" in msg
    )


def _build_fallback_chain(primary: str) -> list[str]:
    """Chain começa pelo primário, depois alternativas únicas."""
    chain = [primary]
    for m in GROQ_FALLBACK_CHAIN:
        if m != primary and m not in chain:
            chain.append(m)
    return chain


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
        # Preenchido em __aenter__ — quando fallback é accionado, este
        # passa a ser o nome do modelo Groq actualmente em uso, para
        # expor à cápsula via get_final_message().model.
        self._actual_model: str = model

    async def __aenter__(self) -> "_StreamContext":
        client = self._parent._client
        groq_messages = _to_groq_messages(self._messages, self._system)
        chain = _build_fallback_chain(self._parent._model_id)

        last_exc: Optional[BaseException] = None
        for attempt_idx, attempt_model in enumerate(chain):
            kwargs: dict[str, Any] = {
                "model": attempt_model,
                "messages": groq_messages,
                "max_tokens": self._max_tokens,
                "stream": True,
            }
            if self._temperature is not None:
                kwargs["temperature"] = self._temperature

            try:
                # stream_options.include_usage só foi adicionado em
                # groq SDK ~0.13+. Em versões mais antigas o kwarg é
                # rejeitado com TypeError. Tentamos com e fall back sem.
                try:
                    self._stream = await client.chat.completions.create(
                        **kwargs, stream_options={"include_usage": True},
                    )
                except TypeError as exc:
                    if "stream_options" not in str(exc):
                        raise
                    self._stream = await client.chat.completions.create(
                        **kwargs,
                    )
            except Exception as exc:  # noqa: BLE001
                last_exc = exc
                # Codex P1 review: continuar em qualquer erro, não só
                # rate-limit. Modelo intermédio com model_not_found / 400
                # / region-restricted continua a tentar o próximo da
                # chain em vez de abortar com candidatos restantes.
                if attempt_idx < len(chain) - 1:
                    next_model = chain[attempt_idx + 1]
                    if _is_rate_limit_error(exc):
                        logger.warning(
                            "Groq stream model %s rate-limited; auto-fallback to %s",
                            attempt_model, next_model,
                        )
                    else:
                        logger.warning(
                            "Groq stream model %s failed (%s: %s); "
                            "auto-fallback to %s",
                            attempt_model, type(exc).__name__,
                            str(exc)[:160], next_model,
                        )
                    continue
                logger.error(
                    "Groq stream fallback chain exhausted; last model %s "
                    "failed (%s). Operator will see error.",
                    attempt_model, type(exc).__name__,
                )
                raise

            # Quando fallback ocorre, regista o modelo real usado para
            # o get_final_message() expor no campo .model.
            self._actual_model = (
                attempt_model if attempt_idx > 0 else self._model_anthropic
            )
            return self

        if last_exc is not None:
            raise last_exc
        raise RuntimeError("Groq adapter: empty fallback chain")

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
        # _actual_model reflete o modelo que efectivamente serviu o
        # stream — o anthropic-shape se primário deu, o nome Groq real
        # se fallback foi accionado em __aenter__.
        return _Response(
            content=[_Block(type="text", text=self._final_text)],
            model=self._actual_model,
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
        groq_messages = _to_groq_messages(messages, system)
        chain = _build_fallback_chain(self._parent._model_id)

        last_exc: Optional[BaseException] = None
        for attempt_idx, attempt_model in enumerate(chain):
            kwargs: dict[str, Any] = {
                "model": attempt_model,
                "messages": groq_messages,
                "max_tokens": max_tokens,
            }
            if temperature is not None:
                kwargs["temperature"] = temperature

            try:
                # Groq SDK is OpenAI-compatible: chat.completions.create
                # returns a ChatCompletion object with .choices[0].message
                # .content and .usage.{prompt_tokens, completion_tokens}.
                response = await client.chat.completions.create(**kwargs)
            except Exception as exc:  # noqa: BLE001
                last_exc = exc
                # Em qualquer erro de um modelo da chain (rate-limit,
                # model_not_found, region-restricted, network blip),
                # tentamos o próximo. Codex P1 review: limitar fallback
                # só a rate-limit ignorava modelos potencialmente úteis
                # quando o intermédio falhava por outra razão.
                # Só propagamos quando esgotámos a chain inteira.
                if attempt_idx < len(chain) - 1:
                    next_model = chain[attempt_idx + 1]
                    if _is_rate_limit_error(exc):
                        logger.warning(
                            "Groq model %s rate-limited; auto-fallback to %s",
                            attempt_model, next_model,
                        )
                    else:
                        logger.warning(
                            "Groq model %s failed (%s: %s); auto-fallback to %s",
                            attempt_model, type(exc).__name__,
                            str(exc)[:160], next_model,
                        )
                    continue
                # Esgotou a chain — propaga o último erro.
                logger.error(
                    "Groq fallback chain exhausted; last model %s failed "
                    "(%s). Operator will see error.",
                    attempt_model, type(exc).__name__,
                )
                raise

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

            # Quando fallback ocorre (attempt_idx > 0), expõe o modelo
            # real usado em vez do anthropic-shape — assim a cápsula
            # mostra "llama-3.1-8b-instant" no badge em vez do modelo
            # configurado, dando feedback transparente ao operador.
            actual_model = attempt_model if attempt_idx > 0 else model
            return _Response(
                content=[_Block(type="text", text=text)],
                model=actual_model,
                stop_reason=_stop_reason(finish),
                usage=_Usage(input_tokens=in_tok, output_tokens=out_tok),
            )

        # Inalcançável — o for-else acima ou retorna ou re-raise. Mas
        # mypy/pylance precisam de algo aqui.
        if last_exc is not None:
            raise last_exc
        raise RuntimeError("Groq adapter: empty fallback chain")


class AsyncGroqAnthropicAdapter:
    """Drop-in replacement for AsyncAnthropic. Streaming agora é suportado
    (messages.stream) via Groq SSE; só falta a tool-use / agent loop, que
    requer o protocolo anthropic-tool-call e fica fora do v1 adapter."""

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
            "Groq adapter initialised (model=%s). Streaming SSE supported; "
            "tool use / agent loop continua fora do escopo v1.", model,
        )
