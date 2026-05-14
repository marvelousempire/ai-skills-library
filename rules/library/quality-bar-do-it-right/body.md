---
name: quality-bar-do-it-right
id: RL-0035
keywords: [quality, bar, right]
---

# Quality bar — do it right the first time

When a problem has a "right way" and a "quick hack," do the right way. **Never ship a hack that has visible side-effects to paper over a symptom.** If the right fix is too complex for the current scope, **say so out loud and propose deferring** — don't ship a worse alternative and call it shipped.

## Test before shipping any fix

> Is this the structural answer, or am I making the original problem visible somewhere else? If the latter, you're not done.

## Concrete examples of the failure mode (avoid)

- Centering UI by adding an invisible balance element instead of using a true-center overlay
- Renaming a function and leaving the old name as a deprecated alias "so callsites keep working"
- Patching a symptom in iOS UI when the root cause is a serializer asymmetry on the backend
- Shipping a "Phase 1" route that returns a hardcoded response instead of querying the new table

## The honest-deferral pattern

1. Identify the right fix.
2. Identify why it doesn't fit this scope (time, dependencies, risk).
3. Register the right fix as a feature in the ledger.
4. Mention the deferred work explicitly in the PR description and the CHANGELOG entry.
5. Do not ship the hack.

## Origin

Adopted from red-e-play's CLAUDE.md (the brand-title centering hack of 0.18.20 that took 6 versions to remove). Re-affirmed by the trainer-marketplace session — explicitly refused to ship half-baked routes, half-baked UI, or fake Stripe integration.
