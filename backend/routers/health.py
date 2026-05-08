"""Health + readiness probes + full diagnostics."""

from __future__ import annotations

import time
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from config import (
    ALLOWED_ORIGIN_REGEX,
    ALLOWED_ORIGINS,
    ANTHROPIC_API_KEY,
    BODY_SIZE_LIMIT_BYTES,
    FRAME_OPTIONS,
    GAUNTLET_API_KEY,
    GAUNTLET_MOCK,
    GEMINI_API_KEY,
    GEMINI_MODEL,
    GROQ_API_KEY,
    GROQ_MODEL,
    LOG_REDACT,
    MEMORY_DIR,
    PERSISTENCE_EPHEMERAL,
    RATE_LIMIT_DISABLED,
    SECURITY_CSP,
    SECURITY_HSTS,
    SERVER_HOST,
    SERVER_PORT,
    TRUST_PROXY,
)
from runtime import collect_load_errors, get_engine_optional

router = APIRouter()

# Process boot timestamps for /diagnostics. Captured at import so they
# reflect the server.py boot, not the moment a probe lands.
_PROCESS_START_MONO = time.monotonic()
_PROCESS_START_ISO = datetime.now(timezone.utc).isoformat()


@router.get("/health")
async def health_check():
    """
    Liveness probe. Always returns 200 as long as the HTTP layer is up —
    Railway / Vercel need a stable yes/no to keep routing traffic, and
    flipping this to 5xx on a degraded engine would trigger a
    crash-restart loop that never resolves.

    The body carries the real signal: engine readiness, run mode
    (mock vs real), and whether any store booted on a quarantined
    sidecar. Callers that need a hard yes/no for degraded state must
    use `/health/ready`.
    """
    engine = get_engine_optional()
    return {
        "status": "operational",
        "system": "Gauntlet",
        "doctrine": "active",
        "engine": "ready" if engine else "not_initialized",
        "mode": "mock" if GAUNTLET_MOCK else "real",
        "persistence_degraded": bool(collect_load_errors()),
        "persistence_ephemeral": PERSISTENCE_EPHEMERAL,
    }


@router.get("/health/ready")
async def health_ready():
    """
    Readiness probe. Returns 503 if the system is degraded in any way
    that would make its answers untrustworthy — engine uninitialised,
    running in mock mode, or a store booted on a quarantined file.

    Never flipped to the Railway healthcheck path: `/health` keeps the
    deploy alive; `/health/ready` is the honest yes/no for clients and
    operators.
    """
    engine = get_engine_optional()
    load_errors = collect_load_errors()
    reasons: list[str] = []
    if not engine:
        reasons.append("engine_not_initialized")
    if GAUNTLET_MOCK:
        reasons.append("mock_mode")
    if load_errors:
        reasons.append("persistence_degraded")
    if PERSISTENCE_EPHEMERAL:
        reasons.append("persistence_ephemeral")

    body = {
        "ready": not reasons,
        "reasons": reasons,
        "engine": "ready" if engine else "not_initialized",
        "mode": "mock" if GAUNTLET_MOCK else "real",
        "load_errors": load_errors,
        "persistence_ephemeral": PERSISTENCE_EPHEMERAL,
    }
    if reasons:
        raise HTTPException(status_code=503, detail=body)
    return body


@router.get("/diagnostics")
async def diagnostics():
    """Full system diagnostics."""
    from composer_settings import settings_store
    from config import JUDGE_TEMPERATURE, MODEL_ID, TRIAD_COUNT, TRIAD_TEMPERATURE
    from memory import failure_memory
    from memory_records import memory_records_store
    from runs import run_store
    from spine import spine_store

    engine = get_engine_optional()

    mem_stats = await failure_memory.get_stats()
    # Sprint 8 — surface the Sprint 4/7 stores' load + save error state
    # so operators can see at a glance whether a deploy lost durability.
    memory_records_stats = await memory_records_store.stats()

    # Honest boot signal: how the process was configured, not how the
    # operator intended it. Mock-mode and missing API key are the two
    # most common reasons the deployed brain silently returns canned
    # answers — both are surfaced here without exposing the key itself.
    boot = {
        "start_iso": _PROCESS_START_ISO,
        "uptime_seconds": int(time.monotonic() - _PROCESS_START_MONO),
        "mode": "mock" if GAUNTLET_MOCK else "real",
        "anthropic_api_key_present": bool(ANTHROPIC_API_KEY),
        "groq_api_key_present": bool(GROQ_API_KEY),
        "gemini_api_key_present": bool(GEMINI_API_KEY),
        "active_provider": (
            "mock" if GAUNTLET_MOCK
            else "anthropic" if ANTHROPIC_API_KEY
            else "groq" if GROQ_API_KEY
            else "gemini" if GEMINI_API_KEY
            else "none"
        ),
        "groq_model": (
            GROQ_MODEL if GROQ_API_KEY and not ANTHROPIC_API_KEY else None
        ),
        "gemini_model": (
            GEMINI_MODEL
            if GEMINI_API_KEY and not ANTHROPIC_API_KEY and not GROQ_API_KEY
            else None
        ),
        "data_dir": str(MEMORY_DIR),
        "persistence_ephemeral": PERSISTENCE_EPHEMERAL,
        "allowed_origins": ALLOWED_ORIGINS,
        "allowed_origin_regex": ALLOWED_ORIGIN_REGEX,
        "host": SERVER_HOST,
        "port": SERVER_PORT,
    }

    # Wave P-31 — visibility on which security layers are ACTIVE on this
    # process. Operators auditing a deploy need a single place to see
    # whether the auth gate is on, whether HSTS is being stamped, etc.
    # We never reveal the API key value — only the boolean.
    security = {
        "auth_required": bool(GAUNTLET_API_KEY),
        "rate_limit_enabled": not RATE_LIMIT_DISABLED,
        "trust_proxy": TRUST_PROXY,
        "hsts": SECURITY_HSTS,
        "frame_options": FRAME_OPTIONS,
        "csp_overridden": bool(SECURITY_CSP),
        "body_size_limit_bytes": BODY_SIZE_LIMIT_BYTES,
        "log_redaction": LOG_REDACT,
    }

    return {
        "system": "Gauntlet",
        "model": MODEL_ID,
        "triad_temperature": TRIAD_TEMPERATURE,
        "judge_temperature": JUDGE_TEMPERATURE,
        "triad_count": TRIAD_COUNT,
        "engine_status": "ready" if engine else "not_initialized",
        "boot": boot,
        "security": security,
        "failure_memory": mem_stats,
        "persistence": {
            "spine_last_save_error": spine_store._last_save_error,
            "spine_last_load_error": spine_store._last_load_error,
            "runs_last_save_error": run_store._last_save_error,
            "runs_last_load_error": run_store._last_load_error,
            "memory_last_save_error": failure_memory._last_save_error,
            "memory_last_load_error": failure_memory._last_load_error,
            "composer_settings_last_save_error": settings_store.last_save_error,
            "composer_settings_last_load_error": settings_store.last_load_error,
            "memory_records_last_save_error": memory_records_store._last_save_error,
            "memory_records_last_load_error": memory_records_store._last_load_error,
        },
        "memory_records": memory_records_stats,
        "doctrine": "Conservative Intelligence — prefer refusal over error",
    }
