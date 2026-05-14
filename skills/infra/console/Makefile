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
CONSOLE_PORT     ?= 7779
SEEME_PORT       ?= 7777
CI_PORT          ?= 7778

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
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-14s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@printf "  $(YELLOW)Common flow:$(RESET)\n"
	@echo "    make start    # boot everything"
	@echo "    make open     # open the UI in your browser"
	@echo "    make doctor   # check health"
	@echo "    make stop     # shut everything down"
	@echo ""

# ─── lifecycle ────────────────────────────────────────────────────────────
.PHONY: start
start: start-seeme start-gitlab start-ci-dashboard start-console ## Boot the entire stack
	@printf "$(GREEN)✓$(RESET) stack is up\n"
	@echo "  SEEME UI:      http://localhost:$(SEEME_PORT)"
	@echo "  GitLab CE:     check docker logs (takes 1–3 min on first boot)"
	@echo "  CI dashboard:  http://localhost:$(CI_PORT)"
	@echo "  Console:       http://localhost:$(CONSOLE_PORT)"

.PHONY: stop
stop: stop-console stop-ci-dashboard stop-gitlab stop-seeme ## Stop the entire stack
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

# ─── convenience ──────────────────────────────────────────────────────────
.PHONY: ui
ui: start-console ## Start ONLY the console UI (services already running)

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
