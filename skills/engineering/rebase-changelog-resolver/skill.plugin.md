---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: rebase-changelog-resolver
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Rebase Changelog Resolver
Slug:              rebase-changelog-resolver
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0037
Summary:           Auto-resolve CHANGELOG.md merge conflicts during rebase by keeping both entries with newest-first ordering. Pattern is mechanical — every PR adds an entry at…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **rebase-changelog-resolver**.
-->

# Rebase Changelog Resolver

| | |
|---|---|
| **Slug** | `rebase-changelog-resolver` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0037 |
| **Path** | `skills/engineering/rebase-changelog-resolver` |

## Summary

Auto-resolve CHANGELOG.md merge conflicts during rebase by keeping both entries with newest-first ordering. Pattern is mechanical — every PR adds an entry at…

## Description

Auto-resolve CHANGELOG.md merge conflicts during rebase by keeping both entries with newest-first ordering. Pattern is mechanical — every PR adds an entry at the top, so every rebase produces the same shape of conflict. Tested 3 times in the trainer-marketplace session.

## Invoke

Use **rebase-changelog-resolver**.

## Triggers / keywords

`rebase-branch`, `resolve-conflict`, `update-changelog`

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

