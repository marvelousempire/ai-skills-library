# Playbook — Plan-mode to Ship

End-to-end flow from EnterPlanMode → ExitPlanMode → committed → live.

## Phase 1 — Initial Understanding (Explore agents)

Launch 1–3 Explore agents IN PARALLEL with focused search areas: existing patterns, related components, testing conventions, schema/API contracts the change will touch. Each agent reports back as structured notes with file:line references.

## Phase 2 — Design (Plan agent)

Launch 1 Plan agent with comprehensive context from Phase 1. For complex tasks, up to 3 agents with different perspectives. Output: structured implementation plan with critical files + verification + open questions.

## Phase 3 — Review

Read critical files identified by Plan agents. Use AskUserQuestion to clarify any remaining choices. If AskUserQuestion fails: pick (Recommended) defaults + flag in plan ([askuserquestion-fallback](../../rules/library/askuserquestion-fallback/body.md)).

## Phase 4 — Final Plan

Write the plan file at `/Users/nivram/.claude/plans/<slug>.md`. Sections: Context / Tasks / Critical files / Verification / Out of scope.

## Phase 5 — ExitPlanMode

Call `ExitPlanMode` with `allowedPrompts` for the Bash commands the implementation needs. Wait for user approval.

## Phase 6 — Ship

After approval: stage by explicit path → commit → push → open PR → watch CI → merge → deploy → smoke test. Report pipeline-stage table.

## Phase 7 — Post-ship audit + elevation

Gap audit (numbered) + Elevation pass (lettered). Wait for user pick before implementing.

## Origin

Trainer-marketplace session, 2026-05-14. Phases A through E.
