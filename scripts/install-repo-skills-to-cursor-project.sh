#!/usr/bin/env bash
# Symlink this repo's vendored skills into a project's .cursor/skills/ (flat layout).
# Cursor resolves project skills as: <project>/.cursor/skills/<skill-id>/SKILL.md
#
# Usage (from this repo root):
#   ./scripts/install-repo-skills-to-cursor-project.sh [TARGET_DIR]
# Default TARGET_DIR is the current working directory.
#
# Packs merged (order matters for collision messages): marketing → ide/cursor →
# ui-ux-pro-max → red-e-play project skills → external (generated bridges).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="$(cd "${1:-$PWD}" && pwd)"
SKILL_ROOT="${TARGET}/.cursor/skills"

die() {
  echo "error: $*" >&2
  exit 1
}

link_one() {
  local abs_src="$1"
  local pack="$2"
  local name dest
  [[ -f "${abs_src}/SKILL.md" ]] || return 0
  name="$(basename "$abs_src")"
  dest="${SKILL_ROOT}/${name}"

  if [[ -L "$dest" ]]; then
    local cur
    cur="$(readlink -f "$dest" 2>/dev/null || true)"
    if [[ "$cur" == "$abs_src" ]]; then
      echo "  ok (already linked) ${pack}/${name}"
      return 0
    fi
    die "skill name collision: '${name}' already linked from elsewhere
  existing: ${dest} -> $(readlink "$dest" 2>/dev/null || echo '?')
  wanted:   ${abs_src} (${pack})"
  fi

  if [[ -e "$dest" ]]; then
    die "refusing to overwrite non-symlink: ${dest} (wanted ${pack}/${name})"
  fi

  ln -sfn "$abs_src" "$dest"
  echo "  → ${name}  (${pack})"
}

echo "# Install repo skills → ${SKILL_ROOT}"
mkdir -p "$SKILL_ROOT"

# Multi-skill packs: every immediate child dir containing SKILL.md
for pack_rel in skills/marketing "skills/ide/cursor" skills/external "skills/project/red-e-play"; do
  pack_dir="${ROOT}/${pack_rel}"
  [[ -d "$pack_dir" ]] || continue
  label="${pack_rel#skills/}"
  echo "— ${label}/"
  for d in "${pack_dir}"/*/; do
    [[ -d "$d" ]] || continue
    link_one "$(cd "$d" && pwd)" "$label"
  done
done

# Single-folder skill (not a sibling pack of many skills)
UI="${ROOT}/skills/visual/design/ui-ux-pro-max"
if [[ -f "${UI}/SKILL.md" ]]; then
  echo "— visual/design/ui-ux-pro-max/"
  link_one "$(cd "$UI" && pwd)" "visual/design/ui-ux-pro-max"
fi

echo "Done. Open ${TARGET} in Cursor; agents load skills from .cursor/skills/."
echo "Product context: symlink context/readyplay-product-marketing-context.md per docs/marketingskills.md if needed."
