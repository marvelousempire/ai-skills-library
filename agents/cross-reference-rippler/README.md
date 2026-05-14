# Agent: cross-reference-rippler

**Purpose:** When any skill, rule, family, container service, template, standard, or checklist is added, automatically update every dependent index.

**Trigger:** Git pre-commit hook (planned) OR `agents/cross-reference-rippler/ check`

**Output:** Modifies (or proposes modifications to) SKILL-INDEX.md, root README.md, family README, yousirjuan docs, integration checklists.

**Status:** Stub — implementation deferred

## Contract

See [`AGENT.md`](AGENT.md) for the machine-readable input/output schema.

## Pairing

- Rule (if any): `rules/library/`
- Standard: `docs/standards/`
- Script that does the work today: `scripts/`
