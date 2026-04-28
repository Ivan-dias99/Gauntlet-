"""
Signal — Memory Compression (Wave F).

Long Insight conversations explode the context window. Wave 6c
adopted an agent-loop with multi-turn — by turn 10-15, prior notes
exceed practical token budget. This module provides a compression
helper that summarises older notes into a "compressed_context" block
while preserving the most recent N turns verbatim.

Design rules (from V3.1 doctrine):
  - Compression NEVER loses decisions. The summary call is asked to
    extract decisions, open questions, risks — not narrate prose.
  - The verbatim tail is always preserved (default last 8 notes) so
    the model still sees the live conversational thread.
  - Compression is cached by mission + tail length so repeated agent
    iterations within the same turn don't re-summarise the same
    content.
  - On compression failure, callers MUST fall back to truncation, not
    silent context loss. The caller decides the policy.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional

logger = logging.getLogger("signal.memory_compression")


# ── Tunables ────────────────────────────────────────────────────────────────

DEFAULT_VERBATIM_TAIL: int = 8
"""Recent notes always sent verbatim. Below this count, no compression."""

DEFAULT_COMPRESS_THRESHOLD: int = 20
"""Total notes count that triggers compression. Below = pass-through."""


# ── Cache ───────────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class _CacheKey:
    mission_id: str
    head_count: int  # how many notes were compressed
    tail_count: int  # how many kept verbatim


# Module-level cache. Keyed by mission + counts so concurrent agent
# loop iterations within the same conversational turn share the work.
# In production with multiple Railway replicas this is per-process
# only — that's fine because spine snapshot is the source of truth and
# cache miss just re-summarises (a cost, not a bug).
_compression_cache: dict[_CacheKey, str] = {}


def _format_note(note) -> str:
    """Stable formatting for a Note record (works on Pydantic + dicts)."""
    role = getattr(note, "role", None) or (note.get("role") if isinstance(note, dict) else None) or "user"
    text = getattr(note, "text", None) or (note.get("text") if isinstance(note, dict) else "") or ""
    return f"[{role}] {text}"


SUMMARISE_PROMPT = """És o compressor de memória do sistema Signal.

Recebes uma conversa entre um utilizador e o agent Insight (multi-turn,
com possíveis chamadas a ferramentas). Devolve uma destilação concisa
da conversa em formato estruturado:

- Decisões tomadas (concretas, citadas)
- Direções rejeitadas (com motivo se foi explícito)
- Perguntas que ficaram em aberto
- Riscos identificados
- Evidência externa relevante (URLs, citações)

Princípios:
- NUNCA inventes contexto ou conclusões. Só sintetiza o que está literalmente na conversa.
- Sé curto. Cada bullet uma linha.
- Se a conversa não tem matéria suficiente para uma das categorias, omite a secção.
- Idioma: o mesmo da conversa (português europeu ou inglês, espelha o input).
"""


# ── Public API ──────────────────────────────────────────────────────────────

async def compress_notes(
    mission_id: str,
    notes_newest_first: list,
    *,
    verbatim_tail: int = DEFAULT_VERBATIM_TAIL,
    compress_threshold: int = DEFAULT_COMPRESS_THRESHOLD,
) -> tuple[Optional[str], list]:
    """Summarise older notes; return (compressed_summary, verbatim_tail).

    Input: notes in spine order (newest first — frontend prepends).
    Output:
      - compressed_summary: text block to inject as context, or None
        when the conversation is short enough to skip compression.
      - verbatim_tail: oldest-first list of the most recent N notes
        passed through unchanged. Length capped at `verbatim_tail`.

    Falls back to truncation (no summary, return last `verbatim_tail`
    notes only) on provider failure. Callers decide whether to log
    the failure.
    """
    n = len(notes_newest_first)
    if n <= compress_threshold:
        # Short enough — pass everything through chronologically.
        return None, list(reversed(notes_newest_first))

    # Split: tail = newest `verbatim_tail` (newest-first slice [:tail])
    #        head = everything before that (the candidates for summary)
    tail = list(reversed(notes_newest_first[:verbatim_tail]))
    head = list(reversed(notes_newest_first[verbatim_tail:]))

    cache_key = _CacheKey(
        mission_id=mission_id,
        head_count=len(head),
        tail_count=len(tail),
    )
    cached = _compression_cache.get(cache_key)
    if cached is not None:
        return cached, tail

    summary = await _summarise_with_provider(head)
    if summary is None:
        # Provider failed — return tail only, no summary. Caller decides.
        return None, tail

    _compression_cache[cache_key] = summary
    return summary, tail


async def _summarise_with_provider(notes_chronological: list) -> Optional[str]:
    """Call Anthropic to compress a list of older notes. Returns None
    on failure (caller falls back to truncation)."""
    if not notes_chronological:
        return None

    # Lazy imports — same circular-import dance as chambers/insight.py.
    from config import ANTHROPIC_API_KEY, MAX_TOKENS, MODEL_ID, RUBERRA_MOCK

    if RUBERRA_MOCK or not ANTHROPIC_API_KEY:
        # Mock fallback: return a deterministic stub so the surrounding
        # flow can be smoke-tested without a key.
        return (
            f"[compressed-mock] {len(notes_chronological)} earlier turns. "
            "Decisões e direções literais não foram destiladas porque o "
            "compressor está em modo mock (sem ANTHROPIC_API_KEY ou com "
            "SIGNAL_MOCK=1)."
        )

    try:
        from anthropic import AsyncAnthropic
        client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        body = "\n".join(_format_note(n) for n in notes_chronological)
        response = await client.messages.create(
            model=MODEL_ID,
            max_tokens=min(MAX_TOKENS, 1024),
            temperature=0.1,
            system=SUMMARISE_PROMPT,
            messages=[{"role": "user", "content": body}],
        )
        text = ""
        for block in response.content:
            if getattr(block, "type", None) == "text":
                text += block.text
        return text.strip() or None
    except Exception as exc:  # noqa: BLE001
        logger.warning("Memory compression failed: %s", exc)
        return None


def clear_cache(mission_id: Optional[str] = None) -> int:
    """Clear cached summaries — for tests and for use when a mission's
    notes have changed materially (e.g. user deleted earlier turns).
    Returns count of entries dropped."""
    global _compression_cache
    if mission_id is None:
        n = len(_compression_cache)
        _compression_cache = {}
        return n
    keys = [k for k in _compression_cache if k.mission_id == mission_id]
    for k in keys:
        _compression_cache.pop(k, None)
    return len(keys)
