#!/bin/sh
# Boot the homelab console UI server.
#
# Reads .env if present, then launches the Node stdlib HTTP server. The console
# itself doesn't start any docker stacks — use the Makefile targets for that
# (`make start` boots everything; `make ui` boots just this console).
#
# Required:  none (console gracefully degrades if services are unreachable)
# Optional:
#   GITLAB_URL          where your GitLab CE is reachable
#   GITLAB_TOKEN        Personal Access Token with read_api scope
#   SEEME_URL           default: http://localhost:7777
#   OLLAMA_HOST         default: http://localhost:11434
#   CI_DASHBOARD_URL    default: http://localhost:7778
#   CONSOLE_PORT        default: 7779
#   CONSOLE_HOST        default: 127.0.0.1

set -e

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

exec node --experimental-strip-types --no-warnings=ExperimentalWarning server.ts
