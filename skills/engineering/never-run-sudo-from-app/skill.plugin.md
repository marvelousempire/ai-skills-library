---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: never-run-sudo-from-app
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Never Run Sudo From App
Slug:              never-run-sudo-from-app
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0029
Summary:           Security + UX boundary — when a tool needs elevated privileges (sudo, ownership transfer, system file modification, password unlock), it MUST NOT prompt for…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **never-run-sudo-from-app**.
-->

# Never Run Sudo From App

| | |
|---|---|
| **Slug** | `never-run-sudo-from-app` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0029 |
| **Path** | `skills/engineering/never-run-sudo-from-app` |

## Summary

Security + UX boundary — when a tool needs elevated privileges (sudo, ownership transfer, system file modification, password unlock), it MUST NOT prompt for…

## Description

Security + UX boundary — when a tool needs elevated privileges (sudo, ownership transfer, system file modification, password unlock), it MUST NOT prompt for the user's password itself or use `with administrator privileges`. Instead: show the exact command via native dialog with a Copy button. The OS password prompt in Terminal is the correct consent gate for irreversible operations. Triggers on "sudo from app", "needs admin privileges", "chown recovery", "permission error", "ownership transfer", "irreversible operation", "macOS password prompt", "with administrator privileges", "elevation boundary", "consent gate for permanent change".

## Invoke

Use **never-run-sudo-from-app**.

## Triggers / keywords

`show-command`, `copy-command`, `open-terminal`

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

