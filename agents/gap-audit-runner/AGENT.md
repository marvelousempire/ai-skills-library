# Agent contract: gap-audit-runner


## Commissioned by

This agent is part of **nephew's** dispatch — it does not commission itself. Invocation flows from [`nephew`](../nephew.md) (the Orchestrator Agent by Avery Goodman) based on intent fingerprint. See [`docs/standards/orchestration-hierarchy.md`](../../docs/standards/orchestration-hierarchy.md) for the full team map.

## Trigger

After-ship signal OR `agents/gap-audit-runner/ run <commit-range>`

## Input

(machine-readable schema TBD)

## Output

New file at `docs/improvement/audits/<date>-<scope>.md` with filled-in gaps + elevations + linked plan + linked session report.

## Side effects

- May modify files listed in the output section.
- Always idempotent — safe to run repeatedly.
- Always read-only when checking; mutations only happen when the agent has explicit "apply" intent.

## Errors

- Exit 0 on success
- Exit 1 on hard failure (the agent couldn't do its job)
- Exit 2 on soft failure (something needed user attention)

## Status: Stub — manually done today
