#!/usr/bin/env bash
# Symlink skills/external/* into agent skill directories for discovery.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
link_root() {
  local dest="$1"
  mkdir -p "$dest"
  for d in "${ROOT}"/skills/external/*/; do
    [[ -d "$d" ]] || continue
    name="$(basename "$d")"
    ln -sfn "$d" "${dest}/${name}"
    echo "→ ${dest}/${name} → ${d}"
  done
}

echo "# Claude Code"
link_root "${HOME}/.claude/skills"

if [[ "${LINK_EXTERNAL_TO_CURSOR:-1}" == "1" ]]; then
  echo "# Cursor (global ~/.cursor/skills)"
  link_root "${HOME}/.cursor/skills"
fi

echo "Done. Set LINK_EXTERNAL_TO_CURSOR=0 to skip Cursor symlinks. Restart agents if they cache skill lists."
