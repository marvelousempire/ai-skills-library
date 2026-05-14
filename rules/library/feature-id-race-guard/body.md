# Feature-ID race guard — check IDs at write time, not at planning time

Feature IDs in a database-backed ledger are first-come, first-served, exactly the way migration numbers are (see [`migration-race-guard`](../migration-race-guard/body.md)). When you decide to use IDs 530–547 during planning and another agent's PR claims 530 four hours later, your `INSERT INTO features VALUES ('530', ...)` silently gets `ON CONFLICT DO NOTHING`'d at deploy time — and your row is lost.

**The rule: run `next-feature-id.sh` (or equivalent) at the moment you write the seed migration file, not during planning. Then pick a range comfortably ABOVE the high-water mark for any multi-feature batch.**

---

## The check (run it right before creating the seed migration .sql file)

```bash
bash scripts/either-host/next-feature-id.sh   # red-e-play
# or: psql -c "SELECT MAX(id::int) FROM features;" + 1
```

For multi-feature batches (5+), pick a starting ID **at least 5 above** the script's return — leaves headroom for any in-flight PRs that ship between your check and your merge.

---

## Origin

Surfaced during the trainer-marketplace session (2026-05-14): PR #816 (Creator Program) merged mid-session and claimed feature 530. I had to renumber my entire 530–547 range to **548–565** mid-PR. See [`docs/master-reports/2026-05-14-trainer-marketplace-session.md`](../../../docs/master-reports/2026-05-14-trainer-marketplace-session.md) Section 3.1.1 and [`docs/pain-journal/2026-05-14-feature-id-530-collision.md`](../../../docs/pain-journal/2026-05-14-feature-id-530-collision.md).

---

## Recovery if a collision lands

1. `psql -c "SELECT id FROM features WHERE id BETWEEN '<your-min>' AND '<your-max>';"` — find which IDs collide.
2. Shift your entire range above the highest claimed ID (don't try to interleave — it's a footgun).
3. Use a Python-in-Bash one-liner to rewrite IDs across all affected files (see [`bulk-token-substitution`](../bulk-token-substitution/body.md)).
4. Update `Feature Ledger.md` mirror, the Plan-X.md doc, and the CHANGELOG entry in the same commit.

---

## Why planning-time IDs are always stale

Same reasoning as migration-race-guard. 2-second cost to re-check; multi-hour cost to renumber after the fact.
