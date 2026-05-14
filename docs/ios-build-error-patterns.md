# iOS Build Error Patterns — Comprehensive Reference

Extracted from red-e-play-app build repair session, 2026-05-14 (PRs #793–#826).
This session repaired 303+ broken PBXBuildFile->PBXFileReference chains, recovered
corrupted project.pbxproj files, resolved a disk space crisis, and fixed cascading
Swift compile errors across six error types. It took 8+ hours to reach BUILD SUCCEEDED.

---

## Error Type B: Broken PBXBuildFile -> PBXFileReference Chain

**The most common mass-failure mode in multi-agent Xcode repos.**

### What it looks like

```
error opening input file '/path/to/Foo.swift' (No such file or directory)
```

This means xcodebuild found a `PBXBuildFile` entry pointing at a `fileRef` UUID,
but that UUID has no corresponding `PBXFileReference` definition. The compiler
tries to open the source file but can't find the path.

### How it accumulates

Multiple agents add Swift files to separate branches. Each agent adds 4 correct
pbxproj entries. During merge conflict resolution, the `PBXBuildFile` section
takes HEAD (correct) but the `PBXFileReference` section gets dropped because it
appeared in the "incoming" half of the conflict block. Result: 1 UUID reference
with no definition.

Over 60+ active agent sessions, this accumulated to 303 broken chains in
red-e-play-app before detection.

### Diagnosis script

```python
import re
PROJ = "RedEPlay.xcodeproj/project.pbxproj"
with open(PROJ) as f:
    content = f.read()

# Find all PBXBuildFile -> fileRef mappings
build_files = re.findall(
    r'([0-9A-F]{24}) /\* [^*]+ \*/ = \{isa = PBXBuildFile; fileRef = ([0-9A-F]{24})',
    content
)

# Find all PBXFileReference primary keys
file_refs = set(re.findall(
    r'([0-9A-F]{24}) /\* [^*]+ \*/ = \{isa = PBXFileReference',
    content
))

broken = [(bf, fr) for bf, fr in build_files if fr not in file_refs]
print(f"Total broken chains: {len(broken)}")
for bf, fr in broken[:10]:
    print(f"  PBXBuildFile {bf[:8]} -> fileRef {fr[:8]} -- MISSING PBXFileReference")
```

### The false-positive regex trap

A common but WRONG approach:

```python
# BAD: matches UUID as a comment, not as primary key
pattern = r'\b' + uuid + r'\b[^;]{1,200}isa = PBXFileReference'
```

This produces false positives because the `fileRef` UUID appears as a COMMENT
inside a PBXBuildFile line like:
```
A1B2C3D4E5F6A7B8C9D0E1F2 /* MyView.swift in Sources */ = {
  isa = PBXBuildFile;
  fileRef = F2E1D0C9B8A7F6E5 /* MyView.swift */;
};
```

The pattern `F2E1D0C9B8A7F6E5[...content on nearby lines...]isa = PBXFileReference`
can match spuriously if any nearby line contains `isa = PBXFileReference`.

The CORRECT check requires the UUID to be the primary key:
```python
# GOOD: UUID as the primary key of a PBXFileReference object
pattern = r'F2E1D0C9B8A7F6E5 /\* [^*]+ \*/ = \{isa = PBXFileReference'
```

### Fix

For each broken chain, add the missing `PBXFileReference` entry:
```
F2E1D0C9B8A7F6E5 /* MyView.swift */ = {
    isa = PBXFileReference;
    lastKnownFileType = sourcecode.swift;
    path = MyView.swift;
    sourceTree = "<group>";
};
```

Where `F2E1D0C9B8A7F6E5` is the exact `fileRef` UUID from the orphaned `PBXBuildFile`.
The `path` value is derived from the comment text in the PBXBuildFile line.

---

## Error Type F: File Missing from Disk

**Symptom:** Same "error opening input file" as Type B, but the file was never
created or was deleted.

### Diagnosis

```bash
# Check if the file is tracked by git (was it ever committed?)
git ls-files "Red-E Play/Red-E Play/Features/SomeFeature/MyFile.swift"

# Check if it exists on origin/main
git show origin/main:"Red-E Play/Red-E Play/Features/SomeFeature/MyFile.swift" | head -5
```

### Fix

If the file exists on origin/main:
```bash
git checkout origin/main -- "Red-E Play/Red-E Play/Features/SomeFeature/MyFile.swift"
```

If it was never committed and was meant to be a new file, recreate it.
If it was intentionally deleted, remove its 4 pbxproj entries instead.

---

## Error Type A: Orphan File (on disk, not in pbxproj)

**Symptom:** `error: cannot find 'MyViewModel' in scope`

The file `MyViewModel.swift` exists on disk but has no entry in `project.pbxproj`,
so the compiler never sees it.

### Diagnosis

```bash
grep -c "MyViewModel.swift" "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"
# 0 = confirmed orphan
# >= 4 = registered (correct)
```

Bulk audit of all orphans:
```bash
comm -23 \
  <(find "Red-E Play/Red-E Play" -name "*.swift" -type f -exec basename {} \; | sort -u) \
  <(grep -oE '[A-Za-z][A-Za-z0-9+]*\.swift' "Red-E Play/RedEPlay.xcodeproj/project.pbxproj" | sort -u)
```

### Fix

Add 4 entries to `project.pbxproj` for each orphan:

1. **PBXBuildFile section:**
```
NEW_UUID_1 /* MyFile.swift in Sources */ = {isa = PBXBuildFile; fileRef = NEW_UUID_2 /* MyFile.swift */; };
```

2. **PBXFileReference section:**
```
NEW_UUID_2 /* MyFile.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = MyFile.swift; sourceTree = "<group>"; };
```

3. **Group children array** (under the matching feature group):
```
NEW_UUID_2 /* MyFile.swift */,
```

4. **Sources build phase:**
```
NEW_UUID_1 /* MyFile.swift in Sources */,
```

Use fresh 24-hex UUIDs. Verify zero collisions: `grep -c "NEW_UUID_1" project.pbxproj` should return 2 after adding.

---

## Error Type C: Missing Protocol Conformance

### C1: Missing Codable conformance

**Symptom:** `error: type 'MiniGameConfig' has no conformance to 'Codable'`

**Cause:** The type is used in `JSONEncoder().encode(config)` or similar, but
never declared `Codable`.

**Fix:**
```swift
// Add Codable to the conformance list
struct MiniGameConfig: Hashable, Codable {  // added Codable
```

If all member properties are themselves `Codable` (which `Int`, `Bool`, `String`,
`UUID` all are), Swift synthesizes the implementation automatically.

### C2: Missing CodingKeys case

**Symptom:** `error: type 'Player.CodingKeys' has no member 'wellnessVisibility'`

**Cause:** A property was added to the struct body and the decode/encode calls
were added, but the `enum CodingKeys` was not updated.

**Fix:** The four-part Codable update (ALL in the same commit):
```swift
// 1. Property declaration (if not already there)
var wellnessVisibility: String?

// 2. CodingKeys case (THIS was missing)
enum CodingKeys: String, CodingKey {
    // ... existing cases ...
    case wellnessVisibility  // ADD THIS
}

// 3. Decode (in init(from:))
wellnessVisibility = try container.decodeIfPresent(String.self, forKey: .wellnessVisibility)

// 4. Encode (in encode(to:))
try container.encodeIfPresent(wellnessVisibility, forKey: .wellnessVisibility)
```

### C3: Missing Equatable conformance

**Symptom:** `error: referencing instance method 'onChange(of:perform:)' on 'Optional<PendingInvite>' requires 'Optional<PendingInvite>' conform to 'Equatable'`

**Cause:** SwiftUI's `.onChange(of:)` requires the observed value to be `Equatable`.
The nested struct had no conformance.

**Fix:**
```swift
struct PendingInvite: Equatable {  // add Equatable (synthesized if all properties are Equatable/Hashable)
    let playerID: String
    let displayName: String
    // ...
}
```

---

## Error Type D: @MainActor Async Context Mismatch

**Symptom:**
```
error: expression is 'async' but is not marked with 'await'
note: calls to instance method 'pendingInviter' from outside of its actor context are implicitly asynchronous
```

**Cause:** A property or method belongs to a `@MainActor` class. Accessing it
from a non-`@MainActor` async function requires explicit `await`.

### Diagnosis

```bash
grep -n "@MainActor" "path/to/ServiceFile.swift" | head -5
```

If the class is `@MainActor final class InvitationService`, every access from
an unconfined async context needs `await`.

### Fix

```swift
// BEFORE (compile error)
func someAsyncFunction() async {
    let pending = InvitationService.shared.pendingInviter
    InvitationService.shared.clearPendingInviter()
}

// AFTER (correct)
func someAsyncFunction() async {
    let pending = await InvitationService.shared.pendingInviter
    await InvitationService.shared.clearPendingInviter()
}
```

Note: `await` on a synchronous `@MainActor` property is valid Swift — it
means "hop to the MainActor to read this value."

---

## Error Type E: API Signature Mismatch

**Symptom:**
```
error: extra arguments at positions #2, #3 in call
error: missing argument for parameter 'name' in call
```

**Cause:** A struct initializer or function signature was changed in one file
but callers in other files (often from parallel branches) weren't updated.

### Diagnosis

```bash
# Find the new signature
grep -n "init\|func PlayerAvatarView" "path/to/PlayerAvatarView.swift" | head -5

# Find all callers
grep -rn "PlayerAvatarView(" --include="*.swift" .
```

### Fix

Update every caller to match the new signature. Never add a deprecated alias.

**Real example (red-e-play-app PR #826):**
```swift
// OLD callers (two sites)
PlayerAvatarView(
    portraitAvatarURL: inviter.avatarURL,
    playerID: inviter.id,
    displayName: inviter.displayName,
    size: 64,
    ringTier: nil
)

// NEW signature
PlayerAvatarView(
    name: inviter.displayName,
    size: 64,
    portraitAvatarURL: inviter.avatarURL
)
```

---

## Error Type P: pbxproj Corruption

Not a Swift compile error, but a build-time failure that surfaces as:
```
Build input file cannot be found: '/path/to/file.swift'
```
or the entire build refuses to start.

### Diagnosis

```bash
plutil -lint "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"
# Healthy: "RedEPlay.xcodeproj/project.pbxproj: OK"
# Corrupted: "Unexpected character / at line 1"
```

### Cause

Cross-worktree writes via Python bypass (`CLAUDE_ALLOW_CROSS_WORKTREE_EDIT=1`).
See `rules/library/never-cross-worktree-pbxproj/body.md` for the full analysis.

### Fix

```bash
git checkout origin/main -- "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"
plutil -lint "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"
```

---

## Build Verification Commands

After all fixes are applied:

```bash
# 1. Validate pbxproj
plutil -lint "Red-E Play/RedEPlay.xcodeproj/project.pbxproj" && echo "pbxproj valid"

# 2. Check Codable models
grep -c "func encode(to encoder\|init(from decoder" \
  "Red-E Play/Red-E Play/Shared/Models/Player.swift"
# Expected: 2

# 3. Build
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
