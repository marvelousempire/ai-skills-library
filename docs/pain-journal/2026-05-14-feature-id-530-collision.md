# Feature ID 530 collision mid-session

**First seen:** 2026-05-14 (red-e-play PR #816 vs my PR #817)
**Session:** trainer-marketplace
**Category:** coordination

## Symptom

`bash scripts/either-host/next-feature-id.sh` returned 530 at the start of the session. I planned features 530–547 for the trainer-marketplace plan. Mid-session, PR #816 (Creator Program) merged and claimed feature 530 for its own post-acceptance KYC uploads. My `INSERT INTO features VALUES ('530', 'Trainer role + profile schema', ...) ON CONFLICT DO NOTHING` would have silently dropped my row on deploy.

## Diagnose

```bash
git fetch origin && git log HEAD..origin/main --oneline | grep -i "feature"
grep -ohE "^\('5[0-9][0-9]'," backend/src/db/migrations/*.sql | sort -u
```

## Fix

Renumbered my entire range 530–547 → **548–565** comfortably above the new high-water mark. Used a Python regex script ([bulk-token-substitution](../../rules/library/bulk-token-substitution/body.md)) to rewrite all references in 4 files:
- `0164_seed_trainer_marketplace_plan.sql`
- `docs/Plan-Trainer-Marketplace.md` (99 token shifts)
- `docs/Feature Ledger.md` (22 token shifts)
- `docs/CHANGELOG.md`

## Root cause

`next-feature-id.sh` returns the value at the moment it's run. Between planning and merging, parallel sessions can claim IDs. The script has no reservation system.

## Prevention

- Rule: [`feature-id-race-guard`](../../rules/library/feature-id-race-guard/body.md) — re-run the script right before Write, never at plan time
- Rule: pick IDs ≥5 above the high-water mark for any multi-feature batch
- Skill: [`bulk-rename-tokens`](../../skills/engineering/bulk-rename-tokens/SKILL.md) for fast renumbering when collision happens

## Related

- Master Report: [`docs/master-reports/2026-05-14-trainer-marketplace-session.md`](../master-reports/2026-05-14-trainer-marketplace-session.md) Section 3.1.1
- Sister rule: [`migration-race-guard`](../../rules/library/migration-race-guard/body.md)
