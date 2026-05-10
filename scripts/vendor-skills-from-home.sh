#!/usr/bin/env bash
# Refresh vendored skills from this Mac. Run from repo root.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ skills/marketing/  ← ~/.agents/skills/"
rsync -a --delete "${HOME}/.agents/skills/" "${ROOT}/skills/marketing/"

echo "→ skills/cursor/     ← ~/.cursor/skills-cursor/"
rsync -a --delete "${HOME}/.cursor/skills-cursor/" "${ROOT}/skills/cursor/"

echo "→ skills/claude-local/"
rsync -a "${HOME}/.claude/skills/verify-ship/" "${ROOT}/skills/claude-local/verify-ship/"
rsync -a "${HOME}/.claude/skills/generate-weather-plates/" "${ROOT}/skills/claude-local/generate-weather-plates/"

echo "→ skills/ui-ux-pro-max/"
rsync -a "${HOME}/.cursor/skills/.cursor/skills/ui-ux-pro-max/" "${ROOT}/skills/ui-ux-pro-max/"

if [[ -f "${HOME}/Developer/red-e-play-app/.agents/product-marketing-context.md" ]]; then
  echo "→ context/readyplay-product-marketing-context.md"
  cp "${HOME}/Developer/red-e-play-app/.agents/product-marketing-context.md" \
    "${ROOT}/context/readyplay-product-marketing-context.md"
fi

echo "Regenerating SKILL-CATALOG.md files…"
python3 "${ROOT}/scripts/generate-skill-catalogs.py"
echo "Done. SKILL.md count:" "$(find "${ROOT}/skills" -name SKILL.md | wc -l | tr -d ' ')"
