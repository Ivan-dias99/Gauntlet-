# Gauntlet — Desktop Cápsula (Sprint 6)

The off-the-web composer surface. Tauri 2 shell + a TypeScript front end
that mirrors the browser-extension cápsula in identity and wire
contract. Same backend, same visual identity, different host adapter.

## Doctrine

> A cápsula é idêntica em tudo, só a alma muda — uma é para web,
> outra é para local.

The Capsule component, the CSS, the wire shape (`/composer/*`) are all
shared with the browser-extension. The seam where they diverge is
`src/adapters/tauri.ts` — clipboard, window title, global shortcut, and
window show/hide.

## What lands in Sprint 6

- Tauri 2 scaffold (`src-tauri/`): Cargo.toml, tauri.conf.json,
  capabilities/default.json, lib.rs, main.rs.
- Vite + React front-end mirroring the cápsula UI from
  `apps/browser-extension/components/Capsule.tsx`.
- `composer-client.ts` — non-streaming subset of the extension's client
  (Tauri webview can fetch local backend directly; SSE proxying through
  the WebView2 / WKWebView shells lands later).
- `adapters/tauri.ts` — clipboard read, active-window title, global
  shortcut bind, capsule window toggle.
- Global shortcut default: `Ctrl+Shift+Space`
  (`Cmd+Shift+Space` on macOS).

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
