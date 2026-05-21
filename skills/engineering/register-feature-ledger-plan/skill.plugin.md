---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: register-feature-ledger-plan
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Register Feature Ledger Plan
Slug:              register-feature-ledger-plan
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0038
Summary:           Register a new plan + N features atomically in a database-backed admin ledger. Emits the seed migration, the long-form Plan-X.md doc, and the Feature…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **register-feature-ledger-plan**.
-->

# Register Feature Ledger Plan

| | |
|---|---|
| **Slug** | `register-feature-ledger-plan` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0038 |
| **Path** | `skills/engineering/register-feature-ledger-plan` |

## Summary

Register a new plan + N features atomically in a database-backed admin ledger. Emits the seed migration, the long-form Plan-X.md doc, and the Feature…

## Description

Register a new plan + N features atomically in a database-backed admin ledger. Emits the seed migration, the long-form Plan-X.md doc, and the Feature Ledger.md mirror update — all idempotent, all in one PR. The canonical "every feature is a product" registration unit.

## Invoke

Use **register-feature-ledger-plan**.

## Triggers / keywords

`register-feature`, `log-plan`, `track-ledger`

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

