---
name: migration-guide-format
id: SK-0116
keywords: [write-migration, document-steps, format-guide]
hash: 5690e57
relations: []
before: []
governed_by: [global]
meta: dynamic
description: When swapping one tool for another (Docker Desktop → Colima, Forgejo → GitLab CE), write a step-by-step migration guide at `skills/<family>/<slug>/references/switching-from-<old>.md` covering: preserve vs migrate, pre-flight, backup, install new, switch, verify, reclaim space, rollback. Triggers on "migration guide", "switching from X to Y", "rip and replace". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/templates/migration-guide.md.template` and `docs/workflows/rip-and-replace-a-tool.md`.
---

# migration-guide-format — methodology skill

When swapping one tool for another (Docker Desktop → Colima, Forgejo → GitLab CE), write a step-by-step migration guide at `skills/<family>/<slug>/references/switching-from-<old>.md` covering: preserve vs migrate, pre-flight, backup, install new, switch, verify, reclaim space, rollback.

## When to use

Triggers: "migration guide", "switching from X to Y", "rip and replace".

## How

See the canonical reference: `docs/templates/migration-guide.md.template` and `docs/workflows/rip-and-replace-a-tool.md`.

## Why this exists

Codified from the 2026-05-14 sovereign-stack session. Used repeatedly across SEEME, self-hosted-git, Homelab Console, and Dockyard integration. Logged in [`docs/improvement/recurring-wins.md`](../../../docs/improvement/recurring-wins.md).

## Pairing

- **Standard:** `docs/templates/migration-guide.md.template` and `docs/workflows/rip-and-replace-a-tool.md`
- **Template (if applicable):** see `docs/templates/`
- **Checklist (if applicable):** see `docs/checklists/`
- **Drill (if applicable):** see `docs/training/drills/`

## Status

Stub. Body to be fleshed out as patterns are exercised in future sessions. Frontmatter is authoritative for agent triggering.
