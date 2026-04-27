# Signal

Sovereign AI workspace over external models. Two processes: a React/Vite
frontend (the **shell**) and a FastAPI Python backend (the **brain**).
The shell renders the five chambers; the brain runs the self-consistency
triad + judge, the agent loop, the crew orchestrator, the tool registry,
the failure memory, and the chamber profiles that decide how each
chamber dispatches a query.

## Norte

Four pillars. Everything else is consequence.

1. **Don't be wrong.** Refusal is the default; an answer is the
   exception. Insight runs three analyses; if any of them diverges,
   the judge returns `low` and the user sees `DEFAULT_REFUSAL` instead
   of fluent invention. Errar com confiança é o pior estado.
2. **Sovereignty over external models.** The backend owns the
   contract, the memory and the ledger. The provider (Anthropic) is
   a swappable engine. Zero frontend-to-Anthropic calls — every AI
   route traverses the brain.
3. **Five chambers, five cognitive modes.** Insight (triad + judge),
   Surface (design workstation, mock-first by design), Terminal
   (agent loop with tool allowlist), Archive (sealed-runs ledger),
   Core (policies that bind every chamber). Five ways of thinking
   about the same problem — not five decorative tabs.
4. **Memory of failure.** `failure_memory.json` remembers questions
   that failed; `runs.json` is an append-only ledger of every
   execution; the agent loop carries an anti-loop fingerprint. The
   system does not retry blindly.

## Chambers

| Chamber  | Role                                                     | Dispatch       |
|----------|----------------------------------------------------------|----------------|
| Insight  | Evidence pressure · direction · thesis refinement        | triad + judge  |
| Surface  | Design workstation · mode × fidelity × design system     | surface mock¹  |
| Terminal | Code · execution · tool use · patches                    | agent loop     |
| Archive  | Retrieval · provenance · run ledger · artifact lineage   | triad (read)   |
| Core     | Policies · Routing · Permissions · Orchestration · System | triad (read)  |

¹ Surface ships mock-first backend in the current wave — the UI
explicitly labels the mock so nothing pretends to generate. The
chamber shell is real; the provider swap comes with the Wave-8b
compat-window closure and the first real Surface generator.

## Layout

```
src/                          React frontend (Vite, TypeScript)
  main.tsx                    entry
  App.tsx                     ErrorBoundary → TweaksProvider → SpineProvider → Shell
  shell/                      Shell, CanonRibbon, DormantPanel, EmptyState, ErrorPanel
  chambers/
    insight/                  Insight — evidence pressure
    surface/                  Surface — design workstation (layout + creation panel + exploration rail)
    terminal/                 Terminal — code + tool-use agent loop
    archive/                  Archive — run ledger + artifact lineage
    core/                     Core — Policies · Routing · Permissions · Orchestration · System
  hooks/useSignal.ts          SSE client — every backend call routes through here
  spine/                      Workspace state (SpineContext, store, client, types)
  lib/signalApi.ts            canonical edge client
  tweaks/                     Theme / UI preferences (localStorage)
  trust/                      ErrorBoundary
  i18n/                       copy.ts
  styles/tokens.css           the design canon — radius / spacing / type / motion / chamber-DNA

api/signal.ts                 Vercel edge forwarder — /api/signal/*
api/_forwarder.ts             shared forwarder helper (unreachable contract)
vite.config.ts                dev proxy: /api/signal/*
vercel.json                   SPA catch-all + /api/signal/* rewrite

signal-backend/               FastAPI — the brain
  server.py                   HTTP endpoints (/health, /route, /dev, /crew, /spine, /runs, /diagnostics, …)
  engine.py                   triad + judge pipeline + auto-router + Surface-mock fork
  agent.py                    agent loop (tool-use, anti-loop fingerprint, per-chamber tool allowlist)
  crew.py                     multi-agent: planner → researcher → coder → critic
  tools.py                    8 hardened tools (SSRF defence, deny-by-default command policy, GitTool)
  chambers/                   chamber profiles + per-chamber prompts
    profiles.py               ChamberKey enum, ChamberProfile dataclass, five populated profiles
    insight.py · surface.py · terminal.py · archive.py · core.py
  memory.py                   persistent failure memory (JSON on disk)
  doctrine.py                 prompt assembly helpers (build_judge_input, build_refusal_message, …)
  models.py                   Pydantic contracts (SignalQuery, SignalResponse, SpineSnapshot, …)
  spine.py                    workspace snapshot store
  runs.py                     append-only run log (agent / triad / crew / surface)
  config.py                   env-driven settings
  main.py                     uvicorn entry
```

## Runtime path

```
Browser → /api/signal/{route}
  dev:  vite proxy              → http://127.0.0.1:3002/{route}
  prod: Vercel edge function    → $SIGNAL_BACKEND_URL/{route}
                                → FastAPI (server.py)
                                → engine / agent / crew / chambers.surface
                                → Anthropic API (server-side only)
```

No frontend-to-Anthropic calls. Every AI route traverses the backend.

## Chambers → backend

| Chamber  | Endpoint                  | Notes                                 |
|----------|---------------------------|---------------------------------------|
| Insight  | `POST /route/stream`      | `chamber:"insight"` → triad           |
| Surface  | `POST /route/stream`      | `chamber:"surface"` → mock handler    |
| Terminal | `POST /dev/stream`        | agent loop + tool allowlist           |
| Terminal | `POST /crew/stream`       | planner → researcher → coder → critic |
| Archive  | `GET /runs`, `/runs/stats`| run log + aggregate stats             |
| Core     | `GET /diagnostics`        | read-only system snapshot             |
| (all)    | `GET/POST /spine`         | workspace sync (debounced 500ms)      |

## Run locally

```bash
# Terminal 1 — brain
cd signal-backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...   # or SIGNAL_MOCK=1 for canned pipeline
python main.py                         # http://127.0.0.1:3002

# Terminal 2 — shell
npm install
npm run dev                            # http://localhost:5173
```

Agent `run_command` and `execute_python` are gated by
`SIGNAL_ALLOW_CODE_EXEC` (default `false`). Set to `true` to allow
`pip`, `npm`, `npx`, `node`, and arbitrary Python execution inside the
Terminal agent loop. See `.env.example`.

Keyboard: `Alt + 1..5` switches chambers (insight · surface · terminal
· archive · core). Ignored when focus is in an input/textarea.

## State model

**Backend owns:**
- Failure memory (`signal-backend/data/failure_memory.json`)
- Run log (`signal-backend/data/runs.json`) — agent · crew · triad · surface
- Workspace snapshot (`signal-backend/data/spine.json`) — missions,
  notes, tasks, principles, artifacts

**Frontend local-only:**
- Theme, density, accent, language (`signal:tweaks` localStorage)
- Mission spine (`signal:spine:v1` localStorage)
- Optimistic UI state for in-flight mutations

The `SpineContext` syncs the workspace snapshot to the backend on every
mutation (debounced 500ms). On mount, the remote snapshot wins if its
`updatedAt` is newer than the local copy — multi-device safe.

## Deploy

- **Frontend** → Vercel. `api/signal.ts` runs at the edge and forwards
  all `/api/signal/*` requests to `$SIGNAL_BACKEND_URL` via the explicit
  rewrite in `vercel.json`.
- **Backend** → any host that runs FastAPI (Railway, Fly, Render, a VM).
  Set `SIGNAL_BACKEND_URL` in the Vercel project env to the backend's
  public URL.

The Vercel edge forwarder emits `x-signal-backend: unreachable` on 503
so clients can detect dormant state without regex-ing error bodies.

## Backend endpoints

```
GET  /health                    liveness (always 200; body carries signal)
GET  /health/ready              honest yes/no (503 when degraded)
GET  /diagnostics               full system diagnostics
POST /ask                       triad + judge (non-streaming)
POST /ask/batch                 up to 5 queries at once
POST /route                     auto-router (non-streaming)
POST /route/stream              auto-router (SSE) — handles Surface mock fork
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

