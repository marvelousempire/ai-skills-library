# Never write project.pbxproj via cross-worktree bypass

`project.pbxproj` is the most fragile file in any Xcode repo. A single
misplaced character causes a completely opaque build failure. Writing it
via the `CLAUDE_ALLOW_CROSS_WORKTREE_EDIT=1` bypass consistently produces
corrupted files that pass the write operation but fail `plutil -lint`.

---

## The rule

**Never write `project.pbxproj` from outside its owning worktree.**

This means:
- No `CLAUDE_ALLOW_CROSS_WORKTREE_EDIT=1` + Python `open(path, 'w')` targeting a pbxproj
- No cross-worktree `sed` or `awk` writes to a pbxproj
- No simultaneous Python scripts "applying the same fix to both the worktree and main checkout"

---

## Why it corrupts

The write operation itself succeeds. The file has content. But:
1. Encoding/line-ending differences between the source and destination
2. Python's `str.replace()` on a binary/mixed-encoding plist produces
   silent mangling at line boundaries
3. `plutil -lint` then reports `Unexpected character / at line 1`
   — the entire build becomes impossible until the file is restored

---

## The only safe write paths for pbxproj

### Path 1: Edit inside the correct worktree
Use the `Edit` tool with the file path inside the current worktree.
The cross-worktree hook enforces this.

### Path 2: Restore from git
```bash
git checkout origin/main -- "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"
plutil -lint "Red-E Play/RedEPlay.xcodeproj/project.pbxproj" && echo "valid"
```

### Path 3: Conflict auto-resolution script (from pbxproj-conflict rule)
The Python conflict-resolution script in `rules/library/pbxproj-conflict/body.md`
is safe because it reads, performs a targeted `re.sub()` (no encoding changes),
and writes back in the same Python process. It is NOT the same as cross-worktree
Python writes.

---

## Recovery protocol

If pbxproj has been corrupted:
```bash
# 1. Confirm corruption
plutil -lint "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"
# -> Unexpected character / at line 1

# 2. Check what origin/main has
git show origin/main:"Red-E Play/RedEPlay.xcodeproj/project.pbxproj" | wc -l
# Expect ~3700+ lines

# 3. Restore
git checkout origin/main -- "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"
plutil -lint "Red-E Play/RedEPlay.xcodeproj/project.pbxproj" && echo "restored"

# 4. Verify your fixes are still there (they may have been in origin/main already)
grep "YourNewUUID" "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"
```

---

## Real incident (red-e-play-app 2026-05-14)

Multiple times during the build repair session, a Python script applied
fixes to both the worktree and the main checkout simultaneously via the
bypass. Each time, the main checkout's pbxproj became corrupted. The session
then needed `git checkout origin/main -- pbxproj` to recover. By the time
the session ended, the restoration + re-corruption cycle had happened 4+
times, adding hours to the repair work.

The fix: run all pbxproj repairs inside the worktree only, merge the PR,
then `git checkout origin/main --` in the main checkout to pull the merged
state. Never apply the same fix twice via bypass.
