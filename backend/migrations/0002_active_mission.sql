-- Wave P-22 round 6 — persist activeMissionId in Postgres.
--
-- Before this column, `read_spine_snapshot` always emitted
-- `activeMissionId: null` because the schema had no place to store it.
-- After PG_CANONICAL=1, every reload would erase the operator's active
-- selection and the next PUT would push that null back.
--
-- Add a boolean flag to missions so the snapshot reader can identify
-- the active row. We deliberately do NOT add a unique partial index
-- on (is_active) WHERE is_active — that would race against the
-- per-mission UPSERT loop in `write_spine_snapshot` (two rows can
-- briefly carry the flag mid-loop). Reader uses LIMIT 1 to be safe.

ALTER TABLE missions
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_missions_active
    ON missions (is_active)
    WHERE is_active;
