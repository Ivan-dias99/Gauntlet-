# Gauntlet — Browser Extension (Operação 2 — V0)

Cursor capsule for the browser. Press `Alt+Space` on any page → capsule
appears anchored at the top-right → write what you want → preview comes
back from the brain → Copy.

## Surgical scope

This is the Wave-V0 cut deliberately limited to one paradigm-validation
flow:

- capture page selection
- global hotkey (`Alt+Space`)
- minimal capsule (input + Compor + preview + Copy)
- calls the four `/composer/*` routes on the local backend
- toolbar popup fallback for `chrome://` / `edge://` pages

Out of scope here (lands in Wave 1+):

- Code Mode / Design Mode / Analysis Mode tabs
- streaming previews
- OAuth / API-key wiring (handled by Operação 4 — Control Center)
- per-host narrowing of `host_permissions`

## Backend URL

The backend URL is **build-time env-driven** — there is no hardcoded
production host. Set `VITE_GAUNTLET_BACKEND_URL` before `npm run build`
or `npm run zip`. Production builds **throw** if it's unset so a zip
never ships pointing at the wrong host.

```bash
# Production zip:
VITE_GAUNTLET_BACKEND_URL=https://your-backend.up.railway.app npm run zip

# Local dev (the dev server defaults to 127.0.0.1:3002 if unset):
VITE_GAUNTLET_BACKEND_URL=http://localhost:3002 npm run dev
```

`VITE_BACKEND_URL` is honoured as a legacy fallback until v1.1.0.
`host_permissions` in `wxt.config.ts` is generated from the same env
so the manifest follows automatically.

## Run locally

The repo is an npm workspace — install once at the repo root, then run
the extension scripts from this directory.

```bash
# from repo root, once
npm install

# from this directory
cd apps/browser-extension
npm run dev          # Chrome dev with auto-reload via WXT (talks to Railway)
# or
npm run build        # produces .output/chrome-mv3
```

For the smoke flow against a local backend, boot it and rebuild with the
override:

```bash
cd ../../backend
GAUNTLET_MOCK=1 python main.py    # http://127.0.0.1:3002

cd ../apps/browser-extension
VITE_GAUNTLET_BACKEND_URL=http://localhost:3002 npm run dev
```

## Manual validation gate (Portão de Validação 2)

1. Boot the backend in mock mode (above).
2. `npm run dev` — WXT opens a fresh Chrome with the extension loaded.
3. Navigate to `https://fastapi.tiangolo.com/tutorial/path-params/`.
4. Select a paragraph.
5. Press `Alt+Space`.
6. Type `turn this into a working FastAPI route`.
7. Press `Compor` (or `Ctrl+Enter`).
8. Click `Copy`. Paste into your editor.

If steps 3–8 take more than two clicks beyond `Alt+Space → type → Compor`,
the operation is not closed. Iterate and re-test.
