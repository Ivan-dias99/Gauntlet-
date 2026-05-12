#!/usr/bin/env bash
# .claude/hooks/post-edit.sh
#
# Post-edit hook for Claude Code. Reads the edited file path
# (from $CLAUDE_TOOL_FILE_PATH, $CLAUDE_FILE_PATHS, or $1) and
# emits contextual reminders. Never blocks (this is informational).
#
# Wire-up: Claude Code 2026 invokes after Edit tool calls. Manual:
#   bash .claude/hooks/post-edit.sh packages/composer/src/Capsule.tsx

set -uo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$REPO_ROOT"

# Resolve edited path(s)
FILES=""
if [ -n "${1:-}" ]; then
  FILES="$1"
elif [ -n "${CLAUDE_TOOL_FILE_PATH:-}" ]; then
  FILES="$CLAUDE_TOOL_FILE_PATH"
elif [ -n "${CLAUDE_FILE_PATHS:-}" ]; then
  FILES="$CLAUDE_FILE_PATHS"
fi

[ -z "$FILES" ] && exit 0

# Iterate (FILES may be a space- or newline-separated list)
for f in $FILES; do

  # ─── Capsule.tsx · re-check budget ────────────────────────────────
  if [[ "$f" == *"packages/composer/src/Capsule.tsx" ]] && [ -f "$f" ]; then
    current=$(wc -l < "$f")
    budget=$(grep -oE 'BUDGET=[0-9]+' .github/workflows/ci.yml 2>/dev/null | head -1 | cut -d= -f2)
    if [ -n "$budget" ]; then
      if [ "$current" -gt "$budget" ]; then
        echo "::POST-EDIT WARN:: $f is now $current lines · budget is $budget" >&2
        echo "  Extract a sub-component or hook before commit." >&2
      elif [ "$current" -lt "$budget" ]; then
        echo "::POST-EDIT INFO:: $f shrank to $current (budget $budget)." >&2
        echo "  Lower BUDGET in .github/workflows/ci.yml to $current in this same commit." >&2
      fi
    fi
  fi

  # ─── capsule.css.ts edit · remind to re-check Capsule.tsx ─────────
  if [[ "$f" == *"packages/composer/src/capsule.css.ts" ]]; then
    if [ -f packages/composer/src/Capsule.tsx ]; then
      current=$(wc -l < packages/composer/src/Capsule.tsx)
      echo "::POST-EDIT INFO:: capsule.css.ts touched · Capsule.tsx is currently $current lines." >&2
    fi
  fi

  # ─── Backend module · remind about CI module list ─────────────────
  if [[ "$f" == backend/*.py ]] && [[ "$f" != backend/test_*.py ]]; then
    base=$(basename "$f" .py)
    if ! grep -qE "\b${base}\b" .github/workflows/ci.yml 2>/dev/null; then
      echo "::POST-EDIT INFO:: $f may be new — check .github/workflows/ci.yml 'mods' tuple." >&2
      echo "  New backend modules must be added there or syntax errors slip through." >&2
    fi
  fi

  # ─── tauri.conf.json edit · remind about updater pubkey ───────────
  if [[ "$f" == *"tauri.conf.json" ]]; then
    if ! grep -qE '"pubkey":\s*"[^"]+"' "$f" 2>/dev/null; then
      echo "::POST-EDIT REMINDER:: $f · updater pubkey not pinned." >&2
      echo "  This is the current blocker for v1.0.0 release (see ADR-0006, skill gauntlet-tauri-shell)." >&2
    fi
  fi

  # ─── ADR file edited · remind to update ARCHITECTURE.md cross-ref ─
  if [[ "$f" == docs/adr/*.md ]]; then
    echo "::POST-EDIT INFO:: $f · ADR touched · verify docs/ARCHITECTURE.md cross-references still align." >&2
  fi

done

exit 0
