"""SQLite migration is idempotent; runs/spine/failures persist across reads."""

import pytest

from db import get_db, migrate_legacy_json_if_needed
from models import RunRecord, SpineSnapshot
from runs import run_store
from spine import spine_store


@pytest.mark.asyncio
async def test_migration_runs_without_errors_on_clean_install():
    report = await migrate_legacy_json_if_needed()
    assert report["errors"] == []


@pytest.mark.asyncio
async def test_run_round_trip_through_sqlite():
    rec = RunRecord(
        route="agent",
        question="hello",
        answer="hi",
        refused=False,
        tool_calls=[],
        mission_id="m-1",
    )
    await run_store.record(rec)
    listed = await run_store.list(mission_id="m-1", limit=10)
    assert any(r.id == rec.id for r in listed)


@pytest.mark.asyncio
async def test_spine_round_trip_through_sqlite():
    snap = SpineSnapshot(missions=[], principles=[])
    out = await spine_store.put(snap)
    fetched = await spine_store.get()
    assert fetched.last_updated == out.last_updated
