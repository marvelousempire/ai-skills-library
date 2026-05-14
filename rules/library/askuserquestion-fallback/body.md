---
name: askuserquestion-fallback
id: RL-0005
keywords: [enforce-askuserquestion, check-fallback, file-askuserquestion]
hash: 2955aa4
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# AskUserQuestion fallback — pick defaults + flag for review

`AskUserQuestion` can fail mid-flight with `Tool permission stream closed before response received` or similar errors. When it does, the agent must NOT stall.

## The fallback pattern

1. Pick the (Recommended) option for each question, OR the most conservative option if none are marked recommended.
2. In the response, explicitly say: "Question prompt failed — proceeding with these defaults: [list]. Flag any to flip on review."
3. Continue the work.

## Why this works

The questions are usually picking between equivalent-quality options. Recommended defaults are documented in the question itself. The user can correct any assumption when they next see the work.

## Why stalling is worse

A stalled session leaves the user with no progress and no path forward. The cost of picking a default the user would have changed is ONE follow-up edit. The cost of stalling is ZERO progress.

## Anti-pattern: silently picking defaults without flagging

The user must know which choices were assumed. Always include an "Assumptions made (flag any to flip)" section in the response.

## Origin

Trainer-marketplace session, plan-mode Phase 3: AskUserQuestion was prepared with 4 questions. Tool failed with `Tool permission stream closed`. Proceeded with the (Recommended) option of each, documented all four in an "Assumptions made" section of the plan, and continued. User reviewed plan + assumptions, approved.
