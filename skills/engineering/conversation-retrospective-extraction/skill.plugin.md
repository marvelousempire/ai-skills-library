---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: conversation-retrospective-extraction
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Conversation Retrospective Extraction
Slug:              conversation-retrospective-extraction
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0017
Summary:           After any substantive Claude conversation — a build session, a design sprint, a debugging arc — read the full conversation backward, extract every reusable…
Author:            marvelousempire
License:           MIT
Requires:          `skill-nutrients-decanter`
Invoke:            Use **conversation-retrospective-extraction**.
-->

# Conversation Retrospective Extraction

| | |
|---|---|
| **Slug** | `conversation-retrospective-extraction` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0017 |
| **Path** | `skills/engineering/conversation-retrospective-extraction` |

## Summary

After any substantive Claude conversation — a build session, a design sprint, a debugging arc — read the full conversation backward, extract every reusable…

## Description

After any substantive Claude conversation — a build session, a design sprint, a debugging arc — read the full conversation backward, extract every reusable lesson, and file each finding into the correct structure inside the AI Skills Library repo: skills, rules, context files, agents, templates, docs, checklists, workflows, and repo standards. Produces a fully-delivered master report that makes the team permanently better. Never leaves lessons loose, vague, unnamed, or unfiled. Triggers on "extract lessons from this conversation", "what can we add to the skills library", "grow the library from what we built", "file what we learned", "skills library retrospective", "master report from this session", "what should become a skill from this", "knowledge extraction from chat".

## Invoke

Use **conversation-retrospective-extraction**.

## Triggers / keywords

`read-conversation`, `classify-finding`, `file-skill`

## Requires (run first)

`skill-nutrients-decanter`

## Overlap (related skills)

—

## Philosophy

—

## Files

- [`SKILL.md`](SKILL.md) — agent instructions
- [`skill.plugin.json`](skill.plugin.json) — machine manifest (directory grid)
- This file — human lead sheet (WordPress-style header)

