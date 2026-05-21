---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: generate-weather-plates
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Generate Weather Plates
Slug:              generate-weather-plates
Pack:              Red-E Play (project/red-e-play)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0123
Summary:           Generate the 16 cinematic weather background plates (8 conditions × day/night) for the Red-E Play HomeView hero by calling OpenAI's gpt-image-1. Drops the…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **generate-weather-plates**.
-->

# Generate Weather Plates

| | |
|---|---|
| **Slug** | `generate-weather-plates` |
| **Pack** | Red-E Play |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0123 |
| **Path** | `skills/project/red-e-play/generate-weather-plates` |

## Summary

Generate the 16 cinematic weather background plates (8 conditions × day/night) for the Red-E Play HomeView hero by calling OpenAI's gpt-image-1. Drops the…

## Description

Generate the 16 cinematic weather background plates (8 conditions × day/night) for the Red-E Play HomeView hero by calling OpenAI's gpt-image-1. Drops the resulting JPGs straight into the iOS Assets.xcassets/WeatherPlates/ imagesets, ready for SwiftUI Image(...). Re-runnable for any subset (regenerate just one kind by passing its name as an arg). Reusable for any future "I need N AI-generated plates that match a brand prompt" task.

## Invoke

Use **generate-weather-plates**.

## Triggers / keywords

`generate-plates`, `create-assets`, `render-weather`

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

