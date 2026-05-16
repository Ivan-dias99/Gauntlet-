# Gauntlet · Architecture

Spine document. Maps the system top-down. When in doubt, start here, then follow the references.

---

## What Gauntlet is

Gauntlet is a single product expressed through three pillars, coordinated by two contracts. See **ADR-0001** for the canonical identity statement and the cursor-edge philosophy.

```
                          ┌────────────────────┐
                          │   USER + CURSOR    │
                          └─────────┬──────────┘
                                    │ point → ask → execute
                                    ▼
        ┌───────────────────────────────────────────────────────┐
        │                  COMPOSER  (the cápsula)              │
        │   packages/composer/  → mounted in two shells:        │
        │   • apps/browser-extension/  (Chrome/Firefox)         │
        │   • apps/desktop/             (Tauri 2)               │
        └─────────────────────────┬─────────────────────────────┘
                                  │ /composer/{context,intent,preview,apply}
                                  ▼
        ┌───────────────────────────────────────────────────────┐
        │                BACKEND  (the maestro)                 │
        │   backend/  — FastAPI server                          │
        │   • model_gateway.py  (catalogue + routing + record)  │
        │   • 5 designated client modules                       │
        │   • 5-layer security envelope                         │
        │   • runs.json append-only ledger                      │
        │   • failure_memory.json anti-loop                     │
        └─────────────────────────┬─────────────────────────────┘
                                  │ Groq SSE · Anthropic (paused) · Gemini (paused) · MOCK (CI)
                                  ▼
                          ┌────────────────────┐
                          │  PROVIDER (LLM)    │
                          └────────────────────┘

        ┌───────────────────────────────────────────────────────┐
        │           CONTROL CENTER  (the garagem)               │
        │   control-center/  — Vercel-deployed operator panel   │
        │   • 9 pages: Overview, Settings, Models, Permissions, │
        │     Memory, Ledger, Composer, Governance, Layout      │
        │   • talks to Backend via /api/gauntlet/* edge         │
        └───────────────────────────────────────────────────────┘
```

---

## Three pillars

### Composer · `packages/composer/`

The dense work surface. Lives at the cursor edge. Mounted by two shells through a per-shell `Ambient` adapter:

- `apps/browser-extension/components/App.tsx` calls `createBrowserAmbient()`
- `apps/desktop/src/App.tsx` calls `createDesktopAmbient()`

**Dual-shell parity** for the Capsule is law (ADR-0004). The Pill is intentionally divergent in desktop because page-DOM concepts don't translate to OS windows — see ADR-0004 for the rule and `apps/desktop/src/PillApp.tsx` for the implementation.

The visual identity is **Aether v1** (ADR-0005). The Composer pipeline contract is `context → intent → preview → apply` (Backend section below).

### Backend · `backend/`

FastAPI server. Single domain authority over:

- Model routing (`model_gateway.py` is a **catalogue + routing + recording layer**, not an HTTP funnel — see ADR-0002)
- Provider precedence (MOCK > Groq > Anthropic paused > Gemini paused — see ADR-0003)
- Run ledger (`runs.json`, append-only, accessed via `runs.py` `run_store` API only)
- Failure memory (`failure_memory.json`, anti-loop fingerprint)
- 5-layer security envelope: API key gate · rate limit · security headers · body cap · log redaction
- Composer pipeline HTTP endpoints

### Control Center · `control-center/`

Operator console deployed to Vercel. Configuration, history, model selection, memory inspection, governance. Talks to Backend via `/api/gauntlet/*` (Vercel edge forwarder at `api/gauntlet.ts`). Legacy aliases `/api/signal/*` and `/api/ruberra/*` are served as forwarders until v1.1.0 (ADR-0006).

---

## Composer pipeline contract

```
1. Capture context              POST /composer/context
   Input:  selection + URL + (optional) screenshot + DOM snapshot
   Output: context-id, stored in context buffer

2. Classify intent + route      POST /composer/intent
   Input:  context-id, user prompt
   Output: intent-id, model selection committed

3. Generate preview (read-only) POST /composer/preview
   Input:  intent-id
   Output: preview artifact — one of four canonical shapes:
           A) text     {kind:"text",   model, latency_ms, content}
           B) plan     {kind:"plan",   model, latency_ms, actions:[{step,op,target,args,sensitive}]}
           C) gated    plan with at least one sensitive:true → renders DangerGate
           D) result   only after apply — {kind:"result", steps:[{step,status,message}]}

4. Apply + record               POST /composer/apply
   Input:  intent-id, (optional) operator confirmation for sensitive actions
   Output: result artifact + 2 rows written to runs.json:
           - envelope row with route="composer", composer:intent_id
           - internal row with route="agent"|"triad", same composer:intent_id
```

Stage 3 must be side-effect-free. Stage 4 owns all side effects. Violations are doctrine breaks; see skill `gauntlet-backend-spine` v1.1.

---

## Phase grammar — the Capsule's state machine

11 states total. Two parallel machines.

```
PILL (always-on resting chrome):
  idle · active · offline

CAPSULE (on-demand work surface):
  idle → planning → streaming → plan_ready
                                      ↓ (sensitive actions present)
                                  danger_gate → executing → executed
                                      ↓ (rejected)
                                   plan_ready

         any state ────→ error
```

`danger_gate` is its own phase — the explicit confirmation gate when any plan step has `sensitive: true`. The transition `plan_ready → executing` does not happen if sensitive actions are present without passing through `danger_gate` first.

Full visual spec in `docs/canon/COMPOSER_SURFACE_SPEC.md`. Canon in ADR-0005. Operational rules in skill `gauntlet-design-system` v1.1.

---

## Repository layout

```
Gauntlet-/
├── packages/
│   └── composer/                 ← shared Composer (Capsule + Pill + helpers)
│       └── src/
│           ├── Capsule.tsx       (budget: 778 LOC enforced by ci.yml)
│           ├── Pill.tsx          (browser-mounted; desktop uses PillApp.tsx)
│           ├── composer-client.ts
│           ├── ambient.ts        (capability contract per shell)
│           └── … 60+ sub-components and hooks
│
├── apps/
│   ├── browser-extension/        ← Chrome/Firefox WXT MV3
│   │   ├── components/App.tsx    (mounts shared Capsule + Pill)
│   │   ├── lib/ambient.ts        (createBrowserAmbient)
│   │   └── entrypoints/          (content + background)
│   │
│   └── desktop/                  ← Tauri 2
│       ├── src/
│       │   ├── App.tsx           (mounts shared Capsule)
│       │   ├── PillApp.tsx       (custom slim pill — see ADR-0004)
│       │   └── ambient.ts        (createDesktopAmbient)
│       └── src-tauri/
│           ├── src/lib.rs        (24 commands in 3 risk tiers)
│           └── tauri.conf.json   (updater pubkey: NOT yet pinned — open blocker)
│
├── control-center/               ← Vercel operator panel
│   ├── pages/                    (9 pages: Overview, Settings, Models, …)
│   ├── styles/tokens.css
│   └── design/                   (typed token graph)
│
├── backend/                      ← FastAPI maestro
│   ├── server.py · main.py
│   ├── routers/                  (11 routers)
│   ├── composer.py               (4-stage pipeline)
│   ├── engine.py · agent.py      (designated clients)
│   ├── mock_client.py
│   ├── groq_provider.py
│   ├── gemini_provider.py        (paused)
│   ├── model_gateway.py          (catalogue + routing + record)
│   ├── runs.py                   (append-only ledger)
│   ├── memory.py                 (failure memory)
│   ├── auth.py · rate_limit.py · security_headers.py · log_redaction.py
│   └── test_*.py                 (5 suites)
│
├── api/                          ← Vercel edge forwarders
│   ├── gauntlet.ts               (canonical)
│   ├── signal.ts                 (legacy alias, deleted at v1.1.0)
│   └── ruberra.ts                (legacy alias, deleted at v1.1.0)
│
├── docs/
│   ├── adr/                      (this folder — 6 retroactive ADRs)
│   ├── canon/
│   │   └── COMPOSER_SURFACE_SPEC.md   (authoritative visual spec)
│   ├── A11Y_AUDIT.md
│   ├── COMPONENT_HIERARCHY.md
│   ├── COMPOSER_V0.md
│   ├── DESIGN_TOKENS.md
│   ├── EMPTY_STATES.md
│   ├── INFORMATION_ARCHITECTURE.md
│   ├── KEYBOARD.md
│   ├── MOTION.md
│   ├── OPERATIONS.md
│   ├── RESPONSIVE.md
│   ├── SECURITY_AUDIT.md
│   ├── VOICE.md
│   └── ARCHITECTURE.md           (you are here)
│
├── .claude/
│   ├── skills/                   (4 SKILL.md — operational rules)
│   ├── settings.json             (allowlist/denylist + env)
│   ├── commands/                 (5 slash commands)
│   ├── hooks/                    (3 hooks)
│   └── agents/                   (3 sub-agents)
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── release.yml
│   ├── CODEOWNERS
│   └── dependabot.yml
│
├── CLAUDE.md                     ← universal doutrina
├── README.md
├── CHANGELOG.md
└── package.json                  ← root workspace
```

---

## Where to find what

### Doctrine — the unchanging rules

- `CLAUDE.md` — universal Ruberra law (truth law, MCP law, output law, closure check)
- `docs/adr/` — six retroactive ADRs cristallizing key decisions
- `.claude/skills/` — operational rules per territory (4 skills)

### Visual canon

- ADR-0005 — Aether v1 constitution
- `docs/canon/COMPOSER_SURFACE_SPEC.md` — authoritative spec
- `docs/DESIGN_TOKENS.md` — token reference
- `docs/MOTION.md` — motion contract
- `docs/COMPONENT_HIERARCHY.md` — component composition rules
- `docs/EMPTY_STATES.md` — empty/loading/error patterns
- `docs/VOICE.md` — voice + tone + ban-list

### Operations

- `docs/OPERATIONS.md` — boot, cutover, rollback, backup, deploy
- `docs/SECURITY_AUDIT.md` — pre-tag walk for v1.0.0+
- `.github/workflows/ci.yml` — gates (capsule budget · voice check · pytest · cargo)
- `.claude/commands/release-prep.md` — pre-tag verification flow

### Where decisions live

If you're asking "why X?" and X is one of:

- "Why three pillars?" → ADR-0001
- "Why is the gateway not a single HTTP funnel?" → ADR-0002
- "Why Groq primary, Anthropic paused?" → ADR-0003
- "Why does the desktop Pill differ from the browser Pill?" → ADR-0004
- "Why Inter when frontend-design bans it?" → ADR-0005 (Aether v1)
- "Why aren't `SIGNAL_*` env vars removed yet?" → ADR-0006

---

## The four Claudes operating model

This system is operated through four Claude sessions, all triggered by Ivan in real-time (no API automation). Repo is the shared memory.

| Session | Where | Reads | Writes |
|---|---|---|---|
| **Claude AI** | claude.ai chat | conversation + repo (manual paste) | doutrina, plans, ADRs, specs |
| **Claude Code** | terminal | `.claude/skills/` + `.claude/commands/` + `CLAUDE.md` + ADRs | code, commits, PRs |
| **Claude Code + sub-agent** | terminal (same session) | `.claude/agents/<name>.md` | reviews, audits, validation reports |
| **Claude Design** (optional) | claude.ai or Claude Code | `gauntlet-design-system` skill + ADR-0005 + Aether spec | UI components, visual iterations |

Loop closes through the repo. Each session reads state, writes state, commits. Next session picks up. See README of `.claude/` pack for the full loop description.

---

## Open work · known issues (as of 2026-05-11)

- **Tauri updater pubkey NOT pinned** in `tauri.conf.json` — blocks v1.0.0 public release (RCE risk via auto-updater otherwise). Mentioned in ADR-0006 and `gauntlet-tauri-shell` skill v1.1.
- **`composer.py` `_route_model` hard-coded models** — duplicates gateway policy (ADR-0002 anti-pattern). Two remediation options documented.
- **Version drift**: `apps/browser-extension/` at `1.0.2` vs rest at `1.0.1`. No CI gate detects this. Manual resolution before next tag.
- **Seven high-risk Tauri commands ambient-scoped** (file write, shell, computer use). Should be scoped to `main` window only via explicit permission. `gauntlet-tauri-shell` skill v1.1 documents the gap.
- **Five backend pytest suites unvalidated** by the operator. Same for e2e Playwright, Control Center 9 pages, Tauri desktop. The infra-first approach (this pack) precedes that validation.

---

## References summary

- `CLAUDE.md` — universal doctrine
- `docs/adr/0001` through `0006` — cristallized decisions
- `docs/canon/COMPOSER_SURFACE_SPEC.md` — visual spec
- `docs/{A11Y_AUDIT,COMPONENT_HIERARCHY,COMPOSER_V0,DESIGN_TOKENS,EMPTY_STATES,INFORMATION_ARCHITECTURE,KEYBOARD,MOTION,OPERATIONS,RESPONSIVE,SECURITY_AUDIT,VOICE}.md` — referenced from this spine
- `.claude/skills/*` — operational rules (4 skills, see `.claude/skills/*/SKILL.md`)
- `.github/workflows/ci.yml` — automated gates
- `README.md` at root — public-facing overview

When this doc conflicts with the actual code on main, **the code wins**. Repo truth beats narrative. Update this doc.
