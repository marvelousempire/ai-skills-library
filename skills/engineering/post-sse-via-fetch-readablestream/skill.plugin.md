---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: post-sse-via-fetch-readablestream
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Post Sse Via Fetch Readablestream
Slug:              post-sse-via-fetch-readablestream
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0034
Summary:           EventSource (the standard SSE client) is GET-only. When your streaming endpoint requires a POST body (e.g. sending conversation history to an AI chat…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **post-sse-via-fetch-readablestream**.
-->

# Post Sse Via Fetch Readablestream

| | |
|---|---|
| **Slug** | `post-sse-via-fetch-readablestream` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0034 |
| **Path** | `skills/engineering/post-sse-via-fetch-readablestream` |

## Summary

EventSource (the standard SSE client) is GET-only. When your streaming endpoint requires a POST body (e.g. sending conversation history to an AI chat…

## Description

EventSource (the standard SSE client) is GET-only. When your streaming endpoint requires a POST body (e.g. sending conversation history to an AI chat endpoint), use fetch() + ReadableStream + a manual SSE line parser. Produces the same {event, data} objects as streamSSE(). ~80 lines. Triggers on "POST endpoint with SSE", "EventSource is GET-only", "stream from POST request", "SSE with request body", "chat endpoint streaming", "can't send body with EventSource".

## Invoke

Use **post-sse-via-fetch-readablestream**.

## Triggers / keywords

`stream-post`, `parse-sse`, `handle-events`

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

