#!/usr/bin/env bash
# Watch skills/ + agents/ and run validate (+ optional publish push) on change.
#
# Usage (from ai-skills-library repo root):
#   ./scripts/watch-skills.sh              # validate only
#   ./scripts/watch-skills.sh --push       # validate + push-all-remotes (if clean commit exists)
#
# Requires: fswatch (brew install fswatch)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PUSH=0
for arg in "$@"; do
  case "$arg" in
    --push) PUSH=1 ;;
    -h|--help)
      grep '^#' "$0" | head -15
      exit 0
      ;;
  esac
done

if ! command -v fswatch >/dev/null 2>&1; then
  echo "error: fswatch not found. Install: brew install fswatch" >&2
  exit 1
fi

run_validate() {
  echo "── $(date -u '+%Y-%m-%dT%H:%M:%SZ') validate"
  python3 "${ROOT}/scripts/validate-skill-frontmatter.py"
}

run_push() {
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "── skip push (uncommitted changes)"
    return 0
  fi
  "${ROOT}/scripts/push-all-remotes.sh"
}

debounce() {
  local last=0 now
  while read -r _; do
    now=$(date +%s)
    if (( now - last < 2 )); then
      continue
    fi
    last=$now
    run_validate || true
    if [[ "$PUSH" -eq 1 ]]; then
      run_push || true
    fi
  done
}

echo "# watching ${ROOT}/skills ${ROOT}/agents (Ctrl+C to stop)"
run_validate
fswatch -o "${ROOT}/skills" "${ROOT}/agents" | debounce
