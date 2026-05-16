#!/usr/bin/env bash
# .claude/hooks/pre-tool-use.sh
#
# Rejects destructive Bash patterns before Claude Code runs them.
# Exit 0 = allow. Exit non-zero = block.
#
# Manual smoke:  bash .claude/hooks/pre-tool-use.sh "rm -rf /"
#
# Belt-and-braces in addition to settings.json denylist. settings.json
# matches by command name; this catches compound commands, pipe chains,
# and shell-built patterns the matcher cannot express.

set -euo pipefail

CMD=""
if [ -n "${1:-}" ]; then
  CMD="$1"
elif [ -n "${CLAUDE_TOOL_INPUT:-}" ]; then
  CMD="$CLAUDE_TOOL_INPUT"
elif [ ! -t 0 ]; then
  CMD=$(cat)
fi

[ -z "$CMD" ] && exit 0

# Fast-exit: cheap glob test skips the regex pass for safe commands.
# Anything that could plausibly contain a destructive token continues.
case "$CMD" in
  *rm*|*sudo*|*git\ push*|*git\ reset*|*git\ branch*|*git\ filter-branch*|\
  *git\ clean*|*chmod*|*chown*|*dd\ *|*dd*if=*|*mkfs*|*fdisk*|*curl*|*wget*|\
  *publish*|*twine*|*docker*|*gh\ repo\ delete*|*gh\ release\ delete*|\
  *DROP*|*drop*|*TRUNCATE*|*truncate*|*\>*|*PRIVATE\ KEY*|*id_rsa*|*id_ed25519*)
    ;;
  *) exit 0 ;;
esac

block() {
  {
    echo "::BLOCKED::"
    echo "reason:  $1"
    echo "command: $CMD"
    echo ""
    echo "If you genuinely need to do this, run it manually outside Claude Code."
    echo "If this is a false positive, edit .claude/hooks/pre-tool-use.sh."
  } >&2
  exit 1
}

# Recursive deletes — allow scoped paths (build artifacts, /tmp), block the rest.
if [[ "$CMD" =~ (^|[[:space:]])rm[[:space:]]+-[rfRFv]*[rR][rfRFv]*[fF][rfRFv]*[[:space:]] ]]; then
  if [[ "$CMD" =~ (^|[[:space:]])rm[[:space:]]+-[rRfF]+[[:space:]]+(node_modules|dist|\.next|target|build|\.venv|\.tox|\.pytest_cache|coverage|/tmp/[a-zA-Z0-9_.\-]+)([[:space:]]|$) ]]; then
    :
  else
    block "recursive delete (rm -rf) outside allowlist of build/cache paths"
  fi
fi
[[ "$CMD" =~ (^|[[:space:]])rm[[:space:]]+(-[a-zA-Z]*[[:space:]]+)?(/$|/\*|~/?[[:space:]]|~/?$) ]] && \
  block "delete targets root or home directly"

[[ "$CMD" =~ (^|[[:space:]])git[[:space:]]+push[[:space:]]+(--force|-f|--force-with-lease) ]] && \
  block "git push --force / --force-with-lease — main is canon, never force-pushed"

[[ "$CMD" =~ (^|[[:space:]])git[[:space:]]+reset[[:space:]]+--hard[[:space:]]+(origin/|upstream/) ]] && \
  block "git reset --hard against remote — destructive in shared branches"

[[ "$CMD" =~ (curl|wget)[[:space:]].*\|[[:space:]]*(sh|bash|zsh)($|[[:space:]]) ]] && \
  block "piping remote download to shell (curl ... | bash) — explicit malware vector"

[[ "$CMD" =~ (^|[[:space:]])chmod[[:space:]]+(-R[[:space:]]+)?[0-9]*7{2,}[0-9]* ]] && \
  block "chmod 777 (or wider) — over-permissive; use minimum required perms"

shopt -s nocasematch
if [[ "$CMD" =~ (DROP[[:space:]]+(TABLE|DATABASE|SCHEMA)|TRUNCATE[[:space:]]+TABLE) ]]; then
  shopt -u nocasematch
  block "destructive SQL (DROP/TRUNCATE) — confirm via Supabase MCP / explicit migration"
fi
shopt -u nocasematch

[[ "$CMD" =~ \>[[:space:]]*\.?\.env(\.local|\.production)?([[:space:]]|$) ]] && \
  block "writing to .env / .env.local / .env.production — env secrets stay out of code generation"

shopt -s nocasematch
if [[ "$CMD" =~ (\>[[:space:]]*[^[:space:]]*PRIVATE[[:space:]]*KEY|\>[[:space:]]*[^[:space:]]*\.pem|\>[[:space:]]*[^[:space:]]*id_rsa|\>[[:space:]]*[^[:space:]]*id_ed25519) ]]; then
  shopt -u nocasematch
  block "writing to private key file — secrets stay in GitHub Secrets / GPG / OS keychain"
fi
shopt -u nocasematch

[[ "$CMD" =~ ^[[:space:]]*sudo($|[[:space:]]) ]] && \
  block "sudo not allowed inside Claude Code session"

[[ "$CMD" =~ (^|[[:space:]])(npm|yarn|pnpm)[[:space:]]+publish($|[[:space:]]) ]] && \
  block "npm/yarn publish — releases happen via .github/workflows/release.yml"

[[ "$CMD" =~ (^|[[:space:]])cargo[[:space:]]+publish($|[[:space:]]) ]] && \
  block "cargo publish — Gauntlet desktop is not a published crate"

[[ "$CMD" =~ (^|[[:space:]])rm[[:space:]]+(-[rRfF]+[[:space:]]+)?\.git($|[[:space:]]) ]] && \
  block "deleting .git directory — repo integrity"

[[ "$CMD" =~ (^|[[:space:]])git[[:space:]]+branch[[:space:]]+(-D|--delete[[:space:]]+--force)[[:space:]]+(main|master)($|[[:space:]]) ]] && \
  block "force-deleting main branch — main is canon"

[[ "$CMD" =~ (^|[[:space:]])(dd|mkfs(\.[a-z0-9]+)?)($|[[:space:]]) ]] && \
  block "low-level disk operation (dd / mkfs)"

exit 0
