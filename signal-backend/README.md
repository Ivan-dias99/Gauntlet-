# Signal — Conservative Intelligence Backend

> *«Prefiro não responder a arriscar estar errado.»*

FastAPI service that powers the five Signal chambers (Insight · Surface ·
Terminal · Archive · Core). Owns the triad + judge pipeline, the agent loop,
the multi-agent crew, the tool registry, the failure memory, the run ledger
and the workspace spine. Persists everything to a single SQLite file.

## Layout

```
signal-backend/
├── main.py              # uvicorn entry
├── server.py            # FastAPI app, endpoints, CORS, SSE heartbeat
├── engine.py            # triad + judge + auto-router + chamber dispatch
├── agent.py             # agent loop (tool-use, anti-loop fingerprint)
├── crew.py              # planner → researcher → coder → critic
├── tools.py             # 8 hardened tools (SSRF defence, deny-by-default exec)
├── chambers/            # chamber profiles + per-chamber prompts
│   ├── profiles.py      # ChamberKey enum, ChamberProfile dataclass
│   ├── insight.py · surface.py · terminal.py · archive.py · core.py
│   └── surface.py       # Sonnet 4.6 design plan generator (mock under SIGNAL_MOCK)
├── doctrine.py          # prompt assembly helpers
├── models.py            # Pydantic contracts
├── memory.py            # failure memory (SQLite-backed)
├── runs.py              # run ledger (SQLite, refused-with-reason gate)
├── spine.py             # workspace snapshot (SQLite, single-row)
├── db.py                # SQLite store + one-shot JSON migration
├── persistence.py       # atomic writes + corrupt-file quarantine
├── mock_client.py       # zero-network Anthropic stand-in (SIGNAL_MOCK=1)
├── config.py            # env-driven settings
├── data/                # SIGNAL_DATA_DIR — signal.db lives here
├── Dockerfile
├── requirements.txt
└── tests/               # pytest suite (mock-mode, no API key)
```

## Endpoints

```
POST /ask                       triad + judge (non-streaming)
POST /ask/batch                 up to 5 queries at once
POST /route                     auto-router (non-streaming)
POST /route/stream              auto-router (SSE; surface fork inside)
POST /dev                       agent loop (non-streaming)
POST /dev/stream                agent loop (SSE)
POST /crew/stream               multi-agent crew (SSE)
GET  /health                    liveness — always 200
GET  /health/ready              honest readiness — 503 when degraded/mock
GET  /diagnostics               full diag · tool registry · system doctrine
GET  /runs                      run log (filterable by mission_id)
GET  /runs/stats                aggregate stats
GET  /runs/{id}                 single run
GET  /memory/stats              failure memory stats
GET  /memory/failures           recent failure records
POST /memory/clear              clear failure memory (confirm=true)
GET  /spine                     workspace snapshot
POST /spine                     replace workspace snapshot
```

All SSE streams emit a `: keepalive` comment frame every 12s so edge
proxies and browsers don't drop the connection during long Anthropic
calls.

## Run locally

```bash
cd signal-backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...      # or SIGNAL_MOCK=1
python main.py                            # http://127.0.0.1:3002
```

`run_command` (gated tools) and `execute_python` are blocked unless
`SIGNAL_ALLOW_CODE_EXEC=true`. See `.env.example`.

## Test

```bash
pip install pytest pytest-asyncio
SIGNAL_MOCK=1 pytest tests/ -q
```

## Persistence

Single SQLite file at `${SIGNAL_DATA_DIR}/signal.db`. Three tables:
`runs`, `spine`, `failures`. WAL mode, single-writer asyncio lock,
indexed on `mission_id` / `fingerprint` / `timestamp`. On first boot
of this wave, legacy `runs.json` / `spine.json` / `failure_memory.json`
are imported one-shot and renamed to `*.migrated`.

In production `SIGNAL_DATA_DIR` MUST be a mounted volume, otherwise
container restarts wipe the archive.

## Doctrine gates

* **Refused without judgment** — `runs.record()` stamps any refusal that
  arrives without `judge_reasoning` / `termination_reason` / errored
  tool_call as `termination_reason = missing_judgment_quarantine`. The
  Archive UI surfaces these as degraded provenance instead of "sem motivo".
* **SIGNAL_ALLOW_CODE_EXEC=false** by default — the gated set
  (`run_command`, `execute_python`) refuses invocation.
* **Surface design_system is explicit** — accepts `signal_canon | custom |
  none_declared`. Silent `None` was removed because it hid "I forgot" from
  "I don't want one".

## Deploy — Railway

```
railway init
railway link <project-id>
railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway variables set SIGNAL_HOST=0.0.0.0
railway variables set SIGNAL_ORIGIN=https://<your-vercel-domain>
railway variables set SIGNAL_ALLOW_CODE_EXEC=false
railway variables set SIGNAL_DATA_DIR=/data
railway volume create --mount-path /data       # MANDATORY
railway up
```

Healthcheck path: `/health` (configured in `railway.json`, 120s timeout
to cover Anthropic SDK init + DB load on cold start). Use `/health/ready`
for honest yes/no in operator dashboards — it 503s when running mock or
when the engine is uninitialised.

After the first successful deploy, set `SIGNAL_BACKEND_URL` in the
Vercel project to the public Railway domain.

## Backend-unreachable contract

When the Vercel edge forwarder cannot reach this backend it returns:

```
HTTP/1.1 503
x-signal-backend: unreachable
Content-Type: application/json

{"error": "backend_unreachable", "reason": "<kind>"}
```

The React client (`src/lib/signalApi.ts`) reads the header and throws
`BackendUnreachableError`, which chambers key off to render the dormant
state. Do NOT regex the body.
