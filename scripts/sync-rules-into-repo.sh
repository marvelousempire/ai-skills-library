#!/usr/bin/env bash
# Generate Cursor + Claude rules from ai-skills-library into another repo's .cursor/rules and .claude/rules.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACK="${PACK:-rules/packs/red-e-play-core.json}"
TARGET="${1:?Usage: $0 /path/to/target-repo}"

python3 "${ROOT}/scripts/generate-agent-rules.py" --pack "${ROOT}/${PACK}" --repo-root "${TARGET}"
echo "Done. Pack: ${PACK} → ${TARGET}"
