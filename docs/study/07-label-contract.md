# 07 — Label contract

Every container shipped from this library carries `ai-skills-library.*` labels. Result: Dockyard's Compose view, the Homelab Console, and future tooling all render the stack with names + roles + URLs out of the box.

## The schema

```yaml
labels:
  org.opencontainers.image.title:       "<Display name>"
  org.opencontainers.image.source:      "https://github.com/marvelousempire/ai-skills-library"
  org.opencontainers.image.description: "<one-line role>"
  ai-skills-library.skill:              "<skill-slug>"
  ai-skills-library.surface:            "web-ui|engine|reverse-proxy|ci-runner|init|dock-ui|db|queue"
  ai-skills-library.url:                "<localhost-url>"   # omit for engine|init|ci-runner
```

Full schema: [`docs/standards/container-labels.md`](../standards/container-labels.md) and the canonical [`skills/infra/dockyard/templates/labels-reference.md`](../../skills/infra/dockyard/templates/labels-reference.md).

## Why

Without labels: `docker ps` shows containers by image name only. With labels: Dockyard groups by Compose project, names each container with its role, links to its URL.

## Compliance tracking

[`skills/infra/dockyard/references/integration-checklist.md`](../../skills/infra/dockyard/references/integration-checklist.md) — per-stack matrix. Update when adding a new labeled stack.

## Exercise

Run:

```sh
docker compose -f skills/visual/diagrams/seeme/docker-compose.yml config | grep -A 6 'labels:'
```

Inspect the three services. Note each one's `surface` and `url`.

## Next

[`08-idempotent-commands.md`](08-idempotent-commands.md).
