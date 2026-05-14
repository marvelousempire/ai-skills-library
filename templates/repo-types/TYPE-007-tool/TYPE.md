# TYPE-007 — 

**Type ID:** TYPE-007
**Name:** 
**When to use:** 

---

## Standard folder structure

```

```

---

## README sections (use avery-goodman-repo-standard)

Every repo of this type starts with:

```markdown
# [App/Project Name]
**managed by the duty and order of AVERY GOODMAN**

> [Tagline — one sentence, present tense, what it does RIGHT NOW]

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

Invoke SK-0003 (`avery-goodman-repo-standard`) for the full section definitions and anti-patterns.

---

## ai-skills-library skills for this type

Load these skills when setting up or working on a  repo:



---

## Setup checklist (new repo from scratch)

- [ ] Pick this type (TYPE-007) — confirm it's the right fit, or identify hybrid types to borrow from
- [ ] Create the repo on GitHub with the AVERY GOODMAN naming standard
- [ ] Copy this TYPE.md to `docs/repo-type.md` so any AI knows what type this is
- [ ] Scaffold the folder structure (see tree above) — create all folders, add `.gitkeep` to empties
- [ ] Copy `README.template.md` from this folder to the repo root — fill every `[bracketed]` placeholder
- [ ] Initialize `Makefile` with at minimum: `help`, `check`, `update`, `doctor`
- [ ] Create `plans/` folder with a `README.md` explaining the numbering convention
- [ ] Create first plan: `plans/0001-initial-setup.md` — document WHY this repo exists
- [ ] Set up GitHub Actions for auto-release on squash-merge to main
- [ ] Run: `make check` — must pass before first commit to main
- [ ] Run `gap-audit-and-elevation` (SK-0113) after the first meaningful ship

---

## Alignment checklist (existing repo → TYPE-007)

Use this alongside `existing-repo-alignment` skill to reshape without destroying.

- [ ] Read the existing repo — understand what's there BEFORE changing anything
- [ ] Map existing folders to the standard structure above
- [ ] Identify content that doesn't map — put in `docs/legacy/` or `archive/` pending review
- [ ] Add missing folders (empty with `.gitkeep`) — never delete existing content
- [ ] Update README to use the AVERY GOODMAN 10-section format — keep all existing content, just reorganize into the sections
- [ ] Add `docs/repo-type.md` pointing to TYPE-007
- [ ] Run `failure-proof-audit` (SK-0112) on the reshaping plan before executing
