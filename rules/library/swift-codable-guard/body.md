---
name: swift-codable-guard
id: RL-0041
keywords: [enforce-swift, check-codable, build-guard]
hash: bc894a2
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Swift Codable models — guard after rebase

Swift's type checker does not catch the most dangerous class of `Codable`
corruption that rebase conflict resolution produces: **encode calls inside
`init(from decoder:)`.**

When a conflict-resolution script takes the HEAD side of a block, it can
strip the `func encode(to encoder: Encoder) throws {` declaration that
separates the decode section from the encode section. The encode calls end
up inside `init(from:)`. This compiles without error — a
`KeyedDecodingContainer` does not have `encode` methods, but Swift's
inference sometimes resolves the overload differently, and in the worst
case the model decodes fine but encodes nothing, silently.

---

## The check — run after every rebase touching a Codable model

```bash
grep -c "func encode(to encoder\|init(from decoder" \
  "Red-E Play/Red-E Play/Shared/Models/Player.swift"
```

Expected output: `2` (one for each function declaration).

If you get `1` or `0`, the file is structurally broken. The missing
declaration must be re-inserted manually.

### Canonical structure

```swift
// inside the struct / class
init(from decoder: Decoder) throws {
    let container = try decoder.container(keyedBy: CodingKeys.self)
    // ... only decodeIfPresent / decode calls here ...
}   // ← this closing brace must exist before encode begins

func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    // ... only encode / encodeIfPresent calls here ...
}
```

The two functions must be **separately declared**. A single function
body containing both decode and encode calls is invalid semantics even
if it compiles.

---

## How to spot the corruption

The tell-tale sign: `encode` calls immediately follow the last `decode`
call without an intervening function declaration:

```swift
        // last decode call
        wellnessVisibility = try container.decodeIfPresent(...)
        try container.encode(isGuest, forKey: .isGuest)   // ← wrong context
```

The fix is to insert the function boundary between them:

```swift
        wellnessVisibility = try container.decodeIfPresent(...)
    }   // closes init(from:)

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(isGuest, forKey: .isGuest)
```

---

## When to run this check

- After any `git rebase` or `git merge` that shows `Player.swift` (or
  any other `Codable` model) as a conflict or auto-merged file.
- After running any automated conflict-resolution script on Swift files.
- Before opening a PR that touches `Shared/Models/`.

---

## Scope

This rule applies to any Swift file that:
- Declares `Codable`, `Encodable`, or `Decodable` conformance
- Has explicit `init(from:)` and `encode(to:)` implementations (not
  synthesized — synthesized conformance has no declarations to lose)

Models that rely entirely on synthesized Codable (no custom init/encode)
are not at risk.

---

## Three-way Codable fix: property + CodingKeys + decode + encode

A common failure mode is adding a property and its decode/encode calls, but
forgetting the `CodingKeys` case. The build error is:

```
error: type 'Player.CodingKeys' has no member 'wellnessVisibility'
```

This is a compile error (caught at build time), but missing the *encode* call
is silent data loss (never caught, property disappears on every sync).

**All four must be added in the same commit:**

```swift
// 1. Property declaration
var wellnessVisibility: String?

// 2. CodingKeys case (THIS is the one that's most often forgotten)
enum CodingKeys: String, CodingKey {
    // ... existing cases ...
    case wellnessVisibility  // ADD THIS
}

// 3. Decode (in init(from:))
wellnessVisibility = try container.decodeIfPresent(String.self, forKey: .wellnessVisibility)

// 4. Encode (in encode(to:))
try container.encodeIfPresent(wellnessVisibility, forKey: .wellnessVisibility)
```

The `wellnessVisibility` case specifically: in red-e-play-app PR #826, this
property was declared at line 177 and had a decode call at line 557, but the
`CodingKeys` enum had no `case wellnessVisibility`. Result: compile error on
every build until the case was added.

---

## Also check: Codable conformance itself may be missing

A type used in `JSONEncoder().encode(x)` must conform to `Codable`.
If the type is `Hashable` but not `Codable`, the error is:

```
error: type 'MiniGameConfig' has no conformance to 'Codable'
```

Fix: add `Codable` to the conformance list. If all stored properties already
conform (which `String`, `Int`, `Bool`, `UUID` do), Swift synthesizes the
implementation automatically.

This is a different failure mode from the `func encode(to:)` structural check
above — that check only applies to types with *manual* Codable implementations.
