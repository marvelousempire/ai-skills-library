---
name: version-bump-and-changelog
id: pending
keywords: [version-bump, changelog, semver, release-notes, package-json, never-let-shipped-sit-unlogged]
goal: Every PR that changes user-visible or operator-visible behavior MUST bump the package version AND add a CHANGELOG entry in the same PR.
hash: pending
relations: [dev-discipline, rule-propagation-discipline, pipeline-stage-truth]
before: []
governed_by: [global]
meta: dynamic
description: Triggers on "version bump", "CHANGELOG", "release notes", "semver", "bump the package", "add a CHANGELOG entry", "what version are we on", "promote unreleased", or any prompt about a PR that ships behavior without an associated version/CHANGELOG event.
---

# version-bump-and-changelog — methodology skill

Every shipped PR that changes user-visible or operator-visible behavior
must land two things alongside the code: a semver-correct version bump
in the repo's canonical version file, and a CHANGELOG entry in the
repo's existing format.

## When to use

Triggers: any PR that adds a feature / new endpoint / new primitive /
new rule / new tab / new flag, removes a surface, or changes
deploy shape. Skip on internal-only refactors and tooling-config PRs.

## The semver decision tree

- **MAJOR** — breaking API change, schema migration, removed surface
- **MINOR** — new feature, new endpoint, new primitive, new rule
  adopted, new page, new CLI flag
- **PATCH** — bug fix, doc-only change in existing surface, typo, config tweak

## The CHANGELOG decision tree

Match the repo's existing format:
- **DustPan style:** `## [X.Y.Z] — YYYY-MM-DD Eastern · *Title*` with
  Added / Changed / Fixed sections
- **Nephew style:** entries under `[Unreleased]` then promote on release
- **Docs-only repos:** date-header sections

Same commit as the code OR an immediate follow-up commit on the same
branch before push. Never separate PR. Never "I'll log it later."

## Why this exists

Codified from the 2026-05-22 Nephew Control Tower session. The operator
caught two rollouts shipping without version bumps or CHANGELOG entries
and asked for the rule. The verbatim trigger: "be sure to alwasy
version bup and edit chamglog."

Per [pipeline-stage-truth], a PR without a CHANGELOG entry has not
advanced past "merged" — the "shipped" / "live" stages depend on the
log existing.

## Pairing

- **Sister rule:** [dev-discipline] — already had this as a session-closer
  step; this skill promotes it to a standalone rule with verbatim source
- **Sister rule:** [pipeline-stage-truth] — CHANGELOG IS the pipeline
  evidence
- **Federation:** [rule-propagation-discipline] — every rule adoption is
  itself a CHANGELOG event in the canonical repo

## Reference

- Rule body: `nephew/.claude/rules/version-bump-and-changelog.md`
- Operator memory: `feedback_version_and_changelog.md`
