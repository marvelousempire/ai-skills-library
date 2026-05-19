---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: fork-divergence-tracker
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Fork Divergence Tracker
Slug:              fork-divergence-tracker
Pack:              Methodology (methodology)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           When a project is a fork of an upstream that ships rapidly, build a "symlink + rsync hybrid" tracker so the fork knows when upstream changes AND maintains a…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **fork-divergence-tracker**.
-->

# Fork Divergence Tracker

| | |
|---|---|
| **Slug** | `fork-divergence-tracker` |
| **Pack** | Methodology |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/methodology/fork-divergence-tracker` |

## Summary

When a project is a fork of an upstream that ships rapidly, build a "symlink + rsync hybrid" tracker so the fork knows when upstream changes AND maintains a…

## Description

When a project is a fork of an upstream that ships rapidly, build a "symlink + rsync hybrid" tracker so the fork knows when upstream changes AND maintains a curated ledger of its own deviations. Two surfaces: UPSTREAM_TRACKER.md (auto-refreshed live snapshot) + WE_DIFFER_HERE.md (curated narrative). One daily GitHub Action keeps both honest. Triggers on "fork tracking", "shadow upstream", "track fork divergence", "we forked X and want to know when X changes".

## Invoke

Use **fork-divergence-tracker**.

## Triggers / keywords

`Use fork-divergence-tracker`

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

