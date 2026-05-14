# Agent: label-linter

**Purpose:** Verify every service in every `docker-compose.yml` carries the full `ai-skills-library.*` label schema.

**Trigger:** Git pre-commit hook (planned) OR `agents/label-linter/ check`

**Output:** Exit 0 if all compose files compliant; exit 1 with a list of missing labels per service.

**Status:** Stub — implementation deferred

## Contract

See [`AGENT.md`](AGENT.md) for the machine-readable input/output schema.

## Pairing

- Rule (if any): `rules/library/`
- Standard: `docs/standards/`
- Script that does the work today: `scripts/`
