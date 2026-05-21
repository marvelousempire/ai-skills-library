---
name: fork-divergence-tracker
keywords: [audit-fork, check-divergence, build-tracker]
hash: 8492547
relations: []
before: []
governed_by: [global]
meta: dynamic
goal: Deliver fork divergence tracker output correctly and completely.
description: >-
  When a project is a fork of an upstream that ships rapidly, build a
  "symlink + rsync hybrid" tracker so the fork knows when upstream
  changes AND maintains a curated ledger of its own deviations. Two
  surfaces: UPSTREAM_TRACKER.md (auto-refreshed live snapshot) +
  WE_DIFFER_HERE.md (curated narrative). One daily GitHub Action keeps
  both honest. Triggers on "fork tracking", "shadow upstream", "track
  fork divergence", "we forked X and want to know when X changes".
trigger: >-
  Use when a project IS a fork (you have a different repo from the
  upstream), the upstream is actively maintained, AND you need to (a)
  know when upstream changes so you can cherry-pick, and (b) record your
  fork-specific improvements so they're never lost on a merge. Examples:
  marvelousempire/nephew shadowing ruvnet/ruflo. Not for sibling repos
  with no upstream relationship.
---

# fork-divergence-tracker — the symlink + rsync hybrid



> **Parent pattern:** this skill is the canonical fork-of-git-repo instance of [`shadow-and-record`](../shadow-and-record/SKILL.md) — the general "symlink + rsync hybrid" pattern. If the external thing you're tracking is *not* a git fork (e.g., an API contract, a vendored doc, a third-party schema), use the parent skill instead.
## What this skill does

Builds a fork-divergence tracker that gives a fork two unified surfaces:

1. **Symlink-side** — live awareness of upstream's current state. Refreshed daily by a GitHub Action. Shows: latest commit, latest tag, ahead-by counts, files differing, lines added/removed, recent commits each direction.

2. **Rsync-side** — curated narrative of every conscious deviation. Humans maintain. Tells the next agent (or the next session) *why* we differ and which deviations must never be lost when cherry-picking from upstream.

Both live in the same repo. The daily workflow keeps them in sync.

## When to invoke this skill

- The user says: "we forked X to Y; can we shadow X" / "track upstream changes" / "watch this fork for divergence"
- A repo is a known fork (e.g. `marvelousempire/nephew` from `ruvnet/ruflo`) that's actively diverging
- Upstream is shipping rapidly enough that manual tracking is dropping commits

## What gets shipped (six pieces)

1. **`scripts/track-upstream.sh`** — pure bash + git + jq. Computes both halves of the hybrid. Flags: `--dry-run`, `--json`. Env vars: `UPSTREAM_REPO`, `UPSTREAM_BRANCH`, `OURS_BRANCH`. Idempotent — adds `upstream` remote on first run, refreshes thereafter.

2. **`.github/workflows/upstream-tracker.yml`** — daily cron @ 09:00 UTC + workflow_dispatch. Runs the script, commits changes, opens or updates a `upstream-changed` GitHub issue if upstream is ahead by ≥1 commit.

3. **`UPSTREAM_TRACKER.md`** — auto-regenerated live snapshot. Format:
   - State headline (✅ in sync / ⬆️ upstream ahead / ⬇️ ours ahead / 🔀 both ahead)
   - Side-by-side table of latest commit per branch
   - Divergence stats
   - Recent commits each direction (top 10)
   - Cross-link to `WE_DIFFER_HERE.md`

4. **`WE_DIFFER_HERE.md`** — curated narrative. Required sections:
   - Branding + namespacing (why repo name + agent names differ)
   - Native CLI surface (fork-only features that MUST NOT be lost on cherry-pick)
   - Passthrough boundary (what shims to upstream; auto-inherits)
   - CI integration (workflows that have no upstream equivalent)
   - Closed deviations (deviations that were absorbed or abandoned, with dates)
   - Triage rules for upstream cherry-picks (the procedure when the tracker reports upstream-ahead)

5. **`data/upstream-tracker.json`** — machine-readable payload powering the markdown. Schema documented inline in the script.

6. **README "Upstream" section** — explains the symlink+rsync framing, points at the three surfaces, gives the local-run commands.

## How to invoke

```
/fork-divergence-tracker
```

Or naturally:

> "We forked ruflo to nephew. Can we shadow ruflo so we know when it changes but also track our nephew-only improvements?"

## Inputs / outputs

- **Inputs:** the upstream repo (`<owner>/<name>`), upstream branch (default `main`), local branch representing the fork's HEAD (default `main`), optional list of nephew-only paths to preserve
- **Outputs:** the six pieces above, committed to the fork's repo. First-run output also shows the current divergence state (often surprising — nephew's first run showed 6,448 commits behind ruflo).

## Anti-patterns this skill blocks

- **Copying upstream content into the fork.** The tracker is a live pointer to upstream's git state, not a vendor of upstream's source. Per [`rules/library/add-agent-to-skills-library/body.md`](../../../rules/library/add-agent-to-skills-library/body.md) (pointer-not-replica).
- **Letting fork-specific improvements live only in commits.** If a feature is fork-only and load-bearing, it MUST appear in `WE_DIFFER_HERE.md` under "Native CLI surface" or similar. Otherwise a cherry-pick from upstream can silently overwrite it.
- **Manual tracking.** Once the workflow runs daily, manual `git log` checks against upstream are dead labor. Trust the tracker.
- **Notifying on every refresh.** The workflow only opens a GitHub issue when upstream is ahead by ≥1 commit. Quiet weeks = silent.

## When NOT to use this skill

- The project is not a fork — there's no upstream to shadow
- The upstream is dead / unmaintained — no divergence to track
- The fork has fully diverged and you no longer want to absorb upstream changes — just delete the upstream remote and skip this skill

## Related

- **Parent pattern:** [`shadow-and-record`](../shadow-and-record/SKILL.md) — the general "symlink + rsync hybrid" pattern. This skill is its canonical git-fork instance.
- Rule: [`rules/library/add-agent-to-skills-library/body.md`](../../../rules/library/add-agent-to-skills-library/body.md) — pointer-not-replica
- Rule: [`rules/library/plugin-economy/body.md`](../../../rules/library/plugin-economy/body.md) — documented dependencies
- Skill: [`skills/methodology/cross-reference-rippling/SKILL.md`](../cross-reference-rippling/SKILL.md) — what to update downstream when the fork ships a new deviation
- Standard: [`docs/standards/orchestration-hierarchy.md`](../../../docs/standards/orchestration-hierarchy.md) — nephew's place in the dispatch tree (nephew is the canonical first consumer of this pattern)

## Origin

Codified after building the upstream-tracker for `marvelousempire/nephew` shadowing `ruvnet/ruflo` on 2026-05-15. The need surfaced because Ruflo ships rapidly (6,448 commits ahead at first check) and we wanted nephew-specific improvements (witness CLI, Tier B federation) to be impossible to lose on a future cherry-pick. The "symlink + rsync hybrid" framing came from the user's metaphor: a symlink (live pointer) and an rsync (explicit persisted delta) had a hybrid baby that met both needs in one unified surface.

## Reference implementation

[`marvelousempire/nephew`](https://github.com/marvelousempire/nephew) — see:
- [`scripts/track-upstream.sh`](https://github.com/marvelousempire/nephew/blob/main/scripts/track-upstream.sh)
- [`.github/workflows/upstream-tracker.yml`](https://github.com/marvelousempire/nephew/blob/main/.github/workflows/upstream-tracker.yml)
- [`UPSTREAM_TRACKER.md`](https://github.com/marvelousempire/nephew/blob/main/UPSTREAM_TRACKER.md) (live)
- [`WE_DIFFER_HERE.md`](https://github.com/marvelousempire/nephew/blob/main/WE_DIFFER_HERE.md)
