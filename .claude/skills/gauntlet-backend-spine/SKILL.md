---
name: gauntlet-backend-spine
description: Sovereign backend law for the Gauntlet product (FastAPI maestro at backend/). Use whenever the user is editing, reviewing, designing, or refactoring server-side code — including HTTP endpoints, the /composer/{context,intent,preview,apply} pipeline, model_gateway, engine.py, agent.py, tools.py, runs.py, memory.py, security middleware (auth, rate_limit, security_headers, log_redaction), Pydantic contracts in models.py, doctrine.py prompts, or any router module under backend/routers/. Trigger this skill whenever a .py file under backend/ is touched, whenever an env var prefixed GAUNTLET_ / SIGNAL_ / RUBERRA_ is added or read, whenever a new HTTP route is proposed, whenever provider routing or model selection is discussed, whenever runs.json or failure_memory.json is involved, whenever the conversation crosses the frontend ↔ backend boundary (the Composer surface calls /composer/*), and whenever response shapes for the cápsula are designed (the 4 canonical preview/result layouts: resposta texto, plano, acção sensível, resultado). This skill enforces the gateway-as-catalogue rule (model_gateway is the routing/policy/recording layer; designated client modules — engine.py, agent.py, mock_client.py, groq_provider.py, gemini_provider.py — call providers; everyone else asks the gateway), runs ledger append-only law, the four-stage Composer contract, provider precedence (MOCK > Groq > Anthropic > Gemini), 5-layer defense-in-depth security, canonical naming (GAUNTLET_*, /api/gauntlet/*), and the canonical-labels contract (backend never returns banned voice words like "Submit", "Run", "Magic" in user-facing strings). It composes with — and does not replace — gauntlet-design-system (UI surface law, visual canon) and CLAUDE.md (universal doutrina).
---

# Gauntlet Backend Spine

This skill is the local constitution for backend work in the Gauntlet repository. It does not re-litigate FastAPI patterns Claude already knows; it does not duplicate the universal doutrina that lives in `/CLAUDE.md`. It encodes the rules that are **specific to this backend** — the contract with the Composer, the gateway-as-catalogue model, the ledger and memory discipline, the security envelope, and the closure shape that a backend change has to take before it is real.

The backend is **the maestro**. It owns the contract, the memory, and the ledger. The model is a swappable engine, never the authority. Read this skill in full whenever you touch `backend/`. Every rule maps to a concrete failure mode that has already cost time or trust.

---

## When to use this skill

Trigger this skill whenever any of these are true:

- The change touches a file under `backend/`.
- The user is editing or reviewing `server.py`, `composer.py`, `composer_settings.py`, `engine.py`, `agent.py`, `tools.py`, `model_gateway.py`, `memory.py`, `runs.py`, `models.py`, `doctrine.py`, `spine.py`, `auth.py`, `rate_limit.py`, `security_headers.py`, `log_redaction.py`, `gemini_provider.py`, `groq_provider.py`, `mock_client.py`, `runtime.py`, `voice.py`, or any router module under `backend/routers/`.
- A new HTTP route is being proposed, added, or modified — anywhere.
- An env var prefixed `GAUNTLET_*`, `SIGNAL_*`, or `RUBERRA_*` is being added or read.
- The user mentions provider routing, model selection, Groq, Anthropic, Gemini, MOCK mode, or `model_gateway`.
- The work involves `runs.json`, `failure_memory.json`, or any ledger / memory persistence.
- The conversation crosses the frontend ↔ backend boundary (e.g. the Composer is making a call to `/composer/*`).
- Response shapes for the cápsula are being designed — including the 4 canonical preview/result layouts (resposta texto, plano, acção sensível, resultado).
- The user is touching CI, deployment, or release work that affects backend env vars or routes (defer the release-specific parts to `gauntlet-release-discipline`, but stay loaded).

When you trigger, **also obey `/CLAUDE.md`** for universal doutrina. This skill does not relax those rules; it adds territory-specific ones.

## When NOT to use this skill

- Pure UI work that does not cross the API boundary — `gauntlet-design-system`'s territory.
- Tauri shell concerns (Rust under `src-tauri/`, OS integration) — `gauntlet-tauri-shell`.
- Markdown / documentation edits that do not touch endpoint contracts.
- Generic Python questions not anchored in this codebase.

---

## How this skill composes with others

| Concern | Owner | What this skill adds |
|---|---|---|
| Universal doutrina (anti-teimosia, missão concluída, multi-file plan) | `/CLAUDE.md` | Always-on. This skill does not duplicate. |
| UI surface law, dual-shell parity, Capsule budget, Aether visual canon, canonical labels | `gauntlet-design-system` | This skill enforces canonical labels **on write** in user-facing response strings. |
| Tauri 2 capabilities, Rust commands, two-window pattern | `gauntlet-tauri-shell` | Defer fully on the desktop shell. |
| Versioning, deprecations, GAUNTLET_* migration timeline | `gauntlet-release-discipline` | This skill enforces the **canonical name on write**; release skill owns the **migration plan**. |

---

## Product law (backend lens)

### 1. The model gateway is a catalogue, not an HTTP funnel

`backend/model_gateway.py` is **not** a single funnel that intercepts every HTTP call to providers. It is a **routing / policy / recording layer** with three responsibilities:

1. **Catalogue** — `CATALOGUE` dict in `model_gateway.py` is the single source of truth for which model_ids the system is allowed to use, with cost approximations.
2. **Selection** — `gateway.select(role)` maps a role (`triad`, `judge`, `agent`, `distill`, `surface`, `compress`, `validate`, `default`) to a `ModelChoice`. Callers ask for a role; the gateway picks a model.
3. **Recording + fallback** — `gateway.record(GatewayCall)` writes a structured row for `/diagnostics` and the run log. `gateway.fallback(role, failed_model_id)` returns the next-best choice when a provider fails.

Provider HTTP calls happen in **designated client modules**, not in the gateway:

| Module | Purpose | May import provider SDK |
|---|---|---|
| `engine.py` | Triad + judge orchestration | ✅ `from anthropic import AsyncAnthropic` |
| `agent.py` | Tool-using agent loop | ✅ `from anthropic import AsyncAnthropic` |
| `mock_client.py` | Deterministic responses for `GAUNTLET_MOCK=1` and CI | ✅ ambient (no external SDK) |
| `groq_provider.py` | Groq adapter | ✅ Groq SDK / HTTP client |
| `gemini_provider.py` | Gemini adapter | ✅ Gemini SDK / HTTP client |

Every other module — `composer.py`, `routers/*.py`, `tools.py`, anywhere else — asks the gateway and consumes one of the designated clients above. Direct provider imports outside the designated list are forbidden.

The rule: **if you are about to add `from anthropic import …` (or any provider SDK) to a file outside the designated client list, stop.** The work belongs in an existing client, or you need an explicit ADR justifying a new client module.

### 2. "Don't be wrong"

Refusal is the default; response is the exception. The failure memory makes the system more cautious in topics where it has already been wrong. New endpoints and tools must respect this — adding a new code path that produces an answer without consulting `memory.failures` for prior failures on the same fingerprint is a regression.

### 3. The maestro never works in the cabin

The backend does not host UI. It does not render pages. It serves contracts. If a feature creep proposes server-rendered HTML, embedded admin panels, or response payloads that include presentational hints (CSS, layout instructions), reject. The Control Center is the cabin. The backend is the maestro.

### 4. User-facing strings honor the canonical labels

The cápsula renders strings the backend returns. If the backend response includes user-facing labels — header strings, button text, error messages, voice synthesis output — those strings must use the canonical Aether labels (Enviar · Resposta · Plano · Executar · Executar com cuidado · Executado · Anexar · Ecrã · Voz · Copy · Save · Re-read · Erro) and must not contain banned labels (~~Compor · Submit · Run · Magic · Assistant · Preview~~). The voice ban-list lint runs against the frontend, but the backend can leak banned words via response payloads — guard against this when shaping responses or composing voice output. See `gauntlet-design-system` for the full label list.

---

## Architectural truth

```
backend/
  server.py                     ← HTTP endpoints + middleware pipeline
  main.py                       ← uvicorn entry
  routers/                      ← per-domain modules
    health.py · ask.py · agent.py · runs.py · memory.py · spine.py
    tools.py · git.py · permissions.py · observability.py
  composer.py                   ← /composer/{context,intent,preview,apply,…} (large file ~61 KB)
  composer_settings.py          ← composer-side settings
  engine.py                     ← triad + judge pipeline + auto-router (designated client)
  agent.py                      ← tool-using agent loop (designated client)
  tools.py                      ← tool registry (large file ~85 KB)
  model_gateway.py              ← CATALOGUE + select + record + fallback ← NOT a funnel
  groq_provider.py              ← Groq adapter (designated client)
  gemini_provider.py            ← Gemini adapter (designated client)
  mock_client.py                ← MockAsyncAnthropic for GAUNTLET_MOCK=1 (designated client)
  memory.py · memory_records.py ← failure + operator memory (JSON on disk)
  runs.py                       ← append-only run log (run_store API)
  doctrine.py                   ← prompt assembly (SYSTEM_PROMPT, JUDGE_PROMPT, AGENT_SYSTEM_PROMPT)
  models.py                     ← Pydantic contracts (large; ~35 KB)
  spine.py                      ← workspace snapshot store
  config.py · runtime.py        ← env-driven settings + shared engine accessor
  auth.py                       ← API key gate (Bearer)
  rate_limit.py                 ← rate limiter
  security_headers.py           ← security headers + HSTS
  log_redaction.py              ← log token redaction
  voice.py                      ← TTS / voice surface
  backup.py · persistence.py · pause_registry.py · context_router.py · observability.py
  test_*.py                     ← test_composer, test_engine_init, test_provider_fallback,
                                  test_security, test_computer_use_tool
  Dockerfile · railway.json · requirements.txt · .env.example · README.md
```

Three non-obvious rules:

- **`runtime.py` is the shared engine accessor.** Routers import the engine through `runtime.py`, never by instantiating their own. Multiple engine instances split state.
- **`models.py` is the contract surface.** Every request and response body is a Pydantic model declared there. Inline `dict` payloads on a route handler are a regression — they become silent contract drift when the frontend changes shape.
- **CI's exhaustive module list** in `.github/workflows/ci.yml` (the `python -c "import ..."` step) is the canonical inventory of every backend module the runtime touches. **When adding a new `.py` to `backend/`, add it to that list** or its syntax errors will pass CI silently.

---

## The /composer pipeline

The Composer pipeline is canonical and ordered. Each stage is a separate endpoint with a single responsibility.

| Stage | Endpoint | Owns | May NOT |
|---|---|---|---|
| 1. Context | `POST /composer/context` | Capture authorized context (selection, URL, screenshot, dom snapshot) | Call any model. Mutate any state outside the context buffer. |
| 2. Intent | `POST /composer/intent` | Classify the intent, decide route, commit a model selection | Generate the artifact. Apply side effects. |
| 3. Preview | `POST /composer/preview` | Generate the artifact via gateway + designated client | Apply any side effect. Touch the user's host page or filesystem. |
| 4. Apply | `POST /composer/apply` | Apply the artifact (clipboard, dom action, file write) and record the run | Re-generate. Re-route. Skip the run record. |

Each cycle writes **two lines to `runs.json`**:

1. `route="composer"` — the envelope, with `composer:intent_id`.
2. `route="agent"` or `route="triad"` — the internal call that produced the artifact, with the same `composer:intent_id` for correlation.

If a change introduces a stage that performs side effects in `/composer/preview`, reject. If a change skips writing the envelope row in `runs.json`, reject.

### The 4 canonical preview/result response shapes

The cápsula renders one of four layouts based on response shape (`docs/canon/COMPOSER_SURFACE_SPEC.md`):

- **A. Resposta texto** — backend returns `{kind: "text", model, latency_ms, content}`. Cápsula renders header `RESPOSTA · {model} · {latency_ms}ms` + content + `[Copy] [Save] [Guardar como…]`.
- **B. Plano de DOM actions** — backend returns `{kind: "plan", model, latency_ms, actions: [{step, op, target, args, sensitive: bool}]}`. Cápsula renders header `PLANO · {N} actions · {model} · {latency_ms}ms` + numbered steps + `[Executar] [Executar com cuidado]`. Steps with `sensitive: true` are visually flagged and gated.
- **C. Acção sensível (alarme)** — when `actions.some(a => a.sensitive)`, the cápsula injects the gate: ⚠️ ACÇÕES SENSÍVEIS NO PLANO + list + checkbox "Confirmo, executar mesmo assim" + `[Executar com cuidado]`. Backend marks `sensitive: true` on actions that match the heuristic in `tools.py`.
- **D. Resultado de execução** — after `/composer/apply` returns `{kind: "result", model, latency_ms, steps: [{step, status: "ok"|"err"|"skip", message}]}`, the cápsula renders header `RESULTADO · {ok_count} ok · {fail_count} falhou` + color-coded lines.

When designing a new response shape: pick one of the four. Don't invent a fifth without an ADR. Backend and frontend evolve the canonical shapes together.

### Intent → role mapping (open work)

Today, `composer.py` has a private `_route_model(intent, ctx)` function that maps intent (`generate_code`, `summarize`, `analyze`, etc.) to `ModelRoute` with **hard-coded `primary_model="claude-opus-4-7"`** values. **This duplicates gateway policy and is the largest doctrine drift in the backend.** The fix is one of:

- **Option A**: Add intent-aware roles to the gateway `CATALOGUE` (e.g. `select("composer-code")`, `select("composer-summarize")`) and have composer.py call `gateway.select(role)`.
- **Option B**: Map composer intents to existing gateway roles at the composer site (e.g. `code` → `agent`, `summarize` → `compress`, `analyze` → `triad`) and call `gateway.select(role)` without naming model_ids.

Either is acceptable; pick one and write the ADR. Until then, treat composer.py's `_route_model` as a **known anti-pattern with an open remediation plan**, not a green-light pattern to copy.

---

## Provider precedence

```
MOCK > Groq > Anthropic > Gemini > error
        ↑       paused      paused
     primary
```

Rules:

- **Groq is the primary path.** Free tier, Llama 3.x / gpt-oss, sub-second latency, SSE streaming.
- **Anthropic and Gemini are paused.** Code stays compatible. They run only if the operator explicitly opts in via env or per-request override.
- **`MOCK` is the test path.** `GAUNTLET_MOCK=1` short-circuits the gateway with deterministic responses via `MockAsyncAnthropic`. Used in CI (`pytest -q` runs with this set in `ci.yml`) and offline dev. Never the default in production.
- **No hard-coded provider in route handlers or non-client modules.** Provider SDK imports are scoped to the designated client list above. Hard-coding a provider name as a string in a handler is also a smell — pass intents through.

When adding a new provider: add to `model_gateway.py` `CATALOGUE` first, declare cost in `gateway.summary()`, register provider precedence rules in one place. Add a new designated client module for the SDK. Never scatter SDK imports.

---

## Security envelope (5 layers, defense-in-depth)

All five layers are middleware, all wrap the Composer routes automatically. None is optional in production.

| # | Layer | Module | Toggle | Default |
|---|---|---|---|---|
| 1 | API key gate (Bearer) | `auth.py` | `GAUNTLET_API_KEY=…` | off (set in prod) |
| 2 | Rate limiter | `rate_limit.py` | `GAUNTLET_RATE_LIMIT_DISABLED=1` to disable | on |
| 3 | Security headers | `security_headers.py` | `GAUNTLET_HSTS=1` for HSTS | on (HSTS off until cert is real) |
| 4 | Body-size cap | `server.py` middleware | `GAUNTLET_MAX_BODY_BYTES=…` | 1 MiB |
| 5 | Log token redaction | `log_redaction.py` | `GAUNTLET_LOG_REDACT=1` | on |

Rules:

- **Every new endpoint inherits all five layers** by being declared in `backend/routers/*.py` and registered through the standard pipeline in `server.py`. If a route is added with `@app.post(...)` directly in `server.py` outside the standard router pipeline and bypasses middleware, reject.
- **Logs never contain raw tokens, API keys, or message contents.** If you add a log line that prints a request body, run it through `log_redaction.redact(...)` first.
- **Bearer auth is the gate, not the only line.** Rate limit + body cap + redaction apply even when auth is off (dev mode). Removing them "for testing" leaves footguns in main.
- **Tool execution gate.** `GAUNTLET_ALLOW_CODE_EXEC` (default false) gates `run_command`'s ability to invoke package managers and interpreters, plus `execute_python`. Don't flip this for "testing in production".

---

## Run ledger discipline

`runs.json` is **append-only**, accessed exclusively through the `run_store` API in `runs.py`. Every execution writes one or more rows. Rows are never edited. Rows are never deleted from code paths. Operator-driven cleanup happens through explicit admin tooling, not through normal endpoints.

Required fields per row (canonical shape, declared in `models.py`):

- `id`, `ts`, `route` (`composer` | `agent` | `triad` | …), `provider`, `model`, `latency_ms`, `tokens_in`, `tokens_out`, `cost_usd`, `outcome` (`ok` | `error` | `refused`), `error_class` (nullable), `composer:intent_id` (nullable), `fingerprint` (anti-loop hash).

Rules:

- **Every endpoint that consults the gateway writes a row.** No silent calls.
- **Every refusal writes a row** with `outcome="refused"` and the reason. Refusal is product truth, not absence.
- **Every error writes a row** with `outcome="error"` and a stable `error_class`. Stack traces go to logs (redacted), not the ledger.
- **The two-row Composer envelope is non-negotiable.** Stage 4 (`/composer/apply`) writes the envelope; the internal route writes its own row; both share `composer:intent_id`.

---

## Failure memory and anti-loop

`failure_memory.json` records perguntas that failed. The tool chain carries an anti-loop **fingerprint** so the system does not retry blindly.

Rules:

- **Before answering, consult `memory.failures` for the request fingerprint.** If a recent failure exists on the same fingerprint, the system is more cautious — escalates the route, lowers confidence, or refuses.
- **Fingerprint is a stable hash** of (intent class + canonicalized inputs). It must be deterministic across restarts. If a fingerprint changes when nothing meaningful changed, the canonicalizer is wrong — fix it.
- **Failure memory is bounded.** It does not grow forever. `memory.py` enforces retention; do not add unbounded growth in new failure paths.
- **`POST /memory/clear` is operator-only.** It must be behind the API key gate, even in dev.

---

## Capabilities awareness (capsule capabilities matrix)

The cápsula renders different action buttons per shell based on the `Ambient.capabilities` object the shell provides at construction time. The matrix lives in `docs/canon/COMPOSER_SURFACE_SPEC.md`:

| Capability | Browser | Desktop | Backend implications |
|---|---|---|---|
| `domExecution` | ✅ | ❌ | DOM action plans only ship to browser shell |
| `screenshot` | ✅ | ✅ | `/composer/context` accepts base64 from both |
| `filesystemRead` | ✅ | ✅ | both shells can attach files |
| `filesystemWrite` | ❌ | ✅ | `/composer/apply` returns file-write actions only when origin is desktop |
| `voice` | ✅ | ✅ | `/voice/transcribe` serves both |
| `shellExecute` | ❌ | ✅ | shell-execute tools gated by request origin |

Backend implications: when `composer.py` shapes a plan, it must consider the requesting shell's capabilities (the request body carries this in the `ambient` field). A plan that includes `filesystemWrite` actions returned to a browser shell would be unrenderable. Don't return it. Validate plan shapes against the requesting shell's capabilities.

---

## Canonical naming

`GAUNTLET_*` is canonical. `SIGNAL_*` and `RUBERRA_*` are aliases — read as silent fallback for migration only, **removed in v1.1.0**. New code writes `GAUNTLET_*` always.

| Surface | Canonical | Legacy (read-only fallback, removed v1.1.0) |
|---|---|---|
| Env vars | `GAUNTLET_*`, `VITE_GAUNTLET_*` | `SIGNAL_*`, `RUBERRA_*`, `VITE_BACKEND_URL` |
| API routes | `/api/gauntlet/*` | `/api/signal/*`, `/api/ruberra/*` |
| Storage / disk paths | `gauntlet/` | `signal/`, `ruberra/` |

When `config.py` reads an env var, it looks first for `GAUNTLET_X`, then falls back to `SIGNAL_X` / `RUBERRA_X` with a deprecation warning. **Never write to the legacy names from new code.**

---

## Closure check

A backend change is **not closed** until all of these are true. Verify each before saying `missão concluída`.

1. **Builder landed.** `python -m backend.main` starts; `GET /health` returns 200; `GET /health/ready` returns honest yes (or 503 with reason).
2. **CI module list updated.** If a new `.py` file was added to `backend/`, it appears in the exhaustive `mods` tuple in `.github/workflows/ci.yml`.
3. **Pydantic contracts validate.** `models.py` types declared; route handlers reference them; no inline `dict` payloads on new routes.
4. **Gateway integrity.** Provider SDK imports stay confined to the designated client modules: `engine.py`, `agent.py`, `mock_client.py`, `groq_provider.py`, `gemini_provider.py`. `grep -rE "(from anthropic|from groq|from openai|from google\.generativeai|import anthropic|import groq|import openai)" backend/ --include="*.py"` returns no matches outside that list.
5. **Security envelope applied.** New endpoint inherits auth, rate limit, body cap, security headers, log redaction by being placed under `backend/routers/`. None bypassed.
6. **Append-only honored.** Any code that writes `runs.json` uses the `run_store` API in `runs.py`, not direct file writes.
7. **Failure memory consulted.** New answer paths call `memory.failures.lookup(fingerprint)` before generating. New failure paths call `memory.failures.record(...)` before returning.
8. **Canonical naming.** `grep -rE "(SIGNAL_|RUBERRA_)" backend/ --include="*.py"` returns no new writes (reads as fallback are OK and have deprecation warnings).
9. **Composer two-row contract.** If the change touches the Composer pipeline, both envelope and internal rows are written and share `composer:intent_id`.
10. **Canonical labels.** New user-facing strings (response payloads, error messages, voice synthesis output) honor the Aether label set. No "Submit", "Run", "Magic", "Assistant", "Preview" returned to the frontend.
11. **Shell-aware response shaping.** If the change touches `/composer/preview` or `/composer/apply`, it considers the requesting shell's capabilities. No `filesystemWrite` actions returned to browser shells; no `domExecution` actions returned to desktop shells.
12. **Tests pass under MOCK.** `GAUNTLET_MOCK=1 GAUNTLET_RATE_LIMIT_DISABLED=1 pytest -q` is green.
13. **Owned residue closed.** No new `# TODO`, `# FIXME`, or commented-out code. No print statements left in. No keys hard-coded.

If any check fails or was not run, the correct response is `não tenho evidência suficiente`.

---

## Anti-patterns (reject on sight)

| Anti-pattern | Why it's wrong | Correct shape |
|---|---|---|
| `from anthropic import Anthropic` in a file outside the designated client list | Bypasses the gateway-as-catalogue contract | Use an existing designated client or write an ADR |
| New code in `composer.py` using hard-coded `primary_model="claude-opus-4-7"` | Duplicates gateway policy; mirrors the existing `_route_model` anti-pattern | Map intent → role and call `gateway.select(role)` |
| Side effect inside `POST /composer/preview` | Stage 3 must be read-only | Move side effect to `POST /composer/apply` |
| Direct `runs.json.write(...)` | Breaks append-only contract | Use `run_store.append(...)` from `runs.py` |
| New `@app.post(...)` declared in `server.py` outside the router pipeline | Bypasses middleware (auth, rate limit, cap) | Add to a router module under `backend/routers/` |
| `os.getenv("SIGNAL_API_KEY")` in new code | Writes to legacy name surface | Use `GAUNTLET_API_KEY` (config reads SIGNAL_* as fallback) |
| Inline `dict` body on a route handler | Silent contract drift | Declare a Pydantic model in `models.py`, reference it |
| Hard-coded model name in `routers/`, `tools.py`, or any new code | Breaks provider precedence | Pass intent + context to `gateway.select(role)` |
| New endpoint that does not write to `runs.json` | Silent execution; ledger lies | Always write a row, even on refusal or error |
| Logging `request.body` directly | Token / key leak risk | `log_redaction.redact(body)` first |
| New backend module not added to CI's `mods` tuple | Silent failure path | Append to `.github/workflows/ci.yml` `mods` list in same PR |
| Multiple engine instances (each router builds its own) | Splits state, breaks failure memory | Use shared accessor in `runtime.py` |
| Response payload containing banned label like `"Submit"`, `"Run"`, `"Preview"` | Voice contract leaks via API | Use canonical labels (Enviar, Executar, Resposta) |
| Returning a `filesystemWrite` plan to a browser shell | Plan unrenderable; shell silently drops it | Inspect `ambient.capabilities`; shape plan to match |
| New retry path without fingerprint check | Anti-loop bypassed | Compute fingerprint; consult `memory.failures` first |
| `POST /memory/clear` exposed without auth | Operator-only surface left open | Apply API key gate explicitly |

---

## Example invocations (how a user might trigger this skill)

- "Add a new `/composer/refine` endpoint that re-runs preview with operator feedback."
- "Wire OpenAI as a fourth provider in the gateway."
- "The agent loop is calling Anthropic directly somewhere — find it."
- "Add a tool to the registry that reads a local file."
- "I want a new field `cost_usd` in `runs.json`."
- "Why is `failure_memory.json` growing without bound?"
- "Add rate-limit overrides per-route."
- "Migrate this endpoint from `SIGNAL_API_KEY` to `GAUNTLET_API_KEY`."
- "Refactor `composer.py` `_route_model` to use the gateway."
- "The Composer says 'Submit' on a button — find it." (likely backend response payload)

---

## Reference

- Project doutrina: `/CLAUDE.md`.
- Public README: `/README.md` (provider precedence, endpoint catalog, security table).
- Backend README: `backend/README.md`.
- Operations: `/docs/OPERATIONS.md`.
- Security audit: `/docs/SECURITY_AUDIT.md`.
- Composer canonical surface spec: `/docs/canon/COMPOSER_SURFACE_SPEC.md`.
- Composer flow contract: `/README.md` § "Fluxo Composer (canónico)".
- CI canonical module list + test config: `.github/workflows/ci.yml`.
- Backend source: `backend/`.
- Companion skills: `gauntlet-design-system` (frontend boundary, Aether canon), `gauntlet-tauri-shell` (desktop shell), `gauntlet-release-discipline` (versioning + canonical naming timeline).

If something in this skill conflicts with `/CLAUDE.md` or with the actual backend code on main, the **code wins**. Repo truth beats narrative.
