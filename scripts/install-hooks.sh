#!/bin/bash
# install-hooks.sh — wire the pre-push hook into this repo's .git/hooks/
# Run once after cloning: ./scripts/install-hooks.sh

set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cat > "$REPO/.git/hooks/pre-push" << 'HOOK'
#!/bin/bash
# Pre-push hook — keeps SKILL-INDEX.md count in sync before every push
set -euo pipefail
REPO="$(git rev-parse --show-toplevel)"
COUNT=$(find "$REPO/skills" -name SKILL.md 2>/dev/null | wc -l | tr -d ' ')
INDEX_COUNT=$(grep -oE '^- \*\*[0-9]+\*\* total' "$REPO/SKILL-INDEX.md" 2>/dev/null | grep -oE '[0-9]+' || echo "0")
if [ "$COUNT" != "$INDEX_COUNT" ]; then
  echo "⚠  SKILL count mismatch: $COUNT on disk vs $INDEX_COUNT in SKILL-INDEX.md"
  echo "   Run ./scripts/finalize-skills-index.sh to fix, then re-push."
  exit 1
fi
HOOK

chmod +x "$REPO/.git/hooks/pre-push"
echo "✅ pre-push hook installed at $REPO/.git/hooks/pre-push"
echo "   It will reject pushes when SKILL-INDEX.md count doesn't match the on-disk total."
