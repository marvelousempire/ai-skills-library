---
name: game-pipeline-debug
description: "Debug why game sessions are not being recorded in the database or not appearing in stats. Use when: 'game stats show zero,' 'game history missing from web,' 'games not syncing,' 'no games in database,' 'played games don\'t show up,' 'player stats are all zeros,' 'game sessions table empty,' 'game push failing silently,' 'play-by-play missing,' 'leaderboard shows wrong game count.' Runs a 7-step diagnostic across the DB layer, JWT config, iOS sync code, UserDefaults tracking, DB flags, participation SQL, and activity-vs-game confusion."
metadata:
  version: 1.0.0
---

# Game Pipeline Debug

You are debugging why game sessions are not being recorded or not appearing
in stats. This is a 7-step diagnostic. Stop at the step where you find the
gap — don't continue if you've found the root cause.

---

## Step 1 — DB row count (30 seconds, always first)

SSH to VPS and count game sessions:

```bash
psql $DATABASE_URL -c "
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'ended' THEN 1 ELSE 0 END) AS ended,
  SUM(CASE WHEN affects_permanent_profile THEN 1 ELSE 0 END) AS counts_for_stats
FROM game_sessions;
"
```

**If total = 0:** no data has ever reached the DB. The problem is at the
iOS push layer. Proceed to Step 2.

**If total > 0 but counts_for_stats = 0:** games are recorded but not
flagged as permanent. Check the `affects_permanent_profile` write path.

**If counts_for_stats > 0 but stats show 0:** the problem is at the stats
query or serializer layer. Skip to Step 5.

---

## Step 2 — JWT TTL check

```bash
grep JWT_EXPIRES_IN /opt/readyplay/api/.env
# Expected: JWT_EXPIRES_IN=7d
# Bug: JWT_EXPIRES_IN=1h
```

If `1h`: change to `7d` and restart the API. Mobile clients with short-lived
tokens silently fail to push after the token expires, especially during
background sync after a period of inactivity.

```bash
pm2 restart readyplay-api --update-env
```

---

## Step 3 — iOS sync filter (creator-only check)

In the iOS codebase, find `SyncService` and search for:

```swift
// Bug pattern — single point of failure:
let gamesToPush = completedGames.filter { $0.createdByPlayerID == myID }

// Fix — all participants can push:
let gamesToPush = completedGames.filter { !pushedIDs.contains($0.id) }
```

If the creator-only filter exists, every participant in a game that the
scorekeeper's device couldn't push will have permanent data loss. Fix:
remove the creator filter. The server upsert is idempotent.

---

## Step 4 — UserDefaults push tracking

Search for `pushedCompletedGameSessionIDs` in the iOS codebase:

```swift
// Check what's in the tracking set:
let pushed = UserDefaults.standard.object(forKey: "pushedCompletedGameSessionIDs") as? [String] ?? []
```

If game IDs are in this set, iOS considers them "already pushed" and will
never retry them. To diagnose: if a game ID is in `game_sessions` but stats
still show the game, this is fine. If a game ID is NOT in `game_sessions` but
IS in `pushedCompletedGameSessionIDs`, the push silently failed and the game
is lost.

To recover: clear the tracking set for specific game IDs and trigger a re-sync.

---

## Step 5 — `affects_permanent_profile` flag

```bash
psql $DATABASE_URL -c "
SELECT affects_permanent_profile, status, COUNT(*)
FROM game_sessions
GROUP BY 1, 2
ORDER BY 1, 2;
"
```

Stats queries should filter on `affects_permanent_profile = true`. If all
rows have `affects_permanent_profile = false`, the API endpoint that writes
games is not setting this flag. Fix: add `affects_permanent_profile = true`
to the INSERT/UPDATE in the backend route.

---

## Step 6 — Participation SQL check

Find the stats query in the backend:

```bash
grep -A 30 "games_played\|total_games\|game_count" backend/src/routes/public-profile-stats.js
```

The WHERE clause must use full participation logic. A creator-only query
silently shows 0 for any player who didn't create their own games:

```sql
-- Bug: creator only
WHERE gs.created_by_player_id = $1

-- Fix: full participation
WHERE
  gs.created_by_player_id = $1
  OR gs.score_data->'team_a'->'playerIDs' @> to_jsonb($1::text)
  OR gs.score_data->'team_a'->'playerIds' @> to_jsonb($1::text)
  OR gs.score_data->'team_a'->'player_ids' @> to_jsonb($1::text)
  OR gs.score_data->'team_b'->'playerIDs' @> to_jsonb($1::text)
  OR gs.score_data->'team_b'->'playerIds' @> to_jsonb($1::text)
  OR gs.score_data->'team_b'->'player_ids' @> to_jsonb($1::text)
  OR gs.checked_in_player_ids @> ARRAY[$1]
  OR EXISTS (
    SELECT 1 FROM score_events se
    WHERE se.game_session_id = gs.id AND se.scorer_player_id = $1
  )
```

---

## Step 7 — Activity events vs game sessions confusion

```bash
psql $DATABASE_URL -c "
SELECT
  (SELECT COUNT(*) FROM game_sessions) AS game_sessions,
  (SELECT COUNT(*) FROM activity_events WHERE event_type LIKE '%game%') AS game_activity_events;
"
```

If `game_activity_events > 0` but `game_sessions = 0`: iOS is reaching the
API (activity events fire first), but the game push (`POST /games`) is failing
separately. Check the `/games` endpoint for auth errors, schema mismatches,
or validation failures.

**Activity events being present does NOT mean game sessions are present.**
They are pushed by different code paths with different error handling.

---

## Output format

```
GAME PIPELINE DIAGNOSIS

DB state:
  game_sessions total: X
  ended: X
  counts_for_stats: X
  score_events: X
  activity_events (game type): X

Root cause found at Step N:
  [description of the gap]

Fix:
  [exact change needed]

Additional gaps (non-blocking):
  [list of secondary issues to address]

How to verify after fix:
  [literal command + expected output]
```

---

## Related rules and skills

- `diagnosis-before-fix` — DB check is always first
- `mobile-jwt-ttl` — JWT_EXPIRES_IN must be ≥7d
- `all-participants-push-data` — all participants push, not just creator
- `stats-query-participation-not-creator` — full participation SQL
- `activity-events-not-game-records` — don't confuse the two tables
- `data-pipeline-tracer` skill — broader pipeline tracing for non-game data
