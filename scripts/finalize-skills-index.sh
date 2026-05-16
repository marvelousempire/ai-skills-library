#!/bin/bash
# finalize-skills-index.sh
# ─────────────────────────────────────────────────────────────────────────────
# Maintenance script for the ai-skills-library repo.
# Scans skills/ for canonical uppercase SKILL.md files and syncs the top-level
# count in SKILL-INDEX.md. This matches the pre-push hook.
#
# Idempotent — safe to run multiple times.
# Self-testing — prints exactly what changed.
# Run from the repo root: ./scripts/finalize-skills-index.sh
#
# Usage:
#   ./scripts/finalize-skills-index.sh           # apply updates
#   ./scripts/finalize-skills-index.sh --check   # verify only, no edits
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INDEX="${REPO_ROOT}/SKILL-INDEX.md"

bold()  { printf '\033[1m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
red()   { printf '\033[31m%s\033[0m\n' "$*" >&2; }
dim()   { printf '\033[2m%s\033[0m\n' "$*"; }

if [ ! -f "$INDEX" ]; then
  red "✗ SKILL-INDEX.md not found at: $INDEX"
  exit 1
fi

CHECK_ONLY=0
if [ "${1:-}" = "--check" ]; then CHECK_ONLY=1; fi

bold "→ ai-skills-library: finalizing SKILL-INDEX.md"
echo ""

# ── Auto-detect canonical skills ──────────────────────────────────────────
total_skill_count=$(find "$REPO_ROOT/skills" -name 'SKILL.md' 2>/dev/null | wc -l | tr -d ' ')

# Check current count line
count_current=$(grep -oE '^- \*\*[0-9]+\*\* total' "$INDEX" | grep -oE '[0-9]+' || echo "0")
count_correct=0
if [ "$count_current" = "$total_skill_count" ]; then count_correct=1; fi

dim "  Repo root:         $REPO_ROOT"
dim "  Index:             $INDEX"
dim "  Skills on disk:    $total_skill_count"
dim "  Index count shows: $count_current"
if [ $count_correct -eq 1 ]; then
  green "  ✓ Count already $total_skill_count"
else
  echo "  • Count needs updating: $count_current → $total_skill_count"
fi
echo ""

if [ $count_correct -eq 1 ]; then
  green "Nothing to do. SKILL-INDEX is up to date."
  exit 0
fi

if [ $CHECK_ONLY -eq 1 ]; then
  red "Check mode: changes ARE needed but --check was passed"
  exit 2
fi

# Backup
BACKUP="${INDEX}.bak.$(date +%s)"
cp "$INDEX" "$BACKUP"
dim "  Backup: $BACKUP"

# Update count
if [ $count_correct -eq 0 ]; then
  sed -i.tmp -E "s|^- \*\*[0-9]+\*\* total|- **${total_skill_count}** total|" "$INDEX"
  rm -f "${INDEX}.tmp"
  green "  ✓ Count updated to $total_skill_count"
fi

# Validate
echo ""
bold "→ Validating…"
if [ -x "$REPO_ROOT/scripts/validate-skill-frontmatter.py" ]; then
  (cd "$REPO_ROOT" && python3 scripts/validate-skill-frontmatter.py)
  green "  ✓ Validator passes"
fi

rm -f "$BACKUP"
echo ""
green "✓ SKILL-INDEX.md updated and validated."
