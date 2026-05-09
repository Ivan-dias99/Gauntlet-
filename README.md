# Gauntlet

**Inteligência na ponta do cursor.** O Composer é o centro de experiência —
denso, completo, viciante. É onde o utilizador passa a maior parte do tempo
a trabalhar com IA. O Control Center existe só quando é preciso configurar.

## Product Law

Existe **um único Gauntlet Composer** com duas shells de runtime:

1. **Web runtime** — browser extension (`apps/browser-extension/`)
2. **Desktop runtime** — Tauri (`apps/desktop/`)

As duas shells têm de manter **paridade visual e comportamental 1:1**. A
cápsula no browser e a cápsula no desktop são o mesmo objeto de produto a
correr em ambientes diferentes.

A diferença é só ambiental:

- Browser runtime atua dentro de páginas web
- Desktop runtime atua no contexto do sistema operativo/apps

O backend FastAPI continua a ser o cérebro de execução (context, routing,
tools, memory, execution). O Control Center é a garagem/pit stop — o
utilizador não vive lá.

## Filosofia

Três peças, três papéis:

- **Composer** — `packages/composer/` montado em `apps/browser-extension/`
  + `apps/desktop/`. A cápsula única em duas shells. Discreta na presença
  visual quando inactiva (cápsula colada ao cursor); densa, completa e
  sofisticada quando aberta — IDE-grade na ponta do cursor. Press
  `Ctrl+Shift+Space` em qualquer página (web) ou em qualquer app
  (desktop) → escreves o que queres → executas sem sair do sítio.
  Densidade no produto é virtude, **god-component no código é regressão**:
  cada feature tem de viver no seu sub-componente, hook ou skill.
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
packages/composer/           @gauntlet/composer — single Composer
  src/Capsule.tsx            input + Compor + preview + Copy + Esc
  src/Pill.tsx               cursor-magnetic resting state (browser only)
  src/composer-client.ts     transport-agnostic HTTP client
  src/ambient.ts             capability + adapter contract per shell
  src/pill-prefs.ts          createPillPrefs(store) factory
  src/{voice,markdown,dom-actions,types}.ts   shared utilities/types

apps/browser-extension/      WXT + Manifest V3 — web shell
  wxt.config.ts              MV3 manifest, Alt+Space command, host_perms
  lib/ambient.ts             createBrowserAmbient — chrome.* adapters
  lib/selection.ts           getSelection + iframe round-trip
  components/App.tsx         pill ↔ capsule state + ambient wiring
  entrypoints/content.tsx    injects shadow-DOM host
  entrypoints/background.ts  service worker (chrome.commands listener)

apps/desktop/                Tauri 2 — desktop shell (two windows: cápsula + pill)
  index.html                 capsule entry (main window, decoration-less, transparent)
  pill.html                  pill entry (small bottom-right surface)
  src/App.tsx                mounts the same @gauntlet/composer Capsule
  src/PillApp.tsx            slim pill component (click → show_capsule)
  src/main.tsx · pill-main.tsx  React entries per window
  src/ambient.ts             createDesktopAmbient — Tauri adapters + SSE stream
  src/adapters/tauri.ts      clipboard, window title, global shortcut, updater
  src-tauri/                 Rust binary
    src/lib.rs               commands: show_capsule, hide_capsule,
                             show_pill, hide_pill, move_window_to_cursor,
                             run_shell (allowlisted), backend_health probe
    tests/smoke.rs           pure-helper unit tests (no webview)
    tauri.conf.json          window flags + updater endpoint config
    capabilities/default.json  granular Tauri 2 permissions

control-center/              React + Vite — a garagem (operator console)
  main.tsx · App.tsx · router.tsx
  pages/                     Overview · Settings · Models · Permissions ·
                             Memory · Ledger · Composer
  spine/                     workspace state
  hooks/                     useBackendStatus, useGitStatus
  lib/                       signalApi.ts (canonical client; rename pending)
  design/                    typed token graph
  styles/tokens.css          design tokens
  i18n/copy.ts               PT/EN catalogue (Lang in TweaksContext)

backend/                     FastAPI — o maestro
  server.py                  HTTP endpoints + middleware pipeline
  routers/                   one router module per domain (ask, agent, runs, memory, …)
  composer.py                /composer/{context,intent,preview,apply,…}
  engine.py                  triad + judge pipeline + auto-router
  agent.py                   tool-using agent loop
  tools.py                   tool registry
  model_gateway.py           multimodelo routing + cost summary
  memory.py · memory_records.py   failure + operator memory (JSON on disk)
  doctrine.py                prompt assembly
  models.py                  Pydantic contracts
  spine.py                   workspace snapshot store
  runs.py                    append-only run log
  config.py · runtime.py     env-driven settings + shared engine accessor
  main.py                    uvicorn entry
  auth.py · rate_limit.py · security_headers.py · log_redaction.py
  backup.py · persistence.py · pause_registry.py · context_router.py · observability.py

api/                         Vercel edge forwarder
  gauntlet.ts                /api/gauntlet/* (canonical)
  _forwarder.ts              shared fetch + header sanitisation

docs/OPERATIONS.md           boot · cutover · rollback · backup · deploy
```

## Run locally

A árvore JS é um único npm workspace (`packages/*`, `apps/*`). Faz-se
um **único `npm install` no root** e cada shell corre a partir do seu
diretório.

### Provider precedence (engine.py)

```
MOCK > Groq > Anthropic > Gemini > error
        ↑       paused      paused
     primary
```

**Groq é o caminho primário** (free tier, Llama 3.x / gpt-oss, latência
sub-segundo, streaming SSE). Anthropic e Gemini ficam em pausa — código
mantém-se compatível, só correm se o operador escolher explicitamente.

```bash
# Terminal 1 — backend (Groq, recomendado)
cd backend
python -m venv .venv && .\.venv\Scripts\Activate.ps1   # Windows
# source .venv/bin/activate                            # macOS/Linux
pip install -r requirements.txt
export GAUNTLET_GROQ_API_KEY=gsk_...      # https://console.groq.com/keys
# OR para testes sem rede:
# export GAUNTLET_MOCK=1
python main.py                            # http://127.0.0.1:3002

# Terminal 2 — Control Center (opcional, garagem de configs)
npm install                               # corre só uma vez, no root
npm run dev                               # http://localhost:5173/control

# Terminal 3 — cápsula browser
cd apps/browser-extension
npm run dev                               # carrega Chrome com a extension
                                          # press Ctrl+Shift+Space em qualquer página

# Terminal 4 — cápsula desktop (Tauri)
cd apps/desktop
npm run tauri:dev                         # 5-15 min na primeira vez (compila Rust)
                                          # press Ctrl+Shift+Space em qualquer app
```

Pré-requisitos desktop: Rust toolchain (rustup.rs), Visual C++ Build
Tools (Windows). Sem isso o `npm run tauri:dev` falha.

A cápsula fala diretamente com `http://127.0.0.1:3002/composer/*` em dev
(o composer-client detecta `import.meta.env.DEV` e usa localhost; em
produção usa a URL Railway). O Control Center fala via proxy do Vite.

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

- **Control Center frontend** → Vercel. `api/gauntlet.ts` corre na edge
  e forwarda `/api/gauntlet/*` para `$GAUNTLET_BACKEND_URL`.
- **Backend** → Railway / Fly / Render / VM. Set `GAUNTLET_BACKEND_URL`
  no Vercel a apontar para o URL público do backend.
- **Browser extension** → `npm run zip` em `apps/browser-extension/`
  produz `.output/*.zip` para o Chrome Web Store. `npm run zip:firefox`
  produz a build XPI.
- **Desktop** → `npm run tauri:build` em `apps/desktop/` produz
  installers nativos (`.msi`, `.dmg`, `.AppImage`, `.deb`). O CI
  `.github/workflows/release.yml` corre em push de tag `v*` e anexa
  todos os artefactos ao GitHub release. Assinatura via
  `TAURI_SIGNING_PRIVATE_KEY` (GitHub Secret).

## Releases

Versão actual: **`1.0.0-rc.1`** (ver `CHANGELOG.md`). A surface canónica é
`/api/gauntlet/*` + `GAUNTLET_*`. Os aliases legacy `SIGNAL_*` / `RUBERRA_*`
e as storage keys `signal:*` / `ruberra:*` ainda são lidos como fallback
silencioso para não partir installs antigos; emitem deprecation warning
quando usados e serão **removidos em v1.1.0**. Código novo escreve sempre
no nome canónico.

Antes de tagar `v1.0.0`: caminhar pelo `docs/SECURITY_AUDIT.md`. O ponto
crítico em aberto é o `pubkey` do updater Tauri — sem chave pública fixada,
não há release público.

Detalhes operacionais em `docs/OPERATIONS.md`.
