# Gauntlet — Conservative Intelligence Backend

> *«Prefiro não responder a arriscar estar errado.»*

The maestro behind the cursor capsule. FastAPI service that owns model
routing, tools, memory and the conservative doctrine: refuse before
risking a wrong answer.

## Architecture

```
backend/
├── main.py           # Entry point — starts uvicorn
├── server.py         # FastAPI app, endpoints, CORS, middleware stack
├── engine.py         # Self-consistency engine (triad + judge + decision)
├── doctrine.py       # The 3 sacred prompts (system, judge, response)
├── memory.py         # Persistent failure memory system
├── models.py         # Pydantic models for all contracts
├── config.py         # Configuration (env-driven)
├── composer.py       # /composer/{context,intent,preview,apply} surface
├── runs.py           # Run log store
├── spine.py          # Mission workspace store
├── tools.py          # Agent tools (read_file, git, run_command, …)
├── auth.py           # Bearer-token auth middleware (opt-in)
├── rate_limit.py     # IP-bucketed rate limiter
├── security_headers.py
├── log_redaction.py
├── model_gateway.py  # Multi-provider call dispatcher
├── gemini_provider.py
├── mock_client.py
├── observability.py
├── data/             # Auto-created — failure memory persistence
│   └── failure_memory.json
├── requirements.txt
└── .env.example
```

## Quick Start

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY="sk-ant-..."
python main.py
```

Server at `http://127.0.0.1:3002` — main endpoint: `POST /ask`.
The browser-extension Capsule talks to this backend via the four
`/composer/*` routes.

## Deploy — Railway

The Python backend ships as a Docker image; Railway builds from
`backend/Dockerfile` and starts uvicorn on `$PORT`.

### One-time setup

```bash
railway init
railway link <project-id>

# secrets (do NOT commit these)
railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway variables set GAUNTLET_HOST=0.0.0.0
railway variables set GAUNTLET_ORIGIN=https://<your-vercel-domain>
railway variables set GAUNTLET_ALLOW_CODE_EXEC=false
railway variables set GAUNTLET_DATA_DIR=/data
```

`SIGNAL_*` and `RUBERRA_*` are still read as silent fallbacks during
the transition window — see `docs/OPERATIONS.md` for the full alias
table.

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

The Dockerfile sets `GAUNTLET_DATA_DIR=/data` by default, and `config.py`
reads that env var — so mounting a volume at `/data` is sufficient to
persist `spine.json`, `runs.json`, and `failure_memory.json`.

### Deploy

```bash
railway up
```

After the first successful deploy, Railway exposes a public domain (e.g.
`https://gauntlet-backend.up.railway.app`). Set that URL as
`GAUNTLET_BACKEND_URL` in the Vercel project so the edge forwarder
(`api/gauntlet.ts`, routed via the `vercel.json` rewrite) can reach it.

Health check: `GET /health` — Railway's healthcheck probe is configured
against this route in `railway.json` with a 120s timeout (cold start
with Anthropic SDK init + memory load can exceed the 30s default).

### Backend-unreachable contract

When the Vercel edge forwarder cannot reach the Python backend — env
unset, network error, upstream timeout — it returns:

```
HTTP/1.1 503
x-gauntlet-backend: unreachable
Content-Type: application/json

{"error": "backend_unreachable", "reason": "<kind>"}
```

The control-center client (`control-center/lib/gauntletApi.ts`) reads
the header and surfaces the dormant state. Do NOT regex the body.
Only the canonical `x-gauntlet-backend` header is emitted today —
the previous `x-signal-backend` and `x-ruberra-backend` legacy
emitters were removed in v1.0.0-rc.1 along with the matching route
prefixes (audit doc honesty fix, 2026-05-09).
