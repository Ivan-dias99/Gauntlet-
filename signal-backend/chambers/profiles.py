"""
Signal chamber profiles — Wave 5 populated.

Each profile now carries a chamber-specific system prompt (pulled from
its sibling chambers/<key>.py module), a dispatch decision, a
temperature, and an explicit allowed-tools set.

Semantics of allowed_tools:
    None        → no filter (all registered tools visible to the agent)
    ()          → ZERO tools (triad-only chambers, surface mock, or
                   explicit disablement)
    ("a", "b")  → the intersection of this set with the current ToolRegistry

engine.py and agent.py read the profile: when system_prompt is set, it
replaces the global SYSTEM_PROMPT / AGENT_SYSTEM_PROMPT base; when
temperature is set, it overrides the global TRIAD_TEMPERATURE /
AGENT_TEMPERATURE; when allowed_tools is not None, the agent's
anthropic_schema() is filtered. Absent profile ⇒ legacy behavior
(global prompts + all tools) — the Wave-0 → Wave-8 compat window
depends on this fallback.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Literal, Optional

from chambers import insight as _insight
from chambers import terminal as _terminal
from chambers import archive as _archive
from chambers import core as _core
from chambers import surface as _surface


class ChamberKey(str, Enum):
    """Canonical five-chamber taxonomy, shared with the TypeScript client."""
    INSIGHT = "insight"
    SURFACE = "surface"
    TERMINAL = "terminal"
    ARCHIVE = "archive"
    CORE = "core"


Dispatch = Literal["agent", "triad", "surface", "surface_mock"]


@dataclass(frozen=True)
class ChamberProfile:
    key: ChamberKey
    dispatch: Dispatch
    system_prompt: Optional[str] = None
    primary_model: Optional[str] = None
    # None = no filter; () = zero tools; (...) = explicit allowlist.
    allowed_tools: Optional[tuple[str, ...]] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None


PROFILES: dict[ChamberKey, ChamberProfile] = {
    ChamberKey.INSIGHT: ChamberProfile(
        key=ChamberKey.INSIGHT,
        # Wave 6c — Insight switches from triad to conversational agent.
        # The chamber is now a research lab with read-only exploration
        # tools (web_search, web_fetch, read_file). Triad+judge stays
        # available as an on-demand validation path via the dedicated
        # /insight/validate/stream endpoint, which loads the original
        # doctrine.SYSTEM_PROMPT independently.
        dispatch="agent",
        system_prompt=_insight.EXPLORE_SYSTEM_PROMPT,
        temperature=_insight.TEMPERATURE,
        allowed_tools=_insight.ALLOWED_TOOLS,
    ),
    ChamberKey.SURFACE: ChamberProfile(
        key=ChamberKey.SURFACE,
        # Wave 5: real provider-backed generator. The handler itself
        # falls back to the mock when SIGNAL_SURFACE_MOCK / SIGNAL_MOCK
        # is set or when ANTHROPIC_API_KEY is missing — the dispatch
        # is the same in both worlds, so the engine fork stays uniform.
        dispatch="surface",
        system_prompt=_surface.SYSTEM_PROMPT,
        temperature=_surface.TEMPERATURE,
        allowed_tools=_surface.ALLOWED_TOOLS,
    ),
    ChamberKey.TERMINAL: ChamberProfile(
        key=ChamberKey.TERMINAL,
        dispatch="agent",
        system_prompt=_terminal.SYSTEM_PROMPT,
        temperature=_terminal.TEMPERATURE,
        allowed_tools=_terminal.ALLOWED_TOOLS,
    ),
    ChamberKey.ARCHIVE: ChamberProfile(
        key=ChamberKey.ARCHIVE,
        dispatch="triad",
        system_prompt=_archive.SYSTEM_PROMPT,
        temperature=_archive.TEMPERATURE,
        allowed_tools=_archive.ALLOWED_TOOLS,
    ),
    ChamberKey.CORE: ChamberProfile(
        key=ChamberKey.CORE,
        dispatch="triad",
        system_prompt=_core.SYSTEM_PROMPT,
        temperature=_core.TEMPERATURE,
        allowed_tools=_core.ALLOWED_TOOLS,
    ),
}


def get_profile(key: "ChamberKey | str | None") -> Optional[ChamberProfile]:
    """Return the profile for a chamber key, or None for unknown/absent."""
    if key is None:
        return None
    if isinstance(key, str):
        try:
            key = ChamberKey(key)
        except ValueError:
            return None
    return PROFILES.get(key)
