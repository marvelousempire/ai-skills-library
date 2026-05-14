# Agent contract: cross-reference-rippler

## Trigger

Git pre-commit hook (planned) OR `agents/cross-reference-rippler/ check`

## Input

(machine-readable schema TBD)

## Output

Modifies (or proposes modifications to) SKILL-INDEX.md, root README.md, family README, yousirjuan docs, integration checklists.

## Side effects

- May modify files listed in the output section.
- Always idempotent — safe to run repeatedly.
- Always read-only when checking; mutations only happen when the agent has explicit "apply" intent.

## Errors

- Exit 0 on success
- Exit 1 on hard failure (the agent couldn't do its job)
- Exit 2 on soft failure (something needed user attention)

## Status: Stub — implementation deferred
