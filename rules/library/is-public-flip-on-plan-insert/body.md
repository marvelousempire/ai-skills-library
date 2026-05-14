---
name: is-public-flip-on-plan-insert
id: RL-0021
keywords: [public, flip, plan]
---

# plans.is_public must be explicitly flipped on plan registration

Migration 0093 added `is_public BOOLEAN NOT NULL DEFAULT FALSE` to the `plans` table. New plans inserted without setting this column are stored in the database but **silently invisible** to:

- `GET /public/plans` (filters by `is_public=TRUE`)
- `GET /public/plans/<slug>` (returns `plan_not_found`)

Always include in any plan-registration seed migration:

```sql
INSERT INTO plans (id, name, status, summary_md, why_it_matters_md, owner, is_public)
VALUES ('your-plan', '...', 'active', '...', '...', 'claude:your-plan', TRUE)
ON CONFLICT (id) DO UPDATE SET ..., is_public = TRUE;
```

Or as a separate UPDATE:

```sql
UPDATE plans SET is_public = TRUE WHERE id = 'your-plan';
```

## Origin

Trainer-marketplace session: PR #817 registered `trainer-marketplace` without setting `is_public`. After deploy, `curl /public/plans/trainer-marketplace` returned 404. Caught only via smoke-test. Fixed in 0165 as part of the schema PR.

## Generalized: "registration-side rules"

`is_public` is one of a class of schema-default-FALSE columns that silently hide content. Other suspects: `is_active`, `is_visible`, `published`, `approved_at IS NOT NULL`. Whenever inserting a row that's supposed to be user-visible, audit the schema for these gates. See `docs/playbooks/registration-side-rules.md`.
