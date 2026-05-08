# Changelog

All notable changes to Gauntlet are recorded here.

The format is based on [Keep a Changelog](https://keepachangelog.com) and the
project follows [Semantic Versioning](https://semver.org).

## [Unreleased]

### Removed (Postgres dual-write · 2026-05-08)
- **Dropped the entire Postgres cutover scaffold.** `backend/db.py`,
  `backend/migrate.py`, `backend/parity_check.py`, `backend/migrations/`
  (schema + README) deleted. `spine.py` cleaned of the dual-write
  worker + read cutover. `backup.py` no longer shells out to `pg_dump`
  — JSON-only backup. `requirements.txt` drops `asyncpg`. `config.py`
  drops `DATABASE_URL`, `DUAL_WRITE_PG`, `PG_CANONICAL`. Operations doc
  updated.
- Rationale: nobody read from PG in production, the dual-write made
  the stores harder to reason about, and the parity-check infra was
  dead weight. JSON-on-disk is now the canonical (and only) source of
  truth for runs / spine / failure memory. Re-introduce when load
  actually justifies it, with a clean design under a single feature
  flag — not as speculative dual-write left to rot.

### Changed (consolidação canónica · 2026-05-08)
- **Identifiers Python alinhados com a doutrina GAUNTLET_*.**
  `RUBERRA_MOCK` (declaração + 12 usos em config/engine/agent/server)
  → `GAUNTLET_MOCK`. `SIGNAL_API_KEY` → `GAUNTLET_API_KEY`.
  `SIGNAL_DUAL_WRITE_PG` / `SIGNAL_DATABASE_URL` / `SIGNAL_PG_CANONICAL`
  / `SIGNAL_HSTS` / `SIGNAL_CSP` em docstrings + error messages →
  `GAUNTLET_*`. **Env vars continuam a aceitar os aliases legacy** via
  `_env()` helper (compat preservada — operadores com SIGNAL_*
  setados continuam a funcionar). `db.py`, `spine.py`, `migrate.py`,
  `security_headers.py`, `tools.py`, `engine.py`, `agent.py`,
  `server.py`, `config.py`.
- **Front-end alinhado**. `control-center/lib/signalApi.ts` →
  `gauntletApi.ts`. Exports: `signalFetch` → `gauntletFetch`,
  `SIGNAL_API_BASE` → `GAUNTLET_API_BASE`,
  `SIGNAL_API_KEY_PRESENT` → `GAUNTLET_API_KEY_PRESENT`. 13 ficheiros
  actualizados (hooks, pages, spine, telemetry, lib).
- **Terminologia "chamber" eliminada de forward-references**.
  `agent.py` deixa de referenciar `src/chambers/terminal/index.tsx`
  (path morto). `model_gateway.py` reescreve docstring para falar de
  "callers" (engine + composer + agent) em vez de "chambers".
  Mantidas referências históricas em comentários que documentam a
  migração Signal→Gauntlet — são úteis para entender porque o código
  parece como parece.
- **TODOs vivos resolvidos**. `tools.py:1467` (gate de aprovação
  agora aponta para o danger gate da cápsula). Restantes "TODO" no
  repo são milestones históricos fechados (`docs/COMPOSER_V0.md`).

### Fixed
- **Groq auto-fallback quando o modelo primário bate em rate limit.**
  Antes: 429 do Groq propagava-se até à cápsula como `502 Bad Gateway —
  rate_limit_exceeded`. O `model_gateway` tinha chains documentadas mas
  nunca eram accionadas em runtime para erros de rate limit do provider
  activo.
  Agora: `groq_provider._MessagesNamespace.create()` e
  `_StreamContext.__aenter__()` envolvem a chamada num retry-loop
  através de `GROQ_FALLBACK_CHAIN` (`llama-3.3-70b-versatile` →
  `llama-3.1-8b-instant` → `openai/gpt-oss-120b` → `mixtral-8x7b-32768`).
  Cada modelo tem o seu pool de tokens, então 429 num não significa
  429 noutro. Quando fallback é accionado, o `_Response.model` expõe
  o modelo real que serviu (em vez do anthropic-shape) — cápsula
  mostra `llama-3.1-8b-instant` no badge para o operador saber.
  Cumpre a doutrina lente 3 do CLAUDE.md ("multimodelo via gateway")
  que estava documentada mas não wired.

### Added
- **`docs/canon/COMPOSER_SURFACE_SPEC.md`** — spec canónica do
  Composer, resolve [#315](https://github.com/Ivan-dias99/Aiinterfaceshelldesign/issues/315).
  Documenta paridade visual, state machine, labels, capabilities matrix,
  provider precedence, e o histórico de commits da Fase 5 que tornaram
  a doutrina executável.
- **README run-locally actualizado**. Provider precedence visível,
  Groq como primário, ambos os shells (browser + desktop) listados
  com pré-requisitos, ambos os hotkeys (`Ctrl+Shift+Space` canónico).
- **Paridade visual COMPLETA entre desktop e browser (Fase 5).**
  Operador deixa de notar qual shell está activo. Tres convergências:
  1. **Web ganha filesystem** via novo `web-filesystem.ts` (File API
     com path proxy `web://<uuid>` resolvido em cache em memória).
     `pickFile` abre `<input type="file">`, `readTextFile` /
     `readFileBase64` lêem do blob. Botão ANEXAR aparece em ambos
     os shells e funciona em ambos.
  2. **Web ganha screen capture** via `screenshot.captureScreen()`
     que envolve `chrome.tabs.captureVisibleTab` na shape
     `{ base64, path }` que o desktop expõe via Tauri. Botão ECRÃ
     aparece em ambos os shells.
  3. **Botão SHELL removido do row em ambos os shells.** Era só
     desktop e entregava qual shell estava activo. Funcionalidade
     mantém-se via slash command `/shell` (slashActions continua
     a gating por capability). Visualmente os dois shells mostram
     agora um row idêntico: ANEXAR · ECRÃ · VOZ · ENVIAR.

  Doutrina (lente 2 do CLAUDE.md): "uma só implementação partilhada
  por todos os shells; divergência visual é regressão". Operador vende
  como produto único universal — implementação subjacente difere
  (Tauri vs File API) mas user experience é indistinguível.
- **Streaming SSE no Groq adapter.** `groq_provider._StreamContext`
  envolve `client.chat.completions.create(stream=True)` na shape
  anthropic (`async with client.messages.stream(...)` + `text_stream` +
  `get_final_message()`). `dom_plan_stream` no composer deixa de bater
  com `'_MessagesNamespace' object has no attribute 'stream'` em Groq;
  cápsula recebe deltas token-a-token como em Anthropic. Usage tokens
  vêm do tail-chunk via `stream_options.include_usage=True` para o
  ledger do gateway manter contagem.
- **Erros do backend visíveis na cápsula.** Ambos os shells
  (apps/desktop/src/ambient.ts e apps/browser-extension/lib/ambient.ts)
  passam a extrair `detail.message` / `detail.error` da resposta JSON
  do FastAPI quando a HTTP status não é 2xx. Operador vê
  `composer: 502 Bad Gateway — Error code: 401 - Invalid API Key` em
  vez do "502" genérico que esconde a causa real.

### Changed
- **Provider precedence — Groq passa a primário.** Engine agora
  resolve providers nesta ordem: `MOCK > Groq > Anthropic > Gemini >
  error`. Anthropic e Gemini ficam em PAUSA — código mantém-se
  compatível, só correm quando o operador escolhe explicitamente
  (sem `GAUNTLET_GROQ_API_KEY` setada). Motivo: custo / falta de
  créditos Anthropic; Groq free tier (Llama 3.x) cobre todo o
  desenvolvimento e teste com latência sub-segundo. `engine.py`,
  `config.py`, `server.py`, `.env.example`, `test_engine_init.py`
  actualizados em conjunto.
- **Doutrina actualizada — Composer denso, backend gordo.** O composer
  deixou de ser "mínimo" e passa a ser **denso, viciante, sofisticado**:
  o sítio onde o utilizador não quer sair, com tools/skills/commands na
  ponta do dedo. Backend continua gordo. Lente 2 do CLAUDE.md reescrita.
- **Janela popup standalone `composer.html` eliminada por completo.**
  Apple-quality bar: a cápsula ou abre como overlay na página, ou não
  abre. Sem janela de consolação, sem cápsula órfã sem contexto. Ícone
  ou `Ctrl+Shift+Space` em URLs restritas (`chrome://`, `edge://`, Web
  Store, PDF, etc) ou em SPAs onde o content script trava — pulsa um
  `×` ember no badge da action durante 1.6s e silencia.

  Removidos: `apps/browser-extension/entrypoints/composer/index.html`,
  `apps/browser-extension/entrypoints/composer/main.tsx`, funções
  `openComposerWindow` + `findExistingComposerWindow` em background.ts,
  constantes `COMPOSER_WINDOW_*`, modo `'fallback-window'` do
  `SummonDiagnostics`, e a pasta inteira `release/unpacked/` (snapshot
  pré-build legacy que continha `composer.html` antigo). Lente 1
  ("ponta do cursor") absoluta.
- **Paridade visual desktop ↔ browser.** O chip que rendia
  `{ambient.shell}` ('desktop' / 'browser') na barra de contexto da
  cápsula foi removido — era uma marca de água que entregava ao
  utilizador qual shell estava em uso. Doutrina (lente 2 — "uma só
  implementação partilhada por todos os shells, divergência visual é
  regressão") aplicada. URL placeholder `desktop://capsule` /
  `desktop://unknown` também deixa de aparecer no chrome — quando o
  pageTitle não está preenchido por um app real em foco, o slot fica
  simplesmente vazio. Operador deixa de sentir "modos diferentes" ao
  trocar de ambiente; é a mesma cápsula com contextos diferentes.
- **Onboarding fica dentro da cápsula.** `Capsule` ganha slot `children`;
  ambos os shells (`apps/browser-extension/components/App.tsx` e
  `apps/desktop/src/App.tsx`) passam `<Onboarding>` como filho em vez de
  irmão. Antes o `position:absolute; inset:0` da intro ancorava no body
  da página → tour aparecia ao lado da cápsula, sobrepondo conteúdo
  externo. Agora ancora no root da cápsula → toma-a por completo como
  modal interno, exactamente como o comentário no Onboarding.tsx descreve
  ("an in-cápsula tour beats…"). Visual coerente em ambos os shells.

### Fixed
- **Backend default port** changed from `8080` to `3002` so local dev
  matches the desktop Tauri CSP without exporting `GAUNTLET_PORT`.
  Production deploys on Railway/Vercel/Fly continue to pick up `PORT`
  from the platform, so this is a local-only convenience.
  (`backend/config.py`, `docs/OPERATIONS.md`)
- **`Failed to fetch` em dev** — `composer-client.ts` defaultava para a
  URL Railway antiga (`ruberra-backend-jkpf-...`) mesmo em vite/wxt/tauri
  dev. Agora detecta `import.meta.env.DEV` e usa `http://127.0.0.1:3002`
  como fallback. `VITE_BACKEND_URL` continua a sobrepor.
- **CORS para Tauri** — `backend/server.py` regex aceitava apenas
  `chrome-extension://`, `moz-extension://`, `safari-web-extension://`.
  Cápsula desktop bloqueava porque Tauri 2 emite `tauri://localhost`
  (Linux/Mac) ou `http://tauri.localhost` (Windows). Regex estendido.

### Added
- **Snapshot-before-destroy** for both `/ledger/clear` and
  `/memory/forget_all`. Each call writes a timestamped sidecar
  (`runs-before-clear-{Nh}-{ts}.json` /
  `memory-before-forget-all-{ts}.json`) before mutating, returns the
  path in the response, and prunes after `MAX_*_SNAPSHOTS=10`. Settings
  page can now surface the recovery path verbatim.
- **Tray health indicator** — desktop spawns an async TCP probe to
  `127.0.0.1:3002` every 5s and updates the tray tooltip
  ("backend conectado" / "backend offline"). Pure stdlib; no reqwest.
- **i18n catalogue (Rust)** — Tauri tray + health strings localised
  via `GAUNTLET_LOCALE` (`pt` default, `en` available). Mirrors the
  control-center's `Lang` switch.
- **`test_engine_init.py`** — five pytest cases covering provider
  selection precedence (mock > Anthropic > Groq > Gemini > error).
- **Desktop smoke tests** — `apps/desktop/src-tauri/tests/smoke.rs`
  exercises clamp + anchor + locale catalogue without a webview.
  Wired into CI.
- **E2E scaffold** — `apps/desktop/tests/e2e/README.md` documents the
  `tauri-driver` setup pattern for when behaviour-level regressions
  start slipping past smoke.

### Changed
- README updated to drop the compat-window section, reflect
  `1.0.0-rc.1` status, document the new Tauri layout (cápsula + pill
  windows), and surface the release / signing story.
- CI matrix gained `desktop-smoke` (cargo test) + `pytest -q` for the
  backend.

## [1.0.1] — 2026-05-09

Hotfix that closes the auto-update loop and lands the desktop pill on
the cursor.

### Fixed
- **Auto-update was effectively broken in 1.0.0.** `release.yml` was
  uploading a `**/latest.json` glob, but `tauri build` does not generate
  that manifest — only the `.sig` companions. The updater endpoint
  configured in `tauri.conf.json`
  (`releases/latest/download/latest.json`) therefore 404'd and every
  1.0.0 install had no upgrade path. The desktop matrix job now uses
  `tauri-apps/tauri-action@v0` with `includeUpdaterJson: true`, which
  builds + signs + uploads + emits the manifest with per-platform
  signatures and URLs, merging matrix legs into a single release asset.

### Added
- **Pill follows the cursor on desktop** (`apps/desktop/src-tauri/`).
  A `tauri::async_runtime` ticker repositions the pill window to track
  the OS cursor at ~30Hz while the pill is visible and the cápsula is
  hidden; sleeps 500ms when idle so CPU stays near zero. Honours the
  doctrine "ponta do cursor" — the pill is no longer pinned to a
  corner. Two new Tauri commands expose the behaviour to the JS
  bridge: `set_pill_follow_cursor(enabled)` and
  `get_pill_follow_cursor()`. Default: on.

### Changed
- Version bumped to `1.0.1` across the workspace: root `package.json`,
  `@gauntlet/composer`, `@gauntlet/browser-extension`, `@gauntlet/desktop`,
  `tauri.conf.json`, and the `gauntlet-desktop` crate.

## [1.0.0-rc.1] — 2026-05-07

First release candidate. The cápsula now matches the doctrine 1:1 across
both shells (browser-extension + desktop) and the production surface
(LICENSE, CHANGELOG, release pipeline, instalável) is in place.

### Added
- **Desktop pill** — a separate Tauri window (`pill`) sits permanently
  in the bottom-right corner of the active monitor. Click summons the
  cápsula at the OS cursor; right-click hides the pill (operator can
  re-summon via tray). Pill ↔ cápsula are two windows, single product.
- **Desktop SSE streaming** — `apps/desktop/src/ambient.ts` now exposes
  `transport.stream` via `fetch` + `ReadableStream`. The cápsula
  streams partial composes from the backend identically to the browser
  shell. `streaming: true`, `pillSurface: true` for paridade 1:1.
- **Desktop floating cápsula** — Tauri window is decoration-less,
  transparent, off-taskbar. The window moves to the OS cursor on
  every summon. No more "tab" feel.
- **Backend danger-zone endpoints** — `POST /ledger/clear`,
  `POST /memory/forget_all`, `POST /permissions/revoke_all`. Each
  requires `{confirm: true}` server-side and the Settings page wires
  them to the operator's danger buttons (no more "not yet wired" alerts).
- **Tauri auto-updater plugin** — `tauri-plugin-updater` registered
  with default endpoint config; signing is operator-driven (TAURI_KEY).
- **Browser extension zip build** — `npm run build:zip` produces a
  store-ready archive in `apps/browser-extension/release/`.
- **Release workflow** — `.github/workflows/release.yml` runs on tag
  push (`v*`), builds the desktop installers (Windows / macOS / Linux)
  and the extension zip, attaches them to the GitHub release.
- **`LICENSE`** (MIT) and this `CHANGELOG.md`.
- **Onboarding tour** — first cápsula open shows a 3-step welcome the
  operator can dismiss; preference is persisted via `pill-prefs`.

### Changed
- **Capsule CSS extracted** — `packages/composer/src/capsule.css.ts`
  now owns the ~2.1k lines of styling that used to inline Capsule.tsx.
  The component file shrinks accordingly with no behavioural change.
- **Compat window closed** — `/api/signal/*`, `/api/ruberra/*`, env
  fallbacks `SIGNAL_*` / `RUBERRA_*`, and the legacy edge forwarders
  are gone. Canonical surface is `/api/gauntlet/*` + `GAUNTLET_*` only.

### Removed
- `api/signal.ts`, `api/ruberra.ts` (legacy edge forwarders).
- `SIGNAL_BACKEND_URL` / `RUBERRA_BACKEND_URL` env fallbacks in
  `backend/config.py` and `api/_forwarder.ts`.
- `VITE_SIGNAL_API_BASE` / `VITE_RUBERRA_API_BASE` fallbacks in
  `control-center/lib/signalApi.ts`.

[Unreleased]: https://github.com/Ivan-dias99/Aiinterfaceshelldesign/compare/v1.0.0-rc.1...HEAD
[1.0.0-rc.1]: https://github.com/Ivan-dias99/Aiinterfaceshelldesign/releases/tag/v1.0.0-rc.1
