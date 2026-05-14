# Standard: plan-file naming

Plans live in **two** places:

1. `~/.claude/plans/<title>.md` — user-global, survives across repos (per the user's global `CLAUDE.md`)
2. `docs/master-plans/<date>-<title>.md` — in-repo, survives across machines, discoverable for future agents

## Naming

| Location | Convention | Example |
|---|---|---|
| `~/.claude/plans/` | kebab-case title, no date | `dockyard-integration.md`, `diagrammer-app.md` |
| `docs/master-plans/` | ISO date + kebab-case title | `2026-05-14-master-repo-evolution.md` |

## Required sections

Every plan has the structure below. Mirrors the global `CLAUDE.md` plan-first contract.

```markdown
# Plan — <descriptive title>

## Context
Why this change, what prompted it, intended outcome.

## Goals
What success looks like.

## Non-goals
What is intentionally NOT being done.

## Tasks (precise todos)
Numbered. Each task: literal what-to-do (file paths, function names, exact change).

## Critical files
Every path created or modified.

## Verification (literal commands + expected outputs)
How to know it's done correctly.

## Out of scope
What is intentionally NOT being done in this commit.

## Recovery
How to roll back if something goes wrong.
```

## When to write a plan

Per the global `CLAUDE.md` plan-first rule, any of the following triggers a plan:

- Change touches > 2 files
- Adds a new feature / subsystem / sub-app
- Changes architecture
- Modifies behavior other code depends on
- Could reasonably affect > 50 lines

Skipped for typos, doc tweaks, single-file bug fixes, questions, or explanations.

## Real examples from this repo

| Plan | Outcome |
|---|---|
| `~/.claude/plans/diagrammer-app.md` | SEEME built across 4 commits |
| `~/.claude/plans/dockyard-integration.md` | Dockyard integration shipped in 1 commit |
| `docs/master-plans/2026-05-14-master-repo-evolution.md` | This commit (the master report system) |

## Anti-patterns

- Plan-by-message — losing the plan when the conversation context shifts
- Plan without verification commands — can't tell if you're done
- Plan without recovery — can't roll back safely
- Plan with vague tasks ("clean things up") — agent can't execute it
