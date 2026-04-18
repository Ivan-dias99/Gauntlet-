# Ruberra

Two-process system: a React/Vite frontend (the **face**) and a FastAPI
Python backend (the **brain**). The face renders the chambers and UI
state; the brain runs the triad+judge pipeline, the agent loop, the
tool registry, and the failure memory.

## Layout

```
src/                    React frontend (Vite, TypeScript)
  main.tsx              entry
  App.tsx               ErrorBoundary → ThemeProvider → SpineProvider → Shell
  shell/                Shell, CanonRibbon, RitualEntry
  chambers/             Lab, Creation, Memory, School
  spine/                UI state (localStorage) — NOT the source of truth
  hooks/useAI.ts        SSE client for /api/chat
  theme/                dark/light CSS vars
  trust/ErrorBoundary   top-level error boundary

api/chat.ts             Vercel edge endpoint → forwards to RUBEIRA_BACKEND_URL
vite.config.ts          dev server + /api proxy to the Python backend

rubeira-backend/        FastAPI — the real cerebrum
  server.py             /ask, /dev, /route, /memory/*, /diagnostics
  engine.py             triad (3x parallel) + judge
  agent.py              agent loop with tool-use + anti-loop guard
  tools.py              8 tools: web_search, execute_python, read_file,
                        list_directory, git, run_command, fetch_url, package_info
  memory.py             persistent failure memory (JSON on disk)
  doctrine.py           system / judge / agent prompts
  models.py             Pydantic contracts
```

## Run (local)

```bash
# Terminal 1 — Python brain
cd rubeira-backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
python main.py                       # http://127.0.0.1:3002

# Terminal 2 — React face
npm install
npm run dev                          # http://localhost:5173
```

`npm run dev` proxies `/api/*` to `http://127.0.0.1:3002/*`.

## State model — honest

The frontend keeps UI state in `localStorage` under `ruberra:spine:v1`:
missions, notes, tasks, principles, event log. It is **not** a sovereign
memory. It is ephemeral UI state. The brain owns the truth.

The Python backend persists failure memory to
`rubeira-backend/data/failure_memory.json`. Domain persistence beyond
that (missions, artifacts, tool calls, agent runs) is not yet wired.

## What is wired today

- Frontend ↔ `/api/chat` ↔ (dev: vite proxy | prod: Vercel edge) ↔
  Anthropic, direct streaming chat.
- Python backend ↔ Anthropic — triad, judge, agent loop, tools,
  failure memory.

## What is NOT wired yet

- Chamber-level routing to `/route`, `/dev`, `/ask` on the Python
  backend. The endpoints exist; the UI still talks to the plain
  streaming chat.
- Domain persistence beyond failure memory.

## Deploy

- **Frontend** → Vercel. `api/chat.ts` runs at the edge and forwards to
  `RUBEIRA_BACKEND_URL`.
- **Backend** → any host that runs FastAPI (Fly, Railway, Render, a VM).
  Set `RUBEIRA_BACKEND_URL` in the Vercel project to its public URL.

## Status

Local-first works. Production requires the Python backend to be hosted
externally and `RUBEIRA_BACKEND_URL` set in the Vercel project.
