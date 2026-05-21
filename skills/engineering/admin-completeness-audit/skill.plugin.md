---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: admin-completeness-audit
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Admin Completeness Audit
Slug:              admin-completeness-audit
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           Audit whether an admin page or nav route is fully wired up across all required layers. Use when the user asks: 'check if admin page is wired up,' 'why doesn't…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **admin-completeness-audit**.
-->

# Admin Completeness Audit

| | |
|---|---|
| **Slug** | `admin-completeness-audit` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/engineering/admin-completeness-audit` |

## Summary

Audit whether an admin page or nav route is fully wired up across all required layers. Use when the user asks: 'check if admin page is wired up,' 'why doesn't…

## Description

Audit whether an admin page or nav route is fully wired up across all required layers. Use when the user asks: 'check if admin page is wired up,' 'why doesn't the nav show,' 'admin route missing,' 'menu item not appearing,' 'admin page exists but I can't navigate to it,' 'new admin section not in sidebar,' 'admin search doesn't find the route,' 'breadcrumbs broken on admin page,' 'admin feature missing.' Runs a structured 5-step audit across nav config, sidebar, backend endpoint, TypeScript types, and API helper, then generates a remediation list.

## Invoke

Use **admin-completeness-audit**.

## Triggers / keywords

`run-admin`, `check-completeness`, `build-audit`

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

