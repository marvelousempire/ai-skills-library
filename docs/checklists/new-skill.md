# Checklist — adding a new skill

Run through every item before considering the skill "shipped." Mirrors [`docs/standards/skill-anatomy.md`](../standards/skill-anatomy.md) and [`docs/standards/cross-references.md`](../standards/cross-references.md).

## Plan phase

- [ ] Plan written at `~/.claude/plans/<slug>.md` (per [`plan-naming.md`](../standards/plan-naming.md))
- [ ] Slug picked: kebab-case, no version numbers
- [ ] Family picked: `marketing`, `infra`, `visual`, `ide`, `external`, `project`, `mobile`, `engineering`, `methodology`

## Scaffold

- [ ] Folder: `skills/<family>/<slug>/`
- [ ] `SKILL.md` from template ([`docs/templates/SKILL.md.template`](../templates/SKILL.md.template))
- [ ] `README.md` human-readable
- [ ] Optional folders only when needed: `templates/`, `references/`, `src/`, `test/`, `bin/`, `docker/`, `web/`, `dashboard/`

## Content

- [ ] Frontmatter present and valid (per [`frontmatter.md`](../standards/frontmatter.md))
  - [ ] `name:` matches folder slug exactly
  - [ ] `description:` includes 3+ trigger phrases
- [ ] SKILL.md has: When to use · Invocation · Pairing · Verification
- [ ] README.md has: Quick start · Architecture · What lives where

## Containers (if any)

- [ ] Every service in `docker-compose.yml` carries full label schema ([`container-labels.md`](container-labels.md))
- [ ] [`skills/infra/dockyard/references/integration-checklist.md`](../../skills/infra/dockyard/references/integration-checklist.md) updated with per-service row

## Cross-references

- [ ] `SKILL-INDEX.md` count bumped + new row added
- [ ] `README.md` (root): Fast navigation row + AI Routing Cheat Sheet row + family section if applicable
- [ ] `skills/<family>/README.md` updated *(if family-level catalog exists)*
- [ ] `docs/yousirjuan-platform-skills-master.md` *(if anchored to a category)*
- [ ] `docs/yousirjuan-upstream-repo-ledger.md` *(if anchored)*

## Verification gates ([`verification-gates.md`](../standards/verification-gates.md))

- [ ] `bash scripts/check-skill-count.sh` → `✓ all three agree`
- [ ] `bash scripts/lint-skill-frontmatter.sh` → silent (exit 0)
- [ ] `bash scripts/check-cross-references.sh` → exit 0
- [ ] All scripts in `templates/*.sh` pass `bash -n`
- [ ] All compose files in `templates/*.yml` parse: `docker compose -f <path> config`

## After-ship

- [ ] Run the gap audit + elevation pass ([`after-ship-audit.md`](after-ship-audit.md))
- [ ] Archive the audit at `docs/improvement/audits/<date>-<slug>.md`
- [ ] Add a row to this session's report at `docs/reports/<date>-*.md`

## Decision records (if applicable)

- [ ] Picked tool A over B? Write `references/<X-vs-Y>.md` decision record
- [ ] Add entry to [`docs/improvement/decision-records/INDEX.md`](../improvement/decision-records/INDEX.md)

## Migration guides (if applicable)

- [ ] Replacing an old tool with a new one? Write `references/switching-from-<old>.md`
- [ ] Add entry to migration-guides index (TODO: create `docs/migration-guides-index.md`)

## Commit message

```
feat(<family>/<slug>): <one-line summary>

<paragraph: what it does, why now, who it pairs with>

<paragraph: files added, key surfaces>

Verification:
  ✓ skill count: <N>/<N>/<N>
  ✓ frontmatter lint passes
  ✓ cross-references rippled

Co-Authored-By: <agent name>
```
