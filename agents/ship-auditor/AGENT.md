# Agent contract: ship-auditor

## Trigger

Git pre-commit hook (planned) OR `agents/ship-auditor/ run`

## Input

(machine-readable schema TBD)

## Output

Exit 0 if all green; exit 1 with a clear summary of which gate(s) failed and how to fix them.

## Side effects

- May modify files listed in the output section.
- Always idempotent — safe to run repeatedly.
- Always read-only when checking; mutations only happen when the agent has explicit "apply" intent.

## Errors

- Exit 0 on success
- Exit 1 on hard failure (the agent couldn't do its job)
- Exit 2 on soft failure (something needed user attention)

## Status: Stub — covered today by manual run of `scripts/check-*.sh`
