# Worktree Lifecycle — Multi-Agent Xcode Repo

This document defines the expected lifecycle of a git worktree in the
red-e-play-app multi-agent environment, and what happens when each phase
is skipped.

---

## The lifecycle

```
CREATE      --> ACTIVE WORK   --> PR OPEN    --> PR MERGED   --> REMOVED
(branched)      (commits)         (gh pr)       (squash)        (git worktree remove)
```

Each phase has a responsible agent and a verification check.

---

## Phase: CREATE

```bash
git worktree add .claude/worktrees/<task-name> -b claude/<task-name>
```

**Rules at creation:**
- Name after the task, not a codename (`claude/onboarding-permissions` not `claude/witty-morse-58320`)
- Branch from `origin/main`, not local `main` (local `main` may be stale)
- Register a draft PR within 24 hours or the branch becomes invisible work

**What goes wrong if skipped:** No PR = invisible work. Parallel agents pick
the same feature, merge conflicts, lost work. See Worktree-1 in CLAUDE.md Pain Journal.

---

## Phase: ACTIVE WORK

```bash
# Commit immediately after every meaningful edit
git add path/to/file.swift
git commit -m "fix: add PBXFileReference for BumpLobbyView"
git push origin claude/<task-name>
```

**Rules during active work:**
- Every edit that compiles or fixes something: commit + push immediately
- Never accumulate 10+ file changes without committing
- Never leave uncommitted work when switching tasks

**What goes wrong if skipped:** Cross-worktree clobber. Another agent's
`git checkout` wipes your local-only changes. The commit hook at
`~/.claude/hooks/refuse-cross-worktree-edit.sh` helps but doesn't catch
everything.

---

## Phase: PR OPEN

```bash
gh pr create --repo marvelousempire/red-e-play-app \
  --title "fix(ios): repair 303 broken PBXBuildFile chains" \
  --body "..."
```

**Rules at PR open:**
- Rebase onto current `origin/main` first
- Run `plutil -lint` on pbxproj if it was touched
- Run the Codable guard check if any model was touched
- Check that no build errors are introduced

**What goes wrong if skipped:** Stale base merges silently drop other agents'
work (see iOS-4 in CLAUDE.md Pain Journal).

---

## Phase: PR MERGED

After `gh pr merge --squash --delete-branch`:

**Rules after merge:**
- The branch no longer exists on origin
- The worktree's tracking branch is gone
- The worktree directory still exists on disk until removed

**What goes wrong if left:** The worktree consumes 1-4 GB. After 20+ merged
worktrees, disk fills and builds die mid-compile.

---

## Phase: REMOVED

```bash
# From the MAIN checkout (not from inside the worktree being removed)
git worktree remove .claude/worktrees/<task-name>

# If locked (dead PID):
git worktree remove .claude/worktrees/<task-name> -f -f
```

**Rules at removal:**
- Run from the main checkout, not from inside the worktree
- Confirm branch was merged first: `git branch -r --merged origin/main | grep task-name`
- After removal: `git worktree prune` to clean up stale refs

---

## Capacity limits

| Metric | Green | Yellow | Red |
|---|---|---|---|
| Open worktrees | <= 10 | 11-20 | > 20 |
| Free disk space | > 5 GB | 3-5 GB | < 3 GB |
| Merged but not removed | 0 | 1-5 | > 5 |

When any metric hits Red, run the worktree-janitor skill before any new work.

---

## Identifying problem worktrees

```bash
# Worktrees with merged branches (safe to remove)
git fetch origin --quiet
git branch -r --merged origin/main | grep "claude/"

# Worktrees with no corresponding PR (invisible work)
gh pr list --repo marvelousempire/red-e-play-app --state open \
  | awk '{print $3}' > /tmp/open-branches.txt
git worktree list | awk 'NR>1{print $3}' | tr -d '[]' > /tmp/local-branches.txt
comm -23 <(sort /tmp/local-branches.txt) <(sort /tmp/open-branches.txt)
# Output = worktrees with no open PR (either merged or invisible)

# Biggest worktrees by size
du -sh .claude/worktrees/* 2>/dev/null | sort -rh | head -10
```

---

## The double-force pattern

When `git worktree remove` fails with:
```
fatal: '.claude/worktrees/some-worktree' is locked, reason:
  claude agent some-worktree (pid 39656)
```

Check if the PID exists: `ps aux | grep 39656`

If the process is dead: `git worktree remove .claude/worktrees/some-worktree -f -f`

The `-f -f` (two force flags) overrides the lock. It is safe when the agent
process is confirmed dead.
