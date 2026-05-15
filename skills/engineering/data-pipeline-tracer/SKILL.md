---
name: data-pipeline-tracer
description: "Trace end-to-end data flow to find where data is lost between the client and the UI. Use when the user asks: 'trace where data is lost,' 'why are stats zero,' 'iOS data not showing on web,' 'field not reaching the database,' 'trace the data flow,' 'player profile not updating,' 'data written on iOS but not visible on web,' 'sync looks like it worked but data is missing.' Walks through 8 sequential diagnostic steps to identify the exact gap — DB layer, push layer, API layer, serializer, public endpoint, frontend helper, component render, or cache. Returns a diagnosis with the exact broken link and the fix."
metadata:
  version: 1.0.0
---

# Data Pipeline Tracer

You are tracing a data pipeline to find the exact point where data is lost.
Data is written on one surface (usually iOS) and not visible on another
(usually web, admin, or player profile). Work through the 8 steps in order
and stop as soon as you find the gap.

---

## Step 1 — DB-first check (30 seconds)

SSH to the VPS and count rows in the relevant table:

```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM game_sessions;"
```

**If COUNT = 0:** the problem is at the PUSH layer. Data never reached the DB.
Skip to Step 2.

**If COUNT > 0:** the problem is at the READ layer. Data is in the DB but not
shown correctly. Skip to Step 4.

This single check eliminates half the possible root causes immediately.

---

## Step 2 — iOS push code

Find the sync function (search for `SyncService`, `pushGame`, `pushPending`).

Check all of the following:

- **Creator filter:** does the code filter by `createdByPlayerID == myID`?
  If yes, players who participated but didn't create the game will never push.
  Fix: remove the creator filter, push all participated games.
- **Error handling:** does the catch block mark the record as "pushed" even
  when the push failed? If yes, data is silently lost.
- **JWT TTL:** is `JWT_EXPIRES_IN` set to `1h` on the server? Mobile clients
  need ≥7d. Check: `grep JWT_EXPIRES_IN /opt/.../api/.env`
- **UserDefaults tracking:** search for `pushedCompletedGameSessionIDs`. If a
  game ID is in this set, it will never be retried regardless of success.

---

## Step 3 — API endpoint

Find the backend route (search for `router.post('/games')`).

Check:
- Is it behind `requireAuth`? Is the auth middleware applied correctly?
- Does it write `affects_permanent_profile = true` for final game records?
- Is there an approval gate (`approved_at IS NULL`) that blocks the record
  from appearing in public queries?
- Does it use `ON CONFLICT (id) DO UPDATE` (idempotent) or `INSERT` only
  (fails on retry)?

---

## Step 4 — Backend serializer

Find the `formatPlayer` / `rowToPublicProfile` function (search for
`formatPlayer` in `backend/src/routes/`).

Check: is every field the UI needs included in the serializer's return object?
Fields in the DB but absent from the serializer return `undefined` to the
frontend with no error.

Run a side-by-side: list all columns in `SELECT * FROM players LIMIT 1` and
compare to the serializer's return keys.

---

## Step 5 — Public endpoint

Find the public API route (search for `router.get('/public/profile-stats')`).

Check:
- What visibility gates exist? (`privacy_tier`, `is_public`, `discoverable`,
  `wellness_visibility`)
- Does the endpoint require player approval (`approved_at IS NOT NULL`)?
- Is the query using creator-only filtering instead of participation filtering?

---

## Step 6 — Frontend API helper

Find the TypeScript function that calls the public endpoint (search for the
fetch URL path).

Check:
- Is the field in the TypeScript return type interface?
- Is it mapped from snake_case to camelCase? (e.g. `affects_permanent_profile`
  → `affectsPermanentProfile`)
- Is there a null-coalescing that masks the real value with a default?

---

## Step 7 — Component render

Find the component that should display the data.

Check:
- Is the field actually rendered in JSX?
- Is there a null guard (`{value ?? null}` or `{value && <span>}`) that hides
  it when null?
- Is the field name correct (camelCase, not snake_case in the frontend)?
- Is the formatter correct? (e.g. `formatHeight(69)` not `${69}"`)

---

## Step 8 — Cache layer

Check for stale cache hiding freshly written data.

Search for:
- `next: { revalidate: N }` in fetch calls — is N too large?
- `cache()` calls in server components — is the cache keyed by player ID?
- `unstable_cache` or `React.cache` usage
- CDN or edge cache headers on the API response

To bypass cache and verify live data:
```bash
curl -H "Cache-Control: no-cache" https://api.example.com/public/profile-stats/players/PLAYER_ID/summary
```

---

## Output format

After working through the steps, report:

```
ROOT CAUSE: Step N — [description of the gap]
FIX: [one-sentence fix]
EVIDENCE: [the exact line of code or query that proves the gap]
ADDITIONAL GAPS: [any other issues found along the way, ranked by impact]
```

---

## Related rules

- `diagnosis-before-fix` — always SSH to DB first
- `all-participants-push-data` — remove creator-only filters
- `mobile-jwt-ttl` — access tokens must be ≥7d for mobile
- `stats-query-participation-not-creator` — participation SQL pattern
- `activity-events-not-game-records` — don't confuse feed signals with records
- `shared-util-extraction` — formatters belong in lib/
