# Homelab Console

> One UI, one Makefile, every service in the sovereign stack.

```text
   ┌─────────────────────────────────────────────────────────────────────┐
   │  ▣ HOMELAB CONSOLE                  yousirjuan · sovereign stack     │
   ├─────────────────────────────────────────────────────────────────────┤
   │                                                                     │
   │   ┌────────────────────┐  ┌────────────────────┐                    │
   │   │  SEEME      ● up   │  │  GitLab CE   ● up  │                    │
   │   │  diagram CLI       │  │  git + CI + reg   │                    │
   │   └────────────────────┘  └────────────────────┘                    │
   │                                                                     │
   │   ┌────────────────────┐  ┌────────────────────┐                    │
   │   │  Ollama     ● up   │  │  CI Dashboard ●up │                    │
   │   │  llama3.1 (4.7 GB) │  │  pipeline overvw  │                    │
   │   └────────────────────┘  └────────────────────┘                    │
   │                                                                     │
   │   ● running    seeme              main      now                     │
   │   ● success    ai-skills-library  main      2m ago                  │
   │   ● success    red-e-play         main      1h ago                  │
   │                                                                     │
   └─────────────────────────────────────────────────────────────────────┘
```

## What it does

- **Status grid** — live up/down for SEEME, GitLab, Ollama, CI dashboard with per-service detail (version, provider count, project count, running pipelines)
- **Recent pipelines** — 5 most-recent CI runs across every GitLab project, with status badges + click-through to the pipeline UI
- **Quick launch** — one-click into SEEME, GitLab, CI dashboard, Ollama
- **Makefile** — `make start` / `make stop` / `make status` / `make doctor` / `make logs` — the whole stack as a single command surface

## Quick start — one command

```sh
cd skills/infra/console
make ui
```

That's the whole thing. Same command every time. `make ui` is idempotent: it boots whatever isn't already running, waits for the Console to respond, then opens it in your browser. Re-running does nothing harmful.

If you want **every UI in its own tab** (Console + SEEME + Dockyard + CI dashboard + GitLab):

```sh
OPEN_ALL=1 make ui
```

Optional one-time setup:

```sh
cp .env.example .env
# Edit .env:
#   GITLAB_URL    → so the pipelines panel lights up
#   GITLAB_TOKEN  → Personal Access Token, read_api scope
#   DOCKYARD_URL  → overrides http://localhost:4321 if you bind differently
```

Other useful targets:

| Command | What |
|---|---|
| `make ui` | **the one command** — boot + open everything |
| `make stop` | shut everything down (data volumes preserved) |
| `make doctor` | health probes across the whole stack |
| `make status` | what's running where |
| `make engine-info` | which Docker engine is in use (Colima / OrbStack / DD) |
| `make logs` | follow logs across every container |

## All the make targets

```text
$ make
  ▣ Homelab Console · sovereign stack commands

  help             Show this help (default)
  start            Boot the entire stack
  stop             Stop the entire stack
  restart          Stop and start
  start-seeme      Boot SEEME (web UI + Ollama auto-pull)
  stop-seeme       Stop SEEME
  start-gitlab     Boot GitLab CE + runner + Caddy
  stop-gitlab      Stop GitLab
  start-ci-dashboard  Boot the CI dashboard
  stop-ci-dashboard   Stop the CI dashboard
  start-console    Boot the homelab console (this UI)
  stop-console     Stop the homelab console
  status           Show what's running (containers + console process)
  logs             Follow logs across the stack (Ctrl-C to stop)
  doctor           Run health probes against every service
  ui               Start ONLY the console UI (services already running)
  open             Open the console UI in your browser
  clean            Remove .console.log (does NOT remove docker volumes)
```

## What lives where

```
console/
├── SKILL.md           # the playbook (Claude Code reads this)
├── README.md          # you are here
├── Makefile           # full stack lifecycle commands
├── server.ts          # Node stdlib http server + service-status aggregator
├── index.html         # single-page UI (dark, monospace, matches SEEME)
├── serve.sh           # launcher (reads .env, runs server.ts)
└── .env.example       # GITLAB_URL, GITLAB_TOKEN, etc.
```

## Architecture

```text
   ┌───────────┐     /api/status     ┌──────────────────────┐
   │  browser  │◄────────────────────┤  console server      │
   │  index.   │                     │  Node :7779          │
   │  html     │                     │  (server.ts)         │
   └───────────┘                     └──────┬───────────────┘
                                            │ parallel probes
                              ┌─────────────┼─────────────┐
                              ▼             ▼             ▼
                      ┌────────────┐ ┌────────────┐ ┌──────────────┐
                      │  SEEME     │ │  Ollama    │ │  GitLab CE   │
                      │  :7777     │ │  :11434    │ │  :443        │
                      └────────────┘ └────────────┘ └──────────────┘
```

Server fans out to every service in parallel on every refresh (every 15 s by default, paused when tab hidden). GitLab token never reaches the browser — proxied entirely server-side. Gracefully degrades if any service is down (shows a "down" pill, doesn't error out).

## Why this exists

Five separate dashboards add up to context-switching tax. One unified surface, one URL, one `make start` — that's the whole point. The full power of each individual surface (rich pipeline view in the CI dashboard, full GitLab UI for issues/MRs, SEEME web UI for diagram authoring) is still one click away. The console is the entry point and the heartbeat, not the deep-dive.

## Pairing

- **SEEME** ([`../../visual/diagrams/seeme/`](../../visual/diagrams/seeme/)) — the diagram tool the console probes + links to
- **self-hosted-git** ([`../self-hosted-git/`](../self-hosted-git/)) — the GitLab CE stack the console polls
- **CI dashboard** ([`../self-hosted-git/dashboard/`](../self-hosted-git/dashboard/)) — the deep-dive pipeline view
- **Dockyard** ([`../dockyard/`](../dockyard/)) — Docker manager UI; console probes it at `:4321`, shows engine badge + container count, deep-links into Dockyard's Compose view

Anchors back to the [yousirjuan platform plan](../../../docs/yousirjuan-platform-skills-master.md) — Categories 10 (Infrastructure) and 11 (Governance) made legible.
