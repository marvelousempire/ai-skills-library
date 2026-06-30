#!/usr/bin/env bash
# Push ai-skills-library to every configured remote.
#
# Sovereign git law (Plan 0041): Gitea on DGX is CANONICAL; GitHub is mirror only.
#
# Usage (from ai-skills-library repo root):
#   ./scripts/push-all-remotes.sh
#   GITLAB_REMOTE=gitlab ./scripts/push-all-remotes.sh   # after: git remote add gitlab <url>
#
# Remotes (after gitea-wire):
#   origin  → ssh://git@10.1.0.5:2424/marvelousempire/ai-skills-library.git (canonical)
#   github  → git@github.com:marvelousempire/ai-skills-library.git (offsite mirror)
#
# Wire Gitea once:
#   GITEA_REPO=ai-skills-library GITEA_NONINTERACTIVE=1 \
#     bash /path/to/red-e-play-app/scripts/either-host/gitea-add-remote.sh
#   git remote rename origin github 2>/dev/null || true
#   git remote rename gitea origin 2>/dev/null || git remote add origin <gitea-ssh-url>
#
# GitLab default (self-hosted clinic) — override with GITLAB_REMOTE_URL:
#   ssh://git@clinic.yousirjuan.ai:2424/marvelousempire/ai-skills-library.git
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BRANCH="${SKILLS_LIB_BRANCH:-main}"
GITLAB_REMOTE_NAME="${GITLAB_REMOTE:-gitlab}"
GITLAB_REMOTE_URL="${GITLAB_REMOTE_URL:-ssh://git@clinic.yousirjuan.ai:2424/marvelousempire/ai-skills-library.git}"
GITEA_SSH_PORT="${GITEA_SSH_PORT:-2424}"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: working tree not clean — commit or stash before push" >&2
  git status --short
  exit 1
fi

# Canonical: Gitea (origin or explicit gitea remote)
CANONICAL_REMOTE=""
for candidate in origin gitea; do
  if git remote get-url "${candidate}" >/dev/null 2>&1; then
    url="$(git remote get-url "${candidate}")"
    if [[ "$url" == *"10.1.0.5"* || "$url" == *"git.jailynmarvin.com"* ]]; then
      CANONICAL_REMOTE="${candidate}"
      break
    fi
  fi
done

if [[ -z "$CANONICAL_REMOTE" ]]; then
  echo "error: no Gitea remote — wire with gitea-add-remote.sh (GITEA_REPO=ai-skills-library)" >&2
  git remote -v >&2 || true
  exit 1
fi

echo "# push ${CANONICAL_REMOTE} (Gitea canonical, ${BRANCH})"
GIT_SSH_COMMAND="ssh -p ${GITEA_SSH_PORT} -o BatchMode=yes -o ConnectTimeout=12" \
  git push "${CANONICAL_REMOTE}" "${BRANCH}"

if git remote get-url github >/dev/null 2>&1; then
  echo "# push github (offsite mirror, ${BRANCH})"
  git push github "${BRANCH}"
else
  echo "# github remote missing — optional mirror; add: git remote add github git@github.com:marvelousempire/ai-skills-library.git"
fi

if git remote get-url "${GITLAB_REMOTE_NAME}" >/dev/null 2>&1; then
  echo "# push ${GITLAB_REMOTE_NAME} (${BRANCH})"
  git push "${GITLAB_REMOTE_NAME}" "${BRANCH}"
else
  echo "# ${GITLAB_REMOTE_NAME} remote missing — add once:"
  echo "  git remote add ${GITLAB_REMOTE_NAME} ${GITLAB_REMOTE_URL}"
  echo "  git push -u ${GITLAB_REMOTE_NAME} ${BRANCH}"
fi

echo "Done."