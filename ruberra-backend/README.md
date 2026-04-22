# Ruberra V1 — Conservative Intelligence Backend

> *«Prefiro não responder a arriscar estar errado.»*

## Architecture

```
ruberra-backend/
├── main.py           # Entry point — starts uvicorn
├── server.py         # FastAPI app, endpoints, CORS
├── engine.py         # Self-consistency engine (triad + judge + decision)
├── doctrine.py       # The 3 sacred prompts (system, judge, response)
├── memory.py         # Persistent failure memory system
├── models.py         # Pydantic models for all contracts
├── config.py         # Configuration (env-driven)
├── data/             # Auto-created — failure memory persistence
│   └── failure_memory.json
├── requirements.txt
└── .env.example
```

## Quick Start

```bash
pip install -r requirements.txt
$env:ANTHROPIC_API_KEY = "sk-ant-..."
python main.py
```

Server at `http://127.0.0.1:3002` — main endpoint: `POST /ask`

## Deploy — Railway

The Python backend ships as a Docker image; Railway builds from
`ruberra-backend/Dockerfile` and starts uvicorn on `$PORT`.

### One-time setup

```
railway init
railway link <project-id>

# secrets (do NOT commit these)
railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway variables set RUBERRA_HOST=0.0.0.0
railway variables set RUBERRA_ORIGIN=https://<your-vercel-domain>
railway variables set RUBERRA_ALLOW_CODE_EXEC=false
railway variables set RUBERRA_DATA_DIR=/data
```

### Volume — REQUIRED

Railway containers are ephemeral. Without a volume the mission spine,
failure memory, and run log are wiped on every deploy/restart.

```
# via dashboard: Project → Service → Volumes → New Volume
#   mount path:  /data
#   size:        1 GB is more than enough
# or CLI:
railway volume create --mount-path /data
```

The Dockerfile sets `RUBERRA_DATA_DIR=/data` by default, and `config.py`
reads that env var — so mounting a volume at `/data` is sufficient to
persist `spine.json`, `runs.json`, and `failure_memory.json`.

### Deploy

```
railway up
```

After the first successful deploy, Railway exposes a public domain (e.g.
`https://ruberra-backend.up.railway.app`). Set that URL as
`RUBERRA_BACKEND_URL` in the Vercel project so the edge forwarder
(`api/ruberra.ts`, routed via the `vercel.json` rewrite) can reach it.

Health check: `GET /health` — Railway's healthcheck probe is configured
against this route in `railway.json` with a 120s timeout (cold start
with Anthropic SDK init + memory load can exceed the 30s default).

### Backend-unreachable contract

When the Vercel edge forwarder cannot reach the Python backend — env
unset, network error, upstream timeout — it returns:

```
HTTP/1.1 503
x-ruberra-backend: unreachable
Content-Type: application/json

{"error": "backend_unreachable", "reason": "<kind>"}
```

The React client (`src/lib/ruberraApi.ts`) reads the header and throws
`BackendUnreachableError`, which chambers key off to render the dormant
state. Do NOT regex the body.
