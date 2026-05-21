---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: schema-fk-typecheck
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Schema Fk Typecheck
Slug:              schema-fk-typecheck
Pack:              Engineering · Architecture (engineering/architecture)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0008
Summary:           Before writing a CREATE TABLE column with a REFERENCES clause, look up the parent table's column type so the FK declaration matches. Catches BIGINT vs UUID,…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **schema-fk-typecheck**.
-->

# Schema Fk Typecheck

| | |
|---|---|
| **Slug** | `schema-fk-typecheck` |
| **Pack** | Engineering · Architecture |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0008 |
| **Path** | `skills/engineering/architecture/schema-fk-typecheck` |

## Summary

Before writing a CREATE TABLE column with a REFERENCES clause, look up the parent table's column type so the FK declaration matches. Catches BIGINT vs UUID,…

## Description

Before writing a CREATE TABLE column with a REFERENCES clause, look up the parent table's column type so the FK declaration matches. Catches BIGINT vs UUID, SERIAL vs BIGSERIAL, INTEGER vs TEXT mismatches at write time — not at production deploy.

## Invoke

Use **schema-fk-typecheck**.

## Triggers / keywords

`check-schema`, `validate-fk`, `verify-types`

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

