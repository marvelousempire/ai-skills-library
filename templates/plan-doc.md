# Plan — <Name>

**Plan id (admin):** `<plan-slug>`
**Seed migration:** `backend/src/db/migrations/NNNN_seed_<plan-slug>_plan.sql`
**Feature ID range:** <min>–<max> (<N> features)
**Status:** active
**Last updated:** YYYY-MM-DD
**Owner:** claude:<branch>

---

## Problem statement

<One paragraph: what's broken or missing today, what trust/value/credential signal is absent, why now.>

The plan: <one-line description of what gets built>.

<Optional: the 2-tier badge / state machine / consensus shape if applicable.>

Around the verification/marketplace/feature layer sits <larger context>. <Why this matters from a business / user / product perspective.>

---

## Scope

### In scope

- Feature NNN — <one-line>
- Feature NNN+1 — <one-line>
- ...

### Out of scope (explicit)

- <Item 1> — <why deferred>
- <Item 2> — <why deferred>

### Adjacent (not superseded)

<Reference any existing plans/features that are NEAR this work but not replaced by it. Explicit cross-refs.>

---

## Feature breakdown

> Full descriptions live in `NNNN_seed_<plan-slug>_plan.sql`.

### <Section name> (commerce side, <N> features)

| ID  | Name | Surfaces |
|-----|------|----------|
| NNN | ... | ... |

### <Other section> (verification side, <N> features)

| ID  | Name | Surfaces |
|-----|------|----------|
| NNN | ... | ... |

---

## Consensus rules / state machine / etc. (if applicable)

| Rule | Default | Why |
|------|---------|-----|
| ... | ... | ... |

### Visual hierarchy (if applicable)

| State | Badge | Description |
|----|-------|-------------|
| ... | ... | ... |

---

## Anti-fraud design (if applicable)

### In the v1 ledger
- Feature NNN — <mechanism> — <what it catches>

### Follow-ups (not yet feature rows)
- <Idea 1>
- <Idea 2>

---

## Marketplace economics (if applicable)

Default: **N%** retained by <platform>.

| Slice | Share | Use |
|-------|-------|-----|
| Platform | X% | Operations, payroll, infra |
| Processor | Y% | Stripe + transfer fees |
| Trust & safety reserve | Z% | Funds the audit operation |

---

## Stripe Connect flow (if applicable)

<Reuses existing `payout_accounts` from migration 0029. ...>

---

## Secure Data Flow Protocol checklist

> Per `docs/Plan-Secure-Data-Flow-Protocol.md` Section 3.

| # | Question | v1 status | Notes |
|---|----------|----------|-------|
| 1 | Postgres column / table exists? | 🔜 (feature NNN) | ... |
| 2 | Backend write allowlist defined? | ... | ... |
| 3 | All read serializers updated symmetrically? | ... | ... |
| 4 | Admin renders the field? | ... | ... |
| 5 | Public profile correctly includes / excludes? | ... | ... |
| 6 | iOS save flow awaits server response? | ... | ... |
| 7 | Any local-only store needs sync drain? | ... | ... |
| 8 | Audit log captures changes? | ... | ... |

---

## Adjacent work

- [`docs/Plan-Other.md`](Plan-Other.md) — relationship

---

## Open questions

| Question | Default in plan | Resolution path |
|----------|----------------|-----------------|
| ... | ... | Resolve before feature NNN ships |

---

## Implementation phasing (post-registration PRs)

| Phase | PR scope | Features landed |
|-------|---------|-----------------|
| 0 (this PR) | Plan registration only | All <N> status `next` |
| 1 | <Phase 1 scope> | <features> |
| ... | ... | ... |

Each phase is its own PR. No phase merges until its predecessors are deployed.

---

## Go-live path (this PR only)

Per `go-live-path` rule:

1. **Merge** PR to `main` once CI is green
2. **Migrate**: `npm run migrate` on production runs migration NNNN
3. **Deploy backend**: triggered automatically by push to main touching backend/**
4. **Deploy admin**: trigger `Deploy admin` workflow manually
5. **Verify**:
   - `curl -s https://api.<domain>/health | jq .ok` returns true
   - `https://admin.<domain>/plans` shows the new plan
6. **Confirm adjacent untouched**: features <list> still status=next
