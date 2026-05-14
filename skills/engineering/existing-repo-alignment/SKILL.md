---
name: existing-repo-alignment
id: SK-0136
hash: 9d4e1b8
keywords: [align-repo, reshape-structure, audit-existing]
relations: [new-repo-setup, avery-goodman-repo-standard, failure-proof-audit]
before: [failure-proof-audit, gap-audit-and-elevation]
governed_by: [RL-0039, RL-0045, global]
meta: dynamic
description: >-
  Non-destructively reshape an existing GitHub repo to align with the AVERY
  GOODMAN standard — without deleting what's already there. Diagnose the repo,
  identify its type, produce a change manifest, then execute carefully. Use when
  someone says "align this repo", "reshape this project", "bring this into our
  standard", "audit this existing repo", "make this match our structure",
  "convert this repo to our standard", "this old repo needs to follow our rules".
---

# existing-repo-alignment — reshape any repo without destroying what's there

The prime directive: **never delete, never overwrite without reading first**. Alignment is a migration, not a replacement. Everything in the existing repo has a reason — even if that reason is "accumulated debt." This skill diagnoses, maps, and reshapes — preserving all content while moving it into the right structure.

Apply `failure-proof-audit` (SK-0112) and `gap-audit-and-elevation` (SK-0113) BEFORE executing any changes. They surface what will break and what can be elevated.

---

## When to use this skill

- An existing GitHub repo needs to be brought into the AVERY GOODMAN standard
- A repo you inherited needs to be made legible and consistent
- Someone says "align this" or "reshape this" or "make this match our standard"

---

## The 5-phase alignment process

### Phase 1 — READ WITHOUT TOUCHING (mandatory first)

Before changing anything: read the entire repo. Understand what exists and why.

```bash
# Start here
git clone [repo-url] && cd [repo-name]
git log --oneline -20         # understand the history
ls -la                         # what's at the root
find . -not -path "./.git/*" -type f | sort  # every file
cat README.md                  # what does it say it is?
```

Document what you find:
- What is this repo? (guess the TYPE if not stated)
- What content exists? Where does it live?
- What's already aligned (keep it)?
- What's misaligned (move, not delete)?
- What's unknown (archive, don't delete)?

---

### Phase 2 — IDENTIFY THE TYPE

Map the repo to one of the 7 types. Check `templates/repo-types/README.md`.

```markdown
# docs/repo-type.md  ← create this file as part of the alignment

Type: TYPE-001-app   ← or whichever fits
Hybrid: TYPE-003-guide  ← secondary type if applicable
Aligned: 2026-05-14
By: [your name / AVERY GOODMAN]
Notes: This repo was originally structured as [describe original structure].
```

If you can't decide between types, it's a hybrid — pick the primary type based on which TYPE.md folder structure you'll use as the scaffold.

---

### Phase 3 — PRODUCE THE CHANGE MANIFEST (before touching anything)

A change manifest is a document listing exactly what will move, where it goes, and why. This is the plan you get approved before executing.

```markdown
# docs/alignment-manifest-[date].md

## Summary
Aligning [repo-name] from [current state] to TYPE-00X ([type name]).

## What stays exactly where it is
- src/ — already the correct pattern for BRAIN layer
- Makefile — already present, will add missing targets

## What moves (source → destination)
- README.md → stays, sections will be restructured (no content deleted)
- notes/ → docs/legacy/ (contents preserved, just relocated)
- setup.sh → scripts/setup.sh (renamed folder, same file)

## What gets added (new, doesn't overwrite anything)
- plans/ (new folder, empty initially)
- docs/repo-type.md (new file)
- docs/marketing/ (new folder)
- .github/workflows/release.yml (new file)

## What gets archived (content that doesn't map anywhere)
- misc/ → archive/misc/ (keeping everything, just labeled as archive)

## What gets NOTHING done to it
- node_modules/, .git/, any lock files — never touched

## Reversibility
- This entire alignment can be undone by: git revert [commit-range]
- All original content is preserved — nothing is deleted
```

Run `failure-proof-audit` (SK-0112) on this manifest before proceeding to Phase 4.

---

### Phase 4 — EXECUTE (carefully, one section at a time)

Work in a safe branch. Never touch main directly.

```bash
git checkout -b align-to-avery-goodman-standard
```

Execute in this order:
1. **Add new empty folders first** (`.gitkeep` files) — no risk
2. **Move files that belong elsewhere** — use `git mv` so history is preserved
3. **Restructure the README** — reorganize into 10 sections, keep all content
4. **Add new files** — `docs/repo-type.md`, `plans/`, Makefile targets
5. **Archive unmapped content** — move to `archive/` or `docs/legacy/`
6. **Update internal links** if any files were moved

Commit after each logical group — small commits, not one giant commit.

```bash
git mv notes/ docs/legacy/
git commit -m "align: move notes/ to docs/legacy/ (content preserved)"

git mv setup.sh scripts/setup.sh
git commit -m "align: move setup.sh to scripts/ (standard TOOLS folder)"
```

---

### Phase 5 — VERIFY AND SHIP

```bash
# The aligned repo must pass:
make check               # if Makefile exists or was created
git log --oneline -10    # history is intact, nothing force-pushed
find . -name "*.md" | xargs grep "\[PLACEHOLDER\]"  # no placeholders left

# Run gap-audit-and-elevation on what was done
# (SK-0113) — what's still missing? what could be elevated?
```

Open a PR titled: `align: bring [repo-name] to AVERY GOODMAN standard (TYPE-00X)`

PR body must include:
- What type was assigned
- Summary of what moved (no deletions)
- Link to the alignment manifest
- Confirmation that all original content is preserved

---

## The content preservation rules (never break these)

1. **Never delete.** If content doesn't map, archive it in `archive/` or `docs/legacy/`. The owner decides later.
2. **Never overwrite without reading.** If a file already exists at the destination, read both versions first.
3. **Use `git mv` for moves.** This preserves git history and makes the move reversible.
4. **One logical group per commit.** Small commits = easy to reverse if something is wrong.
5. **Create a branch. Always.** Never align directly on main.
6. **Document what you did.** The alignment manifest lives in `docs/` so future AIs know what happened.

---

## Using the ai-skills-library to help

These skills power the alignment process:

| Task | Skill to invoke |
|---|---|
| Audit the existing repo for gaps | `failure-proof-audit` (SK-0112) |
| Identify what's missing and what to elevate | `gap-audit-and-elevation` (SK-0113) |
| Apply the README brand standard | `avery-goodman-repo-standard` (SK-0003) |
| Set up the repo architecture | `product-repo-architecture` (SK-0007) |
| Add Makefile safety targets | `make-update-make-doctor` (SK-0026) |
| Confirm ship after alignment | `confirm-ship-clearly` (SK-0016) |

---

## What this is NOT for

- Not for repos that should stay as-is (if the owner hasn't asked for alignment, don't force it)
- Not for migrating data between databases or services — this is strictly repo structure
- Not for creating new repos from scratch — use `new-repo-setup` (SK-0135) for that

---

## Anti-patterns

- ❌ Deleting files during alignment — archive, never delete
- ❌ Doing the whole alignment in one massive commit — breaks reversibility
- ❌ Touching main directly — always a branch, always a PR
- ❌ Skipping the change manifest — if you don't document what will move, something important gets lost
- ❌ Using `cp` instead of `git mv` — loses history and makes the move irreversible

---

## Invocation

- "Use **existing-repo-alignment**."
- "Align this repo to the AVERY GOODMAN standard."
- "Reshape this existing project without breaking anything."
- "Bring this repo into our standard."

---

## Reference implementation

The DustPan v0.21 rebrand is the canonical example of what happens when alignment is done WITHOUT this skill — `bin/xcc` kept old references for 65 days, `make ui` became a no-op. The v0.25.4 rebrand sweep (PR #61) is the canonical example of alignment done correctly — reading first, mapping before touching, CI assertions added after.
