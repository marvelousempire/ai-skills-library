---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: verify-ship
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Verify Ship
Slug:              verify-ship
Pack:              Red-E Play (project/red-e-play)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0124
Summary:           Audit whether work has actually shipped — committed, pushed, merged, deployed. Use when the user asks variants of "did it ship", "is it on origin", "are we…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **verify-ship**.
-->

# Verify Ship

| | |
|---|---|
| **Slug** | `verify-ship` |
| **Pack** | Red-E Play |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0124 |
| **Path** | `skills/project/red-e-play/verify-ship` |

## Summary

Audit whether work has actually shipped — committed, pushed, merged, deployed. Use when the user asks variants of "did it ship", "is it on origin", "are we…

## Description

Audit whether work has actually shipped — committed, pushed, merged, deployed. Use when the user asks variants of "did it ship", "is it on origin", "are we backed up", "did we merge", "is this in main yet", "is the build live", "is the redesign deployed", "show me the state". Returns a concrete table of git state + PR state + version on each surface so the user can confirm at a glance instead of getting piecemeal answers.

## Invoke

Use **verify-ship**.

## Triggers / keywords

`verify-ship`, `check-deploy`, `confirm-release`

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

