---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: plan-first-substantive-changes
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Plan First Substantive Changes
Slug:              plan-first-substantive-changes
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0030
Summary:           Before writing any code that touches more than ~2 files, adds a new feature or subsystem, changes architecture, or modifies behavior other code depends on:…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **plan-first-substantive-changes**.
-->

# Plan First Substantive Changes

| | |
|---|---|
| **Slug** | `plan-first-substantive-changes` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0030 |
| **Path** | `skills/engineering/plan-first-substantive-changes` |

## Summary

Before writing any code that touches more than ~2 files, adds a new feature or subsystem, changes architecture, or modifies behavior other code depends on:…

## Description

Before writing any code that touches more than ~2 files, adds a new feature or subsystem, changes architecture, or modifies behavior other code depends on: write a plan document first. Plan lives at plans/NNNN-snake-case-title.md (zero-padded, append-only, git-tracked). Mandatory sections: Context, Tasks, Critical files, Verification, Out of scope. Wait for explicit approval before implementing. Triggers on "make a plan", "plan this first", "write a plan before coding", "plan mode", "design this before building", "architecture document", "what's the approach", planning a feature that spans multiple files.

## Invoke

Use **plan-first-substantive-changes**.

## Triggers / keywords

`write-plan`, `get-approval`, `define-scope`

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

