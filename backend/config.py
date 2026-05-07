"""
Gauntlet — Configuration
All environment-driven settings. No hardcoded secrets.

Env: GAUNTLET_* is canonical. (Legacy SIGNAL_* / RUBERRA_* fallbacks
were dropped at v1.0.0-rc.1 — reflash your env vars before upgrading.)
"""

import os
from pathlib import Path


def _env(canonical: str, *_legacy: str, default: str = "") -> str:
    """Read a canonical GAUNTLET_* env var. Extra positional args were
    legacy aliases (SIGNAL_*, RUBERRA_*) and are now ignored — kept in
    the signature so existing call sites compile until they are tidied."""
    value = os.environ.get(canonical)
    if value:
        return value
    return default


# ── API ─────────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY: str = os.environ.get("ANTHROPIC_API_KEY", "")

# Gemini (optional free-tier fallback). Used when ANTHROPIC_API_KEY is empty
# and GEMINI_API_KEY is set. gemini_provider.AsyncGeminiAnthropicAdapter
# wraps the google-genai SDK in an Anthropic-compatible shape so engine.py
# / agent.py do not need provider branching. Default free model:
# gemini-2.5-flash (AI Studio free tier: 15 RPM / 1500 RPD as of 2025).
GEMINI_API_KEY: str = (
    os.environ.get("GAUNTLET_GEMINI_API_KEY")
    or os.environ.get("GEMINI_API_KEY")
    or os.environ.get("GOOGLE_API_KEY")
    or ""
)
GEMINI_MODEL: str = (
    os.environ.get("GAUNTLET_GEMINI_MODEL")
    or os.environ.get("GEMINI_MODEL")
    or "gemini-2.5-flash"
)

# Groq (optional free-tier fallback). Used when ANTHROPIC_API_KEY is empty
# and GAUNTLET_GROQ_API_KEY is set. groq_provider.AsyncGroqAnthropicAdapter
# wraps the groq SDK in an Anthropic-compatible shape so engine.py does not
# need provider branching. Free-tier default model: llama-3.3-70b-versatile
# (Groq free tier as of 2025 — generous RPM, very high throughput).
# Selected ahead of Gemini in the engine init chain because the free tier
# limits are typically less restrictive for chat workloads.
GROQ_API_KEY: str = (
    os.environ.get("GAUNTLET_GROQ_API_KEY")
    or os.environ.get("GROQ_API_KEY")
    or ""
)
GROQ_MODEL: str = (
    os.environ.get("GAUNTLET_GROQ_MODEL")
    or os.environ.get("GROQ_MODEL")
    or "llama-3.3-70b-versatile"
)

# Offline mock mode — bypasses every provider API call with canned responses.
# Enable for end-to-end validation without an API key.
RUBERRA_MOCK: bool = _env("GAUNTLET_MOCK").strip().lower() in (
    "1", "true", "yes", "on",
)

# ── Model ───────────────────────────────────────────────────────────────────
MODEL_ID: str = "claude-sonnet-4-6"
TRIAD_TEMPERATURE: float = 0.15
JUDGE_TEMPERATURE: float = 0.05
MAX_TOKENS: int = 4096

# ── Self-Consistency ────────────────────────────────────────────────────────
TRIAD_COUNT: int = 3

# ── Server ──────────────────────────────────────────────────────────────────
SERVER_HOST: str = _env("GAUNTLET_HOST", default="127.0.0.1")
SERVER_PORT: int = int(
    os.environ.get("PORT")
    or _env("GAUNTLET_PORT", default="8080")
)

# GAUNTLET_ORIGIN accepts a single origin or a comma-separated list, so one
# backend can serve production, preview deploys, and local dev at once.
_raw_origins = _env("GAUNTLET_ORIGIN", default="http://localhost:5173")
ALLOWED_ORIGINS: list[str] = [
    o.strip() for o in _raw_origins.split(",") if o.strip()
]
ALLOWED_ORIGIN: str = ALLOWED_ORIGINS[0] if ALLOWED_ORIGINS else "http://localhost:5173"

# Vercel preview URLs are ephemeral, so an allow-list cannot enumerate them.
# Operators who want preview deploys to pass CORS set GAUNTLET_ORIGIN_REGEX
# to a pattern scoped to their own Vercel project.
ALLOWED_ORIGIN_REGEX: str = _env("GAUNTLET_ORIGIN_REGEX", default="")

# ── Memory ──────────────────────────────────────────────────────────────────
# Persistent state (failure memory, run log, spine snapshot) is written here.
# In prod this MUST point at a mounted volume.
_default_memory_dir = Path(__file__).parent / "data"
_data_dir_raw = _env("GAUNTLET_DATA_DIR", default=str(_default_memory_dir))
MEMORY_DIR: Path = Path(_data_dir_raw)


def _is_ephemeral_dir(path: Path, default: Path) -> bool:
    try:
        if path.resolve() == default.resolve():
            return True
    except OSError:
        return True
    try:
        return not path.exists() or not os.path.ismount(path)
    except OSError:
        return True


PERSISTENCE_EPHEMERAL: bool = _is_ephemeral_dir(MEMORY_DIR, _default_memory_dir)

FAILURE_MEMORY_FILE: Path = MEMORY_DIR / "failure_memory.json"
MAX_FAILURE_ENTRIES: int = 500
FAILURE_CONTEXT_WINDOW: int = 10

# Sprint 4 — Composer settings (governance lock). Single JSON document
# storing per-domain / per-action policies, context caps, and the
# execution-reporting requirement. Cápsula reads at boot, Control Center
# edits via /composer/settings.
COMPOSER_SETTINGS_FILE: Path = MEMORY_DIR / "composer_settings.json"

# Sprint 7 — Memory / Canon Lock. Operator-callable memory store with
# user / project scopes and 5 kinds (note, decision, failure_pattern,
# preference, canon). The composer pipeline injects relevant prior
# records into model context on every preview/dom_plan call. Distinct
# from failure_memory (which records consensus failures).
MEMORY_RECORDS_FILE: Path = MEMORY_DIR / "memory_records.json"
MAX_MEMORY_RECORDS: int = 2000

# Kill-switch for the prior_failure feedback loop. When false, the engine
# skips the memory lookup and never records new failures, so the triad runs
# without reinforced caution and the judge stops refusing on prior_failure.
# Defaulted off because the lookup was over-generalising and blocking
# trivial questions; flip GAUNTLET_FAILURE_MEMORY=1 to re-enable.
FAILURE_MEMORY_ENABLED: bool = _env(
    "GAUNTLET_FAILURE_MEMORY", default=""
).strip().lower() in ("1", "true", "yes", "on")

# Kill-switch for the triad + judge consensus layer. When false the engine
# fires a single LLM call and returns the answer directly — no
# self-consistency vote, no judge verdict, no refusal-on-divergence.
# Defaulted off because the consensus layer was rejecting trivial chat
# turns ("inconsistency", "judge_rejection") and blocking free
# conversation with the model. Flip GAUNTLET_JUDGE=1 to re-enable the
# original triad+judge pipeline once we have a better consensus design.
JUDGE_ENABLED: bool = _env(
    "GAUNTLET_JUDGE", default=""
).strip().lower() in ("1", "true", "yes", "on")


# ── Postgres dual-write ───────────────────────────────────────────────────
DATABASE_URL: str = _env("GAUNTLET_DATABASE_URL", default="")
DUAL_WRITE_PG: bool = (
    bool(DATABASE_URL)
    and _env("GAUNTLET_DUAL_WRITE_PG", default="").strip().lower()
    in ("1", "true", "yes", "on")
)

# ── Postgres read cutover ─────────────────────────────────────────────────
PG_CANONICAL: bool = (
    DUAL_WRITE_PG
    and _env("GAUNTLET_PG_CANONICAL", default="").strip().lower()
    in ("1", "true", "yes", "on")
)


# ── Security: defense-in-depth ────────────────────────────────────────────


def _truthy(value: str) -> bool:
    return value.strip().lower() in ("1", "true", "yes", "on")


# Layer 1 — API key gate. When set, every endpoint except /health,
# /health/ready and CORS preflight requires `Authorization: Bearer <key>`.
SIGNAL_API_KEY: str = _env("GAUNTLET_API_KEY", default="")

# Layer 2 — rate limiter.
RATE_LIMIT_DISABLED: bool = _truthy(_env("GAUNTLET_RATE_LIMIT_DISABLED", default=""))
TRUST_PROXY: bool = _truthy(_env("GAUNTLET_TRUST_PROXY", default=""))

# Layer 3 — security headers.
SECURITY_HSTS: bool = _truthy(_env("GAUNTLET_HSTS", default=""))
FRAME_OPTIONS: str = _env("GAUNTLET_FRAME_OPTIONS", default="DENY") or "DENY"
SECURITY_CSP: str = _env("GAUNTLET_CSP", default="")

# Layer 4 — global request body cap (bytes). Default 1 MiB.
BODY_SIZE_LIMIT_BYTES: int = int(
    _env("GAUNTLET_MAX_BODY_BYTES", default=str(1 * 1024 * 1024))
    or (1 * 1024 * 1024)
)

# Layer 5 — log redaction is always installed by default.
LOG_REDACT: bool = (
    _env("GAUNTLET_LOG_REDACT", default="1").strip().lower()
    not in ("0", "false", "no", "off")
)
