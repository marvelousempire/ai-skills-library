# Pre-merge checklist

Run before clicking `gh pr merge`.

- [ ] CI green — every check returns SUCCESS, not just "no failures"
- [ ] `gh pr view --json mergeable` returns `MERGEABLE` (not `CONFLICTING`)
- [ ] Rebased onto current `origin/main` — `git log HEAD..origin/main --oneline` is empty
- [ ] No related open PRs that would conflict if both merge
- [ ] PR description complete: Summary / What's in the diff / Test plan / 🤖 Generated trailer
- [ ] If this is one of N dependent PRs, rebase tax accounted for the next PR
- [ ] CWD is the main checkout (NOT the worktree being merged) before `gh pr merge --delete-branch`
- [ ] Squash-merge unless the PR has >5 logically distinct commits worth preserving
- [ ] **NEVER** force-push to main; **NEVER** use `--no-verify`; **NEVER** skip hooks
