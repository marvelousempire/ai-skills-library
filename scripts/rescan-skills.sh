#!/usr/bin/env bash
# List every SKILL.md under known roots; dedupe by canonical path (symlinks).
set -euo pipefail
ROOTS=(
  "${HOME}/.agents/skills"
  "${HOME}/.cursor/skills"
  "${HOME}/.cursor/skills-cursor"
  "${HOME}/.claude/skills"
)
echo "# Rescan $(date -Iseconds)"
tmp=$(mktemp)
for r in "${ROOTS[@]}"; do
  [[ -d "$r" ]] || continue
  find "$r" -name SKILL.md 2>/dev/null | while read -r f; do
    real=$(python3 -c "import os; print(os.path.realpath('$f'))" 2>/dev/null || echo "$f")
    echo "$real"
  done
done | sort -u > "$tmp"
echo ""
echo "## Unique SKILL.md ($(wc -l < "$tmp" | tr -d ' ') files)"
cat "$tmp"
rm -f "$tmp"
