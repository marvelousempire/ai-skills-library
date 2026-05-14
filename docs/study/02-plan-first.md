# 02 — Plan first

For any substantive change (touches > 2 files, changes architecture, modifies > 50 lines), write a plan **before** coding.

## Where plans live

| Location | Purpose | Example |
|---|---|---|
| `~/.claude/plans/<title>.md` | User-global, survives across repos | `dockyard-integration.md` |
| `docs/master-plans/<date>-<title>.md` | In-repo, survives across machines | `2026-05-14-master-repo-evolution.md` |

## Required sections

Per [`docs/templates/PLAN.md.template`](../templates/PLAN.md.template):
- Context
- Goals
- Non-goals
- Tasks (with verification per task)
- Critical files
- Verification gates (commands + expected outputs)
- Out of scope
- Recovery

## Why

A plan is a contract you sign with future-you. Without it: scope creep, missed cross-references, hard-to-rollback mistakes. With it: every commit lands cleanly, with a recovery path.

## Real example

`~/.claude/plans/dockyard-integration.md` — guided a 95-file commit that landed clean.

## Exercise

Skim [`docs/master-plans/2026-05-14-master-repo-evolution.md`](../master-plans/2026-05-14-master-repo-evolution.md). Identify the 8 task sections + verification gates + recovery section.

## Next

[`03-cross-reference-rippling.md`](03-cross-reference-rippling.md).
