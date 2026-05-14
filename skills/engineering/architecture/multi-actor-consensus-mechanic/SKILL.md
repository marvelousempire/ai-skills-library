---
name: multi-actor-consensus-mechanic
id: SK-0005
keywords: [multi, actor, consensus]
description: >-
  Designs an anti-fraud trust signal from N independent actors. Bakes in: distinct actors (by id), distinct organizations (by business_tax_id or equivalent), cooldown between attempts, rolling time window, cohesion gate (median +/- band). Generalizes Sound Score; applies to any signal you want to make hard to fake.
trigger: >-
  Use when designing: verified attributes, peer reviews that need to mean something, eligibility checks, content moderation pass/fail, identity verification beyond a single source, multi-party approval workflows.
---

# /multi-actor-consensus-mechanic

## What this skill does

Designs the "Sound Score" shape:

1. **Distinct actors** — minimum N (default 3). Two can collude trivially; three requires real coordination.
2. **Distinct organizations** — no two from the same `business_tax_id` (or equivalent). Two actors at the same shop sharing financial interest don't count as independent.
3. **Same-target cooldown** — actor A can't run two attempts on target X within 24h. Prevents one actor minting three "independent" records.
4. **Rolling time window** — all N attempts within the last D days (default 365). Lifetime is too loose; 90d is too tight given geographic actor disparity.
5. **Cohesion gate** — N scores must fall within median ± B (default 10 points on 0–99 scale). Outliers don't fail outright — they raise an audit task.
6. **Expiry behavior** — when the oldest of the N falls outside D days, demote the badge to single-actor; notify 30 days prior.
7. **Recompute trigger** — on insert/update of the verification ledger, on actor revocation.

## When to use it

- Verified player attributes (trainer-marketplace, Sound Score)
- Verified identity / KYC (3 documents from 3 issuers)
- Content moderation (3 reviewers, distinct teams)
- Eligibility for a paid program (3 vouchers from non-related referrers)
- Approval-to-act (e.g. high-stakes operations requiring 3 distinct admin approvers)

## The SQL function shape

```sql
CREATE OR REPLACE FUNCTION consensus_for(p_target_id UUID, p_attribute TEXT)
RETURNS JSONB LANGUAGE plpgsql STABLE AS $$
DECLARE
  cfg JSONB;
  min_actors INT;
  window_days INT;
  -- ... etc
BEGIN
  SELECT value INTO cfg FROM platform_config WHERE key = 'consensus_rules';
  -- Step 1: DISTINCT ON (actor_id) for most-recent score per actor in window
  -- Step 2: DISTINCT ON (org_id) drop same-organization duplicates
  -- Step 3: 24h cooldown filter
  -- Step 4: cohesion gate
  -- Returns NULL when not consensus, JSONB summary when yes
END $$;
```

Full canonical example: red-e-play's `sound_score_for_player_attribute()` in migration `0165_trainer_marketplace_schema.sql`.

## Origin

Trainer-marketplace session — designed Sound Score with the full ruleset baked in. Generalizes far beyond the trainer use case; this skill extracts the pattern.
