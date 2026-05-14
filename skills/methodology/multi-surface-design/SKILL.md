---
name: multi-surface-design
id: SK-0117
keywords: [multi, surface, design]
description: One engine, many faces. Build the core (`generate()`) once and expose it as CLI + MCP + Web UI + Docker so every user/agent finds the right entry point. Changes propagate; tests cover everything. Triggers on "multi-surface", "one engine many faces", "CLI + MCP + Web UI", "expose this for agents". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/workflows/multi-surface-build.md`.
---

# multi-surface-design — methodology skill

One engine, many faces. Build the core (`generate()`) once and expose it as CLI + MCP + Web UI + Docker so every user/agent finds the right entry point. Changes propagate; tests cover everything.

## When to use

Triggers: "multi-surface", "one engine many faces", "CLI + MCP + Web UI", "expose this for agents".

## How

See the canonical reference: `docs/workflows/multi-surface-build.md`.

## Why this exists

Codified from the 2026-05-14 sovereign-stack session. Used repeatedly across SEEME, self-hosted-git, Homelab Console, and Dockyard integration. Logged in [`docs/improvement/recurring-wins.md`](../../../docs/improvement/recurring-wins.md).

## Pairing

- **Standard:** `docs/workflows/multi-surface-build.md`
- **Template (if applicable):** see `docs/templates/`
- **Checklist (if applicable):** see `docs/checklists/`
- **Drill (if applicable):** see `docs/training/drills/`

## Status

Stub. Body to be fleshed out as patterns are exercised in future sessions. Frontmatter is authoritative for agent triggering.
