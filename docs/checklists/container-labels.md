# Checklist — container labels

Before any new service ships in a `docker-compose.yml` from this repo.

## Per service

- [ ] `org.opencontainers.image.title` (display name)
- [ ] `org.opencontainers.image.source` (always `https://github.com/marvelousempire/ai-skills-library`)
- [ ] `org.opencontainers.image.description` (one-line role)
- [ ] `ai-skills-library.skill` (matches a folder in `skills/`)
- [ ] `ai-skills-library.surface` (one of the valid values — see below)
- [ ] `ai-skills-library.url` (omit for `engine` / `init` / `ci-runner`)

## Valid surface values

| Value | Use for |
|---|---|
| `web-ui` | user-facing UI |
| `engine` | backing daemon/runtime |
| `reverse-proxy` | Caddy / nginx |
| `ci-runner` | CI worker |
| `init` | one-shot setup job that exits |
| `dock-ui` | Dockyard itself |
| `db` | database |
| `queue` | job queue |

If you need a new surface, add it to [`labels-reference.md`](../../skills/infra/dockyard/templates/labels-reference.md) AND [`container-labels.md`](../standards/container-labels.md) AND this checklist.

## Verify

```sh
# Expect: ≥ <number of services>
docker compose -f <path>.yml config | grep -c 'ai-skills-library.skill'

# Spot-check a single service:
docker inspect <container-name> | grep -A 10 '"Labels"'
```

## Update the compliance matrix

[`skills/infra/dockyard/references/integration-checklist.md`](../../skills/infra/dockyard/references/integration-checklist.md) tracks per-stack compliance. Add a row.

## Why

Without these labels, Dockyard's Compose view shows containers by image-name only (`abc123  ollama/ollama  …`). With them, it shows the full project / role / URL grouping. Same for the Homelab Console probes.

Real example: [`skills/visual/diagrams/seeme/docker-compose.yml`](../../skills/visual/diagrams/seeme/docker-compose.yml).
