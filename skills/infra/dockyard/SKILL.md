---
name: dockyard
id: SK-0062
keywords: [setup-dockyard]
goal: Deliver dockyard output correctly and completely.
hash: 7f4ab7a
relations: []
before: []
governed_by: [global]
meta: dynamic
description: Wire the ai-skills-library stacks into Dockyard — the user's Python-stdlib local-first Docker manager UI that replaces Docker Desktop's GUI. Talks any Docker socket (Colima → OrbStack → Docker Desktop), default Compose-project view, 12 MCP tools for AI agents, Caddy HTTPS front-door. This skill ships the install + standalone-compose templates, the canonical label schema every library container must follow, an integration checklist, and a Docker Desktop → Colima migration guide. Triggers on "set up Dockyard", "use Dockyard with ai-skills-library", "Docker UI", "Colima manager", "Dockyard MCP", "Docker Desktop replacement", "self-hosted Docker UI", "labels for Dockyard".
---

# dockyard — sovereign Docker UI for the ai-skills-library stacks

[Dockyard](https://github.com/marvelousempire/claude-chat-reader/tree/main/dockyard) is a lightweight Python-stdlib HTTP server + single-page UI for managing Docker — built to replace Docker Desktop's GUI on Apple Silicon + macOS Tahoe (where Docker Desktop has been crashing on every restart). It talks any Docker socket, defaults to a Compose-project view, ships 12 MCP tools for AI agents, and runs on `:4321` (HTTP) / `:4322` (Caddy HTTPS).

This skill ships **the integration layer** — labels, templates, checklist, and migration guides — so every stack in `ai-skills-library` renders cleanly inside Dockyard and every AI agent can reach Docker through Dockyard's MCP.

## When to use

- "Set up Dockyard for the library"
- "Use Dockyard to manage my SEEME / GitLab containers"
- "Move off Docker Desktop"
- "Switch to Colima"
- "What labels should I add to my Compose file?"
- "Dockyard MCP tools — what's available?"
- Triggered automatically by the [Homelab Console](../console/) — Dockyard appears as a service card when it's reachable.

## The integration in one diagram

```text
   ┌────────────────────────────────────────────────────────────────────┐
   │  HOST (Mac mini / MacBook Pro / Linux box)                          │
   │                                                                     │
   │  Docker engine — Colima / OrbStack / Docker Desktop                 │
   │  (Dockyard's `socket=auto` picks whichever is running)              │
   │                                                                     │
   │       │  /var/run/docker.sock                                       │
   │       │                                                             │
   │       ├──► Dockyard :4321 (Compose-project view, MCP tools)         │
   │       │      ▲                                                      │
   │       │      │ reads labels: ai-skills-library.skill / surface / url│
   │       │                                                             │
   │       ├──► SEEME containers (labels: skill=seeme, surface=web-ui)  │
   │       ├──► GitLab containers (labels: skill=self-hosted-git)        │
   │       └──► Homelab Console (no container — bare Node process)       │
   │              ▲                                                      │
   │              │ probes Dockyard at :4321 + shows in service grid     │
   └────────────────────────────────────────────────────────────────────┘
```

## Quick start

```sh
# 1. Make sure you have a Docker engine running. Order of preference per
#    the Dockyard PRD: Colima > OrbStack > Docker Desktop.
brew install colima docker docker-compose docker-buildx
colima start --cpu 4 --memory 8 --disk 60

# 2. Run Dockyard (assumes the upstream clone is in ~/Developer/claude-chat-reader/dockyard).
bash skills/infra/dockyard/templates/install.sh

# 3. Or use the standalone-compose template if you want Dockyard as a
#    sidecar in any other Compose project.
docker compose -f skills/infra/dockyard/templates/standalone-compose.yml up -d

# 4. Open it.
open http://localhost:4321/
# → you should see the SEEME + GitLab containers grouped by Compose project,
#   with full names + roles + a per-service "open" URL pulled from our labels.
```

## What this skill ships

```
skills/infra/dockyard/
├── SKILL.md                                    # you are here
├── README.md                                   # human-readable
├── templates/
│   ├── install.sh                              # one-line installer
│   ├── standalone-compose.yml                  # Dockyard as a sidecar
│   ├── caddyfile-snippet.txt                   # HTTPS front-door for Dockyard + our stacks
│   └── labels-reference.md                     # canonical label schema (the contract)
└── references/
    ├── integration-checklist.md                # per-stack compliance status
    ├── engines-compared.md                     # Colima vs OrbStack vs Docker Desktop
    └── switching-from-docker-desktop.md        # migration guide
```

## Label schema (the contract)

Every container shipped from `ai-skills-library` carries this label set. See [`templates/labels-reference.md`](templates/labels-reference.md) for the full schema with examples.

| Label | Purpose | Example |
|---|---|---|
| `org.opencontainers.image.title` | Display name in Dockyard | `"SEEME"` |
| `org.opencontainers.image.source` | Link back to this repo | `"https://github.com/marvelousempire/ai-skills-library"` |
| `org.opencontainers.image.description` | One-line role | `"AI diagram generator — multi-provider"` |
| `ai-skills-library.skill` | Skill slug this container belongs to | `"seeme"` |
| `ai-skills-library.surface` | Role within the skill | `"web-ui"` / `"engine"` / `"reverse-proxy"` / `"ci-runner"` / `"init"` |
| `ai-skills-library.url` | Localhost URL Dockyard could deep-link to | `"http://localhost:7777"` |

## Dockyard's MCP tools (12)

Available to any AI agent via `make -C /path/to/dockyard mcp` or by adding Dockyard to the agent's `mcpServers` config:

| Tool | Use |
|---|---|
| `list_containers` | enumerate every container (matches `docker ps -a`) |
| `start_container` / `stop_container` / `restart_container` / `remove_container` | lifecycle |
| `tail_logs` | recent logs for a container |
| `list_images` / `pull_image` / `remove_image` | image management |
| `list_volumes` / `list_networks` | inspect non-container resources |
| `system_info` | host + engine + disk + version |

Wiring into Claude Code:

```json
{
  "mcpServers": {
    "dockyard": {
      "command": "python3",
      "args": ["/Users/<you>/Developer/claude-chat-reader/dockyard/mcp.py"]
    }
  }
}
```

## Engine choice — TL;DR

Dockyard works with any of them; the library's stacks work with any of them. Decision per the [engines-compared](references/engines-compared.md) reference:

- **Colima** — recommended default. Apple-Silicon-native, free, no GUI, just a socket. Survives Mac sleeps; rotates cleanly.
- **OrbStack** — closed-source paid alternative ($8/mo personal). Faster cold start. Excellent Mac integration. Use if you want a polished native daemon UI for free, then add Dockyard for the container drill-down.
- **Docker Desktop** — supported but no longer recommended on Apple Silicon + macOS Tahoe. Dockyard's whole reason to exist is the Docker Desktop reliability fall-off.

## Pairing

- **[`../console/`](../console/)** — the Homelab Console probes Dockyard at `:4321` and shows it as a service card + adds an engine badge to the footer.
- **[`../self-hosted-git/`](../self-hosted-git/)** — the GitLab stack ships with full Dockyard labels.
- **[`../../visual/diagrams/seeme/`](../../visual/diagrams/seeme/)** — SEEME containers ship with full Dockyard labels.

## yousirjuan alignment

Operationalizes Category 10 (Infrastructure & Deployment) — adds Dockyard, Colima, and OrbStack as the canonical engine stack. Docker Desktop drops from "Active" to "Alternative (legacy)" per the engine decision matrix. See [yousirjuan-platform-skills-master.md](../../../docs/yousirjuan-platform-skills-master.md#10-infrastructure--deployment).

## Verification

```sh
# Are our containers correctly labeled?
docker compose -f ../../visual/diagrams/seeme/docker-compose.yml config | grep -c 'ai-skills-library.skill'   # expect ≥ 3
docker compose -f ../self-hosted-git/templates/gitlab-compose.yml config | grep -c 'ai-skills-library.skill'  # expect ≥ 3

# Is Dockyard reachable?
curl -fsS http://localhost:4321/api/config | head -c 200

# Are the labels showing in Dockyard's UI?
open http://localhost:4321
# → groupings: seeme (3 containers), self-hosted-git (3 containers), dockyard (1)
```
