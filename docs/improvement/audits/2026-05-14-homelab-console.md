# Gap audit — Homelab Console

**Date:** 2026-05-14
**Shipped:** `skills/infra/console/` — server.ts + index.html + Makefile (`make ui`) + serve.sh + SKILL.md + README
**Commits:** `b7af767` → `956f9e1`

## Gaps

1. **Console doesn't read Docker labels via engine API directly** — relies on Dockyard's `/api/version` for engine detection. If Dockyard is down, engine name = "unknown" until Dockyard comes back. Console could probe `docker context inspect` itself.
2. **No `make stats` aggregator** — `seeme stats` exists, but a console-wide stats view (token spend across all services, container uptime) would tie everything together.
3. **Engine badge in footer doesn't update without page reload** — needs WebSocket or SSE for live update. Currently 15s poll on `/api/status`.
4. **"Open in Dockyard" deep-link per service card** — `/api/status` returns the data but the UI only shows top-level links.
5. **`make start` boots GitLab CE blindly** — if `GITLAB_HOSTNAME` is unset, the target silently skips. Should be louder.

## Elevations

A. **Engine-swap automation** — `make migrate-to-colima` target wraps the full Docker Desktop → Colima migration from `dockyard/references/`.
B. **Console as MCP server** — agents could query `/api/status` via an MCP tool: "What's running on my homelab?"
C. **Live log tail in the console** — embed an iframe that tails `docker compose logs`.
D. **Per-skill `make start` rollups** — currently the console boots everything; let it boot a named subset.

## Decision

`make ui` shipped with all five surfaces probed; gaps deferred.

## Open items (deferred)

→ `gaps-open.md`: 1, 2, 4
→ `elevations-deferred.md`: A, B, C, D

## Linked

- **Plan:** ad-hoc mid-session
- **Session report:** [`docs/reports/2026-05-14-sovereign-stack-and-master-repo.md`](../../reports/2026-05-14-sovereign-stack-and-master-repo.md)
