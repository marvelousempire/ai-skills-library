---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: data-pipeline-tracer
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Data Pipeline Tracer
Slug:              data-pipeline-tracer
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           Trace end-to-end data flow to find where data is lost between the client and the UI. Use when the user asks: 'trace where data is lost,' 'why are stats zero,'…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **data-pipeline-tracer**.
-->

# Data Pipeline Tracer

| | |
|---|---|
| **Slug** | `data-pipeline-tracer` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/engineering/data-pipeline-tracer` |

## Summary

Trace end-to-end data flow to find where data is lost between the client and the UI. Use when the user asks: 'trace where data is lost,' 'why are stats zero,'…

## Description

Trace end-to-end data flow to find where data is lost between the client and the UI. Use when the user asks: 'trace where data is lost,' 'why are stats zero,' 'iOS data not showing on web,' 'field not reaching the database,' 'trace the data flow,' 'player profile not updating,' 'data written on iOS but not visible on web,' 'sync looks like it worked but data is missing.' Walks through 8 sequential diagnostic steps to identify the exact gap — DB layer, push layer, API layer, serializer, public endpoint, frontend helper, component render, or cache. Returns a diagnosis with the exact broken link and the fix.

## Invoke

Use **data-pipeline-tracer**.

## Triggers / keywords

`run-data`, `check-pipeline`, `build-tracer`

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

