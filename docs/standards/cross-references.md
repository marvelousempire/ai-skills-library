# Standard: cross-references (what to update when adding what)

When you add a new artifact to this repo, multiple other files must be updated in lockstep. This table is the **single source of truth** for what ripples.

## Adding a new skill

| Touch | Reason |
|---|---|
| `skills/<family>/<slug>/SKILL.md` | the skill itself |
| `skills/<family>/<slug>/README.md` | human-readable mirror |
| `skills/<family>/README.md` *(if family-level catalog exists)* | family index |
| `SKILL-INDEX.md` (root) | quick-reference table + skill count |
| `README.md` (root) | "Fast navigation" + "AI Routing Cheat Sheet" + family section if applicable |
| `docs/yousirjuan-platform-skills-master.md` *(if anchored to a category)* | platform status row |
| `docs/yousirjuan-upstream-repo-ledger.md` *(if anchored)* | upstream ledger |
| `docs/improvement/audits/<date>-<slug>.md` *(when shipped)* | initial gap audit (optional but good practice) |
| `docs/reports/<date>-*.md` *(this session's report)* | mentions the new skill |

## Adding a new rule

| Touch | Reason |
|---|---|
| `rules/library/<slug>/body.md` | the rule itself |
| `rules/library/<slug>/meta.json` | machine-readable rule metadata |
| `rules/RULES-CATALOG.md` | rule index |
| `docs/rules-pipeline.md` *(if pipeline-relevant)* | regeneration behavior |

## Adding a new family

| Touch | Reason |
|---|---|
| `skills/<family>/README.md` | family-level index |
| `SKILL-INDEX.md` (root) | new row in the family table |
| `README.md` (root) | new family section |
| `docs/yousirjuan-platform-skills-master.md` *(if a yousirjuan domain)* | platform row |

## Adding a new template / standard / checklist

| Touch | Reason |
|---|---|
| `docs/templates/<name>.template` *or* `docs/standards/<name>.md` *or* `docs/checklists/<name>.md` | the artifact |
| Parent `README.md` in same folder | index update |

## Adding a new container service

| Touch | Reason |
|---|---|
| The container's `docker-compose.yml` | full label schema per [`container-labels.md`](container-labels.md) |
| [`skills/infra/dockyard/references/integration-checklist.md`](../../skills/infra/dockyard/references/integration-checklist.md) | per-stack compliance row |

## Enforcement

- **Rule** `rules/library/cross-reference-on-skill-add/` codifies this for skill-add as `alwaysApply: true`.
- **Checklist** `docs/checklists/cross-reference.md` is the operator-facing one-page version.
- **Agent** `agents/cross-reference-rippler/` is the eventual automation.
- **Script** `scripts/check-cross-references.sh` validates that count + family-README references stay consistent.

## How to verify nothing was missed

```sh
# After adding a skill, run from repo root:
bash scripts/check-skill-count.sh
bash scripts/check-cross-references.sh
```

Both must exit 0 before the commit is allowed.
