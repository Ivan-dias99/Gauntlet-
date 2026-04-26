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
# allow-list cannot enumerate them. Default regex auto-accepts any *.vercel.app
# subdomain, eliminating the manual SIGNAL_ORIGIN edit on every preview deploy.
# Operators who need stricter scoping override SIGNAL_ORIGIN_REGEX with their
# own pattern. To neutralize the regex entirely, set it to a pattern that
# matches nothing (e.g. "^$") — empty-string is treated as unset and falls
# back to the default, by `_env()` semantics.
ALLOWED_ORIGIN_REGEX: str = _env(
    "SIGNAL_ORIGIN_REGEX",
    "RUBERRA_ORIGIN_REGEX",
    r"^https://[a-z0-9-]+\.vercel\.app$",
)

# ── Memory ──────────────────────────────────────────────────────────────────
# Persistent state (failure memory, run log, spine snapshot) is written here.
# In prod this MUST point at a mounted volume (e.g. Railway volume at /data).
# Container filesystems are ephemeral — if this is left at the default, every
# restart/deploy wipes the archive, which silently corrupts doctrine.
_default_memory_dir = Path(__file__).parent / "data"
_data_dir_raw = _env("SIGNAL_DATA_DIR", "RUBERRA_DATA_DIR", str(_default_memory_dir))
MEMORY_DIR: Path = Path(_data_dir_raw)

# True when the operator did not explicitly set SIGNAL_DATA_DIR / RUBERRA_DATA_DIR,
# meaning persistence is writing to the in-image default and will be wiped on
# every container restart. server.py emits a loud boot warning and /health
# carries this flag so the chip can show "ephemeral" instead of "ready".
PERSISTENCE_EPHEMERAL: bool = (
    not os.environ.get("SIGNAL_DATA_DIR")
    and not os.environ.get("RUBERRA_DATA_DIR")
)

FAILURE_MEMORY_FILE: Path = MEMORY_DIR / "failure_memory.json"

# Maximum failure entries to retain (oldest pruned first)
MAX_FAILURE_ENTRIES: int = 500

# How many past failures to inject as context into the system prompt
FAILURE_CONTEXT_WINDOW: int = 10
