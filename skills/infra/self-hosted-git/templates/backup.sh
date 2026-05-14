#!/usr/bin/env bash
# Daily GitLab backup → Backblaze B2 (or any S3-compatible object store).
#
# Cost: roughly $0.005/GB/month. A 5GB backup = $0.025/mo. Trivial.
#
# Cron suggestion (every day at 03:30 local):
#   30 3 * * *  /path/to/skills/infra/self-hosted-git/templates/backup.sh
#
# Required env vars (drop these in /etc/launchd.plist or a systemd unit, or
# pass via launchctl setenv on macOS):
#   B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET   — Backblaze credentials
#   GITLAB_CONTAINER_NAME                       — default: gitlab
#
# Restore procedure: see ../upgrade-checklist.md#disaster-recovery

set -euo pipefail

: "${B2_KEY_ID:?B2_KEY_ID env var must be set}"
: "${B2_APPLICATION_KEY:?B2_APPLICATION_KEY env var must be set}"
: "${B2_BUCKET:?B2_BUCKET env var must be set (just the name, no s3://)}"
GITLAB_CONTAINER_NAME="${GITLAB_CONTAINER_NAME:-gitlab}"

STAMP=$(date +%Y%m%d-%H%M%S)
LOCAL_DIR="${HOME}/.seeme/gitlab-backups"
mkdir -p "${LOCAL_DIR}"

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Starting GitLab backup…" >&2

# 1. gitlab-backup creates a tar with repos + DB + uploads + LFS + registry.
#    Skips builds artifacts by default — add SKIP=builds to exclude more.
docker exec -t "${GITLAB_CONTAINER_NAME}" \
  gitlab-backup create \
  STRATEGY=copy \
  CRON=1 \
  BACKUP="${STAMP}"

# 2. The Compose mount maps backups to ./data/data/backups inside the container's
#    /var/opt/gitlab/backups. Find and copy the freshly-created tar.
docker cp \
  "${GITLAB_CONTAINER_NAME}:/var/opt/gitlab/backups/${STAMP}_gitlab_backup.tar" \
  "${LOCAL_DIR}/${STAMP}_gitlab_backup.tar"

# 3. Also ship the secrets file — required to RESTORE backups onto a new host.
#    Without this, your encrypted columns (2FA secrets, CI/CD tokens, etc.)
#    are recoverable but unreadable.
docker cp \
  "${GITLAB_CONTAINER_NAME}:/etc/gitlab/gitlab-secrets.json" \
  "${LOCAL_DIR}/${STAMP}_gitlab-secrets.json"

# 4. Upload to Backblaze B2 via rclone (preferred) or aws-cli with the B2 endpoint.
if command -v rclone >/dev/null 2>&1; then
  # One-time rclone setup: `rclone config` → New remote → Backblaze B2 → paste keys.
  # Remote name in this script: `b2`.
  rclone copy "${LOCAL_DIR}/${STAMP}_gitlab_backup.tar"     "b2:${B2_BUCKET}/gitlab/" --progress
  rclone copy "${LOCAL_DIR}/${STAMP}_gitlab-secrets.json"   "b2:${B2_BUCKET}/gitlab/" --progress
elif command -v aws >/dev/null 2>&1; then
  AWS_ACCESS_KEY_ID="${B2_KEY_ID}" \
  AWS_SECRET_ACCESS_KEY="${B2_APPLICATION_KEY}" \
  aws --endpoint-url=https://s3.us-west-002.backblazeb2.com s3 cp \
    "${LOCAL_DIR}/${STAMP}_gitlab_backup.tar" \
    "s3://${B2_BUCKET}/gitlab/${STAMP}_gitlab_backup.tar"
  AWS_ACCESS_KEY_ID="${B2_KEY_ID}" \
  AWS_SECRET_ACCESS_KEY="${B2_APPLICATION_KEY}" \
  aws --endpoint-url=https://s3.us-west-002.backblazeb2.com s3 cp \
    "${LOCAL_DIR}/${STAMP}_gitlab-secrets.json" \
    "s3://${B2_BUCKET}/gitlab/${STAMP}_gitlab-secrets.json"
else
  echo "Neither rclone nor aws-cli is installed. Install one:" >&2
  echo "  brew install rclone   # recommended" >&2
  echo "  brew install awscli" >&2
  exit 1
fi

# 5. Prune local copies older than 7 days; rely on B2 for long-term retention.
find "${LOCAL_DIR}" -name '*_gitlab_backup.tar'       -mtime +7 -delete
find "${LOCAL_DIR}" -name '*_gitlab-secrets.json'     -mtime +7 -delete

# 6. (Optional) Prune B2 copies older than 30 days. Configure a B2 lifecycle
#    rule in the Backblaze UI instead — cheaper than scripting it here.

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Backup complete: ${STAMP}" >&2
