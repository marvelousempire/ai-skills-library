# Skill index

**Last scanned (this Mac):** 2026-05-10  
Paths are absolute on **your machine**; see [`docs/machine-paths.md`](docs/machine-paths.md) if you clone this repo elsewhere.

## How to read this table

- **Invoke** — Short phrase to paste when you want that skill to win over others.
- **Overlap** — Other skills that might also fire; see [`docs/overlap-rules.md`](docs/overlap-rules.md).

| Skill | Tool | Install path | Use when | Invoke | Overlap |
|-------|------|--------------|----------|--------|---------|
| **ui-ux-pro-max** | Cursor | `~/.cursor/skills/.cursor/skills/ui-ux-pro-max/` | Design, build, **review**, **improve**, fix UI/UX; design systems; landing pages | “Follow **ui-ux-pro-max**; run the design-system workflow.” | copywriting, canvas |
| **verify-ship** | Claude Code | `~/.claude/skills/verify-ship/` | “Did it ship?”, merge/deploy state, versions | “Use **verify-ship**.” | shell |
| **generate-weather-plates** | Claude Code | `~/.claude/skills/generate-weather-plates/` | Red-E Play weather hero plates via gpt-image-1 | “Use **generate-weather-plates**.” | ui-ux-pro-max |
| **babysit** | Cursor | `~/.cursor/skills-cursor/babysit/` | PR merge-ready loop: comments, conflicts, CI | “Use **babysit** on this PR.” | split-to-prs |
| **canvas** | Cursor | `~/.cursor/skills-cursor/canvas/` | Analytical artifacts, data-heavy UI beside chat | “Render this in a **canvas**.” | ui-ux-pro-max |
| **create-hook** | Cursor | `~/.cursor/skills-cursor/create-hook/` | Cursor hooks, `hooks.json` | “Use **create-hook**.” | create-rule |
| **create-rule** | Cursor | `~/.cursor/skills-cursor/create-rule/` | `.cursor/rules`, AGENTS.md patterns | “Use **create-rule**.” | create-skill, migrate-to-skills |
| **create-skill** | Cursor | `~/.cursor/skills-cursor/create-skill/` | Authoring `SKILL.md` structure | “Use **create-skill**.” | create-rule |
| **create-subagent** | Cursor | `~/.cursor/skills-cursor/create-subagent/` | Custom subagent definitions | “Use **create-subagent**.” | — |
| **migrate-to-skills** | Cursor | `~/.cursor/skills-cursor/migrate-to-skills/` | Rules/commands → skills format | “Use **migrate-to-skills**.” | create-skill |
| **sdk** | Cursor | `~/.cursor/skills-cursor/sdk/` | `@cursor/sdk` programmatic agents | “Use **sdk** skill.” | shell |
| **shell** | Cursor | `~/.cursor/skills-cursor/shell/` | User invoked `/shell` — literal terminal | (slash command) | babysit, verify-ship |
| **split-to-prs** | Cursor | `~/.cursor/skills-cursor/split-to-prs/` | Split work into small PRs | “Use **split-to-prs**.” | babysit |
| **statusline** | Cursor | `~/.cursor/skills-cursor/statusline/` | CLI status line / prompt footer | “Use **statusline**.” | — |
| **update-cli-config** | Cursor | `~/.cursor/skills-cursor/update-cli-config/` | `~/.cursor/cli-config.json` | “Use **update-cli-config**.” | update-cursor-settings |
| **update-cursor-settings** | Cursor | `~/.cursor/skills-cursor/update-cursor-settings/` | VS Code / Cursor `settings.json` | “Use **update-cursor-settings**.” | update-cli-config |

## Gaps / future skills

Add rows when you install skills (e.g. copywriting, customer-research) so they are not invisible to your workflow.
