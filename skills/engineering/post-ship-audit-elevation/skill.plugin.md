---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: post-ship-audit-elevation
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Post Ship Audit Elevation
Slug:              post-ship-audit-elevation
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0032
Summary:           After every substantive PR merges, run a 2-pass audit: (1) Gap pass — what's incomplete, deferred, fragile, untested in what just shipped; (2) Elevation pass…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **post-ship-audit-elevation**.
-->

# Post Ship Audit Elevation

| | |
|---|---|
| **Slug** | `post-ship-audit-elevation` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0032 |
| **Path** | `skills/engineering/post-ship-audit-elevation` |

## Summary

After every substantive PR merges, run a 2-pass audit: (1) Gap pass — what's incomplete, deferred, fragile, untested in what just shipped; (2) Elevation pass…

## Description

After every substantive PR merges, run a 2-pass audit: (1) Gap pass — what's incomplete, deferred, fragile, untested in what just shipped; (2) Elevation pass — what would the most ambitious version of this feature look like. Present as numbered lists; wait for user pick before implementing.

## Invoke

Use **post-ship-audit-elevation**.

## Triggers / keywords

`audit-ship`, `elevate-output`, `file-findings`

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

