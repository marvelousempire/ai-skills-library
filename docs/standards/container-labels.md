# Standard: container labels (the contract)

Every container shipped from this library carries the schema below. Dockyard's Compose view, the Homelab Console, and future tooling all read these labels.

> **Canonical reference:** [`skills/infra/dockyard/templates/labels-reference.md`](../../skills/infra/dockyard/templates/labels-reference.md) — that file is the source of truth. This doc summarizes it for repo-wide standards lookup.

## The schema

```yaml
services:
  <service-name>:
    image: <image>:<tag>
    labels:
      org.opencontainers.image.title:       "<Display name>"
      org.opencontainers.image.source:      "https://github.com/marvelousempire/ai-skills-library"
      org.opencontainers.image.description: "<one-line role>"
      ai-skills-library.skill:              "<skill-slug>"            # matches a folder in skills/
      ai-skills-library.surface:            "<role>"                  # see surfaces below
      ai-skills-library.url:                "<localhost-url>"         # omit for engine/init/ci-runner
```

## Valid `surface` values

| Value | Meaning | Example |
|---|---|---|
| `web-ui` | User-facing UI | `seeme-ui`, `dockyard` |
| `engine` | Backing engine / daemon | `seeme-ollama`, `gitlab` |
| `reverse-proxy` | Caddy / nginx in front | `gitlab-caddy` |
| `ci-runner` | CI execution worker | `gitlab-runner` |
| `init` | One-shot setup job that exits | `seeme-ollama-init` |
| `dock-ui` | Dockyard itself (special) | `dockyard` |
| `db` | Database container | — |
| `queue` | Job queue / broker | — |

Adding a new `surface` requires updating [`skills/infra/dockyard/templates/labels-reference.md`](../../skills/infra/dockyard/templates/labels-reference.md) AND this standard.

## Enforcement

Rule `rules/library/ai-skills-library-labels/` makes labeling `alwaysApply: true` for any new compose service.

Lint: `scripts/lint-skill-frontmatter.sh` validates frontmatter; a future `scripts/lint-container-labels.sh` can validate compose files (open elevation).

## Compliance snapshot

[`skills/infra/dockyard/references/integration-checklist.md`](../../skills/infra/dockyard/references/integration-checklist.md) tracks per-stack compliance and must be updated when adding a new labeled stack.
