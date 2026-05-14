---
name: worktree-janitor
description: >-
  Audit, clean, and reclaim disk space from stale git worktrees in a
  multi-agent monorepo. Triggered by "clean up worktrees", "free disk space",
  "worktrees are full", "remove stale branches", "disk is full before build",
  or proactively when disk < 3 GB before any iOS build. Identifies merged
  branches, removes them safely, frees DerivedData, and reports space gained.
---

# worktree-janitor — clean up stale worktrees and reclaim disk

In a monorepo with 60+ concurrent agents, worktrees accumulate fast.
Each worktree is a full working-tree checkout (hundreds of MB to GB).
Left uncleaned, they fill the disk and cause mysterious mid-build failures.

## When to run

- Before any `xcodebuild` run if `df -h /` shows < 3 GB free
- After any session where multiple PRs were opened and merged
- When `git worktree list` shows > 20 worktrees
- On a schedule: the first action of every new build session

---

## Step 1 — Inventory

```bash
git worktree list
du -sh .claude/worktrees/* 2>/dev/null | sort -rh
```

Note the top 5 by size. These are the candidates.

---

## Step 2 — Identify safe-to-remove

A worktree is safe to remove when its branch is merged to `origin/main`:

```bash
git fetch origin --quiet
git branch -r --merged origin/main | grep "claude/"
```

Any `claude/<name>` branch in that list means the worktree is safe to delete.

For worktrees without a matching `claude/` branch name, check the last commit:
```bash
git -C ".claude/worktrees/<name>" log --oneline -1
git -C "." branch -r --merged origin/main | grep "<sha>"
```

---

## Step 3 — Remove (safe, then force, then double-force)

```bash
# Preferred: clean removal
git worktree remove .claude/worktrees/<name>

# Force removal (uncommitted changes or locked by current process)
git worktree remove .claude/worktrees/<name> --force

# Double-force (locked by a dead agent PID)
git worktree remove .claude/worktrees/<name> -f -f
```

The `-f -f` (double-force) is required when a worktree is locked with a
reason like "claude agent <name> (pid 39656)" and that PID no longer exists.
Check: `ps aux | grep 39656` — if nothing, use `-f -f`.

---

## Step 4 — Clean DerivedData (when disk still tight)

```bash
du -sh ~/Library/Developer/Xcode/DerivedData 2>/dev/null
# If > 5 GB:
rm -rf ~/Library/Developer/Xcode/DerivedData
# DerivedData is always regenerated on next build -- safe to delete
```

---

## Step 5 — Verify and report

```bash
df -h / | tail -1
git worktree list | wc -l
echo "Worktrees remaining: $(git worktree list | wc -l)"
```

---

## Automation: run before every iOS build

Add to any pre-build checklist:
```bash
FREE=$(df -g / | awk 'NR==2{print $4}')
if [ "$FREE" -lt 3 ]; then
  echo "WARNING: Only ${FREE}GB free -- run worktree-janitor before building"
  exit 1
fi
```

---

## What NOT to remove

- Any worktree whose branch has open, unmerged PRs (check: `gh pr list --repo marvelousempire/red-e-play-app --state open`)
- Any worktree whose `git status` shows uncommitted work — open a draft PR first
- The main checkout (`/Users/nivram/Developer/red-e-play-app`) — never a worktree
