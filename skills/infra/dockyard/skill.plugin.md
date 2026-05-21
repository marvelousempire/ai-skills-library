---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: dockyard
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Dockyard
Slug:              dockyard
Pack:              Infra (infra)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0062
Summary:           Wire the ai-skills-library stacks into Dockyard — the user's Python-stdlib local-first Docker manager UI that replaces Docker Desktop's GUI. Talks any Docker…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **dockyard**.
-->

# Dockyard

| | |
|---|---|
| **Slug** | `dockyard` |
| **Pack** | Infra |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0062 |
| **Path** | `skills/infra/dockyard` |

## Summary

Wire the ai-skills-library stacks into Dockyard — the user's Python-stdlib local-first Docker manager UI that replaces Docker Desktop's GUI. Talks any Docker…

## Description

Wire the ai-skills-library stacks into Dockyard — the user's Python-stdlib local-first Docker manager UI that replaces Docker Desktop's GUI. Talks any Docker socket (Colima → OrbStack → Docker Desktop), default Compose-project view, 12 MCP tools for AI agents, Caddy HTTPS front-door. This skill ships the install + standalone-compose templates, the canonical label schema every library container must follow, an integration checklist, and a Docker Desktop → Colima migration guide. Triggers on "set up Dockyard", "use Dockyard with ai-skills-library", "Docker UI", "Colima manager", "Dockyard MCP", "Docker Desktop replacement", "self-hosted Docker UI", "labels for Dockyard".

## Invoke

Use **dockyard**.

## Triggers / keywords

`setup-dockyard`

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

