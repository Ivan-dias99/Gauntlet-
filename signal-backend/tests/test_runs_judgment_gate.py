"""Doctrine gate: a refused run cannot land in the ledger without judgment.

This is the regression test for the Archive screenshot showing
'sem motivo registado' — runs.py auto-stamps the violation now so the row
is recorded but visibly degraded.
"""

import asyncio

import pytest

from models import RunRecord
from runs import run_store


@pytest.mark.asyncio
async def test_refused_without_judgment_is_quarantined():
    rec = RunRecord(
        route="triad",
        question="any question",
        refused=True,
        judge_reasoning=None,
        termination_reason=None,
        tool_calls=[],
    )
    await run_store.record(rec)
    assert rec.termination_reason == "missing_judgment_quarantine"


@pytest.mark.asyncio
async def test_refused_with_reasoning_is_recorded_clean():
    rec = RunRecord(
        route="triad",
        question="another question",
        refused=True,
        judge_reasoning="judge said: divergent",
        tool_calls=[],
    )
    await run_store.record(rec)
    assert rec.termination_reason is None


@pytest.mark.asyncio
async def test_non_refused_run_is_unchanged():
    rec = RunRecord(
        route="agent",
        question="terminal task",
        refused=False,
        tool_calls=[],
    )
    await run_store.record(rec)
    assert rec.termination_reason is None
