---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: colima-docker-swap
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Colima Docker Swap
Slug:              colima-docker-swap
Pack:              Brokerage prototype (project/brokerage-prototype)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           Detect a wedged Docker Desktop on macOS Tahoe + Apple Silicon and swap in Colima as the docker runtime — native arm64, same docker socket, no Electron VM.…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **colima-docker-swap**.
-->

# Colima Docker Swap

| | |
|---|---|
| **Slug** | `colima-docker-swap` |
| **Pack** | Brokerage prototype |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/project/brokerage-prototype/colima-docker-swap` |

## Summary

Detect a wedged Docker Desktop on macOS Tahoe + Apple Silicon and swap in Colima as the docker runtime — native arm64, same docker socket, no Electron VM.…

## Description

Detect a wedged Docker Desktop on macOS Tahoe + Apple Silicon and swap in Colima as the docker runtime — native arm64, same docker socket, no Electron VM. Installs colima + lima as direct binaries to `~/.local/bin/` (no brew, no sudo) when Homebrew is broken. Pairs with Dockyard for the UI. Use when `docker info` hangs, Docker Desktop won't start, or the user says "Docker is broken / I don't see anything in Docker."

## Invoke

Use **colima-docker-swap**.

## Triggers / keywords

`Use colima-docker-swap`

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

