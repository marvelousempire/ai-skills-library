---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: diagnosis-report
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Diagnosis Report
Slug:              diagnosis-report
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           Create a structured diagnosis document for a system failure, data pipeline issue, or recurring bug. Use when the user asks: 'write a diagnosis report,'…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **diagnosis-report**.
-->

# Diagnosis Report

| | |
|---|---|
| **Slug** | `diagnosis-report` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/engineering/diagnosis-report` |

## Summary

Create a structured diagnosis document for a system failure, data pipeline issue, or recurring bug. Use when the user asks: 'write a diagnosis report,'…

## Description

Create a structured diagnosis document for a system failure, data pipeline issue, or recurring bug. Use when the user asks: 'write a diagnosis report,' 'document what we found,' 'record the root cause,' 'file an incident report,' 'make a post-mortem,' 'document this bug for the team,' 'save what we learned about this failure,' 'create a diagnosis doc for the admin,' 'document the game sync issue,' 'record root causes.' Also use after any SSH-level investigation that revealed multiple root causes. Files the report where operators can read it and includes DB state at time of diagnosis, numbered root causes with code evidence, a resolution checklist, and verification commands.

## Invoke

Use **diagnosis-report**.

## Triggers / keywords

`run-diagnosis`, `check-report`, `file-diagnosis`

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

