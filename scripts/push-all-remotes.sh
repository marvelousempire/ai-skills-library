#!/usr/bin/env bash
# Push ai-skills-library to every configured remote (GitHub origin + optional GitLab).
#
# Usage (from ai-skills-library repo root):
#   ./scripts/push-all-remotes.sh
#   GITLAB_REMOTE=gitlab ./scripts/push-all-remotes.sh   # after: git remote add gitlab <url>
#
# GitLab default (self-hosted clinic) — override with GITLAB_REMOTE_URL:
#   ssh://git@clinic.yousirjuan.ai:2424/marvelousempire/ai-skills-library.git
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BRANCH="${SKILLS_LIB_BRANCH:-main}"
GITLAB_REMOTE_NAME="${GITLAB_REMOTE:-gitlab}"
GITLAB_REMOTE_URL="${GITLAB_REMOTE_URL:-ssh://git@clinic.yousirjuan.ai:2424/marvelousempire/ai-skills-library.git}"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: working tree not clean — commit or stash before push" >&2
  git status --short
  exit 1
fi

echo "# push origin (${BRANCH})"
git push origin "${BRANCH}"

if git remote get-url "${GITLAB_REMOTE_NAME}" >/dev/null 2>&1; then
  echo "# push ${GITLAB_REMOTE_NAME} (${BRANCH})"
  git push "${GITLAB_REMOTE_NAME}" "${BRANCH}"
else
  echo "# ${GITLAB_REMOTE_NAME} remote missing — add once:"
  echo "  git remote add ${GITLAB_REMOTE_NAME} ${GITLAB_REMOTE_URL}"
  echo "  git push -u ${GITLAB_REMOTE_NAME} ${BRANCH}"
fi

echo "Done."
