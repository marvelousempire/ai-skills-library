---
name: new-repo-setup
id: SK-0135
hash: f2a7c3d
keywords: [setup-repo, scaffold-structure, initialize-standard]
relations: [avery-goodman-repo-standard, product-repo-architecture, make-check-defense-in-depth]
before: [plan-first-substantive-changes]
governed_by: [RL-0039, RL-0045, global]
meta: dynamic
description: >-
  Start any new repo from scratch following the AVERY GOODMAN standard.
  Pick a type (TYPE-001 through TYPE-007), scaffold the folder structure,
  install the README template, wire up the Makefile, and confirm the first
  commit is clean. Use when someone says "start a new repo", "set up a new
  project", "create a repo from scratch", "how do I start this project",
  "new app repo", "new library repo", "new guide repo", "initialize a repo",
  "scaffold this project".
---

# new-repo-setup — start any repo the right way from the first commit

A repo started wrong is never fully fixed. Folder names change but never really disappear. READMEs accumulate debt. The first commit sets the architecture. This skill makes the first commit correct.

---

## When to use this skill

- Starting any new project under AVERY GOODMAN
- Someone says "create a new repo" or "set up this project"
- The project doesn't exist yet — nothing to preserve, everything to create correctly

---

## Step 1 — Pick the type

Open `templates/repo-types/README.md` in the ai-skills-library. Match the project to a type:

| TYPE-001 | App | Has a user-facing interface |
| TYPE-002 | Library | Other repos pull from this |
| TYPE-003 | Guide | People read it to learn how to do something |
| TYPE-004 | Book | Long-form written work with chapters |
| TYPE-005 | UI System | Design tokens, components, visual standards |
| TYPE-006 | API | Backend service or endpoint layer |
| TYPE-007 | Tool | CLI, utility, or automation tool |

If it's a hybrid: pick the primary type and note the secondary in `docs/repo-type.md`.

---

## Step 2 — Open the TYPE.md for your chosen type

`templates/repo-types/TYPE-00X-name/TYPE.md` — read it fully. It contains:
- The standard folder structure (your scaffold target)
- The README sections
- The ai-skills-library skills to invoke
- The setup checklist

---

## Step 3 — Scaffold the structure

Create every folder in the TYPE.md tree. For empty folders, add `.gitkeep`:

```bash
# Example for TYPE-001 App:
mkdir -p plans docs/marketing apps/web web scripts assets bin .github/workflows
touch plans/.gitkeep docs/marketing/.gitkeep assets/.gitkeep

# Create the type record so any future AI knows what this repo is
cp ~/Developer/ai-skills-library/templates/repo-types/TYPE-001-app/TYPE.md docs/repo-type.md
```

---

## Step 4 — Copy and fill the README template

```bash
# The AVERY GOODMAN brand mark goes first — always
```

Structure:
```markdown
# [App Name]
**managed by the duty and order of AVERY GOODMAN**

> [Tagline]

## IDENTITY
## PURPOSE
## START
## SURFACE
## COMMANDS
## ENGINE
## INSTALL
## STANDARDS
## RELEASES
## CREDIT
```

Fill every section. No placeholders in the final README. If a section doesn't apply yet, write one sentence explaining what will go there when it's ready.

Invoke **SK-0003** (`avery-goodman-repo-standard`) for the full section definitions, tone guide, and one-word folder label system.

---

## Step 5 — Initialize the Makefile

Minimum targets for any repo:

```makefile
.PHONY: help check update doctor
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

check: ## Verify the repo is healthy
	@echo "✓ check passed"

update: ## Pull latest from main safely
	@git fetch origin && git pull --ff-only origin main

doctor: ## Diagnose the install
	@echo "Branch: $$(git rev-parse --abbrev-ref HEAD)"
	@echo "Status: $$(git diff-index --quiet HEAD -- && echo clean || echo dirty)"
```

Add type-specific targets after. Run `make help` — if it prints cleanly, the Makefile is wired correctly.

---

## Step 6 — Write the first plan

```
plans/0001-initial-setup.md
```

Required sections: Context (why this repo exists) · Approach (what the initial structure contains) · Critical files · Verification.

This plan is the permanent record of why this repo exists and what it was designed to do.

---

## Step 7 — Wire the auto-release GitHub Action

```yaml
# .github/workflows/release.yml
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: v${{ steps.ver.outputs.version }}
          generate_release_notes: true
```

Read `product-repo-architecture` (SK-0007) for the full auto-release pattern including how to read version from the canonical file.

---

## Step 8 — First commit and verify

```bash
git add .
git commit -m "v0.1.0: initial repo setup — TYPE-00X [App/Library/Guide/etc]"
git push -u origin main
```

Then verify:
- `make check` passes
- `make help` shows all targets
- README has no `[bracketed placeholders]` remaining
- `plans/0001-initial-setup.md` exists
- `docs/repo-type.md` exists with the correct TYPE-ID

---

## What this is NOT for

- Not for reshaping existing repos — use `existing-repo-alignment` (SK-0136) for that
- Not for deciding WHAT to build — use `plan-first-substantive-changes` (SK-0032) first

---

## Anti-patterns

- ❌ Creating folders without committing to a type — structure drifts every time someone adds something
- ❌ README with vague sections ("About this project") instead of the 10 standard sections
- ❌ No `plans/` folder — the first unexplained decision is a future debt
- ❌ No Makefile — the entry point contract is broken from day one
- ❌ Leaving bracketed placeholders in the README — they signal an unfinished standard

---

## Invocation

- "Use **new-repo-setup**."
- "Start a new repo the AVERY GOODMAN way."
- "Set up this project from scratch."
- "Initialize this repo with the standard structure."

---

## Reference implementation

DustPan is the TYPE-007 (Tool) reference. `ai-skills-library` is the TYPE-002 (Library) reference. Both live at `github.com/marvelousempire/`.
