"""
Gauntlet — Runtime accessors shared across HTTP routers.

The lifespan hook in server.py constructs the Engine and stores it via
``set_engine``. Every router that needs the engine reads it through
``get_engine_optional`` (returns ``None`` when not yet ready) or
``require_engine`` (raises a typed 503 envelope). Going through this
module instead of a top-level mutable in server.py keeps the routers
free of circular imports.

Also home to a couple of error-envelope helpers that the audit
flagged as duplicated across routes.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import HTTPException

if TYPE_CHECKING:
    from engine import Engine

_engine: "Engine | None" = None


def set_engine(engine: "Engine | None") -> None:
    """Lifespan-only setter. Routers must not call this."""
    global _engine
    _engine = engine


def get_engine_optional() -> "Engine | None":
    """Read accessor — None when the engine hasn't booted yet."""
    return _engine


def require_engine() -> "Engine":
    """Read accessor that raises a typed 503 when the engine is missing.

    Routes that cannot run without the engine (``/ask``, ``/route``,
    ``/dev``, …) should call this; routes that only report status
    (``/health``, ``/diagnostics``) should use ``get_engine_optional``.
    """
    if _engine is None:
        raise HTTPException(status_code=503, detail=engine_unavailable_envelope())
    return _engine


# ── Error envelope helpers ─────────────────────────────────────────────────

def error_envelope(kind: str, exc: BaseException) -> dict:
    """Typed error body — `{error, reason, message}`. One shape across
    all endpoints so the cápsula can render any failure consistently."""
    return {
        "error": kind,
        "reason": type(exc).__name__,
        "message": str(exc),
    }


def engine_unavailable_envelope() -> dict:
    """Typed body for the pre-call readiness gate — same shape as
    ``/health/ready`` reasons."""
    return {
        "error": "engine_not_initialized",
        "reason": "EngineNotInitialized",
        "message": "Engine not initialized",
    }


def collect_load_errors() -> list[dict]:
    """Per-store load errors as visible to ``/health`` and ``/diagnostics``."""
    # Imports inside the function so the module loads even if a sidecar
    # fails — runtime.py must stay importable for the lifespan to set
    # the engine and for routes to surface the error themselves.
    from memory import failure_memory
    from runs import run_store
    from spine import spine_store

    out: list[dict] = []
    for name, store_attr in (
        ("spine", spine_store._last_load_error),
        ("runs", run_store._last_load_error),
        ("memory", failure_memory._last_load_error),
    ):
        if store_attr:
            out.append({"store": name, "error": store_attr})
    return out
