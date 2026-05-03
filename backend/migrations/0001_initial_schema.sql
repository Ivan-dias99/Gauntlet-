-- Signal — initial Postgres schema (Wave O).
--
-- The current backend persists everything as three JSON files on a
-- volume (spine.json, runs.json, failure_memory.json). This is
-- documented as the gargalo in ops/CONNECTORS.md §5: a single
-- backend process can write safely, but multi-instance Railway
-- service would corrupt the JSON, and runs.json caps at 2000 entries.
--
-- This migration is the v1 destination schema. It mirrors the
-- pydantic models in models.py so a future migration script can
-- iterate over the JSON, INSERT into these tables, and switch the
-- stores to use Postgres without changing the chamber contract.
--
-- Status: schema only. Migration script is a follow-up; the
-- bootstrap of an actual Postgres connection (asyncpg / SQLAlchemy)
-- is a follow-up.

-- ── Missions ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS missions (
    id              TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    chamber         TEXT NOT NULL,             -- insight|surface|terminal|archive|core
    status          TEXT NOT NULL DEFAULT 'active', -- active|paused|brainstorm|archived|completed
    created_at      BIGINT NOT NULL,
    updated_at      BIGINT NOT NULL DEFAULT 0,
    -- Wave 6a — auto-derived ProjectContract carried as JSONB so we
    -- don't need to flatten its 11+ fields into columns.
    project_contract JSONB,
    last_artifact   JSONB
);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions (status);
CREATE INDEX IF NOT EXISTS idx_missions_chamber ON missions (chamber);


-- ── Notes ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notes (
    id          TEXT PRIMARY KEY,
    mission_id  TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    text        TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'user',  -- user|ai
    created_at  BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notes_mission_created ON notes (mission_id, created_at DESC);


-- ── Tasks ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tasks (
    id              TEXT PRIMARY KEY,
    mission_id      TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    state           TEXT NOT NULL DEFAULT 'open',   -- open|running|done|blocked
    source          TEXT NOT NULL DEFAULT 'manual', -- manual|lab|crew|other
    created_at      BIGINT NOT NULL,
    done_at         BIGINT,
    -- Codex review: TaskRecord.lastUpdateAt is optional in models.py for
    -- backward compat with pre-Wave-6a snapshots. Allow NULL here so a
    -- mechanical JSON→SQL backfill never has to synthesize a value just
    -- to satisfy the column.
    last_update_at  BIGINT,
    artifact_id     TEXT
);
CREATE INDEX IF NOT EXISTS idx_tasks_mission_state ON tasks (mission_id, state);


-- ── Mission artifact ledger (Codex review) ───────────────────────────────
-- MissionRecord.artifacts is the full accept history (newest first,
-- capped at ARTIFACT_LEDGER_CAP=12 in store.ts). Without this table the
-- Postgres cutover would drop everything except missions.last_artifact
-- and the Archive/Terminal histories collapse to a single row per
-- mission. JSONB body keeps Artifact's loose shape (taskTitle,
-- terminationReason, gates, …) without coupling to the model class.
CREATE TABLE IF NOT EXISTS mission_artifacts (
    id              TEXT PRIMARY KEY,
    mission_id      TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    task_id         TEXT,
    accepted_at     BIGINT NOT NULL,
    body            JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mission_artifacts_mission_accepted
    ON mission_artifacts (mission_id, accepted_at DESC);


-- ── Mission event timeline (Codex review) ────────────────────────────────
-- MissionRecord.events backs the chamber's timeline UI (mission_created,
-- note_added, task_state, artifact_accepted, doctrine_added, …). Same
-- reasoning as mission_artifacts: dropping it loses the audit trail.
CREATE TABLE IF NOT EXISTS mission_events (
    id              TEXT PRIMARY KEY,
    mission_id      TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    type            TEXT NOT NULL,
    label           TEXT NOT NULL,
    at              BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mission_events_mission_at
    ON mission_events (mission_id, at DESC);


-- ── Truth Distillations (Wave 6a) ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS truth_distillations (
    id                  TEXT PRIMARY KEY,
    mission_id          TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    version             INTEGER NOT NULL,
    status              TEXT NOT NULL DEFAULT 'draft', -- ArtifactStatus enum
    summary             TEXT NOT NULL,
    validated_direction TEXT NOT NULL,
    -- Free-form arrays carried as JSONB for query flexibility.
    core_decisions      JSONB NOT NULL DEFAULT '[]'::jsonb,
    unknowns            JSONB NOT NULL DEFAULT '[]'::jsonb,
    risks               JSONB NOT NULL DEFAULT '[]'::jsonb,
    surface_seed        JSONB,
    terminal_seed       JSONB,
    confidence          TEXT NOT NULL DEFAULT 'medium',
    supersedes_version  INTEGER,
    stale_since         BIGINT,
    stale_reason        TEXT,
    failure_state       TEXT,
    created_at          BIGINT NOT NULL,
    updated_at          BIGINT NOT NULL,
    UNIQUE (mission_id, version)
);
CREATE INDEX IF NOT EXISTS idx_distillations_mission_status ON truth_distillations (mission_id, status);


-- ── Handoffs (Wave D) ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS handoffs (
    id              TEXT PRIMARY KEY,
    mission_id      TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    from_chamber    TEXT NOT NULL,
    to_chamber      TEXT NOT NULL,
    artifact_type   TEXT NOT NULL,  -- project_contract|truth_distillation|build_specification|delivery_ledger|note
    artifact_ref    TEXT,
    summary         TEXT NOT NULL,
    risks           JSONB NOT NULL DEFAULT '[]'::jsonb,
    next_action     TEXT NOT NULL DEFAULT '',
    status          TEXT NOT NULL DEFAULT 'pending', -- pending|consumed|rejected|deferred
    created_at      BIGINT NOT NULL,
    resolved_at     BIGINT,
    resolution      TEXT
);
CREATE INDEX IF NOT EXISTS idx_handoffs_mission_status ON handoffs (mission_id, status);
CREATE INDEX IF NOT EXISTS idx_handoffs_to_chamber ON handoffs (to_chamber, status);


-- ── Run log ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS runs (
    id                  TEXT PRIMARY KEY,
    timestamp           TEXT NOT NULL,         -- ISO8601 string for fast lex sort
    route               TEXT NOT NULL,         -- agent|triad|crew|surface|distill|telemetry:*
    mission_id          TEXT REFERENCES missions(id) ON DELETE SET NULL,
    question            TEXT NOT NULL,
    context             TEXT,
    answer              TEXT,
    refused             BOOLEAN NOT NULL DEFAULT FALSE,
    confidence          TEXT,
    judge_reasoning     TEXT,
    iterations          INTEGER,
    tool_calls          JSONB NOT NULL DEFAULT '[]'::jsonb,
    processing_time_ms  INTEGER NOT NULL DEFAULT 0,
    input_tokens        INTEGER NOT NULL DEFAULT 0,
    output_tokens       INTEGER NOT NULL DEFAULT 0,
    terminated_early    BOOLEAN NOT NULL DEFAULT FALSE,
    termination_reason  TEXT
);
-- Hot read paths: filter by mission, sort by time.
CREATE INDEX IF NOT EXISTS idx_runs_mission_timestamp ON runs (mission_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_runs_route_timestamp ON runs (route, timestamp DESC);


-- ── Failure memory ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS failure_records (
    id                          TEXT PRIMARY KEY,
    timestamp                   TEXT NOT NULL,
    question                    TEXT NOT NULL,
    question_fingerprint        TEXT NOT NULL,
    failure_type                TEXT NOT NULL, -- RefusalReason enum
    triad_divergence_summary    TEXT NOT NULL DEFAULT '',
    judge_reasoning             TEXT NOT NULL DEFAULT '',
    times_failed                INTEGER NOT NULL DEFAULT 1
);
-- Fast similarity matching by fingerprint; fast count of "top offenders".
CREATE INDEX IF NOT EXISTS idx_failures_fingerprint ON failure_records (question_fingerprint);
CREATE INDEX IF NOT EXISTS idx_failures_times_failed ON failure_records (times_failed DESC);


-- ── Principles (global, not per-mission) ──────────────────────────────────

CREATE TABLE IF NOT EXISTS principles (
    id          TEXT PRIMARY KEY,
    text        TEXT NOT NULL,
    created_at  BIGINT NOT NULL
);


-- ── Telemetry events (Wave 6a + Wave I roll-up) ───────────────────────────

CREATE TABLE IF NOT EXISTS telemetry_events (
    id          TEXT PRIMARY KEY,
    event       TEXT NOT NULL,                  -- truth_distillation_accepted, etc.
    mission_id  TEXT REFERENCES missions(id) ON DELETE SET NULL,
    payload     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_telemetry_event_time ON telemetry_events (event, created_at DESC);
