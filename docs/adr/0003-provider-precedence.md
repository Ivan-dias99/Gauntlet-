# ADR-0003 · Provider precedence — MOCK > Groq > Anthropic (paused) > Gemini (paused)

**Status**: Accepted (retroactive)
**Date**: 2026-05-11
**Deciders**: Ivan Fernandes
**Tags**: backend, providers, cost, ci, doctrine
**Builds on**: ADR-0002 (gateway-as-catalogue)

---

## Context

By 2026-05, Gauntlet's `model_gateway.py` `CATALOGUE` knows about four provider paths: MOCK (in-process), Groq, Anthropic, Gemini. Operationally, only one is active in production (Groq); the others are either paused (Anthropic, Gemini) or test-only (MOCK).

This wasn't always the case. Earlier iterations cycled through Anthropic as primary, then Gemini as primary, then attempted multi-provider fanout. By May 2026 the constraints crystallized:

- Solo-funded operation: token cost is a real budget constraint, not a corporate line item
- Sub-second SSE streaming is product-critical (the cápsula's streaming response state is part of the visual contract — see ADR-0005)
- The Composer pipeline (`/composer/{context,intent,preview,apply}`) hits the gateway repeatedly per cycle; latency multiplies
- CI must run without consuming live tokens

The combination forces a precedence. This ADR cristalizes it.

## Decision

The provider precedence is:

```
MOCK > Groq > Anthropic (paused) > Gemini (paused) > error
        ↑
     primary
```

### MOCK — the test path

`mock_client.py` (one of the five designated clients per ADR-0002) provides `MockAsyncAnthropic`. Activated by `GAUNTLET_MOCK=1` in env. Used by:

- CI (every `pytest -q` run in `.github/workflows/ci.yml` sets `GAUNTLET_MOCK=1 GAUNTLET_RATE_LIMIT_DISABLED=1`)
- Offline dev when the developer doesn't want to spend tokens
- Reproducibility tests where deterministic responses matter

**Never the default in production.** A production deploy with `GAUNTLET_MOCK=1` would silently serve fake responses to real users. The config layer must refuse this combination, or at minimum log loudly.

### Groq — the primary path

Groq is the production primary. Reasons:

- Free tier covers solo-funded daily usage at the current scale
- `llama-3.3-70b-versatile` and `openai/gpt-oss-120b` deliver sub-second latency on first token
- SSE streaming works reliably and matches the cápsula's streaming state expectations
- The Composer pipeline's repeated calls per cycle don't blow the budget

Groq is set as primary via `GAUNTLET_GROQ_API_KEY` on the backend host. The Composer routes (and any other module asking `gateway.select(role)`) get a Groq `ModelChoice` by default.

### Anthropic — paused, compatible

`engine.py` and `agent.py` import `from anthropic import AsyncAnthropic` (per ADR-0002). The code path is alive. But the gateway does not select Anthropic by default.

Reasons paused:

- Cost — even on small workloads, Anthropic API spend exceeds Groq's free tier with no proportional quality gain at Gauntlet's current task profile
- Latency — first-token latency typically worse than Groq for short prompts

Activation requires explicit operator opt-in via env or per-request override. The code stays compatible — paused, not removed.

### Gemini — paused, compatible

`gemini_provider.py` exists as a designated client. Same shape as Anthropic: code alive, gateway doesn't select by default.

Reasons paused:

- Inconsistent streaming behavior on the model tier accessible in the current free quota
- Tool-use semantics differ from Anthropic's, requiring `agent.py` to branch — preferred to keep `agent.py` single-provider for now

Same activation path as Anthropic: explicit opt-in.

### Fallback chain

When the primary fails (Groq returns 5xx, rate limit, or timeout), `gateway.fallback(role, failed_model_id)` returns the next choice in precedence order:

1. If Groq failed and Anthropic is opt-in enabled → Anthropic
2. If Anthropic is paused (default) → Gemini if opt-in enabled, else error
3. If everything paused → error

The fallback is **structured**, not silent. Every fallback writes a `runs.json` row with the failure reason and the substituted model.

## Consequences

**Positive:**

- One primary, two paused-but-ready. Switching primary (if Groq pricing or quality changes) is a config change, not a code change.
- CI is free of token costs by construction (`GAUNTLET_MOCK=1`).
- Cost is bounded by Groq's free tier under normal usage; the operator has time to react if usage approaches limits.
- Solo-funded operation stays sustainable.

**Negative:**

- Groq's free tier has rate limits. A burst of traffic (multiple Composer cycles in quick succession) can hit them. The fallback chain handles this, but switches the user to paused providers that then start spending tokens. Operator needs to watch for this.
- Quality varies between providers. Output from `llama-3.3-70b-versatile` is not character-for-character interchangeable with `claude-opus-4-7`. Any quality regression noticed by users tracks back to provider choice. The Aether v1 canon (see ADR-0005) constrains output formatting; semantic quality is the part that drifts.
- Two paused providers are dead code paths from a runtime perspective. Tests must exercise them periodically (manual or `test_provider_fallback.py` suite) to confirm they still work when activated.

**Neutral:**

- The precedence is a budget choice today. If budget changes (e.g. funded operation), the precedence flips to Anthropic as primary trivially — change the gateway's default selection, redeploy, done. The architecture is precedence-agnostic; this ADR pins today's choice.

## Alternatives considered

- **Anthropic as primary** — Rejected today on cost; revisit if funding allows.
- **Per-intent routing** (Anthropic for code, Groq for summarize, Gemini for translation) — Rejected: complexity not justified at current quality differential. Revisit when at least one of {cost difference shrinks, quality difference grows past usability} happens.
- **Round-robin across providers** — Rejected: spreads cost across all paid providers, defeats the free-tier strategy.
- **Single provider, no fallback** — Rejected: a Groq outage kills the product. Paused providers exist as insurance, not for daily use.

## References

- `backend/model_gateway.py` `CATALOGUE` — implementation
- `backend/groq_provider.py` — primary client
- `backend/mock_client.py` — test client
- `backend/test_provider_fallback.py` — exercises the fallback chain
- `.github/workflows/ci.yml` — uses `GAUNTLET_MOCK=1`
- ADR-0002 — gateway-as-catalogue (which client modules can import providers)
- Skill `gauntlet-backend-spine` v1.1 — captures this ADR's rule

## Notes

When Anthropic Opus 4.7 (or later) prices drop, or when Groq's free tier proves insufficient, this ADR is revisited. The precedence is a snapshot of May 2026 economics, not a permanent commitment.
