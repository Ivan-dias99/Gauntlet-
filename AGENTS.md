# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Ruberra is a single-page React application (Vite + Tailwind CSS v4) — an AI-powered intelligence workstation with four chambers: Lab, School, Creation, and Profile. The backend is a Supabase Edge Function already deployed remotely; no local backend setup is needed.

### Running the app

- **Dev server**: `npm run dev` (Vite, port 5173 by default; use `--host 0.0.0.0` to expose externally)
- **Build**: `npm run build`

### Key caveats

- There is no linter or test runner configured in `package.json`. The only scripts are `dev` and `build`. Use `npm run build` as the primary correctness check — TypeScript/JSX errors will surface during the Vite build.
- No `.env` file is needed for local development. The Supabase project URL and anon key are committed in `utils/supabase/info.tsx`.
- The backend (Supabase Edge Function) is already deployed and the frontend hardcodes its URL. When the `OPENAI_API_KEY` is not set on the Supabase side, the edge function returns rich hardcoded demo responses — so the app is fully functional locally without any API keys.
- State persistence uses `localStorage` — no database is required locally.
- `package.json` contains a `pnpm.overrides` section but the project uses `npm` (lockfile is `package-lock.json`). Always use `npm` commands.
