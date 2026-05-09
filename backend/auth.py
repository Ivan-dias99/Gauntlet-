"""
Gauntlet — API key authentication middleware (Layer 1).

Fail-CLOSED by default. The middleware operates in one of three modes
resolved at construction time from the env:

  * `enforce`        — `GAUNTLET_API_KEY` set; require Bearer token.
  * `disabled`       — `GAUNTLET_AUTH_DISABLED=1`; let everything through.
  * `misconfigured`  — neither set; refuse every gated route with 503
                       so a fresh deploy that forgot to configure the
                       key cannot accidentally serve a wide-open API.

Health probes (`/health`, `/health/ready`) and CORS preflight bypass
the gate in every mode. Bearer compare uses ``secrets.compare_digest``
to defeat timing side-channels. Error responses share a typed envelope
(``{detail: {error, reason, message}}``) for the frontend's
``parseBackendError`` path.
"""

from __future__ import annotations

import logging
import secrets
from typing import Any, Callable, Literal

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

logger = logging.getLogger("gauntlet.auth")

AuthMode = Literal["enforce", "disabled", "misconfigured"]

PUBLIC_PATHS: frozenset[str] = frozenset({
    "/health",
    "/health/ready",
})


def resolve_auth_mode(api_key: str, auth_disabled: bool) -> AuthMode:
    """Single source of truth for the three states the middleware
    operates in. Called by server.py at boot AND by the middleware
    constructor; keeps the classification visible at the call site."""
    if auth_disabled:
        return "disabled"
    if (api_key or "").strip():
        return "enforce"
    return "misconfigured"


# Pre-built response BODIES (dicts, immutable shape) so we don't
# re-allocate on every gated request when the backend is misconfigured
# or the operator sends a bad header. JSONResponse itself must be
# fresh per call (Starlette mutates response headers), but the content
# dict can be reused — JSONResponse copies it during render.
_AUTH_REQUIRED_MESSAGE = (
    "Authorization: Bearer <key> required. Configure "
    "GAUNTLET_API_KEY (or VITE_GAUNTLET_API_KEY on the "
    "frontend) to authenticate."
)
_MISCONFIGURED_MESSAGE = (
    "Backend started without GAUNTLET_API_KEY. Set "
    "GAUNTLET_API_KEY=<key> in production, or "
    "GAUNTLET_AUTH_DISABLED=1 to acknowledge an "
    "unauthenticated dev deploy. Refusing requests "
    "until one of the two is configured."
)
_MISCONFIGURED_BODY: dict[str, Any] = {
    "detail": {
        "error": "auth_misconfigured",
        "reason": "missing_gauntlet_api_key",
        "message": _MISCONFIGURED_MESSAGE,
    }
}


def _error_envelope(
    status: int,
    error: str,
    reason: str,
    message: str,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content={
            "detail": {
                "error": error,
                "reason": reason,
                "message": message,
            }
        },
        headers=headers,
    )


def _unauthorized(reason: str) -> JSONResponse:
    return _error_envelope(
        status=401,
        error="auth_required",
        reason=reason,
        message=_AUTH_REQUIRED_MESSAGE,
        headers={"WWW-Authenticate": "Bearer"},
    )


def _misconfigured() -> JSONResponse:
    return JSONResponse(status_code=503, content=_MISCONFIGURED_BODY)


class APIKeyAuthMiddleware(BaseHTTPMiddleware):
    """Bearer-token gate. Mode resolved once at construction; every
    request takes the cheapest possible path through the dispatch."""

    def __init__(
        self,
        app,
        api_key: str = "",
        *,
        auth_disabled: bool = False,
    ) -> None:
        super().__init__(app)
        self._api_key = (api_key or "").strip()
        self._mode: AuthMode = resolve_auth_mode(api_key, auth_disabled)
        if self._mode == "disabled":
            logger.warning(
                "auth.disabled GAUNTLET_AUTH_DISABLED=1 — every non-public "
                "route is reachable without Authorization. Use this only "
                "for local dev."
            )
        elif self._mode == "misconfigured":
            logger.error(
                "auth.misconfigured GAUNTLET_API_KEY is empty AND "
                "GAUNTLET_AUTH_DISABLED is not set — all gated routes "
                "will return 503 until one of the two is configured."
            )

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if self._mode == "disabled":
            return await call_next(request)

        if request.method == "OPTIONS":
            return await call_next(request)

        if request.url.path in PUBLIC_PATHS:
            return await call_next(request)

        if self._mode == "misconfigured":
            return _misconfigured()

        header = request.headers.get("authorization") or request.headers.get("Authorization")
        if not header:
            return _unauthorized("missing_authorization_header")

        scheme, _, token = header.partition(" ")
        if scheme.strip().lower() != "bearer" or not token:
            return _unauthorized("malformed_authorization_header")

        provided = token.strip().encode("utf-8")
        expected = self._api_key.encode("utf-8")
        if not secrets.compare_digest(provided, expected):
            return _unauthorized("invalid_api_key")

        return await call_next(request)
