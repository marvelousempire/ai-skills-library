# Agent notes (this repository)

This repo is a **skills library**, not a shipped application.

- **Browse:** start at [`README.md`](README.md) and [`skills/README.md`](skills/README.md).
- **Use skills inside another repo (Cursor):** run [`scripts/install-repo-skills-to-cursor-project.sh`](scripts/install-repo-skills-to-cursor-project.sh) — see [`docs/cursor-project-skills.md`](docs/cursor-project-skills.md).
- **Refresh vendored copies from a dev machine:** [`scripts/vendor-skills-from-home.sh`](scripts/vendor-skills-from-home.sh) then regenerate catalogs (the script runs the Python generators).
- **Add or index a skill:** [`docs/add-skill.md`](docs/add-skill.md).

Do not create new skills under `~/.cursor/skills-cursor/` (reserved for Cursor-built-in skills); author project or personal skills per Cursor **create-skill** in [`skills/ide/cursor/create-skill/SKILL.md`](skills/ide/cursor/create-skill/SKILL.md).

---

## Agent registry (`agents/`)

Subagent specifications introduced 2026-05-14. Each is a self-contained markdown file with YAML front-matter (name + description + tools + model).

| Agent | Purpose |
|---|---|
| [`ledger-orchestrator`](agents/ledger-orchestrator.md) | Atomic plan + features + surfaces + change-log seed migration |
| [`migration-author`](agents/migration-author.md) | Migrations with safety guards baked in (FK type check, ALTER TYPE placement, idempotency) |
| [`rebase-shepherd`](agents/rebase-shepherd.md) | Auto-resolve CHANGELOG / Feature Ledger / pbxproj / Codable conflicts |
| [`ship-flow-runner`](agents/ship-flow-runner.md) | Full commit → CI → merge → deploy → smoke loop |
| [`post-ship-auditor`](agents/post-ship-auditor.md) | Gap audit + elevation pass after every substantive ship |
| [`nephew`](agents/nephew.md) | The Orchestrator Agent by Avery Gooman — multi-agent swarm + Ed25519-signed witness manifest (ADR-103) + cross-installation federation. Project-scoped MCP, native witness CLI, Tier B cross-repo `fed find` |

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
3. Update this file's registry table
4. Update [`SKILL-INDEX.md`](SKILL-INDEX.md) if the agent has a companion skill
