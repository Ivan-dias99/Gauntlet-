# RUBERRA — EXECUTION CANON
**Cascade Discipline · Task Execution Law · Installed 2026-04-01**

---

## THE CASCADE LAW

All work in Ruberra obeys the cascade law. This is not a suggestion. It is the execution protocol.

**Steps (in order — no skipping):**

1. **Inspect** — Read latest relevant state only. Not all state. Only what is relevant to the frontier.
2. **Audit completed** — Inspect what was completed in the owned frontier.
3. **Audit open** — Inspect what remained open, partial, or claimed but unproven.
4. **Preserve real** — Preserve what is real: real work, real code, real consequence.
5. **Remove false** — Remove what is false: duplicates, dead surfaces, weak patterns, anti-Ruberra drift.
6. **Implement frontier** — Implement only the true frontier. The next real thing. Not a detour.
7. **Verify** — Build passes. Runtime passes. Consequence is real and observable.
8. **Repair if partial** — Partial completion is not completion. Repair before advancing.
9. **Advance** — Only then open the next frontier.

**Violations (block any PR that contains these):**

- Opening a new task while prior residue is open
- Implementing decorative surfaces without consequence
- Merging work that fails build or runtime
- Adding features outside the current owned frontier
- Drifting toward the CANNOT list for any reason
- Claiming closure without the five-proof test

---

## CANONICAL MANDATORY READS

Before any task, an agent must read in this order:

1. `RUBERRA_WORKSPACE_CONSTITUTION.md` — sovereign operating law
2. `RUBERRA_MOTHER_BLUEPRINT.md` — system architecture
3. `RUBERRA_FOUNDER_SIGNATURE_LAW.md` — immutable laws
4. `RUBERRA_PRODUCT_TRUTH.md` — what is real today
5. `RUBERRA_EXECUTION_CANON.md` — this file
6. `RUBERRA_REPO_SELF_KNOWLEDGE.md` — repo structure and current state
7. `RUBERRA_STACK_CLOSURE_TRACKER.md` — which stacks are closed, partial, or open

Do not skip. Do not rely on old context. Do not validate work from obsolete assumptions.

---

## WHAT CONSTITUTES PROOF

A stack closure requires five proofs. All five must be met:

| # | Proof Requirement |
|---|-------------------|
| 1 | DNA file exists with complete type system in `src/app/dna/` |
| 2 | State is live in `App.tsx` (`useState` or `useMemo`) |
| 3 | A visible strip or surface reflects the real runtime state |
| 4 | At least one real mutation (not just default state) fires during a session |
| 5 | The runtime consequence is observable by the operator |

Missing even one: status is **partial**, not **closed**.

---

## BUILD LAW

**Gate:** `npm run build` must pass before any commit reaches `main`.

Command: `npm run build` (Vite TypeScript compile + bundle)

No linter. No test runner. Build is the only automated gate.

If build fails: fix before committing. No exceptions.

---

## MERGE LAW

| Condition | Action |
|-----------|--------|
| Mergeable and truthful | Close cleanly — no human cleanup required |
| Incomplete | Block explicitly — state why — require fix |
| Conflicts with canon | Reject — cite the specific law violated |
| Valid but exaggerated claim | Downgrade the claim — correct the record |
| Stale / no activity | Close as abandoned — do not leave hanging |

The human must not manually clean up PR chaos.

---

## TASK SCOPE LAW

Every task must have a single owned frontier. Tasks do not expand scope mid-execution.

- Define the frontier at the start
- Execute only within the frontier
- Record any out-of-scope discoveries as new tasks (do not absorb them)
- Report partial state explicitly if time runs out

---

## AGENT CONDUCT LAW

All agents operating on this repository must:

1. Read the seven canonical docs before doing anything
2. Respect the stack order — no stack work before its dependencies are in place
3. Not claim closure without the five-proof test
4. Not introduce new surfaces that have no consequence
5. Not introduce dependencies without security advisory check
6. Not leave stale conflicts or human cleanup burden
7. Not modify `RUBERRA_CURRENT_PHASE` without sovereign authorization

---

## OUTPUT FORMAT LAW

**Podium answer first. One direction. No option menus. No preamble.**

Status responses must use this format:
```
FILE: <file path or "none">
COMMIT STATUS: <committed / pending / blocked>
BLOCKER: <reason or "none">
```

No verbose preamble. No re-explaining settled truths. No token waste.

---

## WHAT THIS REPO IS NOT

This is not:
- A general-purpose AI chat interface
- A collection of disconnected features
- A demo project
- An experimental prototype

This is an operational sovereign mission workstation. Every change must serve that direction.

---

*This document governs all execution. No shortcuts permitted.*
*Last updated: 2026-04-04*
