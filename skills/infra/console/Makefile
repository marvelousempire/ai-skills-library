# Homelab console — single command surface for the whole sovereign stack.
#
# All targets are safe to re-run. Failures in one component don't block others.
#
# Common flows:
#   make start          # bring everything up (SEEME + GitLab + Console UI)
#   make stop           # bring everything down (data volumes preserved)
#   make status         # what's running where
#   make doctor         # health probes against every service
#   make logs           # follow logs across the stack
#   make ui             # just the console UI (assumes services already up)
#   make open           # open the console UI in your browser

SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c
.ONESHELL:
.DELETE_ON_ERROR:

# ─── paths (relative to skills/infra/console/) ────────────────────────────
SEEME_DIR        := ../../visual/diagrams/seeme
GITLAB_DIR       := ../self-hosted-git
CI_DASHBOARD_DIR := ../self-hosted-git/dashboard
DOCKYARD_DIR     := ../dockyard
DOCKYARD_REPO    ?= $(HOME)/Developer/claude-chat-reader/dockyard
CONSOLE_PORT     ?= 7779
SEEME_PORT       ?= 7777
CI_PORT          ?= 7778
DOCKYARD_PORT    ?= 4321

# Pick docker-compose v2 syntax. macOS Docker Desktop has both `docker compose`
# and `docker-compose`; prefer v2 if present.
DC := docker compose

# Pick a color or two for nicer make output (works in any modern terminal).
CYAN  := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED   := \033[31m
RESET := \033[0m

# ─── default + help ───────────────────────────────────────────────────────
.DEFAULT_GOAL := help

.PHONY: help
help: ## Show this help (default)
	@echo ""
	@printf "  $(CYAN)Homelab Console$(RESET) · sovereign stack commands\n"
	@echo ""
	@printf "  $(GREEN)ONE COMMAND TO RULE THEM ALL:$(RESET)\n"
	@printf "    $(CYAN)make ui$(RESET)        boot everything + open it in your browser (idempotent)\n"
	@echo ""
	@printf "  $(YELLOW)Everything else:$(RESET)\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| grep -v '^ui:' \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-14s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@printf "  $(YELLOW)Tip:$(RESET) OPEN_ALL=1 make ui   opens every UI in its own browser tab\n"
	@echo ""

# ─── lifecycle ────────────────────────────────────────────────────────────
.PHONY: start
start: start-dockyard start-seeme start-gitlab start-ci-dashboard start-console ## Boot the entire stack (Dockyard first so it sees other containers come up)
	@printf "$(GREEN)✓$(RESET) stack is up\n"
	@echo "  Dockyard:      http://localhost:$(DOCKYARD_PORT)"
	@echo "  SEEME UI:      http://localhost:$(SEEME_PORT)"
	@echo "  GitLab CE:     check docker logs (takes 1–3 min on first boot)"
	@echo "  CI dashboard:  http://localhost:$(CI_PORT)"
	@echo "  Console:       http://localhost:$(CONSOLE_PORT)"

.PHONY: stop
stop: stop-console stop-ci-dashboard stop-gitlab stop-seeme stop-dockyard ## Stop the entire stack
	@printf "$(GREEN)✓$(RESET) stack is down\n"

.PHONY: restart
restart: stop start ## Stop and start

# ─── per-service start/stop ───────────────────────────────────────────────
.PHONY: start-seeme
start-seeme: ## Boot SEEME (web UI + Ollama auto-pull)
	@printf "$(CYAN)→$(RESET) starting SEEME stack...\n"
	@cd $(SEEME_DIR) && $(DC) up -d 2>&1 | tail -5 || \
		printf "$(YELLOW)⚠$(RESET) SEEME stack failed to start (check disk space)\n"

.PHONY: stop-seeme
stop-seeme: ## Stop SEEME
	@printf "$(CYAN)→$(RESET) stopping SEEME stack...\n"
	@cd $(SEEME_DIR) && $(DC) down 2>&1 | tail -3 || true

.PHONY: start-gitlab
start-gitlab: ## Boot GitLab CE + runner + Caddy
	@if [ -z "$${GITLAB_HOSTNAME:-}" ]; then \
		printf "$(YELLOW)⚠$(RESET) GITLAB_HOSTNAME not set — skipping GitLab boot.\n"; \
		printf "   Run: export GITLAB_HOSTNAME=git.your-tailnet.ts.net (or your domain)\n"; \
	else \
		printf "$(CYAN)→$(RESET) starting GitLab CE...\n"; \
		mkdir -p $(GITLAB_DIR)/data/{config,logs,data,caddy-config,caddy-data,runner}; \
		cd $(GITLAB_DIR) && $(DC) -f templates/gitlab-compose.yml up -d 2>&1 | tail -5 || \
			printf "$(YELLOW)⚠$(RESET) GitLab stack failed to start\n"; \
	fi

.PHONY: stop-gitlab
stop-gitlab: ## Stop GitLab
	@printf "$(CYAN)→$(RESET) stopping GitLab...\n"
	@cd $(GITLAB_DIR) && $(DC) -f templates/gitlab-compose.yml down 2>&1 | tail -3 || true

.PHONY: start-ci-dashboard
start-ci-dashboard: ## Boot the CI dashboard
	@if [ ! -f $(CI_DASHBOARD_DIR)/.env ]; then \
		printf "$(YELLOW)⚠$(RESET) $(CI_DASHBOARD_DIR)/.env missing — skipping CI dashboard.\n"; \
		printf "   Run: cp $(CI_DASHBOARD_DIR)/.env.example $(CI_DASHBOARD_DIR)/.env\n"; \
	else \
		printf "$(CYAN)→$(RESET) starting CI dashboard...\n"; \
		cd $(CI_DASHBOARD_DIR) && nohup ./serve.sh > .console.log 2>&1 & \
		echo "  CI dashboard PID $$!"; \
	fi

.PHONY: stop-ci-dashboard
stop-ci-dashboard: ## Stop the CI dashboard
	@printf "$(CYAN)→$(RESET) stopping CI dashboard...\n"
	@pkill -f "experimental-strip-types server.ts" 2>/dev/null && \
		printf "  killed dashboard process\n" || \
		printf "  $(YELLOW)(not running)$(RESET)\n"

.PHONY: start-console
start-console: ## Boot the homelab console (this UI)
	@printf "$(CYAN)→$(RESET) starting homelab console on :$(CONSOLE_PORT)...\n"
	@nohup ./serve.sh > .console.log 2>&1 & \
		echo "  console PID $$!"

.PHONY: stop-console
stop-console: ## Stop the homelab console
	@printf "$(CYAN)→$(RESET) stopping homelab console...\n"
	@pkill -f "console/server.ts" 2>/dev/null && \
		printf "  killed console process\n" || \
		printf "  $(YELLOW)(not running)$(RESET)\n"

.PHONY: start-dockyard
start-dockyard: ## Boot Dockyard (local clone or standalone-compose, whichever is present)
	@printf "$(CYAN)→$(RESET) starting Dockyard on :$(DOCKYARD_PORT)...\n"
	@if [ -d "$(DOCKYARD_REPO)" ] && [ -f "$(DOCKYARD_REPO)/Makefile" ]; then \
		bash $(DOCKYARD_DIR)/templates/install.sh --local --port $(DOCKYARD_PORT) 2>&1 | tail -6 || \
			printf "$(YELLOW)⚠$(RESET) Dockyard local start failed\n"; \
	else \
		bash $(DOCKYARD_DIR)/templates/install.sh --compose --port $(DOCKYARD_PORT) 2>&1 | tail -6 || \
			printf "$(YELLOW)⚠$(RESET) Dockyard standalone-compose start failed\n"; \
	fi

.PHONY: stop-dockyard
stop-dockyard: ## Stop Dockyard
	@printf "$(CYAN)→$(RESET) stopping Dockyard...\n"
	@pkill -f "dockyard/server.py" 2>/dev/null && printf "  killed local Dockyard process\n" || true
	@docker compose -f $(DOCKYARD_DIR)/templates/standalone-compose.yml down 2>/dev/null | tail -3 || true

# ─── visibility ───────────────────────────────────────────────────────────
.PHONY: status
status: ## Show what's running (containers + console process)
	@printf "$(CYAN)── containers ──$(RESET)\n"
	@docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' 2>&1 | head -20
	@echo ""
	@printf "$(CYAN)── homelab console process ──$(RESET)\n"
	@if pgrep -f "console/server.ts" >/dev/null 2>&1; then \
		printf "  $(GREEN)●$(RESET) running on :$(CONSOLE_PORT)\n"; \
	else \
		printf "  $(RED)○$(RESET) not running\n"; \
	fi
	@if pgrep -f "dashboard.*server.ts" >/dev/null 2>&1; then \
		printf "  $(GREEN)●$(RESET) CI dashboard running on :$(CI_PORT)\n"; \
	else \
		printf "  $(RED)○$(RESET) CI dashboard not running\n"; \
	fi

.PHONY: logs
logs: ## Follow logs across the stack (Ctrl-C to stop)
	@printf "$(CYAN)→$(RESET) tailing logs (Ctrl-C to stop)...\n"
	@docker compose -f $(SEEME_DIR)/docker-compose.yml -f $(GITLAB_DIR)/templates/gitlab-compose.yml logs -f --tail=20 2>&1 || true

.PHONY: doctor
doctor: ## Run health probes against every service
	@printf "$(CYAN)── homelab doctor ──$(RESET)\n"
	@echo ""
	@printf "Disk space:        "
	@df -h /Users/$$(whoami) 2>/dev/null | tail -1 | awk '{print $$3 " used of " $$2 " (" $$5 " full, " $$4 " free)"}'
	@printf "Docker daemon:     "
	@if docker info >/dev/null 2>&1; then printf "$(GREEN)● up$(RESET)\n"; else printf "$(RED)○ down$(RESET)\n"; fi
	@printf "Docker engine:     "
	@$(MAKE) --no-print-directory engine-info-line
	@printf "Dockyard:          "
	@if curl -sf --max-time 2 http://localhost:$(DOCKYARD_PORT)/api/config >/dev/null; then printf "$(GREEN)● up$(RESET) (:$(DOCKYARD_PORT))\n"; else printf "$(RED)○ down$(RESET) (:$(DOCKYARD_PORT)) — install: bash $(DOCKYARD_DIR)/templates/install.sh\n"; fi
	@printf "SEEME UI:          "
	@if curl -sf --max-time 2 http://localhost:$(SEEME_PORT)/api/providers >/dev/null; then printf "$(GREEN)● up$(RESET) (:$(SEEME_PORT))\n"; else printf "$(RED)○ down$(RESET) (:$(SEEME_PORT))\n"; fi
	@printf "Ollama:            "
	@if curl -sf --max-time 2 http://localhost:11434/api/version >/dev/null; then printf "$(GREEN)● up$(RESET) (:11434)\n"; else printf "$(RED)○ down$(RESET) (:11434)\n"; fi
	@printf "GitLab CE:         "
	@if [ -n "$${GITLAB_HOSTNAME:-}" ]; then \
		if curl -sfk --max-time 4 "https://$$GITLAB_HOSTNAME/-/health" >/dev/null; then \
			printf "$(GREEN)● up$(RESET) ($$GITLAB_HOSTNAME)\n"; \
		else \
			printf "$(RED)○ down$(RESET) ($$GITLAB_HOSTNAME)\n"; \
		fi; \
	else \
		printf "$(YELLOW)? skipped$(RESET) (GITLAB_HOSTNAME not set)\n"; \
	fi
	@printf "CI dashboard:      "
	@if curl -sf --max-time 2 http://localhost:$(CI_PORT)/api/config >/dev/null; then printf "$(GREEN)● up$(RESET) (:$(CI_PORT))\n"; else printf "$(RED)○ down$(RESET) (:$(CI_PORT))\n"; fi
	@printf "Homelab console:   "
	@if curl -sf --max-time 2 http://localhost:$(CONSOLE_PORT)/api/config >/dev/null; then printf "$(GREEN)● up$(RESET) (:$(CONSOLE_PORT))\n"; else printf "$(RED)○ down$(RESET) (:$(CONSOLE_PORT))\n"; fi
	@echo ""

.PHONY: engine-info
engine-info: ## Print which Docker engine is providing the socket (Colima / OrbStack / Docker Desktop)
	@printf "$(CYAN)── docker engine ──$(RESET)\n"
	@$(MAKE) --no-print-directory engine-info-line
	@echo ""

# Internal — single-line engine summary used by both `engine-info` and `doctor`.
.PHONY: engine-info-line
engine-info-line:
	@if [ -S "$$HOME/.colima/default/docker.sock" ] || [ -S "$$HOME/.colima/team/docker.sock" ]; then \
		printf "$(GREEN)● colima$(RESET) ($$( ls $$HOME/.colima/*/docker.sock 2>/dev/null | head -1 ))\n"; \
	elif [ -S "$$HOME/.orbstack/run/docker.sock" ]; then \
		printf "$(GREEN)● orbstack$(RESET) ($$HOME/.orbstack/run/docker.sock)\n"; \
	elif docker info 2>/dev/null | grep -qi 'Operating System: Docker Desktop'; then \
		printf "$(YELLOW)● docker-desktop$(RESET) (legacy on Apple Silicon + macOS Tahoe — see ../dockyard/references/switching-from-docker-desktop.md)\n"; \
	elif docker info >/dev/null 2>&1; then \
		printf "$(GREEN)● unknown$(RESET) (docker is up but no socket signature matched)\n"; \
	else \
		printf "$(RED)○ no engine$(RESET) (start one: colima start | open -a OrbStack | open -a Docker)\n"; \
	fi

# ─── the one command ──────────────────────────────────────────────────────
# `make ui` = do everything. Idempotent. Same command every time.
#
# What it does:
#   1. Verify Docker is up (clear error if not)
#   2. Boot every service that isn't already running (Dockyard, SEEME,
#      GitLab, CI dashboard, Console) — `docker compose up -d` is naturally
#      idempotent; the console process is guarded by a pgrep check
#   3. Wait until the Console responds on :7779
#   4. Open the Console in your default browser
#   5. Print every URL in the stack so you can deep-link if needed
#
# To open EVERY UI in its own tab (not just the Console):
#   OPEN_ALL=1 make ui
.PHONY: ui
ui: _check-docker start-dockyard start-seeme start-gitlab start-ci-dashboard _ensure-console _wait-console _open-all ## ONE COMMAND. Boots the whole stack + opens it in your browser.
	@echo ""
	@printf "$(GREEN)✓ homelab is up$(RESET)\n"
	@printf "   Console:       $(CYAN)http://localhost:$(CONSOLE_PORT)$(RESET)\n"
	@printf "   SEEME:         http://localhost:$(SEEME_PORT)\n"
	@printf "   Dockyard:      http://localhost:$(DOCKYARD_PORT)\n"
	@printf "   CI dashboard:  http://localhost:$(CI_PORT)\n"
	@if [ -n "$${GITLAB_HOSTNAME:-}" ]; then \
		printf "   GitLab CE:     https://$$GITLAB_HOSTNAME\n"; \
	fi
	@echo ""
	@printf "  $(YELLOW)Tip:$(RESET) re-run this same \`make ui\` any time — idempotent.\n"
	@printf "       \`make stop\` shuts everything down. \`make doctor\` checks health.\n"
	@echo ""

# Pre-flight: bail loudly if Docker is down, with a helpful message.
.PHONY: _check-docker
_check-docker:
	@if ! docker info >/dev/null 2>&1; then \
		printf "$(RED)✗ Docker daemon is not running.$(RESET)\n\n"; \
		printf "  Start one (Colima recommended on Apple Silicon):\n"; \
		printf "    $(CYAN)colima start$(RESET)            # free, native, no GUI bloat\n"; \
		printf "    $(CYAN)open -a OrbStack$(RESET)        # paid, native UI\n"; \
		printf "    $(CYAN)open -a Docker$(RESET)          # Docker Desktop (legacy)\n\n"; \
		printf "  Then re-run: $(CYAN)make ui$(RESET)\n"; \
		exit 1; \
	fi

# Start the Console only if it isn't already running.
.PHONY: _ensure-console
_ensure-console:
	@if pgrep -f "console/server.ts" >/dev/null 2>&1; then \
		printf "$(CYAN)→$(RESET) console already running on :$(CONSOLE_PORT)\n"; \
	else \
		$(MAKE) --no-print-directory start-console; \
	fi

# Poll the console until it responds. Hard ceiling 15 s.
.PHONY: _wait-console
_wait-console:
	@printf "$(CYAN)→$(RESET) waiting for console to respond"
	@i=0; while [ $$i -lt 15 ]; do \
		if curl -sf --max-time 1 http://localhost:$(CONSOLE_PORT)/api/config >/dev/null 2>&1; then \
			printf " $(GREEN)ready$(RESET)\n"; exit 0; \
		fi; \
		printf "."; sleep 1; i=$$((i+1)); \
	done; \
	printf " $(YELLOW)timeout$(RESET) (proceeding anyway)\n"

# Open the Console in the default browser. If OPEN_ALL=1, also open every
# other UI in its own tab.
.PHONY: _open-all
_open-all:
	@$(MAKE) --no-print-directory open
	@if [ -n "$${OPEN_ALL:-}" ]; then \
		printf "$(CYAN)→$(RESET) opening all UIs in tabs (OPEN_ALL=1)\n"; \
		open http://localhost:$(SEEME_PORT)/ 2>/dev/null || true; \
		open http://localhost:$(DOCKYARD_PORT)/ 2>/dev/null || true; \
		open http://localhost:$(CI_PORT)/ 2>/dev/null || true; \
		if [ -n "$${GITLAB_HOSTNAME:-}" ]; then open "https://$$GITLAB_HOSTNAME/" 2>/dev/null || true; fi; \
	fi

# ─── legacy convenience ──────────────────────────────────────────────────
# Old `make ui` (console-only). Kept for users who liked the previous shape.
.PHONY: ui-console
ui-console: start-console ## Start ONLY the console UI (services already running)

.PHONY: open
open: ## Open the console UI in your browser
	@printf "$(CYAN)→$(RESET) opening http://localhost:$(CONSOLE_PORT)/\n"
	@open http://localhost:$(CONSOLE_PORT)/ 2>/dev/null || \
		xdg-open http://localhost:$(CONSOLE_PORT)/ 2>/dev/null || \
		echo "  open http://localhost:$(CONSOLE_PORT)/ manually"

.PHONY: clean
clean: ## Remove .console.log (does NOT remove docker volumes)
	@rm -f .console.log $(CI_DASHBOARD_DIR)/.console.log
	@printf "$(GREEN)✓$(RESET) cleaned log files\n"
