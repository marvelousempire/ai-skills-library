---
name: plan-first-substantive-changes
id: SK-0030
keywords: [plan, first, substantive]
description: >-
  Before writing any code that touches more than ~2 files, adds a new feature
  or subsystem, changes architecture, or modifies behavior other code depends
  on: write a plan document first. Plan lives at plans/NNNN-snake-case-title.md
  (zero-padded, append-only, git-tracked). Mandatory sections: Context, Tasks,
  Critical files, Verification, Out of scope. Wait for explicit approval before
  implementing. Triggers on "make a plan", "plan this first", "write a plan
  before coding", "plan mode", "design this before building", "architecture
  document", "what's the approach", planning a feature that spans multiple files.
---

# Plan-first for substantive changes — write the plan before writing the code

The failure mode: jump into implementation, discover the right approach halfway through, discard two PRs' worth of work. The fix: write the plan in 10–20 minutes, get it approved, then implement with confidence.

Plans are cheap. Rewrites are expensive. The plan is also a permanent record — six months from now, "why did we do this?" has an answer in `plans/0023-…md`.

## When to use this skill

**Fires automatically when:**
- Change touches more than ~2 files
- Adding a new feature / subsystem / sub-app
- Changing architecture or behavior other code depends on
- Could affect >50 lines

**Does NOT fire for:**
- Typo fixes
- Single-file bug fixes
- Documentation tweaks
- Questions or explanations

## The plan format

```markdown
# Plan NNNN — [Short descriptive title]

## Context

Why this change is being made. What prompted it. The intended outcome.
This is the "why" — the most important section because it's what future
maintainers will read when they're confused by the code.

## Tasks (precise todos)

Numbered. Each task must include:
- Literal what-to-do (file path, function name, exact change)
- Files touched
- Dependencies on other tasks (task N requires task M)
- Owner-agent suggestion (which subagent to assign, if applicable)

1. Add `complete_with_tools()` to `web/ai.py` — new function after line 274
2. Add `POST /api/ai/chat` handler to `web/server.py` do_POST — after line 698
3. Create `apps/web/src/components/AIAgentChat.tsx` — NEW, ~500 lines

## Critical files

Every path that will be created or modified:

| File | Action |
|---|---|
| `web/ai.py` | EXTEND — add complete_with_tools() |
| `web/server.py` | EXTEND — add /api/ai/chat handler |
| `apps/web/src/components/AIAgentChat.tsx` | NEW |

## Verification

How to know it's done correctly. Includes:
- The literal command to run
- The expected output

```sh
pnpm --filter @dustpan/web tsc --noEmit  # → (no output, meaning no errors)
pnpm --filter @dustpan/web build         # → ✓ built in X.XXs
make check                               # → ✓ all four assertions pass
```

Also: what to see in the UI, what endpoint to curl, what the user flow looks like.

## Out of scope

What is intentionally NOT being done. Prevents scope creep and documents
deliberate non-decisions. Future maintainers read this before adding "one
more thing."

- Token-by-token streaming (Ship 3 candidate)
- Postgres backend for proposals (deferred until Docker-mode user needs it)
- Linux path set (out of PRD scope — macOS-only product)
```

## The numbering convention

Plans are at `plans/NNNN-snake-case-title.md` where NNNN is the next zero-padded integer. Look at the existing `plans/` folder to find the highest number, then increment.

Plans are **append-only**. Never renumber. Never edit an old plan to "update" it — supersede it with a new plan that links back.

When a plan ships, add a status line at the top:
```
Status: shipped (commit <sha>, v<version>)
```

## The approval protocol

After writing the plan:

1. **Enter plan mode** (Claude Code: call `ExitPlanMode` when ready). Cursor: announce "Plan written — approve to proceed."
2. **Wait for explicit approval.** "Go," "approved," "ship it," or similar.
3. **Do NOT begin implementation until approved.** No "just a quick first step."

## What the plan is NOT for

- Small changes. If it's a 3-line fix in one file, just do it.
- Open-ended research. Plans are for implementation, not exploration.
- Living documents. Write it once, get it approved, implement it. Don't update the plan as you go — update the code.

## Anti-patterns

- ❌ Writing the plan AFTER starting the implementation. The plan finds problems; implementation doesn't.
- ❌ Vague tasks. "Set up the AI stuff" is not a task. `Add complete_with_tools() to web/ai.py after line 274` is.
- ❌ Missing "Out of scope." Without it, every PR review becomes a scope discussion.
- ❌ Verification without literal commands. "Test that it works" is not verifiable. `make check → ✓ all four assertions pass` is.

## Invocation

- "Use **plan-first-substantive-changes**."
- "Write a plan before we start."
- "Plan mode: design this before coding."
- The skill fires automatically when the scope triggers are met.

## Reference implementation

DustPan's `plans/` folder — 0001 through 0026, each with all four sections. Plans for the AI agent (`0023-conversational-sadpa-agent.md`), Space Survey (`0022-space-survey.md`), and Emergency Rescue panel (`0021-emergency-rescue-panel.md`) are the canonical examples of large-feature plans. Plans 0003 and 0004 show the "superseded by" pattern.

The user's global `~/.claude/CLAUDE.md` has this as a standing rule. The plan file for the skills library itself is at `plans/0026-skills-library-extraction.md` in the DustPan repo.
