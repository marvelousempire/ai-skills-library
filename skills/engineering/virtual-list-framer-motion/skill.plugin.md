---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: virtual-list-framer-motion
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Virtual List Framer Motion
Slug:              virtual-list-framer-motion
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0141
Summary:           Fix blank or stacked virtual lists when TanStack Virtual and Framer Motion share one element. Motion's x/y animation overwrites translateY used for row…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **virtual-list-framer-motion**.
-->

# Virtual List Framer Motion

| | |
|---|---|
| **Slug** | `virtual-list-framer-motion` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0141 |
| **Path** | `skills/engineering/virtual-list-framer-motion` |

## Summary

Fix blank or stacked virtual lists when TanStack Virtual and Framer Motion share one element. Motion's x/y animation overwrites translateY used for row…

## Description

Fix blank or stacked virtual lists when TanStack Virtual and Framer Motion share one element. Motion's x/y animation overwrites translateY used for row positioning. Use a plain wrapper for translateY; animate opacity only, or drop virtualization under ~5k rows. Also covers claude-chat-reader Docker dev overlay when localhost:3000 shows empty UI after prod rebuild. Triggers on "virtual list blank", "conversations page empty", "all rows stacked", "translateY motion conflict", "tanstack virtual framer", "docker compose port 3000 not working".

## Invoke

Use **virtual-list-framer-motion**.

## Triggers / keywords

`run-virtual`, `check-list`, `build-framer`

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

