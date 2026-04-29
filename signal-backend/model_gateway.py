"""
Signal — Model Gateway (Wave H).

Today every chamber calls Anthropic directly with the global MODEL_ID.
Wave H introduces a thin routing layer so the chambers can:

1. Pick a model by **role** (triad / judge / agent / distill / surface
   / compress) instead of hard-coding model ids.
2. Fall back gracefully when a model is unavailable (rate limited,
   network blip, region outage).
3. Track per-call cost approximations for the run log + Archive
   diagnostics.

This is the "Model Gateway" connector from the V3.1 stack.

Wave H v1 is **single-provider** (Anthropic). The architecture
permits adding alternative providers later without changing chamber
code — chambers will keep calling `gateway.create(role=..., ...)` and
the gateway picks a route.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Literal, Optional

logger = logging.getLogger("signal.model_gateway")


ModelRole = Literal[
    "triad",        # parallel self-consistency calls
    "judge",        # consistency evaluator
    "agent",        # tool-use agent loop
    "distill",      # Wave 6a Truth Distillation forced tool-call
    "surface",      # Wave 5 SurfacePlan generator
    "compress",     # Wave F memory compression
    "validate",     # Wave 6c on-demand triad validation
    "default",      # everything else
]


@dataclass(frozen=True)
class ModelChoice:
    """A specific model to call. The gateway picks one per role; the
    chamber receives this and uses `model_id` directly. Cost fields
    are approximations from public price lists."""
    model_id: str
    provider: str = "anthropic"
    cost_per_1m_input_usd: float = 0.0
    cost_per_1m_output_usd: float = 0.0
    notes: str = ""


# ── Catalogue ──────────────────────────────────────────────────────────────
#
# Single source of truth for model ids the gateway will consider. Update
# here when Anthropic ships a new generation; chamber code doesn't need
# to change.
#
# Costs are illustrative — the gateway records them on each call so the
# run log shows ~$ rather than just tokens. Not authoritative pricing.

CATALOGUE: dict[str, ModelChoice] = {
    "claude-sonnet-4-6": ModelChoice(
        model_id="claude-sonnet-4-6",
        cost_per_1m_input_usd=3.0,
        cost_per_1m_output_usd=15.0,
        notes="Default work model. Used by triad, judge, agent, distill, surface.",
    ),
    "claude-haiku-4-5": ModelChoice(
        model_id="claude-haiku-4-5",
        cost_per_1m_input_usd=0.8,
        cost_per_1m_output_usd=4.0,
        notes="Faster + cheaper. Good for compress + lightweight triads.",
    ),
    "claude-opus-4-7": ModelChoice(
        model_id="claude-opus-4-7",
        cost_per_1m_input_usd=15.0,
        cost_per_1m_output_usd=75.0,
        notes="Heaviest model. Reserved for complex distillation if budget allows.",
    ),
}


# Per-role primary + fallback chain. Ordered: try primary first, on
# unavailability fall through. Anthropic's SDK raises specific errors
# for rate limits, capacity, and authentication — gateway translates
# these into "try next" decisions.
ROUTING: dict[ModelRole, list[str]] = {
    "triad":    ["claude-sonnet-4-6", "claude-haiku-4-5"],
    "judge":    ["claude-sonnet-4-6"],  # judge needs consistency, no fallback
    "agent":    ["claude-sonnet-4-6"],
    "distill":  ["claude-sonnet-4-6"],
    "surface":  ["claude-sonnet-4-6"],
    "compress": ["claude-haiku-4-5", "claude-sonnet-4-6"],  # cheap first
    "validate": ["claude-sonnet-4-6"],
    "default":  ["claude-sonnet-4-6"],
}


def _validate_routing() -> None:
    """Fail loud at import time if ROUTING references an unknown model.
    Silent gaps here disable failover exactly when resilience matters
    (a typo or a removed catalogue entry would let `fallback()` return
    None and the caller would think the chain was legitimately
    exhausted)."""
    for role, chain in ROUTING.items():
        for model_id in chain:
            if model_id not in CATALOGUE:
                raise RuntimeError(
                    f"ROUTING[{role!r}] references unknown model {model_id!r} "
                    f"— add it to CATALOGUE or fix the routing chain."
                )


_validate_routing()


@dataclass
class GatewayCall:
    """One recorded call through the gateway. Exposed via /diagnostics
    or the run log so the operator can see routing decisions, fallbacks,
    and cost approximations."""
    role: ModelRole
    model_id: str
    provider: str
    input_tokens: int = 0
    output_tokens: int = 0
    cost_usd_estimate: float = 0.0
    succeeded: bool = True
    fallback_from: Optional[str] = None  # model that we'd have used
    error_kind: Optional[str] = None


@dataclass
class ModelGateway:
    """Stateful gateway. Holds the call ledger so /diagnostics can
    surface aggregate totals. Stateless w.r.t. routing — that's
    config-driven via CATALOGUE + ROUTING."""
    calls: list[GatewayCall] = field(default_factory=list)
    max_call_history: int = 1000

    def select(self, role: ModelRole) -> ModelChoice:
        """Pick the primary model for a role. The chamber receives
        this; if the call fails it can come back via `record_failure`
        and the gateway suggests the next fallback."""
        chain = ROUTING.get(role) or ROUTING["default"]
        if not chain:
            raise RuntimeError(f"No model in routing chain for role={role}")
        choice = CATALOGUE.get(chain[0])
        if choice is None:
            raise RuntimeError(f"Routing chain references unknown model {chain[0]!r}")
        return choice

    def fallback(self, role: ModelRole, failed_model_id: str) -> Optional[ModelChoice]:
        """Return the next model after `failed_model_id` in the role's
        chain. None when the chain is exhausted (caller should refuse
        / surface the original error). Raises RuntimeError if the next
        link in the chain is missing from the catalogue — silent
        misconfiguration here would disable failover exactly when the
        primary is failing."""
        chain = ROUTING.get(role) or ROUTING["default"]
        try:
            idx = chain.index(failed_model_id)
        except ValueError:
            return None
        if idx + 1 >= len(chain):
            return None
        next_id = chain[idx + 1]
        choice = CATALOGUE.get(next_id)
        if choice is None:
            raise RuntimeError(
                f"ROUTING[{role!r}] fallback references unknown model {next_id!r}"
            )
        return choice

    def record(self, call: GatewayCall) -> None:
        """Record a completed (success or failure) gateway call."""
        # Compute cost estimate from the call's tokens + catalogue.
        choice = CATALOGUE.get(call.model_id)
        if choice is not None and call.succeeded:
            call.cost_usd_estimate = (
                call.input_tokens * choice.cost_per_1m_input_usd / 1_000_000
                + call.output_tokens * choice.cost_per_1m_output_usd / 1_000_000
            )
        self.calls.append(call)
        if len(self.calls) > self.max_call_history:
            self.calls = self.calls[-self.max_call_history:]

    def summary(self) -> dict[str, Any]:
        """Aggregate diagnostics surface."""
        total_in = sum(c.input_tokens for c in self.calls)
        total_out = sum(c.output_tokens for c in self.calls)
        total_cost = sum(c.cost_usd_estimate for c in self.calls)
        by_model: dict[str, int] = {}
        by_role: dict[str, int] = {}
        for c in self.calls:
            by_model[c.model_id] = by_model.get(c.model_id, 0) + 1
            by_role[c.role] = by_role.get(c.role, 0) + 1
        fallbacks = sum(1 for c in self.calls if c.fallback_from)
        failures = sum(1 for c in self.calls if not c.succeeded)
        return {
            "total_calls": len(self.calls),
            "total_input_tokens": total_in,
            "total_output_tokens": total_out,
            "total_cost_usd_estimate": round(total_cost, 4),
            "by_model": by_model,
            "by_role": by_role,
            "fallback_count": fallbacks,
            "failure_count": failures,
        }


# Module-level singleton — chambers import this and call select/fallback.
gateway = ModelGateway()
