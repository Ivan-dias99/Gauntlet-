#!/usr/bin/env bash
# .claude/hooks/pre-tool-use.sh
#
# Pre-tool-use hook for Claude Code. Reads the proposed command (from
# stdin or $CLAUDE_TOOL_INPUT depending on Claude Code version) and
# rejects destructive patterns. Exit 0 = allow. Exit non-zero = block.
#
# This hook is also safe to invoke manually with the command as $1:
#   bash .claude/hooks/pre-tool-use.sh "rm -rf /"
#
# Belt-and-braces in addition to .claude/settings.json denylist.
# settings.json is the primary gate; this script catches patterns the
# pattern-matcher cannot express (compound commands, encoded payloads).

set -uo pipefail

# Resolve the command being evaluated
CMD=""
if [ -n "${1:-}" ]; then
  CMD="$1"
elif [ -n "${CLAUDE_TOOL_INPUT:-}" ]; then
  CMD="$CLAUDE_TOOL_INPUT"
else
  # Read from stdin if neither provided
  if [ -t 0 ]; then
    CMD=""
  else
    CMD=$(cat)
  fi
fi

# Empty command — allow (nothing to evaluate)
if [ -z "$CMD" ]; then
  exit 0
fi

# Helper to emit a structured block reason and exit
block() {
  echo "::BLOCKED::" >&2
  echo "reason:  $1" >&2
  echo "command: $CMD" >&2
  echo "" >&2
  echo "If you genuinely need to do this, run it manually outside Claude Code." >&2
  echo "If this is a false positive, edit .claude/hooks/pre-tool-use.sh." >&2
  exit 1
}

# ─── Pattern 1 · Recursive deletes ────────────────────────────────
# rm -rf *, rm -rf /, rm -fr, rm -r at root or system paths
if echo "$CMD" | grep -qE '\brm\s+-[rfRFv]*[rR][rfRFv]*[fF][rfRFv]*\s'; then
  # Allow rm -rf inside well-scoped paths (node_modules, dist, .next, target, build, .venv, /tmp)
  if echo "$CMD" | grep -qE '\brm\s+-[rRfF]+\s+(node_modules|dist|\.next|target|build|\.venv|\.tox|\.pytest_cache|coverage|/tmp/[a-zA-Z0-9_.\-]+)\b'; then
    : # allowed scoped recursive delete
  else
    block "recursive delete (rm -rf) outside allowlist of build/cache paths"
  fi
fi
if echo "$CMD" | grep -qE '\brm\s+(-[a-zA-Z]*\s+)?(/$|/\*|~/?\s|~/?$)'; then
  block "delete targets root or home directly"
fi

# ─── Pattern 2 · Force push ───────────────────────────────────────
if echo "$CMD" | grep -qE '\bgit\s+push\s+(--force|-f|--force-with-lease)\b'; then
  block "git push with --force / --force-with-lease — main is canon, never force-pushed"
fi

# ─── Pattern 3 · Hard reset across remotes ────────────────────────
if echo "$CMD" | grep -qE '\bgit\s+reset\s+--hard\s+(origin/|upstream/)'; then
  block "git reset --hard against remote — destructive in shared branches"
fi

# ─── Pattern 4 · Curl|bash and wget|bash ──────────────────────────
if echo "$CMD" | grep -qE '\b(curl|wget)\b.*\|\s*(sh|bash|zsh)\b'; then
  block "piping remote download to shell (curl ... | bash) — explicit malware vector"
fi

# ─── Pattern 5 · chmod 777 anywhere ───────────────────────────────
if echo "$CMD" | grep -qE '\bchmod\s+(-R\s+)?[0-9]*7{2,}[0-9]*\b'; then
  block "chmod 777 (or wider) — over-permissive; use minimum required perms"
fi

# ─── Pattern 6 · SQL DROP / TRUNCATE in any command ───────────────
if echo "$CMD" | grep -qiE '\b(DROP\s+(TABLE|DATABASE|SCHEMA)|TRUNCATE\s+TABLE)\b'; then
  block "destructive SQL (DROP/TRUNCATE) — confirm via Supabase MCP / explicit migration"
fi

# ─── Pattern 7 · Writes to .env or PRIVATE KEY files ──────────────
if echo "$CMD" | grep -qE '>\s*\.?\.env(\.local|\.production)?(\s|$)'; then
  block "writing to .env / .env.local / .env.production — env secrets stay out of code generation"
fi
if echo "$CMD" | grep -qiE '(>\s*\S*PRIVATE\s*KEY|>\s*\S*\.pem|>\s*\S*id_rsa|>\s*\S*id_ed25519)'; then
  block "writing to private key file — secrets stay in GitHub Secrets / GPG / OS keychain"
fi

# ─── Pattern 8 · sudo escalation ──────────────────────────────────
if echo "$CMD" | grep -qE '^\s*sudo\b'; then
  block "sudo not allowed inside Claude Code session"
fi

# ─── Pattern 9 · npm/yarn/cargo publish ───────────────────────────
if echo "$CMD" | grep -qE '\b(npm|yarn|pnpm)\s+publish\b'; then
  block "npm/yarn publish — releases happen via .github/workflows/release.yml"
fi
if echo "$CMD" | grep -qE '\bcargo\s+publish\b'; then
  block "cargo publish — Gauntlet desktop is not a published crate"
fi

# ─── Pattern 10 · Deleting .git ───────────────────────────────────
if echo "$CMD" | grep -qE '\brm\s+(-[rRfF]+\s+)?\.git\b'; then
  block "deleting .git directory — repo integrity"
fi

# ─── Pattern 11 · Branch -D against main/master ───────────────────
if echo "$CMD" | grep -qE '\bgit\s+branch\s+(-D|--delete\s+--force)\s+(main|master)\b'; then
  block "force-deleting main branch — main is canon"
fi

# ─── Pattern 12 · dd / mkfs ────────────────────────────────────────
if echo "$CMD" | grep -qE '\b(dd|mkfs(\.[a-z0-9]+)?)\b'; then
  block "low-level disk operation (dd / mkfs)"
fi

# Allowed
exit 0
