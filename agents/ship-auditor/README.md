# Agent: ship-auditor

**Purpose:** Run every verification gate before any commit hits main. Block on failure.

**Trigger:** Git pre-commit hook (planned) OR `agents/ship-auditor/ run`

**Output:** Exit 0 if all green; exit 1 with a clear summary of which gate(s) failed and how to fix them.

**Status:** Stub — covered today by manual run of `scripts/check-*.sh`

## Contract

See [`AGENT.md`](AGENT.md) for the machine-readable input/output schema.

## Pairing

- Rule (if any): `rules/library/`
- Standard: `docs/standards/`
- Script that does the work today: `scripts/`
