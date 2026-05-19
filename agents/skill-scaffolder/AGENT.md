# Agent contract: skill-scaffolder


## Commissioned by

This agent is part of **nephew's** dispatch — it does not commission itself. Invocation flows from [`nephew`](../nephew.md) (the Orchestrator Agent by Avery Goodman) based on intent fingerprint. See [`docs/standards/orchestration-hierarchy.md`](../../docs/standards/orchestration-hierarchy.md) for the full team map.

## Trigger

User asks to add a new skill, OR `agents/skill-scaffolder/ scaffold <family>/<slug>`

## Input

(machine-readable schema TBD)

## Output

New files under `skills/<family>/<slug>/` (You-Sir Juan platform skills: **`skills/yousirjuan/<slug>/` only** — never `skills/project/yousirjuan/`):

- `SKILL.md` (YAML frontmatter + body)
- `skill.plugin.json` + `skill.plugin.md` (run `python3 scripts/generate-skill-plugin-manifests.py` after scaffold)
- `agent.plugin.json` + `agent.plugin.md` if scaffolding an agent folder (run `generate-agent-plugin-manifests.py`)

Updates parent `README.md` if family-level catalog exists. Bumps SKILL-INDEX count.

## Side effects

- May modify files listed in the output section.
- Always idempotent — safe to run repeatedly.
- Always read-only when checking; mutations only happen when the agent has explicit "apply" intent.

## Errors

- Exit 0 on success
- Exit 1 on hard failure (the agent couldn't do its job)
- Exit 2 on soft failure (something needed user attention)

## Status: Stub — implementation deferred
