---
name: ios-build-doctor
description: >-
  Systematically diagnose and fix iOS build errors in a multi-agent Xcode
  repo. Triggered when the user says "fix the iOS build", "build is broken",
  "xcodebuild is failing", "get to BUILD SUCCEEDED", "iOS errors". Runs a
  structured six-phase protocol: disk-check → enumerate ALL errors →
  classify by type → fix in dependency order → verify clean → PR. Never
  starts fixing individual errors without first seeing the full error set.
---

# ios-build-doctor — systematic iOS build repair

Extracted from the red-e-play-app multi-agent repair session (2026-05-14, PRs #793–#826). That session took 8+ hours and 30+ PRs to reach `** BUILD SUCCEEDED **`. This skill codifies every pattern that worked and every trap that should never be repeated.

## Core principle

**Enumerate ALL errors before fixing ANY.**

The single biggest time-waster in this domain is fixing the first error you see, rebuilding, finding the next error, rebuilding, repeating. Build errors in multi-agent Xcode repos are almost always a cluster — fix them as a batch, not one at a time.

---

## Phase 1 — Disk preflight

Run before every build attempt. iOS builds fail silently mid-compile when disk fills.

```bash
df -h / | tail -1
# Need >= 2 GB free. If < 2 GB, run disk-reclaim before anything else.
```

**Disk-reclaim protocol:**
```bash
# 1. List all worktrees and sizes
git worktree list
du -sh .claude/worktrees/* 2>/dev/null | sort -rh | head -10

# 2. Identify merged branches
git fetch origin
git branch -r --merged origin/main

# 3. Remove merged worktrees (double-force for locked/dead-PID worktrees)
git worktree remove .claude/worktrees/<name> -f -f

# 4. Clean DerivedData if >= 5 GB
du -sh ~/Library/Developer/Xcode/DerivedData 2>/dev/null
rm -rf ~/Library/Developer/Xcode/DerivedData

# 5. Confirm
df -h / | tail -1   # need > 2 GB
```

---

## Phase 2 — Enumerate ALL errors

```bash
cd "Red-E Play"
xcodebuild \
  -project "RedEPlay.xcodeproj" \
  -scheme "RedEPlay" \
  -destination 'generic/platform=iOS Simulator' \
  -configuration Debug \
  ONLY_ACTIVE_ARCH=YES \
  build \
  2>&1 \
  | grep "error:" \
  | grep -v "DEFINES_MODULE\|umbrella header" \
  | sort -u
```

Do not start fixing until you have the complete sorted list. Fifty errors may collapse to three root causes. Fix the root causes.

---

## Phase 3 — Classify by type

Fix in order shown — earlier types are prerequisites for later types.

### Type B — Broken chain (PBXBuildFile → no PBXFileReference)

**Most common mass-failure mode.** 303 broken chains accumulated in red-e-play-app before discovery.

**Symptom:** `error opening input file '/path/Foo.swift' (No such file or directory)`

**Diagnose:**
```python
import re
PROJ = "RedEPlay.xcodeproj/project.pbxproj"
with open(PROJ) as f:
    content = f.read()
build_files = re.findall(
    r'([0-9A-F]{24}) /\* [^*]+ \*/ = \{isa = PBXBuildFile; fileRef = ([0-9A-F]{24})',
    content
)
file_refs = set(re.findall(
    r'([0-9A-F]{24}) /\* [^*]+ \*/ = \{isa = PBXFileReference',
    content
))
broken = [(bf, fr) for bf, fr in build_files if fr not in file_refs]
print(f"Total broken chains: {len(broken)}")
for bf, fr in broken[:5]:
    print(f"  PBXBuildFile {bf[:8]} -> fileRef {fr[:8]} -- no PBXFileReference")
```

**Critical regex trap:** A loose check `\bUUID\b[^;]{1,200}isa = PBXFileReference` gives FALSE POSITIVES because the UUID can appear as a *comment* inside a PBXBuildFile line (e.g. `fileRef = UUID /* Foo.swift */;`) and a nearby line starts with `isa = PBXFileReference`. Always match the UUID as the *primary key*: `UUID /\* .* \*/ = {isa = PBXFileReference`.

### Type F — Missing from disk (in pbxproj, file absent from working tree)

**Symptom:** Same as Type B but the file path doesn't exist at all.

```bash
git ls-files "path/to/File.swift"   # if returns path -> restore from git
git checkout origin/main -- "path/to/File.swift"
```

### Type A — Orphan (file on disk, not in pbxproj)

**Symptom:** `error: cannot find 'FooView' in scope`

```bash
grep -c "FooView.swift" "RedEPlay.xcodeproj/project.pbxproj"
# 0 = orphan -- add 4 entries to pbxproj
```

### Type C — Missing protocol conformance

**Symptom:** `error: type 'X' has no conformance to 'Codable'`, `requires 'Equatable'`

Three-way Codable fix (all four must happen in the same commit):
1. Property declaration
2. `CodingKeys` case
3. `decodeIfPresent` in `init(from:)`
4. `encodeIfPresent` in `encode(to:)`

Missing the CodingKeys case = compile error. Missing the encode call = silent data loss.

### Type D — Async context mismatch (@MainActor)

**Symptom:** `error: expression is 'async' but is not marked with 'await'`

A `@MainActor` class is accessed from a non-main async function. Add `await`:
```swift
let pending = await InvitationService.shared.pendingInviter  // @MainActor class
await InvitationService.shared.clearPendingInviter()
```

### Type E — API signature mismatch

**Symptom:** `extra arguments at positions #2, #3` or `missing argument for parameter 'name'`

A struct/function signature changed; callers not updated. Find all callers:
```bash
grep -rn "PlayerAvatarView(" --include="*.swift" .
```
Update every call site. Never leave deprecated alias shims.

---

## Phase 4 — Fix order

```
1. Disk reclaim       -> build can run
2. Type B (bulk)      -> removes "input file" noise masking real errors
3. Type F (restore)   -> same
4. Type A (orphan)    -> "cannot find in scope" for new files
5. Type C (protocol)  -> conformance errors
6. Type D (async)     -> await/actor errors
7. Type E (API)       -> signature mismatch errors
```

Re-run Phase 2 after fixing each type.

---

## Phase 5 — pbxproj safety

```bash
# Always validate before/after touching pbxproj
plutil -lint "RedEPlay.xcodeproj/project.pbxproj"

# If corrupted -- restore from origin/main (the only safe method)
git checkout origin/main -- "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"
plutil -lint "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"
```

**NEVER write pbxproj via a Python bypass script across worktrees.** `CLAUDE_ALLOW_CROSS_WORKTREE_EDIT=1` + Python `open(path, 'w')` on a pbxproj path outside the current worktree consistently produces a file that passes the cp/write but fails `plutil -lint`. The safe write paths are: `Edit` tool inside the correct worktree, or `git checkout origin/main --` to restore.

---

## Phase 6 — Verify and ship

```bash
# Codable integrity
grep -c "func encode(to encoder\|init(from decoder" "path/to/Model.swift"
# Expected: 2 (one each)

# Build
xcodebuild -project "RedEPlay.xcodeproj" -scheme "RedEPlay" \
  -destination 'generic/platform=iOS Simulator' -configuration Debug \
  ONLY_ACTIVE_ARCH=YES build 2>&1 | tail -3
# Expected: ** BUILD SUCCEEDED **

# Version bump (required per CLAUDE.md rule #15)
# Bump MARKETING_VERSION + CURRENT_PROJECT_VERSION in project.pbxproj
```

---

## Anti-patterns

- **Fix-one-rebuild-repeat** — enumerate ALL errors first, always.
- **Skipping Phase 1** — a build that dies mid-compile is the hardest failure to diagnose.
- **Python cross-worktree pbxproj writes** — corrupts silently, breaks on `plutil -lint`.
- **Loose UUID regex checks** — always verify UUID as primary key, not as a comment.
- **Fixing Type E before Type B** — broken chain errors swamp the output and hide real API errors.
