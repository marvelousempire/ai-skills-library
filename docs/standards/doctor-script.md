# Standard: doctor script

Every infrastructure skill ships a `doctor` script (`make doctor` target OR `scripts/doctor.sh`) that runs **read-only health probes** and reports green/red/yellow per check.

## Required checks (any infra skill)

```text
   1. Disk space         "Disk space: 199 GB used of 228 GB (87% full, 29 GB free)"
   2. Docker daemon      "Docker daemon: ● up"
   3. Docker engine      "Docker engine: ● colima"
   4. Each service in the stack with its own ● up / ○ down probe
```

## Pattern

```sh
#!/usr/bin/env bash
set -u

# Colors (graceful TTY detection)
if [ -t 1 ]; then
  G=$'\033[32m'; R=$'\033[31m'; Y=$'\033[33m'; B=$'\033[36m'; N=$'\033[0m'
else
  G=""; R=""; Y=""; B=""; N=""
fi

echo "${B}🩺 <skill> doctor${N}"
echo ""

# Each check follows the same shape:
check() {
  local label="$1"; shift
  if "$@" >/dev/null 2>&1; then
    printf "  ${G}● up${N}     %s\n" "$label"
  else
    printf "  ${R}○ down${N}   %s\n" "$label"
  fi
}

check "Docker daemon"  docker info
check "Service X :7777"  curl -fsS --max-time 2 http://localhost:7777/health
```

## Conventions

- **Read-only** — doctor must never start, stop, or modify state
- **Fast** — every probe has a `--max-time 2` (or similar) timeout
- **Exit codes** — 0 if all green, 1 if any red, 2 if any yellow
- **Single screen** — output fits in a terminal screen
- **Colors** — per [`color-codes.md`](color-codes.md)
- **Auto-suggest fixes** — when something's red, print the exact command to fix it

## Examples in this repo

- [`skills/infra/console/Makefile`](../../skills/infra/console/Makefile) `make doctor` target — probes disk, Docker daemon, engine, Dockyard, SEEME, Ollama, GitLab, CI dashboard, Console
- [`skills/infra/dockyard/`](../../skills/infra/dockyard/) — upstream Dockyard ships its own `make doctor`

## Anti-patterns

- A doctor that mutates state (no "fix it for me" behavior — that's a separate `make repair` or per-service action)
- A doctor with > 30s total runtime
- A doctor that errors out on the first failure instead of reporting all checks

## Starter

Use [`docs/templates/doctor.sh.template`](../templates/doctor.sh.template) as a starter for new infra skills.
