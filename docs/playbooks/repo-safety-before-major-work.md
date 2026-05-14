# Playbook — Repo safety before major work

How to make a git repo safe, clean, backed up, and recoverable before doing substantial multi-file work.

## When to run this

- Before adding 20+ new files
- Before any cross-cutting refactor
- Before any work that touches index files (README, SKILL-INDEX, AGENTS.md)
- Before any work that this playbook is being applied to (yes, recursively)

## The 4-step pre-flight

### 1. Confirm clean state

```bash
git status --short
git fetch origin
git log HEAD..origin/main --oneline | head -5
```

If working tree dirty, commit or stash first. If behind main, rebase.

### 2. Tag the current state as a backup point

```bash
git tag -a pre-<descriptive-slug>-YYYY-MM-DD-<context> \
  -m "Backup point before <work> on YYYY-MM-DD. HEAD at $(git rev-parse --short HEAD)."
git push origin pre-<descriptive-slug>-YYYY-MM-DD-<context>
```

### 3. Create a working branch

```bash
git checkout -b feat/<descriptive-slug>
git push -u origin feat/<descriptive-slug>
```

### 4. Document the safety net in the work itself

Reference the backup tag in your first commit message or master-report:
> "Safety backup: tag `pre-<slug>` on this library's main; recovery is one `git reset --hard pre-<slug>` away."

## Recovery scenarios

### Local accidental file deletion
```bash
git checkout -- <file>
git checkout HEAD~1 -- <file>
```

### Local accidental commit on wrong branch
```bash
git reset --hard HEAD~1
git push --force-with-lease  # use --force-with-lease, never --force
```

### Total disaster — reset to backup point
```bash
git fetch origin
git checkout main
git reset --hard pre-<slug>-YYYY-MM-DD
git push --force-with-lease origin main  # only if you're SURE
```

### Recovery from dangling commits
```bash
git reflog --all | head -50
git fsck --lost-found
```

## What this protects against

- The cross-worktree edit hook firing mid-work
- A bad force-push wiping work (backup tag is invariant)
- A subagent going off the rails (working branch isolates damage)
- A scripted bulk-rename rewriting the wrong files

## Origin

Trainer-marketplace session, 2026-05-14. Before running master-repo-evolution, we tagged `pre-master-repo-evolution-2026-05-14-trainer-session` and worked on `feat/master-repo-evolution-from-trainer-session`. Codified here so future major sessions repeat the pattern.
