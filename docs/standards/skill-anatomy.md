# Standard: skill anatomy

Every skill lives at `skills/<family>/<slug>/` and contains the following structure. Deviations require a written reason.

## Required

| File | Purpose |
|---|---|
| `SKILL.md` | Machine-readable playbook (Claude / Cursor / agents read this). Frontmatter REQUIRED per [`frontmatter.md`](frontmatter.md). |
| `README.md` | Human-readable mirror — quick-start, architecture, install. |

## Optional (use when applicable)

| Folder | Contents |
|---|---|
| `templates/` | Files the user copies-and-uses: `*.yml`, `*.sh`, `.template` files, code starters |
| `references/` | Static reference docs that don't change often: decision records, comparison matrices, migration guides, integration checklists |
| `data/` | Static data files (CSV, JSON) the skill reads at runtime |
| `web/` or `dashboard/` | If the skill ships a UI, it lives here |
| `bin/` | Executable shims (e.g. node shebangs) |
| `src/` | Source code if the skill ships code |
| `test/` | Tests if the skill ships code |
| `docker/` | Dockerfile + entrypoint when the skill containerizes |

## Anti-patterns

- **No nested `skills/`** — never `skills/<family>/<slug>/skills/`
- **No `docs/` inside a skill folder** — use `references/` instead
- **No `lib/` instead of `src/`** — pick one, stick with it
- **No camelCase folder names** — kebab-case only

## Examples in this repo

| Skill | Shape |
|---|---|
| [`skills/visual/diagrams/seeme/`](../../skills/visual/diagrams/seeme/) | `SKILL.md` + `README` + `src/` + `test/` + `bin/` + `docker/` (multi-surface) |
| [`skills/infra/dockyard/`](../../skills/infra/dockyard/) | `SKILL.md` + `README` + `templates/` + `references/` (integration-layer skill) |
| [`skills/infra/console/`](../../skills/infra/console/) | `SKILL.md` + `README` + `Makefile` + `server.ts` + `index.html` (operational skill) |
| [`skills/marketing/copywriting/`](../../skills/marketing/copywriting/) | `SKILL.md` only (single-file methodology skill) |

## When adding a new skill

Follow [`docs/checklists/new-skill.md`](../checklists/new-skill.md). Use [`docs/templates/SKILL.md.template`](../templates/SKILL.md.template) as the starter.
