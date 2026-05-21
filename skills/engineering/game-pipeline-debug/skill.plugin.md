---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: game-pipeline-debug
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Game Pipeline Debug
Slug:              game-pipeline-debug
Pack:              Engineering (engineering)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          —
Summary:           Debug why game sessions are not being recorded in the database or not appearing in stats. Use when: 'game stats show zero,' 'game history missing from web,'…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **game-pipeline-debug**.
-->

# Game Pipeline Debug

| | |
|---|---|
| **Slug** | `game-pipeline-debug` |
| **Pack** | Engineering |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | — |
| **Path** | `skills/engineering/game-pipeline-debug` |

## Summary

Debug why game sessions are not being recorded in the database or not appearing in stats. Use when: 'game stats show zero,' 'game history missing from web,'…

## Description

Debug why game sessions are not being recorded in the database or not appearing in stats. Use when: 'game stats show zero,' 'game history missing from web,' 'games not syncing,' 'no games in database,' 'played games don\'t show up,' 'player stats are all zeros,' 'game sessions table empty,' 'game push failing silently,' 'play-by-play missing,' 'leaderboard shows wrong game count.' Runs a 7-step diagnostic across the DB layer, JWT config, iOS sync code, UserDefaults tracking, DB flags, participation SQL, and activity-vs-game confusion.

## Invoke

Use **game-pipeline-debug**.

## Triggers / keywords

`run-game`, `check-pipeline`, `build-debug`

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

