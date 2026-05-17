# Orchestration Hierarchy — nephew is the front desk

The ai-skills-library has many products (skills, rules, agents, templates, checklists, docs). They are not invoked directly. Every interaction with the library flows through **`nephew`** — the Orchestrator Agent by Avery Goodman. Nephew reads intent and commissions the right team.

This document explains *what* the teams are, *why* there are three of them, and *how* nephew picks.

---

## The mental model (start here)

Every piece of work that the library produces needs three things to be real:

| Need | Met by | Question it answers |
|---|---|---|
| **Someone to do the cognitive work** — research the codebase, write the code, audit the diff, sign the manifest, federate to another machine | **Workers** | *Who's doing the thinking?* |
| **Someone to review and approve it** — catch gaps before merge, audit standards, decide whether it ships, admit new conventions | **Process** | *Who's signing off?* |
| **Specific machinery to make it durable** — register the plan, run the migration, run the ship pipeline, refresh the index, verify signature drift | **Specialists** | *What automated tooling executes the narrow, well-defined steps?* |

Those three needs map to nephew's three teams. Not three flavors of the same thing — **three layers that work together on every substantive change.**

```
                            ┌────────────────────────────┐
                            │      N E P H E W           │
                            │      the front desk        │
                            │   reads intent, commissions│
                            └─────────────┬──────────────┘
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              ▼                           ▼                           ▼
   ╔═══════════════════════╗   ╔═══════════════════════╗   ╔═══════════════════════╗
   ║   1 · WORKERS         ║   ║   2 · PROCESS         ║   ║   3 · SPECIALISTS     ║
   ║   ─────────────       ║   ║   ─────────────       ║   ║   ─────────────       ║
   ║   the cognitive       ║   ║   the review chain    ║   ║   automated narrow    ║
   ║   engine              ║   ║                       ║   ║   tooling             ║
   ║                       ║   ║                       ║   ║                       ║
   ║   Five specialized    ║   ║   Four chairs work    ║   ║   Thirteen one-shot   ║
   ║   minds doing the     ║   ║   flows through —     ║   ║   tools for narrow,   ║
   ║   thinking-heavy      ║   ║   from proposal to    ║   ║   well-defined jobs   ║
   ║   lifting             ║   ║   final sign-off      ║   ║                       ║
   ║                       ║   ║                       ║   ║                       ║
   ║   "Who's thinking?"   ║   ║   "Who's signing?"    ║   ║   "What's executing?" ║
   ╚═══════════════════════╝   ╚═══════════════════════╝   ╚═══════════════════════╝
        Native swarm                Chain of command              Utility team
        (lives in nephew package)   (library-native)              (library-native)
```

These are NOT competing teams. A single substantive change typically uses **all three** in sequence:

> A coder (Layer 1, worker) implements the change → an Asst Manager (Layer 2, process) reviews it → a ship-flow-runner (Layer 3, specialist) handles the commit-CI-merge-deploy mechanics → a Director (Layer 2, process) signs off → a witness-curator (Layer 1, worker) records what shipped.

---

## A worked example, end-to-end

Real task from this session: **"Add a Makefile to brokerage-prototype so `make go` works like other apps."**

| Step | What happens | Which layer fires |
|---|---|---|
| 1. Intent arrives | User asks for the Makefile. Nephew reads intent: multi-file feature → needs review-and-ship. | nephew |
| 2. Plan + research | Find the existing launcher (`./go`), inventory targets, identify Claude Preview integration | **Layer 1 — worker** (`@nephew-core:researcher`) |
| 3. Implementation | Write the Makefile, `.claude/launch.json`, README troubleshooting block | **Layer 1 — worker** (`@nephew-core:coder`) |
| 4. Self-review | Catch the bugs before submission (`make clean` confirmation, `.DEFAULT_GOAL` explicit, `make help` self-documenting) | **Layer 1 — worker** (`@nephew-core:reviewer`) |
| 5. Submit for review | Hand the work record upward with proof of acceptance | **Layer 2 — process** (`chain-employee` proposes completion) |
| 6. First review | Gap audit + elevation pass; standards check; verdict: forward / return | **Layer 2 — process** (`chain-assistant-manager` returns rework) |
| 7. Operational audit | Full failure-proof audit, Boolean lead sheet, safety verification | **Layer 2 — process** (`chain-manager` ships-ready authority) |
| 8. Ship mechanics | Commit → CI → merge → deploy → smoke loop | **Layer 3 — specialist** (`ship-flow-runner`) |
| 9. Register in ledger | Atomic plan + features + surfaces + change-log seed | **Layer 3 — specialist** (`ledger-orchestrator`) |
| 10. Index sweep | Update SKILL-INDEX, README counts, cross-references | **Layer 3 — specialists** (`count-keeper` + `cross-reference-rippler`) |
| 11. Final sign-off | Approve / approved-with-known-debt / return / rejected | **Layer 2 — process** (`chain-director`) |
| 12. Witness | Sign the shipped fix into the cryptographic chain | **Layer 1 — worker** (`@nephew-core:witness-curator`) |

Twelve steps, three layers, one nephew dispatching them. Each agent has a tight job; nephew is the conductor.

---

## How nephew picks — the decision guide

When a task arrives, nephew runs three reads in this order:

### Read 1 · How big is the change? *(triggers Layer 2 — process)*

| Change blast radius | Process chairs commissioned |
|---|---|
| Typo, README fix, single-line doc edit | None — author commits directly (still records proof) |
| Single-file bug fix, non-shared scope | Employee → Asst Mgr (quick review, no operational gate) |
| Multi-file feature, new component, schema change | Employee → Asst Mgr → Manager (full audit + ship via specialist) |
| New standard, new top-level dir, deploy pipeline change, cross-installation change | Employee → Asst Mgr → Manager → Director (decision record required; `STRUCTURE.md` updates only by Director) |
| Policy / pricing / external commitment change | Manager escalates directly to Director regardless of audit color |

### Read 2 · What thinking does the work need? *(triggers Layer 1 — workers)*

| Intent fingerprint | Worker commissioned |
|---|---|
| "Where does X live?" / "What's the prior art for Y?" | `@nephew-core:researcher` |
| "Implement Y matching the rest of the platform" | `@nephew-core:coder` |
| "Audit this diff for [X]" | `@nephew-core:reviewer` |
| "Record what shipped" / "Verify the witness chain" | `@nephew-core:witness-curator` |
| "Hand off this swarm to another machine" | `@nephew-federation:federation-coordinator` |

### Read 3 · What operational mechanics does the work need? *(triggers Layer 3 — specialists)*

| Mechanical need | Specialist commissioned |
|---|---|
| Register a plan + features + change-log in one move | `ledger-orchestrator` |
| Author a migration with safety guards | `migration-author` |
| Auto-resolve CHANGELOG / Feature Ledger / pbxproj merge conflicts | `rebase-shepherd` |
| Commit → CI → merge → deploy → smoke loop | `ship-flow-runner` |
| Gap audit + elevation pass after the substantive ship | `post-ship-auditor` |
| Update SKILL-INDEX / README counts / container labels / cross-references | `count-keeper` · `label-linter` · `cross-reference-rippler` |
| Generate a new skill folder | `skill-scaffolder` |
| Run the gap audit from a commit diff | `gap-audit-runner` |
| Pre-commit verification gate | `ship-auditor` |
| Two-part / FAQ-style intent disambiguation | `question-decomposer` |
| Keep MOIC receipt signatures and `response_signature` metadata aligned | `moic-receipt-signature-agent` |

A given task usually triggers **one row from each read**. Sometimes the three reads activate simultaneously (a typo fix triggers no chairs and no specialists, just a coder edit). Sometimes a complex task triggers multiple specialists in sequence (the Makefile example used `ship-flow-runner` + `ledger-orchestrator` + `count-keeper` + `cross-reference-rippler`).

---

## The teams (registry — for reference, not introduction)

### Layer 1 — Workers (the cognitive engine)

Live inside the nephew package. Surfaced via `@nephew-core:*` and `@nephew-federation:*` inside Claude Code.

| Worker | What it thinks about |
|---|---|
| `@nephew-core:researcher` | Prior-art surfacing, "where does X live in this codebase?" |
| `@nephew-core:coder` | "Implement Y matching the rest of the platform" |
| `@nephew-core:reviewer` | "Audit this diff for [X]" (technical review, not the chain-of-command review) |
| `@nephew-core:witness-curator` | Record what shipped to the Ed25519-signed witness chain |
| `@nephew-federation:federation-coordinator` | Cross-installation handoff over WireGuard |

These five are NOT duplicated into ai-skills-library/agents/ per [`rules/library/add-agent-to-skills-library/body.md`](../../rules/library/add-agent-to-skills-library/body.md) (pointer-not-replica). See [`agents/nephew.md`](../../agents/nephew.md) for invocation patterns.

### Layer 2 — Process (the review chain)

Library-native. See [`docs/standards/chain-of-command.md`](chain-of-command.md) for the full mechanics + handoff rules.

| Seat | Agent | Crown (the authority this seat holds) |
|---|---|---|
| 1 | [`chain-employee`](../../agents/chain-employee.md) | *Propose completion* — performs the task, records proof, hands upward |
| 2 | [`chain-assistant-manager`](../../agents/chain-assistant-manager.md) | *Return for rework* — validates proof, gap+elevation pass, returns specific corrections |
| 3 | [`chain-manager`](../../agents/chain-manager.md) | *Ship-ready authority* — full failure-proof audit, Boolean lead sheet, runs the ship pipeline |
| 4 | [`chain-director`](../../agents/chain-director.md) | *Sign-off + standards admission* — final approval, decision records, `STRUCTURE.md` updates |

Each chair is a process role, not a doer. A chair commissions Layer-1 workers to do specific cognitive sub-tasks during its review (e.g., `chain-manager` invokes `@nephew-core:reviewer` to do a technical audit as part of its operational audit).

### Layer 3 — Specialists (automated narrow tooling)

Library-native. Each handles one well-defined, recurring operational job. Idempotent, deterministic.

| Specialist | Narrow job it owns |
|---|---|
| [`ledger-orchestrator`](../../agents/ledger-orchestrator.md) | Atomic plan + features + surfaces + change-log seed migration |
| [`migration-author`](../../agents/migration-author.md) | Schema migrations with safety guards (FK type check, ALTER TYPE placement, idempotency) |
| [`rebase-shepherd`](../../agents/rebase-shepherd.md) | Auto-resolve CHANGELOG / Feature Ledger / pbxproj / Codable merge conflicts |
| [`ship-flow-runner`](../../agents/ship-flow-runner.md) | Full commit → CI → merge → deploy → smoke loop |
| [`post-ship-auditor`](../../agents/post-ship-auditor.md) | Gap audit + elevation pass after every substantive ship |
| [`count-keeper`](../../agents/count-keeper/) | Update SKILL-INDEX + README counts on any skill folder change |
| [`label-linter`](../../agents/label-linter/) | Verify every service has the full `ai-skills-library.*` label schema |
| [`cross-reference-rippler`](../../agents/cross-reference-rippler/) | Update SKILL-INDEX + root README + family README + downstream docs on skill-add |
| [`skill-scaffolder`](../../agents/skill-scaffolder/) | Generate `SKILL.md` + `README.md` + folder structure for new skills |
| [`gap-audit-runner`](../../agents/gap-audit-runner/) | Generate the audit file from a commit diff |
| [`ship-auditor`](../../agents/ship-auditor/) | Pre-commit verification gate — runs every check, blocks commit on failure |
| [`question-decomposer`](../../agents/question-decomposer/) | Two-part / FAQ-style intent disambiguation |
| [`moic-receipt-signature-agent`](../../agents/moic-receipt-signature-agent/) | Keep MOIC receipt signatures, metadata schema, patrol expectations, and bridge copies aligned |

---

## The rule

**No agent in `agents/` may be invoked outside nephew's dispatch.** Every agent in this library carries a "Commissioned by nephew" clause in its spec. The three layers are nephew's three teams — not three orchestrators. If you find an agent being invoked directly without going through nephew, that's a bug, not a feature.

This is what makes the library look "built separately, made together at the end." Each agent is a self-contained, vendor-ready spec. Nephew is the single seam.

---

## Engine note — what powers the cognitive layer (Workers) today

The five workers (`researcher / coder / reviewer / witness-curator / federation-coordinator`) are provided by two upstream plugins from `ruvnet/ruflo`:

| Plugin | Provides | Token cost |
|---|---|---|
| [`ruflo-core@ruflo`](https://github.com/ruvnet/ruflo) | researcher / coder / reviewer / witness-curator + 4 hooks + 6 skills | ~467 always-on tokens / session |
| [`ruflo-federation@ruflo`](https://github.com/ruvnet/ruflo) | federation-coordinator + 4 federation skills | ~161 always-on tokens / session |

Total: **~628 always-on tokens per session.** This is the price of nephew's cognitive layer being available without an `npx` round-trip.

Per [`rules/library/plugin-economy/body.md`](../../rules/library/plugin-economy/body.md) — installed dependencies are documented, not hidden. When `marvelousempire/nephew` ships its own marketplace (currently aspirational), we swap to `nephew-core@nephew` and `nephew-federation@nephew` and document the swap in `docs/improvement/decision-records/`. Until then, ruflo is the engine.

See [`agents/nephew.md`](../../agents/nephew.md) §"My infrastructure" for the full table + swap plan.

---

## Pointer-not-replica discipline (RL-0046)

When an agent lives in its own repo — like nephew itself, which lives at `marvelousempire/nephew` — the library carries a **pointer** at `agents/<name>.md`, never a copy. The pointer documents inputs / outputs / safety; the upstream repo is the engine.

This is why Layer 1's workers **are not duplicated into `agents/`** of this library. They live in the nephew package; the pointer at `agents/nephew.md` describes how to invoke them. New agents that live in their own repos follow the same pattern — see [`rules/library/add-agent-to-skills-library/body.md`](../../rules/library/add-agent-to-skills-library/body.md).

---

## Related

- Agent spec: [`agents/nephew.md`](../../agents/nephew.md) — nephew's own POV (with §"My team" + §"My infrastructure")
- Standard: [`docs/standards/chain-of-command.md`](chain-of-command.md) — Layer 2 mechanics in depth (handoff rules, blast-radius matrix, signature rule)
- Rule: [`rules/library/add-agent-to-skills-library/body.md`](../../rules/library/add-agent-to-skills-library/body.md) — pointer-not-replica
- Rule: [`rules/library/plugin-economy/body.md`](../../rules/library/plugin-economy/body.md) — documented dependencies + token cost honesty
- Registry: [`AGENTS.md`](../../AGENTS.md) — the full agent table grouped by layer
