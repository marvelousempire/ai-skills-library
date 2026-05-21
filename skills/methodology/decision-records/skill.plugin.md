---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: decision-records
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Decision Records
Slug:              decision-records
Pack:              Methodology (methodology)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0110
Summary:           When picking A over B (Forgejo vs GitLab CE, Colima vs Docker Desktop, etc.), write a decision record at `skills/<family>/<slug>/references/<X-vs-Y>.md` with…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **decision-records**.
-->

# Decision Records

| | |
|---|---|
| **Slug** | `decision-records` |
| **Pack** | Methodology |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0110 |
| **Path** | `skills/methodology/decision-records` |

## Summary

When picking A over B (Forgejo vs GitLab CE, Colima vs Docker Desktop, etc.), write a decision record at `skills/<family>/<slug>/references/<X-vs-Y>.md` with…

## Description

When picking A over B (Forgejo vs GitLab CE, Colima vs Docker Desktop, etc.), write a decision record at `skills/<family>/<slug>/references/<X-vs-Y>.md` with options, pros/cons, decision, rationale, trigger for revisiting, cost of being wrong. Index in `decision-records/INDEX.md`. Triggers on "pick A or B", "why this not that", "decision record". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: `docs/templates/decision-record.md.template`.

## Invoke

Use **decision-records**.

## Triggers / keywords

`record-decision`, `document-why`, `log-decision`

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

