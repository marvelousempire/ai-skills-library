# Agent contract: label-linter


## Commissioned by

This agent is part of **nephew's** dispatch — it does not commission itself. Invocation flows from [`nephew`](../nephew.md) (the Orchestrator Agent by Avery Goodman) based on intent fingerprint. See [`docs/standards/orchestration-hierarchy.md`](../../docs/standards/orchestration-hierarchy.md) for the full team map.

## Trigger

Git pre-commit hook (planned) OR `agents/label-linter/ check`

## Input

(machine-readable schema TBD)

## Output

Exit 0 if all compose files compliant; exit 1 with a list of missing labels per service.

## Side effects

- May modify files listed in the output section.
- Always idempotent — safe to run repeatedly.
- Always read-only when checking; mutations only happen when the agent has explicit "apply" intent.

## Errors

- Exit 0 on success
- Exit 1 on hard failure (the agent couldn't do its job)
- Exit 2 on soft failure (something needed user attention)

## Status: Stub — implementation deferred
