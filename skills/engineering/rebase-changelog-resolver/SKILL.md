---
name: rebase-changelog-resolver
id: SK-0037
keywords: [rebase-branch, resolve-conflict, update-changelog]
hash: dd1afce
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  Auto-resolve CHANGELOG.md merge conflicts during rebase by keeping both entries with newest-first ordering. Pattern is mechanical — every PR adds an entry at the top, so every rebase produces the same shape of conflict. Tested 3 times in the trainer-marketplace session.
trigger: >-
  Use when `git rebase` stops with a conflict in `CHANGELOG.md` (or any "newest-first additive" file like `docs/CHANGELOG.md`, `docs/Feature Ledger.md` change-log sections). Auto-detects the pattern and resolves without manual editing.
---

# /rebase-changelog-resolver

## What this skill does

CHANGELOG.md conflicts during rebase always have the same shape:
- `<<<<<<< HEAD` — the incoming entry from origin/main
- `=======` — separator
- `>>>>>>> <your-sha>` — your local entry

Resolution is mechanical: **keep both entries, newest-first by the Eastern timestamp**.

```diff
-<<<<<<< HEAD
 ## [0.18.2 admin] — 2026-05-14 11:27:15 Eastern · ...     <- incoming, newer
 > <details>
-=======
+
 ## [docs] — 2026-05-14 10:47:21 Eastern · ...             <- yours, older
 > <details>
-<<<<<<<<< <sha>
```

## How to invoke

```
/rebase-changelog-resolver
```

The skill:
1. Greps for `<<<<<<<`, `=======`, `>>>>>>>` markers
2. Parses both entries
3. Compares timestamps (extracts the `YYYY-MM-DD HH:MM:SS Eastern` line)
4. Orders newest-first
5. Writes the resolved file
6. `git add` + `git rebase --continue`

## Anti-pattern: dropping one entry

Don't pick one side and drop the other. Both PRs shipped real work that deserves an entry. The merge is **additive**, not a choice.

## When the auto-resolution doesn't fit

- If the conflict isn't a fresh-entry addition at the top, hand-resolve.
- If both PRs touched the same existing entry, hand-resolve.

## Origin

Trainer-marketplace session: 3 separate CHANGELOG conflicts, all the same shape, all resolved by keeping both newest-first. Documented in `docs/pain-journal/2026-05-14-changelog-rebase-thrash.md`.

## Related

- [`rules/library/parallel-pr-rebase-tax`](../../../rules/library/parallel-pr-rebase-tax/body.md)
- [`checklists/rebase-conflict-resolver.md`](../../../checklists/rebase-conflict-resolver.md)
