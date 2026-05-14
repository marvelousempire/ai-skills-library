# Parallel-PR rebase tax — count rebases per PR

In a 60+ worktree, 20-PRs-per-day monorepo, every dependent PR opened in a single session pays a rebase tax:

- Origin/main moves ~1 commit per 5-15 min during active hours
- Each rebase touches CHANGELOG.md (~80% of PRs) - 1 conflict to resolve
- Each rebase against migrations directory may surface a filename collision
- Each rebase against Feature Ledger.md or project.pbxproj is its own resolution pattern

**Rule of thumb: budget 5-10 minutes per PR for the rebase tax alone, on top of the engineering time.**

## Implications for session planning

| Session intent | Realistic scope at quality bar |
|---|---|
| 1 PR | 1 fast iteration, ~15 min |
| 2 PRs back-to-back | ~45 min |
| 3+ dependent PRs | engineering time x 1.5 + 10 min x PR count |
| 6+ PRs in one session | Likely impossible at quality bar; split across sessions |

## What the rebase tax looks like in practice

From the trainer-marketplace session (3 dependent PRs):
- PR #817: 2 CHANGELOG rebases + 1 feature-ID renumber + 1 migration-filename bump = ~25 min
- PR #822: 1 CHANGELOG rebase + ALTER TYPE refactor + is_public discovery = ~15 min
- PR #824: 1 CHANGELOG rebase + minimal = ~5 min

Total rebase tax across 3 PRs: ~45 min, on top of the writing + CI-watching time.

## How to minimize the tax

1. Pre-flight check: `git fetch origin && git log HEAD..origin/main --oneline` right before opening each PR
2. Pick IDs above the high-water mark (see feature-id-race-guard and migration-race-guard)
3. Use the rebase-changelog-resolver skill to mechanically resolve CHANGELOG conflicts
4. Watch open PRs — if 3+ unrelated PRs are about to merge, wait for them before opening yours
