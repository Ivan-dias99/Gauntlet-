"""
Signal chamber profiles — Wave 1 scaffolding.

Shape intentionally minimal. Every optional field (system_prompt,
primary_model, allowed_tools, temperature, max_tokens) is None/empty
in Wave 1 so engine.py and agent.py keep using their current global
defaults. The only field that actually carries semantics today is
``dispatch``, consulted by the auto-router when a query arrives with
an explicit ``chamber`` field.

Dispatch mapping rationale (Wave 1 only — revisable in Wave 5):
    insight  → triad   (reasoning / evidence pressure = today's /ask pipeline)
    surface  → agent   (design workstation — agent loop, tools mock in Wave 3)
    terminal → agent   (code / tool-use = today's /dev pipeline)
    archive  → triad   (retrieval summarization defaults to conservative triad)
    core     → triad   (governance questions default to conservative triad)

``crew`` is not auto-routable in Wave 1 — it stays behind the explicit
/crew/stream endpoint as today. Reserved for Wave 5+.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Literal, Optional


class ChamberKey(str, Enum):
    """Canonical five-chamber taxonomy, shared with the TypeScript client."""
    INSIGHT = "insight"
    SURFACE = "surface"
    TERMINAL = "terminal"
    ARCHIVE = "archive"
    CORE = "core"


Dispatch = Literal["agent", "triad"]


@dataclass(frozen=True)
class ChamberProfile:
    key: ChamberKey
    dispatch: Dispatch
    # Wave-5 slots. Kept None/empty in Wave 1 — engine.py and agent.py
    # fall back to the current globals when any slot is absent.
    system_prompt: Optional[str] = None
    primary_model: Optional[str] = None
    allowed_tools: tuple[str, ...] = ()
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None


PROFILES: dict[ChamberKey, ChamberProfile] = {
    ChamberKey.INSIGHT:  ChamberProfile(key=ChamberKey.INSIGHT,  dispatch="triad"),
    ChamberKey.SURFACE:  ChamberProfile(key=ChamberKey.SURFACE,  dispatch="agent"),
    ChamberKey.TERMINAL: ChamberProfile(key=ChamberKey.TERMINAL, dispatch="agent"),
    ChamberKey.ARCHIVE:  ChamberProfile(key=ChamberKey.ARCHIVE,  dispatch="triad"),
    ChamberKey.CORE:     ChamberProfile(key=ChamberKey.CORE,     dispatch="triad"),
}


def get_profile(key: "ChamberKey | str | None") -> Optional[ChamberProfile]:
    """Return the profile for a chamber key, or None for unknown/absent.

    Accepts a string to allow callers to pass the raw ``RuberraQuery.chamber``
    value without coercing first. Unknown strings collapse to None — the
    engine then falls back to ``is_dev_intent`` heuristic routing.
    """
    if key is None:
        return None
    if isinstance(key, str):
        try:
            key = ChamberKey(key)
        except ValueError:
            return None
    return PROFILES.get(key)
