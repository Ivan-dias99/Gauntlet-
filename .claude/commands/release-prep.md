---
description: Pre-tag gate for releases. Runs composer-test + capsule-budget + voice-check + aether-audit + version-align + SECURITY_AUDIT walk. Reports overall verdict.
allowed-tools:
  - Bash(npm run test --workspace=*)
  - Bash(npm run check:voice)
  - Bash(wc -l packages/composer/src/Capsule.tsx)
  - Bash(grep *)
  - Bash(rg *)
  - Bash(jq *)
  - Bash(cat *)
  - Bash(pytest *)
  - Bash(cargo test *)
  - Bash(git status)
  - Bash(git rev-parse *)
  - Bash(npx tsc --noEmit*)
  - Bash(npm run typecheck)
  - Bash(npm run build)
---

# /release-prep

Pre-tag gate. Composes all release checks. Runs each, aggregates results. **A single FAIL blocks the tag.** This is the operational expression of the closure check in `gauntlet-release-discipline` skill.

## Steps

Run all eight gates. Each gate's result is independent — log all, even after first failure (so the operator sees the full state).

### Gate 1 · Main is canon (ADR-0001)

```bash
echo "── GATE 1 · MAIN IS CANON ──"
branch=$(git rev-parse --abbrev-ref HEAD)
local_sha=$(git rev-parse HEAD)
remote_sha=$(git rev-parse origin/main 2>/dev/null || echo "no-remote")
dirty=$(git status --porcelain | wc -l)

echo "branch:      $branch"
echo "local SHA:   $local_sha"
echo "origin/main: $remote_sha"
echo "dirty files: $dirty"

if [ "$branch" != "main" ]; then echo "::FAIL:: not on main"; fi
if [ "$local_sha" != "$remote_sha" ]; then echo "::FAIL:: local out of sync with origin/main"; fi
if [ "$dirty" -gt 0 ]; then echo "::FAIL:: uncommitted changes"; fi
```

### Gate 2 · Version alignment across shells (ADR-0001 dual-shell parity)

```bash
echo "── GATE 2 · VERSION ALIGNMENT ──"
versions=$(jq -r .version \
  package.json \
  packages/composer/package.json \
  apps/browser-extension/package.json \
  apps/desktop/package.json \
  control-center/package.json \
  2>/dev/null | sort -u)

count=$(echo "$versions" | wc -l)
echo "distinct versions found:"
echo "$versions" | sed 's/^/  /'
echo "count: $count"

if [ "$count" -gt 1 ]; then echo "::FAIL:: version drift across shells"; fi
```

### Gate 3 · Capsule budget (skill `gauntlet-design-system`)

```bash
echo "── GATE 3 · CAPSULE BUDGET ──"
current=$(wc -l < packages/composer/src/Capsule.tsx)
budget=$(grep -oE 'BUDGET=[0-9]+' .github/workflows/ci.yml | head -1 | cut -d= -f2)

echo "current: $current"
echo "budget:  $budget"

if [ "$current" -gt "$budget" ]; then echo "::FAIL:: Capsule.tsx over budget"; fi
if [ "$current" -lt "$budget" ]; then echo "::WARN:: Capsule.tsx shrank — lower BUDGET in ci.yml to $current"; fi
```

### Gate 4 · Voice ban-list (ADR-0005)

```bash
echo "── GATE 4 · VOICE BAN-LIST ──"
if ! npm run check:voice; then echo "::FAIL:: voice ban-list violated"; fi
```

### Gate 5 · Aether token integrity (ADR-0005)

```bash
echo "── GATE 5 · AETHER TOKEN INTEGRITY ──"
hex_drift=$(grep -rnE '#[0-9a-fA-F]{3,8}\b' packages/composer/src/ \
  --include='*.tsx' --include='*.ts' \
  | grep -v 'capsule.css.ts' \
  | grep -v -E '/\*.*\*/' \
  | wc -l)
echo "hard-coded hex colors in shared composer: $hex_drift"
if [ "$hex_drift" -gt 0 ]; then echo "::WARN:: token drift — run /aether-audit"; fi
```

### Gate 6 · Backend gateway integrity (ADR-0002)

```bash
echo "── GATE 6 · GATEWAY INTEGRITY ──"
leaks=$(grep -rE "(from anthropic|from groq|from openai|from google\\.generativeai|import anthropic|import groq|import openai)" \
  backend/ --include="*.py" \
  | grep -v -E "(engine|agent|mock_client|groq_provider|gemini_provider)\\.py:" \
  | wc -l)
echo "provider SDK imports outside 5 designated clients: $leaks"
if [ "$leaks" -gt 0 ]; then echo "::FAIL:: ADR-0002 violated"; fi
```

### Gate 7 · Tests pass

```bash
echo "── GATE 7 · TESTS ──"
echo "[7a] typecheck"
npm run typecheck 2>&1 | tail -5
echo "[7b] composer vitest"
npm run test --workspace=@gauntlet/composer 2>&1 | tail -5
echo "[7c] backend pytest (MOCK)"
GAUNTLET_MOCK=1 GAUNTLET_RATE_LIMIT_DISABLED=1 pytest -q backend/ 2>&1 | tail -5
echo "[7d] desktop smoke (Rust)"
(cd apps/desktop/src-tauri && cargo test --tests 2>&1 | tail -5)
```

### Gate 8 · SECURITY_AUDIT walk (mandatory for v1.0.0+)

```bash
echo "── GATE 8 · SECURITY_AUDIT ──"
if [ ! -f docs/SECURITY_AUDIT.md ]; then echo "::FAIL:: docs/SECURITY_AUDIT.md missing"; fi
echo "open items (grep 'Status: OPEN' in audit):"
grep -nE 'Status:\s*OPEN' docs/SECURITY_AUDIT.md || echo "  none"

echo "Tauri updater pubkey check:"
pubkey_present=$(grep -E '"pubkey":\s*"[^"]+"' apps/desktop/src-tauri/tauri.conf.json | wc -l)
if [ "$pubkey_present" -eq 0 ]; then echo "::FAIL:: updater pubkey NOT pinned in tauri.conf.json"; fi
```

## Final aggregate report

```
RELEASE PREP · <commit-sha>

  Gate 1 · main is canon          [PASS | FAIL]
  Gate 2 · version alignment      [PASS | FAIL]
  Gate 3 · capsule budget         [PASS | WARN | FAIL]
  Gate 4 · voice ban-list         [PASS | FAIL]
  Gate 5 · aether tokens          [PASS | WARN]
  Gate 6 · gateway integrity      [PASS | FAIL]
  Gate 7 · tests                  [PASS | FAIL]
  Gate 8 · security audit walk    [PASS | FAIL]

  ─────────────────────────────────────────
  verdict: <READY-TO-TAG | NOT-READY>

  [if NOT-READY]
  blocking items:
    - <gate>: <reason>
    - <gate>: <reason>

  [if READY-TO-TAG]
  next move:
    1. Confirm CHANGELOG.md has entry for this version
    2. git tag vX.Y.Z
    3. git push origin vX.Y.Z
    4. Watch .github/workflows/release.yml run
    5. Verify signed artifacts attached to GitHub Release
    6. Manual smoke on installed signed binary
```

## When to suggest invoking

- Before any `git tag v*` command
- When the user says "tag", "release", "cutover", "ship"
- After resolving an item in `docs/SECURITY_AUDIT.md`
- After bumping versions across shells

## Closure

Not closed until verdict is `READY-TO-TAG`. A single FAIL blocks. A WARN is operator decision but visible. The closure check in `gauntlet-release-discipline` skill (§ Closure check) is the authoritative spec; this command is its operational shape.

## Anti-patterns

- Running gates partially ("just check the budget for now") — release prep is the aggregate
- Tagging while a gate WARNs without explicit operator decision — silence ≠ consent
- Re-running CI on a similar commit ("close enough") — the exact tag SHA must pass
- "We'll fix in patch" without CHANGELOG entry acknowledging it
