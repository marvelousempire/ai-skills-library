---
name: idempotent-commands
id: SK-0115
keywords: [idempotent, commands]
description: Design Makefile + CLI commands so they're safe to re-run forever. `make ui` boots whatever is down + opens the browser, same result every time. Pre-flight checks, pgrep guards, bounded waits. Triggers on "make ui pattern", "one command", "idempotent", "safe to re-run". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/standards/plan-naming.md` and `docs/templates/Makefile.template`.
---

# idempotent-commands — methodology skill

Design Makefile + CLI commands so they're safe to re-run forever. `make ui` boots whatever is down + opens the browser, same result every time. Pre-flight checks, pgrep guards, bounded waits.

## When to use

Triggers: "make ui pattern", "one command", "idempotent", "safe to re-run".

## How

See the canonical reference: `docs/standards/plan-naming.md` and `docs/templates/Makefile.template`.

## Why this exists

Codified from the 2026-05-14 sovereign-stack session. Used repeatedly across SEEME, self-hosted-git, Homelab Console, and Dockyard integration. Logged in [`docs/improvement/recurring-wins.md`](../../../docs/improvement/recurring-wins.md).

## Pairing

- **Standard:** `docs/standards/plan-naming.md` and `docs/templates/Makefile.template`
- **Template (if applicable):** see `docs/templates/`
- **Checklist (if applicable):** see `docs/checklists/`
- **Drill (if applicable):** see `docs/training/drills/`

## Status

Stub. Body to be fleshed out as patterns are exercised in future sessions. Frontmatter is authoritative for agent triggering.
