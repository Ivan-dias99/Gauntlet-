"""
Signal — Configuration
All environment-driven settings. No hardcoded secrets.

Env precedence: SIGNAL_* is canonical; RUBERRA_* is read as a silent
legacy fallback so existing Railway / Vercel deploys keep working until
operators flip to the new variable names. The Python constants keep the
legacy identifiers (RUBERRA_MOCK, SERVER_HOST, …) to minimize churn in
server.py; the var name is internal, the env var name is what ships.
"""

import os
from pathlib import Path


def _env(new: str, legacy: str, default: str = "") -> str:
    """Read env var honoring the SIGNAL_* → RUBERRA_* compatibility window."""
    return os.environ.get(new) or os.environ.get(legacy) or default


# ── API ─────────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY: str = os.environ.get("ANTHROPIC_API_KEY", "")

# Offline mock mode — bypasses every Anthropic API call with canned responses.
# Enable for end-to-end validation without an API key.
RUBERRA_MOCK: bool = _env("SIGNAL_MOCK", "RUBERRA_MOCK").strip().lower() in (
    "1", "true", "yes", "on",
)

# ── Model ───────────────────────────────────────────────────────────────────
# Claude Sonnet 4.6 for self-consistency triad + judge + agent loop.
MODEL_ID: str = "claude-sonnet-4-6"

# Low temperature for conservative, deterministic answers
TRIAD_TEMPERATURE: float = 0.15

# Judge uses even lower temperature — it must be maximally deterministic
JUDGE_TEMPERATURE: float = 0.05

# Max tokens per response
MAX_TOKENS: int = 4096

# ── Self-Consistency ────────────────────────────────────────────────────────
# Number of parallel calls for self-consistency
TRIAD_COUNT: int = 3

# ── Server ──────────────────────────────────────────────────────────────────
SERVER_HOST: str = _env("SIGNAL_HOST", "RUBERRA_HOST", "127.0.0.1")
SERVER_PORT: int = int(
    os.environ.get("PORT")
    or _env("SIGNAL_PORT", "RUBERRA_PORT", "8080")
)

# SIGNAL_ORIGIN accepts a single origin or a comma-separated list, so one
# backend can serve production, preview deploys, and local dev at once.
_raw_origins = _env("SIGNAL_ORIGIN", "RUBERRA_ORIGIN", "http://localhost:5173")
ALLOWED_ORIGINS: list[str] = [
    o.strip() for o in _raw_origins.split(",") if o.strip()
]
# Backwards compatibility — existing imports of ALLOWED_ORIGIN keep working.
ALLOWED_ORIGIN: str = ALLOWED_ORIGINS[0] if ALLOWED_ORIGINS else "http://localhost:5173"

# Vercel preview URLs are ephemeral (project-hash-team.vercel.app), so an
# allow-list cannot enumerate them. Operators who want preview deploys to
# pass CORS set SIGNAL_ORIGIN_REGEX to a pattern scoped to their own
# Vercel project, e.g.
#     ^https://aiinterfaceshelldesign-[a-z0-9-]+\.vercel\.app$
# Default is empty (no regex) — paired with allow_credentials=True in
# server.py, defaulting to a broad `*.vercel.app` regex would let any
# Vercel-hosted site make credentialed CORS requests, silently
# broadening previously strict SIGNAL_ORIGIN allow-lists on upgrade.
# server.py only attaches the regex when it is non-empty.
ALLOWED_ORIGIN_REGEX: str = _env(
    "SIGNAL_ORIGIN_REGEX",
    "RUBERRA_ORIGIN_REGEX",
    "",
)

# ── Memory ──────────────────────────────────────────────────────────────────
# Persistent state (failure memory, run log, spine snapshot) is written here.
# In prod this MUST point at a mounted volume (e.g. Railway volume at /data).
# Container filesystems are ephemeral — if this is left at the default, every
# restart/deploy wipes the archive, which silently corrupts doctrine.
_default_memory_dir = Path(__file__).parent / "data"
_data_dir_raw = _env("SIGNAL_DATA_DIR", "RUBERRA_DATA_DIR", str(_default_memory_dir))
MEMORY_DIR: Path = Path(_data_dir_raw)

# True when persistence is writing to the in-image filesystem (wiped on
# every container restart). server.py emits a loud boot warning and
# /health carries this flag so the chip can show "ephemeral" instead of
# "ready".
#
# Detection is path-based rather than env-presence-based: the project's
# Dockerfile sets SIGNAL_DATA_DIR=/data unconditionally, so an env-only
# check misses the common "operator forgot to mount the volume" case
# and silently reports persistence healthy. Treat the path as ephemeral
# when (a) it equals the in-image default, or (b) it points somewhere
# that is not a mountpoint on this filesystem.
def _is_ephemeral_dir(path: Path, default: Path) -> bool:
    try:
        if path.resolve() == default.resolve():
            return True
    except OSError:
        return True
    try:
        # ismount returns False if the path doesn't exist yet — that
        # is also an ephemeral signal (writes will land on the image
        # layer until something mounts there).
        return not path.exists() or not os.path.ismount(path)
    except OSError:
        return True


PERSISTENCE_EPHEMERAL: bool = _is_ephemeral_dir(MEMORY_DIR, _default_memory_dir)

FAILURE_MEMORY_FILE: Path = MEMORY_DIR / "failure_memory.json"

# Maximum failure entries to retain (oldest pruned first)
MAX_FAILURE_ENTRIES: int = 500

# How many past failures to inject as context into the system prompt
FAILURE_CONTEXT_WINDOW: int = 10


# ── Postgres dual-write (Wave O / P-6) ───────────────────────────────────
# Optional Postgres mirror. When SIGNAL_DATABASE_URL is set, the spine
# store mirrors writes to the database alongside the JSON file (read
# path is JSON only; the database is the shadow until parity is proven).
# SIGNAL_DUAL_WRITE_PG must also be truthy — keeping it explicit so
# pointing at a database doesn't auto-enable mirror writes.
DATABASE_URL: str = _env("SIGNAL_DATABASE_URL", "RUBERRA_DATABASE_URL", "")
DUAL_WRITE_PG: bool = (
    bool(DATABASE_URL)
    and _env("SIGNAL_DUAL_WRITE_PG", "RUBERRA_DUAL_WRITE_PG", "").strip().lower()
    in ("1", "true", "yes", "on")
)
# ── GitHub Issues (Wave P-23) ───────────────────────────────────────────────
# When both are set, POST /issues/create posts to the real GitHub REST API.
# When either is missing, /issues/create returns a friendly fallback so the
# chamber can show a copy-paste body instead of throwing 500.
#
# Token: Personal Access Token or fine-grained token with `issues:write` on
# the target repo. Repo is in `owner/repo` form (e.g. ivan-dias99/aiinterfaceshelldesign).
GITHUB_TOKEN: str = _env("SIGNAL_GITHUB_TOKEN", "RUBERRA_GITHUB_TOKEN", "")
GITHUB_REPO: str = _env("SIGNAL_GITHUB_REPO", "RUBERRA_GITHUB_REPO", "")


# ── Vercel API (Wave P-25) ────────────────────────────────────────────────
VERCEL_TOKEN: str = _env("SIGNAL_VERCEL_TOKEN", "RUBERRA_VERCEL_TOKEN", "")
VERCEL_PROJECT_ID: str = _env("SIGNAL_VERCEL_PROJECT_ID", "RUBERRA_VERCEL_PROJECT_ID", "")
VERCEL_TEAM_ID: str = _env("SIGNAL_VERCEL_TEAM_ID", "RUBERRA_VERCEL_TEAM_ID", "")


# ── Railway GraphQL (Wave P-26) ──────────────────────────────────────────
RAILWAY_TOKEN: str = _env("SIGNAL_RAILWAY_TOKEN", "RUBERRA_RAILWAY_TOKEN", "")
RAILWAY_TOKEN_KIND: str = (
    _env("SIGNAL_RAILWAY_TOKEN_KIND", "RUBERRA_RAILWAY_TOKEN_KIND", "account")
    .strip()
    .lower()
    or "account"
)
RAILWAY_PROJECT_ID: str = os.environ.get("SIGNAL_RAILWAY_PROJECT_ID", "")
RAILWAY_ENVIRONMENT_ID: str = os.environ.get("SIGNAL_RAILWAY_ENVIRONMENT_ID", "")


# ── Postgres read cutover (Wave P-22) ─────────────────────────────────────
# When SIGNAL_PG_CANONICAL is truthy AND dual-write is enabled, the spine
# store reads from Postgres on boot instead of the JSON file. JSON stays
# warm via the dual-write mirror so a quick rollback (unset the flag) is
# always available without losing data. If the PG read fails (empty,
# error, parse) the store falls back to JSON automatically and surfaces
# the degraded mode via /diagnostics.
PG_CANONICAL: bool = (
    DUAL_WRITE_PG
    and _env("SIGNAL_PG_CANONICAL", "RUBERRA_PG_CANONICAL", "").strip().lower()
    in ("1", "true", "yes", "on")
)
