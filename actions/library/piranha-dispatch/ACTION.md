---
name: piranha-dispatch
description: >-
  Fan a job out into N parallel slices. Each slice runs independently; results
  are collected and returned. The distribution shape the user described: "when
  piranhas come away with their slice of the meat." Default N is determined by
  the handler's `swarm_size` field; can be overridden.
inputs:
  handler:
    type: string
    required: true
    description: The product id to invoke on each slice.
  payload:
    type: object
    required: true
    description: The input passed to every piranha.
  swarm_size:
    type: number
    required: false
    description: How many parallel slices. Default 3.
    default: 3
  shard_strategy:
    type: enum
    required: false
    description: round-robin | by-key | random. How the input is partitioned across piranhas.
    default: round-robin
outputs:
  slices:
    type: array
    description: One result per piranha — { slice_id, status, output }.
side_effects:
  - Spawns N concurrent Claude Code sub-agents.
governed_by:
  - add-agent-to-skills-library
---

# piranha-dispatch

## What this action does

Splits a single task across N parallel agents, runs them concurrently, collects their outputs into an array of slices. Each slice carries a stable `slice_id` so downstream actions (`inspect-slice`) can rate them.

## When to use it in a workflow

Whenever the matched handler is parallelisable AND would benefit from multiple perspectives. Examples:

- "Find every place X is used in this codebase" — 3 piranhas with different shard strategies catch different references.
- "Review this PR for issues" — security piranha + style piranha + scope piranha each look for what they're trained on.
- "Summarise these 100 tickets" — round-robin shard, one summary per slice.

DO NOT use for inherently sequential work. If step B depends on step A, write two jobs with `needs:`.

## Failure modes

- **Slice timeout.** One piranha hangs; the others complete. Behaviour: dispatch returns with the timed-out slice marked `status: timeout`; inspector decides whether the partial swarm is acceptable.
- **Slice disagreement.** Two slices return contradictory answers. Behaviour: not the dispatcher's job to resolve. The next step (`inspect-slice`) flags the disagreement as a deficiency, which feeds `on-deficiency-detected`.
- **Over-dispatch.** Swarm size too high triggers Claude Code rate limits. Mitigation: the default of 3 is conservative; raise carefully.
