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
  hooks/useRuberra.ts         SSE client — every backend call routes through here
  spine/                      Workspace state (SpineContext, store, client, types)
  lib/signalApi.ts            canonical edge client (ruberraApi.ts kept as compat shim)
  tweaks/                     Theme / UI preferences (localStorage)
  trust/                      ErrorBoundary
  i18n/                       copy.ts
  styles/tokens.css           the design canon — radius / spacing / type / motion / chamber-DNA

api/signal.ts                 Vercel edge forwarder — canonical /api/signal/*
api/ruberra.ts                Vercel edge forwarder — legacy /api/ruberra/* (compat alias)
api/_forwarder.ts             shared forwarder helper (dual unreachable header)
vite.config.ts                dev proxy: /api/signal/* (+ legacy /api/ruberra/*)
vercel.json                   SPA catch-all + both /api/* rewrites

signal-backend/               FastAPI — the brain
  server.py                   HTTP endpoints (/health, /route, /dev, /crew, /spine, /runs, /diagnostics, …)
  engine.py                   triad + judge pipeline + auto-router + Surface-mock fork
  agent.py                    agent loop (tool-use, anti-loop fingerprint, per-chamber tool allowlist)
  crew.py                     multi-agent: planner → researcher → coder → critic
  tools.py                    7 active + 1 gated tool (SSRF defence, deny-by-default command policy, GitTool — execute_python is registered but disabled unless SIGNAL_ALLOW_CODE_EXEC=true)
  chambers/                   chamber profiles + per-chamber prompts
    profiles.py               ChamberKey enum, ChamberProfile dataclass, five populated profiles
    insight.py · surface.py · terminal.py · archive.py · core.py
  memory.py                   persistent failure memory (JSON on disk)
  doctrine.py                 prompt assembly helpers (build_judge_input, build_refusal_message, …)
  models.py                   Pydantic contracts (RuberraQuery, RuberraResponse, SpineSnapshot, …)
  spine.py                    workspace snapshot store
  runs.py                     append-only run log (agent / triad / crew / surface)
  config.py                   env-driven settings
  main.py                     uvicorn entry
```

## Runtime path

```
Browser → /api/signal/{route}   (canonical)
       → /api/ruberra/{route}   (legacy alias, routes identically)
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
export ANTHROPIC_API_KEY=sk-ant-...   # or RUBERRA_MOCK=1 for canned pipeline
python main.py                         # http://127.0.0.1:3002

# Terminal 2 — shell
npm install
npm run dev                            # http://localhost:5173
```

Agent `run_command` and `execute_python` are gated by
`RUBERRA_ALLOW_CODE_EXEC` (default `false`). Set to `true` to allow
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
- Theme, density, accent, language (`signal:tweaks` localStorage;
  `ruberra:tweaks` read as silent legacy fallback)
- Mission spine (`signal:spine:v1`; `ruberra:spine:v1` legacy fallback)
- Optimistic UI state for in-flight mutations

The `SpineContext` syncs the workspace snapshot to the backend on every
mutation (debounced 500ms). On mount, the remote snapshot wins if its
`updatedAt` is newer than the local copy — multi-device safe.

## Deploy

- **Frontend** → Vercel. `api/signal.ts` runs at the edge and forwards
  all `/api/signal/*` requests to `$SIGNAL_BACKEND_URL` via the explicit
  rewrite in `vercel.json`. `api/ruberra.ts` is kept as a legacy alias
  during the Wave-0 → Wave-8 compatibility window.
- **Backend** → any host that runs FastAPI (Railway, Fly, Render, a VM).
  Set `SIGNAL_BACKEND_URL` (preferred) or legacy `RUBERRA_BACKEND_URL`
  in the Vercel project env to the backend's public URL.

The Vercel edge forwarder emits **both** `x-signal-backend: unreachable`
and `x-ruberra-backend: unreachable` on 503, so clients against either
contract keep working during the compat window.

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

## Security (Wave P-31)

Five defense-in-depth layers, each opt-in via env so local dev / current
deploys keep working unchanged. All knobs are documented inline in
`signal-backend/config.py`.

| Layer | Module | Enable with | Default |
|-------|--------|-------------|---------|
| 1. API key gate (Bearer) | `signal-backend/auth.py` | `SIGNAL_API_KEY=…` (alias `RUBERRA_API_KEY`) | off (no auth) |
| 2. Rate limiter (token bucket) | `signal-backend/rate_limit.py` | always on; disable with `SIGNAL_RATE_LIMIT_DISABLED=1` | on |
| 3. Security headers (CSP, X-Frame, …) | `signal-backend/security_headers.py` | always on; HSTS via `SIGNAL_HSTS=1` | on (HSTS off) |
| 4. Body-size cap | `server.py` middleware | `SIGNAL_MAX_BODY_BYTES=…` (default 1 MiB) | on |
| 5. Log token redaction | `signal-backend/log_redaction.py` | `SIGNAL_LOG_REDACT=1` (default) | on |

Frontend opt-in: when `VITE_SIGNAL_API_KEY` is set at build time,
`signalFetch` automatically attaches `Authorization: Bearer <key>` to
every backend call.

Behaviour:

- The API gate skips `/health`, `/health/ready`, and CORS preflight so
  Railway / Vercel probes keep working without credentials. Everything
  else (including `/diagnostics`) requires the bearer token. Misses
  return a typed `{error:"auth_required",…}` envelope (HTTP 401).
- Rate limit buckets per `(client_ip, route_class)` — `agent` (10/2),
  `spine` (60/30), `read` (30/10), `external` (10/2), `default` (20/5).
  429 responses carry `retry_after_ms` in the envelope. Set
  `SIGNAL_TRUST_PROXY=1` only when the deploy actually sits behind a
  trusted proxy (Vercel edge, Railway router).
- Security headers stamp every response (including 4xx/5xx). HSTS is
  off by default — only enable on prod https deploys; turning it on
  against `http://localhost` will pin the browser for a year.
- Body cap rejects oversize uploads with HTTP 413 before any work
  happens. `/visual-diff` has a 16 MiB per-route override since
  screenshots routinely exceed 1 MiB.
- Log redaction masks Authorization headers, GitHub PATs, Anthropic /
  OpenAI keys, and 32+-char hex/base64 tokens before the formatter
  emits the line.

`/diagnostics` reports which layers are active (`security` block).

## Compat window

The Wave-0 → Wave-8 migration keeps every old contract alive in parallel
with the canonical one:

- `/api/ruberra/*` still routes alongside `/api/signal/*`
- `x-ruberra-backend: unreachable` still fires alongside `x-signal-backend`
- `RUBERRA_BACKEND_URL`, `VITE_RUBERRA_API_BASE` still read as env fallbacks
- `ruberra:spine:v1`, `ruberra:tweaks`, `ruberra:landed` storage keys
  still read as silent legacy fallbacks on boot
- `ruberra:chamber` DOM event still listened + dispatched alongside
  `signal:chamber`
- `src/lib/ruberraApi.ts` still re-exports the canonical surface under
  the legacy names (`ruberraFetch`, `RUBERRA_API_BASE`)

These shims are removed in Wave 8b once a deployed smoke confirms
parity of the canonical surfaces under real traffic.
