"""
Signal — security response headers (Wave P-31, Layer 3).

Stamps a conservative baseline of security headers onto every response.
Each header is justified inline so the next person editing this file
knows what they would be tearing down.

  X-Content-Type-Options: nosniff
      Stops the browser from MIME-sniffing a JSON body into HTML and
      executing it. Cheap, no downside, always on.

  X-Frame-Options: DENY (or SAMEORIGIN)
      Refuses to be embedded in an <iframe>. Defends against UI-redress
      / clickjacking. Switch to SAMEORIGIN only when SurfaceFinal hosts
      the preview iframe on the same origin as the backend; for
      cross-origin embeds use CSP frame-ancestors instead.

  Referrer-Policy: strict-origin-when-cross-origin
      The default-ish modern policy. Sends the full URL on same-origin
      navigations (helpful for analytics) and only the origin on
      cross-origin (no path/query leak to third parties).

  Strict-Transport-Security: max-age=31536000; includeSubDomains
      OPT-IN via SIGNAL_HSTS=1. Pins the browser to HTTPS for one year.
      Catastrophic if accidentally enabled on a dev origin (browsers
      cache HSTS even after the header goes away), so we keep it off
      by default and only flip on for prod https deploys.

  Content-Security-Policy:
      default-src 'self'; img-src 'self' data: blob: https:;
      style-src 'self' 'unsafe-inline'; script-src 'self';
      connect-src 'self' https:; frame-src 'self';
      frame-ancestors 'self'
      Conservative starting point: only same-origin scripts (Vite-built
      bundle), inline styles allowed because Tailwind's runtime injects
      them, images allowed from data:/blob:/https for the Surface mock
      previews and visual-diff thumbnails. Override the whole header
      via SIGNAL_CSP when the deploy needs a different policy (e.g.
      adding a CDN or analytics origin).

  Permissions-Policy: geolocation=(), microphone=(), camera=()
      Disables three high-risk powerful features the workspace never
      uses. A leaked XSS can't spin up the camera without explicit
      operator action.

The middleware is always installed; it has no env gate of its own
beyond the few headers whose presence is operator-controlled (HSTS,
frame-options, CSP override). Removing the middleware itself would
require an env hatch, which we don't need yet — these headers don't
break anything.
"""

from __future__ import annotations

from typing import Callable, Optional

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

DEFAULT_CSP: str = (
    "default-src 'self'; "
    "img-src 'self' data: blob: https:; "
    "style-src 'self' 'unsafe-inline'; "
    "script-src 'self'; "
    "connect-src 'self' https:; "
    "frame-src 'self'; "
    "frame-ancestors 'self'"
)

DEFAULT_PERMISSIONS_POLICY: str = "geolocation=(), microphone=(), camera=()"


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Stamp the security baseline onto every response.

    Existing headers set by an inner endpoint (e.g. ``Cache-Control`` on
    the SSE responses) are NOT overwritten — we only add headers that
    aren't already present, except for the security set we own
    unconditionally.
    """

    def __init__(
        self,
        app,
        frame_options: str = "DENY",
        csp: Optional[str] = None,
        hsts: bool = False,
        permissions_policy: Optional[str] = None,
    ) -> None:
        super().__init__(app)
        # Sanitise frame-options: only DENY and SAMEORIGIN are valid in
        # the modern spec. Anything else falls back to DENY (safest).
        fo = (frame_options or "DENY").strip().upper()
        self._frame_options = fo if fo in ("DENY", "SAMEORIGIN") else "DENY"
        self._csp = (csp or "").strip() or DEFAULT_CSP
        self._hsts = bool(hsts)
        self._permissions_policy = (permissions_policy or DEFAULT_PERMISSIONS_POLICY).strip()

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        h = response.headers
        h["X-Content-Type-Options"] = "nosniff"
        h["X-Frame-Options"] = self._frame_options
        h["Referrer-Policy"] = "strict-origin-when-cross-origin"
        h["Content-Security-Policy"] = self._csp
        h["Permissions-Policy"] = self._permissions_policy
        if self._hsts:
            # 1 year, include subdomains. No `preload` — that's a
            # one-way commitment that requires browser-vendor enrollment.
            h["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response
