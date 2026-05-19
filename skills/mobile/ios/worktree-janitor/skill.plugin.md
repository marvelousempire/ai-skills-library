---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: worktree-janitor
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Worktree Janitor
Slug:              worktree-janitor
Pack:              iOS (mobile/ios)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           Audit, clean, and reclaim disk space from stale git worktrees in a multi-agent monorepo. Triggered by "clean up worktrees", "free disk space", "worktrees are…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **worktree-janitor**.
-->

# Worktree Janitor

| | |
|---|---|
| **Slug** | `worktree-janitor` |
| **Pack** | iOS |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/mobile/ios/worktree-janitor` |

## Summary

Audit, clean, and reclaim disk space from stale git worktrees in a multi-agent monorepo. Triggered by "clean up worktrees", "free disk space", "worktrees are…

## Description

Audit, clean, and reclaim disk space from stale git worktrees in a multi-agent monorepo. Triggered by "clean up worktrees", "free disk space", "worktrees are full", "remove stale branches", "disk is full before build", or proactively when disk < 3 GB before any iOS build. Identifies merged branches, removes them safely, frees DerivedData, and reports space gained.

## Invoke

Use **worktree-janitor**.

## Triggers / keywords

`Use worktree-janitor`

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

