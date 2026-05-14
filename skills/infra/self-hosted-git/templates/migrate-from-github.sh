#!/usr/bin/env bash
# Bulk-import repos from GitHub into this GitLab instance.
#
# Uses GitLab's built-in "Import from GitHub" feature — it handles repos,
# issues, MRs, comments, labels, and milestones in one pass.
#
# Usage:
#   GITHUB_TOKEN=ghp_xxx \
#   GITLAB_TOKEN=glpat_xxx \
#   GITLAB_URL=https://git.your.tld \
#   ./migrate-from-github.sh marvelousempire    # GitHub owner (user or org)
#
# Tokens needed:
#   GITHUB_TOKEN — personal access token with `repo` scope. Generate at:
#                  https://github.com/settings/tokens
#   GITLAB_TOKEN — personal access token with `api` scope. Generate in your
#                  self-hosted GitLab: User settings → Access Tokens.

set -euo pipefail

: "${GITHUB_TOKEN:?GITHUB_TOKEN env var must be set}"
: "${GITLAB_TOKEN:?GITLAB_TOKEN env var must be set}"
: "${GITLAB_URL:?GITLAB_URL env var must be set (e.g. https://git.your.tld)}"

GITHUB_OWNER="${1:?Usage: $0 <github-owner>}"

# 1. List all repos for the GitHub owner. Handles pagination up to 100/page * 10 pages.
echo "Listing repos for github.com/${GITHUB_OWNER}…" >&2
repos=$(
  for page in $(seq 1 10); do
    curl -fsSL \
      -H "Authorization: token ${GITHUB_TOKEN}" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/users/${GITHUB_OWNER}/repos?per_page=100&page=${page}&type=all"
  done | jq -r '.[] | select(.fork == false) | "\(.id)\t\(.name)\t\(.full_name)\t\(.private)"' \
       | sort -u
)

if [ -z "$repos" ]; then
  echo "No repos found for ${GITHUB_OWNER}. Check the token's scope + owner name." >&2
  exit 1
fi

echo "$repos" | wc -l | xargs printf "Found %s repos\n" >&2

# 2. For each repo, kick off an async GitLab import job.
echo "$repos" | while IFS=$'\t' read -r github_repo_id name full_name private; do
  printf "→ importing %s (private=%s)…\n" "$full_name" "$private" >&2
  body=$(jq -n \
    --arg pid "$github_repo_id" \
    --arg name "$name" \
    --arg full "$full_name" \
    '{
      personal_access_token: env.GITHUB_TOKEN,
      repo_id: ($pid | tonumber),
      new_name: $name,
      target_namespace: env.GITLAB_OWNER_OR_GROUP,
      github_hostname: "https://api.github.com",
      optional_stages: {
        single_endpoint_issue_events_import: true,
        single_endpoint_notes_import: true,
        attachments_import: true,
        collaborators_import: true
      }
    }')
  curl -fsS -X POST \
    -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
    -H "Content-Type: application/json" \
    --data-binary "${body}" \
    "${GITLAB_URL}/api/v4/import/github" \
    | jq -c '{id, name, full_name, import_status}'
done

cat >&2 <<EOF

All import jobs queued. Track progress at:
  ${GITLAB_URL}/-/import_history

Imports run in the background (Sidekiq job per repo). Big repos with lots of
issues + MR history can take 5–30 minutes each. Re-running this script is
safe — already-imported repos are skipped by GitLab.
EOF
