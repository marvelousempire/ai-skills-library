# CHANGELOG.md rebase thrash — 3 conflicts in one session

**First seen:** 2026-05-14 (red-e-play 3 separate rebases during PR #817 + #822 + #824)
**Session:** trainer-marketplace
**Category:** git / coordination

## Symptom

Every time I ran `git rebase origin/main` during the trainer-marketplace session, it stopped with the same conflict shape:

```
CONFLICT (content): Merge conflict in docs/CHANGELOG.md
```

Three times across three PRs. Each conflict's shape was identical: the rebased PR (mine) and a newly-merged upstream PR (creator program, iOS-web parity, scoring transparency) both prepended a new entry at the top of CHANGELOG.md.

## Diagnose (30 seconds)

```bash
git status --short                            # CHANGELOG.md will be UU
grep -n "<<<<<<<\|=======\|>>>>>>>" docs/CHANGELOG.md
```

## Fix

The pattern is mechanical:
1. The HEAD half is the upstream PR's new entry (usually newer timestamp)
2. The incoming half is your entry
3. Keep both, ordered newest-first by Eastern timestamp

Resolution via Edit tool: delete the `<<<<<<<` / `=======` / `>>>>>>>` markers and arrange both entries with the newer timestamp first.

## Root cause

In a 20+ PR/day monorepo, CHANGELOG.md is the highest-traffic merge surface. Every PR prepends an entry at the top. Every rebase against a stale base = same-shape conflict.

## Prevention

- Skill: [`rebase-changelog-resolver`](../../skills/engineering/rebase-changelog-resolver/SKILL.md) — auto-resolve via newest-first sort
- Agent: [`agents/rebase-shepherd.md`](../../agents/rebase-shepherd.md) — handles this + other known patterns
- Rule: [`parallel-pr-rebase-tax`](../../rules/library/parallel-pr-rebase-tax/body.md) — budget time for the tax
- Checklist: [`rebase-conflict-resolver.md`](../../checklists/rebase-conflict-resolver.md) — quick reference

## Related

- Master Report: Section 3.1.3 + Section 2 (timeline of all 3 conflicts)
