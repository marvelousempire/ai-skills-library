# Skill index

Quick reference: **what it is**, **where it lives in this repo**, **when to use it**, **overlap**.

**Browse all files on GitHub:** [`skills/README.md`](skills/README.md) → per-pack catalogs.

**Plugin directory (WordPress-style cards):** [`SKILLS-PLUGIN-DIRECTORY.md`](SKILLS-PLUGIN-DIRECTORY.md) · [`docs/skill-plugin-directory.md`](docs/skill-plugin-directory.md)

## Coverage

- **165** total `SKILL.md` files under [`skills/`](skills/) (each with `skill.plugin.json` + `skill.plugin.md`).
- Run [`scripts/rescan-skills.sh`](scripts/rescan-skills.sh) on a machine to compare live `~/` installs vs this repo.

| Skill / pack | Tool | In this repo | Use when | Invoke | Overlap |
|--------------|------|--------------|----------|--------|---------|
| **Marketing** (42) | Cursor + Claude | [`skills/marketing/`](skills/marketing/) · [catalog](skills/marketing/SKILL-CATALOG.md) | CRO, SEO, copy, ads, ASO, email, research, launch… | **`product-marketing-context`** first → name skill (e.g. **page-cro**) | ui-ux-pro-max, canvas |
| **copy-language-audit** | Cursor + Claude | [`skills/marketing/copy-language-audit/`](skills/marketing/copy-language-audit/) | Audit copy for binding/contractual language (integrations, partners) → replace with compatibility/accommodate vocabulary | "Use **copy-language-audit**." | copy-editing, copywriting |
| **session-retrospective** | Claude Code | [`skills/engineering/session-retrospective/`](skills/engineering/session-retrospective/) | Extract rules, skills, docs, and context files from a completed work session and file them into the library | "Use **session-retrospective**." | create-rule, create-skill |
| **fork-rebrand-product** | Cursor + Claude | [`skills/engineering/fork-rebrand-product/`](skills/engineering/fork-rebrand-product/) | Fork and rebrand an upstream product repo with scripts, attribution, compatibility fallbacks, docs, and stale-name verification | "Use **fork-rebrand-product**." | bulk-rename-tokens, decision-records, verification-gates |
| **membadat** bridge skill | Cursor + Claude | [`skills/external/membadat/`](skills/external/membadat/) · [external catalog](skills/external/SKILL-CATALOG.md) | Route agents to the Membadat upstream plugin without vendoring the product source; use for SYNTHIA memory tissue, Nephew memory, and session memory plugin work | "Use **membadat**." | fork-rebrand-product, claude-mem |
| **moic-response-signatures** | Cursor + Claude | [`skills/methodology/moic-response-signatures/`](skills/methodology/moic-response-signatures/) | Enforce Nephew/framework entity receipt signatures, response_signature MOIC metadata, and MOIC Signature Patrol for response identity and imposter detection | "Use **moic-response-signatures**." | nephew-mcp-cloak, verification-gates |
| **prd-journal-page-splitter** | Cursor + Claude | [`skills/methodology/prd-journal-page-splitter/`](skills/methodology/prd-journal-page-splitter/) | Parse PRD Journals, chat exports, and long planning docs into page/topic folders with one markdown file per section | "Use **prd-journal-page-splitter**." | doctrine-decanter-sorting-agent, ai-chat-archive-reconstruction |
| **doctrine-decanter-sorting-agent** | Cursor + Claude | [`skills/methodology/doctrine-decanter-sorting-agent/`](skills/methodology/doctrine-decanter-sorting-agent/) | Renumber requirements, de-duplicate (canonical top / duplicates bottom with spacing), explode monolith PRDs and doctrine dumps into `docs/` + `archive/` trees | "Use **doctrine-decanter-sorting-agent**." | prd-journal-page-splitter, skill-nutrients-decanter |
| **virtual-list-framer-motion** | Cursor + Claude | [`skills/engineering/virtual-list-framer-motion/`](skills/engineering/virtual-list-framer-motion/) | TanStack Virtual rows blank/stacked because Motion overwrites `translateY`; claude-chat-reader Docker dev port | "Use **virtual-list-framer-motion**." | ui-ux-pro-max |
| **full-viewport-responsive-dashboard-shell** | Cursor + Claude | [`skills/engineering/full-viewport-responsive-dashboard-shell/`](skills/engineering/full-viewport-responsive-dashboard-shell/) | Browser dashboard shells, operator surfaces, responsive dashboard grids, sidebars, terminals, and wall / TV viewport layouts | "Use **full-viewport-responsive-dashboard-shell**." | ui-ux-pro-max |
| **ui-ux-pro-max** | Cursor | [`skills/visual/design/ui-ux-pro-max/`](skills/visual/design/ui-ux-pro-max/) | Design, review, improve UI/UX; design systems | “Follow **ui-ux-pro-max** workflow.” | copywriting, page-cro |
| **ascii-flow-diagrams** | Claude Code + Cursor | [`skills/visual/diagrams/ascii-flow-diagrams/`](skills/visual/diagrams/ascii-flow-diagrams/) | User asks for a visual / flow / architecture / "how does X talk to Y" | Auto (`alwaysApply` rule); or “Use **ascii-flow-diagrams**.” | `docs/system-flow.md` |
| **seeme** | Node CLI | [`skills/visual/diagrams/seeme/`](skills/visual/diagrams/seeme/) | Generate diagrams from any text / file / idea — Ollama default, multi-provider | `seeme "..."` or “Use **seeme** on this.” | ascii-flow-diagrams |
| **self-hosted-git** | Docker Compose | [`skills/infra/self-hosted-git/`](skills/infra/self-hosted-git/) | Stand up private GitLab CE on a Mac mini (or any Docker host); CI runners, container registry, auto-HTTPS, Tailscale/WireGuard tunnel, backups | "Use **self-hosted-git**." or `docker compose -f templates/gitlab-compose.yml up -d` | yousirjuan Category 11 |
| **console** | Node + Make | [`skills/infra/console/`](skills/infra/console/) | Homelab unified UI + Makefile — boots / monitors / stops SEEME + GitLab + CI + Ollama + Dockyard as one stack. Status grid, engine badge, recent pipelines, quick-launch, `make doctor` | "Use **console**." or `make start` from `skills/infra/console/` | self-hosted-git, seeme, dockyard |
| **dockyard** | Docker labels + templates | [`skills/infra/dockyard/`](skills/infra/dockyard/) | Wire ai-skills-library stacks into [Dockyard](https://github.com/marvelousempire/claude-chat-reader/tree/main/dockyard) — label schema, install script, standalone compose, engine comparison (Colima/OrbStack/Docker Desktop), Docker-Desktop-to-Colima migration | "Use **dockyard**." or `bash skills/infra/dockyard/templates/install.sh` | self-hosted-git, seeme, console |
| **Methodology** (25) | Standards-as-skills | [`skills/methodology/`](skills/methodology/) | The patterns that produce clean shipments and reusable knowledge artifacts — plan-first, gap-audit-and-elevation, ai-chat-archive-reconstruction, automata-reconstructor, prd-journal-page-splitter, doctrine-decanter-sorting-agent, moic-response-signatures, forensic-case-investigation, nephew-cloak-amending-mission, failure-proof-audit, fork-divergence-tracker, shadow-and-record, skill-nutrients-decanter, idempotent-commands, cross-reference-rippling, verification-gates, multi-surface-design, decision-records, compliance-matrix, aesthetic-consistency, graceful-degradation, migration-guide-format, doctor-script-pattern | "Use **methodology/<slug>**." or follow `docs/study/` curriculum | docs/standards/, docs/templates/ |
| **forensic-case-investigation** | Cursor + Claude + Nephew | [`skills/methodology/forensic-case-investigation/`](skills/methodology/forensic-case-investigation/) | Formal case, forensic investigation, SAR transaction, Ground Zero, chain of custody, cross-surface bug dossier, ant-in-the-jungle diligence | "Use **forensic-case-investigation**." Open case `<slug>`. Bishop audits closes. | failure-proof-audit, verify-ship, shadow-and-record |
| **verify-ship** | Claude Code | [`skills/project/red-e-play/verify-ship/`](skills/project/red-e-play/verify-ship/) | Ship state: merged? deployed? | “Use **verify-ship**.” | shell |
| **generate-weather-plates** | Claude Code | [`skills/project/red-e-play/generate-weather-plates/`](skills/project/red-e-play/generate-weather-plates/) | Red-E Play weather hero plates | “Use **generate-weather-plates**.” | ui-ux-pro-max |
| **launcher-makefile-shim** | Claude Code | [`skills/project/brokerage-prototype/launcher-makefile-shim/`](skills/project/brokerage-prototype/launcher-makefile-shim/) | Add `make` verb shim over `./go`-style launcher | "Use **launcher-makefile-shim**." | — |
| **colima-docker-swap** | Claude Code | [`skills/project/brokerage-prototype/colima-docker-swap/`](skills/project/brokerage-prototype/colima-docker-swap/) | Swap wedged Docker Desktop for Colima on macOS Tahoe + Apple Silicon | "Use **colima-docker-swap**." or "Docker is broken." | self-hosted-git |
| **port-drift-detector** | Claude Code | [`skills/project/brokerage-prototype/port-drift-detector/`](skills/project/brokerage-prototype/port-drift-detector/) | Cross-repo drift detection between paired implementations (bash+awk, no LLM) | "Use **port-drift-detector**." | — |
| **babysit** | Cursor | [`skills/ide/cursor/babysit/`](skills/ide/cursor/babysit/) | PR merge-ready loop | “Use **babysit**.” | split-to-prs |
| **canvas** | Cursor | [`skills/ide/cursor/canvas/`](skills/ide/cursor/canvas/) | Data-heavy / analytical UI beside chat | “Use **canvas**.” | ui-ux-pro-max |
| **create-hook** | Cursor | [`skills/ide/cursor/create-hook/`](skills/ide/cursor/create-hook/) | Cursor hooks | “Use **create-hook**.” | create-rule |
| **create-rule** | Cursor | [`skills/ide/cursor/create-rule/`](skills/ide/cursor/create-rule/) | `.cursor/rules` | “Use **create-rule**.” | create-skill |
| **create-skill** | Cursor | [`skills/ide/cursor/create-skill/`](skills/ide/cursor/create-skill/) | Author `SKILL.md` | “Use **create-skill**.” | create-rule |
| **create-subagent** | Cursor | [`skills/ide/cursor/create-subagent/`](skills/ide/cursor/create-subagent/) | Subagents | “Use **create-subagent**.” | — |
| **migrate-to-skills** | Cursor | [`skills/ide/cursor/migrate-to-skills/`](skills/ide/cursor/migrate-to-skills/) | Rules → skills | “Use **migrate-to-skills**.” | create-skill |
| **sdk** | Cursor | [`skills/ide/cursor/sdk/`](skills/ide/cursor/sdk/) | `@cursor/sdk` | “Use **sdk**.” | shell |
| **shell** | Cursor | [`skills/ide/cursor/shell/`](skills/ide/cursor/shell/) | `/slash` shell | (slash) | babysit |
| **split-to-prs** | Cursor | [`skills/ide/cursor/split-to-prs/`](skills/ide/cursor/split-to-prs/) | Split PRs | “Use **split-to-prs**.” | babysit |
| **statusline** | Cursor | [`skills/ide/cursor/statusline/`](skills/ide/cursor/statusline/) | CLI statusline | “Use **statusline**.” | — |
| **update-cli-config** | Cursor | [`skills/ide/cursor/update-cli-config/`](skills/ide/cursor/update-cli-config/) | `cli-config.json` | “Use **update-cli-config**.” | update-cursor-settings |
| **update-cursor-settings** | Cursor | [`skills/ide/cursor/update-cursor-settings/`](skills/ide/cursor/update-cursor-settings/) | `settings.json` | “Use **update-cursor-settings**.” | update-cli-config |
| **ios-build-doctor** | Claude Code | [`skills/mobile/ios/ios-build-doctor/`](skills/mobile/ios/ios-build-doctor/) | Fix iOS build errors: disk check, enumerate ALL errors, classify and fix in dependency order | "Use **ios-build-doctor**." | worktree-janitor, swift-api-migration |
| **worktree-janitor** | Claude Code | [`skills/mobile/ios/worktree-janitor/`](skills/mobile/ios/worktree-janitor/) | Audit and remove stale merged worktrees; reclaim disk before builds | "Use **worktree-janitor**." | ios-build-doctor |
| **swift-api-migration** | Claude Code + Cursor | [`skills/mobile/ios/swift-api-migration/`](skills/mobile/ios/swift-api-migration/) | When a Swift API changes, find all callers and update every site in the same PR | "Use **swift-api-migration**." | ios-build-doctor |
| **Canonical rules** (Cursor + Claude codegen) | Cursor + Claude | [`rules/README.md`](rules/README.md) · [`docs/rules-pipeline.md`](docs/rules-pipeline.md) | Repo-wide discipline; generate into `.cursor/rules` + `.claude/rules` | Run `./scripts/sync-rules-into-repo.sh` | — |
| **External tools** (generated bridges, 13) | Cursor + Claude | [`skills/external/`](skills/external/) · [catalog](skills/external/SKILL-CATALOG.md) · [index](docs/related-github-projects.md) | Third-party GitHub tools (scraping, voice, MCP, local Claude Code…) | Name the skill id (e.g. **kokoro-fastapi**, **blender-mcp**) or open the index table | varies by tool |

## Product context (not a skill folder)

| Doc | In repo | Purpose |
|-----|---------|---------|
| READYPLAY marketing context | [`context/readyplay-product-marketing-context.md`](context/readyplay-product-marketing-context.md) | Positioning for all marketing skills — **edit canonical** in `red-e-play-app/.agents/` then re-vendor |

## Adding something new

[`docs/add-skill.md`](docs/add-skill.md) → then `./scripts/vendor-skills-from-home.sh` → commit.

## External tools vs vendored skills

- **Artifact** = what lives on GitHub (library, app, MCP server, …).
- **Bridge skill** = generated `skills/external/<id>/SKILL.md` from [`docs/external-tools.manifest.json`](docs/external-tools.manifest.json) — agent playbook only, not the product source.
- Full table with **Artifact** / **Skill** columns: [`docs/related-github-projects.md`](docs/related-github-projects.md).


---

## Skills added 2026-05-14 — You-Sir Juan OS session learnings

| Skill | Domain | Tool | Use when | Invoke |
|---|---|---|---|---|
| **parallel-agent-coordination** | yousirjuan | Claude Code | Multi-surface build: iOS + web + backend simultaneously | "Use **parallel-agent-coordination** pattern." |
| **associate-agent-system** | yousirjuan | Claude Code | Referencing or extending the 4-persona paradigm architecture | "See **associate-agent-system** skill." |
| **bash-installer-oneliners** | yousirjuan | Claude Code | Writing a new one-liner installer for a hardware platform | "Use **bash-installer-oneliners** pattern." |
| **hardware-compat-doc** | yousirjuan | Claude Code | Documenting a new machine for You-Sir Juan OS | "Use **hardware-compat-doc** skill." |
| **marketing-feature-doc** | yousirjuan | Claude Code | Writing docs/marketing/NN-feature.md for a shipped feature | "Use **marketing-feature-doc** skill." |
| **ios-realitykit-4-patterns** | yousirjuan | Claude Code | Building RealityKit 4 components for the iOS kiosk | "Use **ios-realitykit-4-patterns** skill." |

## Templates added 2026-05-14

| Template | Path | Use for |
|---|---|---|
| hardware-doc | `skills/templates/hardware-doc/TEMPLATE.md` | New machine compatibility docs |
| marketing-feature | `skills/templates/marketing-feature/TEMPLATE.md` | docs/marketing/ files |
| after-action | `skills/templates/after-action/TEMPLATE.md` | Session summaries |
| claude-md | `skills/templates/claude-md/TEMPLATE.md` | CLAUDE.md for new projects |

## Checklists added 2026-05-14

| Checklist | Path | Run when |
|---|---|---|
| pre-pr | `checklists/pre-pr.md` | Before opening any PR |
| new-session | `checklists/new-session.md` | Start of every Claude Code session |
| hardware-doc | `checklists/hardware-doc.md` | Before writing a hardware compat doc |
| installer-release | `checklists/installer-release.md` | Before tagging an installer release |

## After-action reports

| Report | Path | Session |
|---|---|---|
| Family Interface MVP | `after-action/2026-05-14-family-interface-mvp.md` | Built full YSJ OS MVP in one day |

## Trainer-Marketplace Session — Master Repo Evolution (2026-05-14)

13 new skills + 13 new rules + 5 agents + 8 templates + 7 checklists + 10 docs + 6 pain-journal entries from the 2026-05-14 trainer-marketplace session. See [`docs/master-reports/2026-05-14-trainer-marketplace-session.md`](docs/master-reports/2026-05-14-trainer-marketplace-session.md) for the full retrospective.

---

## Engineering skills added 2026-05-14 — Red-E Play admin + game pipeline session

8 new rules + 5 new skills + 2 context files from debugging the admin dashboard, game data pipeline, and iOS sync. See [`docs/master-plans/2026-05-14-redeyplay-admin-game-pipeline.md`](docs/master-plans/2026-05-14-redeyplay-admin-game-pipeline.md) for the full retrospective.

### New rules

| Rule | Path | Fire when |
|------|------|----------|
| **sidebar-nav-dual-list** | `rules/library/sidebar-nav-dual-list/body.md` | Adding a route to an admin/sidebar project with two nav files |
| **format-measurements-for-display** | `rules/library/format-measurements-for-display/body.md` | Displaying height, weight, duration, BPM, or any unit value |
| **mobile-jwt-ttl** | `rules/library/mobile-jwt-ttl/body.md` | Setting JWT TTL for any mobile client |
| **stats-query-participation-not-creator** | `rules/library/stats-query-participation-not-creator/body.md` | Writing any SQL query that counts games/sessions for a player |
| **all-participants-push-data** | `rules/library/all-participants-push-data/body.md` | Designing client-to-server sync for multi-player records |
| **rebase-changelog-keep-both-sides** | `rules/library/rebase-changelog-keep-both-sides/body.md` | Running automated conflict resolution on CHANGELOG.md during rebase |
| **agent-stray-files-guard** | `rules/library/agent-stray-files-guard/body.md` | Reviewing any PR created by a spawned agent |
| **diagnosis-before-fix** | `rules/library/diagnosis-before-fix/body.md` | Debugging "stats show zeros" or "data not showing" |

### New skills

| Skill | Domain | Tool | Use when | Invoke |
|-------|--------|------|----------|--------|
| **data-pipeline-tracer** | engineering | Claude Code | Tracing end-to-end data loss: stats zeros, iOS data not on web, field missing from profile | "Use **data-pipeline-tracer**." |
| **admin-completeness-audit** | engineering | Claude Code | Auditing whether a new admin page is fully wired across sidebar, nav config, backend, types, API helper | "Use **admin-completeness-audit**." |
| **disk-hygiene** | engineering | Claude Code | Clearing disk space from stale worktree node_modules, DerivedData, build artifacts | "Use **disk-hygiene**." |
| **migration-collision-recovery** | engineering | Claude Code | Fixing a duplicate migration prefix caught by CI guard | "Use **migration-collision-recovery**." |
| **diagnosis-report** | engineering | Claude Code | Writing a structured diagnosis doc after SSH investigation: DB state, root causes, resolution checklist | "Use **diagnosis-report**." |

### New context files

| File | Use for |
|------|---------|
| `context/readyplay-admin-architecture.md` | Admin dual-nav pattern, formatPlayer serializer, route structure, measurement display, stats SQL |
| `context/readyplay-game-data-pipeline.md` | Full game sync flow, JWT TTL config, participation SQL, activity_events vs game_sessions |

### New skills (`skills/engineering/`)

| Skill | Use when | Invoke |
|---|---|---|
| **register-feature-ledger-plan** | Registering a plan + N features in admin ledger BEFORE coding | `/register-feature-ledger-plan <slug>` |
| **ship-flow** | Running commit → CI → merge → deploy → smoke loop | `/ship-flow` |
| **rebase-changelog-resolver** | Auto-resolve CHANGELOG.md conflicts on rebase | `/rebase-changelog-resolver` |
| **schema-fk-typecheck** | Verify parent's column type before declaring FK child column | `/schema-fk-typecheck <migration.sql>` |
| **migration-shipping** | Full migration safety checklist (FK + ALTER TYPE + idempotency + smoke) | `/migration-shipping <migration.sql>` |
| **post-ship-audit-elevation** | Right after a substantive ship — gap audit + elevation menu | `/post-ship-audit-elevation` |
| **secure-data-flow-protocol** | Adding a new field that flows iOS → API → DB → API → reader | `/secure-data-flow-protocol <field>` |
| **plan-mode-runbook** | Plan-mode is active — Explore → Plan → Review → ExitPlanMode | `/plan-mode-runbook` |
| **multi-actor-consensus-mechanic** | Designing any anti-fraud / trust signal that needs ≥N independent actors | `/multi-actor-consensus-mechanic` |
| **marketplace-with-trust-reserve** | Designing a two-sided marketplace with fee split + audit funding | `/marketplace-with-trust-reserve` |
| **versioned-pinned-protocol** | Curriculum / rubric / scoring system that needs historical stability | `/versioned-pinned-protocol` |
| **bulk-rename-tokens** | Deterministic token rename across 3+ files via Python heredoc | `/bulk-rename-tokens` |
| **quality-bar-honest** | User demands 100% delivery on impossible scope; reply with honest framing | `/quality-bar-honest` |

### New rules (`rules/library/`)

| Rule | Applies to | Always-on? |
|---|---|---|
| **feature-id-race-guard** | Multi-feature seed migrations | ✓ |
| **fk-target-type-check** | Any FK column declaration | ✓ |
| **alter-type-outside-transaction** | Migrations with enum extensions | ✓ |
| **is-public-flip-on-plan-insert** | Plan-registration seed migrations | ✓ |
| **forward-only-migration-fix** | Failed migrations | ✓ |
| **honest-scope-reply** | Scope-exceeding asks | ✓ |
| **parallel-pr-rebase-tax** | Multi-PR sessions | — |
| **feature-ledger-first** | Any new feature work | ✓ |
| **bulk-token-substitution** | 3+ file deterministic edits | — |
| **smoke-test-after-deploy** | Every deploy | ✓ |
| **askuserquestion-fallback** | AskUserQuestion tool calls | ✓ |
| **quality-bar-do-it-right** | Any "right vs hack" choice | ✓ |
| **pipeline-stage-truth** | Every "done" reply | ✓ |

### New agents (`agents/`)

See [`AGENTS.md`](AGENTS.md):
- **ledger-orchestrator** — atomic plan + features seed migration
- **migration-author** — migrations with safety guards
- **rebase-shepherd** — auto-resolve known conflict patterns
- **ship-flow-runner** — full commit → deploy → smoke loop
- **post-ship-auditor** — gap audit + elevation pass

### New templates (`templates/`)

`plan-doc.md` · `seed-migration-plan-registration.sql` · `schema-migration.sql` · `changelog-entry.md` · `skill.md` · `rule-body.md` · `rule-meta.json` · `agent.md`

### New checklists (`checklists/`)

`pre-commit.md` · `pre-merge.md` · `pre-deploy.md` · `post-deploy-smoke.md` · `honest-scope-deferral.md` · `multi-pr-session-opener.md` · `rebase-conflict-resolver.md`

### New docs

- `docs/master-reports/2026-05-14-trainer-marketplace-session.md`
- `docs/playbooks/` × 5 (plan-mode-to-ship · migration-rolled-back · multi-pr-cascade · registration-side-rules · repo-safety-before-major-work)
- `docs/learning-systems/` × 3 (lesson-extraction-pipeline · repeated-pattern-detector · session-retrospective-template)
- `docs/pain-journal/format.md` + 6 entries from the session
- `STRUCTURE.md` (repo root)
