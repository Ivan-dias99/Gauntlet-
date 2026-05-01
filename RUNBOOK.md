# Signal — RUNBOOK

```
╔══════════════════════════════════════════════════════════════╗
║   OPERATIONAL GUIDE — Wave P-32                              ║
║   Boot · Cutover · Rollback · Incident · Backup · Deploy     ║
╚══════════════════════════════════════════════════════════════╝
```

## Boot

### Required env

```
ANTHROPIC_API_KEY        Anthropic key (sk-ant-…)         REQUIRED
SIGNAL_HOST              Bind host                        default 127.0.0.1
SIGNAL_PORT              Bind port (PORT also honored)    default 8080
SIGNAL_DATA_DIR          Persistent data dir              REQUIRED in prod
SIGNAL_ORIGIN            CORS origin (comma list ok)      REQUIRED in prod
```

### Optional env

```
SIGNAL_MOCK=1                  Bypass Anthropic with canned answers
SIGNAL_DATABASE_URL=…          Enable Postgres mirror (cutover candidate)
SIGNAL_DUAL_WRITE_PG=1         Activate mirror writes (PG stays shadow)
SIGNAL_PG_CANONICAL=1          Read from PG (requires DUAL_WRITE_PG=1)
SIGNAL_API_KEY=…               Bearer token gate (off if empty)
SIGNAL_RATE_LIMIT_DISABLED=1   Bypass rate limiter (dev/test only)
SIGNAL_HSTS=1                  Stamp HSTS (https deploys only)
SIGNAL_FRAME_OPTIONS=DENY      DENY | SAMEORIGIN
SIGNAL_CSP=…                   Full CSP override
SIGNAL_MAX_BODY_BYTES=1048576  Per-request body cap
SIGNAL_LOG_REDACT=1            Token redaction in logs (default ON)
SIGNAL_ALLOW_CODE_EXEC=1       Enable execute_python tool (off by default)
```

### Start

```
DEV    cd signal-backend && python main.py
PROD   docker build -t signal . && docker run -p 8080:8080 \
         -e ANTHROPIC_API_KEY=… -v signal-data:/data signal
```

## Cutover JSON → Postgres

```
┌───────────┐   ┌────────────┐   ┌──────────────┐   ┌──────────────┐
│ 1. Mirror │ → │ 2. Backfill │ → │ 3. Parity    │ → │ 4. Canonical │
│  on       │   │  legacy    │   │  check       │   │  flip        │
└───────────┘   └────────────┘   └──────────────┘   └──────────────┘
```

1. **Dual-write on**
   ```
   SIGNAL_DATABASE_URL=postgres://…
   SIGNAL_DUAL_WRITE_PG=1
   ```
   Restart. Reads stay JSON; writes mirror to PG.

2. **Backfill legacy state**
   ```
   cd signal-backend && python migrate.py
   ```
   Replace-all by section (spine, runs, failure_memory). Idempotent.

3. **Parity check**
   ```
   cd signal-backend && python -m parity_check
   ```
   - Exit 0 → safe to flip
   - Exit 1 → drift; do NOT flip; investigate

4. **Canonical flip**
   ```
   SIGNAL_PG_CANONICAL=1
   ```
   Restart. JSON stays warm via dual-write so rollback is instant.

5. **Monitor**
   ```
   curl /diagnostics | jq '.persistence'
   ```
   Watch `spine_last_load_error`. Empty = clean. `pg_canonical_returned_none`
   or `pg_canonical_empty_with_json_data` = degraded; rollback.

## Rollback

```
┌──────────────────────────────────────────────────────┐
│  unset SIGNAL_PG_CANONICAL  →  restart  →  JSON wins │
└──────────────────────────────────────────────────────┘
```

Dual-write keeps JSON warm; no data loss. If you also want to stop
mirroring, unset `SIGNAL_DUAL_WRITE_PG`.

## Incident response — `/diagnostics`

Shape (abridged):

```
boot.persistence_ephemeral      true  → operator forgot the volume
boot.anthropic_api_key_present  false → key not loaded; will refuse
surface.mock_active             true  → check surface.reason field
persistence.spine_last_save_error  →  disk write failed; replicas?
persistence.spine_last_load_error  →  PG / JSON read degraded
security.auth_required          false → public endpoint!
```

Triage table:

```
field                          when not-ok      action
─────────────────────────────  ───────────────  ─────────────────────────
persistence_ephemeral          true (prod)      mount volume at SIGNAL_DATA_DIR
anthropic_api_key_present      false            set ANTHROPIC_API_KEY
spine_last_save_error          non-empty        check disk + PG pool
spine_last_load_error          non-empty        rollback PG_CANONICAL
surface.mock_active            true unexpectedly look at surface.reason
auth_required (prod)           false            set SIGNAL_API_KEY
```

## Backup

### Daily

```
cd signal-backend && python backup.py
```

Output:
- `MEMORY_DIR/backups/<ISO>/` with copies of `*.json`
- If `SIGNAL_DATABASE_URL` is set: `pg_dump.sql.gz` alongside

Cron example:

```
0 4 * * *  cd /app/signal-backend && python backup.py >> /var/log/signal-backup.log 2>&1
```

Retention: rotate `MEMORY_DIR/backups/` externally (logrotate or
object-store sync) — `backup.py` does NOT prune old folders.

### Restore

```
1. Stop the service.
2. cp -r MEMORY_DIR/backups/<ISO>/*.json MEMORY_DIR/
3. (optional) gunzip < pg_dump.sql.gz | psql "$SIGNAL_DATABASE_URL"
4. Start.
5. python -m parity_check  → confirm parity before re-flipping canonical.
```

## Deploy

### Railway (backend)

```
railway link <project-id>
railway variables set ANTHROPIC_API_KEY=…
railway variables set SIGNAL_DATA_DIR=/data
railway volume create --mount-path /data
railway up
```

Health probe: `GET /health` — 120s timeout (cold start with Anthropic
SDK init can exceed 30s default).

### Vercel (frontend)

```
vercel link
vercel env add SIGNAL_BACKEND_URL          # the Railway public URL
vercel deploy --prod
```

### Secrets table

```
key                          where     scope
───────────────────────────  ────────  ─────────────────────────
ANTHROPIC_API_KEY            railway   backend only
SIGNAL_API_KEY               railway   backend bearer gate
SIGNAL_DATABASE_URL          railway   PG mirror DSN
SIGNAL_GITHUB_TOKEN          railway   /issues/create
SIGNAL_RAILWAY_TOKEN         railway   self-introspection
SIGNAL_VERCEL_TOKEN          railway   /deploys/vercel
SIGNAL_BACKEND_URL           vercel    edge forwarder target
```

```
┌───────────────────────────────────────────────────────────┐
│  Cautious posture: one variable at a time, restart, watch │
│  /diagnostics. Never flip canonical without parity_check. │
└───────────────────────────────────────────────────────────┘
```
