# Diagnosis before fix — SSH to the DB first

When stats show zeros or data is "missing," SSH to the production database
and count the rows BEFORE writing any code. The two-minute diagnosis tells
you whether to fix the push layer or the read layer.

---

## The rule

**DB-first diagnosis is mandatory for any "zeros in stats" or "history
missing" report.**

```bash
# SSH to VPS
ssh user@vps

# Count rows in the relevant table
node -e "
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  pool.query('SELECT COUNT(*) FROM game_sessions').then(r => {
    console.log('game_sessions:', r.rows[0].count);
    process.exit(0);
  });
"

# Or with psql directly:
psql $DATABASE_URL -c "SELECT COUNT(*) FROM game_sessions;"
```

---

## The decision tree

```
COUNT(*) = 0?
├─ YES → Problem is at the PUSH layer (data never reached the DB)
│        Debug: iOS sync code, API endpoint, JWT expiry, creator filter
│        Do NOT touch the frontend or API read layer yet
└─ NO  → Problem is at the READ layer (data is in DB but not shown)
         Debug: serializer, SQL query, frontend API helper, component render
```

---

## Why this matters

All frontend and API read fixes are wasted work if the underlying table is
empty. Writing code to fix the serializer, the stats query, or the frontend
component — when zero rows exist in the DB — produces no observable change
and burns hours.

The failure mode:
1. Stats show zeros
2. Agent rewrites the stats API query
3. Agent updates the frontend API helper
4. Agent rewrites the component render logic
5. Stats still show zeros
6. Agent SSHes to DB — table has 0 rows
7. Steps 2–4 were wasted

One `COUNT(*)` query at the start collapses the entire decision tree.

---

## Tables to check for Red-E Play specifically

| Symptom | Table to COUNT |
|---------|---------------|
| Game history missing | `game_sessions` |
| Stats show zeros | `game_sessions`, `score_events` |
| Activity feed empty | `activity_events` |
| Leaderboard missing | `game_sessions` + `players.is_public` |
| Mini-game history missing | `mini_game_sessions` |
| Health data missing | `health_snapshots` |
| Achievements missing | `player_achievements` |

---

## First seen

Red-E Play game pipeline debugging, 2026-05-14. Three hours of frontend and
API fixes before discovering `game_sessions` had 0 rows. The root cause was
at the iOS push layer (JWT expiry + creator-only filter). A 2-minute DB check
at the start would have redirected all effort immediately.
