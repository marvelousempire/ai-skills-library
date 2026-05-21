---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: graceful-degradation
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Graceful Degradation
Slug:              graceful-degradation
Pack:              Methodology (methodology)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0114
Summary:           When a service is down, show a red pill, not a crash. When a build fails, report it and keep going. When `.env` is missing, skip with a warning. Every…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **graceful-degradation**.
-->

# Graceful Degradation

| | |
|---|---|
| **Slug** | `graceful-degradation` |
| **Pack** | Methodology |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0114 |
| **Path** | `skills/methodology/graceful-degradation` |

## Summary

When a service is down, show a red pill, not a crash. When a build fails, report it and keep going. When `.env` is missing, skip with a warning. Every…

## Description

When a service is down, show a red pill, not a crash. When a build fails, report it and keep going. When `.env` is missing, skip with a warning. Every component degrades gracefully so the whole system never wedges on one bad link. Triggers on "graceful degradation", "fail soft", "don't crash on missing X". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: Implicit in `skills/infra/console/server.ts` and the Makefile patterns.

## Invoke

Use **graceful-degradation**.

## Triggers / keywords

`degrade-gracefully`, `handle-failure`, `fallback-safely`

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

