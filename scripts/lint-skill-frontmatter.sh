#!/usr/bin/env bash
# Validate frontmatter on every SKILL.md per docs/standards/frontmatter.md:
#   - frontmatter present (--- ... ---)
#   - name: <slug> where slug matches the folder
#   - description: includes "Triggers on" or "Use when"
#
# Optional first arg: path prefix to limit scope (e.g. skills/methodology/).
#
# Exit 0 if all green, 1 if any SKILL.md fails.

set -u

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE" || exit 1

if [ -t 1 ]; then
  G=$'\033[32m'; R=$'\033[31m'; Y=$'\033[33m'; N=$'\033[0m'
else
  G=""; R=""; Y=""; N=""
fi

SCOPE="${1:-skills/}"

fail=0
total=0

while IFS= read -r path; do
  total=$((total+1))
  folder=$(dirname "$path")
  slug=$(basename "$folder")

  # Check frontmatter exists (first non-empty line is ---)
  if ! head -1 "$path" | grep -q '^---$'; then
    printf "${R}✗${N} %s — no frontmatter (first line should be \`---\`)\n" "$path" >&2
    fail=$((fail+1))
    continue
  fi

  # Extract frontmatter block
  fm=$(awk '/^---$/{c++; if (c==1) next; if (c==2) exit} c==1' "$path")

  # Check name matches folder
  name=$(echo "$fm" | grep -oE '^name: *[a-zA-Z0-9_-]+' | head -1 | awk '{print $2}')
  if [ -z "$name" ]; then
    printf "${R}✗${N} %s — frontmatter missing \`name:\`\n" "$path" >&2
    fail=$((fail+1))
    continue
  fi
  if [ "$name" != "$slug" ]; then
    printf "${R}✗${N} %s — name '%s' does not match folder '%s'\n" "$path" "$name" "$slug" >&2
    fail=$((fail+1))
    continue
  fi

  # Check description contains trigger phrasing
  desc=$(echo "$fm" | grep -oE '^description:.*' | head -1)
  if [ -z "$desc" ]; then
    printf "${R}✗${N} %s — frontmatter missing \`description:\`\n" "$path" >&2
    fail=$((fail+1))
    continue
  fi
  if ! echo "$desc" | grep -qiE 'triggers? on|use when'; then
    printf "${Y}⚠${N} %s — description missing 'Triggers on' or 'Use when' (soft warning)\n" "$path"
  fi
done < <(find "$SCOPE" -name SKILL.md 2>/dev/null)

echo ""
if [ "$fail" -eq 0 ]; then
  printf "${G}✓${N} %d SKILL.md file(s) checked, all frontmatter valid\n" "$total"
  exit 0
else
  printf "${R}✗${N} %d/%d failed\n" "$fail" "$total" >&2
  exit 1
fi
