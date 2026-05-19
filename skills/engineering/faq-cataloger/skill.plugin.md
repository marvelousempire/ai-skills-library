---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: faq-cataloger
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Faq Cataloger
Slug:              faq-cataloger
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0140
Summary:           Catalogs processed questions into individual MD files in docs/faq/ — one file per question TYPE forming a structured database. Each file accumulates examples,…
Author:            marvelousempire
License:           MIT
Requires:          `question-decomposer`
Invoke:            Use **faq-cataloger**.
-->

# Faq Cataloger

| | |
|---|---|
| **Slug** | `faq-cataloger` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0140 |
| **Path** | `skills/engineering/faq-cataloger` |

## Summary

Catalogs processed questions into individual MD files in docs/faq/ — one file per question TYPE forming a structured database. Each file accumulates examples,…

## Description

Catalogs processed questions into individual MD files in docs/faq/ — one file per question TYPE forming a structured database. Each file accumulates examples, the canonical answer, how many times asked, first seen, and last seen. Triggers on "catalog this question", "add to FAQ database", "create a FAQ entry", "log this to the FAQ", "build the FAQ", "update the FAQ file".

## Invoke

Use **faq-cataloger**.

## Triggers / keywords

`run-faq`, `check-cataloger`, `file-faq`

## Requires (run first)

`question-decomposer`

## Overlap (related skills)

—

## Philosophy

—

## Files

- [`SKILL.md`](SKILL.md) — agent instructions
- [`skill.plugin.json`](skill.plugin.json) — machine manifest (directory grid)
- This file — human lead sheet (WordPress-style header)

