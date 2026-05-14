---
name: doctor-script-pattern
id: SK-0111
keywords: [run-doctor, diagnose-system, report-health]
hash: 2341917
relations: []
before: []
governed_by: [global]
meta: dynamic
description: Every infra skill ships a doctor (`make doctor` or `scripts/doctor.sh`) that runs read-only health probes with color-coded output. Disk + Docker + engine + per-service. Exit codes: 0 green, 1 red, 2 yellow. Triggers on "doctor script", "health probes", "is the stack healthy". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/standards/doctor-script.md` and `docs/templates/doctor.sh.template`.
---

# doctor-script-pattern — methodology skill

Every infra skill ships a doctor (`make doctor` or `scripts/doctor.sh`) that runs read-only health probes with color-coded output. Disk + Docker + engine + per-service. Exit codes: 0 green, 1 red, 2 yellow.

## When to use

Triggers: "doctor script", "health probes", "is the stack healthy".

## How

See the canonical reference: `docs/standards/doctor-script.md` and `docs/templates/doctor.sh.template`.

## Why this exists

Codified from the 2026-05-14 sovereign-stack session. Used repeatedly across SEEME, self-hosted-git, Homelab Console, and Dockyard integration. Logged in [`docs/improvement/recurring-wins.md`](../../../docs/improvement/recurring-wins.md).

## Pairing

- **Standard:** `docs/standards/doctor-script.md` and `docs/templates/doctor.sh.template`
- **Template (if applicable):** see `docs/templates/`
- **Checklist (if applicable):** see `docs/checklists/`
- **Drill (if applicable):** see `docs/training/drills/`

## Status

Stub. Body to be fleshed out as patterns are exercised in future sessions. Frontmatter is authoritative for agent triggering.
