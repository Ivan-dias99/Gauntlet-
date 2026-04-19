"""
Ruberra — Prompt-caching helpers for Anthropic messages API.

Claude's prompt caching reuses the cached portion of a prompt across
successive calls. Two surfaces benefit most here:

  * the system prompt (doctrine + principles) — stable for an entire run,
    often stable across runs of the same role.
  * the tools schema — every iteration of the agent loop re-sends the
    same tools, and every crew role with tools sends its own fixed subset.

Both become ``cache_control={"type": "ephemeral"}`` on the final block of
each cacheable segment. The first call writes the cache; subsequent calls
within the 5-minute window read it at ~10% of the input-token cost.

Helpers:
  * ``build_system_blocks(text, principles)`` — system as list[block] with
    the final block flagged cacheable.
  * ``cacheable_tools(tools)`` — clone of the tools list with the last
    entry carrying a cache_control flag.
  * ``flatten_system(system)`` — utility for callers (mock client, tests)
    that need the raw text back.
"""

from __future__ import annotations

from typing import Any

from doctrine import build_principles_context


def build_system_blocks(
    text: str,
    principles: list[str] | None = None,
) -> list[dict[str, Any]]:
    """Return a list of system blocks ready for ``messages.create(system=...)``.

    The combined system text is placed in a single text block with
    ``cache_control`` set. Principles are appended after because they're
    operator-level and may change between runs; we still cache the
    composite so long as the full text matches the previous call.
    """
    composite = text + build_principles_context(principles)
    return [
        {
            "type": "text",
            "text": composite,
            "cache_control": {"type": "ephemeral"},
        }
    ]


def cacheable_tools(tools: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Return ``tools`` with a cache breakpoint on the last entry.

    The tool schemas are treated as a block of prefix cache for every
    call in the agent loop. Identity matters: the tools list must be the
    same on successive calls for the cache to hit.
    """
    if not tools:
        return tools
    out: list[dict[str, Any]] = []
    for i, t in enumerate(tools):
        if i == len(tools) - 1:
            t = {**t, "cache_control": {"type": "ephemeral"}}
        out.append(t)
    return out


def flatten_system(system: Any) -> str:
    """Collapse a system value (str or list[block]) back into plain text.

    Used by the mock client for role detection.
    """
    if isinstance(system, str):
        return system
    if isinstance(system, list):
        return "".join(
            b.get("text", "") for b in system if isinstance(b, dict) and b.get("type") == "text"
        )
    return ""
