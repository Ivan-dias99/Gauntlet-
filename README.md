# Gauntlet

**Inteligência na ponta do cursor.**

Tu apontas. Dizes o que queres. O Gauntlet executa — sem abrires uma app de
IA, sem mudares de tab, sem dashboards no caminho. A cápsula vive colada ao
cursor, e o backend faz o trabalho sujo.

## Product Law — um Composer, duas shells

Existe **um único Gauntlet Composer**, com **duas shells de runtime**:

1. **Web runtime** — `apps/browser-extension/` (WXT, Manifest V3). Cápsula
   in-page (shadow DOM) + popup window de fallback (chrome-extension://) para
   páginas onde o content script não monta (chrome://, web store, blank tabs).
2. **Desktop runtime** — `apps/desktop/` (Tauri 2). Cápsula numa janela do SO,
   ativada por global shortcut.

Ambas as shells montam **o mesmo Composer** — `packages/composer/Capsule.tsx`.
A identidade visual, o contrato de saída, a paleta, a voz, o markdown, a
streaming UI são bit-a-bit idênticos. Só muda o que cada ambiente consegue
fornecer (selection vs. clipboard, DOM exec vs. nenhum, screenshot da tab
vs. screenshot de região), e isso é negociado via interface `Ambient` —
o Composer pergunta `ambient.capabilities` e renderiza apenas o que a casa
suporta.

Drop um quarto runtime (mobile, IDE panel, terminal TUI) e basta escrever um
quarto Ambient — o Composer não muda uma linha.

## Filosofia

Três peças, três papéis:

- **Composer** — `packages/composer/`. A cápsula. É o carro. Single source
  of truth da UI/comportamento; ambient-agnostic. Montada em duas shells
  (web extension e desktop Tauri) com paridade visual e comportamental 1:1.
- **Control Center** — `control-center/`. A garagem. Só abre quando
  precisas configurar, ver histórico, inspecionar memórias ou trocar
  modelos. Nunca compete com o Composer como local de trabalho.
- **Backend FastAPI** — `backend/`. O maestro. Multimodelo via
  model_gateway, tool registry, memória de falhas, ledger append-only,
  segurança em camadas.

## Princípios

1. **Don't be wrong.** Recusa é o default; resposta é a exceção. A memória
   de falhas torna o sistema mais cauteloso em tópicos onde já errou.
2. **Sovereignty over external models.** O backend é dono do contrato, da
   memória e do ledger. O modelo (Anthropic, Gemini, etc) é um motor
   trocável via `model_gateway`. Zero chamadas frontend → modelo.
3. **Cápsula no cursor, não app no separador.** A experiência principal
   vive na ponta do cursor (browser extension). O Control Center é cockpit,
   não cabine.
4. **Memória de falha.** `failure_memory.json` lembra perguntas que
   falharam; `runs.json` é ledger append-only de cada execução; a tool
   chain carrega anti-loop fingerprint. O sistema não tenta de novo às
   cegas.

## Fluxo Composer (canónico)

```
Browser page  →  Alt+Space (cápsula)
              →  POST /composer/context   (capture selection + url)
              →  POST /composer/intent    (classify + route to model)
              →  POST /composer/preview   (engine → preview artifact)
              →  Cápsula mostra preview
              →  Operator clicks Copy ou rejeita
              →  POST /composer/apply     (record to runs.json)
```

Duas linhas em `runs.json` por ciclo: `route="composer"` (envelope) e
`route="agent"` ou `route="triad"` (chamada interna). Correlam via
`composer:intent_id`.

## Layout

```
packages/composer/           THE Composer. Ambient-agnostic. Single source.
  Capsule.tsx                input + Compor + preview + Copy + Esc + streaming
  Pill.tsx                   resting surface (web only mounts it)
  ComposerClient.ts          4-route HTTP client over AmbientTransport
  ambient.ts                 the seam — what each runtime must provide
  markdown.tsx · voice.ts · dom-actions.ts · selection-types.ts

apps/browser-extension/      WXT + Manifest V3 — web shell
  wxt.config.ts              MV3 manifest, Alt+Space command, host_perms
  ambient/web-inpage.ts      content-script ambient (selection + DOM exec)
  ambient/web-popup.ts       popup-window ambient (fallback, no page)
  ambient/web-shared.ts      chrome.runtime fetch proxy + SSE port + storage
  components/App.tsx         pill ↔ capsule orchestration (web only)
  lib/selection.ts           window.getSelection wrapper
  lib/pill-prefs.ts          chrome.storage wrapper for pill position
  entrypoints/content.tsx    injects capsule via shadow DOM
  entrypoints/background.ts  service worker (chrome.commands listener)
  entrypoints/composer/      popup window (lifeboat for chrome:// pages)

apps/desktop/                Tauri 2 — desktop shell
  src-tauri/                 Rust side: global shortcut, screenshot, autostart
  src/ambient/desktop.ts     Tauri ambient (clipboard + window title + region shot)
  src/App.tsx                global shortcut binding + Capsule mount
  src/main.tsx               injects CAPSULE_CSS, mounts <App />
  src/adapters/tauri.ts      thin wrappers over @tauri-apps/api

control-center/              React + Vite — a garagem (operator console)
  main.tsx · App.tsx · router.tsx
  pages/                     Overview · Settings · Models · Permissions ·
                             Memory · Ledger · Composer
  spine/                     workspace state
  hooks/                     useBackendStatus, useGitStatus
  lib/                       gauntletApi (canonical) + legacy shims
  design/                    typed token graph
  styles/tokens.css          design tokens

backend/                     FastAPI — o maestro
  server.py                  HTTP endpoints
  composer.py                /composer/{context,intent,preview,apply}
  engine.py                  triad + judge pipeline + auto-router
  agent.py                   tool-using agent loop
  tools.py                   tool registry
  model_gateway.py           multimodelo routing + cost summary
  memory.py                  failure memory (JSON on disk)
  doctrine.py                prompt assembly
  models.py                  Pydantic contracts
  spine.py                   workspace snapshot store
  runs.py                    append-only run log
  config.py                  env-driven settings
  main.py                    uvicorn entry
  auth.py · rate_limit.py · security_headers.py · log_redaction.py
  db.py · migrate.py · backup.py · parity_check.py    (PG cutover)

api/                         Vercel edge forwarders
  gauntlet.ts                /api/gauntlet/* (canonical)
  signal.ts · ruberra.ts     legacy aliases

docs/OPERATIONS.md           boot · cutover · rollback · backup · deploy
```

## Run locally

```bash
# Terminal 1 — backend
cd backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...      # or GAUNTLET_MOCK=1
python main.py                            # http://127.0.0.1:3002

# Terminal 2 — Control Center (browser tab)
npm install
npm run dev                               # http://localhost:5173/control

# Terminal 3 — cápsula (o produto)
cd apps/browser-extension
npm install
npm run dev                               # carrega Chrome com a extension
                                          # press Alt+Space em qualquer página
```

A cápsula fala diretamente com `http://127.0.0.1:3002/composer/*` em dev
(declarado em `apps/browser-extension/wxt.config.ts` em `host_permissions`).
O Control Center fala via proxy do Vite.

## Backend endpoints

```
GET  /health                    liveness
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

GET  /runs                      run log (filterable)
GET  /runs/stats · /runs/{id}
GET  /memory/stats · /memory/failures · POST /memory/clear
GET  /spine · POST /spine
POST /telemetry/event
```

## Segurança

Cinco camadas defense-in-depth, todas opt-in via env, todas a embrulhar as
rotas Composer automaticamente:

| Layer | Module | Enable | Default |
|---|---|---|---|
| 1. API key gate (Bearer) | `backend/auth.py` | `GAUNTLET_API_KEY=…` | off |
| 2. Rate limiter | `backend/rate_limit.py` | sempre on; off via `GAUNTLET_RATE_LIMIT_DISABLED=1` | on |
| 3. Security headers | `backend/security_headers.py` | sempre on; HSTS via `GAUNTLET_HSTS=1` | on (HSTS off) |
| 4. Body-size cap | `server.py` middleware | `GAUNTLET_MAX_BODY_BYTES=…` | 1 MiB |
| 5. Log token redaction | `backend/log_redaction.py` | `GAUNTLET_LOG_REDACT=1` | on |

## Deploy

- **Control Center frontend** → Vercel. `api/gauntlet.ts` corre na edge e
  faz forward `/api/gauntlet/*` para `$GAUNTLET_BACKEND_URL`.
  `api/signal.ts` e `api/ruberra.ts` ficam como aliases legacy durante o
  compat window.
- **Backend** → Railway / Fly / Render / VM. Set `GAUNTLET_BACKEND_URL` no
  Vercel a apontar para o URL público do backend.
- **Browser extension** → `wxt build`, distribuído via `.zip`.

## Compat window legacy

A migração mantém o que estava vivo:

- `/api/signal/*` e `/api/ruberra/*` ainda routeiam ao lado de `/api/gauntlet/*`
- `SIGNAL_*` e `RUBERRA_*` env vars ainda são lidas como fallback de
  `GAUNTLET_*`
- `signalApi`/`ruberraApi` shims em `control-center/lib/` continuam a
  re-exportar a surface canónica

Estes shims caem quando um smoke deployed confirmar paridade.

Detalhes operacionais em `docs/OPERATIONS.md`.
