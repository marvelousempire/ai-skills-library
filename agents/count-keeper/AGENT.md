# Agent contract: count-keeper

## Trigger

Git pre-commit hook (planned) OR `bash scripts/check-skill-count.sh --fix`

## Input

(machine-readable schema TBD)

## Output

Modifies SKILL-INDEX.md and root README.md to match actual. Exit 0 if no fix needed.

## Side effects

- May modify files listed in the output section.
- Always idempotent — safe to run repeatedly.
- Always read-only when checking; mutations only happen when the agent has explicit "apply" intent.

## Errors

- Exit 0 on success
- Exit 1 on hard failure (the agent couldn't do its job)
- Exit 2 on soft failure (something needed user attention)

## Status: Stub — covered today by `scripts/check-skill-count.sh` (reports drift)
