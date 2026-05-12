#!/usr/bin/env bash
# .claude/hooks/post-edit.sh
#
# Post-edit hook. Emits contextual reminders for edited paths.
# Never blocks (informational only).
#
# Manual: bash .claude/hooks/post-edit.sh packages/composer/src/Capsule.tsx

set -euo pipefail

REPO_ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
cd "$REPO_ROOT"

FILES="${1:-${CLAUDE_TOOL_FILE_PATH:-${CLAUDE_FILE_PATHS:-}}}"
[ -z "$FILES" ] && exit 0

CAPSULE_PATH="packages/composer/src/Capsule.tsx"
CI_PATH=".github/workflows/ci.yml"
CI_CACHE=""
[ -f "$CI_PATH" ] && CI_CACHE=$(<"$CI_PATH")

budget=""
if [ -n "$CI_CACHE" ]; then
  budget=$(printf '%s\n' "$CI_CACHE" | grep -oE 'BUDGET=[0-9]+' | head -1 | cut -d= -f2)
fi

for f in $FILES; do
  case "$f" in
    *"$CAPSULE_PATH")
      [ -f "$f" ] || continue
      [ -n "$budget" ] || continue
      current=$(wc -l < "$f")
      if [ "$current" -gt "$budget" ]; then
        echo "::POST-EDIT WARN:: $f is now $current lines · budget is $budget" >&2
        echo "  Extract a sub-component or hook before commit." >&2
      elif [ "$current" -lt "$budget" ]; then
        echo "::POST-EDIT INFO:: $f shrank to $current (budget $budget)." >&2
        echo "  Lower BUDGET in $CI_PATH to $current in this same commit." >&2
      fi
      ;;
    *packages/composer/src/capsule.css.ts)
      if [ -f "$CAPSULE_PATH" ]; then
        current=$(wc -l < "$CAPSULE_PATH")
        echo "::POST-EDIT INFO:: capsule.css.ts touched · Capsule.tsx is currently $current lines." >&2
      fi
      ;;
    backend/test_*.py) ;;
    backend/*.py)
      [ -n "$CI_CACHE" ] || continue
      base=$(basename "$f" .py)
      if ! printf '%s\n' "$CI_CACHE" | grep -qE "\b${base}\b"; then
        echo "::POST-EDIT INFO:: $f may be new — check $CI_PATH 'mods' tuple." >&2
        echo "  New backend modules must be added there or syntax errors slip through." >&2
      fi
      ;;
    *tauri.conf.json)
      if [ -f "$f" ] && ! grep -qE '"pubkey":\s*"[^"]+"' "$f"; then
        echo "::POST-EDIT REMINDER:: $f · updater pubkey not pinned (release blocker)." >&2
      fi
      ;;
    docs/adr/*.md)
      echo "::POST-EDIT INFO:: $f · ADR touched · verify docs/ARCHITECTURE.md cross-references still align." >&2
      ;;
  esac
done

exit 0
