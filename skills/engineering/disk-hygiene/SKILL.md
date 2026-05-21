---
name: disk-hygiene
keywords: [run-disk, check-hygiene, file-disk]
hash: 370490b
relations: []
before: []
governed_by: [global]
meta: dynamic
goal: Deliver disk hygiene output correctly and completely.
description: "Reclaim disk space by auditing and cleaning stale worktrees, node_modules, build artifacts, and Xcode DerivedData. Use when the user reports: 'disk full,' 'no space left,' '99% disk,' 'out of disk,' 'xcodebuild failed with no space,' 'clear worktrees,' 'node_modules taking space,' 'clean up stale branches,' 'too many worktrees,' 'disk is almost full on VPS.' Also use proactively before triggering any iOS build if disk usage is above 80%. Returns a before/after disk report and a list of what was removed."
metadata:
  version: 1.0.0
---

# Disk Hygiene

You are reclaiming disk space by systematically auditing and removing stale
build artifacts, node_modules, and worktrees. Work through the steps in
order — largest wins first.

---

## Step 1 — Measure

```bash
# Overall disk usage:
df -h /

# Top disk consumers:
du -sh /* 2>/dev/null | sort -rh | head -10

# Xcode DerivedData (often 10–30 GB):
du -sh ~/Library/Developer/Xcode/DerivedData 2>/dev/null

# Worktree node_modules (often 1–5 GB each):
find .claude/worktrees -name "node_modules" -maxdepth 4 -type d 2>/dev/null \
  | while read d; do
      size=$(du -sm "$d" 2>/dev/null | cut -f1)
      echo "$size $d"
    done | sort -rn | head -20
```

Record the starting disk usage for the before/after report.

---

## Step 2 — Identify stale worktrees

```bash
git worktree list
```

For each worktree, check:
- Is the branch merged into main? `git branch --merged origin/main | grep BRANCH`
- Is it behind main with no unique commits? `git rev-list --count HEAD ^origin/main`
- Is it marked `[locked]`? (Locked worktrees need `--force` to remove)
- When was it last modified? `stat -f "%Sm" path/to/worktree`

Candidates for removal: merged branches, branches 0 commits ahead of main,
worktrees untouched for >7 days.

---

## Step 3 — Remove node_modules from stale worktrees

For each stale worktree identified in Step 2, remove node_modules without
removing the worktree itself (in case you want to inspect the branch first):

```bash
rm -rf .claude/worktrees/WORKTREE_NAME/node_modules
rm -rf .claude/worktrees/WORKTREE_NAME/admin/node_modules
rm -rf .claude/worktrees/WORKTREE_NAME/marketing/node_modules
rm -rf .claude/worktrees/WORKTREE_NAME/player-web/node_modules
```

Each node_modules directory is typically 500 MB–2 GB.

---

## Step 4 — Remove dead worktrees

For stale worktrees where the branch is merged and you've confirmed nothing
is needed:

```bash
# First verify: no uncommitted changes
git -C .claude/worktrees/WORKTREE_NAME status --short

# If clean, remove:
git worktree remove .claude/worktrees/WORKTREE_NAME

# If locked:
git worktree remove .claude/worktrees/WORKTREE_NAME --force

# If the branch is also done:
git branch -d claude/BRANCH_NAME
git push origin --delete claude/BRANCH_NAME
```

---

## Step 5 — Clean Xcode DerivedData (if iOS builds are involved)

```bash
# Safe to wipe — rebuilt automatically on next build:
rm -rf ~/Library/Developer/Xcode/DerivedData

# Verify it's gone:
du -sh ~/Library/Developer/Xcode/DerivedData 2>/dev/null || echo "clean"
```

This is always safe. DerivedData is a build cache, never source of truth.

---

## Step 6 — Clean npm/pnpm caches (if node disk is a major contributor)

```bash
# pnpm global cache:
pnpm store prune

# npm cache:
npm cache clean --force

# Check size after:
du -sh ~/.pnpm-store 2>/dev/null
du -sh ~/.npm 2>/dev/null
```

---

## Step 7 — VPS-specific (if on production VPS)

```bash
# Old Next.js builds:
ls -la /opt/readyplay/marketing/.next-old /opt/readyplay/marketing/.next-new 2>/dev/null
rm -rf /opt/readyplay/marketing/.next-old /opt/readyplay/marketing/.next-new

# pm2 logs:
pm2 flush   # clears pm2 log files

# System logs:
journalctl --vacuum-size=100M
```

---

## Output format

```
DISK HYGIENE REPORT
Before: [X GB used, Y% of disk]
After: [X GB used, Y% of disk]
Recovered: [Z GB]

Removed:
- [list of removed worktrees]
- [list of removed node_modules directories with sizes]
- [DerivedData: X GB]
- [Other artifacts: X GB]

Remaining large items (not removed — active or needed):
- [item: size, reason kept]
```

---

## Related rules

- `parallel-pr-rebase-tax` — why so many worktrees exist
- iOS-4 Pain Journal entry (stale worktrees causing build contention)
