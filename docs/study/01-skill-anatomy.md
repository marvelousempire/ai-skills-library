# 01 — Skill anatomy

Every skill lives at `skills/<family>/<slug>/` and contains:

| File | Required | Purpose |
|---|---|---|
| `SKILL.md` | ✓ | Machine-readable playbook (frontmatter REQUIRED) |
| `README.md` | ✓ | Human-readable mirror |
| `templates/` | optional | Files the user copies (`*.yml`, `*.sh`, `.template`) |
| `references/` | optional | Static decision records, comparison matrices, migration guides |
| `src/` / `test/` / `bin/` / `docker/` | optional | When the skill ships code |

## Frontmatter contract

Every `SKILL.md` opens with:

```yaml
---
name: <skill-slug>           # matches folder exactly
description: <paragraph with trigger phrases like "Triggers on …">
---
```

Full contract: [`docs/standards/frontmatter.md`](../standards/frontmatter.md).

## Real shapes in this repo

| Skill | What it ships |
|---|---|
| [`skills/visual/diagrams/seeme/`](../../skills/visual/diagrams/seeme/) | Multi-surface — CLI + MCP + Web UI + Docker. `src/`, `test/`, `bin/`, `docker/` all present. |
| [`skills/infra/dockyard/`](../../skills/infra/dockyard/) | Integration layer — only `SKILL.md` + `README.md` + `templates/` + `references/`. |
| [`skills/infra/console/`](../../skills/infra/console/) | Operational — `Makefile` + `server.ts` + `index.html`. No `src/` folder needed. |
| [`skills/marketing/copywriting/`](../../skills/marketing/copywriting/) | Methodology — just `SKILL.md`. |

## Exercise

Open [`skills/infra/dockyard/SKILL.md`](../../skills/infra/dockyard/SKILL.md) and identify:
- The frontmatter contract
- The trigger phrases
- The architecture diagram
- The Pairing section

Then check it against [`docs/standards/skill-anatomy.md`](../standards/skill-anatomy.md).

## Next

[`02-plan-first.md`](02-plan-first.md).
