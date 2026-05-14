---
name: swift-api-migration
description: >-
  Audit and update all callers when a Swift API signature changes — struct
  init, function parameters, protocol requirements, or enum cases. Triggered
  by "I changed this function signature", "callers are broken", "who uses
  this init", "find all callers of", "update callers for renamed function",
  or any Swift compile error with 'extra arguments' or 'missing argument'.
  Produces a complete caller map and updates every site in the same PR.
---

# swift-api-migration — find and update every caller when an API changes

In a multi-agent repo, API changes silently break callers in parallel
branches. When `PlayerAvatarView` gains a new `name:` parameter and drops
`playerID:displayName:`, callers in branches that haven't rebased will fail
with "extra arguments" errors that look like one-off fixes but are actually
a systematic migration gap.

## Rule: rename at the source, update every callsite, delete the old name

From `rules/library/shared-util-extraction`: no deprecated aliases, no
"kept as alias so cross-links keep working." Find every caller, update it,
delete the old definition. Done in one PR.

---

## Step 1 — Define what changed

Before grepping, write down:
- **Old signature:** `PlayerAvatarView(portraitAvatarURL:playerID:displayName:size:ringTier:)`
- **New signature:** `PlayerAvatarView(name:size:verificationStatus:reputationTier:portraitAvatarURL:)`
- **Mapping:** `displayName` -> `name`, `ringTier` -> `reputationTier`, `playerID` dropped, `verificationStatus` new default

---

## Step 2 — Find all callers

```bash
# For struct init changes
grep -rn "PlayerAvatarView(" --include="*.swift" .

# For function renames
grep -rn "oldFunctionName(" --include="*.swift" .

# For protocol conformance additions
grep -rn "struct\|class\|extension" --include="*.swift" . | grep "YourProtocol"
```

Build a list of every file and line number that needs updating.

---

## Step 3 — Update each call site

For each call site:
1. Read the surrounding context (what variables are available)
2. Map old parameters to new parameters
3. Drop parameters that no longer exist
4. Add new parameters with their defaults or computed values

Common patterns:
```swift
// Old: PlayerAvatarView(portraitAvatarURL: card.avatarURL, playerID: card.id,
//        displayName: card.displayName, size: 88, ringTier: nil)
// New: PlayerAvatarView(name: card.displayName, size: 88, portraitAvatarURL: card.avatarURL)

// Old: SomeService.shared.compute(input: x, legacyFlag: true, version: 1)
// New: SomeService.shared.compute(input: x)  // legacyFlag + version removed
```

---

## Step 4 — Protocol propagation

When adding a new protocol requirement to an existing protocol, find all conforming types:

```bash
# Find all types conforming to MyProtocol
grep -rn ": MyProtocol\|, MyProtocol" --include="*.swift" .
```

Check each conforming type for the new requirement. If the requirement
has a default implementation, verify the default is correct for each type.

---

## Step 5 — Codable property propagation (special case)

When adding a property to a `Codable` struct with manual `init(from:)`
and `encode(to:)`:

```bash
# Find the CodingKeys enum
grep -n "enum CodingKeys\|case <new_property_name>" "path/to/Model.swift"
```

Four things must be added in the same commit:
1. Property declaration: `var wellnessVisibility: String?`
2. CodingKeys case: `case wellnessVisibility`
3. Decode: `wellnessVisibility = try container.decodeIfPresent(String.self, forKey: .wellnessVisibility)`
4. Encode: `try container.encodeIfPresent(wellnessVisibility, forKey: .wellnessVisibility)`

Verify with codable-guard:
```bash
grep -c "func encode(to encoder\|init(from decoder" "path/to/Model.swift"
# Expected: 2
```

---

## Step 6 — Build and verify

```bash
xcodebuild -project "RedEPlay.xcodeproj" -scheme "RedEPlay" \
  -destination 'generic/platform=iOS Simulator' -configuration Debug \
  ONLY_ACTIVE_ARCH=YES build 2>&1 \
  | grep "error:" | grep -v "DEFINES_MODULE" | sort -u
```

Should be zero errors related to the migrated API.

---

## Why deprecated aliases are forbidden

Every deprecated alias:
- Creates two names for one thing — greps return double noise
- New developers use the wrong name 50% of the time (they don't read deprecation comments)
- Gets fresh callsites because "it's kept alive for cross-links"
- Accumulates until the file is a graveyard

Source: `rules/library/shared-util-extraction` (the canonical "fix at source" rule,
added after PR #704 which kept old route names as deprecated aliases and caused 9
callsite updates in a follow-up PR).
