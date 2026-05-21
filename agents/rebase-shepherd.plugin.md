---
# Lead sheet — auto-generated from agent source. Edit rebase-shepherd.plugin.json for card/grid metadata.
agent_slug: rebase-shepherd
generated_at: 2026-05-21T08:11:23Z
---

<!--
Agent Name:       Rebase Shepherd
Slug:              rebase-shepherd
Team:              Utility (utility)
Layer:             3 · Specialist
Version:           1.0.0
Status:            needs_philosophy
Artifact type:     agent
Summary:           Auto-resolve known conflict patterns during git rebase: CHANGELOG.md (keep both newest-first), Feature Ledger.md (additive merge), project.pbxproj (take HEAD…
Philosophy:        — *(Bishop requires Philosophy on every new agent)*
Invoke:            Commission **rebase-shepherd** via Nephew dispatch.
-->

# Rebase Shepherd

| | |
|---|---|
| **Slug** | `rebase-shepherd` |
| **Team** | Utility |
| **Layer** | 3 · Specialist |
| **Version** | 1.0.0 |
| **Status** | needs_philosophy |
| **Type** | agent (WordPress-style plugin) |
| **Path** | `agents` |

## Summary

Auto-resolve known conflict patterns during git rebase: CHANGELOG.md (keep both newest-first), Feature Ledger.md (additive merge), project.pbxproj (take HEAD…

## Description

Auto-resolve known conflict patterns during git rebase: CHANGELOG.md (keep both newest-first), Feature Ledger.md (additive merge), project.pbxproj (take HEAD per pbxproj-conflict rule), Codable models (run swift-codable-guard check). Reports patterns it can't resolve and hands back to human.

## Invoke

Commission **rebase-shepherd** via Nephew dispatch.

## Tools

`Bash`, `Edit`, `Read`, `Grep`

## Philosophy

— *(Bishop requires Philosophy on every new agent)*

## Files

- [`rebase-shepherd.md`](rebase-shepherd.md) — agent contract
- [`rebase-shepherd.plugin.json`](rebase-shepherd.plugin.json) — machine manifest (library catalog grid)
- This file — human lead sheet

