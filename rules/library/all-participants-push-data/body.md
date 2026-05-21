---
name: all-participants-push-data
id: RL-0005
hash: 44d05c3
keywords: [enforce-participants, check-push, build-data]
relations: []
before: []
governed_by: [global]
meta: dynamic
goal: Deliver all participants push data output correctly and completely.
---

# All participants push data — never single-point-of-failure on the creator

In any system where multiple actors (devices, users) have copies of the same
record, all of them must be able to push it — not just the creator. Any
creator-only push filter is a single point of failure.

---

## The failure mode

iOS SyncService only pushed games where:

```swift
game.createdByPlayerID == myID
```

If the scorekeeper's device lost network at game-end, no participant's stats
were ever recorded by anyone's device. The game existed in memory on all
devices but was never written to the database. All participants lost their
stats permanently.

---

## The rule

Remove the creator-only filter. All participants push all shared records:

```swift
// Before (single point of failure):
let gamesToPush = completedGames.filter { $0.createdByPlayerID == myID }

// After (resilient):
let gamesToPush = completedGames.filter { !pushedIDs.contains($0.id) }
```

The server upsert handles idempotency:

```sql
INSERT INTO game_sessions (...)
ON CONFLICT (id)
DO UPDATE SET
  status = EXCLUDED.status,
  score_a = EXCLUDED.score_a,
  score_b = EXCLUDED.score_b,
  -- etc.
WHERE game_sessions.status != 'ended';  -- don't overwrite ended games
```

Only one push wins (the first to arrive). The rest are no-ops. No duplicate
data is created.

---

## Apply this pattern to

- Game records (any multi-player session)
- Order confirmations (any confirmed transaction)
- Payment records (any completed payment)
- Health data (any shared health event)
- Match results (any competitive result)
- Any record that multiple clients have in memory simultaneously

---

## What idempotency looks like at the API

```js
router.post('/games', requireAuth, async (req, res) => {
  const { id, ...fields } = req.body;
  await db.query(`
    INSERT INTO game_sessions (id, ...)
    VALUES ($1, ...)
    ON CONFLICT (id) DO UPDATE SET
      ...
    WHERE game_sessions.status != 'ended'
  `, [id, ...]);
  res.json({ ok: true });
});
```

The `WHERE game_sessions.status != 'ended'` guard ensures that a finalized
game cannot be overwritten by a late-arriving stale push from another client.

---

## First seen

Red-E Play iOS SyncService, 2026-05-14. Creator-only filter was the primary
reason game sessions were not reaching the database. Changed to participant-
based filter. All three participants on a game can now push independently.
