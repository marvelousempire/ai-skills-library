---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: confirm-ship-clearly
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Confirm Ship Clearly
Slug:              confirm-ship-clearly
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0016
Summary:           Every shipping confirmation must be unambiguous. Show all four: release tag, PR state+mergedAt, commit hash on main, and kVersion in the canonical file. Never…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **confirm-ship-clearly**.
-->

# Confirm Ship Clearly

| | |
|---|---|
| **Slug** | `confirm-ship-clearly` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0016 |
| **Path** | `skills/engineering/confirm-ship-clearly` |

## Summary

Every shipping confirmation must be unambiguous. Show all four: release tag, PR state+mergedAt, commit hash on main, and kVersion in the canonical file. Never…

## Description

Every shipping confirmation must be unambiguous. Show all four: release tag, PR state+mergedAt, commit hash on main, and kVersion in the canonical file. Never say "it should be shipped" or "the merge went through" — show the receipts. Triggers on "is it shipped", "confirm delivery", "did it merge", "verify it went through", "show me the release", "is the tag fired", "confirm ship state", "check if it landed".

## Invoke

Use **confirm-ship-clearly**.

## Triggers / keywords

`check-tag`, `verify-merge`, `show-receipts`

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

