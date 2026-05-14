# Checklist — cross-references on add

Mirror of [`docs/standards/cross-references.md`](../standards/cross-references.md) in operator-checklist form. Use after adding ANY of: skill, rule, family, container service, template, standard, or checklist.

## Adding a skill

- [ ] `skills/<family>/<slug>/SKILL.md` (the skill)
- [ ] `skills/<family>/<slug>/README.md` (human mirror)
- [ ] `skills/<family>/README.md` (family-level catalog row)
- [ ] `SKILL-INDEX.md` (root): bump count + add row
- [ ] `README.md` (root):
  - [ ] Fast navigation row
  - [ ] AI Routing Cheat Sheet row (if action-y)
  - [ ] Family section (if first skill in family)
  - [ ] Repo Structure diagram (if structural change)
- [ ] `docs/yousirjuan-platform-skills-master.md` (if anchored)
- [ ] `docs/yousirjuan-upstream-repo-ledger.md` (if anchored)
- [ ] `docs/improvement/audits/<date>-<slug>.md` (when shipped)
- [ ] `docs/reports/<date>-*.md` (this session's report mentions it)

## Adding a rule

- [ ] `rules/library/<slug>/body.md`
- [ ] `rules/library/<slug>/meta.json`
- [ ] `rules/RULES-CATALOG.md` (catalog row)
- [ ] `docs/rules-pipeline.md` (if pipeline-relevant)

## Adding a family

- [ ] `skills/<family>/README.md` (family-level index)
- [ ] `SKILL-INDEX.md` (new family row)
- [ ] `README.md` (root): new family section + repo-structure tree
- [ ] `docs/yousirjuan-platform-skills-master.md` (if a yousirjuan domain)

## Adding a container service

- [ ] `<service>` in `docker-compose.yml` carries full label schema
- [ ] [`skills/infra/dockyard/references/integration-checklist.md`](../../skills/infra/dockyard/references/integration-checklist.md) compliance matrix row
- [ ] If new `surface` value: update [`docs/standards/container-labels.md`](../standards/container-labels.md) AND [`labels-reference.md`](../../skills/infra/dockyard/templates/labels-reference.md)

## Adding a template

- [ ] `docs/templates/<name>.template` (or `.md.template`)
- [ ] `docs/templates/README.md` (table row)

## Adding a standard / checklist / workflow

- [ ] File at correct path: `docs/standards/<name>.md`, `docs/checklists/<name>.md`, or `docs/workflows/<name>.md`
- [ ] Parent `README.md` updated with table row

## Verify with one command

```sh
bash scripts/check-cross-references.sh
```

Exit 0 = nothing missed.

## Agent

[`agents/cross-reference-rippler/`](../../agents/cross-reference-rippler/) is the planned automation. Until it's live, this checklist is the contract.
