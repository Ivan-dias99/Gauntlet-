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


def _fresh_client(env: dict[str, str]):
    """Build a TestClient with the requested env in place. We reload
    config + server so middlewares pick up the new env values."""
    # Mock mode = no Anthropic key needed for boot.
    env.setdefault("RUBERRA_MOCK", "1")
    # Default tests off the rate limiter unless the test asks for it.
    env.setdefault("SIGNAL_RATE_LIMIT_DISABLED", "1")
    env.setdefault("SIGNAL_LOG_REDACT", "0")  # don't pollute pytest captures

    for key in (
        "SIGNAL_API_KEY", "RUBERRA_API_KEY",
        "SIGNAL_RATE_LIMIT_DISABLED", "RUBERRA_RATE_LIMIT_DISABLED",
        "SIGNAL_HSTS", "RUBERRA_HSTS",
        "SIGNAL_FRAME_OPTIONS", "RUBERRA_FRAME_OPTIONS",
        "SIGNAL_CSP", "RUBERRA_CSP",
        "SIGNAL_MAX_BODY_BYTES", "RUBERRA_MAX_BODY_BYTES",
        "SIGNAL_LOG_REDACT", "RUBERRA_LOG_REDACT",
        "SIGNAL_TRUST_PROXY", "RUBERRA_TRUST_PROXY",
        "RUBERRA_MOCK", "SIGNAL_MOCK",
    ):
        os.environ.pop(key, None)
    os.environ.update(env)

    # Drop cached modules so middleware constructors re-run.
    for mod in (
        "config", "server",
        "auth", "rate_limit", "security_headers", "log_redaction",
    ):
        sys.modules.pop(mod, None)

    server = importlib.import_module("server")
    from fastapi.testclient import TestClient
    return TestClient(server.app), server


# ── Layer 1 — API key gate ────────────────────────────────────────────────


def test_auth_disabled_when_key_unset():
    client, _ = _fresh_client({})
    # /diagnostics is gated when key IS set; with no key it's open.
    r = client.get("/diagnostics")
    assert r.status_code == 200, r.text


def test_auth_required_rejects_without_header():
    client, _ = _fresh_client({"SIGNAL_API_KEY": "test-key-abc"})
    r = client.get("/diagnostics")
    assert r.status_code == 401
    body = r.json()
    assert body["detail"]["error"] == "auth_required"


def test_auth_accepts_valid_bearer():
    client, _ = _fresh_client({"SIGNAL_API_KEY": "test-key-abc"})
    r = client.get("/diagnostics", headers={"Authorization": "Bearer test-key-abc"})
    assert r.status_code == 200, r.text


def test_auth_rejects_wrong_bearer():
    client, _ = _fresh_client({"SIGNAL_API_KEY": "test-key-abc"})
    r = client.get("/diagnostics", headers={"Authorization": "Bearer nope"})
    assert r.status_code == 401
    assert r.json()["detail"]["reason"] == "invalid_api_key"


def test_auth_skips_health():
    client, _ = _fresh_client({"SIGNAL_API_KEY": "test-key-abc"})
    assert client.get("/health").status_code == 200


def test_auth_legacy_env_alias():
    client, _ = _fresh_client({"RUBERRA_API_KEY": "legacy-key-xyz"})
    r = client.get("/diagnostics")
    assert r.status_code == 401
    r = client.get("/diagnostics", headers={"Authorization": "Bearer legacy-key-xyz"})
    assert r.status_code == 200


# ── Layer 2 — rate limiting ───────────────────────────────────────────────


def test_rate_limit_burst_then_429():
    client, _ = _fresh_client({"SIGNAL_RATE_LIMIT_DISABLED": "0"})
    # /diagnostics maps to the "read" class: burst 30. Hit it 35 times
    # quickly and expect at least one 429 in the tail.
    statuses = [client.get("/diagnostics").status_code for _ in range(35)]
    assert 429 in statuses, f"Expected 429 in tail, got {statuses[-10:]}"


def test_rate_limit_envelope_shape():
    client, _ = _fresh_client({"SIGNAL_RATE_LIMIT_DISABLED": "0"})
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
    client, _ = _fresh_client({"SIGNAL_RATE_LIMIT_DISABLED": "1"})
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
    client, _ = _fresh_client({"SIGNAL_HSTS": "1"})
    r = client.get("/health")
    assert "Strict-Transport-Security" in r.headers
    assert "max-age=31536000" in r.headers["Strict-Transport-Security"]


def test_security_headers_frame_options_override():
    client, _ = _fresh_client({"SIGNAL_FRAME_OPTIONS": "SAMEORIGIN"})
    r = client.get("/health")
    assert r.headers.get("X-Frame-Options") == "SAMEORIGIN"


def test_security_headers_present_on_4xx():
    # Even on auth-fail responses the security baseline must be stamped.
    client, _ = _fresh_client({"SIGNAL_API_KEY": "test-key-abc"})
    r = client.get("/diagnostics")
    assert r.status_code == 401
    assert r.headers.get("X-Content-Type-Options") == "nosniff"


# ── Layer 4 — body size cap ───────────────────────────────────────────────


def test_body_cap_rejects_oversized():
    client, _ = _fresh_client({"SIGNAL_MAX_BODY_BYTES": str(1024)})
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


def test_body_cap_route_override_for_visual_diff():
    # /visual-diff should accept payloads above the 1 MiB default. We
    # don't actually upload a real image — we just confirm the size
    # gate is the per-route 16 MiB cap, not the global 1 MiB.
    # Sending Content-Length 2 MiB with no body causes a 4xx from the
    # endpoint (multipart parse), but NOT a 413 from our middleware.
    client, _ = _fresh_client({})
    two_mib = 2 * 1024 * 1024
    r = client.post(
        "/visual-diff",
        content=b"",
        headers={"Content-Type": "multipart/form-data", "Content-Length": str(two_mib)},
    )
    # We just need to verify NOT-413 from the cap layer.
    assert r.status_code != 413, "global cap leaked onto /visual-diff"


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
    client, _ = _fresh_client({"SIGNAL_API_KEY": "k"})
    r = client.get("/diagnostics", headers={"Authorization": "Bearer k"})
    assert r.status_code == 200
    body = r.json()
    assert "security" in body
    sec = body["security"]
    assert sec["auth_required"] is True
    assert "rate_limit_enabled" in sec
    assert "frame_options" in sec
    assert "body_size_limit_bytes" in sec
