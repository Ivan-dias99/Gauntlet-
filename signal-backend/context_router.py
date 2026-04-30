"""
Signal — Context Router (Wave P-24).

The Signal doctrine's 10×10 capability matrix lists "Context Router" as
Tool 2. Until this wave it was missing as an explicit abstraction:
``engine.py`` and ``agent.py`` each pulled chamber profile fields
(``system_prompt``, ``allowed_tools``, ``temperature``) inline at the
point of use, so the routing logic was scattered across the call sites
that consumed it.

This module collects that logic behind a single seam:

    router = ContextRouter()
    ctx = router.route(query.chamber, query)
    # ctx.system_prompt — the chamber-specific (or fallback) base prompt
    # ctx.tools         — list of tool names the chamber may use
    # ctx.required_gates — gates the chamber expects evidence for
    # ctx.max_iterations — agent-loop budget for this chamber
    # ctx.notes          — chamber-specific extras (temperature, dispatch, …)

Behaviour for the five canonical chambers stays identical to pre-Wave-P-24
— the router just *centralises* what the call sites used to compute on
their own. Unknown chambers receive a "ghost" context: minimal prompt,
no tools, no gates, logged as a warning. Doctrine alignment: refuse-by-
absence rather than guess at policy.

Imports are lazy where reasonable so the router stays self-contained and
loadable in isolation (e.g. tests, scripts) without dragging in the full
engine + agent + chamber graph.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from models import SignalQuery


logger = logging.getLogger("signal.context_router")


# ── Routed Context Envelope ────────────────────────────────────────────────


@dataclass(frozen=True)
class RoutedContext:
    """Resolved per-call context produced by ``ContextRouter.route``.

    Frozen so a routed context cannot be mutated after dispatch — call
    sites that need a tweak must build a new one. ``notes`` is mutable
    by virtue of being a dict, but the field itself is bound at
    construction time; callers are expected to read, not write.
    """

    system_prompt: str
    tools: list[str]
    required_gates: list[str]
    max_iterations: int
    notes: dict[str, Any] = field(default_factory=dict)


# ── Router ─────────────────────────────────────────────────────────────────


# Default agent-loop iteration budget — mirrors agent.MAX_AGENT_ITERATIONS
# so existing chamber behaviour is unchanged. Imported lazily inside
# ``route()`` to avoid pulling the agent module at router-import time.
_DEFAULT_MAX_ITERATIONS: int = 10


# Per-chamber routing rules. Each entry declares the gates the chamber
# is expected to produce evidence for and a free-form ``notes`` payload
# carrying chamber-specific extras (dispatch, temperature, etc.).
#
# The system prompt and tool allowlist come from the chamber profile
# itself — duplicating them here would just create drift. The router
# *combines* the profile fields with these rule fields into one
# RoutedContext envelope.
_CHAMBER_RULES: dict[str, dict[str, Any]] = {
    "insight": {
        # Research lab — read-only exploration, no gates expected.
        "required_gates": [],
        "notes": {"intent": "research+citations"},
    },
    "surface": {
        # Design generator — emits BuildSpec/design tokens via tool_use.
        # No agent-loop tools (the generator is internal); no gates.
        "required_gates": [],
        "notes": {"intent": "BuildSpec+design tokens"},
    },
    "terminal": {
        # Executor — gates are the load-bearing evidence.
        "required_gates": ["typecheck", "build", "test"],
        "notes": {"intent": "exec+gate evidence"},
    },
    "archive": {
        # Read-only retrieval. Triad path; no tools, no gates.
        "required_gates": [],
        "notes": {"intent": "readonly retrieval"},
    },
    "core": {
        # Governance / system. Triad path; no tools, no gates.
        "required_gates": [],
        "notes": {"intent": "system + doctrine"},
    },
}


class ContextRouter:
    """Map a chamber + query to a fully-shaped ``RoutedContext``.

    The router reads the chamber profile (``chambers.profiles``) for the
    base system prompt and tool allowlist, then overlays the chamber's
    routing rule (gates, intent notes) and the global defaults (max
    iterations, doctrine fallback). Behaviour for the five canonical
    chambers is byte-equivalent to the pre-Wave-P-24 inline shaping that
    used to live in ``engine.py`` / ``agent.py``.

    Unknown chambers fall through to a "ghost" context: minimal prompt,
    empty tool list, empty gate list, logged as a warning. The doctrine
    forbids quietly substituting policy — the warning is the audit trail
    that the chamber went unrecognised.
    """

    def __init__(self) -> None:
        # Cheap. Construction is O(1) — everything is resolved per call
        # in ``route()`` so a single router instance can serve many
        # concurrent requests without contention.
        pass

    def route(self, chamber: Optional[str], query: "SignalQuery") -> RoutedContext:
        """Resolve a ``RoutedContext`` for the given chamber + query.

        ``chamber`` may be a string, a ``ChamberKey`` enum value, or
        ``None``. None / unknown collapses to the ghost fallback.
        """
        # Lazy imports keep the router file self-contained at import time.
        # The chamber profiles module pulls in every chamber sub-module,
        # which in turn touches doctrine.py and pydantic models — too
        # much for a router import to drag in unconditionally.
        from chambers.profiles import ChamberKey, get_profile
        from doctrine import SYSTEM_PROMPT as _GLOBAL_TRIAD_PROMPT

        chamber_key: Optional[str] = None
        if isinstance(chamber, ChamberKey):
            chamber_key = chamber.value
        elif isinstance(chamber, str):
            chamber_key = chamber
        # else: chamber is None (pre-Wave-1 callers with no chamber set)

        profile = get_profile(chamber)
        rule = _CHAMBER_RULES.get(chamber_key or "")

        if profile is None or rule is None:
            # Two flavours of fallback:
            #   chamber is None      → legacy "no routing" path. Hand back
            #                          the global doctrine prompt with no
            #                          tool filter so pre-Wave-1 clients
            #                          keep working byte-equivalent.
            #   chamber is unknown   → ghost. Refuse-by-absence; logged
            #                          as warning; no tools, no gates.
            if chamber_key is None:
                ctx = self._legacy_unrouted_context(_GLOBAL_TRIAD_PROMPT)
                self._log("(none)", ctx)
            else:
                ctx = self._ghost_context(chamber_key)
                self._log(chamber_key, ctx)
            return ctx

        # Compose the base system prompt from the profile, falling back
        # to the global triad prompt when the profile leaves it unset
        # (mirrors engine.py's pre-Wave-P-24 logic verbatim).
        base_prompt = profile.system_prompt or _GLOBAL_TRIAD_PROMPT

        # Tool allowlist: profile.allowed_tools may be None (no filter
        # → all registered tools), () (zero tools), or an explicit
        # tuple. The router collapses to the typed list[str] envelope.
        # When the profile says "no filter" we honour it by carrying an
        # empty list and tagging the notes — the *consumer* (agent.py)
        # is responsible for the unfiltered-schema branch, not the
        # router. This keeps RoutedContext.tools unambiguous.
        if profile.allowed_tools is None:
            tools: list[str] = []
            tool_filter_active = False
        else:
            tools = list(profile.allowed_tools)
            tool_filter_active = True

        notes: dict[str, Any] = {
            "dispatch": profile.dispatch,
            "temperature": profile.temperature,
            "tool_filter_active": tool_filter_active,
        }
        # Merge the chamber rule's notes — rule wins on conflicts so
        # tests can stub a chamber's intent without touching the profile.
        notes.update(rule["notes"])

        ctx = RoutedContext(
            system_prompt=base_prompt,
            tools=tools,
            required_gates=list(rule["required_gates"]),
            max_iterations=_DEFAULT_MAX_ITERATIONS,
            notes=notes,
        )
        self._log(chamber_key or "(none)", ctx)
        return ctx

    # ── Helpers ────────────────────────────────────────────────────────────

    @staticmethod
    def _legacy_unrouted_context(global_prompt: str) -> RoutedContext:
        """Return a routed context for ``chamber is None`` callers.

        Pre-Wave-1 clients omit the chamber field entirely; their
        behaviour was: "use doctrine.SYSTEM_PROMPT, no tool filter".
        Preserving that path keeps the Wave-P-24 refactor cosmetic for
        existing flows.
        """
        return RoutedContext(
            system_prompt=global_prompt,
            tools=[],
            required_gates=[],
            max_iterations=_DEFAULT_MAX_ITERATIONS,
            notes={
                "dispatch": None,
                "temperature": None,
                "tool_filter_active": False,
                "intent": "legacy unrouted",
            },
        )

    @staticmethod
    def _ghost_context(chamber_key: Optional[str]) -> RoutedContext:
        """Return the minimal "ghost" context for unknown chambers.

        Doctrine: refuse policy substitution. The system prompt names the
        chamber explicitly (or "(none)") so a downstream consumer that
        ignores the warning at least surfaces the gap to the model.
        """
        label = chamber_key or "(none)"
        ghost_prompt = (
            "You are Signal — Ghost chamber. The router did not recognise the "
            f"chamber key '{label}'. No tools are bound and no gates are "
            "required. Refuse to answer and ask the operator to pick a known "
            "chamber (insight, surface, terminal, archive, core)."
        )
        return RoutedContext(
            system_prompt=ghost_prompt,
            tools=[],
            required_gates=[],
            max_iterations=_DEFAULT_MAX_ITERATIONS,
            notes={"ghost": True, "requested_chamber": label},
        )

    @staticmethod
    def _log(chamber_label: str, ctx: RoutedContext) -> None:
        """Emit the single-line observability trace per route()."""
        if ctx.notes.get("ghost"):
            logger.warning(
                "context_router: chamber=%s tools=%d gates=%d (ghost fallback)",
                chamber_label, len(ctx.tools), len(ctx.required_gates),
            )
        else:
            logger.info(
                "context_router: chamber=%s tools=%d gates=%d",
                chamber_label, len(ctx.tools), len(ctx.required_gates),
            )
