#!/usr/bin/env bash
# Mata todas as branches remotas exceto: main, claude/cleanup-content-QZNCi, claude/cleanup-legacy-ui-6KIAZ
# Requer `gh` autenticado (gh auth login) OU GITHUB_TOKEN com scope repo/delete_repo.
# Uso: bash scripts/kill-branches.sh [--dry-run]

set -u
REPO="Ivan-star-dev/Aiinterfaceshelldesign"
KEEP=(
  "main"
  "claude/cleanup-content-QZNCi"
  "claude/cleanup-legacy-ui-6KIAZ"
)

DRY_RUN=""
[ "${1:-}" = "--dry-run" ] && DRY_RUN="1"

keep_match() {
  local b="$1"
  for k in "${KEEP[@]}"; do [ "$b" = "$k" ] && return 0; done
  return 1
}

mapfile -t ALL < <(gh api "repos/${REPO}/branches" --paginate -q '.[].name')

echo "Encontradas ${#ALL[@]} branches no remote."
echo "Preservando: ${KEEP[*]}"
echo ""

kill_count=0
for b in "${ALL[@]}"; do
  if keep_match "$b"; then
    echo "  KEEP  $b"
    continue
  fi
  if [ -n "$DRY_RUN" ]; then
    echo "  [dry] kill  $b"
  else
    if gh api -X DELETE "repos/${REPO}/git/refs/heads/${b}" --silent 2>/dev/null; then
      echo "  KILL  $b"
      kill_count=$((kill_count+1))
    else
      echo "  FAIL  $b (protegida? permissao?)"
    fi
  fi
done

echo ""
echo "Total deletadas: $kill_count"
