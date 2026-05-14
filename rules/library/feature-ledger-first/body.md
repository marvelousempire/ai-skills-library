---
name: feature-ledger-first
id: RL-0013
keywords: [feature, ledger, first]
---

# Feature-ledger first — every feature is a product

Every named piece of work — feature, gap, elevation — registers in the admin ledger BEFORE coding starts. Registration is one seed migration + one row in `features` + N rows in `feature_surfaces` + 1 row in `plan_features` (if attached to a plan).

## Why before, not after

- Parallel sessions don't ship overlapping features
- Post-ship gap audits surface real work that has a home
- Each feature gets an owner, a status, a plan
- The migration log is the audit trail of intent

## The canonical shape (red-e-play, portable)

```sql
INSERT INTO plans (id, name, status, summary_md, why_it_matters_md, owner, is_public)
VALUES ('your-plan', '...', 'active', '...', '...', 'claude:your-plan', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO features (id, name, section, description_md, why_it_matters_md, status, ...)
VALUES ('NNN', 'Feature title', 'Section name', '...', '...', 'next', ...)
ON CONFLICT (id) DO NOTHING;

INSERT INTO feature_surfaces (feature_id, surface) VALUES
  ('NNN', 'backend'), ('NNN', 'ios')
ON CONFLICT (feature_id, surface) DO NOTHING;

INSERT INTO plan_features (plan_id, feature_id, position) VALUES
  ('your-plan', 'NNN', NNN)
ON CONFLICT (plan_id, feature_id) DO NOTHING;
```

## What NOT to register

Trivial work — typos, single-line config changes, doc tweaks, version bumps. The rule is: would this change show up in a release note or a gap audit? If no, skip registration.

## Companion artifacts (ship in the same PR)

1. `docs/Plan-<Name>.md` — long-form spec
2. CHANGELOG entry — `[docs]` line if registration-only
3. `docs/Feature Ledger.md` mirror update

## Skill that does this atomically

`skills/engineering/register-feature-ledger-plan` emits all four artifacts from a single command.
