# Agent contract: skill-scaffolder

## Trigger

User asks to add a new skill, OR `agents/skill-scaffolder/ scaffold <family>/<slug>`

## Input

(machine-readable schema TBD)

## Output

New files under `skills/<family>/<slug>/`. Updates parent `README.md` if family-level catalog exists. Bumps SKILL-INDEX count.

## Side effects

- May modify files listed in the output section.
- Always idempotent — safe to run repeatedly.
- Always read-only when checking; mutations only happen when the agent has explicit "apply" intent.

## Errors

- Exit 0 on success
- Exit 1 on hard failure (the agent couldn't do its job)
- Exit 2 on soft failure (something needed user attention)

## Status: Stub — implementation deferred
