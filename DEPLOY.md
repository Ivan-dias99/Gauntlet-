# Ruberra — deploy

Two pieces, two hosts. The frontend lives on Vercel. The FastAPI
backend has to run somewhere public (Fly / Railway / Render / VM). The
Vercel edge function at `api/ruberra/[...path].ts` reads
`RUBERRA_BACKEND_URL` and forwards requests to it.

Without the backend, the chambers show `backend off?` / `405` errors.

## 1. Fix the rewrite (already committed)

`vercel.json` now excludes `/api/` from the SPA rewrite. Redeploy the
frontend once merged — otherwise every `/api/ruberra/*` call is
swallowed by `index.html` and you get HTML back instead of JSON.

## 2. Deploy the backend on Fly.io (recommended — free tier)

```bash
brew install flyctl          # or: curl -L https://fly.io/install.sh | sh
fly auth signup              # one-time

cd ruberra-backend
fly launch --no-deploy       # creates the app; accept suggested name or edit fly.toml
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly deploy
```

Copy the public URL (`https://<app>.fly.dev`) from the deploy output.

### Other hosts (if you prefer)

The `Dockerfile` is portable:

- **Railway**: new project → deploy from repo → root `ruberra-backend`
  → set `ANTHROPIC_API_KEY`, `RUBERRA_ORIGIN=https://<your-vercel-domain>`
- **Render**: new web service → docker → root `ruberra-backend` → same secrets.
- **Koyeb / Render / any VM**: `docker build -t ruberra ruberra-backend && docker run -p 8080:8080 -e ANTHROPIC_API_KEY=... ruberra`.

## 3. Wire Vercel to the backend

In Vercel → your project → Settings → Environment Variables:

| name                  | value                                  |
|-----------------------|----------------------------------------|
| `RUBERRA_BACKEND_URL` | `https://<app>.fly.dev`                |

Set it for **Production**, **Preview**, and **Development**.
Redeploy the project once for the new env to take effect.

## 4. Verify

Open `https://<your-vercel-domain>/api/ruberra/health` — you should see
`{"status":"operational","system":"Ruberra V1",...}`.

If you still see `backend off?` in the Memory chamber, the most common
causes are:

- `RUBERRA_BACKEND_URL` has a trailing slash or a typo.
- The backend is rejecting CORS from your Vercel origin. Set
  `RUBERRA_ORIGIN` on the backend to match your exact frontend URL.
- `ANTHROPIC_API_KEY` wasn't set on the backend and it exited on boot —
  check `fly logs` (or the host's log viewer).

## 5. See the crew

Open the Vercel URL → **Construção** chamber → click the **CREW** tab
(top right of the chamber header) → type a task → press Enter. You
should see: plan → role timeline (researcher/coder/security-reviewer/…)
→ per-role token counts → reflection chip → critic verdict → final
answer. Memory chamber shows the run afterwards.
