---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: tool-calling-approval-reentry
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Tool Calling Approval Reentry
Slug:              tool-calling-approval-reentry
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0047
Summary:           Multi-turn AI tool-calling loop where destructive tools surface an approval card BEFORE running. The stream emits `tool_approval_needed`, closes cleanly, the…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **tool-calling-approval-reentry**.
-->

# Tool Calling Approval Reentry

| | |
|---|---|
| **Slug** | `tool-calling-approval-reentry` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0047 |
| **Path** | `skills/engineering/tool-calling-approval-reentry` |

## Summary

Multi-turn AI tool-calling loop where destructive tools surface an approval card BEFORE running. The stream emits `tool_approval_needed`, closes cleanly, the…

## Description

Multi-turn AI tool-calling loop where destructive tools surface an approval card BEFORE running. The stream emits `tool_approval_needed`, closes cleanly, the client renders an approval card pulling description + cost text from CURATED source (not AI-generated), the user clicks ✓ or ✕, the client re-POSTs with `pending_tool_results`, and the loop resumes from the same message state. Hard cap on rounds to prevent runaway. Works across Anthropic Messages API and OpenAI function-calling. Triggers on "AI tool approval flow", "approval card for destructive tool", "pending_tool_results re-entry", "tool_approval_needed", "AI agent action gate", "human-in-the-loop tool use", "BYO key AI agent destructive operations".

## Invoke

Use **tool-calling-approval-reentry**.

## Triggers / keywords

`pause-tool`, `show-approval`, `resume-loop`

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

