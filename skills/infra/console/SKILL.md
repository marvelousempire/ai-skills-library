---
name: console
id: SK-0061
keywords: [setup-console]
goal: Deliver console output correctly and completely.
hash: 5b0c9c6
relations: []
before: []
governed_by: [global]
meta: dynamic
description: Homelab console — single unified UI + Makefile-driven control plane for the entire sovereign stack (SEEME, GitLab CE, GitLab Runners, Ollama, CI dashboard). Polls every service in parallel, shows up/down status, recent pipelines across all projects, and quick-launch links. One-page operational view of yousirjuan Category 11 + 12 in motion. Triggers on "homelab dashboard", "console UI", "unified UI", "stack overview", "make start everything", "show me what's running", "homelab status".
---

# console — homelab unified UI + control plane

One web page that shows the health of every service in your sovereign stack, plus a `Makefile` that boots / stops / inspects all of them with single commands.

## What you see

```text
   ┌─────────────────────────────────────────────────────────────────────┐
   │  ▣ HOMELAB CONSOLE              yousirjuan · sovereign stack         │
   ├─────────────────────────────────────────────────────────────────────┤
   │  services                                                           │
   │  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────┐│
   │  │ SEEME       ● up   │  │ GitLab CE   ● up   │  │ Ollama   ● up  ││
   │  │ 2/5 providers      │  │ v17.5 · 3 proj · 1 │  │ v0.4 · 2 models││
   │  │ reachable          │  │ running            │  │ (5.2 GB)       ││
   │  │ [open]             │  │ [open] [CI dash]   │  │                ││
   │  └────────────────────┘  └────────────────────┘  └────────────────┘│
   │                                                                     │
   │  recent pipelines                          all pipelines ↗          │
   │  ● success    seeme              main      a7b2fd5   2m ago         │
   │  ● running    ai-skills-library  main      be12ab0   now            │
   │  ● failed     red-e-play         feat/x    c7aed7c   1d ago         │
   │                                                                     │
   │  quick launch                                                       │
   │  [SEEME ↗]  [GitLab CE ↗]  [CI Dashboard ↗]  [Ollama ↗]              │
   └─────────────────────────────────────────────────────────────────────┘
```

## When to use

- "What's running right now?"
- "Boot the whole homelab stack"
- "Status across SEEME + GitLab + CI in one view"
- "Open the console" / "Use the **console**."
- "Make start" (this is the Makefile in this skill folder)
- Routine ops: `make doctor` for health probes, `make logs` to tail everything

## Quick start — one command

```sh
cd skills/infra/console
make ui
```

That's the whole thing. **Same command every time.** `make ui` is idempotent — it boots whatever isn't already up, waits for the Console to respond, then opens it in your browser. Re-running it later does nothing harmful (containers are already running, console process is already up — it just opens the browser again).

Want every surface in its own tab?

```sh
OPEN_ALL=1 make ui
```

To stop everything: `make stop`. Health probes: `make doctor`. Status: `make status`.

## Makefile targets

| Target | What it does |
|---|---|
| **`make ui`** | **THE one command** — boot the whole stack + open it in your browser. Idempotent. Same command every time. `OPEN_ALL=1 make ui` opens every UI in its own tab. |
| `make` (no args) | help screen |
| `make start` | boot every service in the stack (same as `make ui` minus the browser-open step) |
| `make stop` | stop every service (data volumes preserved) |
| `make restart` | stop then start |
| `make status` | container list + console process state |
| `make doctor` | health probes against every service (disk, docker, SEEME, Ollama, GitLab, CI, console) |
| `make logs` | follow logs across the stack |
| `make ui` | start only the console UI (assumes services already running) |
| `make open` | open http://localhost:7779 in your default browser |
| `make start-seeme` / `make start-gitlab` / `make start-ci-dashboard` / `make start-console` | per-service boot |
| `make stop-seeme` / etc. | per-service stop |
| `make clean` | remove `.console.log` files |

## Architecture

```text
   ┌───────────────────────────────────────────────────────────────────┐
   │  browser  ─────────►  homelab console (Node :7779)                │
   │                            │                                       │
   │                            ▼                                       │
   │              fan out probes to every service in parallel:          │
   │              ┌──────────────┬──────────────┬─────────────────┐    │
   │              ▼              ▼              ▼                 ▼    │
   │       ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐ │
   │       │  SEEME   │  │  GitLab CE   │  │  Ollama  │  │  CI dash │ │
   │       │  :7777   │  │  :443        │  │  :11434  │  │  :7778   │ │
   │       └──────────┘  └──────────────┘  └──────────┘  └──────────┘ │
   │              │              │              │                       │
   │              └──────────────┴──────────────┘                       │
   │                            unified JSON                            │
   │                                 ▲                                  │
   │                                 │                                  │
   │                          /api/status (15s poll)                    │
   └───────────────────────────────────────────────────────────────────┘
```

Server: 200 lines of Node stdlib (`http` + `fs` + `fetch`). No npm install. Token-based GitLab calls happen server-side — the browser never sees the credential. Page renders in pure vanilla JS, single self-contained HTML file, same aesthetic as SEEME and the CI dashboard.

## What it polls

| Service | Endpoint | Tells you |
|---|---|---|
| SEEME | `:7777/api/providers` | which AI providers are reachable |
| Ollama | `:11434/api/version` + `/api/tags` | version + model count + total cache size |
| GitLab CE | `/api/v4/version` + `/api/v4/projects` + per-project `/pipelines` | version, project count, running pipelines, 5 most-recent pipelines across all projects |
| CI dashboard | (link-only) | quick-launch link; the dashboard itself has the full pipeline view |

Polls every 15 seconds, pauses when the browser tab is hidden, click-through links go to the GitLab project / pipeline / dashboard in new tabs.

## Dockyard integration

When Dockyard is reachable at `:4321`, the console:

- Surfaces it as a fifth service card (`Dockyard ● up · Docker manager · N containers visible`)
- Adds an **engine badge** to the footer (`engine: colima ●` / `orbstack ●` / `docker-desktop ●` / `unknown`) sourced from Dockyard's authoritative `/api/version`
- Adds a Dockyard tile to the quick-launch row
- Surfaces `make engine-info` for explicit engine readouts

The `make start` target boots Dockyard first (so it sees the other containers come up). `make doctor` includes Dockyard + engine rows. Falls back gracefully — every other surface still works without Dockyard.

See [`../dockyard/`](../dockyard/) for the full Dockyard integration skill, label schema, and Docker-Desktop-to-Colima migration guide.

## Pairing

- **SEEME** — the diagram tool the console links to ([`../../visual/diagrams/seeme/`](../../visual/diagrams/seeme/))
- **self-hosted-git** — the GitLab CE stack the console polls ([`../self-hosted-git/`](../self-hosted-git/))
- **CI dashboard** — the deep-dive pipeline view ([`../self-hosted-git/dashboard/`](../self-hosted-git/dashboard/))
- **Dockyard** — the Docker manager UI the console probes ([`../dockyard/`](../dockyard/))

The console is the **overview**. When you want detail, click through.

## yousirjuan alignment

Operationalizes Categories 10 (Infrastructure & Deployment) and 11 (Governance) by surfacing them in one place. Doesn't ship new infrastructure — it just makes the existing pieces legible at a glance. The right place to put a TV in your office.

## Verification

```sh
cd skills/infra/console
make doctor    # one-shot health probe across the stack
make status    # what's running, what's not
```

Once `make doctor` is all green, `make open` → you should see all four service cards green at the top, recent pipelines underneath, and quick-launch links at the bottom.
