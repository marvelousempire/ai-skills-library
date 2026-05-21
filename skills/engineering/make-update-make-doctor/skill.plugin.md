---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: make-update-make-doctor
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Make Update Make Doctor
Slug:              make-update-make-doctor
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0026
Summary:           Every developer-facing tool that ships via `git clone + make` needs two safety-net Makefile targets: `make update` (safely pull latest from main no matter…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **make-update-make-doctor**.
-->

# Make Update Make Doctor

| | |
|---|---|
| **Slug** | `make-update-make-doctor` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0026 |
| **Path** | `skills/engineering/make-update-make-doctor` |

## Summary

Every developer-facing tool that ships via `git clone + make` needs two safety-net Makefile targets: `make update` (safely pull latest from main no matter…

## Description

Every developer-facing tool that ships via `git clone + make` needs two safety-net Makefile targets: `make update` (safely pull latest from main no matter what branch state, refuses with stash/status hints if dirty) and `make doctor` (one-shot diagnostic — branch, git status, version, deps, build state, disk free). Prevents the "git pull says 'no tracking information'" UX paper-cut for non-git-expert users. Triggers on "git pull fails", "no tracking information for the current branch", "user-friendly update command", "make doctor diagnostic", "git workflow paper-cut", "stale branch after squash-merge", "self-update Makefile target".

## Invoke

Use **make-update-make-doctor**.

## Triggers / keywords

`pull-latest`, `diagnose-install`, `check-version`

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

