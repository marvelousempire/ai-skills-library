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
