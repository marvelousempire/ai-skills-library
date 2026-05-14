# AskUserQuestion failure: Tool permission stream closed

**First seen:** 2026-05-14 (red-e-play plan-mode Phase 3)
**Session:** trainer-marketplace
**Category:** tool / coordination

## Symptom

Mid plan-mode Phase 3, after preparing 4 questions (first-PR scope, badge visuals, platform fee, section split), AskUserQuestion returned:

```
Tool permission request failed: Error: Tool permission stream closed before response received
```

The tool didn't show the questions to the user; the stream closed before delivery.

## Diagnose

The error message itself is the diagnosis. No deeper investigation needed.

## Fix

Picked the (Recommended) option for each of the 4 questions (documented in the question itself with "(Recommended)" label):
1. First-PR scope: Plan registration only (3 files)
2. Badge visuals: Blue check (1 trainer) → blue ribbon (3 trainers + cohesion pass)
3. Platform fee: 20% — TaskRabbit-style
4. Section split: Marketplace + Identity + Trust

Documented all four in an "Assumptions made (flag any to flip on review)" section of the plan file. Continued execution.

User reviewed the plan + assumptions and approved.

## Root cause

The AskUserQuestion tool's underlying RPC stream can close before the user's response is received. Possibly a transient infrastructure issue. The agent has no control over when this happens.

## Prevention

- Rule: [`askuserquestion-fallback`](../../rules/library/askuserquestion-fallback/body.md) — pick (Recommended) defaults, flag in response, continue
- Always include an "Assumptions made (flag any to flip)" section when defaults were picked
- Don't stall — the user can correct one assumption faster than waiting for zero progress

## Related

- Master Report: Section 3.4.4
