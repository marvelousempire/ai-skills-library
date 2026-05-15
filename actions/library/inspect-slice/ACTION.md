---
name: inspect-slice
description: >-
  Inspector pass. Rates a slice for health (did it produce a valid result?)
  and scans for deficiencies (is there a missing capability the library
  should absorb?). Emits `deficiency-detected` events on flagged slices.
inputs:
  slice_id:
    type: string
    required: true
    description: The slice to evaluate.
  rubric:
    type: enum
    required: false
    description: health | deficiency | both. Default both.
    default: both
outputs:
  health:
    type: enum
    description: ok | warn | fail — overall slice quality.
  deficiencies:
    type: array
    description: Zero or more flagged gaps, each { description, proposed_type, severity }.
side_effects:
  - Emits `deficiency-detected` event for each flagged gap (severity >= warn).
governed_by:
  - add-agent-to-skills-library
---

# inspect-slice

## What this action does

Takes one piranha's output and evaluates it on two axes:

- **Health** — did the slice produce a valid result for the input given? (boolean-ish: ok / warn / fail)
- **Deficiency** — did the work surface a capability the library could absorb? (e.g. "this answer was hand-rolled three times; we should have a skill for it")

The inspector is what closes the learning loop. Without it, the library never grows from its own work.

## When to use it in a workflow

- After every `piranha-dispatch` step (always — health alone is worth it).
- After any direct handler invocation where the output might surface a gap.
- Selectively on `on-skill-shipped` — re-run inspection on the new skill's first three uses to confirm the deficiency was actually absorbed.

## Failure modes

- **Over-flagging.** Inspector marks every slice deficient because the rubric is too loose. Mitigation: severity threshold gates the emit — only `severity >= warn` fires `deficiency-detected`. `info` is logged but does not trigger the create-skill flow.
- **Under-flagging.** Inspector misses real gaps. Mitigation: gap detection is also reported in the witness manifest's narrative_ref — a curator can flag retroactively and the chain re-converges.
- **Inspector loop.** Inspector becomes the swarm member it's inspecting. Mitigation: workflow `needs:` graph prevents an inspect-slice step from naming itself as its handler.
