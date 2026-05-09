"""
Gauntlet — API key authentication middleware (Layer 1).

**Doutrina actualizada 2026-05-09 (v1 polish, security audit P0):**
fail-CLOSED is the default. Reads `GAUNTLET_API_KEY` at module init;
when the env var is unset the middleware refuses every non-public
request with 503 (`auth_misconfigured`) so a fresh deploy that forgot
to set the key cannot accidentally expose `/composer/*`, `/agent/*`,
`/memory/*` or `/permissions/*` to the public internet. The previous
fail-OPEN default ("inactive when key empty") was a footgun for a
public production backend in 2026.

Local dev / unsecured smoke envs opt out **explicitly** via
`GAUNTLET_AUTH_DISABLED=1` — single env, named after the consequence.

Why the design:
  - ``secrets.compare_digest`` is used to defeat timing-side-channel
    leaks of the configured key. ``a == b`` short-circuits on the first
    byte that differs and is observable over the network.
  - The skip-list is intentionally narrow. ``/health`` and
    ``/health/ready`` MUST be reachable without a key so Railway / Vercel
    health probes keep routing traffic; ``OPTIONS`` is preflight which
    carries no auth header by spec. Everything else — including
    ``/diagnostics`` (which leaks env shape) — is gated by default.
  - The 401 / 503 body is a typed envelope (``{error, reason, message}``)
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

logger = logging.getLogger("gauntlet.auth")

# Paths that MUST be reachable without auth — kept tight on purpose.
# Health probes, CORS preflight handled by method check below.
PUBLIC_PATHS: frozenset[str] = frozenset({
    "/health",
    "/health/ready",
})


class APIKeyAuthMiddleware(BaseHTTPMiddleware):
    """Bearer-token gate. Fail-closed by default; explicit
    ``auth_disabled=True`` opt-out for local dev."""

    def __init__(
        self,
        app,
        api_key: str = "",
        *,
        auth_disabled: bool = False,
    ) -> None:
        super().__init__(app)
        # Snapshot at construction. Operators rotating keys must restart
        # the process — middleware-level hot-reload is more risk than value.
        self._api_key = (api_key or "").strip()
        self._disabled = bool(auth_disabled)
        if self._disabled:
            # Loud breadcrumb so the operator sees this on stdout — there
            # is no secondary gate beyond the env var so misconfiguration
            # has to be visible in logs.
            logger.warning(
                "auth.disabled GAUNTLET_AUTH_DISABLED=1 — every non-public "
                "route is reachable without Authorization. Use this only "
                "for local dev."
            )
        elif not self._api_key:
            logger.error(
                "auth.misconfigured GAUNTLET_API_KEY is empty AND "
                "GAUNTLET_AUTH_DISABLED is not set — all gated routes "
                "will return 503 until one of the two is configured."
            )

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if self._disabled:
            return await call_next(request)

        # CORS preflight — never carries auth headers; CORSMiddleware
        # answers it before us when wired in the right order, but be
        # defensive in case the preflight slips through.
        if request.method == "OPTIONS":
            return await call_next(request)

        # Public probes.
        if request.url.path in PUBLIC_PATHS:
            return await call_next(request)

        # Fail-CLOSED: no key configured → refuse every gated request
        # with 503 instead of letting it through. The audit P0 finding
        # was that the previous "no-op when empty" default exposed a
        # fresh deploy completely.
        if not self._api_key:
            return _misconfigured()

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
                    "GAUNTLET_API_KEY (or VITE_GAUNTLET_API_KEY on the "
                    "frontend) to authenticate."
                ),
            }
        },
        headers={"WWW-Authenticate": "Bearer"},
    )


def _misconfigured() -> JSONResponse:
    """Backend started without a key AND without the explicit dev opt-out.
    Refuse all gated routes loudly so the operator notices on the first
    request rather than discovering a wide-open API the hard way."""
    return JSONResponse(
        status_code=503,
        content={
            "detail": {
                "error": "auth_misconfigured",
                "reason": "missing_gauntlet_api_key",
                "message": (
                    "Backend started without GAUNTLET_API_KEY. Set "
                    "GAUNTLET_API_KEY=<key> in production, or "
                    "GAUNTLET_AUTH_DISABLED=1 to acknowledge an "
                    "unauthenticated dev deploy. Refusing requests "
                    "until one of the two is configured."
                ),
            }
        },
    )
