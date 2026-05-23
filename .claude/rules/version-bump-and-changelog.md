# Version bump + CHANGELOG + tag + Release — every PR, every time

## The verbatim source (stated by Avery 2026-05-22)

> be sure to alwasy version bup and edit chamglog

Re-affirmed 2026-05-22 evening after Avery noticed dustpan's GitHub
Releases page showed `v0.28.2` as Latest — 5 days old — despite 11+
versions having shipped via PRs with proper `package.json` bumps and
CHANGELOG entries. The rule covered package.json + CHANGELOG but missed
the git tag + GitHub Release as a third surface, so the Releases page
silently fell 34 versions behind reality.

## The rule

Every pull request that changes user-visible or operator-visible behavior
MUST land **four things** alongside the code (not two):

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
3. **A git tag `vX.Y.Z`** on the merge commit, annotated with the
   CHANGELOG title, pushed to **every remote the repo has** (typically
   `origin` for GitHub + `gitlab` if present).
4. **A GitHub Release** (and GitLab Release if the repo has a gitlab
   remote) created from that tag, with the CHANGELOG body as release
   notes. This is the user-facing "what shipped" feed — without it, the
   Releases page lies about what's Latest.

Items 1–2 go in the same commit as the code (or an immediate follow-up
in the same PR before push). Items 3–4 happen the moment the PR is
merged — same session, not "I'll tag later."

**Never let shipped work sit unlogged on any of the four surfaces.**

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
- Pure docs-only repos (Historia, AI Skills Library, etc.) — tag + release
  are optional because there's no compiled artifact users consume; the
  CHANGELOG itself is the release feed. Tag if you want a snapshot
  pointer; skip if the date-headed CHANGELOG is sufficient.

## How — per-repo recipe

| Repo | Version file | CHANGELOG path | Tag scope | Release scope |
|------|--------------|----------------|-----------|---------------|
| **nephew** | `package.json` + `apps/control-tower/package.json` | `CHANGELOG.md` | `vX.Y.Z` | GitHub + GitLab |
| **dustpan** | `package.json` (+ `apps/web/package.json` if web changed) | `docs/CHANGELOG.md` | `vX.Y.Z` | GitHub + GitLab |
| **ai-skills-library** | (none — release-marker only) | `CHANGELOG.md` | optional | optional |
| **historia** | (docs-only) | `docs/CHANGELOG.md` | optional | optional |
| **clinic** | `package.json` | `CHANGELOG.md` | `vX.Y.Z` | GitHub |
| **automata** | `package.json` | `docs/CHANGELOG.md` | `vX.Y.Z` | GitHub |
| **dockyard** | `package.json` | `CHANGELOG.md` | `vX.Y.Z` | GitHub |

If the CHANGELOG file doesn't exist yet in a repo getting its first
substantive change in this session, **create it** alongside the change.
Don't defer.

## The 4-line post-merge ritual

After `gh pr merge --squash` succeeds:

```bash
git checkout main && git pull origin main
git tag -a vX.Y.Z -m "vX.Y.Z — <CHANGELOG title>"
git push origin vX.Y.Z && git push gitlab vX.Y.Z 2>/dev/null || true
gh release create vX.Y.Z --title "vX.Y.Z — <title>" --notes-file <(sed -n "/^## \[X.Y.Z\]/,/^## \[/p" docs/CHANGELOG.md | sed '$d')
```

If the repo has GitHub branch protection that limits pushes to ≤5 refs
per push (dustpan does), tag pushes batch in groups of 5 — but a single
new tag never hits that limit. Backfills do — see Examples below.

## Examples

### ✓ Compliant — DustPan PR #83 (v0.39.0, 2026-05-22)

`package.json`: `"version": "0.38.6"` → `"0.39.0"` (minor: new UI primitive)
`apps/web/package.json`: `"0.29.0"` → `"0.30.0"`

`docs/CHANGELOG.md`:

```markdown
## [0.39.0] — 2026-05-22 Eastern · *Top-left OSPill + live About-This-Mac modal*

### Added
- `<OSChrome>` primitive in apps/web/src/components/OSChrome.tsx...
```

Post-merge:

```bash
git tag -a v0.39.0 -m "v0.39.0 — Top-left OSPill + Apple-style About modal"
git push origin v0.39.0 && git push gitlab v0.39.0
gh release create v0.39.0 --title "..." --notes "..."
```

Four surfaces updated. Releases page shows v0.39.0 as Latest within
minutes of the merge.

### ✗ Violation — DustPan v0.28.2 → v0.39.0 (May 17 → May 22, 2026)

Between May 17 and May 22, 34 versions shipped via PR + CHANGELOG with
**zero git tags and zero GitHub Releases**. The Releases page still
showed `v0.28.2 — Latest 5 days ago`, lying about every actual ship.

The backfill was 35 tags + 34 Releases of after-the-fact archaeology —
~30 minutes of recovery work that 10 seconds of post-merge discipline
would have prevented.

This rule update exists because of that incident.

### ✓ Compliant — a docs-only PR in Historia

Historia has no `package.json`. CHANGELOG gets the entry with a date
header. Tag and Release are **optional** for pure-docs repos because
the CHANGELOG itself is the release feed. Use a tag if you want a
snapshot pointer (`historia-2026-05-22` is fine, doesn't need semver).

### ✗ Violation — "I'll bump the version on the next PR"

The "next PR" never happens. Six PRs ship. The Releases page silently
drifts behind reality. Apply the bright-line check: **if `gh release
list --limit 1` does not show the version you just merged, the merge
isn't done.**

## Bright-line check

Before declaring a PR shipped, run:

```bash
gh release list --limit 1
```

If the top row is NOT the version this PR merged, you're not done.

## Propagation

Per [`rule-propagation-discipline`](rule-propagation-discipline.md), this
rule lands in every operator-built repo's `.claude/rules/` and
`.cursor/rules/` and the AI Skills Library.

## Related

- **Sister rule:** [`dev-discipline`](dev-discipline.md) — already required
  this as step 2 of session-closer; this rule is the standalone form
  with the operator's verbatim source + the 4-surface expansion
- **Sister rule:** [`pipeline-stage-truth`](pipeline-stage-truth.md) —
  the bright-line check above IS the pipeline-stage probe; missing
  Release means the stage was never advanced past "merged"
- **Sister rule:** [`rule-propagation-discipline`](rule-propagation-discipline.md) — every rule adoption IS a CHANGELOG + tag + Release event in the canonical repo
- **Origin incident:** [`docs/breakthroughs/2026-05-22-version-bump-includes-tag-and-release.md`](../../docs/breakthroughs/2026-05-22-version-bump-includes-tag-and-release.md) — the 34-tag backfill that triggered this expansion
