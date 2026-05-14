---
name: forward-only-migration-fix
id: RL-0015
keywords: [enforce-forward, check-only, build-migration]
hash: 50bdd38
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Forward-only fix for failed atomic migrations

When a migration wrapped in `BEGIN; ... COMMIT;` fails partway through, PostgreSQL rolls back the entire block atomically. **Zero schema state from that migration persists on prod** (except statements that ran outside the BEGIN/COMMIT — typically only `ALTER TYPE`).

## The right fix (forward-only)

1. Identify the failing statement from the deploy logs.
2. Edit the migration file **in place** — fix the bug.
3. Commit + push + open a fix PR.
4. Merge + redeploy.

The deploy script re-runs every migration file on every deploy (red-e-play uses `for f in src/db/migrations/*.sql; do psql -f $f; done`). On re-run, the previously-failed migration applies cleanly with the fix.

## The WRONG fix (don't do this)

- Don't write a "0XXX_fix_previous_migration.sql" that tries to ADD a column / ALTER an FK / fix up partial state. There IS no partial state.
- Don't `git revert` the original migration commit.
- Don't pgsql-by-hand on production.

## Origin

Trainer-marketplace session: migration 0165 failed with BIGINT vs UUID FK type mismatch. BEGIN/COMMIT rolled everything back. Edited 0165 in place (BIGINT to UUID), shipped as PR #824, redeployed. Clean.
