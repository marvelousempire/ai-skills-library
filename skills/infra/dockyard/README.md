# dockyard — integration layer for the ai-skills-library stacks

> Wire SEEME, GitLab CE, the CI dashboard, and the Homelab Console into [Dockyard](https://github.com/marvelousempire/claude-chat-reader/tree/main/dockyard), the user's Python-stdlib Docker manager UI. No Docker Desktop required.

```text
   ┌─────────────────────────────────────────────────────────────────────┐
   │  Dockyard :4321 — Compose-project view                               │
   ├─────────────────────────────────────────────────────────────────────┤
   │                                                                     │
   │  📦 seeme               (skill: seeme)                               │
   │     ● seeme-ui          web-ui     http://localhost:7777            │
   │     ● seeme-ollama      engine     http://localhost:11434           │
   │     ○ seeme-ollama-init init       (exited cleanly)                 │
   │                                                                     │
   │  📦 self-hosted-git     (skill: self-hosted-git)                     │
   │     ● gitlab            git-platform  https://git.your.tld          │
   │     ● gitlab-caddy      reverse-proxy https://git.your.tld          │
   │     ● gitlab-runner     ci-runner                                   │
   │                                                                     │
   │  📦 dockyard            (this UI)                                    │
   │     ● dockyard          dock-ui    http://localhost:4321            │
   │                                                                     │
   │  Engine: ● colima (v0.7.0)        Disk: 47 GB / 60 GB                │
   └─────────────────────────────────────────────────────────────────────┘
```

## Quick start

```sh
# 1. Have a Docker engine running. Colima is the recommended default.
brew install colima docker docker-compose docker-buildx
colima start --cpu 4 --memory 8 --disk 60

# 2. Boot Dockyard.
bash skills/infra/dockyard/templates/install.sh
# (or: docker compose -f skills/infra/dockyard/templates/standalone-compose.yml up -d)

# 3. Open it.
open http://localhost:4321/

# 4. Boot the rest of the library stack — every container shows up
#    automatically because of the ai-skills-library labels.
cd skills/visual/diagrams/seeme && docker compose up -d
cd ../../../infra/self-hosted-git && docker compose -f templates/gitlab-compose.yml up -d
```

## What lives where

```
dockyard/
├── SKILL.md                                # the playbook (Claude / agents read this)
├── README.md                               # you are here
├── templates/
│   ├── install.sh                          # one-line installer (detects local clone)
│   ├── standalone-compose.yml              # Dockyard as a single-service sidecar
│   ├── caddyfile-snippet.txt               # HTTPS front-door snippet (matches the upstream pattern)
│   └── labels-reference.md                 # canonical label schema (the contract)
└── references/
    ├── integration-checklist.md            # per-stack compliance snapshot
    ├── engines-compared.md                 # Colima vs OrbStack vs Docker Desktop
    └── switching-from-docker-desktop.md    # migration guide
```

## The label contract

Every container shipped from this library MUST carry:

```yaml
labels:
  org.opencontainers.image.title: "<display name>"
  org.opencontainers.image.source: "https://github.com/marvelousempire/ai-skills-library"
  org.opencontainers.image.description: "<one-line role>"
  ai-skills-library.skill: "<skill-slug>"
  ai-skills-library.surface: "<role>"            # web-ui / engine / reverse-proxy / ci-runner / init
  ai-skills-library.url: "<localhost-url>"       # omit for engine/init
```

Full schema with rationale, examples, and how Dockyard renders each field: [`templates/labels-reference.md`](templates/labels-reference.md).

Per-stack compliance snapshot: [`references/integration-checklist.md`](references/integration-checklist.md).

## Why Dockyard and not Docker Desktop

The user hit Docker Desktop reliability problems hard during the build of this very library (mid-May 2026, Docker Desktop 4.70.0 + macOS Tahoe + Apple Silicon — `make doctor` literally crashed Docker Desktop mid-build). Dockyard's PRD opens with that exact incident. Per [`references/engines-compared.md`](references/engines-compared.md):

| Engine | Status | Why |
|---|---|---|
| Colima | **recommended default** | Apple-Silicon-native, free, no GUI bloat, survives sleep, same socket |
| OrbStack | excellent paid alternative | Faster cold start, polished, $8/mo personal |
| Docker Desktop | legacy | Crashes on Tahoe + AS, 200+ GB VM bloat, subscription nags |

Dockyard works with all three — that's the whole point of `socket=auto`.

## Migration from Docker Desktop

If you're moving off Docker Desktop today: [`references/switching-from-docker-desktop.md`](references/switching-from-docker-desktop.md) — full step-by-step, no data loss.

## How the Homelab Console uses this

The console at `:7779` polls Dockyard at `:4321` every 15 seconds. When Dockyard is up:

- A "Dockyard ● up" card appears in the services grid
- The footer shows `engine: colima ●` (or whichever Docker engine is running)
- Each service card gets a small "open in Dockyard" mini-link

The Console + Dockyard are complementary:
- **Console** = the overview (what's green / what's red across services + recent CI pipelines)
- **Dockyard** = the drill-down (per-container management, logs, exec, stats)

## Anchors

- [Dockyard upstream PRD](https://github.com/marvelousempire/claude-chat-reader/blob/main/dockyard/PRD.md) — the design document
- [yousirjuan Category 10](../../../docs/yousirjuan-platform-skills-master.md#10-infrastructure--deployment) — where Dockyard + Colima + OrbStack land in the platform plan
- [Homelab Console](../console/) — the operational entry point that surfaces Dockyard
- [SEEME](../../visual/diagrams/seeme/) and [self-hosted-git](../self-hosted-git/) — the stacks Dockyard manages
