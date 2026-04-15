# Ruberra

A local-first React workstation with a four-tab shell (Lab, School,
Creation, Memory) backed by an append-only event log persisted to
IndexedDB.

## Stack

- React 18 + Vite 6 + TypeScript
- `@radix-ui/react-dialog` for modals
- IndexedDB for event-log persistence
- Vitest + Playwright for tests
- Optional Node backend at `exec-backend/index.mjs` for local
  filesystem and git operations (loopback only)

## Run

```bash
npm install
npm run dev          # frontend on :5173
npm run backend      # exec backend on 127.0.0.1:3001 (optional)
npm test             # unit + integration
npm run test:e2e     # playwright
npm run build        # production bundle
```

## Layout

```
src/main.tsx            entry
src/ruberra/            UI + event log + projections
exec-backend/index.mjs  optional local backend
tests/e2e/              playwright specs
```

## Status

Local-only. No remote inference, no auth, no multi-user. The exec
backend binds to 127.0.0.1 only.
