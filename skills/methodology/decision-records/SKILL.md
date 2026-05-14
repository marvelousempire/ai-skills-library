---
name: decision-records
id: SK-0110
keywords: [decision, records]
description: When picking A over B (Forgejo vs GitLab CE, Colima vs Docker Desktop, etc.), write a decision record at `skills/<family>/<slug>/references/<X-vs-Y>.md` with options, pros/cons, decision, rationale, trigger for revisiting, cost of being wrong. Index in `decision-records/INDEX.md`. Triggers on "pick A or B", "why this not that", "decision record". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/templates/decision-record.md.template`.
---

# decision-records — methodology skill

When picking A over B (Forgejo vs GitLab CE, Colima vs Docker Desktop, etc.), write a decision record at `skills/<family>/<slug>/references/<X-vs-Y>.md` with options, pros/cons, decision, rationale, trigger for revisiting, cost of being wrong. Index in `decision-records/INDEX.md`.

## When to use

Triggers: "pick A or B", "why this not that", "decision record".

## How

See the canonical reference: `docs/templates/decision-record.md.template`.

## Why this exists

Codified from the 2026-05-14 sovereign-stack session. Used repeatedly across SEEME, self-hosted-git, Homelab Console, and Dockyard integration. Logged in [`docs/improvement/recurring-wins.md`](../../../docs/improvement/recurring-wins.md).

## Pairing

- **Standard:** `docs/templates/decision-record.md.template`
- **Template (if applicable):** see `docs/templates/`
- **Checklist (if applicable):** see `docs/checklists/`
- **Drill (if applicable):** see `docs/training/drills/`

## Status

Stub. Body to be fleshed out as patterns are exercised in future sessions. Frontmatter is authoritative for agent triggering.
