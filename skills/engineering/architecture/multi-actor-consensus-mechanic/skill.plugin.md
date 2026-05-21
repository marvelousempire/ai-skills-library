---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: multi-actor-consensus-mechanic
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Multi Actor Consensus Mechanic
Slug:              multi-actor-consensus-mechanic
Pack:              Engineering · Architecture (engineering/architecture)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0005
Summary:           Designs an anti-fraud trust signal from N independent actors. Bakes in: distinct actors (by id), distinct organizations (by business_tax_id or equivalent),…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **multi-actor-consensus-mechanic**.
-->

# Multi Actor Consensus Mechanic

| | |
|---|---|
| **Slug** | `multi-actor-consensus-mechanic` |
| **Pack** | Engineering · Architecture |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0005 |
| **Path** | `skills/engineering/architecture/multi-actor-consensus-mechanic` |

## Summary

Designs an anti-fraud trust signal from N independent actors. Bakes in: distinct actors (by id), distinct organizations (by business_tax_id or equivalent),…

## Description

Designs an anti-fraud trust signal from N independent actors. Bakes in: distinct actors (by id), distinct organizations (by business_tax_id or equivalent), cooldown between attempts, rolling time window, cohesion gate (median +/- band). Generalizes Sound Score; applies to any signal you want to make hard to fake.

## Invoke

Use **multi-actor-consensus-mechanic**.

## Triggers / keywords

`build-consensus`, `coordinate-actors`, `resolve-conflict`

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

