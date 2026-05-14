# plans.is_public defaults FALSE — silent invisibility

**First seen:** 2026-05-14 (red-e-play PR #817 silent visibility gap)
**Session:** trainer-marketplace
**Category:** schema

## Symptom

After PR #817 (plan registration) merged + deployed + CI green, smoke-testing showed:
```bash
curl https://api.readyplay.app/public/plans/trainer-marketplace
# {"error":"plan_not_found"}
```
Even though `SELECT * FROM plans WHERE id='trainer-marketplace';` on prod returned the row. The plan was IN the database but invisible to the public API.

## Diagnose

```bash
# Check the plans table schema for default-FALSE columns
grep "is_public\|public BOOLEAN" backend/src/db/migrations/*.sql

# Confirm the route filters on is_public
grep -A 5 "router.get.*public/plans" backend/src/routes/*.js
```

Result: migration 0093 added `is_public BOOLEAN NOT NULL DEFAULT FALSE`. My 0164 didn't set it.

## Fix

Added to 0165 (the next migration in the cascade):
```sql
UPDATE plans SET is_public = TRUE WHERE id = 'trainer-marketplace';
```

Or in seed migrations going forward, set explicitly:
```sql
INSERT INTO plans (..., is_public)
VALUES (..., TRUE)
ON CONFLICT (id) DO UPDATE SET ..., is_public = TRUE;
```

## Root cause

Schema-default-FALSE columns added later (in 0093) are invisible to migrations written earlier (or by agents who haven't audited the column list). New rows silently get the gated default.

## Prevention

- Rule: [`is-public-flip-on-plan-insert`](../../rules/library/is-public-flip-on-plan-insert/body.md) — explicit flip on every plan registration
- Playbook: [`docs/playbooks/registration-side-rules.md`](../playbooks/registration-side-rules.md) — running list of similar gotchas
- Rule: [`smoke-test-after-deploy`](../../rules/library/smoke-test-after-deploy/body.md) — caught only because I smoke-tested

## Related

- Master Report: Section 3.2.3
- This is the canonical example for the "registration-side rules" playbook
