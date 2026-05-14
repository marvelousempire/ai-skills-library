---
name: skill-frontmatter
id: RL-0039
keywords: [skill, frontmatter]
---

# Every SKILL.md has valid frontmatter

## When this fires

A SKILL.md is being authored or edited.

## What it says

Frontmatter MUST have: `name:` exactly matching the folder slug, and `description:` containing a paragraph with trigger phrases (the word "Triggers on" or "Use when" plus 2+ example phrases the user might say).

## Examples

### ✓ Compliant

`name: dockyard` + `description: ... Triggers on "set up Dockyard", "use Dockyard with ai-skills-library", "Docker UI", ...`

### ✗ Violation

`name: Dockyard` (capitalized — must match folder which is lowercase) or `description: A skill for X.` (too short, no triggers).

## Why

Codified from the 2026-05-14 sovereign-stack session. Tracking how this rule was derived: [`docs/improvement/recurring-failures.md`](../../../docs/improvement/recurring-failures.md) and [`docs/improvement/recurring-wins.md`](../../../docs/improvement/recurring-wins.md).

## Related

- **Standard:** [`docs/standards/frontmatter.md`](../../../docs/standards/frontmatter.md)
- **Checklist:** see `docs/checklists/`
- **Script:** see `scripts/`
