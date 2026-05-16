# ADR-0002 · Model gateway is a catalogue, not an HTTP funnel

**Status**: Accepted (retroactive)
**Date**: 2026-05-11
**Deciders**: Ivan Fernandes
**Tags**: backend, architecture, provider-routing, doctrine
**Supersedes**: nothing
**Superseded by**: nothing

---

## Context

`backend/model_gateway.py` exists to centralize how the system selects and records model calls. An earlier framing of this module suggested it should be a single funnel through which every provider HTTP call passes — i.e., that nothing else in the backend would ever import `anthropic`, `groq`, or `google.generativeai` directly.

That framing was incorrect. By 2026-05, the actual code shape on main is:

- `model_gateway.py` holds a `CATALOGUE` dict, a `select(role)` function, a `record(GatewayCall)` function, and a `fallback(role, failed_model_id)` function.
- Several other backend modules — `engine.py`, `agent.py`, `mock_client.py`, `groq_provider.py`, `gemini_provider.py` — import provider SDKs directly and make the HTTP calls themselves.
- These modules call `gateway.select(...)` to pick a model, then call the provider, then call `gateway.record(...)`.

This is **catalogue + routing + recording**, not HTTP funnel. The skill `gauntlet-backend-spine` v1.0 partially captured this but kept residual language suggesting a funnel. The contradiction needs to be settled.

There is also a known anti-pattern on main: `composer.py` `_route_model(intent, ctx)` hard-codes `primary_model="claude-opus-4-7"` strings for several intents (lines ~243-285). This duplicates gateway policy and bypasses the catalogue. It must be remediated.

## Decision

The model gateway is **a catalogue + routing + recording layer**, with three responsibilities:

1. **Catalogue** — `CATALOGUE` in `model_gateway.py` is the single source of truth for which `model_id` strings the system is allowed to use, with cost approximations and provider mapping.
2. **Selection** — `gateway.select(role)` takes a semantic role (`triad`, `judge`, `agent`, `distill`, `surface`, `compress`, `validate`, `default`) and returns a `ModelChoice`. Callers ask for a role; the gateway picks the model.
3. **Recording + fallback** — `gateway.record(GatewayCall)` writes a structured row used by `/diagnostics` and the runs ledger. `gateway.fallback(role, failed_model_id)` returns the next-best choice when a provider fails.

Provider HTTP calls happen in **five designated client modules** only:

| Module | Purpose | May import provider SDK |
|---|---|---|
| `engine.py` | Triad + judge orchestration | `from anthropic import AsyncAnthropic` |
| `agent.py` | Tool-using agent loop | `from anthropic import AsyncAnthropic` |
| `mock_client.py` | Deterministic responses under `GAUNTLET_MOCK=1` | ambient (no external SDK) |
| `groq_provider.py` | Groq adapter | Groq SDK / HTTP client |
| `gemini_provider.py` | Gemini adapter | Gemini SDK / HTTP client |

Every other module — `composer.py`, `routers/*.py`, `tools.py`, anywhere else — must call `gateway.select(role)` and consume one of the five designated clients. **Direct provider SDK imports outside this list are forbidden.**

The verifier check, runnable from anywhere in the repo:

```bash
grep -rE "(from anthropic|from groq|from openai|from google\\.generativeai|import anthropic|import groq|import openai)" \
  backend/ --include="*.py" \
  | grep -v -E "(engine|agent|mock_client|groq_provider|gemini_provider)\\.py:"
```

This must return zero matches. Any match is a regression.

### Remediation of `composer.py` `_route_model`

The hard-coded model strings in `composer.py` `_route_model(intent, ctx)` are a known anti-pattern. Two acceptable remediation paths:

- **Option A** — Add intent-aware roles to `CATALOGUE`: `select("composer-code")`, `select("composer-summarize")`, `select("composer-analyze")`, etc. `composer.py` calls these instead of constructing `ModelRoute` directly.
- **Option B** — Map composer intents to existing gateway roles at the composer site: `code` → `agent`, `summarize` → `compress`, `analyze` → `triad`, `generate` → `default`. `composer.py` calls `gateway.select(<mapped_role>)` without naming model_ids.

The choice between A and B is delegated to whoever does the remediation. Whichever is picked, the closure check is: no `claude-opus-4-7` (or any `primary_model="…"` string) appears in `composer.py` after the patch.

## Consequences

**Positive:**

- New code that needs a model call has one obvious place to plug in: it calls `gateway.select(role)` and uses an existing designated client. No new SDK imports proliferate.
- Cost accounting and run ledger are centralized — every call goes through `gateway.record(...)`. Silent paths are excluded by construction.
- Provider precedence (see ADR-0003) is enforced at one layer, not duplicated.
- The five designated clients are explicit, finite, and reviewable. Adding a sixth requires a new ADR.

**Negative:**

- Anyone reading `gauntlet-backend-spine` v1.0 in isolation might have read "gateway is a funnel" and tried to enforce it. v1.1 of that skill clarifies. The contradiction is captured in this ADR.
- Adding a new provider (e.g. OpenAI, Mistral) requires three coordinated edits: add to `CATALOGUE`, add to `gateway.summary()` cost rules, create a new designated client module. This is by design — splitting one of those steps is the regression we're guarding against.

**Neutral:**

- The chosen architecture is uncommon. Most projects either (a) funnel through a single client wrapper, or (b) let every module import providers freely. Gauntlet sits in the middle: gateway centralizes policy, designated clients distribute HTTP. The pattern is intentional.

## Alternatives considered

- **Strict HTTP funnel** — all provider calls go through one `gateway.call(...)` method. Rejected: it forces the gateway to grow into a generic HTTP client wrapping every SDK feature (streaming, tool use, vision, async). The five designated clients let each one stay close to its SDK.
- **Free-for-all** — any module can import any provider SDK. Rejected: cost accounting fragments, ledger lies, provider precedence becomes a hope rather than a rule.
- **Plugin architecture** — providers are plugins registered at startup. Rejected: over-engineered for current scale (3 providers, 1 mock, 1 paused-pair). Revisit if provider count exceeds 6.

## References

- `backend/model_gateway.py` — implementation
- `backend/engine.py`, `backend/agent.py`, `backend/mock_client.py`, `backend/groq_provider.py`, `backend/gemini_provider.py` — the five designated clients
- `backend/composer.py` `_route_model` — the open anti-pattern to remediate
- ADR-0003 — provider precedence (which provider gets called when)
- Skill `gauntlet-backend-spine` v1.1 — captures this ADR's rule

## Notes

The verifier `grep` command above can be wired into `.claude/commands/release-prep.md` and into CI as a future hardening step. For now it's manual.
