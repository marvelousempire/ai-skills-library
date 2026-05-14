# Integration checklist — per-stack compliance with the Dockyard label contract

Snapshot of which library stacks ship the full [label schema](../templates/labels-reference.md). Update this file every time a stack changes or a new stack ships.

## Compliance matrix

| Skill | File | OCI title | OCI source | OCI description | skill | surface | url | Status |
|---|---|---|---|---|---|---|---|---|
| `seeme` | `skills/visual/diagrams/seeme/docker-compose.yml` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (web-ui, engine; omitted for init) | **Compliant** |
| `self-hosted-git` | `skills/infra/self-hosted-git/templates/gitlab-compose.yml` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (git-platform, reverse-proxy; omitted for ci-runner) | **Compliant** |
| `dockyard` | `skills/infra/dockyard/templates/standalone-compose.yml` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **Compliant** |

## Per-service detail

### `seeme` (3 services)

| Service | Container name | Surface | URL |
|---|---|---|---|
| `ollama` | `seeme-ollama` | `engine` | `http://localhost:11434` |
| `ollama-init` | `seeme-ollama-init` | `init` | (none — exits on completion) |
| `seeme` | `seeme-ui` | `web-ui` | `http://localhost:7777` |

### `self-hosted-git` (3 services)

| Service | Container name | Surface | URL |
|---|---|---|---|
| `gitlab` | `gitlab` | `git-platform` | `https://${GITLAB_HOSTNAME}` |
| `caddy` | `gitlab-caddy` | `reverse-proxy` | `https://${GITLAB_HOSTNAME}` |
| `runner` | `gitlab-runner` | `ci-runner` | (none — daemon) |

### `dockyard` (1 service)

| Service | Container name | Surface | URL |
|---|---|---|---|
| `dockyard` | `dockyard` | `dock-ui` | `http://localhost:4321` |

## How to add a new skill to the checklist

When you build a new skill that ships containers:

1. Apply the [label schema](../templates/labels-reference.md) to every service in its compose file.
2. Validate: `docker compose -f <path> config | grep -c ai-skills-library.skill` should equal the service count.
3. Add a row to the compliance matrix above.
4. Add a per-service-detail subsection.
5. Bump this checklist's date if you keep one.

## Common issues

| Symptom | Cause | Fix |
|---|---|---|
| Container shows with the image name in Dockyard, not the title | Missing `org.opencontainers.image.title` | Add it. |
| Container appears in "Other" / no Compose project | The Compose project name wasn't set — `docker compose` derives it from the folder name. | Run `docker compose -p <name> up` or rename the folder. |
| URL button missing in Dockyard | `ai-skills-library.url` missing | Add it (or confirm it's intentionally omitted for `engine`/`init`/`ci-runner`). |
| Labels don't show up after `docker compose up` | Labels added but container wasn't recreated | `docker compose up -d --force-recreate <service>` |
| `docker compose config` shows labels but Dockyard doesn't render them | Dockyard may need a refresh. | Hit the refresh button in the UI; if still missing, check `docker inspect <container> | grep Labels` to confirm the label is actually on the container. |

## Verification one-liner

```sh
for f in \
  skills/visual/diagrams/seeme/docker-compose.yml \
  skills/infra/self-hosted-git/templates/gitlab-compose.yml \
  skills/infra/dockyard/templates/standalone-compose.yml ; do
  count=$(docker compose -f "$f" config 2>/dev/null | grep -c 'ai-skills-library.skill')
  printf "%s   ai-skills-library.skill x %d\n" "$f" "$count"
done
```

Expected output:

```
skills/visual/diagrams/seeme/docker-compose.yml   ai-skills-library.skill x 3
skills/infra/self-hosted-git/templates/gitlab-compose.yml   ai-skills-library.skill x 3
skills/infra/dockyard/templates/standalone-compose.yml   ai-skills-library.skill x 1
```
