# Signal — Postgres migrations

Wave O ships the v1 schema (`0001_initial_schema.sql`). The backend
still runs on JSON files today — this directory is the destination
state.

## What's here

- `0001_initial_schema.sql` — v1 schema mirroring `models.py`. Tables:
  missions, notes, tasks, truth_distillations, handoffs, runs,
  failure_records, principles, telemetry_events.

## What's not here yet

- A migration script. The current JSON files (`spine.json`,
  `runs.json`, `failure_memory.json`) need a one-time walk →
  `INSERT` into the new tables. Sketch:

  ```python
  # signal-backend/migrate_to_postgres.py (future)
  import asyncpg, json
  async def migrate():
      conn = await asyncpg.connect(dsn=os.environ["SIGNAL_DATABASE_URL"])
      # 1. Apply 0001_initial_schema.sql
      # 2. Walk spine.json → INSERT missions/notes/tasks/distillations/handoffs
      # 3. Walk runs.json → INSERT runs (cap to MAX_RUNS or roll older entries
      #    into a partition)
      # 4. Walk failure_memory.json → INSERT failure_records
      # 5. Smoke read-back parity vs JSON
  ```

- A real DB-backed `SpineStore` / `RunStore` / `FailureMemoryStore`
  implementation. Each store currently uses
  `persistence.atomic_write_text_async`; the Postgres version uses
  `INSERT ... ON CONFLICT` for spine + tasks + missions, and append-
  only `INSERT` for runs + failures.

## Why we didn't do this in Wave O

Honest scope. A clean Postgres migration needs:

- A real database to test against (Railway can provision one, but
  the smoke loop needs SIGNAL_DATABASE_URL set in CI).
- A two-week dual-write period where every write hits both JSON and
  Postgres so we can detect drift before flipping read traffic.
- Backfill + verification scripts.

Wave O ships the schema now so the migration script (a follow-up
wave) doesn't have to invent it under pressure. Schema is the slow
decision; the rest is mechanical.

## After this lands

1. Provision a Postgres add-on in Railway.
2. Set `SIGNAL_DATABASE_URL` in env.
3. Add the migrate-to-postgres script + dual-write toggle in
   `config.py` (`SIGNAL_PERSISTENCE=postgres|json|both`).
4. Run dual-write for two weeks.
5. Flip read traffic to Postgres.
6. Delete JSON code paths.
