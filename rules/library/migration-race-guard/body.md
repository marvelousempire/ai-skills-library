# Migration number reservation — check at write time, not plan time

Migration numbers are first-come, first-served. There is no reservation
system. When you decide to use `0132` during planning and open a PR four
hours later, another session may have merged `0132` and `0133` in the
meantime. You discover the collision at deploy time when the migration
runner either errors or silently skips your file.

**The rule: check migration numbers at the moment you write the file, never
during planning.**

---

## The check (run it right before creating the .sql file)

```bash
ls backend/src/db/migrations/ | tail -5
```

Read the last filename. Your migration number is that number + 1.

For projects using the `next-feature-id.sh` pattern, also run:

```bash
bash scripts/either-host/next-feature-id.sh
```

Do not store these numbers in your plan doc, chat notes, or to-do list as
if they are reserved. They are not. Re-check immediately before `Write`.

---

## When planning a multi-migration PR

If your PR needs two migrations (e.g. `0132_schema.sql` + `0133_seed.sql`),
run the tail check, note the current last number, then **write both files
back-to-back in the same action** before any other work that might trigger
a rebase or context switch. Once both files exist on disk and are staged,
the numbers are yours for this branch.

---

## Collision recovery

If you discover a collision after the fact (your migration file has the
same number prefix as one already on main):

1. `ls backend/src/db/migrations/ | grep "^0132"` — confirm the collision.
2. Rename your file to the next available number.
3. Update any references inside the file (comments citing the migration
   number, seed migrations referencing the schema migration by name).
4. Re-stage the renamed file. Do NOT amend — create a new commit.

---

## Why planning-time numbers are always wrong

Planning → implementation typically spans minutes to hours. In an active
multi-agent monorepo, 3–5 PRs can merge in that window, each claiming
migration numbers. Even in a solo-developer repo, a hotfix branch may
land between your plan and your first commit.

The cost of a collision is: deploy failure, operator confusion, and a
follow-up PR just to rename a file. The cost of re-running `ls | tail -5`
is 2 seconds. There is no argument for planning-time reservation.
