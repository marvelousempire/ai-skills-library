# Agent notes (this repository)

This repo is a **skills library**, not a shipped application.

- **Browse:** start at [`README.md`](README.md) and [`skills/README.md`](skills/README.md).
- **Use skills inside another repo (Cursor):** run [`scripts/install-repo-skills-to-cursor-project.sh`](scripts/install-repo-skills-to-cursor-project.sh) — see [`docs/cursor-project-skills.md`](docs/cursor-project-skills.md).
- **Refresh vendored copies from a dev machine:** [`scripts/vendor-skills-from-home.sh`](scripts/vendor-skills-from-home.sh) then regenerate catalogs (the script runs the Python generators).
- **Add or index a skill:** [`docs/add-skill.md`](docs/add-skill.md).

Do not create new skills under `~/.cursor/skills-cursor/` (reserved for Cursor-built-in skills); author project or personal skills per Cursor **create-skill** in [`skills/ide/cursor/create-skill/SKILL.md`](skills/ide/cursor/create-skill/SKILL.md).

---

## Agent registry (`agents/`)

Every agent in this library is part of **[`nephew`](agents/nephew.md)'s** dispatch — the Orchestrator Agent by Avery Goodman. Nephew is the front door; the agents below are organized into **three layers** that work together on every substantive change:

| Layer | Need it meets | Sub-table below |
|---|---|---|
| **1 · Workers** | *Who's thinking?* | Native swarm (in nephew's package) — `@nephew-core:*` and `@nephew-federation:*` |
| **2 · Process** | *Who's signing?* | Chain of command — 4 seats, work flows 1 → 4 |
| **3 · Specialists** | *What's executing?* | Utility team — 13 narrow, automated tools |

A typical substantive change uses **all three layers in sequence**, not just one. See [`docs/standards/orchestration-hierarchy.md`](docs/standards/orchestration-hierarchy.md) for the canonical map, mental model, and worked example.

### Front door — nephew

| Agent | Role |
|---|---|
| [`nephew`](agents/nephew.md) | **The dealer.** Reads intent, commissions the right sub-team, returns the dossier. Multi-agent swarm + Ed25519-signed witness manifest (ADR-103) + cross-installation federation. Lives at `marvelousempire/nephew` (pointer here per [`rules/library/add-agent-to-skills-library/body.md`](rules/library/add-agent-to-skills-library/body.md)). |

### Layer 2 — Process (the review chain)

Four seats. Each chair has a single authority (its "crown"). Work flows from seat 1 to seat 4. Process chairs don't do cognitive work themselves — they commission Layer-1 workers to do specific sub-tasks during their review. See [`docs/standards/chain-of-command.md`](docs/standards/chain-of-command.md).

| Seat | Agent | Crown |
|---|---|---|
| 1 | [`chain-employee`](agents/chain-employee.md) | *Propose completion* — performs the task, records proof, hands upward |
| 2 | [`chain-assistant-manager`](agents/chain-assistant-manager.md) | *Return for rework* — validates proof, gap+elevation pass |
| 3 | [`chain-manager`](agents/chain-manager.md) | *Ship-ready authority* — full failure-proof audit, lead sheet |
| 4 | [`chain-director`](agents/chain-director.md) | *Sign-off + standards admission* — final approval, decision records |

### Layer 3 — Specialists (automated narrow tooling)

Thirteen one-shot tools. Each owns one well-defined recurring operational job. Idempotent, deterministic.

| Agent | Purpose |
|---|---|
| [`ledger-orchestrator`](agents/ledger-orchestrator.md) | Atomic plan + features + surfaces + change-log seed migration |
| [`migration-author`](agents/migration-author.md) | Migrations with safety guards baked in (FK type check, ALTER TYPE placement, idempotency) |
| [`rebase-shepherd`](agents/rebase-shepherd.md) | Auto-resolve CHANGELOG / Feature Ledger / pbxproj / Codable conflicts |
| [`ship-flow-runner`](agents/ship-flow-runner.md) | Full commit → CI → merge → deploy → smoke loop |
| [`post-ship-auditor`](agents/post-ship-auditor.md) | Gap audit + elevation pass after every substantive ship |
| [`count-keeper/`](agents/count-keeper/) | Update SKILL-INDEX + README counts on any skill folder change |
| [`label-linter/`](agents/label-linter/) | Verify every service has the full `ai-skills-library.*` label schema |
| [`cross-reference-rippler/`](agents/cross-reference-rippler/) | Update SKILL-INDEX + root README + family README + downstream docs on skill add |
| [`skill-scaffolder/`](agents/skill-scaffolder/) | Generate `SKILL.md` + `README.md` + folder structure for new skills |
| [`gap-audit-runner/`](agents/gap-audit-runner/) | Generate the audit file from a commit diff |
| [`ship-auditor/`](agents/ship-auditor/) | Pre-commit verification gate — runs every check, blocks commit on failure |
| [`question-decomposer/`](agents/question-decomposer/) | Two-part / FAQ-style intent disambiguation |
| [`moic-receipt-signature-agent/`](agents/moic-receipt-signature-agent/) | Keep MOIC receipt signatures, `response_signature` metadata, patrol expectations, and bridge copies aligned |
| [`forensic-case-investigator`](agents/forensic-case-investigator.md) | SAR case folders, Ground Zero, backward trace, ant-in-the-jungle diligence |
| [`bishop`](agents/bishop.md) | Mandatory Philosophy on new agents; investigation close audit before fix ship |

### Layer 1 — Workers (the cognitive engine — lives in nephew's package)

Five specialized minds doing the thinking-heavy lifting. Surfaced inside Claude Code via `@nephew-core:*` and `@nephew-federation:*`. Per [`rules/library/add-agent-to-skills-library/body.md`](rules/library/add-agent-to-skills-library/body.md) (pointer-not-replica), they are NOT duplicated into this library; they are documented through [`agents/nephew.md`](agents/nephew.md).

| Invocation | Purpose |
|---|---|
| `@nephew-core:researcher` | "Where does X live?" / prior-art surfacing |
| `@nephew-core:coder` | "Implement Y matching the rest of the platform" |
| `@nephew-core:reviewer` | "Audit this diff for [X]" |
| `@nephew-core:witness-curator` | Record what shipped to the Ed25519-signed witness chain |
| `@nephew-federation:federation-coordinator` | Cross-installation handoff via WireGuard |


## How to consume an agent

In red-e-play (Claude Code), reference the agent in your subagent_type field:

```
Agent({
  subagent_type: "ledger-orchestrator",
  description: "Register the trainer-marketplace plan",
  prompt: "<structured input per agents/ledger-orchestrator.md>"
})
```

Or, more naturally, the calling agent invokes the agent by name.

## Adding a new agent

1. Copy [`templates/agent.md`](templates/agent.md) to `agents/<kebab-name>.md`
2. Fill in the front-matter (name / description / tools / model) and body sections
3. **Include mandatory `## Philosophy`** — Bishop rejects agents without it (see [`agents/bishop.md`](agents/bishop.md); example: [`forensic-case-investigator`](agents/forensic-case-investigator.md))
4. Update this file's registry table
5. Update [`SKILL-INDEX.md`](SKILL-INDEX.md) if the agent has a companion skill
