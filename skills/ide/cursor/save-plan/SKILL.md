---
name: save-plan
description: >
  Save the current session's plan to docs/Plan-<Name>.md and verify ledger
  alignment. Use after shipping any new plan. Ensures every plan has a
  committed doc in Git so future sessions can find it.
trigger: >
  Use when the user asks to "save the plan", "write up the plan", "add plan
  to Git", "document this plan", or at the end of any session that registered
  a new plan slug. Also fires at the end of the post-ship gap-audit pass when
  a new plan was introduced.
---

# /save-plan — persist plan docs to Git

## What this skill does

1. Writes (or updates) `docs/Plan-<Name>.md` with the full context of what
   was planned and shipped in this session.
2. Verifies the seed migration or equivalent registration artifact exists.
3. Commits the doc to the current branch.
4. Explains how the admin/dashboard surfaces the plan automatically from the
   DB — no manual UI step needed.

## How to invoke

```
/save-plan                  # infers plan name from session context
/save-plan player-safety    # explicit plan slug
```

---

## Step-by-step instructions

### Step 1 — Identify the plan

From conversation context extract:
- **Plan slug** — the canonical identifier (e.g. `player-safety`)
- **Plan name** — human title (e.g. "Player Safety")
- **Feature IDs** — any feature numbers linked to this plan
- **What shipped** — surfaces touched, migrations run, PR number, version bumps
- **What was deferred** — gaps surfaced in the post-ship audit

### Step 2 — Check if doc already exists

```bash
ls docs/Plan-*.md 2>/dev/null | grep -i "<name>"
```

### Step 3 — Verify the registration artifact exists

For projects with a DB-backed feature ledger:
```bash
ls backend/src/db/migrations/*seed*<slug>* 2>/dev/null
```
For other projects, check whatever registers the plan (config file, registry, etc.).
Note if missing — still write the doc, flag the gap.

### Step 4 — Write `docs/Plan-<Name>.md`

Use this template. Fill every section from conversation context.

```markdown
# Plan — <Human Title>

**Plan id:** `<slug>`
**Companion ledger:** feature(s) **NNN[–NNN]** (migration/registration `NNNN_seed_<slug>`)
**Status:** active | complete | paused
**Last updated:** YYYY-MM-DD
**Owner:** claude:<branch-name>

---

## Problem statement

<Why this was needed — 3–5 sentences.>

---

## What shipped (PR #NNN — <version string>)

### Feature NNN — <feature name>

| Surface | What's there |
|---------|-------------|
| ...     | ... |

<Privacy / security notes if any data is sensitive.>

---

## Checklist (adapt to your project's protocol)

1. ✅/❌ Schema / data store change
2. ✅/❌ Write path accepts and validates the new fields
3. ✅/❌ Read path returns the new fields
4. ✅/❌ Admin / dashboard renders
5. ✅/❌ Public surfaces exclude any private fields
6. ✅/❌ Client save is awaited and server response applied
7. ✅/❌ No local-only store left un-drained
8. ✅/❌ Audit log entry created

---

## Key files

| File | Role |
|------|------|
| ... | ... |

---

## Gaps (surfaced post-ship — not yet built)

<Numbered list from post-ship gap-audit. One sentence what + one sentence why.>

---

## Dashboard / admin visibility

<Explain how the plan appears in the project's admin surface — automatic from
DB, manual step needed, or N/A. Be specific so the next session doesn't have
to ask.>

**To go live:** <migration steps + deploy surfaces needed>
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
- How the plan surfaces in their admin/dashboard (automatic or manual step)
- The PR or commit where it was added
