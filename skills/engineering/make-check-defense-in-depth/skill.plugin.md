---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: make-check-defense-in-depth
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Make Check Defense In Depth
Slug:              make-check-defense-in-depth
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0025
Summary:           Extend `make check` (or any CI gate) so it catches silent-regression bugs beyond just "does the code parse." Verify every file referenced by docs/ Makefile…
Author:            marvelousempire
License:           MIT
Requires:          `plan-first-substantive-changes`
Invoke:            Use **make-check-defense-in-depth**.
-->

# Make Check Defense In Depth

| | |
|---|---|
| **Slug** | `make-check-defense-in-depth` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0025 |
| **Path** | `skills/engineering/make-check-defense-in-depth` |

## Summary

Extend `make check` (or any CI gate) so it catches silent-regression bugs beyond just "does the code parse." Verify every file referenced by docs/ Makefile…

## Description

Extend `make check` (or any CI gate) so it catches silent-regression bugs beyond just "does the code parse." Verify every file referenced by docs/ Makefile actually exists; verify renamed strings have updated consumers (the v0.21.0-class regression); verify Python modules import; verify every script in your library still compiles. Anti-pattern: a `make check` that just runs syntax. Triggers on "make check", "CI gate", "silent regression", "rebrand broke things", "renamed file but didn't update consumers", "test that the install works", "string rename audit", "broken references after refactor".

## Invoke

Use **make-check-defense-in-depth**.

## Triggers / keywords

`run-check`, `verify-references`, `catch-regression`

## Requires (run first)

`plan-first-substantive-changes`

## Overlap (related skills)

—

## Philosophy

—

## Files

- [`SKILL.md`](SKILL.md) — agent instructions
- [`skill.plugin.json`](skill.plugin.json) — machine manifest (directory grid)
- This file — human lead sheet (WordPress-style header)

