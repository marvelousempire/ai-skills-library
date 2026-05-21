---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: session-retrospective
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Session Retrospective
Slug:              session-retrospective
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0042
Summary:           Run a structured retrospective on a completed work session to extract rules, skills, docs, context files, and workflow improvements that should be filed into…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **session-retrospective**.
-->

# Session Retrospective

| | |
|---|---|
| **Slug** | `session-retrospective` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0042 |
| **Path** | `skills/engineering/session-retrospective` |

## Summary

Run a structured retrospective on a completed work session to extract rules, skills, docs, context files, and workflow improvements that should be filed into…

## Description

Run a structured retrospective on a completed work session to extract rules, skills, docs, context files, and workflow improvements that should be filed into the AI skills library. Use when the user asks to 'read backward through the conversation,' 'what did we learn,' 'file everything we learned,' 'what can we extract from this session,' 'grow the skills library from this,' 'add to the library from our work,' or 'what rules or skills did this session produce.' Use proactively at the end of any session that hit a meaningful bug, made a non-obvious architectural decision, introduced new vocabulary or copy standards, or had to navigate a multi-step debugging arc. This is the meta-skill that keeps the library growing — every session that doesn't produce at least one library artifact is a session whose lessons evaporate.

## Invoke

Use **session-retrospective**.

## Triggers / keywords

`extract-lessons`, `file-skill`, `update-library`

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

