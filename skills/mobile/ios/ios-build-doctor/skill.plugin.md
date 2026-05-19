---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: ios-build-doctor
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Ios Build Doctor
Slug:              ios-build-doctor
Pack:              iOS (mobile/ios)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           Systematically diagnose and fix iOS build errors in a multi-agent Xcode repo. Triggered when the user says "fix the iOS build", "build is broken", "xcodebuild…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **ios-build-doctor**.
-->

# Ios Build Doctor

| | |
|---|---|
| **Slug** | `ios-build-doctor` |
| **Pack** | iOS |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/mobile/ios/ios-build-doctor` |

## Summary

Systematically diagnose and fix iOS build errors in a multi-agent Xcode repo. Triggered when the user says "fix the iOS build", "build is broken", "xcodebuild…

## Description

Systematically diagnose and fix iOS build errors in a multi-agent Xcode repo. Triggered when the user says "fix the iOS build", "build is broken", "xcodebuild is failing", "get to BUILD SUCCEEDED", "iOS errors". Runs a structured six-phase protocol: disk-check → enumerate ALL errors → classify by type → fix in dependency order → verify clean → PR. Never starts fixing individual errors without first seeing the full error set.

## Invoke

Use **ios-build-doctor**.

## Triggers / keywords

`Use ios-build-doctor`

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

