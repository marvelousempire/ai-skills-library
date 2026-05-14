---
name: register-feature-ledger-plan
description: >-
  Register a new plan + N features atomically in a database-backed admin ledger. Emits the seed migration, the long-form Plan-X.md doc, and the Feature Ledger.md mirror update — all idempotent, all in one PR. The canonical "every feature is a product" registration unit.
trigger: >-
  Use when the user wants to "register a plan", "log features in the ledger", "add a plan to admin", "start a new initiative", or at the end of plan-mode for any substantive new body of work. Also fires when a post-ship gap audit surfaces N follow-ups that need feature rows.
---

# /register-feature-ledger-plan

## What this skill does

Emits three artifacts in one PR:

1. `backend/src/db/migrations/NNNN_seed_<plan-slug>_plan.sql` — atomic seed of `plans` + `features` + `feature_surfaces` + `plan_features` + bootstrap `feature_changes`
2. `docs/Plan-<Name>.md` — long-form spec (problem statement, scope, feature table, open questions, Secure Data Flow checklist, adjacent work)
3. `docs/Feature Ledger.md` — mirror updated with N new rows

Plus a `[docs]` CHANGELOG.md entry that lists all three.

## How to invoke

```
/register-feature-ledger-plan <plan-slug>
```

Or, more naturally, from inside plan-mode after the user approves the final plan:

> "Approved. Ship the registration."

## What the skill checks at write time

1. **Migration number race**: re-runs `bash scripts/either-host/next-migration-number.sh` and `next-feature-id.sh` right before writing the migration (per [`migration-race-guard`](../../../rules/library/migration-race-guard/body.md) and [`feature-id-race-guard`](../../../rules/library/feature-id-race-guard/body.md))
2. **High-water-mark margin**: for multi-feature batches, picks a starting ID at least 5 above the script's return — leaves headroom for any in-flight PRs
3. **`is_public=TRUE`** on the plan row ([`is-public-flip-on-plan-insert`](../../../rules/library/is-public-flip-on-plan-insert/body.md))
4. **Section CHECK constraint** — only uses sections that exist in `features.section` CHECK
5. **`ON CONFLICT DO NOTHING`** on every INSERT for idempotency
6. **Bootstrap `feature_changes` notes** for every feature so the migration's authorship is auditable

## Template references

- [`templates/seed-migration-plan-registration.sql`](../../../templates/seed-migration-plan-registration.sql)
- [`templates/plan-doc.md`](../../../templates/plan-doc.md)
- [`templates/changelog-entry.md`](../../../templates/changelog-entry.md)

## Canonical examples in red-e-play

- `0157_seed_post_ship_audit_2026_05_14_plan_v2.sql`
- `0159_seed_ios_web_parity_plan.sql`
- `0164_seed_trainer_marketplace_plan.sql` (latest, trainer-marketplace session)

## Verification after ship

```bash
curl -sS https://api.your-domain.com/public/plans/<plan-slug> | jq .id
psql $PROD_DATABASE_URL -c "SELECT id, section, status FROM features WHERE id BETWEEN '<min>' AND '<max>';"
```

## Origin

Trainer-marketplace session — PR #817 was the canonical plan-registration unit, 3 files (migration + Plan-doc + Feature Ledger mirror) + CHANGELOG entry.
