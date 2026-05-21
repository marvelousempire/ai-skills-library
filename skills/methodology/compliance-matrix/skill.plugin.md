---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: compliance-matrix
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Compliance Matrix
Slug:              compliance-matrix
Pack:              Methodology (methodology)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0108
Summary:           Per-stack / per-X compliance snapshots in markdown tables. Update on every change to ensure no stack drifts off the contract (label schema, frontmatter,…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **compliance-matrix**.
-->

# Compliance Matrix

| | |
|---|---|
| **Slug** | `compliance-matrix` |
| **Pack** | Methodology |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0108 |
| **Path** | `skills/methodology/compliance-matrix` |

## Summary

Per-stack / per-X compliance snapshots in markdown tables. Update on every change to ensure no stack drifts off the contract (label schema, frontmatter,…

## Description

Per-stack / per-X compliance snapshots in markdown tables. Update on every change to ensure no stack drifts off the contract (label schema, frontmatter, doctor presence, etc.). Triggers on "compliance check", "per-stack matrix", "which stacks have X". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/templates/integration-checklist.md.template` and `skills/infra/dockyard/references/integration-checklist.md`.

## Invoke

Use **compliance-matrix**.

## Triggers / keywords

`build-matrix`, `track-compliance`, `verify-rule`

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

