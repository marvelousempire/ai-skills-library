---
name: post-ship-audit-elevation
id: SK-0032
keywords: [audit-ship, elevate-output, file-findings]
goal: Deliver post ship audit elevation output correctly and completely.
hash: e61afbb
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  After every substantive PR merges, run a 2-pass audit: (1) Gap pass — what's incomplete, deferred, fragile, untested in what just shipped; (2) Elevation pass — what would the most ambitious version of this feature look like. Present as numbered lists; wait for user pick before implementing.
trigger: >-
  Use automatically the moment a real piece of work has been committed, pushed, or PR'd and the user has implicitly or explicitly said "we're done with that step." NOT for typos, doc tweaks, or one-line edits.
---

# /post-ship-audit-elevation

## What this skill does

Right after a substantive ship:

1. **Announce the pass.** "Now I'm going to audit the gaps and propose how to take this further."
2. **Gap audit** — numbered list of:
   - Edge cases not handled
   - Accessibility, error paths, sync/persistence holes
   - Interactions with adjacent features not touched
   - Places the new code makes unverified assumptions
   - Heuristics that should be measured properly
   - Test coverage skipped
3. **Elevation pass** — lettered list of "what would the most ambitious version look like":
   - Read intent, not just literal request
   - Pull on project memory — connection-gated surfaces, backend sync, witness signals, etc.
   - Aim for the version that makes a user say "wow"
4. **Present as concrete options.** Two clearly labeled lists: **Gaps to close** (numbered) and **Elevations** (lettered). Each item: one sentence what it is, one short sentence why it matters.
5. **Wait for sign-off.** Do not implement anything from the list until the user picks.

## What this is NOT

- Not padding the response
- Each gap and each elevation must be a real, actionable thing you'd actually build if asked
- If the work is genuinely done with no meaningful gaps or obvious elevations, say so — don't invent items

## Where the picks land

When the user picks (e.g. "do 1, 2, 4, A, C, F"):
- Register each picked item in the feature ledger ([feature-ledger-first](../../../rules/library/feature-ledger-first/body.md))
- Group them under the same plan as the shipped work
- Status='next' until they ship

## Origin

Adopted from user-global CLAUDE.md "After shipping — automatic gap audit + elevation pass". Re-affirmed every PR in the trainer-marketplace session — the final delivery report's Section 9 "What's intentionally NOT shipped" IS the gap audit applied to the master report PR itself.
