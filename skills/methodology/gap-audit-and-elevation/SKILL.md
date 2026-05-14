---
name: gap-audit-and-elevation
id: SK-0113
keywords: [audit-gaps, propose-elevations, file-audit]
hash: e3563ad
relations: [post-ship-elevation-pass, failure-proof-audit]
before: []
governed_by: [global]
meta: dynamic
description: After every meaningful ship, run the gap audit (specific incomplete items, named) + elevation pass (ambitious extensions). File the audit at `docs/improvement/audits/<date>-<scope>.md` and append open items to `gaps-open.md` / `elevations-deferred.md`. Triggers on "audit the gaps", "after-ship audit", "what's left to close", "propose elevations". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/workflows/audit-and-elevate.md`.
---

# gap-audit-and-elevation — methodology skill

After every meaningful ship, run the gap audit (specific incomplete items, named) + elevation pass (ambitious extensions). File the audit at `docs/improvement/audits/<date>-<scope>.md` and append open items to `gaps-open.md` / `elevations-deferred.md`.

## When to use

Triggers: "audit the gaps", "after-ship audit", "what's left to close", "propose elevations".

## How

See the canonical reference: `docs/workflows/audit-and-elevate.md`.

## Why this exists

Codified from the 2026-05-14 sovereign-stack session. Used repeatedly across SEEME, self-hosted-git, Homelab Console, and Dockyard integration. Logged in [`docs/improvement/recurring-wins.md`](../../../docs/improvement/recurring-wins.md).

## Pairing

- **Standard:** `docs/workflows/audit-and-elevate.md`
- **Template (if applicable):** see `docs/templates/`
- **Checklist (if applicable):** see `docs/checklists/`
- **Drill (if applicable):** see `docs/training/drills/`

## Status

Stub. Body to be fleshed out as patterns are exercised in future sessions. Frontmatter is authoritative for agent triggering.
