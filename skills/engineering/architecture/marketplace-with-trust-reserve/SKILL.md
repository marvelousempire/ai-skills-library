---
name: marketplace-with-trust-reserve
description: >-
  Design a two-sided marketplace with anti-fraud designed in from day one. Players spend → escrow → split: 15% platform / 3% processor / 2% trust-safety reserve / 80% supplier payout. The 20% retained is not pure margin — it funds the audit machinery that makes the marketplace credible.
trigger: >-
  Use when designing any two-sided marketplace: hiring, gig work, peer-to-peer commerce, content marketplace, anything where money flows from consumer to supplier with the platform taking a cut. Bakes in escrow, audit funding, fee transparency.
---

# /marketplace-with-trust-reserve

## What this skill does

Emits the canonical marketplace shape with anti-fraud baked in:

1. **Credit-ledger flow**: consumer top-ups → wallet → spend kind (`spend_<marketplace>_assessment`) → escrow → completion event → split
2. **Fee split**: 15% platform / 3% processor / 2% trust-safety reserve = 20% retained; 80% to supplier
3. **Configurable per-supplier**: `platform_config.<marketplace>_fee_bps = 2000` default; per-supplier overrides via separate table
4. **Trust apparatus the 2% funds**:
   - Random 5% audit (per [post-ship-audit-elevation](../post-ship-audit-elevation/SKILL.md) pattern but for transactions)
   - Strike system with 3-strike contract revocation
   - Refund pool for failed services
   - Dispute resolution operations
5. **Escrow holds**: credits move to escrow on accept; release on completion + audit clear; refund on cancel within window

## Key skill anti-patterns

- **20% as pure margin**: it's not. If you treat it as margin, the trust apparatus is unfunded, fraud creeps in, the signal becomes worthless.
- **No anti-fraud at launch**: "we'll add it when we have scale" — by then bad actors are already there.
- **Single-actor verification**: see [multi-actor-consensus-mechanic](../multi-actor-consensus-mechanic/SKILL.md).
- **Opaque fees**: rates must be visible to both sides before any booking confirms.

## Required schema additions

- `platform_config.<marketplace>_fee_bps` — JSONB with `default_bps` + `split` breakdown
- Extension to `credit_ledger_kind`: `spend_<marketplace>_assessment`, `<marketplace>_payout`, `<marketplace>_platform_fee`
- `<marketplace>_bookings` table with full state machine
- `<marketplace>_strikes` table for revocation system
- `<marketplace>_reviews` table or extension to existing `reviews`

## Origin

Trainer-marketplace plan (red-e-play, 2026-05-14). The 20% retained split was the result of comparing Thumbtack (5-15%), TaskRabbit (~22.5% effective), and Uber (25%). 20% is the right balance.

## Companion plan doc

[`docs/playbooks/marketplace-from-day-one.md`](../../../docs/playbooks/marketplace-from-day-one.md) (if exists; otherwise see this skill).
