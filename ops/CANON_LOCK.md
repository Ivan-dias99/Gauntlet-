# Signal Canon Lock

## Canonical truth

```
Canonical production deployment:
  dpl_5hSvhX7nTdtc4MDNBoGaNtYD1pFs

Canonical production URL:
  aiinterfaceshelldesign-2pda-6f9rhnpx7-ivan-star-devs-projects.vercel.app

Canonical source branch:
  claude/signal-implementation-Ex23a

Canonical source commit:
  d4396bc7dca0f638dee4c36ea428b1e9dd31006f

Working base branch (this branch):
  signal/canon-lock-d4396bc
```

## Law

All future work on Signal must start from this base. The canonical
production visual identity is locked. New tasks **add** inside the
canon. They never reconstruct it, never replace it, never invent a new
one, never discard what is already locked.

### Required startup sequence (any agent, any session)

1. `git fetch origin`
2. `git checkout signal/canon-lock-d4396bc` (or branch from it)
3. Confirm `git rev-parse HEAD` descends from
   `d4396bc7dca0f638dee4c36ea428b1e9dd31006f`.
4. Create a fresh task branch named `task/<scope>-<id>` from this base.
5. Apply only the assigned scope.
6. Open a PR back into `signal/canon-lock-d4396bc` for review.
7. Production promotion requires explicit operator approval.

### Forbidden branches (drift)

These branches contain useful work but were authored on the wrong
base. They are **inspect-only**. Do not merge directly. Cherry-pick
only specific logic patches that do not touch protected files.

```
codex/implement-operational-must-haves-for-signal-terminal
claude/plan-backend-frontend-integration-cQe1Y
claude/vercel-edge-deploy-XwlRb
```

Older `claude/*`, `codex/*`, and `v0/*` branches are also drift unless
proven to descend from the canonical commit above.

### Protected files (visual identity lock)

Changes to these files require explicit canon-lock review. They are
the visual identity of Signal and cannot drift.

```
src/styles/tokens.css
src/shell/CanonRibbon.tsx
src/shell/Shell.tsx
src/shell/ChamberHead.tsx
src/landing/**
src/chambers/insight/**       (visual layer)
src/chambers/surface/**       (visual layer)
src/chambers/terminal/**      (visual layer)
src/chambers/archive/**       (visual layer)
src/chambers/core/**          (visual layer)
src/i18n/copy.ts              (chamber-defining strings)
```

A patch is **not** allowed to:

* rewrite global typography
* alter the chamber composition grammar (head · body · rail · floor)
* replace the `data-chamber` DNA system in `tokens.css`
* swap the landing surface for another shell
* reflow the ribbon or its mission caret
* introduce a new theme system on top of the existing one

A patch **is** allowed to:

* add a new chamber tab as long as it inherits the existing grammar
* extend a panel inside an existing chamber if it composes through
  the shared primitives (`.panel`, `.core-page`, `.term-output`,
  `.surface-canvas-*`, `.archive-*`)
* add new copy keys to `i18n/copy.ts` without renaming or removing
  any existing key
* add a new shared primitive that other chambers can adopt later

### Allowed surgical extraction (from drift branches)

The following technical patches may be cherry-picked from drift
branches IF they do not touch any protected file:

* `package.json` build/typecheck gate (must be additive — never
  remove existing scripts)
* `api/_forwarder.ts` runtime/typing fixes
* backend readiness contracts (`/health/ready` shape, status hook
  consumption)
* tool registry truth (must read backend, not invent local lists)
* terminal task queue data plumbing (state shape only)
* archive ledger filters and refused-run validation
* search plumbing
* mission validation logic (validator, not visual treatment)

When extracting, the operator inspects:

```
git diff --name-status d4396bc..origin/<drift-branch>
```

Files inside the protected set above are off-limits unless explicitly
re-approved by canon-lock review.

## What "canon" means visually

The canonical screens locked at `d4396bc` include:

* **Insight** — `three analyses before one answer · divergence becomes refusal`
  hero, single-column thread, flagship composer at the bottom.
* **Surface** — left studio panel (brief, output, fidelity, design system),
  right canvas with the `Visual Contract Blocked` checklist + canned
  shortcuts strip until the real catalogue arrives.
* **Terminal** — `Ready. Declare a task. The command has consequence.`
  hero, workbench strip with `Repo · Diff · Gates · Deploy · Queue`,
  composer dock at the bottom.
* **Archive** — `sealed runs · provenance · ledger`, two-column ledger +
  detail layout, empty-state copy `Select a ledger entry to see its
  origin, the linked artifact, and the chain that produced it.`
* **Core** — five tabs (Policies · Routing · Permissions · Orchestration
  · System), constitutional register with serif articles + § gutter +
  inscribe composer.

Anyone reconstructing these from another branch is replacing the canon,
not preserving it.

## Why this exists

Multiple drift branches converged on the wrong base, producing several
visual identities for the same product. Production visual quality is
not allowed to fluctuate. This file exists so every future agent (and
every future operator) opens the repo on a deterministic foundation
and never has to ask which visual is the real one.

The visual is `d4396bc`. The branch is this branch. Future tasks add
inside it. Nothing else.
Canonical production deployment:
dpl_5hSvhX7nTdtc4MDNBoGaNtYD1pFs

Canonical production URL:
aiinterfaceshelldesign-2pda-6f9rhnpx7-ivan-star-devs-projects.vercel.app

Canonical source branch:
claude/signal-implementation-Ex23a

Canonical source commit:
d4396bc7dca0f638dee4c36ea428b1e9dd31006f

Working base branch:
signal/canon-lock-d4396bc

Law:
All future work must start from this base.
No previous Claude/Codex branches may be merged directly.
Only surgical patches may be extracted.
Global visual identity is locked.
tokens.css, shell chrome, typography, landing, and chamber layout are protected.
Production promotion requires explicit approval.
