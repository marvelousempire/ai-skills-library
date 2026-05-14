# Agent: count-keeper

**Purpose:** Keep SKILL-INDEX.md + root README.md + actual file count in lockstep.

**Trigger:** Git pre-commit hook (planned) OR `bash scripts/check-skill-count.sh --fix`

**Output:** Modifies SKILL-INDEX.md and root README.md to match actual. Exit 0 if no fix needed.

**Status:** Stub — covered today by `scripts/check-skill-count.sh` (reports drift)

## Contract

See [`AGENT.md`](AGENT.md) for the machine-readable input/output schema.

## Pairing

- Rule (if any): `rules/library/`
- Standard: `docs/standards/`
- Script that does the work today: `scripts/`
