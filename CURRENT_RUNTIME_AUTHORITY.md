# CURRENT RUNTIME AUTHORITY

This file exists to stop narrative drift.

## Active Runtime

The mounted Ruberra runtime is:

- `src/main.tsx`
- `src/ruberra/RuberraApp.tsx`
- `src/ruberra/`

## Sovereign Website Source

The only sovereign website source is the merged `main` branch.

That means:

- Vercel production from `main` is authoritative
- preview deployments are staging only
- open pull requests are not runtime authority
- unmerged branches are workshop lines, not product truth

## Legacy Quarantine

`src/app/` is not runtime authority.
It is legacy quarantine.

## Priority Order

When documents disagree, trust this order:

1. merged `main`
2. current mounted runtime
3. `ops/CANONICAL_TRUTH.md`
4. `ops/GENESIS_CORE.md`
5. `RUBERRA_MOTHER_BLUEPRINT.md`

Any older document, preview, or open PR that contradicts this order must be realigned, archived, or ignored.
