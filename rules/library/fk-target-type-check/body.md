---
name: fk-target-type-check
id: RL-0014
keywords: [enforce-target, check-type, build-check]
goal: Deliver fk target type check output correctly and completely.
hash: d8550fd
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# FK target type check — never guess the parent column's type

When you write `child_col <TYPE> REFERENCES parent_table(id)` in a migration, the `<TYPE>` MUST exactly match `parent_table.id`'s declared type. PostgreSQL refuses the constraint with:

```
ERROR: foreign key constraint cannot be implemented
DETAIL: Key columns "child_col" and "id" are of incompatible types: <yours> and <theirs>.
```

This error fires at **migration apply time** — meaning at production deploy. Neither `npm run lint`, nor `eslint`, nor `tsc`, nor the CI build catch it. The only defense is checking the parent type at write time.

---

## The check (run it right before writing the FK column)

```bash
grep -B 1 -A 4 "CREATE TABLE.*<parent_table>" backend/src/db/schema.sql backend/src/db/migrations/*.sql | grep -E "id\s+(UUID|BIGINT|BIGSERIAL|SERIAL|INT|TEXT)"
```

Or open `schema.sql`, find the parent table, eyeball the `id` column.

Common parent-id types in the wild:
- `UUID PRIMARY KEY DEFAULT gen_random_uuid()` — uses UUID FK columns
- `BIGSERIAL PRIMARY KEY` — uses BIGINT FK columns
- `SERIAL PRIMARY KEY` — uses INTEGER FK columns
- `TEXT PRIMARY KEY` — uses TEXT FK columns

---

## Origin

Trainer-marketplace session (2026-05-14): wrote `trainer_profiles.payout_account_id BIGINT REFERENCES payout_accounts(id)`. `payout_accounts.id` is UUID per migration 0029. Deploy failed atomically (BEGIN/COMMIT rolled back); forward-fix PR #824 fixed it one line. Cost: one failed deploy + one extra PR. See [`docs/pain-journal/2026-05-14-fk-bigint-vs-uuid.md`](../../../docs/pain-journal/2026-05-14-fk-bigint-vs-uuid.md).

---

## Related skills

- [`schema-fk-typecheck`](../../../skills/engineering/schema-fk-typecheck/SKILL.md) — automates the grep + suggests the correct type
- [`migration-shipping`](../../../skills/engineering/migration-shipping/SKILL.md) — full migration safety checklist that includes this check
