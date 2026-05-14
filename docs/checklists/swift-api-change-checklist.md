# Swift API Change Checklist

Every time you change a Swift API surface (struct init, function parameters,
protocol, enum), run through this checklist BEFORE opening the PR.

Incomplete API migrations are the #2 cause of post-merge compile errors in
red-e-play-app (after broken pbxproj chains). Each item here maps to a real
error type from the 2026-05-14 repair session.

---

## When does this checklist apply?

Run this for any change that:
- Adds, removes, or renames a parameter in a struct `init` or function
- Adds a new protocol requirement
- Adds a property to a `Codable` struct with manual init/encode
- Adds a new enum case
- Adds or removes `@MainActor` isolation from a class

---

## Struct Init / Function Signature Change

- [ ] Old signature identified: `OldView(paramA:paramB:paramC:)`
- [ ] New signature identified: `OldView(paramX:paramY:)`
- [ ] Find all callers: `grep -rn "OldView(" --include="*.swift" .`
- [ ] Every caller updated in this PR — not in a follow-up
- [ ] Old signature deleted — no deprecated aliases left
- [ ] Build: zero "extra arguments" or "missing argument" errors

---

## Codable Model Property Addition (four-part requirement)

ALL FOUR must be in the same commit:

- [ ] Property declaration added: `var newProp: String?`
- [ ] `CodingKeys` case added: `case newProp`
- [ ] Decode call added (in `init(from decoder:)`): `newProp = try container.decodeIfPresent(String.self, forKey: .newProp)`
- [ ] Encode call added (in `func encode(to encoder:)`): `try container.encodeIfPresent(newProp, forKey: .newProp)`
- [ ] Codable guard: `grep -c "func encode(to encoder\|init(from decoder" "path/to/Model.swift"` = 2

---

## New Protocol Conformance Required

When a type is used in a context that requires a protocol (Equatable, Codable, Hashable):

- [ ] Identify why the protocol is required (onChange? JSONEncoder? Set?)
- [ ] Add the protocol to the struct/class declaration
- [ ] If synthesized: confirm all stored properties also conform
- [ ] If manual: implement the required methods
- [ ] Build: zero "requires X to conform to Y" errors

---

## @MainActor Isolation Change

When adding or removing `@MainActor` from a class:

- [ ] Find all async access sites: `grep -rn "ServiceName.shared\." --include="*.swift" .`
- [ ] Adding @MainActor: add `await` to every access from non-main async contexts
- [ ] Removing @MainActor: remove spurious `await` calls (they still compile but are misleading)
- [ ] Build: zero "expression is async but not marked with await" errors

---

## Enum Case Addition

- [ ] Find all exhaustive switches on the enum: `grep -rn "switch.*: EnumName\|switch self" --include="*.swift" .`
- [ ] Add the new case to every exhaustive switch
- [ ] For UX-string switches that could have a default: consider adding `@unknown default` to prevent future fragility
- [ ] Build: zero "switch must be exhaustive" errors

---

## Protocol Requirement Addition

When adding a new required method/property to a protocol:

- [ ] Find all conforming types: `grep -rn ": MyProtocol\|, MyProtocol" --include="*.swift" .`
- [ ] Add the implementation to every conforming type in this PR
- [ ] If a default implementation exists: verify the default is correct for each type
- [ ] Build: zero "does not conform to protocol" errors

---

## Final Build Check

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
  | grep -v "DEFINES_MODULE" \
  | sort -u
# Expected: empty output
```

- [ ] Zero errors related to this API change
- [ ] No new errors introduced (compare before/after error lists)

---

## The one rule behind all of this

From `rules/library/shared-util-extraction`:

> When you rename a function / type / route / endpoint, update every callsite
> in the same PR and delete the old name. Do not leave a deprecated alias.

If fixing all callers feels like too much for one PR, the PR is too big.
Split the API change into a separate PR and update callers atomically.
