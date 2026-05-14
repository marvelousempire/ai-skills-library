# iOS Build Clean Checklist

Run through this checklist before and after any iOS build repair session.
Every step here corresponds to a real failure mode from the red-e-play-app
build repair session (2026-05-14).

---

## Pre-Build Checklist

### Disk

- [ ] `df -h / | tail -1` — confirm >= 3 GB free
- [ ] If < 3 GB: run worktree-janitor (see `skills/mobile/ios/worktree-janitor/`)
- [ ] `pgrep -lf xcodebuild | wc -l` — confirm 0 concurrent builds

### pbxproj Integrity

- [ ] `plutil -lint "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"` — must print "OK"
- [ ] If corrupted: `git checkout origin/main -- "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"`

### Broken Chain Audit (run once per session, not per PR)

```bash
cd "Red-E Play"
python3 - << 'EOF'
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
print(f"Broken chains: {len(broken)}")
if broken:
    print("Run ios-build-doctor to fix before building.")
EOF
```

- [ ] Broken chains = 0 before attempting build

### Worktree Hygiene

- [ ] `git worktree list | wc -l` — prefer < 20
- [ ] Any worktrees with merged branches? `git branch -r --merged origin/main | grep "claude/"` — remove them

---

## Error Enumeration (when build fails)

Run ONCE, get the FULL list before fixing anything:

```bash
cd "Red-E Play"
xcodebuild \
  -project "RedEPlay.xcodeproj" \
  -scheme "RedEPlay" \
  -destination 'generic/platform=iOS Simulator' \
  -configuration Debug \
  ONLY_ACTIVE_ARCH=YES build \
  2>&1 \
  | grep "error:" \
  | grep -v "DEFINES_MODULE\|umbrella header" \
  | sort -u \
  | tee /tmp/build-errors.txt
echo "Total unique errors: $(wc -l < /tmp/build-errors.txt)"
```

- [ ] Error count written down
- [ ] Errors classified by type (B/F/A/C/D/E)
- [ ] Fix order determined (B first, E last)

---

## Post-Fix Verification Checklist

### After each fix batch

- [ ] `plutil -lint` — pbxproj still valid?
- [ ] Re-run error enumeration — did error count drop? By expected amount?

### Before opening PR

- [ ] Zero "error opening input file" errors (all chain errors cleared)
- [ ] For any Codable model touched: `grep -c "func encode(to encoder\|init(from decoder" "path/to/Model.swift"` = 2
- [ ] For any pbxproj touched: `plutil -lint` = OK
- [ ] For any API that changed: grep confirms zero old-signature callers
- [ ] `git status` shows only intentionally changed files

### Final build verification

```bash
cd "Red-E Play"
xcodebuild \
  -project "RedEPlay.xcodeproj" \
  -scheme "RedEPlay" \
  -destination 'generic/platform=iOS Simulator' \
  -configuration Debug \
  ONLY_ACTIVE_ARCH=YES build \
  2>&1 | tail -5
# Expected: "** BUILD SUCCEEDED **"
```

- [ ] BUILD SUCCEEDED — zero errors, zero warnings

### Version bump (required before PR merge)

- [ ] `MARKETING_VERSION` bumped in all 3 locations in `project.pbxproj`
- [ ] `CURRENT_PROJECT_VERSION` incremented by 1

---

## Cheat Sheet: Fix Commands by Error Type

| Type | Symptom | First command |
|---|---|---|
| B | "error opening input file" | `python3 broken-chain-audit.py` |
| F | Same but file missing from git | `git ls-files "path/to/file.swift"` |
| A | "cannot find 'X' in scope" | `grep -c "X.swift" project.pbxproj` |
| C | "has no conformance to Codable/Equatable" | Add protocol to struct declaration |
| D | "expression is async but not marked with await" | Add `await` to @MainActor access |
| E | "extra arguments at positions #2, #3" | `grep -rn "StructName(" --include="*.swift" .` |
