#!/usr/bin/env bash
# install.sh — boot Dockyard for use with the ai-skills-library stacks.
#
# Detection order:
#   1. Local clone at $DOCKYARD_REPO (default: ~/Developer/claude-chat-reader/dockyard)
#   2. Standalone Compose template in this skill folder (Dockyard as a sidecar)
#
# Safe to re-run. Idempotent. Verifies docker socket reachability first.
#
# Usage:
#   bash skills/infra/dockyard/templates/install.sh                    # use defaults
#   DOCKYARD_REPO=~/code/dockyard bash skills/.../install.sh           # custom clone
#   bash skills/.../install.sh --compose                                # force standalone
#   bash skills/.../install.sh --port 4321                              # alt port

set -euo pipefail

DOCKYARD_REPO="${DOCKYARD_REPO:-$HOME/Developer/claude-chat-reader/dockyard}"
PORT="${DOCKYARD_PORT:-4321}"
MODE="auto"   # auto | local | compose

# ─── arg parsing ─────────────────────────────────────────────────────
while [ "$#" -gt 0 ]; do
  case "$1" in
    --compose) MODE="compose"; shift ;;
    --local)   MODE="local"; shift ;;
    --port)    PORT="$2"; shift 2 ;;
    --help|-h)
      sed -n '2,20p' "$0"
      exit 0
      ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

# ─── helpers ─────────────────────────────────────────────────────────
log() { printf '\033[36m→\033[0m %s\n' "$*"; }
ok()  { printf '\033[32m✓\033[0m %s\n' "$*"; }
warn(){ printf '\033[33m⚠\033[0m %s\n' "$*"; }
err() { printf '\033[31m✗\033[0m %s\n' "$*" >&2; }

# ─── 1. Pre-flight checks ────────────────────────────────────────────
log "Pre-flight checks..."

if ! command -v docker >/dev/null 2>&1; then
  err "docker CLI not found. Install with: brew install docker docker-compose docker-buildx"
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  err "Docker daemon is not reachable. Start an engine first:"
  echo "    Colima:          brew install colima && colima start"
  echo "    OrbStack:        brew install orbstack && open -a OrbStack"
  echo "    Docker Desktop:  open -a Docker"
  exit 1
fi

ok "docker daemon is up"

# Show which engine is in use so the user knows what they're on.
if [ -S "$HOME/.colima/default/docker.sock" ] || [ -S "$HOME/.colima/team/docker.sock" ]; then
  ok "engine: colima"
elif [ -S "$HOME/.orbstack/run/docker.sock" ]; then
  ok "engine: orbstack"
elif [ -S "/var/run/docker.sock" ]; then
  ok "engine: $(docker context show 2>/dev/null || echo 'docker-desktop or similar')"
else
  warn "engine socket location is unknown — Dockyard will probe with socket=auto"
fi

# ─── 2. Decide mode ──────────────────────────────────────────────────
if [ "$MODE" = "auto" ]; then
  if [ -d "$DOCKYARD_REPO" ] && [ -f "$DOCKYARD_REPO/Makefile" ]; then
    MODE="local"
    log "found local clone at $DOCKYARD_REPO — using \`make ui-local\`"
  else
    MODE="compose"
    log "no local clone at $DOCKYARD_REPO — using standalone-compose.yml"
  fi
fi

# ─── 3. Boot Dockyard ────────────────────────────────────────────────
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case "$MODE" in
  local)
    log "starting Dockyard from $DOCKYARD_REPO (port $PORT)..."
    cd "$DOCKYARD_REPO"
    # `make run` keeps it in the foreground; `nohup make run` backgrounds it.
    nohup make PORT="$PORT" run > /tmp/dockyard.log 2>&1 &
    PID=$!
    sleep 2
    if kill -0 "$PID" 2>/dev/null; then
      ok "Dockyard running (PID $PID, log: /tmp/dockyard.log)"
    else
      err "Dockyard failed to start. Check /tmp/dockyard.log for details."
      tail -20 /tmp/dockyard.log >&2
      exit 1
    fi
    ;;
  compose)
    log "starting Dockyard via standalone-compose.yml (port $PORT)..."
    DOCKYARD_PORT="$PORT" docker compose -f "$HERE/standalone-compose.yml" up -d 2>&1 | tail -5
    ok "Dockyard container running"
    ;;
esac

# ─── 4. Health check ─────────────────────────────────────────────────
log "waiting for Dockyard to respond at http://127.0.0.1:$PORT/..."
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS --max-time 1 "http://127.0.0.1:$PORT/api/config" >/dev/null 2>&1; then
    ok "Dockyard is reachable"
    break
  fi
  sleep 1
  [ "$i" -eq 10 ] && {
    err "Dockyard did not respond within 10 seconds. Check the log."
    exit 1
  }
done

# ─── 5. Done ─────────────────────────────────────────────────────────
echo ""
ok "Dockyard is up at http://127.0.0.1:$PORT/"
echo ""
echo "Next steps:"
echo "  • Open it:           open http://127.0.0.1:$PORT/"
echo "  • Boot SEEME:        cd skills/visual/diagrams/seeme && docker compose up -d"
echo "  • Boot GitLab CE:    cd skills/infra/self-hosted-git && docker compose -f templates/gitlab-compose.yml up -d"
echo "  • Boot everything:   cd skills/infra/console && make start"
echo ""
echo "Containers in the ai-skills-library stack carry labels Dockyard recognizes."
echo "They'll appear grouped by Compose project with name + role + open-URL."
echo ""
