# Skill index

Quick reference: **what it is**, **where it lives in this repo**, **when to use it**, **overlap**.

**Browse all files on GitHub:** [`skills/README.md`](skills/README.md) → per-pack catalogs.

## Coverage

- **57** vendored `SKILL.md` files under [`skills/`](skills/).
- Run [`scripts/rescan-skills.sh`](scripts/rescan-skills.sh) on a machine to compare live `~/` installs vs this repo.

| Skill / pack | Tool | In this repo | Use when | Invoke | Overlap |
|--------------|------|--------------|----------|--------|---------|
| **Marketing** (41) | Cursor + Claude | [`skills/marketing/`](skills/marketing/) · [catalog](skills/marketing/SKILL-CATALOG.md) | CRO, SEO, copy, ads, ASO, email, research, launch… | **`product-marketing-context`** first → name skill (e.g. **page-cro**) | ui-ux-pro-max, canvas |
| **ui-ux-pro-max** | Cursor | [`skills/ui-ux-pro-max/`](skills/ui-ux-pro-max/) | Design, review, improve UI/UX; design systems | “Follow **ui-ux-pro-max** workflow.” | copywriting, page-cro |
| **verify-ship** | Claude Code | [`skills/claude-local/verify-ship/`](skills/claude-local/verify-ship/) | Ship state: merged? deployed? | “Use **verify-ship**.” | shell |
| **generate-weather-plates** | Claude Code | [`skills/claude-local/generate-weather-plates/`](skills/claude-local/generate-weather-plates/) | Red-E Play weather hero plates | “Use **generate-weather-plates**.” | ui-ux-pro-max |
| **babysit** | Cursor | [`skills/cursor/babysit/`](skills/cursor/babysit/) | PR merge-ready loop | “Use **babysit**.” | split-to-prs |
| **canvas** | Cursor | [`skills/cursor/canvas/`](skills/cursor/canvas/) | Data-heavy / analytical UI beside chat | “Use **canvas**.” | ui-ux-pro-max |
| **create-hook** | Cursor | [`skills/cursor/create-hook/`](skills/cursor/create-hook/) | Cursor hooks | “Use **create-hook**.” | create-rule |
| **create-rule** | Cursor | [`skills/cursor/create-rule/`](skills/cursor/create-rule/) | `.cursor/rules` | “Use **create-rule**.” | create-skill |
| **create-skill** | Cursor | [`skills/cursor/create-skill/`](skills/cursor/create-skill/) | Author `SKILL.md` | “Use **create-skill**.” | create-rule |
| **create-subagent** | Cursor | [`skills/cursor/create-subagent/`](skills/cursor/create-subagent/) | Subagents | “Use **create-subagent**.” | — |
| **migrate-to-skills** | Cursor | [`skills/cursor/migrate-to-skills/`](skills/cursor/migrate-to-skills/) | Rules → skills | “Use **migrate-to-skills**.” | create-skill |
| **sdk** | Cursor | [`skills/cursor/sdk/`](skills/cursor/sdk/) | `@cursor/sdk` | “Use **sdk**.” | shell |
| **shell** | Cursor | [`skills/cursor/shell/`](skills/cursor/shell/) | `/slash` shell | (slash) | babysit |
| **split-to-prs** | Cursor | [`skills/cursor/split-to-prs/`](skills/cursor/split-to-prs/) | Split PRs | “Use **split-to-prs**.” | babysit |
| **statusline** | Cursor | [`skills/cursor/statusline/`](skills/cursor/statusline/) | CLI statusline | “Use **statusline**.” | — |
| **update-cli-config** | Cursor | [`skills/cursor/update-cli-config/`](skills/cursor/update-cli-config/) | `cli-config.json` | “Use **update-cli-config**.” | update-cursor-settings |
| **update-cursor-settings** | Cursor | [`skills/cursor/update-cursor-settings/`](skills/cursor/update-cursor-settings/) | `settings.json` | “Use **update-cursor-settings**.” | update-cli-config |

## Product context (not a skill folder)

| Doc | In repo | Purpose |
|-----|---------|---------|
| READYPLAY marketing context | [`context/readyplay-product-marketing-context.md`](context/readyplay-product-marketing-context.md) | Positioning for all marketing skills — **edit canonical** in `red-e-play-app/.agents/` then re-vendor |

## Adding something new

[`docs/add-skill.md`](docs/add-skill.md) → then `./scripts/vendor-skills-from-home.sh` → commit.
