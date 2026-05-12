#!/bin/sh
# Dispatch entrypoint for the SEEME Docker image.
#
#   docker run seeme                       → web UI bound to 0.0.0.0:7777
#   docker run seeme serve --port 8080     → web UI on 8080
#   docker run seeme "explain RAG"         → CLI one-shot
#   docker run seeme providers             → list providers
#   docker run seeme config                → show resolved setup
#
# No args / first arg is `serve` → start the web server bound to 0.0.0.0
# so the published port works. Anything else passes through to the CLI.

set -e

if [ "$#" -eq 0 ]; then
  exec seeme serve --host 0.0.0.0 --port "${SEEME_PORT:-7777}"
fi

if [ "$1" = "serve" ]; then
  shift
  exec seeme serve --host 0.0.0.0 --port "${SEEME_PORT:-7777}" "$@"
fi

exec seeme "$@"
