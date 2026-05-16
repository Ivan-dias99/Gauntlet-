---
description: Measure packages/composer/src/Capsule.tsx LOC vs BUDGET in ci.yml. Reports delta and verdict.
allowed-tools:
  - Bash(wc -l packages/composer/src/Capsule.tsx)
  - Bash(grep *)
  - Bash(cat .github/workflows/ci.yml)
  - Bash(awk *)
---

# /capsule-budget

Enforce the Capsule Law (skill `gauntlet-design-system` § Capsule Law): `Capsule.tsx` line count must descend, never grow.

## Steps

1. Measure current LOC:

```bash
current=$(wc -l < packages/composer/src/Capsule.tsx)
echo "current: $current"
```

2. Extract BUDGET from `.github/workflows/ci.yml`:

```bash
budget=$(grep -oE 'BUDGET=[0-9]+' .github/workflows/ci.yml | head -1 | cut -d= -f2)
echo "budget:  $budget"
```

3. Compute verdict:

| Condition | Verdict |
|---|---|
| `current > budget` | **FAIL** — Capsule has grown. Block the change. Extract a sub-component / hook in same PR. |
| `current == budget` | **PASS** — at ceiling. New growth would fail. |
| `current < budget` | **PASS · improvement** — Capsule shrank. **Lower `BUDGET` in `ci.yml` to `$current` in the same PR.** |

4. Report in this shape:

```
CAPSULE BUDGET
  current: <N>   packages/composer/src/Capsule.tsx
  budget:  <M>   .github/workflows/ci.yml

  delta:   <current - budget> (negative = improvement)
  verdict: <PASS | PASS·improvement | FAIL>

  [if FAIL]
  required action:
    1. Identify a stateful sub-feature, cross-cutting concern, or pure utility
    2. Extract to packages/composer/src/<name>.{tsx|ts}
    3. Re-run /capsule-budget until current ≤ budget

  [if PASS·improvement]
  required action:
    1. Edit .github/workflows/ci.yml: set BUDGET=<current>
    2. Commit the BUDGET update in the same PR that caused the shrink
    3. Budget descends only — never raise it
```

## When to suggest invoking

- After any edit to `Capsule.tsx`
- Before opening a PR touching `packages/composer/`
- As part of `/release-prep`
- When `aether-guardian` agent flags a Capsule change

## Closure

Not closed until verdict is PASS or PASS·improvement. If PASS·improvement, the BUDGET edit in ci.yml is part of closure — not a follow-up PR.

## Anti-patterns

- "We'll lower BUDGET in the next PR" — no, same PR
- Raising BUDGET to accommodate growth — Capsule.tsx is the orchestrator; growth means design is wrong
- Hiding growth in commented-out code — `wc -l` counts those too; this is intentional
