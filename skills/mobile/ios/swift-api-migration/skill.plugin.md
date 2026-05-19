---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: swift-api-migration
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Swift Api Migration
Slug:              swift-api-migration
Pack:              iOS (mobile/ios)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           Audit and update all callers when a Swift API signature changes — struct init, function parameters, protocol requirements, or enum cases. Triggered by "I…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **swift-api-migration**.
-->

# Swift Api Migration

| | |
|---|---|
| **Slug** | `swift-api-migration` |
| **Pack** | iOS |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/mobile/ios/swift-api-migration` |

## Summary

Audit and update all callers when a Swift API signature changes — struct init, function parameters, protocol requirements, or enum cases. Triggered by "I…

## Description

Audit and update all callers when a Swift API signature changes — struct init, function parameters, protocol requirements, or enum cases. Triggered by "I changed this function signature", "callers are broken", "who uses this init", "find all callers of", "update callers for renamed function", or any Swift compile error with 'extra arguments' or 'missing argument'. Produces a complete caller map and updates every site in the same PR.

## Invoke

Use **swift-api-migration**.

## Triggers / keywords

`Use swift-api-migration`

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

