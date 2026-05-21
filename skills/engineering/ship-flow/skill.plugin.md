---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: ship-flow
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Ship Flow
Slug:              ship-flow
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0044
Summary:           Run the full commit → push → PR → CI watch → merge → deploy → smoke-test pipeline. Names the pipeline stage at every step. Stops + reports if anything fails…
Author:            marvelousempire
License:           MIT
Requires:          `plan-first-substantive-changes`, `make-check-defense-in-depth`
Invoke:            Use **ship-flow**.
-->

# Ship Flow

| | |
|---|---|
| **Slug** | `ship-flow` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0044 |
| **Path** | `skills/engineering/ship-flow` |

## Summary

Run the full commit → push → PR → CI watch → merge → deploy → smoke-test pipeline. Names the pipeline stage at every step. Stops + reports if anything fails…

## Description

Run the full commit → push → PR → CI watch → merge → deploy → smoke-test pipeline. Names the pipeline stage at every step. Stops + reports if anything fails (CI red, conflict, deploy failure, smoke gap). Pre-authorized for backend/admin/marketing per red-e-play CLAUDE.md.

## Invoke

Use **ship-flow**.

## Triggers / keywords

`open-pr`, `merge-pr`, `verify-deploy`

## Requires (run first)

`plan-first-substantive-changes`, `make-check-defense-in-depth`

## Overlap (related skills)

—

## Philosophy

—

## Files

- [`SKILL.md`](SKILL.md) — agent instructions
- [`skill.plugin.json`](skill.plugin.json) — machine manifest (directory grid)
- This file — human lead sheet (WordPress-style header)

