---
name: library-plus-doc-template
id: SK-0024
keywords: [write-doc, capture-moment, pair-with-artifact]
goal: Every library entry has a companion doc that captures what it does and the moment that prompted it.
hash: 5e5bf4c
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  Any curated library (code scripts, cleaners, rules, prompts, fixtures,
  examples) must pair each entry with a companion doc that captures: what it
  does, the specific moment or pain that prompted it, the native UI/API
  patterns it uses, how to invoke it, variations to try, and what was
  deliberately NOT done. The doc is what makes the library teachable, searchable,
  and growable by others — including AI agents proposing new entries. Triggers
  on "add a doc alongside this", "what prompted this", "the moment that
  prompted it", "library doc template", "companion doc for this script/cleaner",
  "teachable library", "document this so future me understands", "every entry
  needs a story".
---

# Library + doc template — make every library entry teachable

The failure mode: a library of scripts/cleaners/prompts that nobody can extend because nobody knows why anything exists. The entries work, but there's no story, no origin, no cost note, no "what I tried first." Future contributors (including future-you and future-AI-agents) can only copy, never improve.

The fix: every library entry is a pair — the artifact (the .applescript, the cleaners.py tuple, the prompt, the fixture) + a companion Markdown doc that tells the complete story.

## When to use this skill

- Building or auditing any curated library (AppleScript library, cleaners.py, prompt library, fixture set, rules collection)
- Adding a new entry to an existing library
- An AI agent proposing a new entry via the review-inbox pattern
- Someone says "why does this exist?" and you don't have a good answer
- Onboarding a new contributor who needs to extend the library

## The mandatory seven fields of every companion doc

```markdown
# [Entry title]

**File:** `path/to/artifact.ext`
**Status:** ✅ Shipped in vX.Y.Z  /  💡 Proposed (in review inbox)
**Type:** Cleanup · Diagnostic · UI helper · Utility · Recovery · etc.

## What it does
Plain English. One paragraph. No marketing.

## The moment that prompted it
THE MOST IMPORTANT FIELD. The specific user pain, bug, or "I can't believe
I have to do this manually" moment. Future readers need to know WHY. Without
this, the entry becomes cargo-cult — everyone uses it, nobody knows when NOT to.

## [Patterns used / Dependencies / How it works]
Tool-specific. For AppleScripts: "Native macOS UI patterns used."
For cleaners: "Safety tier + cost annotation."
For prompts: "Model + context window."

## The full artifact
Either inline or "see [path]."

## How to invoke
Exact command or trigger phrase. No ambiguity.

## Variations / extensions
At least one bullet of "you might also want." This is where future contributors
find their next task.

## Related
Links to sibling entries, parent docs, plans that governed its creation.
```

## The "moment that prompted it" field is load-bearing

This field is what makes a library teachable vs just functional. It answers:
- When should I use this?
- What does the world look like that makes this the right choice?
- What was the previous state (before this existed)?

Examples of good vs bad:

| Good | Bad |
|---|---|
| "The user ran `git pull` and got 'There is no tracking information for the current branch.' That error message is technically accurate but useless to non-git-experts. This is the fix." | "A make target for updating." |
| "macOS file permissions can lock huge amounts of disk space behind UIDs that aren't the current user. The classic case: Homebrew installed by 'olivia' — `brew install` fails for the current user. This script finds it." | "Finds files owned by other users." |
| "DerivedData, iOS DeviceSupport, mediaanalysisd — every iOS dev has Googled which paths to rm -rf and every iOS dev has fat-fingered Archives at least once." | "Cleans Xcode caches." |

## When an AI agent is proposing a new entry

The `propose_new_applescript` / `propose_new_cleaner` tools enforce the doc structure by generating a template on accept:

```python
def generate_applescript_artifacts(proposal):
    # The doc template is generated from the proposal's rationale field.
    # The "moment that prompted it" section is pre-filled with the AI's
    # rationale, which the user edits to their own voice before committing.
    doc_lines = [
        f"## The moment that prompted it",
        "",
        f"_(Take the SADPA-proposed rationale below as a starting point and refine.)_",
        "",
        proposal.get("rationale", ""),  # AI provides the seed
    ]
```

The AI provides the seed. The human edits to voice and fills gaps. The library stays curated.

## The library README (the index that makes it navigable)

Every library folder must have a `README.md` that:
1. Explains the library's scope in one paragraph
2. Links to every entry (table: title, status, version)
3. States the style guide (voice, naming conventions, what belongs here)
4. States when to add a new entry (three-criteria gate: substantive, user-facing, stand-alone marketable)

```markdown
## When to add a new file
Three criteria:
1. Substantive — at least a full PR's worth
2. User-facing — visible in the product
3. Stand-alone — you'd explain just this in a tweet
```

## Anti-patterns

- ❌ "Self-documenting code" — code isn't a doc. Docs explain the moment, the intent, the origin.
- ❌ Doc without the "moment that prompted it" field — without it, nobody knows when NOT to use the entry.
- ❌ "Variations" left as TODO — always write at least one bullet. It takes 30 seconds and opens the door for the next contributor.
- ❌ No library README — without the index, the library is a folder of mystery files.

## Invocation

- "Use **library-plus-doc-template**."
- "Add the companion doc for this new library entry."
- "What's the doc format for entries in this library?"
- "The library entry needs a 'moment that prompted it' — write it."

## Reference implementation

DustPan's AppleScript library at [`applescripts/`](https://github.com/marvelousempire/dustpan/tree/main/applescripts). Four entries (`0001-dustpan-main.md` through `0005-quick-rescue-dry-run.md`), each with all seven fields. The pattern was designed in v0.26.0 and used for both hand-authored entries and AI-proposed ones (via `propose_new_applescript`). The doc template is auto-generated on accept and pre-filled with the AI's rationale for the user to refine.

Also: `docs/marketing/*.md` applies the same pattern to *feature marketing* — one MD per shipped feature with the complete story. See `feature-marketing-md` skill.
