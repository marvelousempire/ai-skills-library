---
name: cost-annotation-discipline
id: SK-0018
keywords: [annotate-cost, classify-tier, label-action]
hash: 2ecc801
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  Every destructive action (delete, clean, reset, migrate, prune, archive,
  format, revoke) must declare its plain-English cost to the user BEFORE the
  button is clicked. Not after, not in fine print, not "trust me." Curated text
  living in source, never AI-generated at runtime. Reusable for any tool that
  performs reversible damage. Triggers on "destructive action", "are you sure",
  "irreversible operation", "what does this delete", "before deleting", "before
  the click", "cleanup tool", "what's the cost of this", "make this safer",
  "every button needs a warning".
---

# Cost annotation discipline — name what you'll lose before the click

Most apps that delete things tell the user "this will remove unnecessary files." Useless. Necessary to whom? In what way? "Unnecessary" is the lie that lets sales-y "Mac cleaner" tools push the bigger-the-number-the-better story while quietly deleting things you actually wanted.

The opposite design: **every destructive button carries a curated `cost` annotation in plain English**. Not what gets deleted — *what slows down, what re-downloads, what re-builds, how long*.

This is one of the single biggest UX differentiators between a tool you trust and a tool that scares you.

## When to use this skill

- Building any **delete / clean / reset / prune / migrate / format / revoke** affordance
- Designing a confirmation modal that asks "are you sure?"
- Writing copy for a button that performs a reversible action
- Auditing a tool that "removes unnecessary files" — you're about to fix it
- The user says "make this safer" or "I don't trust what this does"

## The core principle

> Every destructive action gets a `cost` field. The field is **curated** (lives in source, reviewed by a human) and is **specific** (names what slows down, by how much, for how long, the first time it happens).

The `cost` field is shown in:
1. The button's tooltip / hover preview
2. The confirmation modal that fires before the action runs
3. Any AI agent's approval card that surfaces the same action
4. Documentation describing the action

The same text shows up in all four surfaces. **The AI agent never generates this text** — it pulls it verbatim from the source. So users never see hallucinated reassurances.

## Examples (good)

| Action | Cost annotation |
|---|---|
| Clear Xcode DerivedData | "One slower Xcode build. That's it." |
| Clear iOS DeviceSupport | "1–2 min re-download next time you plug in a device." |
| Docker system prune | "Re-pull a removed image takes 1–5 min on next `docker run`." |
| Clear Chrome cache | "First load of each website is 1–3 seconds slower until cache rebuilds." |
| Clear app workspace state | "Open tabs and recent file lists reset. No code/projects affected." |
| Photo library re-index | "Face recognition re-learns over a few hours in the background." |

## Anti-patterns

- ❌ **"Removes unnecessary files."** Vague. The user has no idea what they're agreeing to.
- ❌ **"This is safe."** Untestable. Refer to the cost, don't assert safety.
- ❌ **No cost text at all.** Forcing the user to Google the path before clicking.
- ❌ **AI-generated cost text at runtime.** Hallucinated. Use curated text from source.
- ❌ **Marketing-language cost text** ("Free up valuable disk space!"). The user can already see the size; tell them what they lose.

## Tiered safety pairing

Cost annotations work best paired with a **safety tier classification**:

- **safe** — always reclaimable, cost is trivial ("one slower build")
- **probably_safe** — usually fine, cost is noticeable ("re-download next time")
- **caution** — needs human review, cost is data loss ("lose crash symbolication for shipped App Store builds")

A "Clean ALL safe" affordance MUST NEVER reach the caution tier. The tier is a structural guarantee in addition to the annotation.

## Where the annotation lives in source

Pick a data structure for your tool that forces `cost` to be a required field. In DustPan it's:

```python
"clear-deriveddata": {
    "label": "Clear Xcode Build Cache (DerivedData)",
    "desc":  "Removes ~/Library/Developer/Xcode/DerivedData/* — Xcode's scratch pad where it saves build work.",
    "cost":  "One slower Xcode build. That's it.",   # ← required, curated
    "shell": "rm -rf ~/Library/Developer/Xcode/DerivedData/*",
},
```

Linting / code-review enforces that `cost` cannot be empty for any destructive action.

## When the cost annotation step changes the design

Writing the cost honestly often surfaces that an action you marked "safe" actually isn't:

- DustPan once classified `com.apple.sharedfilelist` as safe ("just preferences"). Writing the annotation forced asking: *which* preferences? Answer: Finder sidebar favorites. Clearing would delete the user's saved sidebar. **Reclassified to caution-only.**
- iCloud Drive caches were marked safe. Annotation: "files re-download from iCloud." But — "files might be partial downloads currently syncing." Clearing breaks in-progress syncs. **Moved to probably_safe with explicit warning.**

The annotation is a design tool, not just marketing copy.

## Invocation

- "Use **cost-annotation-discipline**."
- "Add cost annotations to every action in this tool."
- "Audit this cleanup tool for what's missing a cost note."
- "Make this safer — every button should name what it costs."

## Reference implementation

DustPan's [`web/cleaners.py`](https://github.com/marvelousempire/dustpan/blob/main/web/cleaners.py) is the canonical example. Every action carries `label`, `desc`, `cost`, and `shell`. The marketing brief [`docs/marketing/every-cleanup-tells-you-the-cost.md`](https://github.com/marvelousempire/dustpan/blob/main/docs/marketing/every-cleanup-tells-you-the-cost.md) describes the principle in depth with case studies of annotation work surfacing classification mistakes.
