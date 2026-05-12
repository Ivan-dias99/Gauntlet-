#!/usr/bin/env bash
# .claude/hooks/pre-commit.sh
#
# Pre-commit hook. Runs the two cheap gates that catch the most
# common regressions before they reach CI:
#   1. Voice ban-list (ADR-0005)
#   2. Capsule LOC budget (skill gauntlet-design-system)
#
# Exit 0 = commit proceeds. Exit non-zero = abort.
#
# Wire-up paths:
#   (a) Claude Code hook system invokes this directly per project setup
#   (b) Standalone git pre-commit:
#       cp .claude/hooks/pre-commit.sh .git/hooks/pre-commit
#       chmod +x .git/hooks/pre-commit
#   (c) Manual invocation:
#       bash .claude/hooks/pre-commit.sh

set -uo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$REPO_ROOT"

FAIL=0
WARN=0

echo "── PRE-COMMIT · $(date '+%H:%M:%S') ──"

# ─── Gate 1 · Voice ban-list ──────────────────────────────────────
if [ -f scripts/check-voice.mjs ] || grep -q '"check:voice"' package.json 2>/dev/null; then
  echo "[1/2] voice ban-list"
  if npm run check:voice --silent 2>&1 | tail -20; then
    echo "      ✓ pass"
  else
    echo "      ✗ FAIL — banned label found. See ADR-0005 for canonical replacements."
    FAIL=1
  fi
else
  echo "[1/2] voice ban-list · skipped (scripts/check-voice.mjs not present)"
fi

# ─── Gate 2 · Capsule LOC budget ──────────────────────────────────
CAPSULE_PATH="packages/composer/src/Capsule.tsx"
CI_PATH=".github/workflows/ci.yml"

if [ -f "$CAPSULE_PATH" ] && [ -f "$CI_PATH" ]; then
  echo "[2/2] capsule budget"
  current=$(wc -l < "$CAPSULE_PATH")
  budget=$(grep -oE 'BUDGET=[0-9]+' "$CI_PATH" | head -1 | cut -d= -f2)

  if [ -z "$budget" ]; then
    echo "      ? BUDGET=N not found in $CI_PATH — skipping"
  else
    echo "      current: $current   budget: $budget"
    if [ "$current" -gt "$budget" ]; then
      echo "      ✗ FAIL — Capsule.tsx ($current) exceeds budget ($budget)."
      echo "        Extract a sub-component or hook in this same commit."
      FAIL=1
    elif [ "$current" -lt "$budget" ]; then
      echo "      ⚠ WARN — Capsule.tsx shrank ($current vs budget $budget)."
      echo "        Lower BUDGET in $CI_PATH to $current in this commit."
      WARN=1
    else
      echo "      ✓ at budget"
    fi
  fi
else
  echo "[2/2] capsule budget · skipped (paths missing)"
fi

# ─── Summary ──────────────────────────────────────────────────────
echo "──"
if [ "$FAIL" -ne 0 ]; then
  echo "PRE-COMMIT BLOCKED — fix the issues above and re-stage."
  echo "Override with: git commit --no-verify   (only when justified)"
  exit 1
fi

if [ "$WARN" -ne 0 ]; then
  echo "PRE-COMMIT WARN — proceeding, but address the warnings before next push."
fi

echo "PRE-COMMIT OK"
exit 0
