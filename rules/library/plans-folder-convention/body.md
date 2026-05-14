---
name: plans-folder-convention
id: RL-0033
keywords: [enforce-plans, check-folder, build-convention]
hash: 3188ef5
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Plans Folder Convention — every repo, every substantive change

Every substantive change to any project we ship starts with a plan that is
**committed to the repo's `plans/` folder** in git. The plan is the source
of truth for *why* a change happened. Git history tells the *what*.

This applies to every project. Web app, CLI tool, library, infrastructure —
all of them get a `plans/` folder at the repo root.

---

## Why this exists

Without it:
- Plans get lost in chat. Six months from now nobody can find them.
- Plans get lost in `~/.claude/plans/` — a local-only, session-scoped, single-
  machine directory that nobody else can read.
- A new Claude Code session can't pick up where the last one left off
  without the maintainer re-explaining context.
- When something looks weird in the code, there's no defensible record of
  *why* it ended up that shape.

With it:
- **Searchable history.** `grep "running-cleans" plans/*.md` answers
  six-months-later questions in one command.
- **Continuity across sessions.** A new session reads `plans/` and picks up
  where the last left off.
- **A defensible record** when something in the schema or UI looks odd —
  the plan that proposed it sits right there in the repo.

---

## Required structure

Every repo has a `plans/` directory at the root:

```
my-app/
├── README.md
├── plans/
│   ├── README.md                                    ← the convention itself
│   ├── 0001-snake-case-title.md
│   ├── 0002-next-thing.md
│   └── …
└── …
```

### `plans/README.md`

A short doc explaining the convention to anyone (human or AI) opening the
repo for the first time. Use this template:

```markdown
# Plans

Every substantive change to <PROJECT NAME> starts with a plan that lives in
this folder, checked into git. The plan is the source of truth for *why* a
change happened. Git history tells the *what*.

## Convention

- **Filenames:** `NNNN-snake-case-title.md` where `NNNN` is a zero-padded
  integer starting at `0001`. Numbers are append-only.
- **One plan per file.** Never edit an old plan to "update" it — supersede
  it with a new plan that links back to the old one.
- **Required sections, in order:**
  - **Context** — why this change is being made, what prompted it, the
    intended outcome.
  - **Approach** — the one approach we are picking. Concrete shape:
    filenames, columns, endpoints, signatures.
  - **Critical files** — paths that will be created or modified.
  - **Verification** — how we will know the change worked, end-to-end.
- **Status line at the top** when a plan ships:
  `Status: shipped (commit <sha>, v<version>)`.
  Partial shipping: `Status: partially shipped — <what> shipped, <rest>
  deferred to plan NNNN`.

## Index

| # | Title | Status | Version |
|---|---|---|---|
| [0001](0001-…)  | …  | shipped | v0.X.Y |
```

---

## Required per-plan format

Every plan file follows the same skeleton:

```markdown
Status: shipped (commit <sha>, v<version>)        ← if/when shipped

# Plan NNNN — <Short Title>

## Context

Why this change. What prompted it. What outcome we are aiming for.
Cite the user's request verbatim if relevant. Cite any
upstream rule or decision that constrained the approach.

## Approach

The ONE approach we are picking. Not all the alternatives.
Concrete: filenames, columns, endpoints, signatures.
Sub-sections allowed (Phase 1 / Phase 2 / etc).

## Critical files

| File | Change |
|---|---|
| `path/to/file.ts` | Description of what changes |

## Verification

Numbered list of how we will confirm the change worked end-to-end.
Be specific: which command, which URL, what we expect to see.
```

---

## Workflow — when you write a plan, save it here

Every time you (Claude / Cursor / a human) writes a plan document during a
session — whether through plan mode, free-form planning, or anywhere else —
**copy it into the repo's `plans/` folder before starting the implementation.**

Concretely:

1. **Plan mode active?** Write the plan to the plan file as usual.
   *Then ALSO* copy it to the repo as the next numbered file:
   `plans/<NNNN>-snake-case-title.md`.
2. **Plan written in chat without plan mode?** Same: copy it to
   `plans/<NNNN>-snake-case-title.md` before implementing.
3. **Use the next available number.** Look at `plans/`, increment by one.
4. **Update `plans/README.md`'s index table** with the new row.
5. **After shipping**, edit the plan's status line:
   `Status: shipped (commit <sha>, v<version>)`.

---

## What counts as "substantive"

| Counts | Doesn't count |
|---|---|
| New feature | Typo fix |
| Restructure / refactor | One-line bug fix |
| New dependency added | Renaming a variable |
| Schema or API change | Updating a CHANGELOG entry |
| Deploy-shape change (new make target, new build step) | Reformatting code |
| Anything that takes >2 sentences to explain in a commit message | Anything that fits in a 1-sentence commit message |

Rule of thumb: **if explaining *why* you made the change would take more
than two sentences, write a plan first.**

---

## Don't

- Do **not** edit an old plan to "update" it. Plans are immutable history.
  If circumstances changed, write a new plan that supersedes the old one,
  and link the new one from the old plan's status line.
- Do **not** delete plans. Even shipped ones stay forever — they're the
  record.
- Do **not** put plans in `docs/`. The `plans/` folder is intentionally
  separate so it has its own discipline. Docs is for the *current* state;
  plans is for the *historical record of decisions*.
- Do **not** number plans out of order or skip numbers. Append-only.
