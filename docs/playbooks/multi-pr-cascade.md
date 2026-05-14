# Playbook — Multi-PR cascade in an active monorepo

How to ship N dependent PRs when origin/main is moving fast.

## When you'll need this

- Sessions planning 3+ PRs
- Plans where Phase 2 depends on Phase 1 being merged
- Schema → Routes → UI cascades

## The rebase tax

Every PR in a fast-moving repo pays a rebase tax. Budget: 5-10 minutes per PR for rebase work.

## Session-opener checklist

Use [`checklists/multi-pr-session-opener.md`](../../checklists/multi-pr-session-opener.md): estimate rebase tax, pre-flight git fetch + open-PR check, pick IDs ≥5 above high-water mark, map conflict surfaces, plan session order (low-risk first), set realistic expectations.

## During-session pattern

For each PR:
```bash
git fetch origin
git rebase origin/main
# Resolve via skill (rebase-changelog-resolver) or by hand
git push --force-with-lease
gh pr create ...
# Watch CI; merge from main checkout; trigger deploy; smoke test
```

## Inter-PR collision handling

If PR N+1's IDs collide with PR N (still in flight): don't re-run `next-feature-id.sh` between PRs — pick a starting range comfortably above the highest seen. Renumber via Python-in-Bash if needed ([bulk-token-substitution](../../rules/library/bulk-token-substitution/body.md)).

## Stop conditions

- 3+ unrelated PRs merge in the same 10 minutes → wait 10-15 min
- Same conflict surface hits twice → escalate to skill/agent
- Multi-PR session exceeding 6 PRs → propose splitting

## Origin

Trainer-marketplace session shipped 3 PRs and paid ~45 min rebase tax.
