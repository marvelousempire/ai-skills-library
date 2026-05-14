---
name: migration-shipping
id: SK-0028
keywords: [migration, shipping]
description: >-
  Full safety checklist for shipping a new migration file. Bundles fk-target-type-check, alter-type-outside-transaction, is-public-flip-on-plan-insert, migration-race-guard, feature-id-race-guard, smoke-test-after-deploy. The one-stop migration-shipping safety net.
trigger: >-
  Use when writing any new `backend/src/db/migrations/*.sql` file, especially seed migrations or schema migrations. Also fires before opening a PR that includes new migration files.
---

# /migration-shipping

## What this skill does

Walks the migration through the full safety checklist:

### Pre-write (right before `Write` tool call)

1. **Re-run** `bash scripts/either-host/next-migration-number.sh` — confirm the filename prefix is current
2. **Re-run** `bash scripts/either-host/next-feature-id.sh` if the migration seeds features
3. **High-water-mark margin**: for multi-feature batches, start ≥5 above the script's return

### Write-time

4. **FK types**: every `REFERENCES other_table(col)` declaration → verify parent's column type ([schema-fk-typecheck](../schema-fk-typecheck/SKILL.md))
5. **ALTER TYPE**: every `ALTER TYPE ... ADD VALUE` → outside BEGIN/COMMIT ([alter-type-outside-transaction](../../../rules/library/alter-type-outside-transaction/body.md))
6. **`is_public=TRUE`** on plan inserts ([is-public-flip-on-plan-insert](../../../rules/library/is-public-flip-on-plan-insert/body.md))
7. **Idempotency**: `IF NOT EXISTS` on tables/indexes; `ON CONFLICT DO NOTHING|UPDATE` on inserts
8. **Section CHECK constraint**: confirm any new `features.section` value is in the allowed list
9. **Header comment**: file ID + slug + status + what the migration creates + what's intentionally NOT here + idempotency note

### Pre-commit

10. **Paren balance**: `python3 -c "s=open('FILE').read(); print(s.count('('), s.count(')'))"` — they must match
11. **Row counts**: grep INSERT block, count features/surfaces/plan_features rows, confirm against table-in-doc

### Post-deploy

12. **Smoke test** every endpoint touched ([smoke-test-after-deploy](../../../rules/library/smoke-test-after-deploy/body.md))

## Skill that emits the migration template

[`templates/schema-migration.sql`](../../../templates/schema-migration.sql) is the canonical scaffold.

## Origin

Trainer-marketplace session: codifies every safety check that caught (or should have caught) the FK type mismatch, the is_public gap, the feature-ID race, the migration-filename race, and the smoke gap.
