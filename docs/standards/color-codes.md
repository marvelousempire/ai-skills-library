# Standard: terminal color codes

Consistent `printf` color codes across every bash script + Makefile in this repo. Same conventions match the UI palette in [`aesthetic-language.md`](aesthetic-language.md).

## The palette

```sh
# At the top of every script / Makefile:
CYAN='\033[36m'   # action / in-progress
GREEN='\033[32m'  # success / up / pass
YELLOW='\033[33m' # warning / soft-fail / "did nothing"
RED='\033[31m'    # error / down / hard-fail
DIM='\033[2m'     # de-emphasized / metadata
BOLD='\033[1m'    # emphasis on key words
RESET='\033[0m'   # always close every escape
```

## Convention

| Code | Use for | Examples in repo |
|---|---|---|
| `→` cyan | active step ("starting X…") | `printf "$(CYAN)→$(RESET) starting Dockyard...\n"` |
| `✓` green | success / "up" / pass | `printf "$(GREEN)✓$(RESET) stack is up\n"` |
| `⚠` yellow | warning / "skipped" / soft-fail | `printf "$(YELLOW)⚠$(RESET) GITLAB_HOSTNAME not set — skipping\n"` |
| `✗` red | error / "down" / hard-fail | `printf "$(RED)✗ Docker daemon is not running.$(RESET)\n"` |
| `●` solid dot | status indicator (up = green, down = red) | `printf "$(GREEN)●$(RESET) up\n"` |
| `○` hollow dot | status indicator (off / unavailable) | `printf "$(RED)○$(RESET) down\n"` |

## Examples from the repo

```sh
# skills/infra/console/Makefile
.PHONY: _check-docker
_check-docker:
	@if ! docker info >/dev/null 2>&1; then \
		printf "$(RED)✗ Docker daemon is not running.$(RESET)\n\n"; \
		exit 1; \
	fi
```

```sh
# skills/infra/dockyard/templates/install.sh
log() { printf '\033[36m→\033[0m %s\n' "$*"; }
ok()  { printf '\033[32m✓\033[0m %s\n' "$*"; }
warn(){ printf '\033[33m⚠\033[0m %s\n' "$*"; }
err() { printf '\033[31m✗\033[0m %s\n' "$*" >&2; }
```

## Graceful degradation

When the script might run in a non-TTY context (CI, piped output), guard the escapes:

```sh
if [ -t 1 ]; then
  G=$'\033[32m'; R=$'\033[31m'; Y=$'\033[33m'; B=$'\033[36m'; D=$'\033[2m'; N=$'\033[0m'
else
  G=""; R=""; Y=""; B=""; D=""; N=""
fi
```

This is what `skills/infra/dockyard/scripts/doctor.sh` does (via the upstream Dockyard pattern).

## Anti-patterns

- Mixing green with "warning" — green is success only
- Using yellow for hard errors — use red for anything blocking
- Forgetting to reset (`$(RESET)`) — bleeds into the next line
- Hard-coding escape sequences inline without a variable — unmaintainable
