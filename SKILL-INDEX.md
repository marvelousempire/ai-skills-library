# Skill index

Quick reference: **what it is**, **where it lives in this repo**, **when to use it**, **overlap**.

**Browse all files on GitHub:** [`skills/README.md`](skills/README.md) → per-pack catalogs.

## Coverage

- **79** total `SKILL.md` files under [`skills/`](skills/).
- Run [`scripts/rescan-skills.sh`](scripts/rescan-skills.sh) on a machine to compare live `~/` installs vs this repo.

| Skill / pack | Tool | In this repo | Use when | Invoke | Overlap |
|--------------|------|--------------|----------|--------|---------|
| **Marketing** (42) | Cursor + Claude | [`skills/marketing/`](skills/marketing/) · [catalog](skills/marketing/SKILL-CATALOG.md) | CRO, SEO, copy, ads, ASO, email, research, launch… | **`product-marketing-context`** first → name skill (e.g. **page-cro**) | ui-ux-pro-max, canvas |
| **copy-language-audit** | Cursor + Claude | [`skills/marketing/copy-language-audit/`](skills/marketing/copy-language-audit/) | Audit copy for binding/contractual language (integrations, partners) → replace with compatibility/accommodate vocabulary | "Use **copy-language-audit**." | copy-editing, copywriting |
| **session-retrospective** | Claude Code | [`skills/engineering/session-retrospective/`](skills/engineering/session-retrospective/) | Extract rules, skills, docs, and context files from a completed work session and file them into the library | "Use **session-retrospective**." | create-rule, create-skill |
| **ui-ux-pro-max** | Cursor | [`skills/visual/design/ui-ux-pro-max/`](skills/visual/design/ui-ux-pro-max/) | Design, review, improve UI/UX; design systems | “Follow **ui-ux-pro-max** workflow.” | copywriting, page-cro |
| **ascii-flow-diagrams** | Claude Code + Cursor | [`skills/visual/diagrams/ascii-flow-diagrams/`](skills/visual/diagrams/ascii-flow-diagrams/) | User asks for a visual / flow / architecture / "how does X talk to Y" | Auto (`alwaysApply` rule); or “Use **ascii-flow-diagrams**.” | `docs/system-flow.md` |
| **seeme** | Node CLI | [`skills/visual/diagrams/seeme/`](skills/visual/diagrams/seeme/) | Generate diagrams from any text / file / idea — Ollama default, multi-provider | `seeme "..."` or “Use **seeme** on this.” | ascii-flow-diagrams |
| **self-hosted-git** | Docker Compose | [`skills/infra/self-hosted-git/`](skills/infra/self-hosted-git/) | Stand up private GitLab CE on a Mac mini (or any Docker host); CI runners, container registry, auto-HTTPS, Tailscale/WireGuard tunnel, backups | "Use **self-hosted-git**." or `docker compose -f templates/gitlab-compose.yml up -d` | yousirjuan Category 11 |
| **console** | Node + Make | [`skills/infra/console/`](skills/infra/console/) | Homelab unified UI + Makefile — boots / monitors / stops SEEME + GitLab + CI + Ollama + Dockyard as one stack. Status grid, engine badge, recent pipelines, quick-launch, `make doctor` | "Use **console**." or `make start` from `skills/infra/console/` | self-hosted-git, seeme, dockyard |
| **dockyard** | Docker labels + templates | [`skills/infra/dockyard/`](skills/infra/dockyard/) | Wire ai-skills-library stacks into [Dockyard](https://github.com/marvelousempire/claude-chat-reader/tree/main/dockyard) — label schema, install script, standalone compose, engine comparison (Colima/OrbStack/Docker Desktop), Docker-Desktop-to-Colima migration | "Use **dockyard**." or `bash skills/infra/dockyard/templates/install.sh` | self-hosted-git, seeme, console |
| **verify-ship** | Claude Code | [`skills/project/red-e-play/verify-ship/`](skills/project/red-e-play/verify-ship/) | Ship state: merged? deployed? | “Use **verify-ship**.” | shell |
| **generate-weather-plates** | Claude Code | [`skills/project/red-e-play/generate-weather-plates/`](skills/project/red-e-play/generate-weather-plates/) | Red-E Play weather hero plates | “Use **generate-weather-plates**.” | ui-ux-pro-max |
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
| **External tools** (generated bridges, 11) | Cursor + Claude | [`skills/external/`](skills/external/) · [catalog](skills/external/SKILL-CATALOG.md) · [index](docs/related-github-projects.md) | Third-party GitHub tools (scraping, voice, MCP, local Claude Code…) | Name the skill id (e.g. **kokoro-fastapi**, **blender-mcp**) or open the index table | varies by tool |

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
| **parallel-agent-coordination** | project/yousirjuan | Claude Code | Multi-surface build: iOS + web + backend simultaneously | "Use **parallel-agent-coordination** pattern." |
| **associate-agent-system** | project/yousirjuan | Claude Code | Referencing or extending the 4-persona paradigm architecture | "See **associate-agent-system** skill." |
| **bash-installer-oneliners** | project/yousirjuan | Claude Code | Writing a new one-liner installer for a hardware platform | "Use **bash-installer-oneliners** pattern." |
| **hardware-compat-doc** | project/yousirjuan | Claude Code | Documenting a new machine for You-Sir Juan OS | "Use **hardware-compat-doc** skill." |
| **marketing-feature-doc** | project/yousirjuan | Claude Code | Writing docs/marketing/NN-feature.md for a shipped feature | "Use **marketing-feature-doc** skill." |
| **ios-realitykit-4-patterns** | project/yousirjuan | Claude Code | Building RealityKit 4 components for the iOS kiosk | "Use **ios-realitykit-4-patterns** skill." |

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
