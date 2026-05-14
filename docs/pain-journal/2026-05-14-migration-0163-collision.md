# Migration filename 0163 collision mid-session

**First seen:** 2026-05-14 (red-e-play PR #820 vs my PR #817's planned filename)
**Session:** trainer-marketplace
**Category:** coordination

## Symptom

`bash scripts/either-host/next-migration-number.sh` returned 0160 at the start of the session. While I was writing, the script's return drifted: PR #820 (iOS-web parity Phase 1) merged with `0163_flip_ios_web_parity_phase_1_built.sql`. My plan had assumed `0163_seed_trainer_marketplace_plan.sql`. Filename collision.

## Diagnose

```bash
ls backend/src/db/migrations/ | tail -5
ls backend/src/db/migrations/ | grep -E "^[0-9]{4}" | awk '{print substr($0,1,4)}' | sort | uniq -d
```

## Fix

Renamed migration `0163` → `0164`. Updated internal references via Python:

```bash
python3 -c "
import os
paths = ['backend/src/db/migrations/0164_seed_trainer_marketplace_plan.sql', 'docs/Plan-Trainer-Marketplace.md', 'docs/CHANGELOG.md']
for p in paths:
    src = open(p).read()
    dst = src.replace('0163_seed_trainer_marketplace_plan', '0164_seed_trainer_marketplace_plan')
    open(p, 'w').write(dst)
"
git mv backend/src/db/migrations/0163_*.sql backend/src/db/migrations/0164_seed_trainer_marketplace_plan.sql
```

## Root cause

Same race condition as feature-id-530-collision but on migration filenames. The "next free number" is first-come, first-served.

## Prevention

- Rule: [`migration-race-guard`](../../rules/library/migration-race-guard/body.md) — re-check at Write time
- When a session is multi-PR, plan filenames at "high-water mark + safety margin" rather than "next free"

## Related

- Master Report: [`docs/master-reports/2026-05-14-trainer-marketplace-session.md`](../master-reports/2026-05-14-trainer-marketplace-session.md) Section 3.1.2
- Sister incident: [`2026-05-14-feature-id-530-collision.md`](2026-05-14-feature-id-530-collision.md)
