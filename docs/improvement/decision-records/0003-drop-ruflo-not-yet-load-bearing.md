# 0003 — Drop Ruflo (Path A plugins) — not yet load-bearing for this workflow

**Date:** 2026-05-14
**Status:** Accepted
**Context:** brokerage-prototype session — evaluated Ruflo as agent orchestration

## Decision

Uninstall `ruflo-core@ruflo` + `ruflo-federation@ruflo` plugins. Skip Path B (`npx ruvflo init`) which would overwrite `CLAUDE.md` and write `.claude-flow/`. Revisit when there's a 3+ concurrent agent / cross-machine federation need.

## Rationale

- **Path A is a paper tiger for this workflow.** Plugins register marketplace + skills but NOT the MCP server. Every meaningful skill body says "now run this `npx -y @claude-flow/cli@latest ...`" — sandbox-blocked. Memory, swarm coordination, federation calls all fail without MCP.
- **Federation is for cross-machine trust boundaries.** Our pain is two repos on one machine — markdown ledger (`PORTING_NOTES.md`) works fine. Wrong tool, right pitch.
- **~628 always-on tokens per session** for `ruflo-core` (467) + `ruflo-federation` (161) — compounds across every session, every project.
- **Path B would clobber CLAUDE.md** — the carefully tuned multi-agent intake protocol in this repo. Backup-then-init path is doable but adds blast radius.

## When to revisit

- A 3rd repo or 3rd developer enters the rotation, OR
- Cross-machine workflow becomes real, OR
- Docker Desktop is fixed and pulling 32 plugins becomes cheap enough to retry, OR
- `ruflo-swarm` ships as a usable subagent registry that we'd otherwise hand-roll

## What we built instead

- **`PORTING_NOTES.md`** — markdown ledger between brokerage-prototype + family-office-platform (already existed; we built the drift detector on top)
- **`scripts/port-drift.sh`** — pure git+awk drift detection, no LLM cost
- **launchd weekly job** — autonomous schedule, no MCP needed
- **Plan for Tier 2 hand-rolled coordinator** when Tier 1 patterns surface boundaries (see `docs/improvement/elevations-deferred.md`)

## Cleanup action

`claude plugin uninstall ruflo-core ruflo-federation && claude plugin marketplace remove ruflo` — logged in `gaps-open.md` (Elevation H).
