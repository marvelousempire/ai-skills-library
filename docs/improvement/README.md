# Improvement system

Tracks every gap, deferred elevation, open decision, recurring failure, and recurring win across the lifetime of the repo. Improvements compound here instead of evaporating.

## Files

| File | What |
|---|---|
| [`gaps-open.md`](gaps-open.md) | Every gap we said "skipping for now" |
| [`elevations-deferred.md`](elevations-deferred.md) | Every "would be nice" we listed |
| [`decisions-pending.md`](decisions-pending.md) | Open architectural choices awaiting input |
| [`recurring-failures.md`](recurring-failures.md) | Patterns to avoid (Docker daemon, branch confusion, count drift) |
| [`recurring-wins.md`](recurring-wins.md) | What keeps working (plan-first, idempotent, label schema) |
| [`audits/`](audits/) | After-ship gap audits, dated |
| [`decision-records/INDEX.md`](decision-records/INDEX.md) | Central index of all decision records (records themselves live in their skill folder) |

## How items flow

```text
   session-of-work
         │
         ├──►  audit (docs/improvement/audits/<date>-<scope>.md)
         │            │
         │            ├──► gaps          ──►  gaps-open.md (appended)
         │            └──► elevations    ──►  elevations-deferred.md (appended)
         │
         └──►  decisions made
                       │
                       ├──► record       ──►  skill folder + decision-records/INDEX.md
                       └──► pending      ──►  decisions-pending.md
```

## Closing an item

When a gap is finally closed:
- Remove the bullet from `gaps-open.md`
- Append a `[closed YYYY-MM-DD: <commit hash>]` line to the audit it came from
- Log in the next session report

Same flow for elevations and decisions.

## Anti-patterns

- Audits with no follow-up — file them, but link them to gaps-open / elevations-deferred so they persist
- Gaps that sit forever — periodic review (quarterly?) to either close or de-scope
- Decisions left "pending" indefinitely — force a record once 3 sessions touch the area
