---
name: ios-build-preflight
id: RL-0020
keywords: [enforce-ios, check-build, build-preflight]
goal: Deliver ios build preflight output correctly and completely.
hash: 56e462c
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# iOS build preflight — check disk and enumerate all errors first

This rule fires before any iOS build attempt. It prevents two of the most
time-consuming failure modes in multi-agent Xcode repos:
1. Builds that die mid-compile because disk filled
2. "Fix-one-rebuild-fix-one" loops that take 8+ hours for what should be
   a 30-minute repair

---

## Rule 1: Check disk before building

```bash
df -h / | tail -1
```

**If free space < 2 GB:** do not attempt the build. Run the worktree-janitor
skill first.

Common space hogs in this repo:
- Stale merged worktrees (1-4 GB each, accumulate without cleanup)
- DerivedData (can reach 20+ GB across parallel builds)
- Multiple concurrent xcodebuild instances (see Build-1 in CLAUDE.md Pain Journal)

---

## Rule 2: Enumerate ALL errors before fixing ANY

Never start fixing the first error you see. The correct sequence is:

```bash
xcodebuild \
  -project "RedEPlay.xcodeproj" \
  -scheme "RedEPlay" \
  -destination 'generic/platform=iOS Simulator' \
  -configuration Debug \
  ONLY_ACTIVE_ARCH=YES build \
  2>&1 \
  | grep "error:" \
  | grep -v "DEFINES_MODULE\|umbrella header" \
  | sort -u
```

Read the FULL deduplicated list. Fifty errors often reduce to three root
causes. Fixing the root causes fixes all fifty simultaneously.

This is how not to do it:
- See "cannot find 'formattedName'" -> fix it -> rebuild -> see next error -> repeat
- Each rebuild is 2-3 minutes; 10 errors = 20-30 minutes of waiting that
  could have been 1 build after 3 fixes

---

## Rule 3: Classify before fixing

The six error types and their dependency order (from ios-build-doctor skill):

```
B (broken PBXBuildFile chain) -> always fix first, hides everything else
F (missing from disk)         -> fix second, same noise reduction
A (orphan file)               -> fix third
C (missing protocol)          -> fix fourth
D (@MainActor async)          -> fix fifth
E (API mismatch)              -> fix last
```

---

## Rule 4: Never run concurrent xcodebuild instances

Multiple xcodebuild processes share `DerivedData` and serialize on cache
locks. A second xcodebuild launched while one is running adds 20+ minutes
to both. Check before launching:

```bash
pgrep -lf xcodebuild | wc -l
# 0 = safe to build
# > 0 = wait
```
