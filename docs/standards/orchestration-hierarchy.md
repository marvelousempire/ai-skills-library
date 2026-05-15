# Orchestration Hierarchy — nephew is the front desk

The ai-skills-library has many products (skills, rules, agents, templates, checklists, docs). They are not invoked directly. Every interaction with the library flows through **`nephew`** — the Orchestrator Agent by Avery Goodman. Nephew reads intent and commissions the right team.

This document is the one-page map.

```
                           ┌─────────────────────┐
                           │   N E P H E W       │
                           │   the dealer        │
                           │  agents/nephew.md   │
                           └──────────┬──────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
            ▼                         ▼                         ▼
   ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
   │  NATIVE SWARM      │   │  CHAIN OF COMMAND  │   │  UTILITY TEAM      │
   │  (in nephew repo)  │   │  (library-native)  │   │  (library-native)  │
   ├────────────────────┤   ├────────────────────┤   ├────────────────────┤
   │ researcher         │   │ chain-employee     │   │ ledger-orchestrator│
   │ coder              │   │ chain-asst-manager │   │ migration-author   │
   │ reviewer           │   │ chain-manager      │   │ rebase-shepherd    │
   │ witness-curator    │   │ chain-director     │   │ ship-flow-runner   │
   │ federation-coord.  │   │                    │   │ post-ship-auditor  │
   │                    │   │                    │   │ count-keeper       │
   │ Surfaced via       │   │ Surfaced via       │   │ label-linter       │
   │ @nephew-core:*     │   │ chain-of-command   │   │ cross-ref-rippler  │
   │ @nephew-federation │   │ standard           │   │ skill-scaffolder   │
   │                    │   │                    │   │ gap-audit-runner   │
   │                    │   │                    │   │ ship-auditor       │
   │                    │   │                    │   │ question-decomposer│
   └────────────────────┘   └────────────────────┘   └────────────────────┘
```

## Engine note — what powers the native swarm today

The 5 agents in the Native Swarm box (`researcher / coder / reviewer / witness-curator / federation-coordinator`) are currently provided by two upstream plugins from `ruvnet/ruflo`:

| Plugin | Provides | Token cost |
|---|---|---|
| [`ruflo-core@ruflo`](https://github.com/ruvnet/ruflo) | researcher / coder / reviewer / witness-curator + 4 hooks + 6 skills | ~467 always-on tokens / session |
| [`ruflo-federation@ruflo`](https://github.com/ruvnet/ruflo) | federation-coordinator + 4 federation skills | ~161 always-on tokens / session |

Total: **~628 always-on tokens per session.** This is the price of nephew's full dispatch always being available.

Per [`rules/library/plugin-economy/body.md`](../../rules/library/plugin-economy/body.md) — installed dependencies are documented, not hidden. When `marvelousempire/nephew` ships its own marketplace (currently aspirational), we swap to `nephew-core@nephew` and `nephew-federation@nephew` and document the swap in `docs/improvement/decision-records/`. Until then, ruflo is the engine.

See [`agents/nephew.md`](../../agents/nephew.md) §"My infrastructure" for the full table + swap plan.

## The rule (RL-NEW · drafted in this commit)

**No agent in `agents/` may be invoked outside nephew's dispatch.** Every other agent in the registry has a `Commissioned by nephew` clause in its spec. The chain of command, the utility team, and (where applicable) the native swarm are nephew's three dispatch patterns — not three orchestrators.

This rule is what makes the library look "built separately, made together at the end." Each agent is a self-contained, vendor-ready spec. Nephew is the single seam.

## When nephew commissions which sub-team

| Intent fingerprint | Sub-team nephew commissions |
|---|---|
| "Where does X live?" / "What's the prior art for Y?" | **Native swarm** → `@nephew-core:researcher` |
| "Implement Y matching the rest of the platform" | **Native swarm** → `@nephew-core:coder` |
| "Audit this diff for [X]" | **Native swarm** → `@nephew-core:reviewer` |
| "Record what shipped" / "Verify the witness chain" | **Native swarm** → `@nephew-core:witness-curator` |
| "Hand off this swarm to another machine" | **Native swarm** → `@nephew-federation:federation-coordinator` |
| Any substantive change going through review-and-ship | **Chain of command** → `chain-employee` → … → `chain-director` |
| Register a plan + features + change-log in one move | **Utility team** → `ledger-orchestrator` |
| Author a migration with safety guards baked in | **Utility team** → `migration-author` |
| Auto-resolve CHANGELOG / Feature Ledger / pbxproj conflicts | **Utility team** → `rebase-shepherd` |
| Full commit → CI → merge → deploy → smoke loop | **Utility team** → `ship-flow-runner` |
| Gap audit + elevation pass after a substantive ship | **Utility team** → `post-ship-auditor` |
| Update SKILL-INDEX counts / container labels / cross-refs | **Utility team** → `count-keeper` / `label-linter` / `cross-reference-rippler` |
| Generate a new skill folder | **Utility team** → `skill-scaffolder` |
| Run the gap audit from a commit diff | **Utility team** → `gap-audit-runner` |
| Pre-commit verification gate | **Utility team** → `ship-auditor` |
| Two-part / faq-style intent disambiguation | **Utility team** → `question-decomposer` |

## How nephew dispatches in practice

Nephew is itself two surfaces:

1. **Inside Claude Code:** `@nephew-core:<role>` and `@nephew-federation:<role>` are the invocation patterns. Nephew's MCP server registers the swarm; the chain-of-command and utility agents are registered as project-scoped subagents.
2. **From the shell:** `nephew witness …` / `nephew status` / `nephew mcp start` / etc. — see [`agents/nephew.md`](../../agents/nephew.md) §"Pattern B."

Both surfaces converge on the same dispatch logic: nephew reads intent, picks a sub-team, returns the dossier.

## Pointer-not-replica discipline (RL-0046)

When an agent lives in its own repo — like nephew itself, which lives at `marvelousempire/nephew` — the library carries a **pointer** at `agents/<name>.md`, never a copy. The pointer documents inputs/outputs/safety; the upstream repo is the engine.

This is why nephew's native swarm (`researcher`, `coder`, etc.) **is not duplicated into `agents/`** of this library. It lives in the nephew package; the pointer at `agents/nephew.md` describes how to invoke it. New agents that live in their own repos follow the same pattern — see [`rules/library/add-agent-to-skills-library/body.md`](../../rules/library/add-agent-to-skills-library/body.md).

## Related

- Agent spec: [`agents/nephew.md`](../../agents/nephew.md) — the dealer
- Standard: [`docs/standards/chain-of-command.md`](chain-of-command.md) — one of nephew's three dispatch patterns
- Rule: [`rules/library/add-agent-to-skills-library/body.md`](../../rules/library/add-agent-to-skills-library/body.md) — pointer-not-replica
- Registry: [`AGENTS.md`](../../AGENTS.md) — the full table, reframed under nephew
