---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: ai-proposal-review-inbox
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Ai Proposal Review Inbox
Slug:              ai-proposal-review-inbox
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0001
Summary:           Pattern for letting an AI agent "grow" a hand-curated source file (cleaners, rules, fixtures, prompts, library entries) without ever auto-mutating it. AI…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **ai-proposal-review-inbox**.
-->

# Ai Proposal Review Inbox

| | |
|---|---|
| **Slug** | `ai-proposal-review-inbox` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0001 |
| **Path** | `skills/engineering/ai-proposal-review-inbox` |

## Summary

Pattern for letting an AI agent "grow" a hand-curated source file (cleaners, rules, fixtures, prompts, library entries) without ever auto-mutating it. AI…

## Description

Pattern for letting an AI agent "grow" a hand-curated source file (cleaners, rules, fixtures, prompts, library entries) without ever auto-mutating it. AI proposes → record lands in a review inbox → user accepts → server generates a paste-ready snippet → user pastes into source and commits. Canonical source stays human-authored. Triggers on "AI proposes new", "let the AI add to", "review inbox", "paste-ready snippet", "never auto-edit source", "AI suggestion queue", "human-in-the-loop AI tool", "self-extending library", "propose new cleaner", "propose new rule", "propose new fixture".

## Invoke

Use **ai-proposal-review-inbox**.

## Triggers / keywords

`review-proposal`, `accept-snippet`, `dismiss-proposal`

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

