---
name: schema-fk-typecheck
id: SK-0008
keywords: [check-schema, validate-fk, verify-types]
goal: Deliver schema fk typecheck output correctly and completely.
hash: 115ec03
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  Before writing a CREATE TABLE column with a REFERENCES clause, look up the parent table's column type so the FK declaration matches. Catches BIGINT vs UUID, SERIAL vs BIGSERIAL, INTEGER vs TEXT mismatches at write time — not at production deploy.
trigger: >-
  Use when writing any new `CREATE TABLE` statement that includes a `REFERENCES other_table(col)` clause. Also fires when adding a new FK column via `ALTER TABLE ... ADD COLUMN ... REFERENCES`.
---

# /schema-fk-typecheck

## What this skill does

For each `child_col <TYPE> REFERENCES parent_table(id)` in a draft migration:

1. Greps for `CREATE TABLE.*parent_table` across `backend/src/db/schema.sql` + `backend/src/db/migrations/*.sql`
2. Extracts the parent table's `id` column declaration
3. Reports the parent's actual type
4. If the child's declared type doesn't match, suggests the correct one

## How to invoke

```
/schema-fk-typecheck backend/src/db/migrations/0165_new.sql
```

Or, more naturally, inline when reviewing a migration draft:

> "Before I commit this, check the FK types."

## Common parent-id types in the wild (red-e-play)

| Parent | id type | Child should be |
|---|---|---|
| `players` | UUID | UUID |
| `payout_accounts` | UUID | UUID |
| `game_sessions` | UUID | UUID |
| `features` | TEXT | TEXT |
| `plans` | TEXT | TEXT |
| `trainer_profiles` | BIGSERIAL | BIGINT |
| `creator_applications` | BIGSERIAL | BIGINT |
| `wallet_accounts` | BIGSERIAL | BIGINT |

## What CI does NOT catch

`npm run lint`, `eslint`, `tsc`, the `Check backend` workflow — none of these run psql against a real DB. The FK type mismatch only surfaces at deploy time when `psql -v ON_ERROR_STOP=1` returns the error.

## Origin

Trainer-marketplace session, PR #822: declared `trainer_profiles.payout_account_id BIGINT REFERENCES payout_accounts(id)`. `payout_accounts.id` is UUID per migration 0029. Deploy failed atomically. Forward-fix PR #824 was one line. See [`rules/library/fk-target-type-check`](../../../rules/library/fk-target-type-check/body.md).
