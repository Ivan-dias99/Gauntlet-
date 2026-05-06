"""
Gauntlet — provider fallback tests (Sprint 8 close).

Exercises the model_gateway's routing layer end-to-end without
actually calling Anthropic. The gateway's job is:

  1. select(role)               primary model for a role
  2. fallback(role, failed_id)  next model in the chain, or None
  3. record(GatewayCall)        ledger entry + cost estimate
  4. summary()                  aggregate diagnostics

Tests proving these are deterministic and that the routing config
itself (CATALOGUE + ROUTING) is internally consistent — a typo in the
chain that silently disables failover is exactly the bug we want to
catch at CI time, not at 3am during an outage.

Run:
    pytest -q test_provider_fallback.py
"""

from __future__ import annotations

import os

import pytest


@pytest.fixture
def fresh_gateway():
    """Each test gets a freshly-imported gateway so the call ledger
    doesn't bleed across cases."""
    os.environ.setdefault("GAUNTLET_MOCK", "1")
    import importlib
    import sys
    sys.modules.pop("model_gateway", None)
    return importlib.import_module("model_gateway")


# ── Catalogue + routing health ─────────────────────────────────────────────

def test_catalogue_contains_expected_models(fresh_gateway):
    cat = fresh_gateway.CATALOGUE
    for required in ("claude-sonnet-4-6", "claude-haiku-4-5", "claude-opus-4-7"):
        assert required in cat, f"missing {required} from catalogue"


def test_routing_chain_only_references_catalogue(fresh_gateway):
    # _validate_routing runs at module import. If we got here the chains
    # are clean. Re-validate explicitly so a future regression that
    # disables the import-time check still trips a test.
    cat = fresh_gateway.CATALOGUE
    for role, chain in fresh_gateway.ROUTING.items():
        assert chain, f"role {role!r} has empty routing chain"
        for model_id in chain:
            assert model_id in cat, (
                f"ROUTING[{role!r}] references {model_id!r} which is "
                "not in CATALOGUE"
            )


# ── select / fallback semantics ────────────────────────────────────────────

def test_select_returns_primary_for_role(fresh_gateway):
    g = fresh_gateway.ModelGateway()
    primary = g.select("triad")
    assert primary.model_id == fresh_gateway.ROUTING["triad"][0]


def test_select_falls_through_to_default_for_unknown_role(fresh_gateway):
    g = fresh_gateway.ModelGateway()
    # The Literal type doesn't enforce the runtime arg — gateway should
    # fall back to "default" rather than raise on a typo.
    primary = g.select("unknown_role")  # type: ignore[arg-type]
    assert primary.model_id == fresh_gateway.ROUTING["default"][0]


def test_fallback_walks_chain(fresh_gateway):
    g = fresh_gateway.ModelGateway()
    chain = fresh_gateway.ROUTING["triad"]
    assert len(chain) >= 2, "test depends on triad chain having a fallback"
    second = g.fallback("triad", chain[0])
    assert second is not None
    assert second.model_id == chain[1]


def test_fallback_returns_none_when_chain_exhausted(fresh_gateway):
    g = fresh_gateway.ModelGateway()
    chain = fresh_gateway.ROUTING["triad"]
    last = chain[-1]
    assert g.fallback("triad", last) is None


def test_fallback_returns_none_for_unknown_failed_model(fresh_gateway):
    # A garbage failed_model_id is not in the chain — gateway returns
    # None rather than raising. The caller surfaces the original error.
    g = fresh_gateway.ModelGateway()
    assert g.fallback("triad", "model-that-does-not-exist") is None


def test_judge_chain_has_no_fallback_by_design(fresh_gateway):
    # Doctrine: judge needs consistency, no fallback. If this test fails
    # because someone added a fallback to judge, replace this assertion
    # with the new explicit chain — but at least the change is deliberate.
    chain = fresh_gateway.ROUTING["judge"]
    assert len(chain) == 1, (
        f"judge chain has unexpected fallback: {chain}. "
        "Per doctrine the judge runs without failover."
    )


# ── record + summary ───────────────────────────────────────────────────────

def test_record_computes_cost_estimate(fresh_gateway):
    g = fresh_gateway.ModelGateway()
    call = fresh_gateway.GatewayCall(
        role="triad",
        model_id="claude-sonnet-4-6",
        provider="anthropic",
        input_tokens=1_000_000,
        output_tokens=500_000,
    )
    g.record(call)
    # sonnet-4-6 prices: $3/M input + $15/M output → 3 + 7.5 = 10.5
    assert call.cost_usd_estimate == pytest.approx(10.5, abs=1e-6)


def test_record_charges_tokens_on_failure(fresh_gateway):
    # The Anthropic API still bills for tokens consumed before a
    # post-generation failure. summary() must reflect that or it
    # underreports spend on the fallback path.
    g = fresh_gateway.ModelGateway()
    g.record(fresh_gateway.GatewayCall(
        role="triad",
        model_id="claude-sonnet-4-6",
        provider="anthropic",
        input_tokens=10_000,
        output_tokens=0,
        succeeded=False,
        error_kind="RateLimitError",
    ))
    summary = g.summary()
    assert summary["total_calls"] == 1
    assert summary["failure_count"] == 1
    assert summary["total_cost_usd_estimate"] > 0


def test_record_caps_history(fresh_gateway):
    g = fresh_gateway.ModelGateway(max_call_history=3)
    for i in range(7):
        g.record(fresh_gateway.GatewayCall(
            role="default",
            model_id="claude-sonnet-4-6",
            provider="anthropic",
            input_tokens=i,
            output_tokens=0,
        ))
    assert g.summary()["total_calls"] == 3


def test_record_with_zero_history_keeps_list_empty(fresh_gateway):
    # Edge case: max_call_history=0 should mean "disabled" not "keep
    # everything since [-0:] is the full list" — guard added in
    # model_gateway.record().
    g = fresh_gateway.ModelGateway(max_call_history=0)
    g.record(fresh_gateway.GatewayCall(
        role="default",
        model_id="claude-sonnet-4-6",
        provider="anthropic",
    ))
    assert g.summary()["total_calls"] == 0


def test_summary_counts_fallbacks(fresh_gateway):
    g = fresh_gateway.ModelGateway()
    g.record(fresh_gateway.GatewayCall(
        role="triad",
        model_id="claude-sonnet-4-6",
        provider="anthropic",
        input_tokens=100,
        output_tokens=50,
    ))
    g.record(fresh_gateway.GatewayCall(
        role="triad",
        model_id="claude-haiku-4-5",
        provider="anthropic",
        input_tokens=100,
        output_tokens=50,
        fallback_from="claude-sonnet-4-6",
    ))
    summary = g.summary()
    assert summary["total_calls"] == 2
    assert summary["fallback_count"] == 1
    assert summary["by_model"]["claude-sonnet-4-6"] == 1
    assert summary["by_model"]["claude-haiku-4-5"] == 1


# ── Validate routing invariant fires at import time ────────────────────────

def test_validate_routing_catches_typos(fresh_gateway, monkeypatch):
    # Inject a bad routing entry and re-run the validator. This proves
    # the validator actually catches the failure mode rather than
    # silently passing.
    monkeypatch.setitem(
        fresh_gateway.ROUTING,
        "default",
        ["claude-sonnet-4-6", "model-that-does-not-exist"],
    )
    with pytest.raises(RuntimeError, match="ROUTING"):
        fresh_gateway._validate_routing()


# ── Walk a full simulated fallback ─────────────────────────────────────────

def test_full_fallback_walk_records_chain(fresh_gateway):
    """Simulate a triad call that exhausts the chain — primary fails,
    secondary succeeds. The gateway's ledger should reflect both calls
    with the correct fallback_from on the second."""
    g = fresh_gateway.ModelGateway()
    chain = fresh_gateway.ROUTING["triad"]
    primary = g.select("triad")
    assert primary.model_id == chain[0]

    # Simulate primary failure
    g.record(fresh_gateway.GatewayCall(
        role="triad",
        model_id=primary.model_id,
        provider=primary.provider,
        succeeded=False,
        error_kind="RateLimitError",
    ))

    # Walk to next link
    nxt = g.fallback("triad", primary.model_id)
    assert nxt is not None
    assert nxt.model_id == chain[1]

    # Simulate secondary success
    g.record(fresh_gateway.GatewayCall(
        role="triad",
        model_id=nxt.model_id,
        provider=nxt.provider,
        input_tokens=200,
        output_tokens=100,
        fallback_from=primary.model_id,
    ))

    summary = g.summary()
    assert summary["total_calls"] == 2
    assert summary["failure_count"] == 1
    assert summary["fallback_count"] == 1
