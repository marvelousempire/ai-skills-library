# FK type mismatch: BIGINT vs UUID

**First seen:** 2026-05-14 (red-e-play PR #822 deploy failure)
**Session:** trainer-marketplace
**Category:** schema / deploy

## Symptom

PR #822 (trainer-marketplace Phase 1 schema) merged, CI green, deploy triggered. Deploy failed at:

```
psql:src/db/migrations/0165_trainer_marketplace_schema.sql:221: ERROR: foreign key constraint "trainer_profiles_payout_account_id_fkey" cannot be implemented
DETAIL:  Key columns "payout_account_id" and "id" are of incompatible types: bigint and uuid.
##[error]Process completed with exit code 3.
```

## Diagnose

```bash
# Look up the parent table's id type
grep -A 4 "CREATE TABLE.*payout_accounts" backend/src/db/migrations/0029_nft_marketplace_full_schema.sql
# Returns: `id  UUID PRIMARY KEY DEFAULT gen_random_uuid()`
```

I had declared:
```sql
payout_account_id BIGINT REFERENCES payout_accounts(id) ...
```

Parent is UUID, child was BIGINT. Postgres refuses.

## Fix

Forward-only edit of migration 0165 in place:

```sql
- payout_account_id BIGINT REFERENCES payout_accounts(id) ON DELETE SET NULL,
+ payout_account_id UUID   REFERENCES payout_accounts(id) ON DELETE SET NULL,
```

Shipped as PR #824. One-line fix. CI green → merged → redeployed → smoke ✓.

## Root cause

I assumed parent type without checking. PostgreSQL doesn't catch this at lint time, CI doesn't run it against a real DB. The error only surfaces at production deploy.

State after failure: BEGIN/COMMIT atomic rollback wiped everything in 0165 except the 3 `ALTER TYPE` statements that ran outside the block. Forward-only fix was clean — zero data loss.

## Prevention

- Rule: [`fk-target-type-check`](../../rules/library/fk-target-type-check/body.md) — always grep parent's column type before declaring FK child
- Skill: [`schema-fk-typecheck`](../../skills/engineering/schema-fk-typecheck/SKILL.md) — automates the lookup
- Rule: [`alter-type-outside-transaction`](../../rules/library/alter-type-outside-transaction/body.md) — kept the ALTER TYPE statements safe across the rollback
- Rule: [`forward-only-migration-fix`](../../rules/library/forward-only-migration-fix/body.md) — clean recovery pattern

## Related

- Master Report: Section 3.2.1
- Playbook: [`docs/playbooks/migration-rolled-back.md`](../playbooks/migration-rolled-back.md)
