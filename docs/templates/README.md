# Templates

Copy-and-fill starters. Each template is a working baseline you can use as-is; replace placeholders (`<…>` or `TODO`) with your content.

| Template | What it bootstraps |
|---|---|
| [`SKILL.md.template`](SKILL.md.template) | Frontmatter + the canonical skill outline |
| [`rule-body.md.template`](rule-body.md.template) | `body.md` for a new rule |
| [`rule-meta.json.template`](rule-meta.json.template) | `meta.json` for a new rule |
| [`decision-record.md.template`](decision-record.md.template) | "Why we picked X over Y" |
| [`migration-guide.md.template`](migration-guide.md.template) | "Switching from X to Y" |
| [`integration-checklist.md.template`](integration-checklist.md.template) | Per-stack / per-X compliance matrix |
| [`PLAN.md.template`](PLAN.md.template) | Plan-first scaffolding (mirror of `~/.claude/plans/` shape) |
| [`gap-audit.md.template`](gap-audit.md.template) | After-ship audit |
| [`session-report.md.template`](session-report.md.template) | One session-of-work writeup |
| [`Makefile.template`](Makefile.template) | The `make ui` one-command pattern |
| [`server.ts.template`](server.ts.template) | Node stdlib HTTP aggregator server |
| [`single-page-ui.html.template`](single-page-ui.html.template) | Dark-mode monospace single-page UI |
| [`docker-compose.with-labels.yml.template`](docker-compose.with-labels.yml.template) | Compose stack with full label schema |
| [`doctor.sh.template`](doctor.sh.template) | Health-check script with color-coded output |
| [`install.sh.template`](install.sh.template) | Idempotent installer with pre-flight checks |

## How to use

```sh
cp docs/templates/SKILL.md.template skills/<family>/<slug>/SKILL.md
# Then replace every `<…>` and TODO with real content.
```

## Conventions

- Every template is a **valid file** as-is (parses, runs, lints) — placeholders only in obvious values
- Every template links to its standard and checklist
- Templates are tracked artifacts — improvements ship as commits

## Anti-patterns

- Editing a template inline in a project — copy first, then edit
- Hard-coding project-specific values in templates — keep them generic
- Templates without examples or comments — every template explains itself
