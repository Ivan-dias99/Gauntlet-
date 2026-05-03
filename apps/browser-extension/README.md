# Ruberra Composer — Browser Extension (Operação 2 — V0)

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
- OAuth / API-key wiring (handled by the Studio settings)
- per-host narrowing of `host_permissions`

## Run locally

The extension defaults to the production Railway backend
(`https://ruberra-backend-jkpf-production.up.railway.app`). To run
against a local brain instead, copy `.env.example` to `.env` and
uncomment the override:

```bash
cd apps/browser-extension
cp .env.example .env
# edit .env → uncomment VITE_RUBERRA_BACKEND_URL=http://127.0.0.1:3002
npm install
npm run dev          # Chrome dev with auto-reload via WXT
# or
npm run build        # produces .output/chrome-mv3-prod
npm run zip          # produces .output/chrome-mv3-<version>.zip
```

For the local smoke flow, also boot the backend:

```bash
cd ../../signal-backend
SIGNAL_MOCK=1 python main.py    # http://127.0.0.1:3002
```

Without `.env`, every build (dev or prod) talks straight to Railway.

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
