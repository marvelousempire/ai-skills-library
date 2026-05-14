# Workflow — rip and replace a tool

When swapping one tool for another (e.g. Docker Desktop → Colima, Forgejo → GitLab CE). Codifies the migration discipline from this session's Dockyard work.

## 1. Decision record first

Before swapping, write the decision:

```sh
cp docs/templates/decision-record.md.template skills/<family>/<slug>/references/<X>-vs-<Y>.md
```

Sections:
- Options A and B with pros/cons
- Decision + why
- Trigger for revisiting
- Cost of being wrong (how hard is the rollback?)

Add to [`docs/improvement/decision-records/INDEX.md`](../improvement/decision-records/INDEX.md).

## 2. Migration guide second

```sh
cp docs/templates/migration-guide.md.template skills/<family>/<slug>/references/switching-from-<X>.md
```

Sections:
- What you preserve vs what migrates
- Pre-flight
- Backup
- Install new
- Switch
- Verify
- Reclaim space
- Rolling back

## 3. Tag a recovery point

```sh
git -C ~/Developer/ai-skills-library tag -a "pre-replace-<old>-with-<new>-$(date +%Y-%m-%d)" origin/main -m "Recovery before swapping <old> for <new>"
git -C ~/Developer/ai-skills-library push origin "pre-replace-<old>-with-<new>-$(date +%Y-%m-%d)"
```

## 4. Update affected stacks

- Compose files (if labels changed)
- Doctor scripts (if engine detection logic differs)
- Documentation (root README, family READMEs)
- yousirjuan platform doc (status: `Active` → `Legacy` for the old; `Planned` → `Active` for the new)

## 5. Update the integration checklist

If the swap affects multiple stacks, update [`skills/infra/dockyard/references/integration-checklist.md`](../../skills/infra/dockyard/references/integration-checklist.md) (or the relevant matrix).

## 6. Verify

```sh
bash scripts/check-skill-count.sh
bash scripts/lint-skill-frontmatter.sh
bash scripts/check-cross-references.sh
# Plus: docker compose -f <each affected> config | grep -c labels
```

## 7. Ship per [`ship.md`](../checklists/ship.md)

## 8. After-ship: gap audit + elevation pass

Per [`audit-and-elevate.md`](audit-and-elevate.md).

## Example from this session

**Docker Desktop → Colima**:
- Decision record: [`skills/infra/dockyard/references/engines-compared.md`](../../skills/infra/dockyard/references/engines-compared.md) (functioned as the decision doc)
- Migration guide: [`skills/infra/dockyard/references/switching-from-docker-desktop.md`](../../skills/infra/dockyard/references/switching-from-docker-desktop.md)
- yousirjuan update: Category 10 row for Docker Desktop set to `Legacy`, Colima to `Active`
