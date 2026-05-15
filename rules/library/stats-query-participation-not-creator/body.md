# Stats query — participation check, not creator check

Any SQL query counting "games played by a player" must use full participation
logic. A query using only `created_by_player_id = $1` silently undercounts
every player who participated in games they didn't create.

---

## The rule

Stats queries that count a player's games must check ALL of these conditions:

```sql
WHERE
  -- was the player the scorekeeper?
  gs.created_by_player_id = $1

  -- was the player in team A (any JSON key variant)?
  OR gs.score_data->'team_a'->'playerIDs' @> to_jsonb($1::text)
  OR gs.score_data->'team_a'->'playerIds' @> to_jsonb($1::text)
  OR gs.score_data->'team_a'->'player_ids' @> to_jsonb($1::text)

  -- was the player in team B?
  OR gs.score_data->'team_b'->'playerIDs' @> to_jsonb($1::text)
  OR gs.score_data->'team_b'->'playerIds' @> to_jsonb($1::text)
  OR gs.score_data->'team_b'->'player_ids' @> to_jsonb($1::text)

  -- was the player checked in?
  OR gs.checked_in_player_ids @> ARRAY[$1]

  -- did the player score any points?
  OR EXISTS (
    SELECT 1 FROM score_events se
    WHERE se.game_session_id = gs.id
      AND se.scorer_player_id = $1
  )
```

The JSON key variant issue (`playerIDs` vs `playerIds` vs `player_ids`)
exists because the iOS client has used all three casing styles across app
versions. Any query that checks only one variant undercounts.

---

## The failure mode

A query using only `created_by_player_id = $1` shows:

- **0 games** for any player who was NOT the scorekeeper
- **Partial counts** for scorekeepers who also participated in games they
  didn't create

The user sees zeros in their stats dashboard. The operator sees zeros in the
admin player detail. No error is thrown — the query succeeds with an empty
result set.

---

## Verify before shipping any stats query

```bash
# Spot-check: count games for a known player by all participation conditions
# Expected: same number as the full participation query
psql $DATABASE_URL -c "
SELECT
  SUM(CASE WHEN created_by_player_id = 'PLAYER_ID' THEN 1 ELSE 0 END) AS as_creator,
  SUM(CASE WHEN checked_in_player_ids @> ARRAY['PLAYER_ID'] THEN 1 ELSE 0 END) AS as_checked_in,
  COUNT(*) AS total_participating
FROM game_sessions gs
WHERE ...full participation SQL...
"
```

If `as_creator < total_participating`, the player participated in games they
didn't create — and any creator-only query would have missed them.

---

## First seen

Red-E Play profile stats query, 2026-05-14. Stats showed zeros for players
who didn't create their own games. Fixed by expanding the WHERE clause to the
full 9-condition participation check.
