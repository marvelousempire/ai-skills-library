# Activity events are feed signals — not game records

`activity_events` and `game_sessions` are distinct tables with distinct
purposes. Confusing them in admin UI or debugging will lead to wrong
conclusions about what data has been recorded.

---

## The distinction

| | `activity_events` | `game_sessions` |
|--|--|--|
| **Purpose** | Feed signals — lightweight, optimistic | Permanent game records — authoritative |
| **When pushed** | Fire-and-forget, on any significant action | After game ends, via authenticated sync |
| **Error handling** | Errors are ignored (fire-and-forget) | Errors are logged, retried via SyncService |
| **Auth required** | Yes, but failure is non-fatal | Yes, failure blocks the push |
| **Affects stats** | No | Yes (`affects_permanent_profile = true`) |
| **Appears in** | Admin activity feed | Player stats, history, leaderboard |
| **Survives network loss** | Sometimes not (if the fire-and-forget fails) | Retried until success |

---

## The failure mode

An operator looks at the admin activity feed and sees "Player A finished a
run" events. They conclude: "Game data is being recorded." They close the
bug ticket.

A developer checks `SELECT COUNT(*) FROM game_sessions` and finds 0 rows.
The activity events were published successfully, but the game push failed
separately (JWT expiry, creator-only filter, API error). Activity events
and game sessions are pushed by different code paths.

**Activity events being present does NOT confirm game sessions are present.**

---

## The rule

Any admin UI that shows `activity_events` must include a callout:

> "These are feed signals. For recorded game sessions, see the Completed
> Games section."

Any debugging session for "stats show zeros" must check `game_sessions`,
not `activity_events`.

---

## In queries

```sql
-- WRONG: This counts feed events, not games
SELECT COUNT(*) FROM activity_events
WHERE player_id = $1 AND event_type = 'game_finished';

-- RIGHT: This counts actual recorded games
SELECT COUNT(*) FROM game_sessions
WHERE ... full participation check ...
  AND status = 'ended'
  AND affects_permanent_profile = true;
```

---

## Detecting the confusion in code

```bash
grep -rn "activity_events" backend/src/routes/stats.js
# If you see activity_events in a stats route, that's the bug.
# Stats must come from game_sessions, score_events, mini_game_sessions.
```

---

## First seen

Red-E Play game pipeline debugging, 2026-05-14. Activity events were present
for games, confirming the iOS client was reaching the API. But `game_sessions`
had 0 rows. The activity event push and the game session push are independent
code paths with independent error handling.
