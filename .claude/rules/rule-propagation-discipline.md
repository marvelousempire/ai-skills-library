---
name: rule-propagation-discipline
id: RL-0062
keywords: [enforce-rules, check-propagation, build-mirroring, every-surface]
goal: Every rule we adopt MUST land on every surface that runs an AI agent — global, repo-local Claude, repo-local Cursor, AI Skills Library, and (where named) Historia + Clinic — committed, pushed, and PR/MR'd, every time.
hash: pending
relations: [contracts-and-prudence, plans-folder-convention]
before: []
governed_by: [global]
meta: dynamic
---

# Rule propagation discipline — global + local + repo, every time

## The verbatim source (stated by Avery 2026-05-22)

> always remember to do rule for Nephew global and local and repo too and
> commit and add and push them and do Prs and MRs awlasy when we do these
> rules or any rules. Everytime Nephew must know this and never forget.

## The rule

When adopting **any** new behavioral rule (Claude rules, Cursor rules,
AI Skills Library skills/rules), the rule MUST land on every active
surface in the operator's stack — in a single coordinated rollout, not
"I'll do it later":

### Required placements

For every new rule, the canonical body lives in **Nephew** at
`.claude/rules/<rule-name>.md`. Then it is mirrored to:

| Surface | Path | When |
|---------|------|------|
| **Nephew repo Claude** | `nephew/.claude/rules/<rule-name>.md` | Always |
| **Nephew repo Cursor** | `nephew/.cursor/rules/<rule-name>.mdc` | Always |
| **Global Claude** | `~/.claude/CLAUDE.md` (append) OR operator memory entry | Always — Nephew "global memory" of the rule |
| **AI Skills Library** | `ai-skills-library/.claude/rules/<rule-name>.md` + `.cursor/rules/<rule-name>.mdc` + (if applicable) a SKILL pair under `skills/methodology/<name>/` | Always — the federation hub for cross-agent learning |
| **Each operator-built repo** | `<repo>/.claude/rules/<rule-name>.md` + `<repo>/.cursor/rules/<rule-name>.mdc` | When the rule applies to that repo's work |
| **Historia** | `historia/.claude/rules/<rule-name>.md` + `historia/.cursor/rules/<rule-name>.mdc` | When operator names Historia OR when the rule is UX/UI-shaped |
| **Clinic** | `clinic/.claude/rules/<rule-name>.md` + `clinic/.cursor/rules/<rule-name>.mdc` | When operator names Clinic OR when the rule is UX/UI-shaped |

The Cursor `.mdc` file uses the same body as the Claude `.md`, with the
frontmatter adapted for Cursor's format if needed (most rules need no
adaptation — Cursor reads the `## When this fires` and `## The rule`
sections directly).

### Required deliverables per rollout

For every rule, in this order:

1. **Author canonical body** in Nephew's `.claude/rules/<name>.md`. Include
   verbatim operator source, the rule itself, when-it-fires, examples
   (compliant + violation), why, related links.
2. **Mirror to every applicable surface** listed above. Same body, copied
   not re-derived.
3. **Write a report** at `docs/breakthroughs/<YYYY-MM-DD>-<name>.md` if the
   rule corresponds to a design or UI breakthrough. Otherwise, log in the
   operator's session memory.
4. **Save to operator memory** as a feedback-type entry so it survives
   across sessions.
5. **Commit per repo, by explicit path** (no `git add -A`).
6. **Push to every remote** the repo has — `origin` (GitHub) and `gitlab`
   if present.
7. **Open a PR (GitHub) AND an MR (GitLab)** for every repo touched. Use
   feature branches like `feature/<rule-name>` or `rule/<rule-name>`.
   The PRs may auto-merge once green, but they MUST exist as the record.
8. **Update plan status lines** for any in-progress plan this rule
   formalizes.

### What "any rule" covers

This propagation rule fires for:
- New `.claude/rules/*.md` files
- New `.cursor/rules/*.mdc` files
- New AI Skills Library skills under `skills/methodology/` that codify
  cross-repo behavior
- Substantive updates to existing rules (not typo fixes)
- New `CLAUDE.md` directives that should be portable

It does NOT fire for:
- One-off repo-internal conventions that don't generalize (e.g. "tests for
  this module live in `__tests__/foo`")
- Tooling config (lint rules, formatter config) — those have their own
  propagation discipline

## Why

Without this rule:
- A behavior taught in one repo's CLAUDE.md is invisible to agents working
  in any sibling repo
- Cursor and Claude diverge — same operator, two AI surfaces, two
  different sets of habits
- Rules adopted "for now" get lost six months later when nobody can
  remember they exist or where they live
- The federation hub (AI Skills Library) goes stale and stops being the
  source of truth it claims to be

With this rule:
- Any agent landing in any operator repo finds the same behavioral
  catalog
- Cursor, Claude, Aider, Continue, anything else all read the same `.md`
  / `.mdc` body
- The git history per repo proves when the rule was adopted and lets
  any future session reconstruct the operator's standing instructions

## Examples

### ✓ Compliant — the live-dashboard-pattern rollout (commit batch on 2026-05-22)

- Authored at `nephew/.claude/rules/live-dashboard-pattern.md`
- Mirrored to nephew/.cursor, dustpan/.claude, dustpan/.cursor,
  ai-skills-library/.claude, ai-skills-library/.cursor (+ skill),
  historia/.claude, historia/.cursor, clinic/.claude, clinic/.cursor
- Report filed at `nephew/docs/breakthroughs/2026-05-22-live-dashboard-pattern.md`
  AND `clinic/docs/breakthroughs/2026-05-22-live-dashboard-pattern.md`
- Memory entry saved to `~/.claude/projects/.../memory/feedback_live_dashboards.md`
- 5 feature branches, 5 GitHub PRs, 3 GitLab MRs (where the gitlab remote exists)
- Plan 0059 status line updated to reference the rule

### ✗ Violation — "I added the rule to Nephew, will mirror later"

The "I'll do it later" never happens. The rule sits in one repo, every
other agent on the stack stays ignorant, and six weeks later the operator
re-teaches the same lesson in a fresh session.

## Related

- **Philosophy:** [contracts-and-prudence](contracts-and-prudence.md) — propagating IS the prudent action; not propagating is silent drift
- **Plans convention:** [plans-folder-convention](plans-folder-convention.md) — rules adopted as part of a plan get cross-referenced
- **Federation hub:** AI Skills Library — the canonical destination for cross-repo rules
