---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: three-tier-safety-classification
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Three Tier Safety Classification
Slug:              three-tier-safety-classification
Pack:              Engineering · Architecture (engineering/architecture)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0011
Summary:           Classify every destructive action into exactly one of three safety tiers: safe (always reclaimable, rebuild is trivial), probably_safe (rebuild exists but…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **three-tier-safety-classification**.
-->

# Three Tier Safety Classification

| | |
|---|---|
| **Slug** | `three-tier-safety-classification` |
| **Pack** | Engineering · Architecture |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0011 |
| **Path** | `skills/engineering/architecture/three-tier-safety-classification` |

## Summary

Classify every destructive action into exactly one of three safety tiers: safe (always reclaimable, rebuild is trivial), probably_safe (rebuild exists but…

## Description

Classify every destructive action into exactly one of three safety tiers: safe (always reclaimable, rebuild is trivial), probably_safe (rebuild exists but takes noticeable time or effort), caution (irreplaceable or high-risk data — surface it, never auto-clean it). The tier is a structural guarantee in code, not just a label. "Clean ALL safe" affordances must never reach the caution tier. Triggers on "safety tier", "safe vs caution", "clean all safe", "never auto-delete this", "tier classification for destructive actions", "how safe is this cleanup", "irreplaceable data flag", "auto-clean boundary".

## Invoke

Use **three-tier-safety-classification**.

## Triggers / keywords

`classify-tier`, `enforce-safety`, `gate-action`

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

