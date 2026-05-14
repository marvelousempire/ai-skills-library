---
name: verification-before-ship
id: RL-0043
keywords: [verification, before, ship]
---

# Run verification gates before any commit to main

## When this fires

Any commit that hits or will hit main.

## What it says

Pass every gate per `docs/standards/verification-gates.md`: count consistency, frontmatter lint, compose label parse, script syntax, link sanity, branch state, origin sync. Use `scripts/check-skill-count.sh`, `scripts/lint-skill-frontmatter.sh`, `scripts/check-cross-references.sh`.

## Examples

### ✓ Compliant

Commit only after all three scripts exit 0.

### ✗ Violation

Pushing without running the gates → count drift, frontmatter drift, broken links.

## Why

Codified from the 2026-05-14 sovereign-stack session. Tracking how this rule was derived: [`docs/improvement/recurring-failures.md`](../../../docs/improvement/recurring-failures.md) and [`docs/improvement/recurring-wins.md`](../../../docs/improvement/recurring-wins.md).

## Related

- **Standard:** [`docs/standards/verification-gates.md`](../../../docs/standards/verification-gates.md) and [`docs/checklists/ship.md`](../../../docs/checklists/ship.md)
- **Checklist:** see `docs/checklists/`
- **Script:** see `scripts/`
