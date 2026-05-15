# Session Retrospective — Red-E Play Admin & Game Pipeline
**Date:** 2026-05-14  
**Branch:** `session-retrospective-2026-05-14`  
**Repo:** `marvelousempire/ai-skills-library`

---

## What Was Worked On

A full-day session on the Red-E Play monorepo covering:

1. Disk space remediation (99% disk, 4+ GB in stale worktrees)
2. Migration number collision fix (PR #811 `0159` collision)
3. Admin sidebar dual-list gap — 9 routes missing from `sidebar.tsx`
4. Admin player page measurement display bug (`69"` instead of `5′9″`)
5. Admin stats query zeros — wrong SQL (`created_by_player_id` only)
6. Admin `/activity` route 500 — page file didn't exist
7. Admin game detail drawer — `GameDetailSheet.tsx` built from scratch
8. Admin wellness section — WHOOP + health data wired to admin player page
9. Game data pipeline deep investigation — `game_sessions = 0 rows` in production
10. Stray files in agent PR — marketing file + 2 migration files in admin-only PR
11. CHANGELOG conflict during rebase — HEAD-wins script dropped new entry
12. CI not triggering after force-push — resolved with `--allow-empty` commit

---

## All Artifacts Filed

### Rules (8 new)

| Rule | Path | Key lesson |
|------|------|-----------|
| `sidebar-nav-dual-list` | `rules/library/sidebar-nav-dual-list/body.md` | Two nav registries must stay in sync; update both atomically |
| `format-measurements-for-display` | `rules/library/format-measurements-for-display/body.md` | Never display raw inches/seconds/bpm; always format |
| `mobile-jwt-ttl` | `rules/library/mobile-jwt-ttl/body.md` | Access tokens for mobile must be ≥7d; 1h causes silent data loss |
| `stats-query-participation-not-creator` | `rules/library/stats-query-participation-not-creator/body.md` | 9-condition participation SQL, never `created_by_player_id` alone |
| `all-participants-push-data` | `rules/library/all-participants-push-data/body.md` | Idempotent upsert enables any participant to push; remove creator filter |
| `rebase-changelog-keep-both-sides` | `rules/library/rebase-changelog-keep-both-sides/body.md` | CHANGELOG conflicts must keep both sides; HEAD-wins drops new entries |
| `agent-stray-files-guard` | `rules/library/agent-stray-files-guard/body.md` | Always `git diff --name-only origin/main..HEAD` before merging agent PR |
| `diagnosis-before-fix` | `rules/library/diagnosis-before-fix/body.md` | SSH to DB and COUNT rows before writing any code |

### Skills (5 new + 1 updated)

| Skill | Path | Use when |
|-------|------|---------|
| `data-pipeline-tracer` | `skills/engineering/data-pipeline-tracer/SKILL.md` | Tracing end-to-end data loss; stats zeros; iOS data not showing on web |
| `admin-completeness-audit` | `skills/engineering/admin-completeness-audit/SKILL.md` | Auditing new admin page wiring across all layers |
| `disk-hygiene` | `skills/engineering/disk-hygiene/SKILL.md` | Clearing stale worktree node_modules; disk at 85%+ |
| `migration-collision-recovery` | `skills/engineering/migration-collision-recovery/SKILL.md` | Fixing duplicate migration prefix caught by CI |
| `diagnosis-report` | `skills/engineering/diagnosis-report/SKILL.md` | Writing structured diagnosis docs after SSH investigation |
| `session-retrospective` (updated) | `skills/engineering/session-retrospective/SKILL.md` | Added context file category; added checklist items |

### Context Files (2 new)

| File | Purpose |
|------|---------|
| `context/readyplay-admin-architecture.md` | Admin dual-nav, formatPlayer serializer, route structure, measurement display, stats SQL |
| `context/readyplay-game-data-pipeline.md` | Full game sync flow, JWT TTL, participation SQL, activity_events vs game_sessions |

---

## The 4 Recurring Failure Patterns

### 1. "Said to Have Shipped But Not Wired"
Features were implemented in the backend but not connected to the UI (sidebar, admin page, API helper). Occurred at least 4 times in one session:
- Routes in `admin-nav.ts` but not `sidebar.tsx`
- `/activity` route in the nav but no page file
- Game drawer linked but component not built
- Wellness data available but section not rendered

**Detection:** always run `admin-completeness-audit` before declaring an admin feature done.

### 2. Stats Showing Zeros From Wrong SQL
Two separate surfaces (admin stats-summary, public profile stats) both showed zeros for real players because the SQL used `created_by_player_id = $1` instead of the full 9-condition participation check.

**Detection:** `grep -rn "created_by_player_id" backend/src/routes/ | grep -i "count\|stats\|games"` — any hit is a potential bug.

### 3. Data Never Reaching the DB
"Stats zeros" was assumed to be a read-layer problem (serializer, SQL, frontend). It was actually a push-layer problem — the table was literally empty. The investigation wasted time on read-layer fixes before SSH revealed `COUNT(*) = 0`.

**Detection:** SSH → `psql $DATABASE_URL -c "SELECT COUNT(*) FROM game_sessions;"` — do this FIRST, not last.

### 4. Parallel Agent Stray Files
Spawned agents committed files they didn't modify because `git add` picked up stale uncommitted changes from the main worktree. Required soft reset and explicit re-staging.

**Detection:** `git diff --name-only origin/main..HEAD` before merging any agent PR.

---

## The DB-First Diagnosis Methodology

Any "zeros in stats" or "data not showing" investigation must start here:

```bash
# 1. SSH to production VPS
ssh user@vps

# 2. Count rows in relevant table
psql $DATABASE_URL -c "SELECT COUNT(*) FROM game_sessions;"

# 3. Decision tree:
#    COUNT = 0 → problem is at PUSH LAYER (iOS sync, JWT, creator filter)
#    COUNT > 0 → problem is at READ LAYER (SQL, serializer, frontend)
```

One 2-minute check eliminates half the possible root causes. Every minute spent fixing the read layer when the push layer is broken is wasted.

---

## The 3 Most Important Rules Added

1. **`diagnosis-before-fix`** — The highest-ROI rule. One DB query before writing any code eliminates the single most common debugging anti-pattern in this codebase: fixing the read layer when the push layer is broken.

2. **`stats-query-participation-not-creator`** — Directly prevents the most common stats-zeros bug. Any query counting a player's games that uses `created_by_player_id` alone is silently wrong for every player who didn't create their own games.

3. **`mobile-jwt-ttl`** — Silent data loss with no user-visible error. A 1-hour JWT on a mobile sync client is invisible at development time and catastrophic at production scale.

---

## Open Items (Not Yet Filed)

The following were observed during the session but not fully resolved or filed:

1. **`game_sessions` still has 0 rows** — the iOS fix was merged but no games have been played through the new code path yet. Verification pending first real game sync.

2. **`pushedCompletedGameSessionIDs` fragility** — if the API returns 200 but the data doesn't write (e.g. constraint violation), the game ID may be added to UserDefaults as "pushed" and never retried. Needs error-path review.

3. **Admin sidebar → dynamic rendering** — the long-term fix for the dual-list antipattern is to make `sidebar.tsx` read from `admin-nav.ts`. Not implemented; both files still manually maintained.

4. **CI guard for sidebar vs nav-config drift** — no automated check exists. Any new route added to one file but not the other will silently pass CI. A `scripts/check-admin-nav-sync.sh` script would prevent recurrence.

5. **`activity_events` vs `game_sessions` confusion** — the two tables serve different purposes but look similar in the admin feed. A clear UI distinction (different icons, different section headers) would prevent operator confusion.

---

## Related Pain Journal Entries

The following patterns from this session map to existing Pain Journal entries in `CLAUDE.md`:

- **Migration-2** — Duplicate migration prefix from parallel sessions
- **Git-2** — Cherry-pick conflict resolution creates unclosed `if` blocks
- **Web-4** — Rsync without `--delete-after` leaves orphan files
- **Worktree-1** — Cross-worktree edit clobbering (agent stray files variant)
