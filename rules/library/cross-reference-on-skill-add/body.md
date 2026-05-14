---
name: cross-reference-on-skill-add
id: RL-0009
keywords: [update-index, ripple-references, sync-catalog]
hash: 999c8b9
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# When adding a skill, ripple every dependent index

## When this fires

A new skill is being added to `skills/<family>/<slug>/`.

## What it says

Within the same commit, update: SKILL-INDEX.md (count + new row), root README.md (Fast Navigation row + AI Routing Cheat Sheet row + new family section if applicable), `skills/<family>/README.md` (family catalog row), and yousirjuan docs (if anchored to a platform category).

## Examples

### ✓ Compliant

The seeme + dockyard commits both demonstrate full rippling.

### ✗ Violation

Skill folder added but SKILL-INDEX.md count not bumped → caught by `scripts/check-skill-count.sh`.

## Why

Codified from the 2026-05-14 sovereign-stack session. Tracking how this rule was derived: [`docs/improvement/recurring-failures.md`](../../../docs/improvement/recurring-failures.md) and [`docs/improvement/recurring-wins.md`](../../../docs/improvement/recurring-wins.md).

## Related

- **Standard:** [`docs/standards/cross-references.md`](../../../docs/standards/cross-references.md) and [`docs/checklists/cross-reference.md`](../../../docs/checklists/cross-reference.md)
- **Checklist:** see `docs/checklists/`
- **Script:** see `scripts/`
