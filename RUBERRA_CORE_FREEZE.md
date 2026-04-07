# Ruberra Core Freeze

**Tag**: `v1.0.0-ruberra-core`
**Date**: 2026-04-06
**Main tip at freeze**: `331decb`

---

## What Is Frozen

### Event Spine
- `src/ruberra/spine/eventLog.ts` — append-only IndexedDB log, `seq`-stable hydration ordering, `_resetForTest()` for test isolation
- `src/ruberra/spine/events.ts` — `RuberraEvent` interface with `seq` field, full `EventType` union including `repo.verified`
- `src/ruberra/spine/projections.ts` — pure projection reducer, full thread/canon/memory/execution/artifact state machine
- `src/ruberra/spine/store.ts` — `useProjection`, `emit.*`, `bootSpine`
- `src/ruberra/spine/gitAuthority.ts` — `verifyRepo()` calling backend `/git/verify`

### Sovereign Shell
- `src/ruberra/shell/Shell.tsx` — topbar, chamber glyphs, narrow-width rail toggles, Escape+backdrop drawer seal, git status chip
- `src/ruberra/shell/ThreadStrip.tsx` — left rail, overlay open/close props
- `src/ruberra/shell/CanonRibbon.tsx` — right rail, overlay open/close props
- `src/ruberra/shell/EventPulse.tsx` — bottom event log strip
- `src/ruberra/shell/RitualEntry.tsx` — boot ritual, repo bind input
- `src/ruberra/styles.css` — sovereign visual grammar, narrow-width media queries

### Chambers
- `src/ruberra/chambers/Creation.tsx` — directive composition, execution, artifact review, no native confirm/prompt
- `src/ruberra/chambers/Lab.tsx`
- `src/ruberra/chambers/School.tsx` — canon revocation, no native confirm/prompt

### Trust Surfaces
- `src/ruberra/trust/RuledPrompt.tsx` — sovereign modal, imperative async API, single Escape layer
- `src/ruberra/trust/ErrorBoundary.tsx`
- `src/ruberra/trust/Unavailable.tsx`

### Execution Backend
- `exec-backend/index.mjs` — zero-dep Node.js server, real `git ls-files`, anchored glob regex (`(?:.*/)? prefix` for `**/`), `/exec`, `/git/status`, `/git/verify`

### Test Suite (75 tests, 6 files)
- `src/ruberra/spine/__tests__/projections.test.ts` — 14 pure reducer tests
- `src/ruberra/spine/__tests__/eventLog.test.ts` — 5 in-memory append/subscribe tests
- `src/ruberra/spine/__tests__/continuity.test.ts` — 5 IDB round-trip continuity tests (fake-indexeddb)
- `src/ruberra/shell/__tests__/surfaces.render.test.tsx` — 30 structural surface tests
- `src/ruberra/shell/__tests__/drawer.render.test.tsx` — 12 drawer toggle/seal behavior tests
- `src/ruberra/trust/__tests__/RuledPrompt.render.test.tsx` — 7 sovereign modal interaction tests

---

## What Is Intentionally Not Part of Core

- Playwright E2E browser tests — written in `tests/e2e/`, require `npx playwright install chromium`
- Backend persistence — `exec-backend` is stateless by design
- Authentication or multi-user model
- Deployment infrastructure (Vercel config exists but not part of core freeze scope)
- AI-powered directive interpretation
- Visual regression pixel baselines

---

## Invariants That Must Not Be Violated in Future Waves

1. **Law of Consequence** — every user action emits an event; no silent no-ops; `null.consequence` is the explicit null outcome
2. **Repo Centrality** — no thread, directive, execution, or artifact without a bound repo; `requireRepo()` enforced
3. **Directive Hinge** — no execution without an accepted directive; `requireThread()` enforced
4. **Truth-state taxonomy** — `draft → observed → retained → hardened → revoked`; no state skips or backwards transitions
5. **No native prompt/confirm/alert** — all user confirmation flows through `RuledPrompt`; zero exceptions
6. **No fake execution** — backend runs real filesystem/git operations or `failExecution` fires; no hardcoded artifact lists
7. **Append-only event log** — existing events are never mutated or deleted; projections are always derived by replaying the full log
8. **seq field on all new appends** — `RuberraEvent.seq` must be set at append time for deterministic hydration ordering; do not omit
9. **Single Escape layer in modals** — Radix Dialog `onEscapeKeyDown` is the sole Escape handler; do not add redundant key handlers in child inputs
10. **Glob scope anchoring** — scope patterns must be anchored (`^...$`) with `(?:.*/)? ` for `**/` prefix so directives do not match files outside intended boundary
