---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: emergency-auto-navigate-on-condition
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Emergency Auto Navigate On Condition
Slug:              emergency-auto-navigate-on-condition
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0023
Summary:           When a system metric crosses a critical threshold (disk at zero, error rate spiking, health check failing), automatically navigate the UI to the relevant…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **emergency-auto-navigate-on-condition**.
-->

# Emergency Auto Navigate On Condition

| | |
|---|---|
| **Slug** | `emergency-auto-navigate-on-condition` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0023 |
| **Path** | `skills/engineering/emergency-auto-navigate-on-condition` |

## Summary

When a system metric crosses a critical threshold (disk at zero, error rate spiking, health check failing), automatically navigate the UI to the relevant…

## Description

When a system metric crosses a critical threshold (disk at zero, error rate spiking, health check failing), automatically navigate the UI to the relevant surface without user action. The SADPA pattern: monitor continuously via a live data channel, detect the threshold crossing, call setActiveTab() or equivalent immediately. Two tiers — critical (auto-navigate now) and warning (kick off background prep so the destination is ready when they arrive). Triggers on "auto-navigate when disk is low", "navigate to emergency panel automatically", "SADPA pattern", "monitor and redirect", "auto-switch tab on condition", "proactive UI navigation", "detect threshold and respond".

## Invoke

Use **emergency-auto-navigate-on-condition**.

## Triggers / keywords

`monitor-metric`, `navigate-surface`, `detect-threshold`

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

