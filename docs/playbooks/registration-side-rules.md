# Playbook — Registration-side rules ("schema defaults you forget")

A running list of schema-default-FALSE columns + invariants that silently hide content unless explicitly flipped at registration time.

## The pattern

A migration ADDs a column with `DEFAULT FALSE` (or `DEFAULT NULL`, etc.). Existing rows get the default. New rows inserted by future migrations or routes that don't know about the column ALSO get the default. Result: silently hidden content.

## Known instances (red-e-play)

### `plans.is_public` (added by 0093)
- Default: FALSE
- Effect: `/public/plans/<slug>` returns `plan_not_found`
- Fix: `INSERT ... is_public, VALUES ... TRUE` or `UPDATE plans SET is_public = TRUE WHERE id = 'your-plan';`
- Caught: trainer-marketplace 2026-05-14 (PR #817 → #822 fix)

### `players.approval_status` (approval-gap PRs)
- Default: `'pending'`
- Effect: user is in DB but blocked from most features
- Fix: explicit admin Approve action

### `features.status` (default `'next'`)
- Default: `'next'`
- Effect: feature registered but not flagged as built
- Fix: status-change migration when schema/UI lands

### `creator_applications.honeypot_field` (NULL = legit)
- Default: NULL
- Effect: unique-index on email gates legit applicants; bots can squat
- Fix: route layer detects + stores honeypot rather than rejecting

## Process for new candidates

When you ALTER TABLE to add a column with a default that gates visibility / access / approval:
1. Update this file with the new instance
2. Add a `rules/library/<column>-flip-on-insert/` rule if the pattern is non-obvious
3. Update the seed-migration template to include the explicit flip
4. Cross-link from this file's "Known instances"

## Suspect columns to audit (when shipping a new field)

- `is_public`, `is_visible`, `is_active`, `is_featured`, `is_archived`
- `approved_at IS NOT NULL`, `verified_at IS NOT NULL`
- `published`, `enabled`, `gated`
- `visibility = 'public' | 'private'`
- `status = 'pending' | 'active'`

## Origin

`rules/library/is-public-flip-on-plan-insert` generalized to this running list.
