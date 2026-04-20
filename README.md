# Ruberra

Two-process system: a React/Vite frontend (the **face**) and a FastAPI
Python backend (the **brain**). The face renders the chambers; the brain
runs the triad+judge pipeline, the agent loop, the crew orchestrator,
the tool registry, and the failure memory.

## Layout

```
src/                         React frontend (Vite, TypeScript)
  main.tsx                   entry
  App.tsx                    ErrorBoundary → TweaksProvider → SpineProvider → Shell
  shell/                     Shell, CanonRibbon, RitualEntry, TweaksPanel, VisionLanding
  chambers/                  Lab, Creation, Memory, School
  hooks/useRuberra.ts        SSE client — all backend calls route through here
  spine/                     Workspace state (SpineContext, store, client, types)
  tweaks/                    Theme / UI preferences (localStorage only)
  theme/                     ThemeContext (thin wrapper over TweaksContext)
  trust/                     ErrorBoundary
  i18n/                      copy.ts

api/ruberra/[...path].ts     Vercel edge catchall — forwards /api/ruberra/* to RUBERRA_BACKEND_URL
vite.config.ts               dev proxy: /api/ruberra/* → http://127.0.0.1:3002/*
vercel.json                  SPA catch-all (non-API routes → index.html)

ruberra-backend/             FastAPI — the brain
  server.py                  all HTTP endpoints
  engine.py                  triad (3× parallel) + judge pipeline
  agent.py                   agent loop: tool-use + anti-loop guard
  crew.py                    multi-agent: planner → researcher → coder → critic
  tools.py                   8 tools: web_search, execute_python, read_file,
                             list_directory, git, run_command, fetch_url, package_info
  memory.py                  persistent failure memory (JSON on disk)
  doctrine.py                system / judge / agent / crew prompts
  models.py                  Pydantic contracts
  spine.py                   workspace snapshot store
  runs.py                    append-only run log
  config.py                  env-driven settings
  main.py                    uvicorn entry point
```

## Runtime path

```
Browser → /api/ruberra/{route}
  dev:  vite proxy            → http://127.0.0.1:3002/{route}
  prod: Vercel edge function  → RUBERRA_BACKEND_URL/{route}
                              → FastAPI (server.py)
                              → engine / agent / crew
                              → Anthropic API (server-side only)
```

No frontend-to-Anthropic calls. All AI routes through the backend.

## Chambers → backend

| Chamber  | Endpoint                    | Pipeline                          |
|----------|-----------------------------|-----------------------------------|
| Lab      | `POST /route/stream`        | auto-router: triad+judge or agent |
| Creation | `POST /dev/stream`          | agent loop (tool-use)             |
| Creation | `POST /crew/stream`         | multi-agent crew                  |
| Memory   | `GET /runs`, `GET /runs/stats` | run log + aggregate stats      |
| School   | `POST /spine` (via SpineContext) | workspace sync                |

## Run (local)

```bash
# Terminal 1 — brain
cd ruberra-backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
python main.py                        # http://127.0.0.1:3002

# Terminal 2 — face
npm install
npm run dev                           # http://localhost:5173
```

`npm run dev` proxies `/api/ruberra/*` to `http://127.0.0.1:3002/*`.

Agent `run_command` and `execute_python` are gated by `RUBERRA_ALLOW_CODE_EXEC`
(default `false`). Set it to `true` to allow `pip`, `npm`, `npx`, `node` and
arbitrary Python execution inside the agent loop. See `.env.example`.

## State model

**Backend owns:**
- Failure memory (`ruberra-backend/data/failure_memory.json`)
- Run log (`ruberra-backend/data/runs.json`)
- Workspace snapshot (`ruberra-backend/data/spine.json`) — missions, notes, tasks, principles

**Frontend local-only:**
- Theme, tweaks, density, accent (localStorage)
- Optimistic UI state for in-flight mutations

The SpineContext syncs the workspace snapshot to the backend on every
mutation (debounced 500 ms). On mount, the remote snapshot wins if its
`updatedAt` timestamp is newer than the local copy — multi-device safe.

## Deploy

- **Frontend** → Vercel. `api/ruberra/[...path].ts` runs at the edge and
  forwards all `/api/ruberra/*` requests to `RUBERRA_BACKEND_URL`.
- **Backend** → any host that runs FastAPI (Fly, Railway, Render, a VM).
  Set `RUBERRA_BACKEND_URL` in the Vercel project env to its public URL.

## Backend endpoints

```
GET  /health
POST /ask                 triad + judge (non-streaming)
POST /route               auto-router (non-streaming)
POST /route/stream        auto-router (SSE)
POST /dev                 agent loop (non-streaming)
POST /dev/stream          agent loop (SSE)
POST /crew/stream         multi-agent crew (SSE)
POST /ask/batch           batch up to 5 questions
GET  /runs                run log (filterable by mission_id)
GET  /runs/stats          aggregate stats
GET  /runs/{id}           single run
GET  /memory/stats        failure memory stats
GET  /memory/failures     recent failure records
POST /memory/clear        clear failure memory (confirm=true)
GET  /spine               workspace snapshot
POST /spine               replace workspace snapshot
GET  /diagnostics         full system diagnostics
```
