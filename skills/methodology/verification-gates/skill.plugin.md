---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: verification-gates
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Verification Gates
Slug:              verification-gates
Pack:              Methodology (methodology)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0120
Summary:           Run every green-check before any commit hits main: SKILL count consistency, frontmatter lint, compose label parse, script syntax, link sanity, branch state,…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **verification-gates**.
-->

# Verification Gates

| | |
|---|---|
| **Slug** | `verification-gates` |
| **Pack** | Methodology |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0120 |
| **Path** | `skills/methodology/verification-gates` |

## Summary

Run every green-check before any commit hits main: SKILL count consistency, frontmatter lint, compose label parse, script syntax, link sanity, branch state,…

## Description

Run every green-check before any commit hits main: SKILL count consistency, frontmatter lint, compose label parse, script syntax, link sanity, branch state, origin sync. Triggers on "verify before ship", "green checks", "don't merge yet". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/standards/verification-gates.md` and `docs/checklists/ship.md`.

## Invoke

Use **verification-gates**.

## Triggers / keywords

`run-gate`, `verify-output`, `check-completion`

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

