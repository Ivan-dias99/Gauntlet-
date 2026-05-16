"""
Gauntlet — FastAPI Server
HTTP interface for the Gauntlet backend (the maestro).

This module owns the application object, middleware pipeline and
lifespan. The route definitions themselves live under ``backend/routers/``,
one module per domain. New routes go into the matching router (or a new
one) — never back into this file.

Endpoint domains (one router each):
  health         — /health, /health/ready, /diagnostics
  ask            — /ask, /ask/batch, /route, /route/stream
  agent          — /dev, /dev/stream
  runs           — /runs, /runs/stats, /runs/{id}, /ledger/clear
  memory         — /memory/{stats,failures,clear,forget_all,records,recover}
  spine          — /spine
  tools          — /tools/manifests
  git            — /git/status
  permissions    — /permissions/revoke_all
  observability  — /telemetry/event, /observability/snapshot, /gateway/summary
  composer       — /composer/* (composer.py)
  voice          — /voice/* (voice.py)
"""

from __future__ import annotations

import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

import runtime
from auth import APIKeyAuthMiddleware
from composer import router as composer_router
from config import (
    ALLOWED_ORIGIN_REGEX,
    ALLOWED_ORIGINS,
    ANTHROPIC_API_KEY,
    BODY_SIZE_LIMIT_BYTES,
    FRAME_OPTIONS,
    GAUNTLET_API_KEY,
    GAUNTLET_AUTH_DISABLED,
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
from engine import Engine
from log_redaction import install_redaction
from rate_limit import RateLimitMiddleware
from routers.agent import router as agent_router
from routers.ask import router as ask_router
from routers.git import router as git_router
from routers.health import router as health_router
from routers.memory import router as memory_router
from routers.observability import router as observability_router
from routers.permissions import router as permissions_router
from routers.runs import router as runs_router
from routers.spine import router as spine_router
from routers.tools import router as tools_router
from security_headers import SecurityHeadersMiddleware
from voice import router as voice_router

# ── Logging ─────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("gauntlet.server")


# ── App Lifecycle ───────────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize engine on startup, cleanup on shutdown."""

    # Wave P-31, Layer 5 — log redaction. Installed first so any
    # subsequent boot logs (engine init, missing-key warnings) are
    # already filtered. Default ON; GAUNTLET_LOG_REDACT=0 disables for
    # local debugging of a real false-positive.
    if LOG_REDACT:
        install_redaction(("", "gauntlet", "signal", "uvicorn", "uvicorn.error", "uvicorn.access"))

    if (
        not ANTHROPIC_API_KEY
        and not GROQ_API_KEY
        and not GEMINI_API_KEY
        and not GAUNTLET_MOCK
    ):
        logger.error(
            "═══════════════════════════════════════════════════════════\n"
            "  No provider key found!\n"
            "  Set GAUNTLET_GROQ_API_KEY for Groq (PRIMARY, free tier), or\n"
            "  ANTHROPIC_API_KEY for Anthropic (paused), or\n"
            "  GAUNTLET_GEMINI_API_KEY / GEMINI_API_KEY for Gemini (paused).\n"
            "  Or set GAUNTLET_MOCK=1 for canned responses.\n"
            "═══════════════════════════════════════════════════════════"
        )
        sys.exit(1)
    # Engine precedence (engine.py): MOCK > Groq > Anthropic > Gemini.
    # Banner + warnings must mirror that order — labelling the provider
    # by which key is *set first* would lie when the operator has both
    # ANTHROPIC_API_KEY and GROQ_API_KEY and Groq wins.
    if GROQ_API_KEY and not GAUNTLET_MOCK:
        logger.warning(
            "Running on Groq provider (model=%s). "
            "Streaming SSE supported; tool-use / agent loop is text-only on this path.",
            GROQ_MODEL,
        )
    elif GEMINI_API_KEY and not ANTHROPIC_API_KEY and not GAUNTLET_MOCK:
        logger.warning(
            "Running on Gemini provider (model=%s). "
            "Streaming and tool-use are not supported on this path.",
            GEMINI_MODEL,
        )

    runtime.set_engine(Engine())
    memory_label = "EPHEMERAL (volume not configured)" if PERSISTENCE_EPHEMERAL else "PERSISTENT"
    if GAUNTLET_MOCK:
        _provider_label = "MOCK (canned)"
    elif GROQ_API_KEY:
        _provider_label = f"Groq ({GROQ_MODEL})"
    elif ANTHROPIC_API_KEY:
        _provider_label = "Anthropic Claude"
    else:
        _provider_label = f"Gemini ({GEMINI_MODEL})"
    logger.info(
        "═══════════════════════════════════════════════════════════\n"
        "  Gauntlet — inteligência na ponta do cursor\n"
        f"  Listening: http://{SERVER_HOST}:{SERVER_PORT}\n"
        f"  Provider: {_provider_label}\n"
        f"  CORS Origins: {', '.join(_cors_origins)}\n"
        f"  CORS Regex: {ALLOWED_ORIGIN_REGEX or '(disabled)'}\n"
        f"  Data Dir: {MEMORY_DIR}\n"
        "  Composer routes: /composer/{context, intent, preview, apply}\n"
        "  Doctrine: ACTIVE\n"
        "  Self-Consistency: 3x parallel triad\n"
        "  Judge: IMPLACABLE\n"
        f"  Failure Memory: {memory_label}\n"
        "═══════════════════════════════════════════════════════════"
    )

    if PERSISTENCE_EPHEMERAL and not GAUNTLET_MOCK:
        logger.warning(
            "═══════════════════════════════════════════════════════════\n"
            "  PERSISTENCE EPHEMERAL\n"
            "  GAUNTLET_DATA_DIR is not set. failure_memory.json, runs.json,\n"
            "  and spine.json will be WIPED on every container restart.\n"
            "  Mount a Railway volume and set GAUNTLET_DATA_DIR=/data\n"
            "═══════════════════════════════════════════════════════════"
        )

    yield

    runtime.set_engine(None)
    logger.info("Gauntlet backend shutting down.")


# ── FastAPI App ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="Gauntlet",
    description=(
        "Gauntlet — intelligence at the cursor tip. The browser-extension "
        "capsule (Composer) speaks to this backend (the maestro), which "
        "owns model routing, tools, memory and the conservative doctrine: "
        "prefer refusal over the risk of being wrong."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — production origins come from GAUNTLET_ORIGIN (comma-separated), with
# localhost dev origins always appended so the backend stays usable locally.
# GAUNTLET_ORIGIN_REGEX (default ^https://[a-z0-9-]+\.vercel\.app$) covers
# every Vercel preview/production subdomain without requiring a manual env
# edit per deploy. Either match path admits the request.
_cors_origins = sorted({
    *ALLOWED_ORIGINS,
    "http://localhost:5173",
    "http://localhost:3000",
})
# Methods + headers are enumerated (no wildcards) — credentials=True
# is incompatible with `*` and the cápsula browser-extension passes
# the bearer in the Authorization header. Operators who need a wider
# surface widen `GAUNTLET_ORIGIN` / `GAUNTLET_ORIGIN_REGEX`, not these.
_CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
_CORS_HEADERS = [
    "Authorization",
    "Content-Type",
    "X-Requested-With",
    # Cápsula sends this for model_gateway correlation logging.
    "X-Gauntlet-Request-Id",
    "X-Gauntlet-Backend",
]
_cors_kwargs: dict = {
    "allow_origins": _cors_origins,
    "allow_credentials": True,
    "allow_methods": _CORS_METHODS,
    "allow_headers": _CORS_HEADERS,
}
# Browser-extension and Tauri origins cannot be enumerated (extension
# IDs are install-time, Tauri uses tauri://localhost). Regex matches
# Chrome / Mozilla / Safari extensions (Mozilla + Safari use UUID
# IDs — hyphens admitted) and tauri://localhost only. Localhost
# fallback covers `tauri dev` (Vite-served) and pure browser dev.
# Operators who need broader matching set GAUNTLET_ORIGIN_REGEX —
# the two regexes OR together.
_extension_regex = (
    r"^(chrome-extension|moz-extension|safari-web-extension):\/\/[a-zA-Z0-9-]+(\/.*)?$"
    r"|^tauri:\/\/localhost(\/.*)?$"
    r"|^https?:\/\/tauri\.localhost(:\d+)?$"
    r"|^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$"
)
if ALLOWED_ORIGIN_REGEX:
    _cors_kwargs["allow_origin_regex"] = (
        f"({ALLOWED_ORIGIN_REGEX})|({_extension_regex})"
    )
else:
    _cors_kwargs["allow_origin_regex"] = _extension_regex


# ── Wave P-31 · Defense-in-depth security middlewares ──────────────────────
#
# Five opt-in layers, each gated by env so local dev / unsecured deploys
# keep working unchanged. Middlewares are executed *outermost first* on
# the request path; FastAPI's ``add_middleware`` wraps in REVERSE order,
# so to get the desired outer→inner pipeline:
#
#   body cap  →  security headers  →  CORS  →  auth  →  rate limit  →  app
#
# we add them in the OPPOSITE sequence (rate limit first, body cap last).
#
# Why this order:
#   * Body-cap rejects oversize uploads before any work happens.
#   * Security headers stamp every response, including 413/401/429 so
#     even error frames don't drop the baseline.
#   * CORS sits inside body-cap so the preflight still gets the headers
#     but does NOT consume rate-limit tokens for legitimate browsers.
#   * Auth sits inside CORS — preflight (OPTIONS) bypasses auth by spec.
#   * Rate limit is the deepest layer so authenticated callers are
#     bucketed by IP; it skips OPTIONS to avoid penalising preflight.

# Per-route body-size overrides.
#
# ``/voice/transcribe`` accepts base64-encoded audio up to the cap declared
# in ``voice.py`` (``_MAX_AUDIO_BASE64_BYTES``). Without an override here
# the global 1 MiB cap would 413 any clip longer than ~750 KB of base64
# audio (≈10–20 s of compressed webm) before the endpoint sees it; the
# 50 MiB Pydantic ceiling on the audio field would then be theatre.
# Match the override to the Pydantic ceiling so the contract is honest:
# either both reject at the same threshold, or this route's body is
# trusted up to the same limit the schema declares.
LARGE_BODY_ROUTES: dict[str, int] = {
    "/voice/transcribe": 50 * 1024 * 1024,  # 50 MiB — matches voice._MAX_AUDIO_BASE64_BYTES
}


class BodySizeLimitMiddleware(BaseHTTPMiddleware):
    """Reject requests whose ``Content-Length`` exceeds the configured
    cap. Per-route overrides allow specific endpoints (e.g.
    ``/visual-diff``) to accept larger payloads.

    Note: the check is on ``Content-Length`` only — a chunked / no-CL
    upload still reaches the endpoint, where per-endpoint cap-as-you-read
    enforcement (see ``_read_capped``) takes over. The middleware's job
    is the cheap pre-rejection of well-formed oversized requests.
    """

    def __init__(self, app, default_limit: int, overrides: dict[str, int]) -> None:
        super().__init__(app)
        self._default_limit = int(default_limit)
        self._overrides = dict(overrides or {})

    async def dispatch(self, request, call_next):
        cl = request.headers.get("content-length")
        if cl is None:
            return await call_next(request)
        try:
            length = int(cl)
        except ValueError:
            return JSONResponse(
                status_code=400,
                content={
                    "detail": {
                        "error": "invalid_content_length",
                        "reason": "ValueError",
                        "message": "Content-Length header is not an integer.",
                    }
                },
            )
        limit = self._overrides.get(request.url.path, self._default_limit)
        if length > limit:
            return JSONResponse(
                status_code=413,
                content={
                    "detail": {
                        "error": "request_too_large",
                        "reason": "ContentLengthExceeded",
                        "message": (
                            f"Request body of {length} bytes exceeds limit "
                            f"of {limit} bytes for this route."
                        ),
                        "limit": limit,
                    }
                },
            )
        return await call_next(request)


# Add in REVERSE pipeline order so the resulting wrap matches the comment above.
# 1) Innermost: rate limit (last to wrap, runs nearest the app).
app.add_middleware(
    RateLimitMiddleware,
    disabled=RATE_LIMIT_DISABLED,
    trust_proxy=TRUST_PROXY,
)
# 2) Auth gate — fail-CLOSED. Empty GAUNTLET_API_KEY without explicit
#    GAUNTLET_AUTH_DISABLED=1 means every gated route returns 503.
app.add_middleware(
    APIKeyAuthMiddleware,
    api_key=GAUNTLET_API_KEY,
    auth_disabled=GAUNTLET_AUTH_DISABLED,
)
# 3) CORS — must sit OUTSIDE auth so preflight gets the right headers
#    even when the inner gates would otherwise reject the request.
app.add_middleware(CORSMiddleware, **_cors_kwargs)
# 4) Security headers — stamps every outgoing response, including 4xx/5xx.
app.add_middleware(
    SecurityHeadersMiddleware,
    frame_options=FRAME_OPTIONS,
    csp=SECURITY_CSP,
    hsts=SECURITY_HSTS,
)
# 5) Outermost: body-size cap. Rejects oversize uploads before any
#    other middleware burns CPU on them.
app.add_middleware(
    BodySizeLimitMiddleware,
    default_limit=BODY_SIZE_LIMIT_BYTES,
    overrides=LARGE_BODY_ROUTES,
)


# ── Routers ─────────────────────────────────────────────────────────────────
#
# Mounted after middleware so the same defense-in-depth stack covers them.
# Order is cosmetic — FastAPI dispatches by path, not by mount sequence.

# Cápsula surface (Wave V0) — context · intent · preview · apply.
app.include_router(composer_router)
# Voice (A1) — STT (Groq Whisper) + TTS (Microsoft Edge).
app.include_router(voice_router)

# Domain routers — moved out of this module in the Wave 3 server split.
app.include_router(health_router)
app.include_router(ask_router)
app.include_router(agent_router)
app.include_router(runs_router)
app.include_router(memory_router)
app.include_router(spine_router)
app.include_router(tools_router)
app.include_router(git_router)
app.include_router(permissions_router)
app.include_router(observability_router)
