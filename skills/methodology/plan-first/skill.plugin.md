---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: plan-first
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Plan First
Slug:              plan-first
Pack:              Methodology (methodology)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0118
Summary:           Write the plan to `~/.claude/plans/<title>.md` or `docs/master-plans/` BEFORE substantive work (multi-file changes, architecture decisions, > 50 lines…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **plan-first**.
-->

# Plan First

| | |
|---|---|
| **Slug** | `plan-first` |
| **Pack** | Methodology |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0118 |
| **Path** | `skills/methodology/plan-first` |

## Summary

Write the plan to `~/.claude/plans/<title>.md` or `docs/master-plans/` BEFORE substantive work (multi-file changes, architecture decisions, > 50 lines…

## Description

Write the plan to `~/.claude/plans/<title>.md` or `docs/master-plans/` BEFORE substantive work (multi-file changes, architecture decisions, > 50 lines changed). Triggers on "write a plan", "plan first", "before we ship", "substantive change incoming". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/standards/plan-naming.md`.

## Invoke

Use **plan-first**.

## Triggers / keywords

`write-plan`, `define-scope`, `get-approval`

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

