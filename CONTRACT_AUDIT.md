# Contract Audit — Hard Correction Wave

Branch: `claude/plan-backend-frontend-integration-cQe1Y`

This wave was a contract-closure pass: repo truth = backend truth = frontend
truth. No new chambers, no decorative widgets. Below is the inventory of
what was inconsistent, what was changed, why, and what stays deferred.

## P0 — Must-fix (closed)

### 1. Build cannot deploy with TypeScript errors
**Was:** `package.json` build was just `vite build`. `api/_forwarder.ts`
referenced `process.env` without `@types/node`, but `tsconfig.json` only
included `src/` so the error never surfaced. Vercel deployed broken TS.

**Now:**
* `package.json:build` = `npm run typecheck && vite build`.
* `tsconfig.edge.json` added — separate project covering `api/**/*.ts`
  with `types: ["node"]` and the WebWorker lib (edge runtime).
* `npm run typecheck` runs both projects sequentially.
* `@types/node@^22` added as devDep.

**Files:** `package.json`, `tsconfig.edge.json`, `api/_forwarder.ts`.

### 2. Tool registry mismatch (frontend lied about backend)
**Was:** `src/chambers/core/Permissions.tsx` and
`src/chambers/terminal/ExecutionComposer.tsx` each hardcoded a list of 7
tools including a phantom `web_fetch`. Backend (`signal-backend/tools.py`)
exposes 8 tools — `read_file`, `list_directory`, `run_command`,
`execute_python`, `git`, `web_search`, `fetch_url`, `package_info`.

**Now:**
* `signal-backend/server.py:_serialize_tool_registry()` exposes the live
  registry on `/diagnostics` (name, kind, gated, description, chambers).
* `src/hooks/useDiagnostics.ts` is the new single source of truth on the
  frontend.
* Permissions and ExecutionComposer flyout consume it; no fallback.
* Backend unreachable → "registry unavailable" instead of fake list.

**Files:** `signal-backend/server.py`, `src/hooks/useDiagnostics.ts`,
`src/chambers/core/Permissions.tsx`,
`src/chambers/terminal/ExecutionComposer.tsx`,
`src/chambers/terminal/OutputCanvas.tsx`.

### 3. "Backend live" was wishful (liveness, not readiness)
**Was:** `useBackendStatus` polled `/health` (always 200) and propagated a
mock-or-not-mock binary. UI labelled the backend "live" even when the
engine was uninitialised or persistence quarantined.

**Now:**
* `useBackendStatus` queries `/health/ready`, parses the FastAPI 503
  envelope, and surfaces four states: `ready_real | mock | degraded |
  unreachable`.
* `CanonRibbon` renders a chip per non-ready state — never "live" by
  default.
* `ExecutionComposer` shows the readiness label on the workspace bar.

**Files:** `src/hooks/useBackendStatus.ts`, `src/shell/CanonRibbon.tsx`,
`src/chambers/terminal/index.tsx`,
`src/chambers/terminal/ExecutionComposer.tsx`.

### 4. Refused runs could land without judgment
**Was:** Archive screenshot showed "— SEM MOTIVO REGISTADO —" as a
normal state on refused triad runs.

**Now:**
* `signal-backend/runs.py:record()` validates: a refused run must carry
  `judge_reasoning` OR `termination_reason` OR an errored tool call.
  Missing judgment is auto-stamped with
  `termination_reason = "missing_judgment_quarantine"`.
* `src/chambers/archive/RunDetail.tsx` renders three states:
  judgment present (normal), `missing_judgment_quarantine` (visible
  warning, "provenance degradada"), or pre-gate legacy ("legacy run ·
  juízo ausente").

**Files:** `signal-backend/runs.py`,
`src/chambers/archive/RunDetail.tsx`,
`signal-backend/tests/test_runs_judgment_gate.py`.

### 5. Garbage missions became active missions
**Was:** Inputs like `jhjhjj,` were accepted as mission titles.

**Now:**
* `src/spine/validation.ts` — validator (length, letter ratio, repeat
  ratio, vowel presence, distinct-letter floor).
* Insight + Surface composers gate `createMission` with the validator
  and surface a typed rejection: "missão não ratificada · [reason]".
* Validator covered by `src/__tests__/validation.test.ts` (6 cases).

**Files:** `src/spine/validation.ts`,
`src/chambers/insight/index.tsx`,
`src/chambers/surface/index.tsx`,
`src/__tests__/validation.test.ts`.

### 6. Dead buttons in Terminal Workbench
**Was:** Context / Docs buttons had no handlers but were clickable.

**Now:** `WorkbenchStrip` disables them when no handler is provided;
honest tooltip explains "indisponível neste contexto". No clickable
inert UI.

**Files:** `src/chambers/terminal/WorkbenchStrip.tsx`.

## P1 — Structural correction (closed)

### 7. Core Policies — System Doctrine vs Operator Constitution
**Was:** Empty Operator principles rendered "No principles. Add the
first." — implied no doctrine at all, despite the backend hard-coding
six constitutional rules.

**Now:**
* `signal-backend/server.py:SYSTEM_DOCTRINE` exposes six articles via
  `/diagnostics`.
* `src/chambers/core/Policies.tsx` renders System Doctrine first
  (read-only, backend-canonical) then Operator Constitution
  (user-inscribed). Empty operator no longer implies empty doctrine.

**Files:** `signal-backend/server.py`,
`src/chambers/core/Policies.tsx`.

### 8. Read-only governance honestly labelled
**Was:** Routing/Permissions/Orchestration looked editable, were not.

**Now:** Each tab carries the "Registry Mode" qualifier and an
explicit "read-only registry of active system contracts" intro line.
Ratification Mode reserved as a future affordance.

**Files:** `src/chambers/core/Routing.tsx`,
`src/chambers/core/Permissions.tsx`,
`src/chambers/core/Orchestration.tsx`.

### 12. Surface — canned gallery removed
**Was:** Right rail defaulted to Examples / Templates / Recent / Search
/ Library tabs with hardcoded sample data ("Operational dashboard",
"Onboarding flow — 3 steps", "Governance settings pane").

**Now:** Right rail has two states only:
* No plan generated → Visual Contract checklist (intent · output ·
  fidelity · design_system) with explicit ✓/empty marks per row.
* Plan generated → structured plan preview with mock badge when
  applicable.

The five canned tabs are gone.

**Files:** `src/chambers/surface/ExplorationRail.tsx`,
`src/chambers/surface/index.tsx`.

### 13. Design system decision is explicit
**Was:** `SurfaceBrief.design_system: Optional[str]` — silent `None`
hid "I forgot" from "I don't want one".

**Now:**
* Pydantic `DesignSystemDecision = Literal["signal_canon", "custom",
  "none_declared"]` (default `"none_declared"`).
* `design_system_label` carries the human name when `custom`.
* Frontend `CreationPanel` renders the three options as a segmented
  control; custom reveals a label input.
* Visual Contract checklist marks the row green only when the decision
  is set explicitly + label provided when `custom`.

**Files:** `signal-backend/chambers/surface.py`,
`src/hooks/useSignal.ts`,
`src/chambers/surface/CreationPanel.tsx`,
`src/chambers/surface/ExplorationRail.tsx`.

### Backend modernisation — Surface real + persistence + heartbeat
* `signal-backend/chambers/surface.py` swaps the mock for a real
  Sonnet 4.6 generator with strict Pydantic validation. `mock=True`
  only fires under `SIGNAL_MOCK=1`.
* `signal-backend/db.py` introduces SQLite (`signal.db`) with three
  tables (runs / spine / failures), WAL mode, asyncio lock. Idempotent
  one-shot import of legacy JSON sidecars on first boot.
* `runs.py`, `spine.py`, `memory.py` rewritten against SQLite.
* `signal-backend/server.py` adds `: keepalive` heartbeat every 12s on
  every SSE stream so Vercel edge / proxies don't drop long Anthropic
  calls.

## P2 — Coherence / naming (closed)

### 14. Env var naming
**Was:** Three names floating: `AGENT_ALLOW_CODE_EXEC` (frontend copy),
`SIGNAL_ALLOW_CODE_EXEC` (canonical), `RUBERRA_ALLOW_CODE_EXEC` (legacy
+ error strings).

**Now:** Only `SIGNAL_ALLOW_CODE_EXEC` is referenced in error strings,
UI copy, README, and `.env.example`. The Python identifier inside
`tools.py` is also `SIGNAL_ALLOW_CODE_EXEC`.

**Files:** `signal-backend/tools.py`,
`signal-backend/chambers/terminal.py`,
`src/chambers/core/Permissions.tsx`.

### 15. Ruberra extinct
**Was:** ~120 occurrences of Ruberra/RUBERRA across edge, frontend,
backend (compat shims, env fallbacks, storage keys, DOM events,
function names, README, docs).

**Now:** Zero. `grep -ri ruberra` returns nothing. Removed:
* `api/ruberra.ts`, `src/lib/ruberraApi.ts`
* `RUBERRA_BACKEND_URL` / `VITE_RUBERRA_API_BASE` / `RUBERRA_*` env
  fallbacks (config.py `_env`, tools.py `_env`)
* `x-ruberra-backend: unreachable` legacy header
* `vite.config.ts` `/api/ruberra` proxy, `vercel.json` rewrite
* `ruberra:tweaks`, `ruberra:spine:v1` storage keys
* `ruberra:chamber` DOM event
* `ask_ruberra_*` Python function names → `ask`, `dev_stream`, etc.
* `signal-backend/README.md`, `.env.example` rewritten from scratch
* Root `.env.example` rewritten

## Tests + CI

### Frontend (vitest)
* `src/__tests__/signalApi.test.ts` — 9 tests covering envelope parser,
  unreachable / backend error guards, header constants.
* `src/__tests__/validation.test.ts` — 6 tests covering mission validator
  including the screenshot regression `jhjhjj,`.

### Backend (pytest)
* `tests/test_imports.py` — every module imports clean; Ruberra
  symbols verified gone.
* `tests/test_runs_judgment_gate.py` — refused-without-judgment
  quarantine path.
* `tests/test_db_migration.py` — SQLite round-trips for runs and spine.
* `tests/test_health_ready.py` — `/health` always 200; `/health/ready`
  503 in mock mode; `/diagnostics` exposes the 8 tools (no `web_fetch`).
* `tests/test_surface_mock.py` — Surface generator emits start ·
  surface_plan · done.

### CI
* `.github/workflows/ci.yml` — frontend job runs typecheck + vitest +
  build; backend job runs compileall + pytest under `SIGNAL_MOCK=1`.

## Build + smoke

```
npm run typecheck    # passes (src + edge projects)
npm test             # 15 passed
npm run build        # passes (294 kB JS, 14.5 kB gz)

cd signal-backend
SIGNAL_MOCK=1 pytest tests/ -q   # 14 passed
```

## What stays intentionally deferred

* **Production Surface real-mode validation** — Sonnet 4.6 generator
  exists and is parsed strictly, but a soak test against a live key
  has not run from this branch. The mock contract is identical, so
  the front never has to switch code paths.
* **Archive global-ledger UX (P1 #9)** — backend already accepts
  `mission_id=None` queries; the chamber default still scopes to
  active mission. Default flip + filter chips not in this wave.
* **Terminal queue UX (P1 #10) and evidence states (P1 #11)** — the
  task queue is in `state.tasks` and renders, but the operational
  Open/Running/Blocked/Done block is not consolidated into a single
  visible queue object. REPO/DIFF/GATES/DEPLOY chips are not in the
  current branch's UI; nothing to disable here.
* **Deployment Truth panel (P2 #16)** — the data is now exposed via
  `/diagnostics.boot` (mode, allow_code_exec, data_dir, host, port,
  uptime) but no Core/System sub-block renders it as a deployment
  card. Operators read it via `curl /diagnostics`.

These are all UX/coverage debt — every contract they would surface is
already honest in the API.
