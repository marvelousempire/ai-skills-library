---
name: migration-collision-recovery
keywords: [run-migration, check-collision, build-recovery]
hash: fff99ab
relations: []
before: []
governed_by: [global]
meta: dynamic
goal: Deliver migration collision recovery output correctly and completely.
description: "Recover from a database migration number collision — two migration files sharing the same numeric prefix. Use when: 'migration number collision,' 'duplicate migration prefix,' 'guard check failed on migration,' 'CI is failing on migration uniqueness check,' 'two migrations with the same number,' 'migration file conflict,' 'next-migration-number gave me a number that's already taken.' Also use proactively whenever you discover a collision during a rebase or PR review. Returns renamed files, updated references, and a clean commit."
metadata:
  version: 1.0.0
---

# Migration Collision Recovery

You are recovering from a situation where two migration files share the same
numeric prefix (e.g. two files both starting with `0130_`). This happens when
parallel agent sessions each pick the same "next" migration number without
accounting for in-flight PRs.

---

## Step 1 — Confirm the collision

```bash
ls backend/src/db/migrations/*.sql \
  | xargs -n 1 basename \
  | grep -oE '^[0-9]{4}' \
  | sort | uniq -d
# → prints every prefix that appears more than once
```

List the colliding files:

```bash
ls backend/src/db/migrations/ | grep "^0NNN"
# where 0NNN is the colliding prefix
```

---

## Step 2 — Get the next free prefix

```bash
bash scripts/either-host/next-migration-number.sh
# → prints the next available prefix (e.g. 0134)
```

If the script doesn't exist in this repo:

```bash
ls backend/src/db/migrations/ | tail -3
# Take the largest prefix + 1
```

**Do not reuse the colliding prefix.** Find the true next-available number.

---

## Step 3 — Determine which file to rename

Rules for which file gets renamed (gets the new number):

1. **If one file is on main and one is on your branch**: rename the one on
   your branch. Never rename files already merged to main.
2. **If both files are on your branch**: rename the later one (the one added
   most recently, i.e. the one that was written second).
3. **If both files are on main** (historical collision): leave them. Renaming
   a file after it's been applied to production creates an orphan in the
   `_migrations` tracking table. Document in `docs/Migration-Numbering.md`
   instead.

---

## Step 4 — Rename and update references

```bash
# Rename the file:
git mv backend/src/db/migrations/0130_old_name.sql \
       backend/src/db/migrations/0134_old_name.sql

# Update any internal references inside the file:
# (Comments citing the migration number, seed migrations referencing
# the schema migration by file name)
grep -n "0130" backend/src/db/migrations/0134_old_name.sql
# If any matches: update them to 0134
```

Check if any other migration file references the old filename:

```bash
grep -rn "0130_old_name" backend/src/db/migrations/
```

If found, update those references too.

---

## Step 5 — If this PR has multiple migrations that collide

If your PR needs two migrations (`0130_schema.sql` + `0131_seed.sql`) and
`0130` is already taken, both must be renumbered:

```bash
bash scripts/either-host/next-migration-number.sh  # e.g. 0134
git mv backend/src/db/migrations/0130_schema.sql backend/src/db/migrations/0134_schema.sql
git mv backend/src/db/migrations/0131_seed.sql backend/src/db/migrations/0135_seed.sql
```

Update any cross-references between the two files (seed referencing schema
by filename or comment).

---

## Step 6 — Commit and verify

```bash
# Stage the renames:
git add backend/src/db/migrations/

# Do NOT amend — create a new commit:
git commit -m "fix(migrations): rename to resolve prefix collision (0130 → 0134)"

# Verify CI will pass:
ls backend/src/db/migrations/ \
  | xargs -n 1 basename \
  | grep -oE '^[0-9]{4}' \
  | sort | uniq -d
# → empty output = clean
```

Push and confirm the migration uniqueness CI check passes.

---

## Prevention

The collision only happens when migration numbers are chosen at plan time
rather than at file-write time. The rule:

**Run `bash scripts/either-host/next-migration-number.sh` immediately before
writing the migration file, in the same action. Never plan a migration number
hours in advance.**

---

## Related rules

- `migration-race-guard` — the rule that prevents this situation
- Migration-2 Pain Journal entry in CLAUDE.md
