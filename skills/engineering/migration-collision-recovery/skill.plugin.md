---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: migration-collision-recovery
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Migration Collision Recovery
Slug:              migration-collision-recovery
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           Recover from a database migration number collision — two migration files sharing the same numeric prefix. Use when: 'migration number collision,' 'duplicate…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **migration-collision-recovery**.
-->

# Migration Collision Recovery

| | |
|---|---|
| **Slug** | `migration-collision-recovery` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/engineering/migration-collision-recovery` |

## Summary

Recover from a database migration number collision — two migration files sharing the same numeric prefix. Use when: 'migration number collision,' 'duplicate…

## Description

Recover from a database migration number collision — two migration files sharing the same numeric prefix. Use when: 'migration number collision,' 'duplicate migration prefix,' 'guard check failed on migration,' 'CI is failing on migration uniqueness check,' 'two migrations with the same number,' 'migration file conflict,' 'next-migration-number gave me a number that's already taken.' Also use proactively whenever you discover a collision during a rebase or PR review. Returns renamed files, updated references, and a clean commit.

## Invoke

Use **migration-collision-recovery**.

## Triggers / keywords

`Use migration-collision-recovery`

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

