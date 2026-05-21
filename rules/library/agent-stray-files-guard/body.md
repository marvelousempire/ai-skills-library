---
name: agent-stray-files-guard
id: RL-0003
hash: 911401b
keywords: [enforce-agent, check-stray, build-files]
relations: []
before: []
governed_by: [global]
meta: dynamic
goal: Deliver agent stray files guard output correctly and completely.
---

# Agent stray files guard — verify the diff before merging any agent PR

When spawning an agent (with isolation: worktree or otherwise), the agent
may pick up stale uncommitted files from the main checkout or from other
worktrees and include them in its commits. Always verify the diff before
merging any agent-created PR.

---

## The failure mode

An agent was spawned to make targeted admin dashboard changes. It committed:

- `admin/app/(dashboard)/players/[id]/page.tsx` (intended)
- `admin/lib/admin-nav.ts` (intended)
- `admin/components/layout/sidebar.tsx` (intended)
- `marketing/lib/marketing-public-nav.ts` (STRAY — unrelated marketing file)
- `marketing/package.json` (STRAY — unrelated version bump)
- `backend/src/db/migrations/0131_unrelated_feature.sql` (STRAY — unrelated migration)
- `backend/src/db/migrations/0132_another_feature.sql` (STRAY — another unrelated migration)

The stray files were already sitting in the working tree when the agent ran
`git add`. The agent added everything staged or modified, including files it
never touched.

---

## The rule

**Before merging any agent-created PR, run:**

```bash
git diff --stat origin/main..HEAD
# or
git diff --name-only origin/main..HEAD
```

For every file in the diff, ask: "Did this agent's task require touching
this file?" If no, strip it before merging.

---

## How to strip stray files from an agent commit

```bash
# Unstage a file that shouldn't be in this PR
git reset HEAD~1 -- marketing/lib/marketing-public-nav.ts
git checkout -- marketing/lib/marketing-public-nav.ts

# Or, for a squash commit, cherry-pick only the right files:
git diff origin/main..HEAD -- admin/ > /tmp/admin-only.patch
git checkout origin/main
git apply /tmp/admin-only.patch
git add admin/
git commit -m "feat(admin): targeted changes only"
```

---

## Prevention

Configure agent isolation to pre-stage only the relevant directory:

```json
{
  "isolation": "worktree",
  "allowedPaths": ["admin/", "backend/src/routes/admin.js"]
}
```

Or use a pre-commit hook that lists modified files and requires confirmation
for any file outside the declared task scope.

---

## CI guard

Add a check to PR description or CI workflow:

```bash
# Fail if any file outside admin/ is in an admin-only PR
git diff --name-only origin/main..HEAD | grep -v '^admin/' && {
  echo "ERROR: Files outside admin/ found in admin-only PR"
  exit 1
}
```

---

## First seen

Red-E Play, 2026-05-14. An admin-dashboard agent committed two unrelated
migration files and a marketing file alongside its intended admin changes.
Discovered during diff review before merge. Stripped manually before merging.
