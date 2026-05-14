---
name: three-tier-safety-classification
id: SK-0011
keywords: [classify-tier, enforce-safety, gate-action]
goal: No auto-clean ever reaches irreplaceable data — the safety tier is a structural code guarantee.
hash: 7a877e9
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  Classify every destructive action into exactly one of three safety tiers:
  safe (always reclaimable, rebuild is trivial), probably_safe (rebuild exists
  but takes noticeable time or effort), caution (irreplaceable or high-risk
  data — surface it, never auto-clean it). The tier is a structural guarantee
  in code, not just a label. "Clean ALL safe" affordances must never reach the
  caution tier. Triggers on "safety tier", "safe vs caution", "clean all safe",
  "never auto-delete this", "tier classification for destructive actions",
  "how safe is this cleanup", "irreplaceable data flag", "auto-clean boundary".
---

# Three-tier safety classification — structural guarantee for destructive tools

The mistake every Mac cleaner makes: treating all deletions as equal, giving users a "clean everything" button, and hoping the curators got it right every time. One fat-fingered `rm -rf ~/Library/Developer/Xcode/Archives` and crash symbolication for a shipped App Store build is gone forever.

The fix: three tiers with a **structural guarantee** — not just a label, but a guarantee enforced in code that prevents any auto-clean from reaching the wrong tier.

## When to use this skill

- Building any destructive-action system (disk cleanup, data migration, config reset, cache prune)
- Adding a new cleanup target and deciding where it belongs
- Auditing an existing tool for "this might delete something irreplaceable"
- The user says "make this safer" or "I don't want to accidentally delete X"
- Designing the "Clean ALL" affordance for a multi-item tool

## The three tiers (canonical definitions)

| Tier | Definition | Auto-clean allowed? | Example |
|---|---|---|---|
| **safe** | Rebuilds automatically with no user-visible cost > "slightly slower once." The user loses nothing — they just wait. | ✅ Yes, in "Clean ALL safe" flows | Xcode DerivedData, browser cache, npm cache, `pip` cache |
| **probably_safe** | Rebuilds exist but take noticeable time, require a device, or lose convenience state (open tabs, recent file lists). The user loses something minor. | ⚠️ Opt-in only — never auto | iOS DeviceSupport (1–2 min re-download), workspace state history |
| **caution** | Irreplaceable, high-risk, or requires human judgment. May contain user data, active state, or be involved in inflight processes. | ❌ Never — surface only | Xcode Archives, iOS device backups, active simulators, any backup file |

## The structural enforcement (what makes it a guarantee, not just a label)

```python
# cleaners.py — the data structure enforces the tier
CATEGORIES = {
    "xcode": {
        "groups": {
            "safe":           [("Xcode DerivedData", "~/Library/Developer/Xcode/DerivedData")],
            "probably_safe":  [("iOS DeviceSupport", "~/Library/Developer/Xcode/iOS DeviceSupport")],
            "caution":        [("Xcode Archives", "~/Library/Developer/Xcode/Archives")],
        }
    }
}

# server.py — the clean-all endpoint is hard-gated by tier
def _stream_clean_all(category_id, tier):
    cat = CATEGORIES.get(category_id)
    allowed_tiers = ["safe"]  # never "probably_safe", never "caution"
    if tier not in allowed_tiers:
        return self._serve_json_status(403, {"error": "tier not auto-cleanable"})
    # ... clean only paths in the requested tier
```

The "Clean ALL safe" button cannot reach `probably_safe` or `caution` paths. This is not a runtime check — it's the structure of the data.

## The cost annotation that must accompany every tier

Each tier maps to a cost annotation written in the source file (not AI-generated):

| Tier | Cost annotation tone |
|---|---|
| **safe** | "One slightly slower Xcode build." "Cache rebuilds on next use." |
| **probably_safe** | "1–2 min re-download next time you plug in a device." "Open tabs and recent file lists reset." |
| **caution** | "App Store crash symbolication will break for all currently-shipped builds." "You cannot recover this without the original device." |

The cost annotation is the human-readable version of the tier. The tier is the structural enforcement. Both are required.

## How the cost annotation step surfaces misclassification

Writing the cost honestly often reveals that something you marked "safe" isn't:

- `com.apple.sharedfilelist` — marked "safe" as "just preferences." Writing the cost forced the question: which preferences? Answer: Finder sidebar favorites. Reclassified to caution-only.
- iCloud Drive caches — marked "safe." Writing the cost: "files re-download from iCloud." But — files might be partial downloads actively syncing. Reclassified to probably_safe.

**The cost annotation is a design tool, not just marketing copy.** Use it to catch tier mistakes before shipping.

## AI agents and tier classification

When the AI agent proposes a new cleaner (`propose_new_cleaner` tool), it must supply a `tier` per path:

```json
{
  "paths": [
    {"label": "IntelliJ caches", "path": "~/Library/Caches/JetBrains", "tier": "safe"},
    {"label": "Workspace state", "path": "~/Library/Application Support/JetBrains/.../workspace", "tier": "probably_safe"}
  ]
}
```

The tool enforces the tier schema. The human reviews the classification at accept time. The curated source file is the final authority.

## Anti-patterns

- ❌ "Safe by default" applied to anything not fully understood. Default to `caution` when unsure; downgrade after research.
- ❌ Tier as a label without structural enforcement. Users will click "Clean ALL" thinking it's safe; the code must guarantee it.
- ❌ A "Clean EVERYTHING" button that crosses tiers without explicit opt-in for each tier. The probably_safe and caution paths must each require individual confirmation.
- ❌ Caution paths shown but hidden — if you surface them, explain the cost. If you don't understand the cost well enough to explain it, don't surface them at all.

## Invocation

- "Use **three-tier-safety-classification**."
- "Classify this cleanup target into the right tier."
- "Audit the tier assignments in this cleanup tool."
- "Make sure 'Clean ALL' can never reach the irreplaceable data."

## Reference implementation

DustPan's [`web/cleaners.py`](https://github.com/marvelousempire/dustpan/blob/main/web/cleaners.py) — every category has three groups. The enforcement is in `_stream_clean_all()` in `server.py` which only accepts `tier = "safe"`. The cost annotations are in the `actions` dict of each category. The tier-classification-caught-misclassification stories are in [`docs/marketing/every-cleanup-tells-you-the-cost.md`](https://github.com/marvelousempire/dustpan/blob/main/docs/marketing/every-cleanup-tells-you-the-cost.md).

Pairs with: `cost-annotation-discipline` (the annotation that expresses the tier in human language).
