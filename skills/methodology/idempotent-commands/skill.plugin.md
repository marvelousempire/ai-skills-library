---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: idempotent-commands
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Idempotent Commands
Slug:              idempotent-commands
Pack:              Methodology (methodology)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0115
Summary:           Design Makefile + CLI commands so they're safe to re-run forever. `make ui` boots whatever is down + opens the browser, same result every time. Pre-flight…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **idempotent-commands**.
-->

# Idempotent Commands

| | |
|---|---|
| **Slug** | `idempotent-commands` |
| **Pack** | Methodology |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0115 |
| **Path** | `skills/methodology/idempotent-commands` |

## Summary

Design Makefile + CLI commands so they're safe to re-run forever. `make ui` boots whatever is down + opens the browser, same result every time. Pre-flight…

## Description

Design Makefile + CLI commands so they're safe to re-run forever. `make ui` boots whatever is down + opens the browser, same result every time. Pre-flight checks, pgrep guards, bounded waits. Triggers on "make ui pattern", "one command", "idempotent", "safe to re-run". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/standards/plan-naming.md` and `docs/templates/Makefile.template`.

## Invoke

Use **idempotent-commands**.

## Triggers / keywords

`run-idempotent`, `check-state`, `skip-if-done`

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

