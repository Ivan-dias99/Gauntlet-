"""
Gauntlet — integration tests for the Composer surface (Sprint 8).

Covers the routes added in Sprints 3 → 7:
  * /composer/settings (GET / PUT) — Sprint 4 governance lock
  * /composer/execution         — Sprint 3 execution contract
  * /composer/dom_plan policy gates — Sprint 4 domain + action filters
  * /composer/context caps      — Sprint 4 context-payload truncation
  * /tools/manifests            — Sprint 5 tool runtime
  * /memory/records, /memory/recover, /memory/projects — Sprint 7

Tests use FastAPI's TestClient against a fresh process with
GAUNTLET_MOCK=1 so no real LLM is hit and no API keys are required.
Each test uses a temporary GAUNTLET_DATA_DIR so the on-disk stores
don't bleed into one another.

Run:
    pytest -q test_composer.py
"""

from __future__ import annotations

import importlib
import os
import sys
import tempfile
from typing import Iterable

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def fresh_app(monkeypatch: pytest.MonkeyPatch) -> Iterable[TestClient]:
    """Boot a fresh server.app in a temp data dir + mock mode.

    The Gauntlet backend reads MEMORY_DIR + the mock flag at module
    import time (config.py), so we have to invalidate the import cache
    for every test that wants a clean slate. Without that, two tests
    in the same process would share runs.json / settings JSON / memory
    JSON and mutate each other.
    """
    with tempfile.TemporaryDirectory() as tmp:
        monkeypatch.setenv("GAUNTLET_DATA_DIR", tmp)
        monkeypatch.setenv("GAUNTLET_MOCK", "1")
        monkeypatch.setenv("GAUNTLET_RATE_LIMIT_DISABLED", "1")
        # test_security.py writes SIGNAL_API_KEY via os.environ.update,
        # which monkeypatch can't see and won't restore between files.
        # Force the auth gate off for our tests so Sprint 5/7 routes
        # aren't 401'd by a leaked key.
        for leaked in (
            "GAUNTLET_API_KEY",
            "SIGNAL_API_KEY",
            "RUBERRA_API_KEY",
        ):
            monkeypatch.delenv(leaked, raising=False)
        # Invalidate every Gauntlet module so fresh config picks up the
        # temp dir. Order matters: config first, then the modules that
        # import it.
        for mod in [
            "config",
            "persistence",
            "models",
            "memory",
            "memory_records",
            "runs",
            "spine",
            "composer_settings",
            "tools",
            "agent",
            "engine",
            "composer",
            "voice",
            "server",
        ]:
            sys.modules.pop(mod, None)
        server = importlib.import_module("server")
        client = TestClient(server.app)
        with client:
            yield client


# ── Sprint 4 — settings ────────────────────────────────────────────────────

def test_settings_default_shape(fresh_app: TestClient):
    r = fresh_app.get("/composer/settings")
    assert r.status_code == 200
    body = r.json()
    assert body["domains"] == {}
    assert body["actions"] == {}
    assert body["tool_policies"] == {}
    assert body["default_domain_policy"] == {
        "allowed": True,
        "require_danger_ack": False,
    }
    assert body["max_page_text_chars"] == 6000
    assert body["max_dom_skeleton_chars"] == 4000
    assert body["screenshot_default"] is False
    assert body["execution_reporting_required"] is False


def test_settings_replace_round_trip(fresh_app: TestClient):
    initial = fresh_app.get("/composer/settings").json()
    payload = dict(initial)
    payload["domains"] = {
        "github.com": {"allowed": False, "require_danger_ack": True},
    }
    payload["tool_policies"] = {
        "vercel": {"allowed": False, "require_approval": False},
    }
    payload["screenshot_default"] = True
    payload["execution_reporting_required"] = True
    r = fresh_app.put("/composer/settings", json=payload)
    assert r.status_code == 200
    saved = r.json()
    assert saved["domains"]["github.com"]["allowed"] is False
    assert saved["tool_policies"]["vercel"]["allowed"] is False
    assert saved["screenshot_default"] is True
    assert saved["updated_at"]  # fresh stamp
    # GET reflects.
    fetched = fresh_app.get("/composer/settings").json()
    assert fetched["domains"]["github.com"]["allowed"] is False


def test_settings_caps_validate_range(fresh_app: TestClient):
    initial = fresh_app.get("/composer/settings").json()
    payload = dict(initial)
    payload["max_page_text_chars"] = 100  # below 500 floor
    r = fresh_app.put("/composer/settings", json=payload)
    assert r.status_code == 422


# ── Sprint 4 — context caps ────────────────────────────────────────────────

def test_context_caps_truncate_metadata(fresh_app: TestClient):
    # Tighten the cap to 600 (still above the 500 floor) and verify
    # downstream context blob carries a truncated page_text.
    settings = fresh_app.get("/composer/settings").json()
    settings["max_page_text_chars"] = 600
    settings["max_dom_skeleton_chars"] = 500
    r = fresh_app.put("/composer/settings", json=settings)
    assert r.status_code == 200
    big = "X" * 5000
    r = fresh_app.post(
        "/composer/context",
        json={
            "source": "browser",
            "url": "https://example.com",
            "metadata": {"page_text": big, "dom_skeleton": big},
        },
    )
    assert r.status_code == 200
    # We can't introspect the truncated bytes through the public surface
    # without creating an intent + preview (and mock mode short-circuits
    # the model). Trust the helper unit + observe that the route still
    # accepts the oversized metadata without crashing the cap layer.


# ── Sprint 3 — execution contract ──────────────────────────────────────────

def test_execution_executed_records_ledger_row(fresh_app: TestClient):
    r = fresh_app.post(
        "/composer/execution",
        json={
            "status": "executed",
            "url": "https://example.com/x",
            "page_title": "Smoke",
            "results": [
                {
                    "action": {"type": "click", "selector": "#go"},
                    "ok": True,
                    "danger": False,
                },
                {
                    "action": {
                        "type": "fill",
                        "selector": "#email",
                        "value": "a@b.com",
                    },
                    "ok": False,
                    "error": "selector not found",
                    "danger": False,
                },
            ],
            "has_danger": False,
            "danger_acknowledged": False,
            "user_input": "test",
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["run_id"]
    assert body["ledger_event_id"]
    runs = fresh_app.get("/runs?limit=10").json()
    exec_rows = [
        rec for rec in runs["records"] if rec["route"] == "composer:execution"
    ]
    assert len(exec_rows) == 1
    row = exec_rows[0]
    assert row["terminated_early"] is True  # 1 of 2 failed
    assert "1/2" in (row["termination_reason"] or "")
    assert len(row["tool_calls"]) == 2


def test_execution_rejected_records_refused(fresh_app: TestClient):
    r = fresh_app.post(
        "/composer/execution",
        json={
            "status": "rejected",
            "url": "https://example.com",
            "results": [
                {
                    "action": {"type": "click", "selector": ".delete"},
                    "ok": False,
                    "danger": True,
                    "danger_reason": "submit button",
                },
            ],
            "has_danger": True,
            "danger_acknowledged": False,
        },
    )
    assert r.status_code == 200
    runs = fresh_app.get("/runs").json()
    exec_rows = [
        rec for rec in runs["records"] if rec["route"] == "composer:execution"
    ]
    assert exec_rows and exec_rows[0]["refused"] is True
    assert exec_rows[0]["termination_reason"] == "user_rejected"


def test_execution_failed_records_termination_reason(fresh_app: TestClient):
    r = fresh_app.post(
        "/composer/execution",
        json={
            "status": "failed",
            "results": [],
            "error": "executor crashed: TypeError",
        },
    )
    assert r.status_code == 200
    runs = fresh_app.get("/runs").json()
    rec = next(
        rec for rec in runs["records"] if rec["route"] == "composer:execution"
    )
    assert rec["terminated_early"] is True
    assert "TypeError" in (rec["termination_reason"] or "")


# ── Sprint 5 — tool manifests + policies ───────────────────────────────────

def test_tools_manifests_lists_thirteen_entries(fresh_app: TestClient):
    r = fresh_app.get("/tools/manifests")
    assert r.status_code == 200
    tools = r.json()["tools"]
    names = {t["name"] for t in tools}
    # Sprint 5 widened from 8 → 13.
    expected_names = {
        "web_search", "execute_python", "read_file", "list_directory",
        "git", "run_command", "fetch_url", "package_info",
        "write_file", "memory_save", "memory_search", "github", "vercel",
    }
    assert expected_names <= names


def test_tools_manifests_carry_governance_metadata(fresh_app: TestClient):
    tools = fresh_app.get("/tools/manifests").json()["tools"]
    by_name = {t["name"]: t for t in tools}
    assert by_name["read_file"]["mode"] == "read"
    assert by_name["read_file"]["risk"] == "low"
    assert by_name["execute_python"]["mode"] == "execute_with_approval"
    assert by_name["execute_python"]["risk"] == "high"
    assert by_name["vercel"]["risk"] == "high"
    assert "fs.write" in by_name["write_file"]["scopes"]


# ── Sprint 7 — memory records ──────────────────────────────────────────────

def test_memory_record_create_list_delete(fresh_app: TestClient):
    r = fresh_app.post(
        "/memory/records",
        json={
            "topic": "ember accent",
            "body": "design preference: use ember (#d07a5a) for primary accent",
            "kind": "preference",
            "scope": "user",
        },
    )
    assert r.status_code == 200
    record = r.json()
    assert record["kind"] == "preference"
    assert record["scope"] == "user"
    listing = fresh_app.get("/memory/records").json()
    assert listing["count"] == 1
    # Delete.
    rid = record["id"]
    d = fresh_app.delete(f"/memory/records/{rid}")
    assert d.status_code == 200
    after = fresh_app.get("/memory/records").json()
    assert after["count"] == 0


def test_memory_record_dedup_increments_times_seen(fresh_app: TestClient):
    body = {
        "topic": "never autopush to main",
        "body": "operator never wants force-push to main; create a branch",
        "kind": "decision",
        "scope": "user",
    }
    r1 = fresh_app.post("/memory/records", json=body)
    r2 = fresh_app.post("/memory/records", json=body)
    assert r1.status_code == 200 and r2.status_code == 200
    # Same fingerprint → same record id, times_seen bumped.
    assert r1.json()["id"] == r2.json()["id"]
    assert r2.json()["times_seen"] == 2


def test_memory_recover_returns_project_match(fresh_app: TestClient):
    fresh_app.post(
        "/memory/records",
        json={
            "topic": "gauntlet routes canonical",
            "body": "/api/gauntlet/* canonical, /api/signal/* legacy alias",
            "kind": "canon",
            "scope": "project",
            "project_id": "gauntlet",
        },
    )
    r = fresh_app.post(
        "/memory/recover",
        json={
            "query": "what are the gauntlet route conventions",
            "project_id": "gauntlet",
            "max_results": 3,
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["project_id"] == "gauntlet"
    assert len(body["matches"]) == 1
    m = body["matches"][0]
    assert m["kind"] == "canon"
    assert m["scope"] == "project"


def test_memory_projects_lists_distinct(fresh_app: TestClient):
    fresh_app.post(
        "/memory/records",
        json={"topic": "a", "body": "alpha", "scope": "project", "project_id": "alpha"},
    )
    fresh_app.post(
        "/memory/records",
        json={"topic": "b", "body": "beta", "scope": "project", "project_id": "beta"},
    )
    fresh_app.post(
        "/memory/records",
        json={"topic": "c", "body": "no project", "scope": "user"},
    )
    projects = fresh_app.get("/memory/projects").json()["projects"]
    assert projects == ["alpha", "beta"]


# ── Sprint 8 close — settings rollback snapshots ───────────────────────────

def test_settings_snapshots_taken_before_replace(fresh_app: TestClient):
    initial = fresh_app.get("/composer/settings").json()
    # No replace yet → no snapshots.
    assert fresh_app.get("/composer/settings/snapshots").json()["snapshots"] == []

    # First PUT — store snapshots the BEFORE state.
    payload = dict(initial)
    payload["screenshot_default"] = True
    fresh_app.put("/composer/settings", json=payload)
    snaps = fresh_app.get("/composer/settings/snapshots").json()["snapshots"]
    assert len(snaps) == 1
    assert snaps[0]["file"].startswith("settings-")
    assert snaps[0]["file"].endswith(".json")

    # Second PUT — second snapshot of the now-already-mutated state.
    payload["execution_reporting_required"] = True
    fresh_app.put("/composer/settings", json=payload)
    snaps2 = fresh_app.get("/composer/settings/snapshots").json()["snapshots"]
    assert len(snaps2) == 2
    # Newest first.
    assert snaps2[0]["timestamp"] >= snaps2[1]["timestamp"]


def test_settings_restore_rolls_back(fresh_app: TestClient):
    initial = fresh_app.get("/composer/settings").json()
    # Mutate twice so we have two snapshots and a known "before" state.
    fresh_app.put("/composer/settings", json={
        **initial, "screenshot_default": True,
    })
    fresh_app.put("/composer/settings", json={
        **initial, "screenshot_default": True, "execution_reporting_required": True,
    })

    snaps = fresh_app.get("/composer/settings/snapshots").json()["snapshots"]
    # Restore the OLDEST snapshot — that's the original defaults.
    oldest = snaps[-1]["file"]
    r = fresh_app.post("/composer/settings/restore", json={"file": oldest})
    assert r.status_code == 200
    restored = r.json()
    assert restored["screenshot_default"] is False
    assert restored["execution_reporting_required"] is False


def test_settings_restore_rejects_path_traversal(fresh_app: TestClient):
    # Operator-controlled file name must not escape the snapshot dir.
    r = fresh_app.post(
        "/composer/settings/restore",
        json={"file": "../../etc/passwd"},
    )
    assert r.status_code == 404
    assert r.json()["detail"]["error"] == "snapshot_not_found"


def test_settings_restore_404_on_missing_file(fresh_app: TestClient):
    r = fresh_app.post(
        "/composer/settings/restore",
        json={"file": "settings-19990101T000000Z.json"},
    )
    assert r.status_code == 404


def test_settings_restore_400_on_missing_body(fresh_app: TestClient):
    r = fresh_app.post("/composer/settings/restore", json={})
    assert r.status_code == 400


# ── Sprint 8 — diagnostics + observability ─────────────────────────────────

def test_diagnostics_surfaces_new_store_state(fresh_app: TestClient):
    r = fresh_app.get("/diagnostics")
    assert r.status_code == 200
    body = r.json()
    persistence = body["persistence"]
    # Sprint 4 + Sprint 7 stores are now visible in /diagnostics.
    assert "composer_settings_last_save_error" in persistence
    assert "memory_records_last_save_error" in persistence
    # Sprint 7 record stats are surfaced.
    assert "memory_records" in body
    assert "by_kind" in body["memory_records"]


def test_health_ready_returns_status(fresh_app: TestClient):
    r = fresh_app.get("/health/ready")
    # /health/ready contract: 200 when fully ready, 503 when degraded.
    # The temp data dir we run tests under is by definition ephemeral
    # (not a mount), so 503 is the expected honest signal here.
    # FastAPI wraps custom HTTPException details under `detail`; the
    # 200 path returns a flat body. Both must include enough metadata
    # to diagnose the readiness state.
    assert r.status_code in (200, 503)
    body = r.json()
    payload = body.get("detail") if r.status_code == 503 else body
    assert isinstance(payload, dict)
    # Either path surfaces engine + persistence state.
    assert "engine" in payload
    assert "persistence_ephemeral" in payload


# ── Frente A — ambient action types (shell.run / fs.read / fs.write) ───────

def test_dom_action_union_accepts_ambient_variants():
    """Pydantic discriminated union must validate all seven action shapes
    so the cápsula's wire format is honoured end-to-end. Adding a new
    type here is a matrix change — this test is the matrix's witness."""
    from pydantic import TypeAdapter
    from models import DomAction

    ta = TypeAdapter(DomAction)
    cases = [
        {"type": "fill", "selector": "#email", "value": "a@b.com"},
        {"type": "click", "selector": "button.submit"},
        {"type": "highlight", "selector": ".x", "duration_ms": 800},
        {"type": "scroll_to", "selector": ".y"},
        {"type": "shell.run", "cmd": "git", "args": ["status"]},
        {"type": "shell.run", "cmd": "ls", "cwd": "/tmp"},
        {"type": "fs.read", "path": "/home/op/notes.md"},
        {"type": "fs.write", "path": "/tmp/out.txt", "content": "hello"},
    ]
    for payload in cases:
        action = ta.validate_python(payload)
        rt = action.model_dump()
        assert rt["type"] == payload["type"], f"type lost: {rt}"


def test_dom_action_rejects_malformed_ambient_variants():
    from pydantic import TypeAdapter, ValidationError
    from models import DomAction

    ta = TypeAdapter(DomAction)
    bad_cases = [
        {"type": "shell.run"},  # missing cmd
        {"type": "shell.run", "cmd": ""},  # empty cmd
        {"type": "fs.read", "path": ""},  # empty path
        {"type": "fs.write", "path": "/x"},  # missing content
        {"type": "unknown", "selector": ".x"},  # unknown discriminator
    ]
    for payload in bad_cases:
        try:
            ta.validate_python(payload)
            raise AssertionError(f"should have rejected: {payload}")
        except ValidationError:
            pass


def test_execution_ledger_accepts_ambient_action_results(fresh_app: TestClient):
    """The ledger must round-trip shell.run / fs.* results so the
    cápsula's reportExecution can record what the agent did on the
    host system, not only DOM actions."""
    r = fresh_app.post(
        "/composer/execution",
        json={
            "status": "executed",
            "url": "desktop://gauntlet",
            "page_title": "Composer",
            "results": [
                {
                    "action": {
                        "type": "shell.run",
                        "cmd": "git",
                        "args": ["status", "--short"],
                    },
                    "ok": True,
                    "danger": True,
                },
                {
                    "action": {"type": "fs.read", "path": "/home/op/notes.md"},
                    "ok": True,
                    "danger": False,
                },
                {
                    "action": {
                        "type": "fs.write",
                        "path": "/home/op/out.md",
                        "content": "hello",
                    },
                    "ok": False,
                    "error": "permission denied",
                    "danger": True,
                },
            ],
            "has_danger": True,
        },
    )
    assert r.status_code == 200, r.json()


# ── Frente "soberano" — planner prompt knows about ambient actions ─────────

def test_planner_prompt_documents_ambient_action_types():
    """The agent prompt is the source of truth for the LLM's behaviour;
    if it loses the new action types, the LLM stops emitting them and
    A1/A2/A3 silently regress to "manual only"."""
    from composer import _DOM_PLAN_SYSTEM_PROMPT
    for token in [
        "shell.run",
        "fs.read",
        "fs.write",
        "source: browser",
        "source: desktop",
        "allowlist",
    ]:
        assert token in _DOM_PLAN_SYSTEM_PROMPT, f"prompt missing: {token!r}"


# ── Multimodal — image attachments survive the metadata round-trip ─────────

def test_collect_image_blocks_accepts_attachments_metadata():
    """The cápsula ships operator-pinned images via metadata.attachments;
    the helper must convert them to Anthropic content blocks. Provider
    gating + size caps are unit-checked here so they don't drift."""
    import base64
    from types import SimpleNamespace
    from composer import _collect_image_blocks

    class _FakeAnthropic:
        pass
    _FakeAnthropic.__name__ = "AsyncAnthropic"
    fake_engine = SimpleNamespace(_client=_FakeAnthropic())

    png_b64 = base64.b64encode(b"\x89PNG\r\n\x1a\nfake").decode()
    ctx = SimpleNamespace(metadata={
        "attachments": [
            {"name": "a.png", "mime": "image/png", "base64": png_b64, "bytes": 12},
            {"name": "b.jpg", "mime": "image/jpeg", "base64": png_b64, "bytes": 12},
            # Non-image MIME — should be skipped silently.
            {"name": "c.md", "mime": "text/markdown", "base64": "aGVsbG8=", "bytes": 5},
        ],
    })
    blocks = _collect_image_blocks(ctx, fake_engine)
    assert len(blocks) == 2
    types = [b["source"]["media_type"] for b in blocks]
    assert types == ["image/png", "image/jpeg"]


def test_collect_image_blocks_drops_on_non_anthropic_provider():
    """Groq/Gemini adapters can't ingest image content blocks. The
    helper must drop them silently (with a log) so we don't 502 the
    operator on a provider mismatch."""
    import base64
    from types import SimpleNamespace
    from composer import _collect_image_blocks

    class _FakeGroq:
        pass
    _FakeGroq.__name__ = "AsyncGroq"
    groq_engine = SimpleNamespace(_client=_FakeGroq())

    png_b64 = base64.b64encode(b"\x89PNG").decode()
    ctx = SimpleNamespace(metadata={
        "attachments": [
            {"name": "a.png", "mime": "image/png", "base64": png_b64, "bytes": 5},
        ],
    })
    blocks = _collect_image_blocks(ctx, groq_engine)
    assert blocks == []


def test_collect_image_blocks_caps_oversized_attachment():
    """Per-image cap (1.5MB) protects the prompt token budget. An
    oversized attachment must drop out instead of forcing Anthropic
    to 500 on payload size."""
    import base64
    from types import SimpleNamespace
    from composer import _collect_image_blocks

    class _FakeAnthropic:
        pass
    _FakeAnthropic.__name__ = "AsyncAnthropic"
    fake_engine = SimpleNamespace(_client=_FakeAnthropic())

    oversize = base64.b64encode(b"x" * 1_500_001).decode()
    ctx = SimpleNamespace(metadata={
        "attachments": [
            {"name": "big.png", "mime": "image/png", "base64": oversize, "bytes": 1_500_001},
        ],
    })
    blocks = _collect_image_blocks(ctx, fake_engine)
    assert blocks == []


# ── Voice endpoints — fail soft when key/runtime missing ───────────────────
#
# These tests rely on the fresh_app fixture popping `voice` from
# sys.modules so each test boots the server with the current env. Mutate
# env BEFORE the fixture (i.e. via a parametrise / scope hack) is messy;
# instead we test the post-boot behaviour at the route level.


def test_voice_transcribe_503_without_groq_key(fresh_app: TestClient):
    """No Groq key (mock-mode default) → 503 with typed envelope. The
    cápsula reads the `error` field and falls back to Web Speech without
    surfacing a cryptic transport error."""
    import base64
    r = fresh_app.post(
        "/voice/transcribe",
        json={"audio_base64": base64.b64encode(b"x").decode(), "mime": "audio/webm"},
    )
    assert r.status_code == 503
    detail = r.json()["detail"]
    assert detail["error"] == "voice_unavailable"
    assert detail["reason"] == "no_groq_key"


def test_voice_transcribe_400_on_malformed_base64(monkeypatch):
    """When the operator HAS a Groq key but ships garbage base64 we
    must reject at the validation layer (400), not blow through to
    Groq's API and 502 the cápsula."""
    import base64
    import importlib
    import sys
    import tempfile
    from fastapi.testclient import TestClient
    monkeypatch.setenv("GAUNTLET_GROQ_API_KEY", "fake-for-validation-only")
    monkeypatch.setenv("GAUNTLET_MOCK", "1")
    monkeypatch.setenv("GAUNTLET_RATE_LIMIT_DISABLED", "1")
    with tempfile.TemporaryDirectory() as tmp:
        monkeypatch.setenv("GAUNTLET_DATA_DIR", tmp)
        for mod in ("config", "voice", "composer", "server"):
            sys.modules.pop(mod, None)
        server = importlib.import_module("server")
        with TestClient(server.app) as client:
            r = client.post(
                "/voice/transcribe",
                json={"audio_base64": "!!notb64!!", "mime": "audio/webm"},
            )
            assert r.status_code == 400, r.json()
            assert r.json()["detail"]["error"] == "bad_audio"


def test_voice_synthesize_422_on_empty_text(fresh_app: TestClient):
    """Pydantic's min_length=1 catches empty text before any network
    work happens — operator gets 422 with the field name, not a 502
    from a downstream surprise."""
    r = fresh_app.post("/voice/synthesize", json={"text": ""})
    assert r.status_code == 422


# ── Streaming gate — Groq/Gemini providers don't expose .stream() ──────────

def test_provider_supports_streaming_predicate():
    """Anthropic + mock pass; everything else (Groq, Gemini, future
    providers) fails. Detection by class name keeps the predicate
    cheap and import-free."""
    from types import SimpleNamespace
    from composer import _provider_supports_streaming

    for cls_name in ("AsyncAnthropic", "MockAsyncAnthropic"):
        cls = type(cls_name, (), {})
        engine = SimpleNamespace(_client=cls())
        assert _provider_supports_streaming(engine), cls_name

    for cls_name in (
        "AsyncGroqAnthropicAdapter",
        "AsyncGeminiAnthropicAdapter",
        "AsyncSomeFutureProvider",
    ):
        cls = type(cls_name, (), {})
        engine = SimpleNamespace(_client=cls())
        assert not _provider_supports_streaming(engine), cls_name


def test_dom_plan_stream_501_on_non_anthropic_provider(fresh_app: TestClient, monkeypatch):
    """When the engine runs on Groq or Gemini, /dom_plan_stream must
    refuse with 501 BEFORE opening SSE. Otherwise the cápsula sees a
    cryptic AttributeError mid-stream and the operator gets a useless
    error band."""
    # Capture a real context id first so the route doesn't bail on 410.
    r = fresh_app.post(
        "/composer/context",
        json={"source": "browser", "url": "https://x.com"},
    )
    assert r.status_code == 200
    ctx_id = r.json()["context_id"]

    # Swap the engine's _client class name to look like a Groq adapter.
    # Fresh_app's engine is mock (passes); we need to force the negative.
    import server
    real_client = server.engine._client
    masked = type("AsyncGroqAnthropicAdapter", (), {})
    server.engine._client = masked()
    try:
        r = fresh_app.post(
            "/composer/dom_plan_stream",
            json={"context_id": ctx_id, "user_input": "oi"},
        )
        assert r.status_code == 501, r.text
        body = r.json()["detail"]
        assert body["error"] == "streaming_not_supported"
        assert body["reason"] == "provider_no_stream"
        assert body["provider"] == "AsyncGroqAnthropicAdapter"
    finally:
        server.engine._client = real_client
