"""
Signal — API key authentication middleware (Wave P-31, Layer 1).

Reads `SIGNAL_API_KEY` (legacy alias `RUBERRA_API_KEY`) at module init via
``config._env``. When the env var is unset, ``api_key_required`` is a
no-op pass-through so local dev / unsecured deploys keep working with
zero friction. When it is set, every request **except** the public probe
paths and CORS preflight must carry ``Authorization: Bearer <key>``.

Why the design:
  - ``secrets.compare_digest`` is used to defeat timing-side-channel
    leaks of the configured key. ``a == b`` short-circuits on the first
    byte that differs and is observable over the network.
  - The skip-list is intentionally narrow. ``/health`` and
    ``/health/ready`` MUST be reachable without a key so Railway / Vercel
    health probes keep routing traffic; ``OPTIONS`` is preflight which
    carries no auth header by spec. Everything else — including
    ``/diagnostics`` (which leaks env shape) — is gated by default.
  - The 401 body is a typed envelope (``{error, reason, message}``)
    matching the rest of the FastAPI surface so the frontend's
    ``parseBackendError`` path keeps working without a special case.
"""

from __future__ import annotations

import logging
import secrets
from typing import Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

logger = logging.getLogger("signal.auth")

# Paths that MUST be reachable without auth — kept tight on purpose.
# Health probes, CORS preflight handled by method check below.
PUBLIC_PATHS: frozenset[str] = frozenset({
    "/health",
    "/health/ready",
})


class APIKeyAuthMiddleware(BaseHTTPMiddleware):
    """Bearer-token gate. Inactive when ``api_key`` is empty."""

    def __init__(self, app, api_key: str = "") -> None:
        super().__init__(app)
        # Snapshot at construction. Operators rotating keys must restart
        # the process — middleware-level hot-reload is more risk than value.
        self._api_key = (api_key or "").strip()
        self._enabled = bool(self._api_key)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if not self._enabled:
            return await call_next(request)

        # CORS preflight — never carries auth headers; CORSMiddleware
        # answers it before us when wired in the right order, but be
        # defensive in case the preflight slips through.
        if request.method == "OPTIONS":
            return await call_next(request)

        # Public probes.
        if request.url.path in PUBLIC_PATHS:
            return await call_next(request)

        header = request.headers.get("authorization") or request.headers.get("Authorization")
        if not header:
            return _unauthorized("missing_authorization_header")

        # ``Bearer <key>`` — case-insensitive scheme, exact key match.
        scheme, _, token = header.partition(" ")
        if scheme.strip().lower() != "bearer" or not token:
            return _unauthorized("malformed_authorization_header")

        # Constant-time comparison. Encode both sides to bytes so the
        # length of the *configured* key cannot leak via Unicode width.
        provided = token.strip().encode("utf-8")
        expected = self._api_key.encode("utf-8")
        if not secrets.compare_digest(provided, expected):
            return _unauthorized("invalid_api_key")

        return await call_next(request)


def _unauthorized(reason: str) -> JSONResponse:
    """Typed envelope matching the rest of the backend's error contract."""
    return JSONResponse(
        status_code=401,
        content={
            "detail": {
                "error": "auth_required",
                "reason": reason,
                "message": (
                    "Authorization: Bearer <key> required. Configure "
                    "SIGNAL_API_KEY (or set VITE_SIGNAL_API_KEY on the "
                    "frontend) to authenticate."
                ),
            }
        },
        headers={"WWW-Authenticate": "Bearer"},
    )
