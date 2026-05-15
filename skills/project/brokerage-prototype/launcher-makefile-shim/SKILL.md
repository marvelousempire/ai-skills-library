---
name: launcher-makefile-shim
description: >-
  Add a thin Makefile shim over an existing `./go`-style launcher so `make`,
  `make go`, `make dev`, `make restart`, `make ports`, `make doctor`,
  `make build`, `make clean`, and `make help` all work — without touching
  the underlying launcher's logic. Includes `.claude/launch.json` for
  Claude Code Preview integration and a README troubleshooting block.
trigger: >-
  Use when a project has a `./go` script but no Makefile, when the user says
  "can I run make go like my other apps", or when adding muscle-memory
  parity for projects with different launchers underneath. Do NOT replace
  an existing meaningful Makefile.
---

# /launcher-makefile-shim

## What this skill does

1. Detect the project's launcher (`./go`, `./dev`, `bin/dev`, `npm script`)
2. Detect the dev port from `package.json` / launcher source
3. Detect package manager from lockfile (pnpm / npm / yarn / bun)
4. Write `Makefile` at project root with these targets:
   - `.DEFAULT_GOAL := go` (explicit)
   - `go` / `dev` — proxy to `./go`
   - `help` — self-documenting from `## comment` tags via awk one-liner
   - `restart` — `lsof -nP -i :$(PORT) -sTCP:LISTEN -t | xargs kill && ./go`
   - `ports` — green/grey indicator for this port + any sibling project ports
   - `doctor` — runs `./scripts/doctor.sh` if present
   - `install` / `build` / `clean` — package-manager-aware, with confirmation on destructive ops
5. Write `.claude/launch.json` (gitignored) for Claude Preview
6. Add README "Running inside Claude Preview" + troubleshooting block

## How to invoke

```
/launcher-makefile-shim
```

Or naturally:

> "Make this project run with `make go` like my other apps."

## Inputs / outputs

- **Inputs:** the project's launcher script + `package.json` + (optional) sibling-project ports to show in `make ports`
- **Outputs:** `Makefile`, `.claude/launch.json`, README troubleshooting section, optional family-office-platform `Makefile` mirror

## Anti-patterns this skill blocks

- Overwriting an existing meaningful Makefile
- Reimplementing `./go`'s logic instead of proxying
- Hardcoding the port — use `PORT := <n>` variable for portability

## When NOT to use this skill

- Project already has a working Makefile with the verbs you want
- Project's launcher is a single command that doesn't need wrapping
- Project doesn't have a launcher (a vanilla `pnpm dev` workflow)

## Related

- Rules: [`rules/library/honest-dead-end-with-rollback`](../../../rules/library/honest-dead-end-with-rollback/body.md)
- Pain: [`docs/pain-journal/2026-05-14-code-shipped-not-feature-shipped.md`](../../../docs/pain-journal/2026-05-14-code-shipped-not-feature-shipped.md)
- Decision: [`docs/improvement/decision-records/0001-launchd-over-mcp-for-cron.md`](../../../docs/improvement/decision-records/0001-launchd-over-mcp-for-cron.md) (uses this same Makefile-target pattern)

## Origin

Built 2026-05-14 in `marvelousempire/brokerage-prototype` (commits `5b6f30d` → `77ad491`) and mirrored to `marvelousempire/family-office-platform` (`b5fad59`). Captured here for portable adoption.

## Reference Makefile (drop-in)

```make
.DEFAULT_GOAL := go
.PHONY: help go dev doctor restart ports install build clean

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make <target>\n\nTargets:\n"} \
		/^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

go: ## Start the dev server (idempotent)
	@./go

dev: go ## Alias for `make go`

doctor: ## Validate prerequisites
	@./scripts/doctor.sh

restart: ## Kill the port, then start fresh
	@lsof -nP -i :$(PORT) -sTCP:LISTEN -t 2>/dev/null | xargs -r kill 2>/dev/null || true
	@./go

ports: ## Show what's listening on this and sibling ports
	@for p in $(PORTS); do \
		who="$$(lsof -nP -i :$$p -sTCP:LISTEN 2>/dev/null | awk 'NR==2 {print $$1" (pid "$$2")"}')"; \
		[ -n "$$who" ] && printf "  :%s  \033[32m●\033[0m %s\n" "$$p" "$$who" || printf "  :%s  \033[2m○ free\033[0m\n" "$$p"; \
	done

install: ## Install dependencies
	@pnpm install

build: ## Production build (installs deps first if needed)
	@if [ ! -d node_modules ]; then pnpm install; fi
	@pnpm build

clean: ## Remove node_modules and dist (asks for confirmation)
	@printf "Remove node_modules + dist? [y/N] "; read ans; \
	if [ "$$ans" = "y" ] || [ "$$ans" = "Y" ]; then rm -rf node_modules dist && echo "✓ cleaned"; else echo "cancelled"; fi

# Customize at the bottom
PORT  := 8765
PORTS := 8765 3000
```
