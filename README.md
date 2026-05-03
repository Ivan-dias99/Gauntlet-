# Ruberra Composer

Cursor capsule + sovereign brain + operator console.

Three processes:

1. **Brain** — `signal-backend/` (FastAPI). Triad + judge, agent loop, crew
   orchestrator, tool registry, failure memory. Owns the Composer routes
   (`/composer/{context,intent,preview,apply}`) that the cursor capsule
   consumes.
2. **Cursor capsule** — `apps/browser-extension/` (WXT, Manifest V3).
   The actual product surface. Press `Alt+Space` on any page → capsule →
   brain → result → cursor never leaves the page.
3. **Studio** — `src/` (React + Vite). The IDE-shaped surface for
   Composer. Single destination at `/composer/*`. Sidebar nav
   (Workspace / Compose / Governance), Idle hero with real-data tiles
   (Recent commands, Last used tools, Readiness status), Permissions &
   Privacy summary, status bar. The Governance group (Memory · Models ·
   Permissions · Ledger · Settings) absorbed every surface that used to
   live under the deleted `/control/*` layout — there is now **one
   house**. Legacy `/control/*` paths redirect to their `/composer/*`
   equivalents.

   Doctrine: **the capsule is the product, the studio is where Composer
   is inspected, configured, and operated standalone**. If a user opens
   the studio for work that should fit in the capsule, the capsule has
   failed its function. The studio justifies existing only because it
   makes the capsule more powerful — never as a replacement for it.

## Norte

Four pillars. Everything else is consequence.

1. **Don't be wrong.** Refusal is the default; an answer is the
   exception. The triad runs three analyses; if any of them diverges,
   the judge returns `low` and the capsule shows `DEFAULT_REFUSAL`
   instead of fluent invention. Errar com confiança é o pior estado.
2. **Sovereignty over external models.** The backend owns the contract,
   the memory, and the ledger. The provider (Anthropic) is a swappable
   engine. Zero frontend-to-Anthropic calls — every AI route traverses
   the brain.
3. **Cursor capsule, not chamber app.** The Composer surface lives at
   the operator's cursor (browser extension), not in a tab the user
   has to switch to. The five-chamber shell that preceded this is
   archived under `_legacy/` for reference.
4. **Memory of failure.** `failure_memory.json` remembers questions
   that failed; `runs.json` is an append-only ledger of every
   execution; the agent loop carries an anti-loop fingerprint. The
   system does not retry blindly.

## Composer flow (canonical)

```
Browser page  →  Alt+Space (capsule)
              →  POST /composer/context   (capture selection + url)
              →  POST /composer/intent    (classify + route to model)
              →  POST /composer/preview   (engine.process_query
                                            | engine.process_dev_query)
              →  Capsule shows artifact
              →  Operator clicks Copy or rejects
              →  POST /composer/apply     (record to runs.json)
```

Two rows land in `runs.json` per cycle: `route="composer"` (envelope) and
`route="agent"` or `route="triad"` (the underlying brain call). Both
correlate via the embedded `composer:intent_id` marker.

## Layout

```
apps/browser-extension/      WXT + Manifest V3 — the cursor capsule
  wxt.config.ts              MV3 manifest, Alt+Space command, host_perms
  lib/composer-client.ts     typed 4-route HTTP client
  lib/selection.ts           selection snapshot helper
  components/Capsule.tsx     input + Compor + preview + Copy + Esc
  entrypoints/content.tsx    injects capsule via createShadowRootUi
  entrypoints/background.ts  service worker (chrome.commands listener)
  entrypoints/popup/         toolbar fallback for chrome:// pages

src/                         React Studio (Vite, TypeScript)
  main.tsx                   entry
  App.tsx                    ErrorBoundary → Tweaks → Spine → Router
  router.tsx                 routes (/composer/* + /control/* redirects)
  composer/
    ComposerLayout.tsx       sidebar + outlet + status bar (studio shell)
    shell/
      SidebarNav.tsx         3-group nav (Workspace · Compose · Governance)
      IdleHero.tsx           orb + 4 pillars + connection lines + chip
      RecentCommands.tsx     /runs?limit=5 tile
      LastUsedTools.tsx      tools derived from /runs tile
      ReadinessStatus.tsx    /health-driven readiness tile
      PermissionsPanel.tsx   right-rail summary derived from MATRIX
      StatusBar.tsx          STATUS · CONNECTION · MODE · TIME · VERSION
      StudioHome.tsx         hero + 3-tile grid + permissions panel
      StudioStub.tsx         honest "next" page for unwired routes
      StudioPrimitives.tsx   Panel · SurfaceHeader · Kv (shared chrome)
      icons.tsx              14 inline SVG glyphs (currentColor)
    panels/ComposeCanvas.tsx end-to-end Compose mode (Fase 3 mounts)
    composerClient.ts        thin wrappers around 4 /composer/* routes
    types.ts                 wire shapes mirroring signal-backend/models.py
    hooks/useRecentRuns.ts   typed /runs fetch + tool derivation
  pages/                     surfaces absorbed into /composer/*
    OverviewPage.tsx         /health + /diagnostics summary
    SettingsPage.tsx         backend config + per-session theme
    ModelsPage.tsx           /gateway/summary tables
    PermissionsPage.tsx      connector × scope matrix (read-only V0)
    MemoryPage.tsx           failure memory + clear action
    LedgerPage.tsx           runs list + filter + run detail
  spine/                     workspace state primitives
  tweaks/                    feature-flag context
  trust/                     ErrorBoundary
  hooks/                     useBackendStatus, useGitStatus, useSignal
  lib/                       signalApi (canonical) + ruberraApi shim
  components/atoms/          Pill, Segmented, TokenInput
  design/                    typed token graph + injectCssVariables
  styles/tokens.css          design tokens (mono/serif/colors)
  i18n/                      translation strings

_legacy/                     Archived five-chamber shell (Op 3)
  shell/                     CanonRibbon, PageShell, Chamber*
  chambers/                  insight, surface, surface-final, terminal,
                             archive, core (six chambers)
  pages/                     Old SPA pages (LandingPage, ChambersPage, …)
  preview-agent/             Surface chamber's iframe runtime
  router.tsx                 Old route table
  App.legacy.tsx             Old entry component
  lib/                       previewBridge, intentSwitchGuard

api/signal.ts                Vercel edge forwarder — /api/signal/*
api/ruberra.ts               Vercel edge forwarder — /api/ruberra/* (alias)
api/_forwarder.ts            shared forwarder helper
vite.config.ts               dev proxy: /api/{signal,ruberra}/*
vercel.json                  SPA catch-all + both /api/* rewrites

signal-backend/              FastAPI — the brain
  server.py                  HTTP endpoints
  composer.py                /composer/{context,intent,preview,apply} (Op 1)
  engine.py                  triad + judge pipeline + auto-router
  agent.py                   agent loop (tool-use, anti-loop fingerprint)
  crew.py                    multi-agent: planner → researcher → coder → critic
  tools.py                   tool registry (filesystem, run_command, …)
  chambers/                  chamber profiles + per-chamber prompts
    profiles.py              ChamberKey enum + ChamberProfile dataclass
    insight.py · surface.py · terminal.py · archive.py · core.py
  memory.py                  persistent failure memory (JSON on disk)
  doctrine.py                prompt assembly helpers
  models.py                  Pydantic contracts (incl. Composer types)
  spine.py                   workspace snapshot store
  runs.py                    append-only run log
  config.py                  env-driven settings
  main.py                    uvicorn entry
```

## Run locally

```bash
# Terminal 1 — brain
cd signal-backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...   # or SIGNAL_MOCK=1 for canned pipeline
python main.py                         # http://127.0.0.1:3002

# Terminal 2 — Studio (single destination, browser tab)
npm install
npm run dev                            # http://localhost:5173/composer

# Terminal 3 — cursor capsule (the actual product)
cd apps/browser-extension
npm install
npm run dev                            # opens Chrome with the extension loaded
                                       # press Alt+Space on any page
```

The capsule talks directly to `http://127.0.0.1:3002/composer/*` in dev
(declared in `apps/browser-extension/wxt.config.ts` under
`host_permissions`). The studio talks via the Vite proxy.

## Backend endpoints

```
GET  /health                    liveness (always 200; body carries signal)
GET  /health/ready              honest yes/no (503 when degraded)
GET  /diagnostics               full system diagnostics
GET  /gateway/summary           model-routing + cost summary

POST /composer/context          Stage 1: capture authorized context
POST /composer/intent           Stage 2: classify + route to model
POST /composer/preview          Stage 3: generate artifact (no side-effects)
POST /composer/apply            Stage 4: apply or reject + record run

POST /ask                       triad + judge (non-streaming)
POST /ask/batch                 up to 5 queries at once
POST /route                     auto-router (non-streaming)
POST /route/stream              auto-router (SSE)
POST /dev                       agent loop (non-streaming)
POST /dev/stream                agent loop (SSE)
POST /crew/stream               multi-agent crew (SSE)

GET  /runs                      run log (filterable by mission_id)
GET  /runs/stats                aggregate stats
GET  /runs/{id}                 single run
GET  /memory/stats              failure memory stats
GET  /memory/failures           recent failure records
POST /memory/clear              clear failure memory
GET  /spine                     workspace snapshot
POST /spine                     replace workspace snapshot
```

## Security (Wave P-31)

Five defense-in-depth layers, each opt-in via env. All five wrap the
Composer routes automatically since they mount on the same FastAPI app.

| Layer | Module | Enable with | Default |
|-------|--------|-------------|---------|
| 1. API key gate (Bearer) | `signal-backend/auth.py` | `SIGNAL_API_KEY=…` (alias `RUBERRA_API_KEY`) | off (no auth) |
| 2. Rate limiter (token bucket) | `signal-backend/rate_limit.py` | always on; disable with `SIGNAL_RATE_LIMIT_DISABLED=1` | on |
| 3. Security headers | `signal-backend/security_headers.py` | always on; HSTS via `SIGNAL_HSTS=1` | on (HSTS off) |
| 4. Body-size cap | `server.py` middleware | `SIGNAL_MAX_BODY_BYTES=…` (default 1 MiB) | on |
| 5. Log token redaction | `signal-backend/log_redaction.py` | `SIGNAL_LOG_REDACT=1` (default) | on |

## Deploy

- **Control Center frontend** → Vercel. `api/signal.ts` runs at the edge
  and forwards `/api/signal/*` to `$SIGNAL_BACKEND_URL`.
  `api/ruberra.ts` is the legacy alias kept during the compat window.
- **Backend** → any host that runs FastAPI (Railway, Fly, Render, a VM).
  Set `SIGNAL_BACKEND_URL` (preferred) or legacy `RUBERRA_BACKEND_URL`
  in the Vercel project env to the backend's public URL.
- **Browser extension** → bundled with `wxt build`, distributed via
  `.zip` (Chrome Web Store / Firefox Add-ons) or loaded unpacked.

## Compat window (Wave 0 → Wave 8)

The migration keeps every old contract alive in parallel with the
canonical one:

- `/api/ruberra/*` still routes alongside `/api/signal/*`
- `x-ruberra-backend: unreachable` still fires alongside `x-signal-backend`
- `RUBERRA_BACKEND_URL`, `VITE_RUBERRA_API_BASE` still read as env fallbacks
- `ruberra:spine:v1`, `ruberra:tweaks`, `ruberra:landed` storage keys
  still read as silent legacy fallbacks on boot
- `src/lib/ruberraApi.ts` still re-exports the canonical surface under
  the legacy names (`ruberraFetch`, `RUBERRA_API_BASE`)

These shims are removed in Wave 8b once a deployed smoke confirms
parity of the canonical surfaces under real traffic.

## Composer V0 transition

The five-operation transition from five-chamber shell to cursor capsule:

| Op | Status | Commit | What |
|----|--------|--------|------|
| 1  | Green  | `0166f4d` | `/composer/*` routes wired to engine + agent + ledger |
| 2  | Green (build) | `3fc6764` | `apps/browser-extension/` (WXT, MV3, Alt+Space) |
| 3  | Green  | `15ac30f` | Five-chamber shell archived under `_legacy/` |
| 4  | Green  | `a94f4c1` | Control Center (5 surfaces) replaces placeholder |
| 5  | Pending | —      | Canonical rename + tag `composer-v0` (operator-side) |

See `docs/COMPOSER_V0.md` for the doctrine and per-operation gates.
