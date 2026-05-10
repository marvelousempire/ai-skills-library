# Machine paths (reference)

Document **per machine** or **per OS user** so clones of this repo stay honest.

## This Mac (template — edit if yours differ)

| Root | Purpose |
|------|---------|
| `~/.cursor/skills/` | UI Pro installer target; nested `.cursor/skills/<name>/` |
| `~/.cursor/skills-cursor/` | Cursor-packaged skills (babysit, canvas, …) |
| `~/.claude/skills/` | Claude Code skills |

**Username / hostname:** _fill in when you maintain this file_

## Other machines

Duplicate this section as `machine-paths-laptop.md` or add a **Machine** column in `SKILL-INDEX.md` if paths diverge.

## Cursor / Claude UI vs disk

The **agent** may list skills that are **bundled or configured** separately from the folders above. This library tracks **files on disk** under the scanned roots. If the product shows a skill that is not in `SKILL-INDEX.md`, run the find in [`add-skill.md`](add-skill.md) and add a row.

| `~/.agents/skills/` | **Agent Skills** standard directory (`npx skills` installs here) |
| `https://github.com/coreyhaines31/marketingskills` | Upstream marketing bundle source |

## Repo mirror (this library)

| On disk (`~/`) | Vendored under |
|----------------|----------------|
| `~/.agents/skills/` | `skills/marketing/` |
| `~/.cursor/skills-cursor/` | `skills/ide/cursor/` |
| `~/.claude/skills/{verify-ship,generate-weather-plates}/` | `skills/project/red-e-play/` |
| UI Pro Max install | `skills/visual/design/ui-ux-pro-max/` |
