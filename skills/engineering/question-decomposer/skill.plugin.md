---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: question-decomposer
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Question Decomposer
Slug:              question-decomposer
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0138
Summary:           The intake layer for the AI Skills Library. Before any skill or rule is invoked, the question decomposer strips the raw input to its ≤20-word concise essence…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **question-decomposer**.
-->

# Question Decomposer

| | |
|---|---|
| **Slug** | `question-decomposer` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0138 |
| **Path** | `skills/engineering/question-decomposer` |

## Summary

The intake layer for the AI Skills Library. Before any skill or rule is invoked, the question decomposer strips the raw input to its ≤20-word concise essence…

## Description

The intake layer for the AI Skills Library. Before any skill or rule is invoked, the question decomposer strips the raw input to its ≤20-word concise essence and classifies its function type (a verb-object label that maps to a skill). Logs both to docs/faq/question-log.md. Triggers on "decompose this question", "strip this request", "what type of question is this", "normalize this input", "classify this request", "what function is this", "clean up this prompt before routing", "two-part question".

## Invoke

Use **question-decomposer**.

## Triggers / keywords

`run-question`, `check-decomposer`, `file-question`

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

