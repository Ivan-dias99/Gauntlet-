---
name: gauntlet-backend-spine
description: Sovereign backend law for the Gauntlet product (FastAPI maestro at backend/). Use whenever the user is editing, reviewing, designing, or refactoring server-side code — including HTTP endpoints, the /composer/{context,intent,preview,apply} pipeline, model_gateway, engine.py, agent.py, tools.py, runs.py, memory.py, security middleware (auth, rate_limit, security_headers, log_redaction), Pydantic contracts in models.py, doctrine.py prompts, or any router module under backend/routers/. Trigger this skill whenever a .py file under backend/ is touched, whenever an env var prefixed GAUNTLET_ / SIGNAL_ / RUBERRA_ is added or read, whenever a new HTTP route is proposed, whenever provider routing or model selection is discussed (per ADR-0002 and ADR-0003), whenever runs.json or failure_memory.json is involved, and whenever response shapes for the cápsula are designed (the 4 canonical preview/result layouts). This skill enforces the gateway-as-catalogue rule per ADR-0002 (model_gateway is the routing/policy/recording layer; 5 designated client modules — engine.py, agent.py, mock_client.py, groq_provider.py, gemini_provider.py — call providers; everyone else asks the gateway), runs ledger append-only law, the four-stage Composer contract, provider precedence per ADR-0003 (MOCK > Groq > Anthropic paused > Gemini paused), 5-layer defense-in-depth security, canonical naming per ADR-0006 (GAUNTLET_*, /api/gauntlet/*), and the canonical-labels contract (backend never returns banned voice words in user-facing strings, per ADR-0005). Composes with gauntlet-design-system (frontend boundary, Aether canon), CLAUDE.md (universal doctrine), and references ADRs 0002, 0003, 0005, 0006.
---

# Gauntlet Backend Spine

Local constitution for backend work. Does not re-litigate FastAPI patterns; does not duplicate `/CLAUDE.md`. Encodes rules **specific to this backend** — the gateway-as-catalogue model (ADR-0002), provider precedence (ADR-0003), the Composer contract, the ledger discipline, the security envelope, and closure shape.

The backend is **the maestro**. Owns contract, memory, and ledger. The model is a swappable engine, never the authority.

---

## When to use

- File under `backend/` is touched
- Editing or reviewing `server.py`, `composer.py`, `composer_settings.py`, `engine.py`, `agent.py`, `tools.py`, `model_gateway.py`, `memory.py`, `runs.py`, `models.py`, `doctrine.py`, `spine.py`, `auth.py`, `rate_limit.py`, `security_headers.py`, `log_redaction.py`, `gemini_provider.py`, `groq_provider.py`, `mock_client.py`, `runtime.py`, `voice.py`, or any `backend/routers/*.py`
- New HTTP route proposed, added, or modified
- Env var `GAUNTLET_*`, `SIGNAL_*`, `RUBERRA_*` added or read
- Provider routing / model selection / Groq / Anthropic / Gemini / MOCK / `model_gateway` mentioned
- `runs.json` or `failure_memory.json` involved
- Frontend ↔ backend boundary (`/composer/*` calls)
- Response shapes for the cápsula being designed (4 canonical layouts)
- CI / deploy work affects backend env vars or routes (defers release-specific to `gauntlet-release-discipline`)

Always also obey `/CLAUDE.md` and reference the relevant ADRs.

## When NOT to use

- UI work not crossing API boundary → `gauntlet-design-system`
- Tauri shell concerns → `gauntlet-tauri-shell`
- Markdown / documentation edits that don't touch endpoint contracts
- Generic Python questions not anchored in this codebase

---

## How this skill composes

| Concern | Owner | Adds |
|---|---|---|
| Universal doctrine | `/CLAUDE.md` | Always-on; not duplicated |
| UI surface law, Aether canon, canonical labels | `gauntlet-design-system` | Enforces canonical labels **on write** in response strings |
| Tauri capabilities, Rust commands | `gauntlet-tauri-shell` | Defers fully |
| Versioning, deprecation timeline | `gauntlet-release-discipline` | Canonical name on write; release skill owns migration plan |

---

## Product law

### 1. Model gateway is catalogue, not HTTP funnel (ADR-0002)

`backend/model_gateway.py` has three responsibilities:

1. **Catalogue** — `CATALOGUE` dict is single source of truth for allowed model_ids with cost approximations
2. **Selection** — `gateway.select(role)` maps a semantic role to a `ModelChoice`. Callers ask for a role; gateway picks the model
3. **Recording + fallback** — `gateway.record(GatewayCall)` writes structured row used by `/diagnostics` and runs ledger. `gateway.fallback(role, failed_model_id)` returns next-best when a provider fails

**Provider HTTP calls happen in 5 designated client modules**:

| Module | Purpose | May import provider SDK |
|---|---|---|
| `engine.py` | Triad + judge orchestration | `from anthropic import AsyncAnthropic` |
| `agent.py` | Tool-using agent loop | `from anthropic import AsyncAnthropic` |
| `mock_client.py` | Deterministic for `GAUNTLET_MOCK=1` | ambient (no external SDK) |
| `groq_provider.py` | Groq adapter | Groq SDK |
| `gemini_provider.py` | Gemini adapter | Gemini SDK |

Every other module — `composer.py`, `routers/*.py`, `tools.py` — asks the gateway and consumes one of the 5 above. **Direct provider SDK imports outside this list are forbidden.**

Verifier:
```bash
grep -rE "(from anthropic|from groq|from openai|from google\\.generativeai|import anthropic|import groq|import openai)" \
  backend/ --include="*.py" \
  | grep -v -E "(engine|agent|mock_client|groq_provider|gemini_provider)\\.py:"
```
Must return zero matches.

### 2. "Don't be wrong"

Refusal is default; response is exception. Failure memory makes the system more cautious in topics where it has been wrong. New code paths that produce answers without consulting `memory.failures` for the request fingerprint = regression.

### 3. The maestro never works in the cabin

Backend does not host UI. Does not render pages. Serves contracts. Server-rendered HTML, embedded admin panels, response payloads with presentational hints (CSS, layout instructions) → reject. Control Center is the cabin. Backend is the maestro.

### 4. User-facing strings honor canonical labels (ADR-0005)

The cápsula renders strings the backend returns. Response headers, button text, error messages, voice synthesis output must use canonical Aether labels (Enviar · Resposta · Plano · Executar · Executar com cuidado · Executado · Anexar · Ecrã · Voz · Copy · Save · Re-read · Erro). Must NOT contain banned labels (~~Compor · Submit · Run · Magic · Assistant · Preview~~). The voice ban-list lint runs against frontend, but backend can leak banned words via response payloads.

---

## Architectural truth

```
backend/
  server.py                     ← HTTP endpoints + middleware
  main.py                       ← uvicorn entry
  routers/                      ← per-domain modules
    health.py · ask.py · agent.py · runs.py · memory.py · spine.py
    tools.py · git.py · permissions.py · observability.py
  composer.py                   ← /composer/{context,intent,preview,apply,…}
  composer_settings.py
  engine.py                     ← triad + judge (designated client)
  agent.py                      ← tool-using loop (designated client)
  tools.py                      ← tool registry
  model_gateway.py              ← CATALOGUE + select + record + fallback
  groq_provider.py              ← Groq adapter (designated client)
  gemini_provider.py            ← Gemini adapter (designated client)
  mock_client.py                ← MOCK (designated client)
  memory.py · memory_records.py ← failure + operator memory
  runs.py                       ← append-only ledger (run_store API)
  doctrine.py                   ← prompts (SYSTEM_PROMPT, JUDGE_PROMPT, AGENT_SYSTEM_PROMPT)
  models.py                     ← Pydantic contracts
  spine.py                      ← workspace snapshot store
  config.py · runtime.py        ← env-driven settings + shared engine accessor
  auth.py                       ← API key gate (Bearer)
  rate_limit.py
  security_headers.py
  log_redaction.py
  voice.py                      ← TTS / voice surface
  backup.py · persistence.py · pause_registry.py · context_router.py · observability.py
  test_*.py                     ← 5 suites (composer, computer_use, engine_init, provider_fallback, security)
```

Three non-obvious rules:

- **`runtime.py` is shared engine accessor** — routers import engine through `runtime.py`, never instantiate own. Multiple engine instances split state.
- **`models.py` is contract surface** — every request/response body is Pydantic in `models.py`. Inline `dict` payloads = silent contract drift.
- **CI's exhaustive module list** in `.github/workflows/ci.yml` (`python -c "import ..."` step) is canonical inventory. **Adding a new `.py` to `backend/` → add to that list** or syntax errors slip through.

---

## /composer pipeline contract

Canonical and ordered. Each stage has single responsibility:

| Stage | Endpoint | Owns | May NOT |
|---|---|---|---|
| 1. Context | `POST /composer/context` | Capture authorized context (selection, URL, screenshot, DOM) | Call any model. Mutate state outside context buffer. |
| 2. Intent | `POST /composer/intent` | Classify intent, decide route, commit model selection | Generate artifact. Apply side effects. |
| 3. Preview | `POST /composer/preview` | Generate artifact via gateway + designated client | Apply any side effect. Touch host page / filesystem. |
| 4. Apply | `POST /composer/apply` | Apply artifact (clipboard / DOM / file) + record run | Re-generate. Re-route. Skip run record. |

Each cycle writes **two rows to `runs.json`**:
1. `route="composer"` — envelope with `composer:intent_id`
2. `route="agent"` or `route="triad"` — internal call, same `composer:intent_id`

Side effect in `/composer/preview` = reject. Skipping envelope row = reject.

### 4 canonical preview/result response shapes (ADR-0005)

| Shape | Backend returns | Cápsula renders |
|---|---|---|
| **A** | `{kind:"text", model, latency_ms, content}` | `RESPOSTA · {model} · {latency}ms` header + content + `[Copy] [Save]` |
| **B** | `{kind:"plan", model, latency_ms, actions:[{step,op,target,args,sensitive:bool}]}` | `PLANO · {N} actions` + numbered steps + `[Executar] [Rejeitar]` |
| **C** | Plan with `actions.some(a => a.sensitive)` | Plan B + DangerGate UI (per phase grammar `danger_gate`) |
| **D** | `{kind:"result", model, latency_ms, steps:[{step,status:"ok"|"err"|"skip",message}]}` | `RESULTADO · {ok} ok · {fail} falhou` + color-coded lines + `[Copy] [Save]` |

Pick one of the four. Inventing a fifth requires an ADR.

### Known anti-pattern: `composer.py` `_route_model`

`composer.py` `_route_model(intent, ctx)` (lines ~243-285) hard-codes `primary_model="claude-opus-4-7"`. **Duplicates gateway policy** (ADR-0002 violation). Two remediation options:

- **Option A** — Add intent-aware roles to `CATALOGUE`: `select("composer-code")`, `select("composer-summarize")`. composer.py calls these.
- **Option B** — Map composer intents to existing gateway roles: `code` → `agent`, `summarize` → `compress`, `analyze` → `triad`. composer.py calls `gateway.select(<mapped>)`.

Closure for either: no `claude-opus-4-7` or `primary_model="…"` string in `composer.py` after patch.

---

## Provider precedence (ADR-0003)

```
MOCK > Groq > Anthropic (paused) > Gemini (paused) > error
        ↑
     primary
```

- **MOCK** — `GAUNTLET_MOCK=1` short-circuits gateway with deterministic responses via `MockAsyncAnthropic`. CI + offline dev. Never production default.
- **Groq** — production primary. `GAUNTLET_GROQ_API_KEY`. `llama-3.3-70b-versatile`, sub-second SSE streaming.
- **Anthropic** — paused; code compatible; activate via explicit env opt-in.
- **Gemini** — paused; same activation path.

No hard-coded provider in route handlers or non-client modules. Hard-coding a provider name as string in a handler is a smell.

New provider? Add to `CATALOGUE`, declare cost in `gateway.summary()`, create designated client. Never scatter SDK imports.

---

## Security envelope (5 layers, defense-in-depth)

All five are middleware; all wrap Composer routes; none optional in production.

| # | Layer | Module | Toggle | Default |
|---|---|---|---|---|
| 1 | API key gate (Bearer) | `auth.py` | `GAUNTLET_API_KEY=…` | off in dev, set in prod |
| 2 | Rate limiter | `rate_limit.py` | `GAUNTLET_RATE_LIMIT_DISABLED=1` to disable | on |
| 3 | Security headers | `security_headers.py` | `GAUNTLET_HSTS=1` for HSTS | on (HSTS off until cert real) |
| 4 | Body-size cap | `server.py` middleware | `GAUNTLET_MAX_BODY_BYTES=…` | 1 MiB |
| 5 | Log redaction | `log_redaction.py` | `GAUNTLET_LOG_REDACT=1` | on |

Rules:

- New endpoint inherits all 5 by being declared in `backend/routers/*.py` and registered through standard pipeline. Direct `@app.post(...)` in `server.py` outside the standard router pipeline = reject.
- Logs never contain raw tokens, API keys, message contents. Use `log_redaction.redact(body)` before logging request body.
- Bearer auth is gate, not only line. Rate limit + body cap + redaction apply even when auth off (dev). Don't disable for "testing".
- `GAUNTLET_ALLOW_CODE_EXEC` (default false) gates `run_command` and `execute_python`. Don't flip in production.

---

## Run ledger discipline

`runs.json` is **append-only**, accessed exclusively through `run_store` API in `runs.py`. Never edited. Never deleted from code paths. Operator-driven cleanup via explicit admin tooling only.

Required fields (Pydantic in `models.py`):
`id, ts, route (composer|agent|triad|…), provider, model, latency_ms, tokens_in, tokens_out, cost_usd, outcome (ok|error|refused), error_class (nullable), composer:intent_id (nullable), fingerprint (anti-loop hash)`

Rules:
- Every endpoint that consults the gateway writes a row. No silent calls.
- Every refusal writes a row with `outcome="refused"` and reason. Refusal is product truth.
- Every error writes a row with `outcome="error"` and stable `error_class`. Stack traces → logs (redacted), not ledger.
- Two-row Composer envelope is non-negotiable. Stage 4 writes envelope; internal route writes own row; share `composer:intent_id`.

---

## Failure memory and anti-loop

`failure_memory.json` records failed questions. Tool chain carries anti-loop **fingerprint**.

- Before answering, consult `memory.failures.lookup(fingerprint)`. Recent failure on same fingerprint → more cautious (escalate route, lower confidence, refuse).
- Fingerprint = stable hash of (intent class + canonicalized inputs). Must be deterministic across restarts.
- Failure memory is bounded. `memory.py` enforces retention. No unbounded growth.
- `POST /memory/clear` is operator-only. API key gate even in dev.

---

## Capabilities-aware response shaping

`Ambient.capabilities` matrix (from `gauntlet-tauri-shell` skill + ADR-0001 dual-shell):

| Capability | Browser | Desktop |
|---|---|---|
| `domExecution` | ✅ | ❌ |
| `filesystemWrite` | ❌ | ✅ |
| `shellExecute` | ❌ | ✅ |
| `computerUse` | ❌ | ✅ |

When `composer.py` shapes a plan, must consider requesting shell's capabilities (request body carries `ambient` field). Plan with `filesystemWrite` returned to browser shell = unrenderable. Don't return it. Validate plan shapes against requesting shell.

---

## Canonical naming (ADR-0006)

`GAUNTLET_*` canonical. `SIGNAL_*`/`RUBERRA_*` read-only fallback until v1.1.0.

| Surface | Canonical | Legacy fallback |
|---|---|---|
| Env vars | `GAUNTLET_*`, `VITE_GAUNTLET_*` | `SIGNAL_*`, `RUBERRA_*` |
| API routes | `/api/gauntlet/*` | `/api/signal/*`, `/api/ruberra/*` |
| Storage / disk paths | `gauntlet/` | `signal/`, `ruberra/` |

`config.py` reads `GAUNTLET_X` first, falls back to `SIGNAL_X` / `RUBERRA_X` with deprecation warning. **Never write to legacy names from new code.**

---

## Closure check

Not closed until all true:

1. **Builder landed** — `python -m backend.main` starts; `GET /health` returns 200; `GET /health/ready` returns honest yes (or 503 with reason)
2. **CI module list updated** — new `.py` in `backend/` appears in `mods` tuple in `ci.yml`
3. **Pydantic contracts validate** — `models.py` types declared; route handlers reference them; no inline `dict` payloads
4. **Gateway integrity (ADR-0002)** — provider SDK imports stay in 5 designated clients only. `grep` returns no matches outside that list
5. **Security envelope applied** — new endpoint inherits 5 layers via `backend/routers/`
6. **Append-only honored** — any `runs.json` write uses `run_store` API
7. **Failure memory consulted** — new answer paths call `memory.failures.lookup(fingerprint)`; new failure paths call `memory.failures.record(...)`
8. **Canonical naming** — `grep -rE "(SIGNAL_|RUBERRA_)" backend/ --include="*.py"` returns no new writes
9. **Composer two-row contract** — both envelope and internal rows written, share `composer:intent_id`
10. **Canonical labels (ADR-0005)** — new user-facing strings honor Aether labels; no banned label returned to frontend
11. **Shell-aware response shaping** — changes to `/composer/preview` or `/composer/apply` consider requesting shell's capabilities
12. **Tests pass under MOCK** — `GAUNTLET_MOCK=1 GAUNTLET_RATE_LIMIT_DISABLED=1 pytest -q` green
13. **Owned residue closed** — no new `# TODO`, `# FIXME`, no commented-out code, no print statements, no hard-coded keys

If any fails: `não tenho evidência suficiente`.

---

## Anti-patterns (reject on sight)

| Anti-pattern | Correct shape |
|---|---|
| `from anthropic import Anthropic` outside 5 designated clients | Use existing client or write ADR |
| New code in `composer.py` with hard-coded `primary_model="claude-opus-4-7"` | Use `gateway.select(role)` per ADR-0002 |
| Side effect in `POST /composer/preview` | Move to `POST /composer/apply` |
| Direct `runs.json.write(...)` | Use `run_store.append(...)` |
| New `@app.post(...)` in `server.py` outside router pipeline | Add to `backend/routers/` |
| `os.getenv("SIGNAL_API_KEY")` in new code | Use `GAUNTLET_API_KEY` (config reads legacy as fallback) |
| Inline `dict` body on route handler | Declare Pydantic in `models.py` |
| Hard-coded model name in `routers/`, `tools.py`, new code | Pass through `gateway.select(role)` |
| New endpoint not writing `runs.json` | Always write row, even on refusal/error |
| `logger.info(request.body)` | `log_redaction.redact(body)` first |
| New backend module not in CI's `mods` tuple | Append in same PR |
| Multiple engine instances (each router builds own) | Use shared accessor in `runtime.py` |
| Response payload with banned label ("Submit", "Run", "Preview") | Use canonical labels (ADR-0005) |
| `filesystemWrite` plan returned to browser shell | Inspect `ambient.capabilities`; shape plan to match |
| Retry path without fingerprint check | Compute fingerprint; consult `memory.failures` first |
| `POST /memory/clear` without auth | Apply API key gate |

---

## Example invocations

- "Add `/composer/refine` endpoint for re-run preview with operator feedback"
- "Wire OpenAI as fourth provider in gateway"
- "The agent loop is calling Anthropic directly somewhere — find it" (engine/agent legit; elsewhere not)
- "Add tool to registry that reads local file"
- "Add `cost_usd` field to `runs.json`"
- "Why is `failure_memory.json` growing without bound?"
- "Migrate endpoint from `SIGNAL_API_KEY` to `GAUNTLET_API_KEY`"
- "Refactor `composer.py` `_route_model` to use gateway"
- "Composer shows 'Submit' on button — find it" (likely backend response payload)

---

## Reference

- ADR-0002 — gateway-as-catalogue (authoritative)
- ADR-0003 — provider precedence (authoritative)
- ADR-0005 — Aether v1 canon (for canonical labels)
- ADR-0006 — deprecation timeline (for naming)
- `/CLAUDE.md` — universal doctrine
- `/README.md` — provider precedence table, endpoint catalog, security table
- `backend/README.md`
- `/docs/OPERATIONS.md`
- `/docs/SECURITY_AUDIT.md`
- `/docs/canon/COMPOSER_SURFACE_SPEC.md`
- `.github/workflows/ci.yml` — canonical module list + test config
- `backend/` — implementation
- Companion skills: `gauntlet-design-system`, `gauntlet-tauri-shell`, `gauntlet-release-discipline`

When skill conflicts with `/CLAUDE.md`, ADRs, or actual code on main: **code wins**. Repo truth beats narrative.
