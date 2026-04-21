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

```
# one-time
railway init
railway link <project-id>

# set secrets (do NOT commit these)
railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway variables set RUBERRA_HOST=0.0.0.0
railway variables set RUBERRA_ORIGIN=https://<your-vercel-domain>
railway variables set RUBERRA_ALLOW_CODE_EXEC=false

# deploy
railway up
```

After the first successful deploy, Railway exposes a public domain (e.g.
`https://ruberra-backend.up.railway.app`). Set that URL as
`RUBERRA_BACKEND_URL` in the Vercel project so the edge forwarder
(`api/ruberra/[...path].ts`) can reach it.

Health check: `GET /health` — Railway's healthcheck probe is configured
against this route in `railway.json`.
