# Gauntlet — Desktop Cápsula

The off-the-web composer surface. Tauri 2 shell that mounts the SAME
Composer the browser extension mounts. Same backend, same visual
identity, different host adapter.

## Doctrine

> A cápsula é idêntica em tudo, só a alma muda — uma é para web,
> outra é para local.

The Capsule + Pill + ComposerClient + utilities all live in
`packages/composer/` (`@gauntlet/composer`). Both shells import the
same component. Differences are expressed as capabilities on the
Ambient adapter each shell constructs:

- `src/App.tsx` mounts `<Capsule ambient={createDesktopAmbient()}>`
- `src/ambient.ts` declares the desktop capability vector
  (no domExecution, no pillSurface, no per-domain dismiss) and wires
  transport (direct fetch), selection (clipboard + window title),
  storage (localStorage), and screenshot (Tauri command).
- `src/adapters/tauri.ts` is where the seam lives — clipboard, window
  title, global shortcut, window show/hide.

## Capabilities

| | Browser shell | Desktop shell |
|---|---|---|
| `domExecution` | ✓ | ✗ (no host page DOM) |
| `pillSurface` | ✓ | ✗ (the window IS the cápsula) |
| `screenshot` | ✓ (chrome.tabs) | ✓ (Tauri command) |
| `dismissDomain` | ✓ | ✗ (no domain) |
| `voice` | depends on browser | depends on webview |
| `streaming` | ✓ | ✗ (SSE not wired through Tauri yet) |

Global shortcut default: `Ctrl+Shift+Space` (`Cmd+Shift+Space` on macOS).

## Out of scope this sprint (clearly)

- Tray icon + menu surface.
- In-process FastAPI sidecar — operator must run the backend
  separately at `http://127.0.0.1:3002` (same as Sprint 2 visão local).
- Screenshot region capture — Tauri 2's screenshot plugin is still in
  flux and the OS-level region picker is platform-specific work.
- DOM action mode — there is no DOM in a Tauri shell. The desktop
  cápsula is text-only; agent-driven tool calls remain a Sprint 7+ wire.

## Local dev

```bash
cd apps/desktop
npm install
npm run tauri:dev   # opens the Tauri dev window
```

Make sure the backend is up:

```bash
cd ../../backend
GAUNTLET_MOCK=1 python main.py   # listens on 127.0.0.1:3002
```

## Build

```bash
npm run build           # vite frontend bundle
npm run tauri:build     # Tauri release bundle (per-OS installer)
```
