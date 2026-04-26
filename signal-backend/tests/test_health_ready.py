"""/health/ready emits 503 when degraded — and SIGNAL_MOCK counts as degraded."""

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client():
    # Importing inside the fixture so SIGNAL_MOCK from conftest is picked up
    # before server.lifespan reads it.
    from server import app
    with TestClient(app) as c:
        yield c


def test_health_is_always_200(client):
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["system"] == "Signal"
    assert body["mode"] == "mock"


def test_health_ready_is_503_in_mock_mode(client):
    res = client.get("/health/ready")
    # SIGNAL_MOCK=1 in tests → readiness reports degraded.
    assert res.status_code == 503
    detail = res.json()["detail"]
    assert detail["ready"] is False
    assert "mock_mode" in detail["reasons"]


def test_diagnostics_exposes_tools_registry(client):
    res = client.get("/diagnostics")
    assert res.status_code == 200
    body = res.json()
    names = [t["name"] for t in body["tools"]]
    # The 8-tool baseline.
    for expected in (
        "read_file", "list_directory", "run_command", "execute_python",
        "git", "web_search", "fetch_url", "package_info",
    ):
        assert expected in names
    # No phantom name.
    assert "web_fetch" not in names
    # System doctrine surfaced.
    assert any(d["id"] == "conservative_intelligence" for d in body["system_doctrine"])


def test_terminal_chamber_has_every_tool(client):
    """Terminal allowlist must list every tool by its real backend name.

    Regression for the silent gap: chambers/terminal.py used to ship
    `web_fetch` (phantom) and was missing `fetch_url` — so the agent
    could not actually call the URL fetcher. The diagnostics-driven
    UI surfaced this as `fetch_url chambers=[]`.
    """
    res = client.get("/diagnostics")
    body = res.json()
    by_name = {t["name"]: t for t in body["tools"]}
    for tool in (
        "read_file", "list_directory", "run_command", "execute_python",
        "git", "fetch_url", "web_search", "package_info",
    ):
        assert "terminal" in by_name[tool]["chambers"], (
            f"tool {tool!r} not allowed in terminal chamber — "
            "chambers/terminal.py drift?"
        )
