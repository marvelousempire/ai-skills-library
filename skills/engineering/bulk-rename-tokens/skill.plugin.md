---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: bulk-rename-tokens
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Bulk Rename Tokens
Slug:              bulk-rename-tokens
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0014
Summary:           Mass-rename a token across N files using a Python script written to /tmp via Bash heredoc. Avoids the zsh/bash escape pitfalls of inline Python heredocs. Use…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **bulk-rename-tokens**.
-->

# Bulk Rename Tokens

| | |
|---|---|
| **Slug** | `bulk-rename-tokens` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0014 |
| **Path** | `skills/engineering/bulk-rename-tokens` |

## Summary

Mass-rename a token across N files using a Python script written to /tmp via Bash heredoc. Avoids the zsh/bash escape pitfalls of inline Python heredocs. Use…

## Description

Mass-rename a token across N files using a Python script written to /tmp via Bash heredoc. Avoids the zsh/bash escape pitfalls of inline Python heredocs. Use for feature ID renumbering, slug rename, version bump cascade.

## Invoke

Use **bulk-rename-tokens**.

## Triggers / keywords

`rename-token`, `find-replace`, `update-references`

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

