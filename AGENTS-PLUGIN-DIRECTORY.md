# Agents plugin directory

WordPress-style plugin cards for every **agent** in this library (same model as skills).

| Layout | Source | Plugin manifest |
|--------|--------|-----------------|
| Flat | `agents/<slug>.md` | `agents/<slug>.plugin.json` + `.plugin.md` |
| Folder | `agents/<slug>/AGENT.md` | `agents/<slug>/agent.plugin.json` + `.plugin.md` |

**Unified catalog (skills + agents):** [`LIBRARY-PLUGIN-CATALOG.md`](LIBRARY-PLUGIN-CATALOG.md)

**Total agent plugins:** 24 · **Generated:** 2026-05-20 07:03 UTC

Regenerate: `python3 scripts/generate-agent-plugin-manifests.py`

**Bishop gate:** new agents must include `## Philosophy` and both plugin files before registration.

## Compliance (1)

| Agent | Ver | Status | Philosophy | Summary | Invoke |
|-------|-----|--------|------------|---------|--------|
| [**Moic Receipt Signature Agent**](agents/moic-receipt-signature-agent/agent.plugin.md) | 1.0.0 | needs_philosophy | — | Agent contract: moic-receipt-signature-agent | Commission **moic-receipt-signature-agent** via Nephew dispatch. |

## Factory (3)

| Agent | Ver | Status | Philosophy | Summary | Invoke |
|-------|-----|--------|------------|---------|--------|
| [**Count Keeper**](agents/count-keeper/agent.plugin.md) | 1.0.0 | needs_philosophy | — | This agent is part of **nephew's** dispatch — it does not commission itself. Invocation flows from [`nephew`](../nephew.md) (the Orchestrator Agent by Avery… | Commission **count-keeper** via Nephew dispatch. |
| [**Cross Reference Rippler**](agents/cross-reference-rippler/agent.plugin.md) | 1.0.0 | needs_philosophy | — | This agent is part of **nephew's** dispatch — it does not commission itself. Invocation flows from [`nephew`](../nephew.md) (the Orchestrator Agent by Avery… | Commission **cross-reference-rippler** via Nephew dispatch. |
| [**Skill Scaffolder**](agents/skill-scaffolder/agent.plugin.md) | 1.0.0 | needs_philosophy | — | This agent is part of **nephew's** dispatch — it does not commission itself. Invocation flows from [`nephew`](../nephew.md) (the Orchestrator Agent by Avery… | Commission **skill-scaffolder** via Nephew dispatch. |

## Investigation (1)

| Agent | Ver | Status | Philosophy | Summary | Invoke |
|-------|-----|--------|------------|---------|--------|
| [**Forensic Case Investigator**](agents/forensic-case-investigator.plugin.md) | 1.0.0 | stable | ✓ | Lead investigator for formal forensic cases. Opens case folders, runs SAR transactions (Intent, Product, validation, IFTTT branches), maintains hypothesis… | Commission **forensic-case-investigator** via Nephew dispatch. |

## Orchestration (6)

| Agent | Ver | Status | Philosophy | Summary | Invoke |
|-------|-----|--------|------------|---------|--------|
| [**Bishop**](agents/bishop.plugin.md) | 1.0.0 | stable | ✓ | Verification authority and agent factory gatekeeper. Audits forensic case folders before fix authorization. When creating or registering any agent, enforces… | Commission **bishop** via Nephew dispatch. |
| [**Chain Assistant Manager**](agents/chain-assistant-manager.plugin.md) | 1.0.0 | needs_philosophy | — | The first reviewer in the four-seat chain. Reads the Employee's work record, validates proof, checks the obvious gaps, returns corrections, or forwards upward… | Commission **chain-assistant-manager** via Nephew dispatch. |
| [**Chain Director**](agents/chain-director.plugin.md) | 1.0.0 | needs_philosophy | — | The final authority in the four-seat chain. Reviews the full chain output, validates the audit passes, checks long-term operational safety, approves new… | Commission **chain-director** via Nephew dispatch. |
| [**Chain Employee**](agents/chain-employee.plugin.md) | 1.0.0 | needs_philosophy | — | The doer in the four-seat chain of command. Performs the task, records proof, lists findings, identifies blockers, and marks completion status. Hands work… | Commission **chain-employee** via Nephew dispatch. |
| [**Chain Manager**](agents/chain-manager.plugin.md) | 1.0.0 | needs_philosophy | — | The operational gate in the four-seat chain. Validates both prior reviews, checks repo safety, scalability, maintainability, and the full Boolean lead sheet.… | Commission **chain-manager** via Nephew dispatch. |
| [**Nephew**](agents/nephew.plugin.md) | 1.0.0 | stable | — | Nephew — the Orchestrator Agent by Avery Gooman. Multi-agent orchestration for Claude Code (forked from Ruflo) — researcher / coder / reviewer /… | Commission **nephew** via Nephew dispatch. |

## Utility (13)

| Agent | Ver | Status | Philosophy | Summary | Invoke |
|-------|-----|--------|------------|---------|--------|
| [**Automata**](agents/automata.plugin.md) | 1.0.0 | needs_philosophy | — | Automata — living automation engine and belief system (Layer 0 under Nephew). Philosophical flow, biological hierarchy, Automata Pad desktop app, patrol… | Commission **automata** via Nephew dispatch. |
| [**Cinematic Reality Ui Guardian**](agents/cinematic-reality-ui-guardian.plugin.md) | 1.0.0 | stable | ✓ | SRIC-enforced guardian for the Cinematic Reality UI sealed tech stack. Audits requests against stack.ledger.yaml (dependencies, ui-kits, payloads,… | Commission **cinematic-reality-ui-guardian** via Nephew dispatch. |
| [**Dealer**](agents/dealer/agent.plugin.md) | 1.0.0 | needs_philosophy | — | Dealer — National Distributor of ALL Work *(Implemented by: **Nephew** — the Managing Trustee)* | Commission **dealer** via Nephew dispatch. |
| [**Gap Audit Runner**](agents/gap-audit-runner/agent.plugin.md) | 1.0.0 | needs_philosophy | — | This agent is part of **nephew's** dispatch — it does not commission itself. Invocation flows from [`nephew`](../nephew.md) (the Orchestrator Agent by Avery… | Commission **gap-audit-runner** via Nephew dispatch. |
| [**Label Linter**](agents/label-linter/agent.plugin.md) | 1.0.0 | needs_philosophy | — | This agent is part of **nephew's** dispatch — it does not commission itself. Invocation flows from [`nephew`](../nephew.md) (the Orchestrator Agent by Avery… | Commission **label-linter** via Nephew dispatch. |
| [**Ledger Orchestrator**](agents/ledger-orchestrator.plugin.md) | 1.0.0 | needs_philosophy | — | Atomically register a plan + N features + surfaces + plan_features + bootstrap change-log in a single seed migration. Mirrors red-e-play's 0157 / 0159 / 0164… | Commission **ledger-orchestrator** via Nephew dispatch. |
| [**Migration Author**](agents/migration-author.plugin.md) | 1.0.0 | needs_philosophy | — | Write migrations with all safety guards baked in: BEGIN/COMMIT semantics, ALTER TYPE placement, idempotency (IF NOT EXISTS, ON CONFLICT), FK target type… | Commission **migration-author** via Nephew dispatch. |
| [**Orchestrator**](agents/orchestrator/agent.plugin.md) | 1.0.0 | needs_philosophy | — | **Level:** Local (one tier below the Dealer) **Reports to:** Dealer (National Distributor) **Distributes to:** Receiving department agents (Scather, Decanter,… | Commission **orchestrator** via Nephew dispatch. |
| [**Post Ship Auditor**](agents/post-ship-auditor.plugin.md) | 1.0.0 | stub | — | After every substantive PR merges + deploys + smoke-tests green, run a 2-pass audit: (1) Gap pass — what's incomplete, deferred, fragile, untested; (2)… | Commission **post-ship-auditor** via Nephew dispatch. |
| [**Question Decomposer**](agents/question-decomposer/agent.plugin.md) | 1.0.0 | needs_philosophy | — | This agent is part of **nephew's** dispatch — it does not commission itself. Invocation flows from [`nephew`](../nephew.md) (the Orchestrator Agent by Avery… | Commission **question-decomposer** via Nephew dispatch. |
| [**Rebase Shepherd**](agents/rebase-shepherd.plugin.md) | 1.0.0 | needs_philosophy | — | Auto-resolve known conflict patterns during git rebase: CHANGELOG.md (keep both newest-first), Feature Ledger.md (additive merge), project.pbxproj (take HEAD… | Commission **rebase-shepherd** via Nephew dispatch. |
| [**Ship Auditor**](agents/ship-auditor/agent.plugin.md) | 1.0.0 | needs_philosophy | — | This agent is part of **nephew's** dispatch — it does not commission itself. Invocation flows from [`nephew`](../nephew.md) (the Orchestrator Agent by Avery… | Commission **ship-auditor** via Nephew dispatch. |
| [**Ship Flow Runner**](agents/ship-flow-runner.plugin.md) | 1.0.0 | needs_philosophy | — | Run the full commit → push → PR → CI watch → merge → deploy → smoke loop in the background. Reports each stage by name (committed / pushed / PR'd / merged /… | Commission **ship-flow-runner** via Nephew dispatch. |
