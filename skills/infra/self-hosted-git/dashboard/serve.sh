#!/bin/sh
# Convenience launcher for the CI dashboard.
#
# Required env vars (set them in your shell, or drop a .env in this folder
# and `set -a; . ./.env; set +a`):
#   GITLAB_URL    — e.g. https://git.your.tld
#   GITLAB_TOKEN  — personal access token with `read_api` scope
#                   (User → Settings → Access Tokens → New)
#
# Optional:
#   SEEME_CI_PORT — bind port (default 7778)
#   SEEME_CI_HOST — bind host (default 127.0.0.1)

set -e

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

: "${GITLAB_URL:?GITLAB_URL must be set in .env or shell}"
: "${GITLAB_TOKEN:?GITLAB_TOKEN must be set in .env or shell}"

exec node --experimental-strip-types --no-warnings=ExperimentalWarning server.ts
