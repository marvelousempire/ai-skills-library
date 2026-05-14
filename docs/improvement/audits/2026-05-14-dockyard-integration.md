# Gap audit — Dockyard integration

**Date:** 2026-05-14
**Shipped:** `skills/infra/dockyard/` — full skill folder (9 files), labels on every SEEME + GitLab container, Console wired with Dockyard probe + engine badge, 8 cross-reference doc updates
**Commits:** `0561aaa` → `f91e79b`

## Gaps

1. **`SEEME_LONG_CACHE=1` unverified end-to-end** — wiring is correct but no real Anthropic call has confirmed the 1h beta header is accepted.
2. **No `scripts/lint-container-labels.sh`** — labels schema is documented but not automatically enforced. Future skills could ship without labels.
3. **Console's engine detection falls back to "unknown" when Dockyard is down** — could probe `docker context inspect` independently.
4. **Standalone-compose Dockerfile reference is implicit** — `standalone-compose.yml` references `dockyard:latest` but doesn't auto-build if the image isn't present.
5. **MCP wiring doc is per-host** — Claude Desktop config snippet is in the skill, but doesn't auto-install.

## Elevations

A. **`scripts/lint-container-labels.sh`** — automated label schema validator. (planned in `gaps-open.md`)
B. **MCP register_skill self-publish** — once SEEME's MCP is registered with one host, broadcast to others.
C. **`docker context inspect` engine-detection fallback** in the console — no longer depends on Dockyard being up to know which engine is in use.
D. **Auto-build dockyard image on first compose-up** — `standalone-compose.yml` does `build: <upstream clone>` if image not present.
E. **`make migrate-to-colima` target** — wraps the full Docker Desktop → Colima migration from the skill's reference doc.

## Decision

Foundation shipped; A and C are highest-leverage for next session.

## Open items (deferred)

→ `gaps-open.md`: 1, 2, 3
→ `elevations-deferred.md`: A, B, C, D, E

## Linked

- **Plan:** `~/.claude/plans/dockyard-integration.md`
- **Session report:** [`docs/reports/2026-05-14-sovereign-stack-and-master-repo.md`](../../reports/2026-05-14-sovereign-stack-and-master-repo.md)
