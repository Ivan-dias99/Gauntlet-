"""
Signal — Configuration
All environment-driven settings. No hardcoded secrets.

All env vars are SIGNAL_*. The Ruberra-era names were removed in this
wave; deploys must rename their environment variables before upgrading.
"""

import os
from pathlib import Path


# ── API ─────────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY: str = os.environ.get("ANTHROPIC_API_KEY", "")

# Offline mock mode — bypasses every Anthropic API call with canned responses.
# Enable for end-to-end validation without an API key.
SIGNAL_MOCK: bool = os.environ.get("SIGNAL_MOCK", "").strip().lower() in (
    "1", "true", "yes", "on",
)

# ── Model ───────────────────────────────────────────────────────────────────
# Claude Sonnet 4.6 for self-consistency triad + judge + agent loop + Surface.
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
SERVER_HOST: str = os.environ.get("SIGNAL_HOST", "127.0.0.1")
SERVER_PORT: int = int(
    os.environ.get("PORT") or os.environ.get("SIGNAL_PORT", "8080")
)

# SIGNAL_ORIGIN accepts a single origin or a comma-separated list, so one
# backend can serve production, preview deploys, and local dev at once.
_raw_origins = os.environ.get("SIGNAL_ORIGIN", "http://localhost:5173")
ALLOWED_ORIGINS: list[str] = [
    o.strip() for o in _raw_origins.split(",") if o.strip()
]
ALLOWED_ORIGIN: str = ALLOWED_ORIGINS[0] if ALLOWED_ORIGINS else "http://localhost:5173"

# ── Persistence ─────────────────────────────────────────────────────────────
# Persistent state (failure memory, run log, spine snapshot) is written here.
# In prod this MUST point at a mounted volume (e.g. Railway volume at /data).
# Container filesystems are ephemeral — if this is left at the default, every
# restart/deploy wipes the archive.
_default_data_dir = Path(__file__).parent / "data"
DATA_DIR: Path = Path(os.environ.get("SIGNAL_DATA_DIR", str(_default_data_dir)))

# Legacy alias kept only as the in-process Python identifier some modules
# already imported. New code should use DATA_DIR.
MEMORY_DIR: Path = DATA_DIR

# SQLite database — single file, three tables (runs, spine, failures).
SIGNAL_DB_FILE: Path = DATA_DIR / "signal.db"

# Legacy JSON sidecars. These exist only for one-shot migration on first
# boot of this wave; after the migration runs they are renamed to *.migrated.
LEGACY_RUNS_FILE: Path = DATA_DIR / "runs.json"
LEGACY_SPINE_FILE: Path = DATA_DIR / "spine.json"
LEGACY_FAILURE_MEMORY_FILE: Path = DATA_DIR / "failure_memory.json"

# Compat name for memory.py: same path, single source of truth.
FAILURE_MEMORY_FILE: Path = LEGACY_FAILURE_MEMORY_FILE

# Maximum failure entries to retain (oldest pruned first)
MAX_FAILURE_ENTRIES: int = 500

# How many past failures to inject as context into the system prompt
FAILURE_CONTEXT_WINDOW: int = 10
