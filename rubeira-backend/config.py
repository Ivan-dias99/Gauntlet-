"""
Rubeira V1 — Configuration
All environment-driven settings. No hardcoded secrets.
"""

import os
from pathlib import Path

# ── API ─────────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY: str = os.environ.get("ANTHROPIC_API_KEY", "")

# ── Model ───────────────────────────────────────────────────────────────────
# Claude Sonnet for self-consistency triad
MODEL_ID: str = "claude-sonnet-4-20250514"

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
SERVER_HOST: str = os.environ.get("RUBEIRA_HOST", "127.0.0.1")
SERVER_PORT: int = int(os.environ.get("RUBEIRA_PORT", "3002"))
ALLOWED_ORIGIN: str = os.environ.get("RUBEIRA_ORIGIN", "http://localhost:5173")

# ── Memory ──────────────────────────────────────────────────────────────────
# Failure memory persists to disk
MEMORY_DIR: Path = Path(__file__).parent / "data"
FAILURE_MEMORY_FILE: Path = MEMORY_DIR / "failure_memory.json"

# Maximum failure entries to retain (oldest pruned first)
MAX_FAILURE_ENTRIES: int = 500

# How many past failures to inject as context into the system prompt
FAILURE_CONTEXT_WINDOW: int = 10

# ── Confidence Thresholds ───────────────────────────────────────────────────
# These are semantic similarity thresholds used by the judge.
# The judge itself assigns confidence — these are fallback heuristics.
CONFIDENCE_HIGH_THRESHOLD: float = 0.95
CONFIDENCE_MEDIUM_THRESHOLD: float = 0.70

# ── Paranoia Gates ──────────────────────────────────────────────────────────
# Topics Rubeira refuses to touch regardless of judge verdict.
PROHIBITED_TOPICS: list[str] = [
    "previsão de futuro", "futuro", "vai acontecer", "previsão",
    "conselho médico", "saúde", "doença", "tratamento",
    "opinião sobre pessoa", "fulano", "beltrano", "sicrano",
]

# Default is OFF — turning this on short-circuits the entire pipeline and
# every request is refused. Enable via env: RUBEIRA_ULTRA_PARANOIA=true
ULTRA_PARANOIA_MODE: bool = os.environ.get(
    "RUBEIRA_ULTRA_PARANOIA", "false"
).strip().lower() in ("1", "true", "yes", "on")
