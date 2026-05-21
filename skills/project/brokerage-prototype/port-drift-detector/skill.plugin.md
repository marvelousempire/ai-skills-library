---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: port-drift-detector
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Port Drift Detector
Slug:              port-drift-detector
Pack:              Brokerage prototype (project/brokerage-prototype)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           Cross-repo drift detection between paired implementations (e.g., prototype + canonical). Reads a markdown ledger (PORTING_NOTES.md or similar) + recent git…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **port-drift-detector**.
-->

# Port Drift Detector

| | |
|---|---|
| **Slug** | `port-drift-detector` |
| **Pack** | Brokerage prototype |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/project/brokerage-prototype/port-drift-detector` |

## Summary

Cross-repo drift detection between paired implementations (e.g., prototype + canonical). Reads a markdown ledger (PORTING_NOTES.md or similar) + recent git…

## Description

Cross-repo drift detection between paired implementations (e.g., prototype + canonical). Reads a markdown ledger (PORTING_NOTES.md or similar) + recent git history of both repos. Pure git + awk + bash, no LLM cost. Three states: quiet, capture-needed (new commits not in ledger), backlog-growing (pending count went up). Pairs with a weekly launchd job for autonomous reporting.

## Invoke

Use **port-drift-detector**.

## Triggers / keywords

`run-port`, `check-drift`, `build-detector`

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

