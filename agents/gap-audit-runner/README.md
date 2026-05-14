# Agent: gap-audit-runner

**Purpose:** After a meaningful ship, generate the audit file from the commit diff + the original plan.

**Trigger:** After-ship signal OR `agents/gap-audit-runner/ run <commit-range>`

**Output:** New file at `docs/improvement/audits/<date>-<scope>.md` with filled-in gaps + elevations + linked plan + linked session report.

**Status:** Stub — manually done today

## Contract

See [`AGENT.md`](AGENT.md) for the machine-readable input/output schema.

## Pairing

- Rule (if any): `rules/library/`
- Standard: `docs/standards/`
- Script that does the work today: `scripts/`
