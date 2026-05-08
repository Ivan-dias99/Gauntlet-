"""
Gauntlet — engine boot-time provider selection tests.

The Engine constructor picks one of four code paths based on which env
vars are set, in this precedence (Groq agora é primário; Anthropic e
Gemini estão em pausa desde 2026-05-08, sessão hora-seria):
  1. GAUNTLET_MOCK=1            → MockAsyncAnthropic
  2. GAUNTLET_GROQ_API_KEY      → AsyncGroqAnthropicAdapter (PRIMARY)
  3. ANTHROPIC_API_KEY          → AsyncAnthropic (paused path)
  4. GAUNTLET_GEMINI_API_KEY    → AsyncGeminiAnthropicAdapter (paused)
  5. nothing set                → RuntimeError on init

Without these tests a regression in the conditional ladder (e.g. moving
Groq below Gemini, or accidentally short-circuiting on the wrong key)
goes unnoticed until prod can't reach Anthropic and the fallback never
fires. The tests stub each provider class with a sentinel so we don't
need real keys or network — the only thing being exercised is the
selection ladder itself.

Run:
    pytest -q test_engine_init.py
"""

from __future__ import annotations

import importlib
import os
import sys

import pytest


def _reset_modules():
    # NÃO incluir groq_provider / gemini_provider aqui — esses são
    # injectados pela fixture stubbed_engine como sentinelas, e remover
    # do sys.modules força o engine a re-importar do disco a versão real,
    # quebrando os asserts de isinstance contra os sentinelas.
    for mod in (
        "config",
        "engine",
        "model_gateway",
    ):
        sys.modules.pop(mod, None)


def _scrub_env(monkeypatch):
    for key in (
        "GAUNTLET_MOCK",
        "ANTHROPIC_API_KEY",
        "GAUNTLET_GROQ_API_KEY",
        "GROQ_API_KEY",
        "GAUNTLET_GEMINI_API_KEY",
        "GEMINI_API_KEY",
        "GOOGLE_API_KEY",
    ):
        monkeypatch.delenv(key, raising=False)


@pytest.fixture
def stubbed_engine(monkeypatch):
    """Yield a freshly-imported `engine` module with the SDK clients
    swapped for cheap sentinels. Tests can assert which sentinel got
    instantiated without paying the import cost of the real clients."""
    _scrub_env(monkeypatch)
    _reset_modules()

    class _Sentinel:
        def __init__(self, *_, **__):
            pass

    # Patch the constructors at import time. We import `anthropic` first
    # so the engine's `from anthropic import AsyncAnthropic` resolves to
    # our sentinel; same trick for the two adapter modules.
    import anthropic  # noqa: F401 (real module exists; we mutate it)

    monkeypatch.setattr("anthropic.AsyncAnthropic", _Sentinel, raising=True)
    # The adapter modules are imported lazily inside Engine.__init__,
    # so we install fakes in sys.modules before the import happens.
    import types

    groq_mod = types.ModuleType("groq_provider")

    class _GroqSentinel(_Sentinel):
        pass

    groq_mod.AsyncGroqAnthropicAdapter = _GroqSentinel  # type: ignore[attr-defined]
    sys.modules["groq_provider"] = groq_mod

    gemini_mod = types.ModuleType("gemini_provider")

    class _GeminiSentinel(_Sentinel):
        pass

    gemini_mod.AsyncGeminiAnthropicAdapter = _GeminiSentinel  # type: ignore[attr-defined]
    sys.modules["gemini_provider"] = gemini_mod

    yield {
        "Anthropic": _Sentinel,
        "Groq": _GroqSentinel,
        "Gemini": _GeminiSentinel,
    }

    # Clean up so other test files re-import freshly.
    sys.modules.pop("groq_provider", None)
    sys.modules.pop("gemini_provider", None)
    _reset_modules()


def _build_engine():
    """Re-import engine so config snapshots the freshly-set env."""
    _reset_modules()
    engine_mod = importlib.import_module("engine")
    # Class name is SignalEngine (legacy from Signal pre-rename window —
    # never officially renamed despite GAUNTLET_* canon for env vars).
    return engine_mod.SignalEngine()


def test_mock_wins_over_every_other_key(stubbed_engine, monkeypatch):
    monkeypatch.setenv("GAUNTLET_MOCK", "1")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-real")
    monkeypatch.setenv("GAUNTLET_GROQ_API_KEY", "gsk_real")
    monkeypatch.setenv("GAUNTLET_GEMINI_API_KEY", "AIza_real")
    eng = _build_engine()
    from mock_client import MockAsyncAnthropic

    assert isinstance(eng._client, MockAsyncAnthropic), (
        "GAUNTLET_MOCK=1 must short-circuit before any provider key"
    )


def test_groq_wins_when_set(stubbed_engine, monkeypatch):
    """Groq é primário desde 2026-05-08. Mesmo com Anthropic + Gemini
    setados, Groq ganha quando GAUNTLET_GROQ_API_KEY está presente."""
    monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-real")
    monkeypatch.setenv("GAUNTLET_GROQ_API_KEY", "gsk_real")
    monkeypatch.setenv("GAUNTLET_GEMINI_API_KEY", "AIza_real")
    eng = _build_engine()
    assert isinstance(eng._client, stubbed_engine["Groq"]), (
        "GAUNTLET_GROQ_API_KEY must take precedence over Anthropic + Gemini"
    )


def test_anthropic_picked_when_groq_missing(stubbed_engine, monkeypatch):
    """Anthropic em PAUSA — só corre se o operador a escolher
    explicitamente sem ter chave Groq."""
    monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-real")
    monkeypatch.setenv("GAUNTLET_GEMINI_API_KEY", "AIza_real")
    eng = _build_engine()
    assert isinstance(eng._client, stubbed_engine["Anthropic"]), (
        "Anthropic must beat Gemini when Groq is absent"
    )


def test_gemini_picked_when_only_gemini_set(stubbed_engine, monkeypatch):
    """Gemini é o último fallback (também pausado). Só corre quando
    nem Groq nem Anthropic têm chave."""
    monkeypatch.setenv("GAUNTLET_GEMINI_API_KEY", "AIza_real")
    eng = _build_engine()
    assert isinstance(eng._client, stubbed_engine["Gemini"]), (
        "Gemini fires only when neither Groq nor Anthropic are set"
    )


def test_no_keys_no_mock_raises(stubbed_engine, monkeypatch):
    # _scrub_env already ran in the fixture. Constructor must refuse.
    with pytest.raises(RuntimeError, match="No provider key set"):
        _build_engine()
