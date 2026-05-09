"""
Wave P-31 — security smoke tests.

Each layer is exercised against a fresh ``TestClient`` built from a
re-imported ``server`` module so middleware reads our patched env at
construction time. Importing ``server`` once and mutating env later
would not flip the auth gate — the middleware snapshots the key at
init.

Run from repo root:
    cd backend
    pytest -q test_security.py
"""

from __future__ import annotations

import importlib
import io
import os
import sys
import time

import pytest


def _fresh_client(env: dict[str, str], *, leave_auth_unconfigured: bool = False):
    """Build a TestClient with the requested env in place. We reload
    config + server so middlewares pick up the new env values.

    v1 polish — auth is fail-CLOSED in production. Tests that don't
    explicitly drive the auth layer (rate-limit, headers, body-cap)
    default to GAUNTLET_AUTH_DISABLED=1 so they still hit gated
    routes without 503'ing. Auth-specific tests either pass
    GAUNTLET_API_KEY (real auth on) or set GAUNTLET_AUTH_DISABLED=1.
    The single test that exercises the misconfigured-default path
    (key empty AND disable flag empty) passes
    ``leave_auth_unconfigured=True``."""
    # Mock mode = no Anthropic key needed for boot.
    env.setdefault("GAUNTLET_MOCK", "1")
    # Default tests off the rate limiter unless the test asks for it.
    env.setdefault("GAUNTLET_RATE_LIMIT_DISABLED", "1")
    env.setdefault("GAUNTLET_LOG_REDACT", "0")  # don't pollute pytest captures
    if (
        not leave_auth_unconfigured
        and "GAUNTLET_API_KEY" not in env
        and "GAUNTLET_AUTH_DISABLED" not in env
    ):
        env.setdefault("GAUNTLET_AUTH_DISABLED", "1")

    for key in (
        "GAUNTLET_API_KEY",
        "GAUNTLET_AUTH_DISABLED",
        "GAUNTLET_RATE_LIMIT_DISABLED",
        "GAUNTLET_HSTS",
        "GAUNTLET_FRAME_OPTIONS",
        "GAUNTLET_CSP",
        "GAUNTLET_MAX_BODY_BYTES",
        "GAUNTLET_LOG_REDACT",
        "GAUNTLET_TRUST_PROXY",
        "GAUNTLET_MOCK",
    ):
        os.environ.pop(key, None)
    os.environ.update(env)

    # Drop cached modules so middleware constructors re-run.
    # Routers + runtime are also dropped because they bind store
    # singletons + the engine accessor at import time — keeping them
    # cached would split state across the freshly-imported server.
    for mod in (
        "config", "server",
        "auth", "rate_limit", "security_headers", "log_redaction",
        "runtime", "routers",
        "routers.health", "routers.ask", "routers.agent",
        "routers.runs", "routers.memory", "routers.spine",
        "routers.tools", "routers.git", "routers.permissions",
        "routers.observability",
    ):
        sys.modules.pop(mod, None)

    server = importlib.import_module("server")
    from fastapi.testclient import TestClient
    return TestClient(server.app), server


# ── Layer 1 — API key gate ────────────────────────────────────────────────


def test_auth_misconfigured_when_key_and_disable_both_unset():
    """v1 polish — security audit P0. Was: empty key = wide-open
    (fail-OPEN). Is: empty key + no GAUNTLET_AUTH_DISABLED = 503
    auth_misconfigured on every gated route. /health stays public so
    Railway/Vercel probes don't flap."""
    client, _ = _fresh_client({}, leave_auth_unconfigured=True)
    r = client.get("/diagnostics")
    assert r.status_code == 503, r.text
    body = r.json()
    assert body["detail"]["error"] == "auth_misconfigured"
    assert body["detail"]["reason"] == "missing_gauntlet_api_key"
    # Health probes still pass — Railway must keep routing traffic
    # so the operator sees the breadcrumb in the next request.
    assert client.get("/health").status_code == 200


def test_auth_disabled_explicit_opt_out():
    """The dev opt-out: GAUNTLET_AUTH_DISABLED=1 — flag is named after
    the consequence so an operator copy-pasting prod env doesn't
    inherit it silently."""
    client, _ = _fresh_client({"GAUNTLET_AUTH_DISABLED": "1"})
    r = client.get("/diagnostics")
    assert r.status_code == 200, r.text


def test_auth_required_rejects_without_header():
    client, _ = _fresh_client({"GAUNTLET_API_KEY": "test-key-abc"})
    r = client.get("/diagnostics")
    assert r.status_code == 401
    body = r.json()
    assert body["detail"]["error"] == "auth_required"


def test_auth_accepts_valid_bearer():
    client, _ = _fresh_client({"GAUNTLET_API_KEY": "test-key-abc"})
    r = client.get("/diagnostics", headers={"Authorization": "Bearer test-key-abc"})
    assert r.status_code == 200, r.text


def test_auth_rejects_wrong_bearer():
    client, _ = _fresh_client({"GAUNTLET_API_KEY": "test-key-abc"})
    r = client.get("/diagnostics", headers={"Authorization": "Bearer nope"})
    assert r.status_code == 401
    assert r.json()["detail"]["reason"] == "invalid_api_key"


def test_auth_skips_health():
    client, _ = _fresh_client({"GAUNTLET_API_KEY": "test-key-abc"})
    assert client.get("/health").status_code == 200


# ── Layer 2 — rate limiting ───────────────────────────────────────────────


def test_rate_limit_burst_then_429():
    client, _ = _fresh_client({"GAUNTLET_RATE_LIMIT_DISABLED": "0"})
    # /diagnostics maps to the "read" class: burst 30. Hit it 35 times
    # quickly and expect at least one 429 in the tail.
    statuses = [client.get("/diagnostics").status_code for _ in range(35)]
    assert 429 in statuses, f"Expected 429 in tail, got {statuses[-10:]}"


def test_rate_limit_envelope_shape():
    client, _ = _fresh_client({"GAUNTLET_RATE_LIMIT_DISABLED": "0"})
    last = None
    for _ in range(40):
        r = client.get("/diagnostics")
        if r.status_code == 429:
            last = r
            break
    assert last is not None, "rate limiter never tripped"
    body = last.json()
    assert body["detail"]["error"] == "rate_limit_exceeded"
    assert isinstance(body["detail"]["retry_after_ms"], int)
    assert body["detail"]["retry_after_ms"] >= 1


def test_rate_limit_disabled_flag_works():
    client, _ = _fresh_client({"GAUNTLET_RATE_LIMIT_DISABLED": "1"})
    statuses = [client.get("/diagnostics").status_code for _ in range(50)]
    assert all(s == 200 for s in statuses), f"unexpected: {statuses}"


# ── Layer 3 — security headers ────────────────────────────────────────────


def test_security_headers_present_on_health():
    client, _ = _fresh_client({})
    r = client.get("/health")
    assert r.headers.get("X-Content-Type-Options") == "nosniff"
    assert r.headers.get("X-Frame-Options") == "DENY"
    assert "Content-Security-Policy" in r.headers
    assert "Permissions-Policy" in r.headers
    # HSTS off by default
    assert "Strict-Transport-Security" not in r.headers


def test_security_headers_hsts_when_enabled():
    client, _ = _fresh_client({"GAUNTLET_HSTS": "1"})
    r = client.get("/health")
    assert "Strict-Transport-Security" in r.headers
    assert "max-age=31536000" in r.headers["Strict-Transport-Security"]


def test_security_headers_frame_options_override():
    client, _ = _fresh_client({"GAUNTLET_FRAME_OPTIONS": "SAMEORIGIN"})
    r = client.get("/health")
    assert r.headers.get("X-Frame-Options") == "SAMEORIGIN"


def test_security_headers_present_on_4xx():
    # Even on auth-fail responses the security baseline must be stamped.
    client, _ = _fresh_client({"GAUNTLET_API_KEY": "test-key-abc"})
    r = client.get("/diagnostics")
    assert r.status_code == 401
    assert r.headers.get("X-Content-Type-Options") == "nosniff"


# ── Layer 4 — body size cap ───────────────────────────────────────────────


def test_body_cap_rejects_oversized():
    client, _ = _fresh_client({"GAUNTLET_MAX_BODY_BYTES": str(1024)})
    big = "x" * 4096
    r = client.post(
        "/telemetry/event",
        content=big,
        headers={"Content-Type": "application/json", "Content-Length": str(len(big))},
    )
    assert r.status_code == 413
    body = r.json()
    assert body["detail"]["error"] == "request_too_large"
    assert body["detail"]["limit"] == 1024


def test_body_cap_passes_normal():
    client, _ = _fresh_client({})
    r = client.post(
        "/telemetry/event",
        json={"event": "smoke", "payload": {"k": "v"}},
    )
    # Endpoint may return ok=true / ok=false depending on stores, but
    # MUST NOT be 413/400 from the body cap.
    assert r.status_code == 200, r.text


def test_body_cap_route_override_mechanism():
    # The /visual-diff endpoint that previously exercised this path
    # was retired in the Gauntlet migration (server.LARGE_BODY_ROUTES
    # is now empty). The override mechanism itself is still useful for
    # future large-body routes, so we test it directly against the
    # middleware class with a synthetic override map.
    from server import BodySizeLimitMiddleware
    from starlette.applications import Starlette
    from starlette.routing import Route
    from starlette.responses import JSONResponse

    async def echo(_request):
        return JSONResponse({"ok": True})

    app = Starlette(routes=[Route("/big", echo, methods=["POST"])])
    app.add_middleware(
        BodySizeLimitMiddleware,
        default_limit=1024,           # 1 KiB global default
        overrides={"/big": 64 * 1024},  # 64 KiB per-route override
    )
    from starlette.testclient import TestClient as Sync
    client = Sync(app)

    # 8 KiB body to /big — over the global 1 KiB but under the
    # override's 64 KiB. Middleware must let it through.
    body = b"x" * (8 * 1024)
    r = client.post(
        "/big",
        content=body,
        headers={"Content-Length": str(len(body))},
    )
    assert r.status_code == 200, "override should allow body over global default"

    # 8 KiB body to a route WITHOUT override — global default applies.
    # Use a path the route table doesn't know; the middleware fires
    # before routing so the 413 lands first.
    r = client.post(
        "/no-override",
        content=body,
        headers={"Content-Length": str(len(body))},
    )
    assert r.status_code == 413, "global default should block body above 1 KiB"


# ── Layer 5 — log redaction ───────────────────────────────────────────────


def test_log_redaction_masks_known_shapes():
    # Direct unit on the redact helper — exhaustive integration would
    # require capturing the logger pipeline, which is brittle.
    from log_redaction import redact

    # Each (input, must_contain_one_of) — the more specific pattern wins,
    # so a string carrying both Authorization: AND ghp_ may end up as
    # `Authorization: ****` (Authorization rule applied first) OR carry
    # the platform-specific tag. Both are acceptable; the contract is
    # only "the credential body must not survive".
    cases = [
        "Authorization: Bearer ghp_supersecretvalue1234567890",
        "token=ghp_abcdefghij1234567890klmn",
        "anth=sk-ant-abcdefghij1234567890klmnopqrst",
        "hash=" + ("a" * 40),
    ]
    forbidden_substrings = (
        "supersecretvalue1234567890",
        "abcdefghij1234567890klmn",
        "abcdefghij1234567890klmnopqrst",
        "a" * 40,
    )
    for raw in cases:
        out = redact(raw)
        for bad in forbidden_substrings:
            assert bad not in out, f"credential body leaked: {raw!r} -> {out!r}"
        # Some recognisable masking marker must be present.
        assert "****" in out, f"no mask applied to {raw!r}"


# ── /diagnostics security shape ───────────────────────────────────────────


def test_diagnostics_reports_security_layers():
    client, _ = _fresh_client({"GAUNTLET_API_KEY": "k"})
    r = client.get("/diagnostics", headers={"Authorization": "Bearer k"})
    assert r.status_code == 200
    body = r.json()
    assert "security" in body
    sec = body["security"]
    assert sec["auth_required"] is True
    assert "rate_limit_enabled" in sec
    assert "frame_options" in sec
    assert "body_size_limit_bytes" in sec
