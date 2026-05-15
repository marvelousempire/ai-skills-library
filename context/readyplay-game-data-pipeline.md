# Red-E Play Game Data Pipeline

**For:** any agent debugging game sync, stats zeros, or data missing from player profiles.  
**Last updated:** 2026-05-14 (game pipeline investigation and fix)

---

## Full Pipeline Overview

```
iOS SyncService
  └─ POST /games (upsert)  ──────────────────────────────────────────> game_sessions table
  └─ POST /games/:id/score-events/batch ──────────────────────────────> score_events table
         │
         ▼
   JWT auth check (access token, must be valid)
         │
         ▼
   ON CONFLICT (id) DO UPDATE  ← idempotent, any participant can push
         │
  ┌──────┴──────────────────────────────────────────────────────────────┐
  │                        Postgres                                      │
  │  game_sessions  score_events  activity_events  players              │
  └──────┬──────────────────────────────────────────────────────────────┘
         │
         ▼
  GET /admin/players/:id/games  (admin — no privacy gate)
  GET /public/profile-stats/players/:id/summary  (public — privacy gated)
         │
         ▼
  admin/lib/api.ts  ─────────────────────> Admin dashboard player page
  player-web: fetch → /public/...  ──────> Player profile stats section
```

---

## iOS Push Layer

### SyncService.pushGame()

The iOS `SyncService` pushes completed games to the backend on:
- App foreground
- Timer trigger (every N minutes)
- Explicit "end game" action

**Key design decisions (as of 2026-05-14):**

1. **All participants push** — the filter was changed from `createdByPlayerID == myID` to
   all participants. Any player who was part of the game can push it. The server upsert
   is idempotent, so duplicate pushes are safe.

2. **`pushedCompletedGameSessionIDs` (UserDefaults)** — tracks which game IDs have been
   pushed. A game in this set will NOT be retried. If a push fails silently, the game ID
   may end up in this set before confirming server-side success — this is a known fragility.

3. **JWT requirement** — the push uses an authenticated API call. If the JWT has expired
   and the refresh fails, the push silently fails with a 401.

```swift
// Red-E Play/Red-E Play/Services/SyncService.swift
func pushCompletedGames() async {
    let allCompleted = gameStore.completedGames  // all games, not just created ones
    let pending = allCompleted.filter { !pushedCompletedGameSessionIDs.contains($0.id) }
    for game in pending {
        do {
            try await api.post("/games", body: game.toPayload())
            pushedCompletedGameSessionIDs.insert(game.id)
        } catch {
            // Silent failure — game is NOT added to pushedIDs on error
        }
    }
}
```

---

## JWT Configuration

| Token | TTL | Note |
|-------|-----|------|
| Access token | `7d` | Changed from `1h` on 2026-05-14 — mobile clients need ≥7d |
| Refresh token | `90d` | The real security boundary |

**Check the live TTL:**
```bash
grep JWT_EXPIRES_IN /opt/readyplay/api/.env
# Expected: JWT_EXPIRES_IN=7d
```

**Refresh endpoint:** `POST /auth/refresh` — exchanges a valid refresh token for a new access token.

**Why 1h was wrong:** games are played, phone is pocketed for 2+ hours, sync fires on next foreground → 401 → silent data loss. With a 7d TTL, the access token is virtually always valid when the sync fires.

---

## API Endpoint: POST /games

**File:** `backend/src/routes/games.js`

```js
router.post('/games', requireAuth, async (req, res) => {
  const { id, status, scoreA, scoreB, scoreData, ...fields } = req.body;
  await db.query(`
    INSERT INTO game_sessions (id, created_by_player_id, status, score_a, score_b, score_data, ...)
    VALUES ($1, $2, $3, $4, $5, $6, ...)
    ON CONFLICT (id) DO UPDATE SET
      status = EXCLUDED.status,
      score_a = EXCLUDED.score_a,
      score_b = EXCLUDED.score_b,
      score_data = EXCLUDED.score_data,
      affects_permanent_profile = EXCLUDED.affects_permanent_profile
    WHERE game_sessions.status != 'ended'  -- don't overwrite finalized games
  `, [id, req.user.id, status, scoreA, scoreB, JSON.stringify(scoreData)]);
  res.json({ ok: true });
});
```

The `ON CONFLICT (id) DO UPDATE` pattern is what makes multi-participant push safe. The `WHERE game_sessions.status != 'ended'` guard prevents a late stale push from overwriting a finalized record.

---

## Database Tables

### `game_sessions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key, set by iOS |
| `created_by_player_id` | text | The scorekeeper's player ID |
| `status` | text | `'pending'` → `'active'` → `'ended'` |
| `score_a`, `score_b` | integer | Final scores |
| `score_data` | jsonb | Full score data including team rosters |
| `affects_permanent_profile` | boolean | `true` = counts for stats |
| `checked_in_player_ids` | text[] | Players who checked in |

### `score_events`

Individual scoring plays within a game session. Used for play-by-play reconstruction and shot charts.

### `activity_events`

**NOT game records.** Lightweight signals used for the admin activity feed (join, achievement, social action). A player can have `activity_events` without any `game_sessions`. This is the most common source of confusion when debugging stats zeros.

---

## Public Stats Endpoint

**Route:** `GET /public/profile-stats/players/:id/summary`  
**File:** `backend/src/routes/public-profile-stats.js`  
**Cache:** `next: { revalidate: 60 }` on the frontend fetch (1-minute cache)

Privacy gates applied:
- Player must have `is_public = true`
- Player must have `approved_at IS NOT NULL`
- Individual stat visibility controlled by `wellness_visibility` JSON field

**The `PLAYER_GAME_MATCH_SQL` constant** — canonical 9-condition participation SQL used by this endpoint:

```sql
(
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
)
AND gs.affects_permanent_profile IS NOT FALSE
AND gs.status = 'ended'
```

Note: `affects_permanent_profile IS NOT FALSE` (not `= TRUE`) because the column is nullable — `NULL` should be treated as "yes, count it."

---

## Admin Stats Endpoint

**Route:** `GET /admin/players/:id/stats-summary`  
**File:** `backend/src/routes/admin.js`

Uses the same `PLAYER_GAME_MATCH_SQL` participation check. No privacy gate — admin sees all stats regardless of player visibility settings.

**Route:** `GET /admin/players/:id/games`  
Returns the list of completed games for the game history section on the admin player page.

---

## `activity_events` vs `game_sessions` Distinction

This is the single most common source of debugging confusion.

| Table | What it contains | Created by |
|-------|-----------------|-----------|
| `activity_events` | Lightweight feed signals (joined, achieved, posted) | Various server-side events |
| `game_sessions` | Actual game records with scores | iOS SyncService push |

A player with 3 `activity_events` and 0 `game_sessions` has:
- Activity showing in the admin activity feed
- Zero games in their stats
- Zero games in the player profile

**If you see activity but no game_sessions, the push layer is broken** — not the read layer.

**Diagnosis query:**
```sql
SELECT
  (SELECT COUNT(*) FROM game_sessions WHERE [participation_sql]) AS game_sessions,
  (SELECT COUNT(*) FROM activity_events WHERE player_id = 'PLAYER_ID') AS activity_events;
```

---

## Common Failure Modes

| Symptom | DB state | Root cause | Fix |
|---------|----------|-----------|-----|
| Stats show 0 everywhere | `game_sessions = 0` | iOS never pushed | Fix push layer (JWT, creator filter) |
| Stats show 0 for non-creators | `game_sessions > 0` for some | Creator-only SQL | Use participation SQL |
| Recent games missing, old ones present | Recent timestamp gap | JWT expired | Bump JWT TTL to 7d |
| Activity feed shows games, stats don't | `activity_events > 0`, `game_sessions = 0` | Confusing tables | These are different tables |
| Admin shows zeros, player-web shows zeros | `game_sessions > 0` | Wrong SQL in both | Check both queries for creator-only filter |
| Admin shows data, player-web shows zeros | `game_sessions > 0` | Privacy gate blocking | Check `is_public`, `privacy_tier` |

---

## Verification Commands

After deploying a fix to the push layer:

```bash
# Confirm game_sessions are accumulating:
psql $DATABASE_URL -c "
  SELECT COUNT(*), status FROM game_sessions GROUP BY status ORDER BY status;
"

# Confirm participation SQL returns correct count for a test player:
psql $DATABASE_URL -c "
  SELECT COUNT(*) FROM game_sessions gs
  WHERE
    gs.created_by_player_id = 'PLAYER_ID'
    OR gs.score_data->'team_a'->'playerIDs' @> to_jsonb('PLAYER_ID')
    OR gs.checked_in_player_ids @> ARRAY['PLAYER_ID']
    AND gs.affects_permanent_profile IS NOT FALSE
    AND gs.status = 'ended';
"

# Confirm public endpoint returns non-zero stats:
curl -s "https://api.readyplay.app/public/profile-stats/players/PLAYER_ID/summary" | jq '{completedGames, totalPoints}'
```
