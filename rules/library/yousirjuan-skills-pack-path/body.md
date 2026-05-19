---
name: yousirjuan-skills-pack-path
id: RL-0050
keywords: [yousirjuan-skills, skills-pack, agent-managed, project-yousirjuan-retired]
goal: Every agent cites and edits You-Sir Juan platform skills only under skills/yousirjuan/.
hash: pending
relations: [cross-reference-on-skill-add, associate-agent-terminology]
before: []
governed_by: [global]
meta: dynamic
---

# You-Sir Juan skills pack path (mandatory)

## Canonical layout

| Correct | Wrong (retired) |
|---|---|
| `skills/yousirjuan/<skill-id>/SKILL.md` | `skills/project/yousirjuan/<skill-id>/SKILL.md` |
| Frontmatter `domain: yousirjuan` | `domain: project/yousirjuan` |
| Pack key `yousirjuan` in plugin manifests | `project/yousirjuan` |

In the **yousirjuan** monorepo submodule mount, the same paths are prefixed with `vendor/ai-skills-library/` — still **no** `project/` segment.

## Who must follow this

**Every** agent that touches You-Sir Juan platform skills, including and not limited to:

- **Nephew** (orchestrator, global Cursor rule)
- **Bishop** (agent factory / Philosophy gate)
- **Automata** (Make-Sense / IQC routing)
- **Scene Skout** (suit scouting — when citing platform install or skill paths)
- **ai-skills-library** agents: count-keeper, cross-reference-rippler, skill-scaffolder, ship-auditor
- **Cursor / Claude Code** sessions on `yousirjuan` or `ai-skills-library`

## Agent-managed edits

- **Source of truth:** `marvelousempire/ai-skills-library` on `main`.
- **Do not** duplicate skill bodies into app repos.
- **Do** run `./scripts/install-repo-skills-to-cursor-project.sh` after adding or moving skills in the pack.
- **Do** ripple index updates per `cross-reference-on-skill-add` (SKILL-INDEX, `skills/README.md`, `docs/yousirjuan-platform-skills-master.md`, plugin catalogs).

## Install script

`scripts/install-repo-skills-to-cursor-project.sh` must include `skills/yousirjuan` in the pack loop so Cursor loads all six platform skills.

## Violation examples

- Documentation linking to `skills/project/yousirjuan/bash-installer-oneliners/`
- Scaffolding a new skill under `skills/project/yousirjuan/`
- Telling the user to edit `SKILL.md` only inside `yousirjuan/` without updating the library

## Related

- Pack README: [`skills/yousirjuan/README.md`](../../../skills/yousirjuan/README.md)
- Platform routing: [`docs/yousirjuan-platform-skills-master.md`](../../../docs/yousirjuan-platform-skills-master.md)
