# Agents

Operational agents that automate the recurring patterns in this repo. Each agent has a defined trigger, input, output, and corresponding rule/standard.

| Agent | Triggers when | Output |
|---|---|---|
| [`skill-scaffolder/`](skill-scaffolder/) | New skill needed | Generates `SKILL.md` + `README.md` + folder structure |
| [`cross-reference-rippler/`](cross-reference-rippler/) | Skill / rule / family added | Updates SKILL-INDEX + root README + family README + yousirjuan docs |
| [`ship-auditor/`](ship-auditor/) | Pre-commit | Runs every verification gate, blocks commit on failure |
| [`gap-audit-runner/`](gap-audit-runner/) | After meaningful ship | Generates the audit file from a commit diff |
| [`count-keeper/`](count-keeper/) | Any skill folder change | Updates SKILL-INDEX + README counts |
| [`label-linter/`](label-linter/) | Compose file change | Verifies every service has the full `ai-skills-library.*` label schema |
| [`chain-employee`](../agents/chain-employee.md) | Task brief from `nephew` | Work record (diff + proof + findings + blockers) + "candidate complete" marker |
| [`chain-assistant-manager`](../agents/chain-assistant-manager.md) | Employee submits | Gap list (numbered) + Elevation list (lettered) + standards-check table + verdict |
| [`chain-manager`](../agents/chain-manager.md) | Asst Mgr forwards | Boolean lead sheet + DRY method report + safety summary + ship dossier |
| [`chain-director`](../agents/chain-director.md) | Manager forwards | Verdict (approved / approved-with-known-debt / return / rejected) + decision record + standards update |

## Status

All 6 ship as **stubs** in this commit — descriptions + agent contracts + invocation patterns. Implementation lands incrementally:

- **count-keeper**: covered today by `scripts/check-skill-count.sh`
- **ship-auditor**: covered today by manual run of `scripts/check-*.sh`
- **skill-scaffolder, cross-reference-rippler, gap-audit-runner, label-linter**: deferred to next sessions

## Agent contract

Every agent in this folder includes:

```
agents/<slug>/
├── README.md       # human-readable: what it does, when it fires, what it outputs
├── AGENT.md        # machine-readable: input schema, output schema, side effects
└── (eventual) implementation files
```

## Why agents (not just scripts)

A script is a one-shot helper. An agent has:
- Defined trigger
- Defined I/O contract
- A standard it enforces
- A rule it supports
- A canonical place to live (`agents/<slug>/`)

When automation graduates from "useful one-liner" to "this should run every time," it becomes an agent.
