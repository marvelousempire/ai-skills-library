---
# Lead sheet — auto-generated from agent source. Edit post-ship-auditor.plugin.json for card/grid metadata.
agent_slug: post-ship-auditor
generated_at: 2026-05-19T19:14:26Z
---

<!--
Agent Name:       Post Ship Auditor
Slug:              post-ship-auditor
Team:              Utility (utility)
Layer:             3 · Specialist
Version:           1.0.0
Status:            stub
Artifact type:     agent
Summary:           After every substantive PR merges + deploys + smoke-tests green, run a 2-pass audit: (1) Gap pass — what's incomplete, deferred, fragile, untested; (2)…
Philosophy:        — *(Bishop requires Philosophy on every new agent)*
Invoke:            Commission **post-ship-auditor** via Nephew dispatch.
-->

# Post Ship Auditor

| | |
|---|---|
| **Slug** | `post-ship-auditor` |
| **Team** | Utility |
| **Layer** | 3 · Specialist |
| **Version** | 1.0.0 |
| **Status** | stub |
| **Type** | agent (WordPress-style plugin) |
| **Path** | `agents` |

## Summary

After every substantive PR merges + deploys + smoke-tests green, run a 2-pass audit: (1) Gap pass — what's incomplete, deferred, fragile, untested; (2)…

## Description

After every substantive PR merges + deploys + smoke-tests green, run a 2-pass audit: (1) Gap pass — what's incomplete, deferred, fragile, untested; (2) Elevation pass — what would the most ambitious version look like. Present as numbered + lettered lists. Wait for user pick before implementing.

## Invoke

Commission **post-ship-auditor** via Nephew dispatch.

## Tools

`Read`, `Grep`, `Bash`

## Philosophy

— *(Bishop requires Philosophy on every new agent)*

## Files

- [`post-ship-auditor.md`](post-ship-auditor.md) — agent contract
- [`post-ship-auditor.plugin.json`](post-ship-auditor.plugin.json) — machine manifest (library catalog grid)
- This file — human lead sheet

