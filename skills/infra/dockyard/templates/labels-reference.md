# Label schema — the contract for every ai-skills-library container

Every container shipped from this library MUST carry the labels below. Dockyard reads them to render its Compose-project view with names, roles, source links, and per-service URLs.

## The full schema

```yaml
services:
  <service-name>:
    image: <image>:<tag>
    labels:
      # ─── OCI labels (universal, render anywhere) ──────────────────────
      org.opencontainers.image.title: "<Display name>"
      org.opencontainers.image.source: "https://github.com/marvelousempire/ai-skills-library"
      org.opencontainers.image.description: "<one-line role>"

      # ─── ai-skills-library labels (custom — read by Dockyard, console, etc.)
      ai-skills-library.skill: "<skill-slug>"
      ai-skills-library.surface: "<role>"
      ai-skills-library.url: "<localhost-url>"      # OMIT for surface=engine|init
```

## Field-by-field

### `org.opencontainers.image.title`

Display name in any OCI-aware UI (Dockyard, Docker Desktop's container list, GitHub Packages, etc.). Use natural-language casing.

**Example**: `"SEEME"`, `"GitLab CE"`, `"Caddy (GitLab reverse proxy)"`, `"Ollama init (SEEME)"`.

### `org.opencontainers.image.source`

Link back to where this container's definition lives. Always `https://github.com/marvelousempire/ai-skills-library` for containers we ship from this library. When the library goes public, this becomes a clickable link in Dockyard.

### `org.opencontainers.image.description`

One-line role description. Keep under 80 characters. Reads naturally as "this container is…"

**Example**: `"AI diagram generator — Unicode box-and-arrow style, multi-provider"`.

### `ai-skills-library.skill`

The skill slug this container belongs to. Must match a folder name in `skills/`.

**Valid values** (as of this writing):
- `seeme` — `skills/visual/diagrams/seeme/`
- `self-hosted-git` — `skills/infra/self-hosted-git/`
- `dockyard` — `skills/infra/dockyard/`

When you add a new skill that ships containers, add its slug here and to [`../references/integration-checklist.md`](../references/integration-checklist.md).

### `ai-skills-library.surface`

The role within the skill. Use one of:

| Value | Meaning | Example |
|---|---|---|
| `web-ui` | The user-facing UI for the skill | `seeme-ui`, `dockyard` |
| `engine` | A backing engine / daemon | `seeme-ollama`, `gitlab` |
| `reverse-proxy` | Caddy / nginx in front of one or more services | `gitlab-caddy` |
| `ci-runner` | A CI execution worker | `gitlab-runner` |
| `init` | One-shot setup job that exits when done | `seeme-ollama-init` |
| `db` | Database container (for future skills) | — |
| `queue` | Job queue / broker (for future skills) | — |
| `dock-ui` | Dockyard itself (special role) | `dockyard` |

If you need a new surface value, add it here AND in this skill's [SKILL.md](../SKILL.md) Surface table AND in the integration checklist.

### `ai-skills-library.url`

The localhost URL this surface is reachable at. Dockyard uses this to render an "open" button next to each container. Omit for surfaces that don't expose a URL (`engine` daemons that only do socket-level work; `init` jobs that exit on completion).

**Examples**:
- `"http://localhost:7777"` for SEEME's web UI
- `"http://localhost:11434"` for Ollama's API
- `"https://${GITLAB_HOSTNAME}"` for GitLab (uses env var expansion)
- omitted for `seeme-ollama-init` (it exits on completion)

## Why this matters

```text
   without labels                          with labels (this library's contract)
   ──────────────                          ─────────────────────────────────────
   docker ps shows:                        Dockyard's Compose view shows:
                                            
   CONTAINER       IMAGE                    📦 seeme  (skill: seeme)
   abc123def456    ollama/ollama               ● seeme-ui      web-ui     :7777
   789ghijklmno    ollama/ollama               ● seeme-ollama  engine     :11434
   456pqrstuvwx    seeme:latest                ○ seeme-ollama-init (exited)
                                            📦 self-hosted-git
                                                ● gitlab       git-platform  :443
                                                ● gitlab-caddy reverse-proxy
                                                ● gitlab-runner ci-runner
```

The first version is what `docker ps` gives you with no labels. The second is what Dockyard renders when every container carries the full schema. Same containers, dramatically more legible.

## Validating compliance

```sh
# Are all our compose files compliant?
for f in \
  skills/visual/diagrams/seeme/docker-compose.yml \
  skills/infra/self-hosted-git/templates/gitlab-compose.yml \
  skills/infra/dockyard/templates/standalone-compose.yml ; do
  echo "=== $f ==="
  count=$(docker compose -f "$f" config 2>/dev/null | grep -c 'ai-skills-library.skill')
  if [ "$count" -gt 0 ]; then
    echo "  ✓ $count service(s) labeled"
  else
    echo "  ✗ no ai-skills-library labels found"
  fi
done
```

## Adding labels to a new skill

When you build a new skill that ships containers:

1. Add the full schema to every service in your `docker-compose.yml`.
2. Pick a `skill` slug that matches your skill folder name.
3. Pick a `surface` value from the table above (or add a new one and document it here).
4. Verify with `docker compose config | grep ai-skills-library`.
5. Add a row to the [integration checklist](../references/integration-checklist.md).

That's the entire contract. Three lines of OCI labels, three of ours, every container is now first-class in Dockyard.
