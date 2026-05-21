---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: real-time-honest-signaling
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Real Time Honest Signaling
Slug:              real-time-honest-signaling
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0036
Summary:           Never fake completion, progress, or measurement. Wire every UI signal to the real event source — the kernel-reported freed-GB after a subprocess exits, the…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **real-time-honest-signaling**.
-->

# Real Time Honest Signaling

| | |
|---|---|
| **Slug** | `real-time-honest-signaling` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0036 |
| **Path** | `skills/engineering/real-time-honest-signaling` |

## Summary

Never fake completion, progress, or measurement. Wire every UI signal to the real event source — the kernel-reported freed-GB after a subprocess exits, the…

## Description

Never fake completion, progress, or measurement. Wire every UI signal to the real event source — the kernel-reported freed-GB after a subprocess exits, the actual SSE done event from a background process, the real disk usage from df/du not an estimate. Anti-pattern: setTimeout(1500) to mark a card done while the rm -rf is still running. Also covers: freed-GB from the OS delta not from counters; streaming from the real SSE done event; per-command elapsed timers that start on click and stop on actual completion. Triggers on "fake completion", "real-time feedback", "setTimeout for done state", "freed GB counter", "live disk updates", "progress is lying", "the UI says done but it is still running", "honest progress bar", "actual measurement not estimate".

## Invoke

Use **real-time-honest-signaling**.

## Triggers / keywords

`wire-event`, `track-freed`, `report-completion`

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

