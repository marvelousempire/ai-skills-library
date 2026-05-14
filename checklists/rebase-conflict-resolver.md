# Rebase conflict resolver checklist

Use when `git rebase` stops with conflicts.

## Step 1: Identify the conflict pattern

```bash
git status --short                              # files in UU/AA/UA states
git diff --diff-filter=U --name-only            # just the conflicted ones
```

## Step 2: Apply the known-pattern resolution

### Pattern: CHANGELOG.md
- Both halves are fresh entries at the top
- Resolution: **keep both, newest-first by Eastern timestamp**
- Skill: `skills/engineering/rebase-changelog-resolver`

### Pattern: Feature Ledger.md
- Both halves add rows to the same table
- Resolution: **keep both, in original section order**
- No skill — straightforward markdown additive merge

### Pattern: project.pbxproj
- Any conflict in `*.pbxproj`
- Resolution: **take HEAD** (the higher version number always wins on rebase)
- Auto-resolve script: see red-e-play's `.claude/rules/pbxproj-conflict.md`

### Pattern: Swift Codable model
- Rebase touched a file with `init(from:)` and `encode(to:)`
- Resolution: take HEAD then run the `swift-codable-guard` check
- Check: `grep -c "func encode(to encoder\|init(from decoder" path/to/file.swift` should return 2

### Pattern: migration filename collision (impossible — git would treat as separate file)
- If you renamed your migration to avoid collision, the file is just added
- Resolution: ensure the rename is staged

## Step 3: Stage + continue

```bash
git add <resolved-file>
GIT_EDITOR=true git rebase --continue
```

## Step 4: When the auto-resolution doesn't fit

For real semantic conflicts:
- [ ] Read both sides carefully
- [ ] Do NOT just "take HEAD" without thinking — that drops the other PR's work
- [ ] Consider: what was the intent of each side?
- [ ] Resolve by hand, run tests if possible
- [ ] If unclear, `git rebase --abort` and ask the human

## Anti-patterns

- ❌ `git checkout --ours <file>` or `--theirs` without reading first
- ❌ Picking one side and dropping the other on CHANGELOG (both shipped real work)
- ❌ Force-pushing without `--force-with-lease`

## Recovery if you mess up

```bash
git rebase --abort                              # restart clean
git reflog --all | head -30                     # find your pre-rebase commit
git reset --hard <sha-from-reflog>              # back to before the rebase
```

## Origin

`rules/library/parallel-pr-rebase-tax` + trainer-marketplace session's 3 CHANGELOG conflicts.
