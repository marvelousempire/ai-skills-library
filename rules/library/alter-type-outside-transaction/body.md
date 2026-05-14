---
name: alter-type-outside-transaction
id: RL-0002
keywords: [enforce-alter, check-type, build-outside]
hash: 2308a41
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# ALTER TYPE goes outside BEGIN/COMMIT

PostgreSQL has historically restricted `ALTER TYPE ... ADD VALUE` inside transaction blocks. Pre-12 rejects it outright; pg12+ allows it but prohibits using the new value in the same transaction. The safe pattern is to put `ALTER TYPE` statements at the top of the migration file, **outside** the `BEGIN; ... COMMIT;` wrapper.

```sql
-- Enum extensions (OUTSIDE the BEGIN/COMMIT block)
ALTER TYPE my_enum ADD VALUE IF NOT EXISTS 'new_value_1';
ALTER TYPE my_enum ADD VALUE IF NOT EXISTS 'new_value_2';

BEGIN;
-- Tables + functions + everything else
CREATE TABLE ...
INSERT INTO ...
COMMIT;
```

## Why this matters even on pg12+

If the migration fails partway through, `BEGIN/COMMIT` rolls back atomically — but only for statements inside the block. The `ALTER TYPE` statements that ran successfully before the block stay applied. That's actually the desirable behavior (enum values are forward-only anyway), and it matches how `0056_credit_ledger_kinds.sql` ships in red-e-play.

## Origin

Trainer-marketplace session: migration 0165 needed `ALTER TYPE credit_ledger_kind ADD VALUE` for 3 new kinds. Moved them above the `BEGIN;` per this pattern. When the migration later failed mid-block (FK type mismatch), the 3 ALTER TYPE statements persisted on prod while everything else rolled back — making the forward-only fix in PR #824 trivial.
