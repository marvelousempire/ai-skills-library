---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: migration-guide-format
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Migration Guide Format
Slug:              migration-guide-format
Pack:              Methodology (methodology)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0116
Summary:           When swapping one tool for another (Docker Desktop → Colima, Forgejo → GitLab CE), write a step-by-step migration guide at…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **migration-guide-format**.
-->

# Migration Guide Format

| | |
|---|---|
| **Slug** | `migration-guide-format` |
| **Pack** | Methodology |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0116 |
| **Path** | `skills/methodology/migration-guide-format` |

## Summary

When swapping one tool for another (Docker Desktop → Colima, Forgejo → GitLab CE), write a step-by-step migration guide at…

## Description

When swapping one tool for another (Docker Desktop → Colima, Forgejo → GitLab CE), write a step-by-step migration guide at `skills/<family>/<slug>/references/switching-from-<old>.md` covering: preserve vs migrate, pre-flight, backup, install new, switch, verify, reclaim space, rollback. Triggers on "migration guide", "switching from X to Y", "rip and replace". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/templates/migration-guide.md.template` and `docs/workflows/rip-and-replace-a-tool.md`.

## Invoke

Use **migration-guide-format**.

## Triggers / keywords

`write-migration`, `document-steps`, `format-guide`

## Requires (run first)

—

## Overlap (related skills)

—

## Philosophy

—

## Files

- [`SKILL.md`](SKILL.md) — agent instructions
- [`skill.plugin.json`](skill.plugin.json) — machine manifest (directory grid)
- This file — human lead sheet (WordPress-style header)

