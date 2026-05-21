---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: launcher-makefile-shim
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Launcher Makefile Shim
Slug:              launcher-makefile-shim
Pack:              Brokerage prototype (project/brokerage-prototype)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           Add a thin Makefile shim over an existing `./go`-style launcher so `make`, `make go`, `make dev`, `make restart`, `make ports`, `make doctor`, `make build`,…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **launcher-makefile-shim**.
-->

# Launcher Makefile Shim

| | |
|---|---|
| **Slug** | `launcher-makefile-shim` |
| **Pack** | Brokerage prototype |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/project/brokerage-prototype/launcher-makefile-shim` |

## Summary

Add a thin Makefile shim over an existing `./go`-style launcher so `make`, `make go`, `make dev`, `make restart`, `make ports`, `make doctor`, `make build`,…

## Description

Add a thin Makefile shim over an existing `./go`-style launcher so `make`, `make go`, `make dev`, `make restart`, `make ports`, `make doctor`, `make build`, `make clean`, and `make help` all work — without touching the underlying launcher's logic. Includes `.claude/launch.json` for Claude Code Preview integration and a README troubleshooting block.

## Invoke

Use **launcher-makefile-shim**.

## Triggers / keywords

`run-launcher`, `check-makefile`, `build-shim`

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

