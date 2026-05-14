#!/usr/bin/env bash
# Verify SKILL count consistency across:
#   - actual: find skills -name SKILL.md | wc -l
#   - SKILL-INDEX.md: "**N** total `SKILL.md` files"
#   - README.md: "N SKILL.md files under skills/"
#
# Exit 0 if all three agree, 1 otherwise.
# See docs/standards/verification-gates.md (Gate 1).

set -u

# Find repo root (this script can be run from anywhere)
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE" || exit 1

# Colors
if [ -t 1 ]; then
  G=$'\033[32m'; R=$'\033[31m'; N=$'\033[0m'
else
  G=""; R=""; N=""
fi

actual=$(find skills -name SKILL.md 2>/dev/null | wc -l | tr -d ' ')
indexed=$(grep -oE '\*\*[0-9]+\*\* total' SKILL-INDEX.md 2>/dev/null | head -1 | grep -oE '[0-9]+')
readme=$(grep -oE '[0-9]+ SKILL.md' README.md 2>/dev/null | head -1 | grep -oE '[0-9]+')

if [ -z "$indexed" ]; then
  printf "${R}✗${N} SKILL-INDEX.md missing the '**N** total' line\n" >&2
  exit 1
fi

if [ -z "$readme" ]; then
  printf "${R}✗${N} README.md missing the 'N SKILL.md files' line\n" >&2
  exit 1
fi

if [ "$actual" = "$indexed" ] && [ "$actual" = "$readme" ]; then
  printf "${G}✓${N} all three agree (actual: %s · SKILL-INDEX: %s · README: %s)\n" \
    "$actual" "$indexed" "$readme"
  exit 0
else
  printf "${R}✗${N} count mismatch: actual=%s · SKILL-INDEX=%s · README=%s\n" \
    "$actual" "$indexed" "$readme" >&2
  printf "\nFix:\n"
  printf "  1. Determine the correct count: %s (actual)\n" "$actual"
  printf "  2. Update SKILL-INDEX.md: change %s → %s in the '**N** total' line\n" \
    "$indexed" "$actual"
  printf "  3. Update README.md: change %s → %s in the 'N SKILL.md files' line\n" \
    "$readme" "$actual"
  exit 1
fi
