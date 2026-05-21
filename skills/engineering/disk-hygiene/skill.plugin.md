---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: disk-hygiene
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Disk Hygiene
Slug:              disk-hygiene
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           Reclaim disk space by auditing and cleaning stale worktrees, node_modules, build artifacts, and Xcode DerivedData. Use when the user reports: 'disk full,' 'no…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **disk-hygiene**.
-->

# Disk Hygiene

| | |
|---|---|
| **Slug** | `disk-hygiene` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/engineering/disk-hygiene` |

## Summary

Reclaim disk space by auditing and cleaning stale worktrees, node_modules, build artifacts, and Xcode DerivedData. Use when the user reports: 'disk full,' 'no…

## Description

Reclaim disk space by auditing and cleaning stale worktrees, node_modules, build artifacts, and Xcode DerivedData. Use when the user reports: 'disk full,' 'no space left,' '99% disk,' 'out of disk,' 'xcodebuild failed with no space,' 'clear worktrees,' 'node_modules taking space,' 'clean up stale branches,' 'too many worktrees,' 'disk is almost full on VPS.' Also use proactively before triggering any iOS build if disk usage is above 80%. Returns a before/after disk report and a list of what was removed.

## Invoke

Use **disk-hygiene**.

## Triggers / keywords

`run-disk`, `check-hygiene`, `file-disk`

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

