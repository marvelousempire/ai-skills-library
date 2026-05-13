---
name: save-plan
description: >
  Save the current session's plan to docs/Plan-<Name>.md and verify admin
  ledger alignment. Use after shipping any new plan (new row in the plans
  table). Ensures every plan has a committed plan doc in Git so future
  sessions can find it. Also explains how admin visibility works automatically.
trigger: >
  Use when the user asks to "save the plan", "write up the plan", "add plan
  to Git", "document this plan", or at the end of any session that registered
  a new plan slug via a seed migration. Also fires at the end of the
  post-ship gap-audit pass when a new plan was introduced.
---

# /save-plan — persist plan docs to Git

## What this skill does

1. Writes (or updates) `docs/Plan-<Name>.md` with the full context of what
   was planned and shipped in this session.
2. Verifies the DB migration exists (`0NNN_seed_<plan-id>_plan.sql`).
3. Commits the doc to the current branch.
4. Explains that the admin dashboard reads plans from the DB automatically —
   no manual admin UI step is ever needed.

## How to invoke

```
/save-plan                  # infers plan from session context
/save-plan player-safety    # explicit plan slug
```

---

## Step-by-step instructions

### Step 1 — Identify the plan

From conversation context extract:
- **Plan slug** — the `id` in the `plans` table (e.g. `player-safety`)
- **Plan name** — human title (e.g. "Player Safety")
- **Feature IDs** — feature numbers linked to this plan
- **What shipped** — surfaces, migrations, PR number, version bumps
- **What was deferred** — gaps from post-ship audit

### Step 2 — Check if doc already exists

```bash
ls docs/Plan-*.md | grep -i "<name>"
```

### Step 3 — Verify seed migration exists

```bash
ls backend/src/db/migrations/*seed*<slug>* 2>/dev/null
```

Note if missing — still write the doc.

### Step 4 — Write `docs/Plan-<Name>.md`

Use this template. Fill every section from conversation context.

```markdown
# Plan — <Human Title>

**Plan id (admin):** `<slug>`
**Companion ledger:** feature(s) **NNN[–NNN]** (migration `NNNN_seed_<slug>.sql`)
**DB migration (schema):** `NNNN_<description>.sql`
**Status:** active | complete | paused
**Last updated:** YYYY-MM-DD
**Owner:** claude:<branch-name>

---

## Problem statement

<Why this was needed — 3–5 sentences.>

---

## What shipped (PR #NNN — <version string>)

### Feature NNN — <feature name> (section: <admin section>)

| Surface | What's there |
|---------|-------------|
| iOS     | ... |
| Admin   | ... |
| Backend | ... |
| DB      | ... |
| Ledger  | ... |

<Privacy rules if data is sensitive.>

---

## Secure Data Flow Protocol checklist (include when touching user/profile/stats data)

1. ✅/❌ Postgres columns
2. ✅/❌ Backend write allowlist
3. ✅/❌ Backend read serializers (rowToPlayer, formatPlayer, rowToPublicProfile)
4. ✅/❌ Admin renders
5. ✅/❌ Public profile exclusion (private fields absent from rowToPublicProfile)
6. ✅/❌ iOS save awaited (server response applied to store)
7. ✅/❌ No local-only store, or SyncService drain exists
8. ✅/❌ Audit log (recordAudit called)

---

## Key files

| File | Role |
|------|------|
| `backend/src/db/migrations/...` | ... |

---

## Gaps (surfaced post-ship — not yet built)

<Numbered list from post-ship gap-audit. One sentence what + one sentence why.>

---

## Admin visibility

Plans appear automatically at `/plans` in the admin dashboard once the seed
migration runs on production. No manual admin UI step needed — the admin
reads from the `plans` Postgres table. Features appear at `/features` the
same way.

**To go live:** run migration(s) on prod DB, deploy backend [+ admin if admin
files changed].
```

### Step 5 — Commit and push

```bash
git add docs/Plan-<Name>.md
git commit -m "docs: Plan-<Name>.md companion doc for plan <slug>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin HEAD
```

### Step 6 — Report to user

Tell the user:
- The doc path: `docs/Plan-<Name>.md`
- That admin will show the plan at `/plans` automatically once the migration runs
- The PR or commit where it was added

---

## Admin visibility (full explanation)

The admin `/plans` page at `admin.readyplay.app/plans` reads directly from
the `plans` Postgres table via `GET /admin/plans`. Once the seed migration
inserts the row, the plan is visible there. The same applies to `/features`
for the `features` table.

**The only artifact that requires a committed file in Git** is this
`docs/Plan-*.md` markdown companion. Everything else (plan row, feature rows,
surfaces, plan_features links) lives in the DB via migrations.

---

## Reference example

`docs/Plan-Player-Safety.md` — first plan doc built with this system
(2026-05-13, PR #703). Use it as a style reference.
