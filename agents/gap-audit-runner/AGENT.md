# Agent contract: gap-audit-runner

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
