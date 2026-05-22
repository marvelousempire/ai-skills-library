---
name: version-bump-and-changelog
id: RL-0065
keywords: [enforce-version, check-changelog, build-release-notes, semver, bump-package-json]
goal: Every PR that changes user-visible or operator-visible behavior MUST bump the package version AND add a CHANGELOG entry in the same PR. Never let shipped work sit unlogged.
hash: pending
relations: [dev-discipline, rule-propagation-discipline, contracts-and-prudence, pipeline-stage-truth]
before: []
governed_by: [global]
meta: dynamic
---

# Version bump + CHANGELOG — every PR, every time

## The verbatim source (stated by Avery 2026-05-22)

> be sure to alwasy version bup and edit chamglog

## The rule

Every pull request that changes user-visible or operator-visible behavior
MUST land two things alongside the code:

1. **A version bump** in the repo's canonical version file
   (`package.json`, `pyproject.toml`, `Cargo.toml`, or whatever the repo
   uses). Bump per **semver**:
   - **MAJOR** — breaking API change, schema change requiring data
     migration, removed surface
   - **MINOR** — new feature, new endpoint, new primitive, new rule
     adopted, new tab/page, new CLI flag
   - **PATCH** — bug fix, doc-only change inside the existing surface,
     a typo in error text, a config tweak
2. **A CHANGELOG entry** dated with Eastern time. The repo's existing
   format wins — `## [X.Y.Z] — YYYY-MM-DD Eastern · *Title*` if the
   repo uses semver-section headers (DustPan style); under `[Unreleased]`
   if the repo uses Unreleased-then-promote (Nephew style); under a date
   header if the repo is docs-only (Historia / Clinic style).

Both go in the same commit as the code, OR an immediate follow-up commit
in the same PR before push. **Never let shipped work sit unlogged.**

## When this fires

- Any commit that touches user-visible or operator-visible behavior
- New canonical rule body adopted (the rule itself is a logged event)
- New API endpoint, new UI page, new primitive in a shared library
- Removed/renamed surface
- Schema or migration change
- Deploy-shape change (new make target, new build step, new env var)
- Any PR title that would NOT fit in a single-sentence commit message
  ("typo fix" doesn't fire; "added 6 endpoints + 2 rules" definitely does)

## When this does NOT fire

- Internal refactors with no observable behavior change (still good to
  log under "Changed/Internal" but not required)
- Tooling-only PRs (lint config, formatter, CI YAML) — those have their
  own version-or-not story
- Docs that aren't shipped as a surface (a `README.md` in a deep folder
  that no operator reads)

## How — per-repo recipe

| Repo | Version file | CHANGELOG path | Format |
|------|--------------|----------------|--------|
| **nephew** | `package.json` `"version"` + `apps/control-tower/package.json` | `CHANGELOG.md` | Unreleased section, then promote |
| **dustpan** | `package.json` `"version"` | `docs/CHANGELOG.md` | `## [X.Y.Z] — YYYY-MM-DD Eastern · *Title*` |
| **ai-skills-library** | (no package version; use a CHANGELOG-only release marker) | `CHANGELOG.md` (create if missing) | Date-header sections |
| **historia** | (docs-only) | `docs/CHANGELOG.md` | Date-header sections |
| **clinic** | `package.json` `"version"` | `CHANGELOG.md` | Repo-existing format |
| **automata** | `package.json` `"version"` | `docs/CHANGELOG.md` | Repo-existing format |
| **dockyard** | `package.json` `"version"` | `CHANGELOG.md` if present | Repo-existing format |

If the CHANGELOG file doesn't exist yet in a repo getting its first
substantive change in this session, **create it** alongside the change.
Don't defer.

## Examples

### ✓ Compliant — DustPan feature PR

`package.json`: `"version": "0.37.2"` → `"0.38.0"` (minor: new endpoint)

`docs/CHANGELOG.md`:

```markdown
## [0.38.0] — 2026-05-22 Eastern · *OS pill + About modal backend*

### Added — `/api/v1/about` endpoint

Returns the standard `AboutInfo` JSON shape (app, version, os, family,
arch, kernel, backend, uptime, memory, status) so Nephew CT's `<OSPill>`
+ `<AboutModal>` primitives can populate from a single endpoint.

Python stdlib only — no new deps. Powered by `_build_about()` in
`web/server.py`.

### Why

Per the os-pill-and-about-modal rule shipped 2026-05-22, every operator
app exposes this shape so the top-left platform indicator is honest.
```

Single PR. Single commit (or a small follow-up commit on the same
branch). Reviewer sees code + version + CHANGELOG in one place.

### ✗ Violation — "I'll bump the version on the next PR"

The "next PR" never happens. Six PRs ship. Six unlogged version stays
at the old number. The `--latest` consumer of the repo's release feed
sees a quiet ghost where the work should be.

(This rule was authored because exactly that happened on 2026-05-22 with
the live-dashboard + os-pill rollouts — the operator caught it and
asked for the rule.)

## Propagation

Per [`rule-propagation-discipline`](rule-propagation-discipline.md), this
rule lands in every operator-built repo's `.claude/rules/` and
`.cursor/rules/` and the AI Skills Library.

## Related

- **Sister rule:** [`dev-discipline`](dev-discipline.md) — already required
  this as step 2 of session-closer; this rule promotes it from
  "in the checklist" to "a standalone rule with the operator's verbatim
  source"
- **Sister rule:** [`pipeline-stage-truth`](pipeline-stage-truth.md) —
  CHANGELOG-promoted means "shipped"; absence of a CHANGELOG entry means
  the stage was never advanced past "merged"
- **Sister rule:** [`rule-propagation-discipline`](rule-propagation-discipline.md) — every rule adoption IS a CHANGELOG event in the canonical repo
