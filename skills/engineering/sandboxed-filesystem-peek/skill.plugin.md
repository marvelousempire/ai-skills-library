---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: sandboxed-filesystem-peek
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Sandboxed Filesystem Peek
Slug:              sandboxed-filesystem-peek
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0039
Summary:           Give an AI agent or third-party tool read-only filesystem access via a strict allowlist + hard-deny + symlink-resolution validator. Path-traversal proof.…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **sandboxed-filesystem-peek**.
-->

# Sandboxed Filesystem Peek

| | |
|---|---|
| **Slug** | `sandboxed-filesystem-peek` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0039 |
| **Path** | `skills/engineering/sandboxed-filesystem-peek` |

## Summary

Give an AI agent or third-party tool read-only filesystem access via a strict allowlist + hard-deny + symlink-resolution validator. Path-traversal proof.…

## Description

Give an AI agent or third-party tool read-only filesystem access via a strict allowlist + hard-deny + symlink-resolution validator. Path-traversal proof. Returns metadata (size, is_dir) but never file contents. Designed for AI agents that need to investigate the user's machine without becoming a data-exfiltration vector. Triggers on "AI filesystem access", "let the agent look around", "filesystem peek sandbox", "ALLOWED_ROOTS DENY_ROOTS", "path-traversal protection for agent", "list_directory tool", "measure_path tool", "filesystem read sandbox", "AI agent can't see system files".

## Invoke

Use **sandboxed-filesystem-peek**.

## Triggers / keywords

`read-path`, `measure-size`, `list-directory`

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

