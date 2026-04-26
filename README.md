# Signal

Sovereign AI workspace over external models. Two processes: a React/Vite
frontend (the **shell**) and a FastAPI Python backend (the **brain**).
The shell renders the five chambers; the brain runs the self-consistency
triad + judge, the agent loop, the crew orchestrator, the tool registry,
the failure memory, the run ledger, the workspace spine, and the chamber
profiles that decide how each chamber dispatches a query.

## Chambers

| Chamber  | Role                                                     | Dispatch       |
|----------|----------------------------------------------------------|----------------|
| Insight  | Evidence pressure · direction · thesis refinement        | triad + judge  |
| Surface  | Visual contract · design output workstation              | sonnet 4.6     |
| Terminal | Code · execution · tool use · patches                    | agent loop     |
| Archive  | Retrieval · provenance · run ledger · artifact lineage   | triad (read)   |
| Core     | Policies · Routing · Permissions · Orchestration · System | triad (read)  |

Surface ships a real Sonnet 4.6 generator with strict Pydantic
validation; the mock path runs only when `SIGNAL_MOCK=1`. The plan
contract carries `mock: true/false` so the UI labels honestly.

## Layout

```
src/                          React frontend (Vite, TypeScript)
  main.tsx                    entry
  App.tsx                     ErrorBoundary → TweaksProvider → SpineProvider → Shell
  shell/                      Shell, CanonRibbon, DormantPanel, EmptyState, ErrorPanel
  chambers/
    insight/                  Insight — evidence pressure
    surface/                  Surface — design workstation
    terminal/                 Terminal — code + tool-use agent loop
    archive/                  Archive — run ledger + artifact lineage
    core/                     Core — Policies · Routing · Permissions · Orchestration · System
  hooks/
    useSignal.ts              SSE client — every backend call routes through here
    useBackendStatus.ts       /health/ready probe — 4 honest readiness states
    useDiagnostics.ts         /diagnostics — single source of truth for tool registry + system doctrine
  spine/                      Workspace state (SpineContext, store, client, types, validation)
  lib/signalApi.ts            canonical edge client + typed error envelopes
  tweaks/                     Theme / UI preferences (localStorage)
  trust/                      ErrorBoundary
  i18n/copy.ts                pt-BR + en strings
  styles/tokens.css           the design canon — radius / spacing / type / motion / chamber-DNA
  __tests__/                  vitest

api/signal.ts                 Vercel edge forwarder — /api/signal/*
api/_forwarder.ts             shared forwarder helper (signal-only)
vite.config.ts                dev proxy: /api/signal/* → http://127.0.0.1:3002
vercel.json                   SPA catch-all + /api/signal rewrite

signal-backend/               FastAPI — the brain
  server.py                   HTTP endpoints, SSE heartbeat, tools/diagnostics registry
  engine.py                   triad + judge pipeline + auto-router + chamber dispatch
  agent.py                    agent loop (tool-use, anti-loop fingerprint, per-chamber allowlist)
  crew.py                     multi-agent: planner → researcher → coder → critic
  tools.py                    8 hardened tools (SSRF defence, deny-by-default exec)
  chambers/                   chamber profiles + per-chamber prompts
    profiles.py               ChamberKey, ChamberProfile dataclass
    insight.py · surface.py · terminal.py · archive.py · core.py
  doctrine.py                 prompt assembly helpers
  models.py                   Pydantic contracts
  memory.py                   failure memory (SQLite)
  runs.py                     run ledger (SQLite, refused-with-reason gate)
  spine.py                    workspace snapshot (SQLite, single-row)
  db.py                       SQLite store + one-shot JSON migration
  persistence.py              atomic writes + corrupt-file quarantine
  mock_client.py              zero-network Anthropic stand-in (SIGNAL_MOCK=1)
  config.py                   env-driven settings
  data/                       SIGNAL_DATA_DIR — signal.db lives here
  tests/                      pytest suite
```

## Runtime path

```
Browser → /api/signal/{route}
  dev:  vite proxy             → http://127.0.0.1:3002/{route}
  prod: Vercel edge function   → $SIGNAL_BACKEND_URL/{route}
                               → FastAPI (server.py)
                               → engine / agent / crew / chambers.surface
                               → Anthropic API (server-side only)
```

No frontend-to-Anthropic calls. Every AI route traverses the backend.

## Chambers → backend

| Chamber  | Endpoint                  | Notes                                 |
|----------|---------------------------|---------------------------------------|
| Insight  | `POST /route/stream`      | `chamber:"insight"` → triad           |
| Surface  | `POST /route/stream`      | `chamber:"surface"` → Sonnet 4.6 plan |
| Terminal | `POST /dev/stream`        | agent loop + tool allowlist           |
| Terminal | `POST /crew/stream`       | planner → researcher → coder → critic |
| Archive  | `GET /runs`, `/runs/stats`| run log + aggregate stats             |
| Core     | `GET /diagnostics`        | tools registry + system doctrine + boot |
| (all)    | `GET/POST /spine`         | workspace sync (debounced 500ms)      |
| (status) | `GET /health/ready`       | honest yes/no for the readiness chip  |

All SSE streams emit `: keepalive\n\n` every 12s so edge proxies and
browsers do not drop long Anthropic calls.

## Run locally

```bash
# Terminal 1 — brain
cd signal-backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...    # or SIGNAL_MOCK=1 for canned pipeline
python main.py                          # http://127.0.0.1:3002

# Terminal 2 — shell
npm install
npm run dev                             # http://localhost:5173
```

`run_command` (gated set) and `execute_python` are blocked unless
`SIGNAL_ALLOW_CODE_EXEC=true`. See `.env.example`.

Keyboard: `Alt + 1..5` switches chambers (insight · surface · terminal
· archive · core). Ignored when focus is in an input/textarea.

## Test

```bash
# frontend
npm run typecheck
npm test          # vitest

# backend
cd signal-backend
pip install pytest pytest-asyncio
SIGNAL_MOCK=1 pytest tests/ -q
```

CI (`.github/workflows/ci.yml`) runs typecheck + vitest + build on the
frontend and compileall + pytest on the backend.

## State model

**Backend owns:**
- One SQLite file at `${SIGNAL_DATA_DIR}/signal.db`, three tables:
  - `runs`     — run ledger (agent · crew · triad · surface)
  - `spine`    — workspace snapshot (single row)
  - `failures` — failure memory keyed by question fingerprint
- WAL mode, single-writer asyncio lock, indexed on `mission_id`,
  `fingerprint`, `timestamp`. On first boot, legacy `runs.json` /
  `spine.json` / `failure_memory.json` are imported one-shot and
  renamed to `*.migrated`.
- System Doctrine (six articles) is exposed via `/diagnostics`.

**Frontend local-only:**
- Theme, density, accent, language (`signal:tweaks` localStorage)
- Mission spine (`signal:spine:v1` localStorage; mirrored to backend)
- Optimistic UI state for in-flight mutations

The `SpineContext` syncs the workspace snapshot to the backend on every
mutation (debounced 500ms). On mount, the remote snapshot wins if its
`updatedAt` is newer than the local copy — multi-device safe.

## Doctrine gates

* **Refused without judgment** — `runs.record()` stamps any refusal
  arriving without `judge_reasoning` / `termination_reason` / errored
  tool_call as `termination_reason = missing_judgment_quarantine`.
  Archive renders these as degraded provenance, never as "sem motivo".
* **Garbage missions** — Insight and Surface composers run
  `validateMissionTitle` before `createMission`; titles that fail
  (`jhjhjj,`-class) are rejected with a typed reason.
* **Honest readiness** — `useBackendStatus` polls `/health/ready` and
  surfaces `ready_real | mock | degraded | unreachable`. The shell
  never displays "live" by default.
* **Tool registry** — `/diagnostics.tools` is the single source of
  truth. Frontend has no hardcoded list; if the backend is unreachable
  the UI says "registry unavailable" instead of inventing a fallback.

## Deploy

- **Frontend** → Vercel. `api/signal.ts` runs at the edge and forwards
  all `/api/signal/*` requests to `$SIGNAL_BACKEND_URL` via the rewrite
  in `vercel.json`. Set `SIGNAL_BACKEND_URL` in the Vercel project env
  to the backend public domain.
- **Backend** → any host that runs FastAPI (Railway, Fly, Render, a
  VM). Production deploys MUST mount a persistent volume at
  `${SIGNAL_DATA_DIR}` (default `/data` in the Dockerfile) — without it,
  every restart wipes failure memory, run log and spine.

The Vercel edge forwarder emits `x-signal-backend: unreachable` on 503
so clients can discriminate edge failure from upstream failure without
regex-ing the body.

## Backend endpoints

```
GET  /health                    liveness — always 200 (body carries signal)
GET  /health/ready              honest yes/no — 503 when degraded/mock
GET  /diagnostics               tools registry · system doctrine · boot · persistence
POST /ask                       triad + judge (non-streaming)
POST /ask/batch                 up to 5 queries at once
POST /route                     auto-router (non-streaming)
POST /route/stream              auto-router (SSE) — surface fork inside
POST /dev                       agent loop (non-streaming)
POST /dev/stream                agent loop (SSE)
POST /crew/stream               multi-agent crew (SSE)
GET  /runs                      run log (filterable by mission_id)
GET  /runs/stats                aggregate stats
GET  /runs/{id}                 single run
GET  /memory/stats              failure memory stats
GET  /memory/failures           recent failure records
POST /memory/clear              clear failure memory (confirm=true)
GET  /spine                     workspace snapshot
POST /spine                     replace workspace snapshot
```

## Audit

See `CONTRACT_AUDIT.md` for the inventory of contract drift this wave
closed (P0/P1/P2), what stays intentionally deferred, and the build/test
matrix used to verify every fix.
