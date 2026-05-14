---
name: plan-mode-runbook
id: SK-0031
keywords: [run-plan, execute-steps, verify-output]
hash: 8416391
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  Run plan mode end-to-end: Phase 1 (parallel Explore agents), Phase 2 (Plan agent for design), Phase 3 (AskUserQuestion for clarifications), Phase 4 (write plan file), Phase 5 (ExitPlanMode). Includes the AskUserQuestion-failure fallback.
trigger: >-
  Use whenever Plan mode is active. Specifically when EnterPlanMode fires, or when the user invokes a /plan or "plan this" command.
---

# /plan-mode-runbook

## What this skill does

Walks the 5-phase plan-mode flow:

### Phase 1 — Initial Understanding (Explore only)

- Launch up to 3 Explore agents **in parallel** (single message, multiple tool calls)
- Each agent has a focused search area: existing patterns / related components / testing patterns
- Quality over quantity — 3 max; usually just 1

### Phase 2 — Design (Plan agent)

- Launch 1 Plan agent with comprehensive context from Phase 1
- For complex tasks: up to 3 Plan agents with different perspectives (simplicity vs performance vs maintainability)

### Phase 3 — Review

- Read critical files identified by Plan agents to deepen understanding
- Use AskUserQuestion to clarify any remaining choices
- If AskUserQuestion fails ([askuserquestion-fallback](../../../rules/library/askuserquestion-fallback/body.md)), pick (Recommended) defaults + flag in plan

### Phase 4 — Final Plan

- Write the plan file at `/Users/nivram/.claude/plans/<slug>.md`
- Sections: **Context** (why this) / Tasks / Critical files / Verification / Out of scope
- Include only the recommended approach, not all alternatives
- Reference existing functions/utilities found in Phase 1

### Phase 5 — ExitPlanMode

- Call `ExitPlanMode` with `allowedPrompts` for the Bash commands the implementation needs
- Wait for user approval before any non-readonly action

## Anti-patterns

- Using AskUserQuestion to ask "is my plan ok" — that's ExitPlanMode's job
- Skipping Phase 1 because "I already know the codebase" — explore agents always find things
- Plan files that are walls of text — make them scannable

## Origin

Trainer-marketplace session, Phases A through E. AskUserQuestion failed once mid-flight; the fallback pattern kicked in cleanly. See `docs/master-reports/2026-05-14-trainer-marketplace-session.md` Phase A.
