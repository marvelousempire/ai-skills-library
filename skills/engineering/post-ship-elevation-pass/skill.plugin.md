---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: post-ship-elevation-pass
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Post Ship Elevation Pass
Slug:              post-ship-elevation-pass
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0033
Summary:           After every substantive ship, immediately run two passes before closing the session: (1) GAP AUDIT — list everything incomplete, deferred, fragile, or…
Author:            marvelousempire
License:           MIT
Requires:          `confirm-ship-clearly`
Invoke:            Use **post-ship-elevation-pass**.
-->

# Post Ship Elevation Pass

| | |
|---|---|
| **Slug** | `post-ship-elevation-pass` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0033 |
| **Path** | `skills/engineering/post-ship-elevation-pass` |

## Summary

After every substantive ship, immediately run two passes before closing the session: (1) GAP AUDIT — list everything incomplete, deferred, fragile, or…

## Description

After every substantive ship, immediately run two passes before closing the session: (1) GAP AUDIT — list everything incomplete, deferred, fragile, or untested with the file and function name; (2) ELEVATION PASS — read the user's intent, not just the literal request, and propose the most ambitious version of the feature. Present as two labeled lists. Wait for sign-off before implementing elevations. Triggers on "gap audit", "elevation pass", "what's left after this", "what would the most ambitious version be", "are there gaps", "what did we miss", "elevate this", "what else should we do after shipping".

## Invoke

Use **post-ship-elevation-pass**.

## Triggers / keywords

`audit-gaps`, `propose-elevations`, `wait-approval`

## Requires (run first)

`confirm-ship-clearly`

## Overlap (related skills)

—

## Philosophy

—

## Files

- [`SKILL.md`](SKILL.md) — agent instructions
- [`skill.plugin.json`](skill.plugin.json) — machine manifest (directory grid)
- This file — human lead sheet (WordPress-style header)

