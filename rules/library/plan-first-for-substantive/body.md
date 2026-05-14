---
name: plan-first-for-substantive
id: RL-0032
keywords: [enforce-plan, check-first, build-substantive]
goal: Deliver plan first for substantive output correctly and completely.
hash: 237de62
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Plan first for substantive changes

## When this fires

Any change that touches > 2 files, adds a new feature / subsystem / sub-app, changes architecture, modifies behavior other code depends on, or could reasonably affect > 50 lines.

## What it says

Write a plan at `~/.claude/plans/<title>.md` BEFORE writing code. Use the template at `docs/templates/PLAN.md.template`. Plan must include: Context, Goals, Tasks (with verification per task), Critical files, Verification gates, Out of scope, Recovery.

## Examples

### ✓ Compliant

User says "add SEEME web UI" → agent writes `~/.claude/plans/seeme-web-ui.md` first, then implements.

### ✗ Violation

Agent jumps straight to coding without writing a plan.

## Why

Codified from the 2026-05-14 sovereign-stack session. Tracking how this rule was derived: [`docs/improvement/recurring-failures.md`](../../../docs/improvement/recurring-failures.md) and [`docs/improvement/recurring-wins.md`](../../../docs/improvement/recurring-wins.md).

## Related

- **Standard:** [`docs/standards/plan-naming.md`](../../../docs/standards/plan-naming.md)
- **Checklist:** see `docs/checklists/`
- **Script:** see `scripts/`
