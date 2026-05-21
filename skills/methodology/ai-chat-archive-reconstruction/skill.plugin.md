---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: ai-chat-archive-reconstruction
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Ai Chat Archive Reconstruction
Slug:              ai-chat-archive-reconstruction
Pack:              Methodology (methodology)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-ARCH-RECON
Summary:           Corrective reconstruction when an AI (Grok, ChatGPT, etc.) simulated git pushes but work lived only in chat. Ingest export into claude-chat-reader, run…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **ai-chat-archive-reconstruction**.
-->

# Ai Chat Archive Reconstruction

| | |
|---|---|
| **Slug** | `ai-chat-archive-reconstruction` |
| **Pack** | Methodology |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-ARCH-RECON |
| **Path** | `skills/methodology/ai-chat-archive-reconstruction` |

## Summary

Corrective reconstruction when an AI (Grok, ChatGPT, etc.) simulated git pushes but work lived only in chat. Ingest export into claude-chat-reader, run…

## Description

Corrective reconstruction when an AI (Grok, ChatGPT, etc.) simulated git pushes but work lived only in chat. Ingest export into claude-chat-reader, run Nephew's reconstruct_grok_archive.py, emit meta-library + docs, commit witnessed slices to marvelousempire/nephew. Triggers: Grok archive, simulated commits, rebuild nephew from chat, archive reconstruction.

## Invoke

Use **ai-chat-archive-reconstruction**.

## Triggers / keywords

`audit-chat`, `check-archive`, `build-reconstruction`

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

