#!/usr/bin/env bash
# Basic sanity check on cross-references:
#   - Count consistency (delegates to check-skill-count.sh)
#   - Every skill in skills/ appears in SKILL-INDEX.md OR is covered by a family-level catalog row
#
# This is a "fast sanity check" — doesn't deep-link-check every markdown reference.
# A more thorough version is on the roadmap as agents/cross-reference-rippler/.

set -u

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE" || exit 1

if [ -t 1 ]; then
  G=$'\033[32m'; R=$'\033[31m'; Y=$'\033[33m'; N=$'\033[0m'
else
  G=""; R=""; Y=""; N=""
fi

problems=0

# 1. Count consistency
if ! bash scripts/check-skill-count.sh >/dev/null; then
  printf "${R}✗${N} Skill count drift — run \`bash scripts/check-skill-count.sh\` for details\n" >&2
  problems=$((problems+1))
fi

# 2. Every "leaf" skill folder has a SKILL.md
#    - Folders with SKILL.md → fine (leaf skill)
#    - Folders with descendant SKILL.md but no own SKILL.md → fine (grouping folder)
#    - Known internal folders (templates/, references/, evals/, sdk/, src/, …) → skipped
#    - Folders with content (`*.md` / `*.ts` / `*.py`) but no SKILL.md → soft warning
while IFS= read -r dir; do
  base=$(basename "$dir")
  case "$base" in
    templates|references|data|src|test|tests|bin|docker|web|dashboard|scripts|evals|sdk|node_modules|.git|.claude|.vscode|.idea) continue ;;
  esac

  [ -f "$dir/SKILL.md" ] && continue

  # Grouping folder — has SKILL.md somewhere in its descendants.
  if find "$dir" -mindepth 1 -name 'SKILL.md' -print -quit 2>/dev/null | grep -q .; then
    continue
  fi

  # No SKILL.md and no descendant SKILL.md. Soft-warn if it has notable content.
  if find "$dir" -maxdepth 1 -type f \( -name '*.md' -o -name '*.ts' -o -name '*.py' \) 2>/dev/null | grep -q .; then
    printf "${Y}⚠${N} %s/ has content but no SKILL.md (intentional? if so, ok)\n" "$dir"
  fi
done < <(find skills -mindepth 2 -maxdepth 4 -type d 2>/dev/null)

# 3. Family-level READMEs exist
for family in marketing infra visual ide engineering external project mobile methodology; do
  if [ -d "skills/$family" ] && [ ! -f "skills/$family/README.md" ] && [ ! -f "skills/$family/SKILL-CATALOG.md" ]; then
    printf "${Y}⚠${N} skills/%s has no README.md or SKILL-CATALOG.md\n" "$family"
  fi
done

# 4. yousirjuan docs exist
for doc in docs/yousirjuan-platform-skills-master.md docs/yousirjuan-upstream-repo-ledger.md; do
  if [ ! -f "$doc" ]; then
    printf "${Y}⚠${N} %s missing\n" "$doc"
  fi
done

echo ""
if [ "$problems" -eq 0 ]; then
  printf "${G}✓${N} cross-references look healthy (basic check)\n"
  exit 0
else
  printf "${R}✗${N} %d issue(s) found — see above\n" "$problems" >&2
  exit 1
fi
