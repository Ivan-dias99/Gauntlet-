---
description: Run vitest suite on @gauntlet/composer (shared composer package) and report results.
allowed-tools:
  - Bash(npm run test --workspace=@gauntlet/composer)
  - Bash(npm run test:*)
  - Bash(cat *)
  - Bash(grep *)
---

# /composer-test

Run the vitest suite for `packages/composer/`. Interpret output and report status.

## Steps

1. Run the suite:

```bash
npm run test --workspace=@gauntlet/composer 2>&1 | tee /tmp/composer-test.out
```

2. Parse the result:
   - Count `✓ passed` and `✗ failed`
   - If any failures, extract each failing test name + assertion message
   - Note any timeout, snapshot mismatch, or import error specifically

3. Report in this shape:

```
COMPOSER TEST RESULT
  passed:  <N>
  failed:  <M>
  duration: <X>s

  [if failures]
  failing:
    - <test path> · <assertion>
    - <test path> · <assertion>

  next move:
    - <one strongest direction based on failure pattern>
```

## When to suggest invoking

- After any edit to `packages/composer/src/**/*.tsx` or `*.ts`
- After dependency bumps in `packages/composer/package.json`
- Before opening a PR touching composer code
- As part of `/release-prep`

## Closure

Not closed until `failed: 0`. A test that times out or errors at import is not "passed" — it is a different colour of failed.

## Anti-patterns

- Running `pytest` instead (that's for `backend/`, see `/cowork-tester` invocation)
- Running with `--no-coverage --bail` to make output shorter — the full output is the report
- Reporting "tests run" without distinguishing pass/fail
