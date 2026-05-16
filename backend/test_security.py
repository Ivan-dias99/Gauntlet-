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
    """Build a TestClient with the requested env in place. Reloads
    config + server so middlewares pick up the patched env.

    Auth defaults: tests that don't explicitly drive the auth layer
    default to ``GAUNTLET_AUTH_DISABLED=1`` so they hit gated routes
    without 503'ing. Pass ``GAUNTLET_API_KEY`` to exercise the real
    bearer flow, or ``leave_auth_unconfigured=True`` for the
    misconfigured-default path (key empty AND disable flag empty)."""
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
    """Empty key + no `GAUNTLET_AUTH_DISABLED` returns 503
    `auth_misconfigured` on every gated route. `/health` stays public
    so Railway/Vercel probes keep routing traffic."""
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
        # Groq key shape (gsk_ prefix + 20+ alphanumerics).
        "groq=gsk_abcdefghij1234567890klmn",
        # Google AI Studio / GCP key shape (AIza + 35 url-safe chars).
        "gemini=AIzaSyA-abcdefghij1234567890_klmnopqrstuv",
    ]
    forbidden_substrings = (
        "supersecretvalue1234567890",
        "abcdefghij1234567890klmn",
        "abcdefghij1234567890klmnopqrst",
        "a" * 40,
        "SyA-abcdefghij1234567890_klmnopqrstuv",
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


# ── Tool sandbox — SSRF policy (_validate_fetch_url) ─────────────────────────


def _import_tools():
    """Import ``tools`` with a scoped workspace so the module-level
    ``_resolve_workspace_root`` does not refuse on machines where the
    backend's parent happens to be ``/``."""
    import importlib
    import tempfile
    os.environ.setdefault("GAUNTLET_WORKSPACE", tempfile.gettempdir())
    sys.modules.pop("tools", None)
    return importlib.import_module("tools")


@pytest.mark.parametrize(
    "url",
    [
        "http://127.0.0.1/admin",          # IPv4 loopback literal
        "http://[::1]/",                    # IPv6 loopback literal
        "http://10.0.0.1/internal",         # RFC1918
        "http://192.168.1.1/router",        # RFC1918
        "http://169.254.169.254/latest",    # AWS / GCP metadata
        "http://2130706433/",               # 127.0.0.1 in decimal
        "http://0177.0.0.1/",               # 127.0.0.1 in octal
        "ftp://example.com/",               # disallowed scheme
        "file:///etc/passwd",               # disallowed scheme
        "gopher://example.com/",            # disallowed scheme
        "http://user:pass@example.com/",    # userinfo
        "http:///no-host",                  # missing hostname
    ],
)
def test_ssrf_validate_fetch_url_rejects(url: str):
    """Every literal-private / metadata / weird-scheme / userinfo URL
    must trip the deny-by-default fetch policy. Adding a case here is
    the canonical way to extend the SSRF contract."""
    tools = _import_tools()
    with pytest.raises(tools._UrlRejected):
        tools._validate_fetch_url(url)


def test_ssrf_validate_fetch_url_accepts_public_literal():
    tools = _import_tools()
    # Cloudflare's public DNS — stable, public, IPv4.
    host, port = tools._validate_fetch_url("https://1.1.1.1/")
    assert host == "1.1.1.1"
    assert port == 443


# ── Tool sandbox — command policy (_check_command_policy) ────────────────────


def test_command_policy_empty_argv_rejected():
    tools = _import_tools()
    err = tools._check_command_policy([])
    assert err is not None and "empty" in err


def test_command_policy_unknown_binary_rejected():
    tools = _import_tools()
    err = tools._check_command_policy(["curl", "https://example.com"])
    assert err is not None
    assert "deny-by-default" in err


def test_command_policy_safe_binary_admitted():
    tools = _import_tools()
    assert tools._check_command_policy(["ls", "-la"]) is None
    assert tools._check_command_policy(["grep", "-r", "x", "."]) is None


def test_command_policy_gated_requires_flag(monkeypatch):
    tools = _import_tools()
    monkeypatch.setattr(tools, "AGENT_ALLOW_CODE_EXEC", False)
    err = tools._check_command_policy(["python3", "-c", "print(1)"])
    assert err is not None
    assert "GAUNTLET_ALLOW_CODE_EXEC" in err


def test_command_policy_gated_admitted_when_flag_on(monkeypatch):
    tools = _import_tools()
    monkeypatch.setattr(tools, "AGENT_ALLOW_CODE_EXEC", True)
    assert tools._check_command_policy(["python3", "-c", "print(1)"]) is None


def test_command_policy_find_exec_rejected_even_when_gated(monkeypatch):
    """``find -exec`` is the canonical escape from a read-only file
    walker into arbitrary code execution. Even with the gate flipped
    on, the per-binary forbidden-arg check must veto it."""
    tools = _import_tools()
    monkeypatch.setattr(tools, "AGENT_ALLOW_CODE_EXEC", True)
    for variant in (
        ["find", ".", "-exec", "rm", "{}", ";"],
        ["find", ".", "-execdir", "rm", "{}", ";"],
        ["find", ".", "-delete"],
        ["find", ".", "-fprint", "/tmp/x"],
    ):
        err = tools._check_command_policy(variant)
        assert err is not None, f"find escape leaked: {variant}"
        assert "not allowed" in err


# ── Tool sandbox — argv path guard (_check_argv_paths) ───────────────────────


def test_argv_paths_rejects_absolute():
    tools = _import_tools()
    err = tools.RunCommandTool._check_argv_paths(["cat", "/etc/passwd"])
    assert err is not None and "absolute" in err.lower()


def test_argv_paths_rejects_parent_traversal():
    tools = _import_tools()
    for variant in (
        ["cat", "../etc/passwd"],
        ["cat", "./../etc/passwd"],
        ["cat", "foo/../../bar"],
    ):
        err = tools.RunCommandTool._check_argv_paths(variant)
        assert err is not None, f"traversal leaked: {variant}"
        assert "parent traversal" in err


def test_argv_paths_rejects_windows_absolute():
    tools = _import_tools()
    err = tools.RunCommandTool._check_argv_paths(["cat", r"C:\Windows\System32"])
    assert err is not None and "absolute" in err.lower()


def test_argv_paths_allows_workspace_relative():
    tools = _import_tools()
    assert (
        tools.RunCommandTool._check_argv_paths(
            ["grep", "-r", "TODO", "src/"]
        )
        is None
    )


def test_argv_paths_allows_dotted_filename():
    """A file literally named ``..foo`` is unusual but legal and not
    a traversal. Make sure the split-based check does not over-reject."""
    tools = _import_tools()
    assert (
        tools.RunCommandTool._check_argv_paths(["cat", "..foo"]) is None
    )


# ── Per-API-key rate limit (Layer 2 extension) ───────────────────────────────


def test_rate_limit_ip_reject_skips_per_key_bucket_creation():
    """When the IP bucket already denies, the limiter must NOT allocate
    a per-key bucket. Closes a memory-DoS where a client whose IP is
    already capped rotates bearer tokens to force unbounded growth of
    the bucket map. Verified by inspecting the bucket store directly
    after the rejection."""
    from rate_limit import RateLimiter, _hash_key
    limiter = RateLimiter()
    klass = "read"  # /diagnostics — burst 30
    ip = "10.1.2.3"
    # Drain the IP bucket without any API key.
    for _ in range(40):
        allowed, _retry, k, scope = limiter.check(ip, "/diagnostics")
        if not allowed:
            assert scope == "ip"
            assert k == klass
            break
    # Verify the IP bucket exists, then send a request WITH a rotating
    # bearer token: the per-key bucket must NOT be created.
    assert ("ip", ip, klass) in limiter._buckets
    rotated_keys = [f"attacker-token-{i}" for i in range(50)]
    for tok in rotated_keys:
        allowed, _retry, _k, scope = limiter.check(
            ip, "/diagnostics", api_key=tok,
        )
        assert not allowed
        assert scope == "ip"
    # Bucket map must hold only the one IP bucket and nothing per-key.
    per_key_entries = [
        k for k in limiter._buckets.keys() if k[0] == "api_key"
    ]
    assert per_key_entries == [], (
        f"per-key buckets created despite IP rejection: {per_key_entries}"
    )


def test_rate_limit_per_api_key_caps_across_ips():
    """A leaked key cycling through synthetic IPs must still be capped
    on the per-key bucket. Drives the limiter directly so we can vary
    the IP without the TestClient's fixed source address."""
    from rate_limit import RateLimiter
    limiter = RateLimiter()
    key = "leaked-key-xyz"
    # /diagnostics → "read" class: burst 30, refill 10/s.
    saw_api_key_reject = False
    for i in range(60):
        allowed, _retry, _klass, scope = limiter.check(
            ip=f"10.0.0.{i % 250}",   # rotate IPs so per-IP never trips
            path="/diagnostics",
            api_key=key,
        )
        if not allowed and scope == "api_key":
            saw_api_key_reject = True
            break
    assert saw_api_key_reject, (
        "per-key bucket failed to cap a key cycling through IPs"
    )


def test_rate_limit_scope_in_envelope():
    client, _ = _fresh_client(
        {"GAUNTLET_RATE_LIMIT_DISABLED": "0", "GAUNTLET_API_KEY": "k"}
    )
    last = None
    for _ in range(60):
        r = client.get("/diagnostics", headers={"Authorization": "Bearer k"})
        if r.status_code == 429:
            last = r
            break
    assert last is not None, "rate limiter never tripped"
    body = last.json()
    assert body["detail"]["scope"] in ("ip", "api_key")
    assert last.headers.get("X-RateLimit-Scope") in ("ip", "api_key")


# ── Workspace-root fail-closed guard ─────────────────────────────────────────


def test_rate_limit_lru_eviction_bounds_bucket_count():
    """The bucket map must not grow without bound. After many distinct
    IPs the LRU eviction caps the dict at ``max_buckets`` entries."""
    from rate_limit import RateLimiter
    limiter = RateLimiter(max_buckets=100)
    for i in range(500):
        limiter.check(ip=f"10.{i // 256}.{(i // 16) % 16}.{i % 16}", path="/diagnostics")
    assert len(limiter._buckets) <= 100, (
        f"bucket map exceeded cap: {len(limiter._buckets)}"
    )


def test_composer_ttlstore_evicts_by_byte_budget():
    """The composer ``_TTLStore`` evicts in LRU order when the byte
    budget is exceeded, even if the entry-count cap is not hit. A
    single jumbo payload cannot pin RAM."""
    import asyncio as _asyncio
    from uuid import uuid4
    import composer as _composer

    store = _composer._TTLStore(
        ttl_seconds=60, max_entries=1000, max_bytes=10_000,
    )

    async def _exercise():
        # 20 entries of ~2 KB each → 40 KB total, well over the 10 KB
        # budget. Eviction must keep the byte total within the cap.
        for _ in range(20):
            await store.put(uuid4(), "x" * 2000)
        return store._bytes, len(store._data)

    bytes_total, entry_count = _asyncio.run(_exercise())
    assert bytes_total <= 10_000, (
        f"byte budget overrun: {bytes_total} > 10000"
    )
    # Should have evicted enough entries to fit the budget — exact
    # count depends on per-entry overhead but must be < 20.
    assert entry_count < 20


def test_workspace_root_refuses_filesystem_root(monkeypatch):
    """``_resolve_workspace_root`` must refuse to resolve to ``/``
    (or any other anchor) so a Dockerfile that forgets
    ``GAUNTLET_WORKSPACE`` cannot silently expose the container root
    to SAFE commands. Import the module under a safe env first
    (otherwise the module-level ``TOOL_WORKSPACE_ROOT = _resolve...()``
    would crash the import); then patch the env and re-call the
    resolver, which reads env at call time."""
    tools_mod = _import_tools()
    for bad in ("/", "C:\\", "C:/"):
        monkeypatch.setenv("GAUNTLET_WORKSPACE", bad)
        try:
            tools_mod._resolve_workspace_root()
        except RuntimeError as exc:
            assert "filesystem root" in str(exc), exc
        else:
            # On non-Windows hosts the Windows anchors won't round-trip
            # through Path(..).resolve() to their own anchor; skip those
            # cases when they resolve elsewhere rather than failing the
            # test. The ``/`` case is the one that matters in CI.
            if bad == "/":
                pytest.fail(f"resolver accepted {bad!r}")
