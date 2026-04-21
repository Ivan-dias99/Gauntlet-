"""
Ruberra — Configuration
All environment-driven settings. No hardcoded secrets.
"""

import os
from pathlib import Path

# ── API ─────────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY: str = os.environ.get("ANTHROPIC_API_KEY", "")

# Offline mock mode — bypasses every Anthropic API call with canned responses.
# Enable for end-to-end validation without an API key.
RUBERRA_MOCK: bool = os.environ.get("RUBERRA_MOCK", "").strip().lower() in (
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
SERVER_HOST: str = os.environ.get("RUBERRA_HOST", "127.0.0.1")
SERVER_PORT: int = int(os.environ.get("RUBERRA_PORT", "3002"))

# RUBERRA_ORIGIN accepts a single origin or a comma-separated list, so one
# backend can serve production, preview deploys, and local dev at once.
_raw_origins = os.environ.get("RUBERRA_ORIGIN", "http://localhost:5173")
ALLOWED_ORIGINS: list[str] = [
    o.strip() for o in _raw_origins.split(",") if o.strip()
]
# Backwards compatibility — existing imports of ALLOWED_ORIGIN keep working.
ALLOWED_ORIGIN: str = ALLOWED_ORIGINS[0] if ALLOWED_ORIGINS else "http://localhost:5173"

# ── Memory ──────────────────────────────────────────────────────────────────
# Persistent state (failure memory, run log, spine snapshot) is written here.
# In prod this MUST point at a mounted volume (e.g. Railway volume at /data).
# Container filesystems are ephemeral — if this is left at the default, every
# restart/deploy wipes the archive, which silently corrupts doctrine.
_default_memory_dir = Path(__file__).parent / "data"
MEMORY_DIR: Path = Path(os.environ.get("RUBERRA_DATA_DIR", str(_default_memory_dir)))
FAILURE_MEMORY_FILE: Path = MEMORY_DIR / "failure_memory.json"

# Maximum failure entries to retain (oldest pruned first)
MAX_FAILURE_ENTRIES: int = 500

# How many past failures to inject as context into the system prompt
FAILURE_CONTEXT_WINDOW: int = 10

