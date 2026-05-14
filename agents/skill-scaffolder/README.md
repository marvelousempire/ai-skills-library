# Agent: skill-scaffolder

**Purpose:** Generate the canonical skill folder structure (SKILL.md from template + README + optional templates/ and references/) for a given slug + family.

**Trigger:** User asks to add a new skill, OR `agents/skill-scaffolder/ scaffold <family>/<slug>`

**Output:** New files under `skills/<family>/<slug>/`. Updates parent `README.md` if family-level catalog exists. Bumps SKILL-INDEX count.

**Status:** Stub — implementation deferred

## Contract

See [`AGENT.md`](AGENT.md) for the machine-readable input/output schema.

## Pairing

- Rule (if any): `rules/library/`
- Standard: `docs/standards/`
- Script that does the work today: `scripts/`
