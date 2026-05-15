# Red-E Play Admin Panel Architecture

**For:** any agent working on `admin/` in the `red-e-play-app` monorepo.  
**Last updated:** 2026-05-14  
**Version bump:** `admin/package.json` on every change that touches the admin surface.

---

## The Dual-List Nav Pattern (Most Important)

The admin panel has **two separate navigation registries** that must stay in sync:

| File | Drives | Must update when |
|------|--------|-----------------|
| `admin/lib/admin-nav.ts` | Search, breadcrumbs, mobile "more" overlay | Adding any new route |
| `admin/components/layout/sidebar.tsx` | Sidebar navigation links | Adding any new route |

**This is a known antipattern.** Both files must be updated atomically. Missing either one causes:
- If missing from `admin-nav.ts`: no breadcrumbs, no search result for the page
- If missing from `sidebar.tsx`: page is only reachable by direct URL or search — invisible to operators

**Detection command:**
```bash
grep -oE "href: '[^']+'" admin/lib/admin-nav.ts | sed "s/href: '//;s/'//" | sort > /tmp/nav-config.txt
grep -oE 'href="[^"]+"' admin/components/layout/sidebar.tsx | sed 's/href="//;s/"//' | sort > /tmp/nav-sidebar.txt
comm -23 /tmp/nav-config.txt /tmp/nav-sidebar.txt  # in config but not sidebar
comm -13 /tmp/nav-config.txt /tmp/nav-sidebar.txt  # in sidebar but not config
```

**Long-term fix:** convert the sidebar to read from `admin-nav.ts` (dynamic rendering). Until then, always update both.

**Incident:** 2026-05-14 — Partnerships, Creator Applications, Find, Invitations, Leaderboard, Roadmap, Changelog, and Emails routes were in `admin-nav.ts` but missing from `sidebar.tsx`. Required 3 separate PRs to discover and fix.

---

## Admin Route Structure

```
admin/
  app/
    (dashboard)/
      players/
        [id]/
          page.tsx              ← player detail
          measurables/page.tsx  ← height, weight, wingspan
          activity/page.tsx     ← recent activity events
          wellness/page.tsx     ← WHOOP + health data
      partnerships/
        page.tsx
      creator-applications/
        page.tsx
      [feature]/
        page.tsx
  components/
    layout/
      sidebar.tsx               ← HARDCODED nav list (update when adding routes)
      more-hood-overlay.tsx     ← mobile nav (update when adding routes)
    players/
      player-stats-section.tsx  ← stats summary widget
      completed-games-section.tsx ← clickable game history
      GameDetailSheet.tsx       ← right-side drawer (50% width, 3 tabs)
  lib/
    admin-nav.ts                ← nav config (update when adding routes)
    api.ts                      ← all admin API helpers
    types.ts                    ← TypeScript interfaces
```

---

## The Admin Player Serializer (`formatPlayer`)

Lives in: `backend/src/routes/admin.js`

The `formatPlayer(row)` function is the single serializer for admin player data.
It bypasses all player privacy gates — admin always sees everything.

Key fields returned (as of 2026-05-14):
- Identity: `id`, `appleUserId`, `displayName`, `email`, `phone`, `createdAt`
- Profile: `bio`, `isGuest`, `isPublic`, `discoverable`, `approvedAt`
- Physical: `heightInches` (raw — format with `formatHeight()` before display), `weightLbs`, `wingspanInches`
- Location: `city`, `state`, `country`, `latitude`, `longitude`
- Social: `instagramHandle`, `twitterHandle`, `tiktokHandle`
- Wellness: `hasConnectedWhoop`, `privacyTier`, `wellnessVisibility`
- System: `updatedAt`, `lastActiveAt`

**Important:** `heightInches` must be formatted as `5′9″` (never `69"` or `69`). Use `formatHeight(player.heightInches)` from `admin/lib/format-measurements.ts`.

---

## Admin API Helpers Pattern

All admin API calls go through `admin/lib/api.ts`. Pattern:

```ts
// admin/lib/api.ts
export async function getPlayerStatsSummary(playerId: string) {
  return fetchJSON<PlayerStatsSummary>(`/admin/players/${playerId}/stats-summary`);
}

export async function getPlayerGames(playerId: string) {
  return fetchJSON<GameSession[]>(`/admin/players/${playerId}/games`);
}

export async function getPlayerWellness(playerId: string) {
  return fetchJSON<PlayerWellness>(`/admin/players/${playerId}/wellness`);
}
```

Each helper:
- Uses `fetchJSON` (consistent error handling, auth headers)
- Has a matching TypeScript interface in `admin/lib/types.ts`
- Maps snake_case API response to camelCase TypeScript fields

---

## Admin vs Public Endpoint Distinction

Admin endpoints bypass player privacy gates that protect public endpoints.

| Endpoint prefix | Auth | Privacy gate |
|----------------|------|-------------|
| `GET /admin/players/:id/...` | `requireAdmin` | None — sees everything |
| `GET /public/profile-stats/players/:id/...` | None | `is_public`, `privacy_tier`, `wellness_visibility` |

When adding data to the admin player page:
1. Add a new `GET /admin/players/:id/[feature]` endpoint in `backend/src/routes/admin.js`
2. The endpoint uses admin auth, not player auth — no privacy gate check needed
3. Add the matching helper in `admin/lib/api.ts`
4. Use the helper in the page component

---

## Measurement Display Rule

**Never display raw numeric measurements.** Always format before rendering.

| Field | Raw | Formatted | Formatter |
|-------|-----|-----------|-----------|
| `heightInches` | `69` | `5′9″` | `formatHeight(inches)` |
| `weightLbs` | `185` | `185 lbs` | `formatWeight(lbs)` |
| `wingspanInches` | `72` | `6′0″` | `formatHeight(inches)` |
| workout duration | `3600` | `60 min` | `formatDuration(seconds)` |
| heart rate | `65` | `65 bpm` | `formatHeartRate(bpm)` |

Formatters live in `admin/lib/format-measurements.ts`.

---

## Key Admin Sections (sidebar.tsx sections)

| Section | Routes (examples) |
|---------|------------------|
| People | `/players`, `/partnerships`, `/creator-applications` |
| Play | `/games`, `/leaderboard`, `/invitations`, `/find` |
| Economy | `/subscriptions`, `/credits` |
| Editorial & AI | `/emails`, `/changelog`, `/roadmap` |
| Documentation | `/docs` |
| System | `/settings`, `/agents` |

---

## Components Added 2026-05-14

### `player-stats-section.tsx`
Shows the stats summary block on the admin player detail page.
- Calls `getPlayerStatsSummary(playerId)` from `admin/lib/api.ts`
- Backend: `GET /admin/players/:id/stats-summary`
- Uses the 9-condition participation SQL (not creator-only)

### `completed-games-section.tsx`
Shows the list of completed games with clickable rows.
- Calls `getPlayerGames(playerId)` from `admin/lib/api.ts`
- Backend: `GET /admin/players/:id/games`
- Clicking a row opens `GameDetailSheet`

### `GameDetailSheet.tsx`
A 50%-width right-side drawer panel for game details.
- 3 tabs: Scoreboard, Play-by-play, Shot chart
- Closes by clicking outside or pressing Escape
- Lives at `admin/components/players/GameDetailSheet.tsx`

---

## Stats SQL — Participation Not Creator

Any query counting games for a player must use the full participation check.
**Never use `created_by_player_id = $1` alone** — this only counts games the
player created, not games they participated in.

Full participation check:
```sql
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

See `backend/src/routes/public-profile-stats.js` for the canonical `PLAYER_GAME_MATCH_SQL` constant.

---

## Version Bumps

Every PR that changes the admin surface bumps `admin/package.json` version:
- Patch: bug fixes, wiring corrections, display fixes
- Minor: new pages, new sections, new features
- Major: architectural changes

Backend changes also bump `backend/package.json` when routes are added/modified.
