# New Session Checklist — You-Sir Juan OS

Run at the start of every Claude Code session on this repo.

## Git state
```bash
git worktree list                        # know what's in flight
git fetch origin                         # get latest remote state
git status                               # see current state
git log origin/main..HEAD --oneline      # commits ahead of main
git log HEAD..origin/main --oneline      # commits you're behind
```

## Read the after-action from the last session
```bash
ls vendor/ai-skills-library/after-action/ | tail -3
# Read the most recent one to know what was built and what comes next
```

## Skim issue log
```bash
tail -50 docs/Issue-Log.md 2>/dev/null || echo "No issue log yet"
# Don't re-hit a wall already documented
```

## Confirm you're in the right worktree
```bash
pwd
# Should match your intended worktree, not a nested vendor/ path
```

## For new feature branches
```bash
git checkout -B feature/short-name origin/main
# NOT: git checkout -b ... (branches off local main, which may be stale)
```

## Orientation
```bash
cat CLAUDE.md | head -60     # session context
cat apps/README.md | head -30  # current built state
```
