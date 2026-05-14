# Playbook — Migration rolled back (atomic failure)

When a migration wrapped in `BEGIN; ... COMMIT;` fails at production deploy.

## Symptom

```
ERROR: foreign key constraint cannot be implemented
DETAIL: Key columns "X" and "id" are of incompatible types: bigint and uuid.
##[error]Process completed with exit code 3.
```

Or any other psql `ERROR:` followed by deploy workflow exit code 3.

## State after failure

- PostgreSQL atomic rollback wipes everything inside BEGIN/COMMIT
- Statements OUTSIDE BEGIN/COMMIT persist (typically only `ALTER TYPE ADD VALUE`)
- The migration file is still on prod (in `backend/src/db/migrations/`)
- The next deploy will re-run it

## The fix (forward-only)

1. Investigate via `gh run view <run-id> --log-failed | tail -50`
2. Identify the failing statement
3. Edit the migration file in place — fix the bug
4. Commit with `fix(db):` prefix
5. Push + open a fix PR
6. Merge when CI green
7. Trigger redeploy
8. Smoke test

## What NOT to do

- Write a "0XXX_fix_previous.sql" that tries to ADD a column / patch state. There IS no partial state.
- `git revert` the original commit
- Hand-edit production via psql

## Concrete example (trainer-marketplace, 2026-05-14)

Migration 0165 had `payout_account_id BIGINT REFERENCES payout_accounts(id)`. Failed with the BIGINT-vs-UUID error. Forward-fix PR #824 was one line: BIGINT to UUID. Redeployed, smoke green. Zero data loss.

## Related

- Rule: [`forward-only-migration-fix`](../../rules/library/forward-only-migration-fix/body.md)
- Rule: [`alter-type-outside-transaction`](../../rules/library/alter-type-outside-transaction/body.md)
- Rule: [`fk-target-type-check`](../../rules/library/fk-target-type-check/body.md)
- Pain Journal: `docs/pain-journal/2026-05-14-fk-bigint-vs-uuid.md`
