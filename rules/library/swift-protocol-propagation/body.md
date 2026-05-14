---
name: swift-protocol-propagation
id: RL-0042
keywords: [enforce-swift, check-protocol, build-propagation]
goal: Deliver swift protocol propagation output correctly and completely.
hash: 8698320
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Swift protocol propagation — propagate every API change to all consumers

When you change a Swift API surface, every consumer must be updated in the
SAME PR. No exceptions. This rule applies to:
- Struct or class initializer signatures
- Protocol requirements
- Codable model properties (the four-part requirement)
- Enum case additions
- @MainActor vs non-actor isolation boundaries

---

## Struct init changes

When a struct's `init` gains, loses, or renames a parameter:

**Step 1:** Find all call sites
```bash
grep -rn "StructName(" --include="*.swift" .
```

**Step 2:** Update every call site in the same PR.

**Step 3:** Build verifies — zero "extra arguments" or "missing argument" errors.

**Real example (red-e-play-app PR #826):** `PlayerAvatarView` dropped
`playerID:displayName:ringTier:` and added `name:verificationStatus:reputationTier:`.
Two callers in `BumpLobbyInviteSheet.swift` and `BumpLobbyView.swift` used the
old signature. Compile errors that would not have existed if the migration had
been done atomically in the original PR.

---

## Codable model property additions (four-part requirement)

When adding a property to a Swift struct that implements Codable with
manual `init(from:)` and `encode(to:)`, ALL FOUR of these must land in
the same commit:

| What | Where | Miss it -> |
|---|---|---|
| Property declaration | struct body | Compile error if used |
| `CodingKeys` case | `enum CodingKeys` | Compile error: "type has no member" |
| Decode call | `init(from decoder:)` | Property always nil at runtime |
| Encode call | `func encode(to encoder:)` | Property never persisted/transmitted |

**Real example (red-e-play-app PR #826):** `Player.wellnessVisibility` was
declared at line 177 and decoded at line 557, but `case wellnessVisibility`
was missing from `CodingKeys`. Build error: `type 'Player.CodingKeys' has
no member 'wellnessVisibility'`.

**Verification (from swift-codable-guard rule):**
```bash
grep -c "func encode(to encoder\|init(from decoder" "path/to/Model.swift"
# Expected: 2
```

---

## Protocol conformance additions

When adding a new protocol requirement (e.g. `Equatable`) to an existing
type, find all uses of that type that require the protocol:

```bash
# Find onChange(of:) and similar that require Equatable
grep -rn "onChange(of: service\." --include="*.swift" .
```

**Real example (red-e-play-app PR #826):** `BumpLobbyService.PendingInvite`
was used in `.onChange(of: service.pendingInvite)` which requires `Optional<PendingInvite>`
to be `Equatable`. `PendingInvite` had no `Equatable` conformance. Fix: add
`: Equatable` to the struct declaration (synthesized automatically since all
stored properties are `Hashable`, which implies `Equatable`).

---

## Codable conformance for encode/decode contexts

When a type is used in `JSONEncoder().encode()` or `JSONDecoder().decode()`,
it must conform to `Codable`. Add the conformance when the usage is added,
not as a follow-up.

**Real example (red-e-play-app PR #826):** `MiniGameConfig` was `Hashable`
but not `Codable`. `BumpLobbyView` called `lobbyEncoder().encode(config)`
where `config: MiniGameConfig`. Fix: add `Codable` to the struct declaration.
All member types (`MiniGameVariant`, `MiniGameParticipant`, `Int`, `Bool`,
`String`) were already `Codable`, so synthesis was automatic.

---

## @MainActor isolation boundaries

When a class is `@MainActor` and accessed from a non-main async function,
every call requires `await`. This is NOT optional — it is a Swift concurrency
requirement.

```swift
// InvitationService is @MainActor final class

// From a non-@MainActor async function:
// WRONG: let pending = InvitationService.shared.pendingInviter
// RIGHT: let pending = await InvitationService.shared.pendingInviter

// WRONG: InvitationService.shared.clearPendingInviter()
// RIGHT: await InvitationService.shared.clearPendingInviter()
```

**Diagnose:** Check whether the service is marked `@MainActor`:
```bash
grep -n "@MainActor" "path/to/ServiceFile.swift" | head -3
```

If yes, every access from an async context that is not explicitly `@MainActor`
or `DispatchQueue.main` needs `await`.
