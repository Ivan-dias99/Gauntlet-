# Gauntlet — OPERATIONS

```
╔══════════════════════════════════════════════════════════════╗
║   OPERATIONAL GUIDE                                          ║
║   Boot · Cutover · Rollback · Incident · Backup · Deploy     ║
╚══════════════════════════════════════════════════════════════╝
```

## Boot

### Required env

```
ANTHROPIC_API_KEY          Anthropic key (sk-ant-…)         REQUIRED
GAUNTLET_HOST              Bind host                        default 127.0.0.1
GAUNTLET_PORT              Bind port (PORT also honored)    default 3002
GAUNTLET_DATA_DIR          Persistent data dir              REQUIRED in prod
GAUNTLET_ORIGIN            CORS origin (comma list ok)      REQUIRED in prod
```

### Optional env

```
GAUNTLET_MOCK=1                  Bypass Anthropic with canned answers
GAUNTLET_API_KEY=…               Bearer token gate (off if empty)
GAUNTLET_RATE_LIMIT_DISABLED=1   Bypass rate limiter (dev/test only)
GAUNTLET_HSTS=1                  Stamp HSTS (https deploys only)
GAUNTLET_FRAME_OPTIONS=DENY      DENY | SAMEORIGIN
GAUNTLET_CSP=…                   Full CSP override
GAUNTLET_MAX_BODY_BYTES=1048576  Per-request body cap
GAUNTLET_LOG_REDACT=1            Token redaction in logs (default ON)
GAUNTLET_ALLOW_CODE_EXEC=1       Enable execute_python tool (off by default)
```

JSON-on-disk in `GAUNTLET_DATA_DIR` is the canonical (and only) source of
truth for runs / spine / failure memory. The Postgres dual-write/cutover
code was dropped in v1.0 — re-introduce when load justifies it, with a
clean design under a single feature flag.

### Legacy aliases (transition window)

`SIGNAL_*` and `RUBERRA_*` are still read as silent fallbacks if the matching
`GAUNTLET_*` is unset. Plan: remove the aliases once the canonical names land
in every deployed env.

```
SIGNAL_HOST              → GAUNTLET_HOST
SIGNAL_PORT              → GAUNTLET_PORT
SIGNAL_DATA_DIR          → GAUNTLET_DATA_DIR
SIGNAL_ORIGIN            → GAUNTLET_ORIGIN
SIGNAL_MOCK              → GAUNTLET_MOCK
SIGNAL_API_KEY           → GAUNTLET_API_KEY
RUBERRA_HOST             → GAUNTLET_HOST           (older alias)
RUBERRA_PORT             → GAUNTLET_PORT
RUBERRA_BACKEND_URL      → GAUNTLET_BACKEND_URL
RUBERRA_ALLOW_CODE_EXEC  → GAUNTLET_ALLOW_CODE_EXEC
```

### Start

```
DEV    cd backend && python main.py
PROD   docker build -t gauntlet . && docker run -p 3002:3002 \
         -e ANTHROPIC_API_KEY=… -v gauntlet-data:/data gauntlet
```

## Persistence

JSON-on-disk in `GAUNTLET_DATA_DIR` is the canonical source of truth
for runs / spine / failure memory. The Postgres dual-write/cutover
scaffold was dropped in v1.0 — re-introduce when load justifies it,
with a clean design under a single feature flag. There is no mirror,
no parity check, no canonical flip to manage today.

## Incident response — `/diagnostics`

Shape (abridged):

```
boot.persistence_ephemeral      true  → operator forgot the volume
boot.anthropic_api_key_present  false → key not loaded; will refuse
persistence.spine_last_save_error  →  disk write failed; check volume
persistence.spine_last_load_error  →  JSON parse failed / quarantined
security.auth_required          false → public endpoint!
```

Triage table:

```
field                          when not-ok      action
─────────────────────────────  ───────────────  ─────────────────────────
persistence_ephemeral          true (prod)      mount volume at GAUNTLET_DATA_DIR
anthropic_api_key_present      false            set ANTHROPIC_API_KEY
spine_last_save_error          non-empty        check disk space + permissions
spine_last_load_error          non-empty        check the .quarantine sidecar
auth_required (prod)           false            set GAUNTLET_API_KEY
```

## Backup

### Daily

```
cd backend && python backup.py
```

Output:
- `MEMORY_DIR/backups/<ISO>/` with copies of `*.json`

Cron example:

```
0 4 * * *  cd /app/backend && python backup.py >> /var/log/gauntlet-backup.log 2>&1
```

Retention: rotate `MEMORY_DIR/backups/` externally (logrotate or
object-store sync) — `backup.py` does NOT prune old folders.

### Restore

```
1. Stop the service.
2. cp -r MEMORY_DIR/backups/<ISO>/*.json MEMORY_DIR/
3. Start.
```

## Deploy

### Railway (backend)

```
railway link <project-id>
railway variables set ANTHROPIC_API_KEY=…
railway variables set GAUNTLET_DATA_DIR=/data
railway volume create --mount-path /data
railway up
```

Health probe: `GET /health` — 120s timeout (cold start with Anthropic
SDK init can exceed 30s default).

### Vercel (frontend)

```
vercel link
vercel env add GAUNTLET_BACKEND_URL          # the Railway public URL
vercel deploy --prod
```

### Secrets table

```
key                          where     scope
───────────────────────────  ────────  ─────────────────────────
ANTHROPIC_API_KEY            railway   backend only
GAUNTLET_API_KEY             railway   backend bearer gate
GAUNTLET_DATABASE_URL        railway   PG mirror DSN
GAUNTLET_BACKEND_URL         vercel    edge forwarder target
```

```
┌───────────────────────────────────────────────────────────┐
│  Cautious posture: one variable at a time, restart, watch │
│  /diagnostics. Never flip canonical without parity_check. │
└───────────────────────────────────────────────────────────┘
```
