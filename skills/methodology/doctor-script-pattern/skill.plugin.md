---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: doctor-script-pattern
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Doctor Script Pattern
Slug:              doctor-script-pattern
Pack:              Methodology (methodology)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0111
Summary:           Every infra skill ships a doctor (`make doctor` or `scripts/doctor.sh`) that runs read-only health probes with color-coded output. Disk + Docker + engine +…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **doctor-script-pattern**.
-->

# Doctor Script Pattern

| | |
|---|---|
| **Slug** | `doctor-script-pattern` |
| **Pack** | Methodology |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0111 |
| **Path** | `skills/methodology/doctor-script-pattern` |

## Summary

Every infra skill ships a doctor (`make doctor` or `scripts/doctor.sh`) that runs read-only health probes with color-coded output. Disk + Docker + engine +…

## Description

Every infra skill ships a doctor (`make doctor` or `scripts/doctor.sh`) that runs read-only health probes with color-coded output. Disk + Docker + engine + per-service. Exit codes: 0 green, 1 red, 2 yellow. Triggers on "doctor script", "health probes", "is the stack healthy". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/standards/doctor-script.md` and `docs/templates/doctor.sh.template`.

## Invoke

Use **doctor-script-pattern**.

## Triggers / keywords

`run-doctor`, `diagnose-system`, `report-health`

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

