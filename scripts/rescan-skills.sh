#!/usr/bin/env bash
# List every SKILL.md under known roots (edit roots if you add tools).
set -euo pipefail
ROOTS=(
  "${HOME}/.agents/skills"
  "${HOME}/.cursor/skills"
  "${HOME}/.cursor/skills-cursor"
  "${HOME}/.claude/skills"
)
echo "# Rescan $(date -Iseconds)"
for r in "${ROOTS[@]}"; do
  [[ -d "$r" ]] || continue
  echo ""
  echo "## $r"
  find "$r" -name SKILL.md 2>/dev/null | sort | while read -r f; do
    echo "$f"
  done
done
echo ""
echo "Total SKILL.md:" "$(find "${ROOTS[@]}" -name SKILL.md 2>/dev/null | wc -l | tr -d ' ')"
