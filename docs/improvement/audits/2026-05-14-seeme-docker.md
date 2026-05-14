# Gap audit — SEEME Docker setup

**Date:** 2026-05-14
**Shipped:** Dockerfile + docker-compose.yml + docker/entrypoint.sh + docker/README.md
**Scope:** Containerizing SEEME for one-command deploy

## Gaps

1. **Docker build untested end-to-end** — local Docker daemon hung 3× during the session. Compose + Dockerfile syntax is correct but build never completed.
2. **No multi-arch build** — Dockerfile targets the host arch only. ARM64 (Mac mini) + AMD64 (cloud) builds would need `buildx`.
3. **Image not pushed to a registry** — local-only.
4. **Healthcheck endpoint `/health` not yet implemented** in `src/server.ts` — compose file references it.

## Elevations

A. **Auto-push to GitLab Container Registry** via CI when GitLab CE comes online (now possible via the new self-hosted-git skill).
B. **Image-size optimization** — multi-stage with `node:24-alpine` could cut ~50 MB.
C. **`docker compose up` becomes part of `make ui`** when an MCP host wants SEEME containerized too.

## Decision

Compose + Dockerfile ship as code; verification deferred until disk space + Docker daemon health are restored.

## Open items (deferred)

→ `gaps-open.md`: 1, 2, 4
→ `elevations-deferred.md`: A, B

## Linked

- **Plan:** mid-session inline (no plan file written for this sub-pass)
- **Session report:** [`docs/reports/2026-05-14-sovereign-stack-and-master-repo.md`](../../reports/2026-05-14-sovereign-stack-and-master-repo.md)
