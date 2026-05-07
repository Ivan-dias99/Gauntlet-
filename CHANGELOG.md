# Changelog

All notable changes to Gauntlet are recorded here.

The format is based on [Keep a Changelog](https://keepachangelog.com) and the
project follows [Semantic Versioning](https://semver.org).

## [Unreleased]

### Changed
- **Doutrina actualizada — Composer denso, backend gordo.** O composer
  deixou de ser "mínimo" e passa a ser **denso, viciante, sofisticado**:
  o sítio onde o utilizador não quer sair, com tools/skills/commands na
  ponta do dedo. Backend continua gordo. Lente 2 do CLAUDE.md reescrita.

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
