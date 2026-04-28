# Signal — External Connectors Map

> Status: living document. Each connector here is **already wired** in the
> codebase as of main HEAD. Out-of-tree connectors (Browser Runtime,
> Design Source, Issue Tracker, Observability/Logs, Model Gateway) are
> tracked in their own wave plans.

This document maps the 5 external connectors that already exist in
production, with their precise touch points in the code, env config,
and operational state.

---

## 1. GitHub Connector

**Purpose**
Repository state (branches, commits, PRs, issues, reviews) consumed
by the operator + by Claude Code sessions when the user delegates PR
work to the agent.

**Implementation**
- MCP tools (`mcp__github__*`) — used by the Claude Code agent during
  PR review cycles. Restricted to the canonical repo via the
  `Repository Scope` configuration in CLAUDE.md.
- Webhook subscription via `subscribe_pr_activity` — events surface
  to the Claude session as `<github-webhook-activity>` tags.

**Env / config**
None required at runtime. The MCP client manages auth.

**Operational state**
- ✅ live — used in this session for PRs #211, #212, #213, #214, #215, #216
- Outbound: `create_pull_request`, `add_issue_comment`,
  `pull_request_review_write`, `update_pull_request_branch`
- Inbound: review comments + CI events stream into the session

**Known gaps**
- No write access to releases / tags from the agent
- No GitHub Actions trigger (we read CI, don't dispatch)

---

## 2. Vercel Connector

**Purpose**
Frontend hosting + edge proxy that forwards `/api/signal/*` and
`/api/ruberra/*` to the backend Railway service. Per-PR preview
deployments.

**Implementation**
- `api/signal.ts` — Vercel edge function (`runtime: edge`) forwarding
  to `$SIGNAL_BACKEND_URL`.
- `api/ruberra.ts` — legacy alias still routing during the Wave-0 →
  Wave-8 compat window.
- `api/_forwarder.ts` — shared helper. Emits both
  `x-signal-backend: unreachable` and `x-ruberra-backend: unreachable`
  on 503 so clients against either contract keep working.
- `vercel.json` — SPA catch-all + explicit `/api/*` rewrites to the
  edge function. Edge functions default to 10s timeout (Hobby plan);
  Pro plan can extend to 60s. SSE responses pass through with
  `Cache-Control: no-cache` and `X-Accel-Buffering: no`.

**Env / config**
- Vercel project env: `SIGNAL_BACKEND_URL` (preferred) /
  `RUBERRA_BACKEND_URL` (legacy fallback) — points at the Railway
  public URL.
- Optional: `VITE_SIGNAL_API_BASE` (build-time) overrides the default
  `/api/signal` base if hosting is split.

**Operational state**
- ✅ live — production + per-PR preview environments
- Each PR gets two Vercel preview URLs (project A + project B)
- Edge timeout is the dominant cause of historical 504s on triad path

**Known gaps**
- 10s Hobby plan timeout can kill triad runs (~15-25s typical). Pro
  needed (60s) or backend direct connection.
- Preview frontend always points to production backend env var; no
  per-PR `SIGNAL_BACKEND_URL` override.

---

## 3. Railway Connector

**Purpose**
Backend Python runtime (FastAPI). Persistent volume for the three
JSON stores. Per-PR preview environments.

**Implementation**
- `signal-backend/main.py` — uvicorn entry.
- `signal-backend/Dockerfile` + `signal-backend/railway.json` — Railway
  build config.
- `signal-backend/config.py` reads:
  - `ANTHROPIC_API_KEY` — required, no fallback
  - `SIGNAL_HOST` / `SIGNAL_PORT` (legacy `RUBERRA_HOST`/`RUBERRA_PORT`)
  - `SIGNAL_ORIGIN` / `SIGNAL_ORIGINS` (legacy `RUBERRA_ORIGIN`) — CORS
  - `SIGNAL_DATA_DIR` / `RUBERRA_DATA_DIR` — the persistent volume path
  - `SIGNAL_MOCK` / `RUBERRA_MOCK` — global mock fallback

**Env / config**
Required in Railway dashboard:
- `ANTHROPIC_API_KEY=sk-ant-...`
- `SIGNAL_DATA_DIR=/data` (must match the mounted volume)
- `SIGNAL_ORIGIN=https://<frontend-host>` (CORS)

Optional:
- `SIGNAL_ALLOW_CODE_EXEC=true` — opens `execute_python` + gated
  `run_command` binaries in the Terminal agent loop. **Default false.
  Risk: the agent can run arbitrary code in the workspace.**
- `SIGNAL_SURFACE_MOCK=1` — forces Surface chamber into mock fallback
  even when key is present.
- `SIGNAL_INSIGHT_MOCK=1` — same for Insight (Wave 6c agent loop).

**Volume — REQUIRED in production**
Railway containers are ephemeral. Without a `/data` volume, the spine,
failure memory, and run log are wiped on every deploy/restart. Mount
a persistent volume at the path matching `SIGNAL_DATA_DIR`.

**Operational state**
- ✅ live — production + per-PR preview environments
- Each PR gets a dedicated `Aiinterfaceshelldesign-pr-<N>` env

**Known gaps**
- No env var diff between PR previews and production (currently
  shared) — operator should treat preview as a "real but isolated
  workspace" not a clean room.
- Memory volume sized manually; no auto-grow.

---

## 4. Web / Research Connector

**Purpose**
External evidence retrieval for the Insight (Wave 6c) and Terminal
(agent loop) chambers. Search-then-fetch pattern.

**Implementation**
- `signal-backend/tools.py`:
  - `WebSearchTool` (name `web_search`) — wraps an external search
    API. Returns ranked hits (title, url, snippet).
  - `WebFetchTool` (name `web_fetch`) — fetches a URL, sanitises HTML,
    returns text. SSRF guards: deny-list of internal IPs + `file://`
    + `localhost`. Size cap on response body.
- `signal-backend/chambers/insight.py` — `ALLOWED_TOOLS = ("web_search",
  "web_fetch", "read_file")` after Wave 6c. Insight uses these in the
  agent loop without the operator having to explicitly invoke.
- `signal-backend/chambers/terminal.py` — `ALLOWED_TOOLS` includes the
  same web tools so the Terminal agent can research while coding.

**Env / config**
- The underlying search provider may need a key
  (`SIGNAL_SEARCH_API_KEY` or similar — check `tools.py`'s
  `WebSearchTool`).
- `web_fetch` SSRF guards live in the tool implementation, not in
  env.

**Operational state**
- ✅ live in Terminal since Wave 5
- ✅ live in Insight since Wave 6c
- Tool calls show in the Terminal output canvas inline

**Known gaps**
- No source verification yet — the Wave 6c plan flagged this. Citations
  appear in tool_result content but aren't ranked or scored. Tracked
  in Wave G.
- No caching — every web_fetch hits the network. Polite, but expensive
  on repeat URLs.

---

## 5. Persistent Memory (JSON files on volume)

**Purpose**
Stateful memory across deploys. Three append-only stores.

**Implementation**
- `signal-backend/spine.py` — workspace snapshot (missions, notes,
  tasks, principles, artifacts, Wave-6a Truth Distillations,
  ProjectContract).
- `signal-backend/runs.py` — append-only run log (every triad / agent
  / crew / surface / distill run).
- `signal-backend/memory.py` — failure memory (questions that
  refused; injected as prior failure context on similar future
  questions).
- All three use `persistence.atomic_write_text_async` (PR #214) for
  cancellation-safe disk flushes.

**Env / config**
- `SIGNAL_DATA_DIR` — directory all three files live in.

**Operational state**
- ✅ live
- Three files: `spine.json`, `runs.json`, `failure_memory.json`
- Quarantine sidecar on corrupt load (`*.corrupt-<timestamp>`) so the
  next write doesn't overwrite evidence.

**Known gaps**
- JSON files don't scale to massive run logs. `MAX_RUNS=2000` cap.
  Postgres migration is the natural next step (Wave O).
- No multi-writer (single backend process). Multi-instance Railway
  service would corrupt the JSON.

---

## Connectors not yet wired (roadmap)

| # | Connector | Tracked in |
|---|---|---|
| 6 | Model Gateway | Wave H |
| 7 | Browser / Preview Runtime | Wave L |
| 8 | Design Source (Figma) | Wave M |
| 9 | Issue Tracker | Wave N |
| 10 | Observability / Logs | Wave I |
| 11 | Persistent DB (Postgres migration of JSON stores) | Wave O |
