"""
Gauntlet — Context Router (post-chamber).

Pre-Gauntlet, this module mapped a chamber key onto a per-chamber profile
(insight/surface/terminal/archive/core), each with its own system prompt
and tool allowlist. The Gauntlet migration retired chambers in favour of a
single Composer + multimodel gateway, so the router is now a thin shim
that hands every caller the global doctrine prompt and an empty allowlist.

Kept as a module to preserve the engine/agent call sites; can be folded
into engine.py later once nothing imports ``ContextRouter`` directly.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from models import SignalQuery


logger = logging.getLogger("gauntlet.context_router")


@dataclass(frozen=True)
class RoutedContext:
    """Resolved per-call context. Frozen so a routed context cannot be
    mutated after dispatch."""

    system_prompt: str
    tools: list[str]
    required_gates: list[str]
    max_iterations: int
    notes: dict[str, Any] = field(default_factory=dict)


_DEFAULT_MAX_ITERATIONS: int = 10


class ContextRouter:
    """Hands every caller the global doctrine prompt with an unfiltered
    tool surface. No chamber-specific shaping anymore."""

    def __init__(self) -> None:
        pass

    def route(self, chamber: Optional[str], query: "SignalQuery") -> RoutedContext:
        from doctrine import SYSTEM_PROMPT as _GLOBAL_TRIAD_PROMPT

        ctx = RoutedContext(
            system_prompt=_GLOBAL_TRIAD_PROMPT,
            tools=[],
            required_gates=[],
            max_iterations=_DEFAULT_MAX_ITERATIONS,
            notes={
                "dispatch": None,
                "temperature": None,
                "tool_filter_active": False,
                "intent": "gauntlet unrouted",
                "chamber_hint": chamber if isinstance(chamber, str) else None,
            },
        )
        logger.info(
            "context_router: hint=%s tools=%d gates=%d",
            chamber if isinstance(chamber, str) else "(none)",
            len(ctx.tools),
            len(ctx.required_gates),
        )
        return ctx
