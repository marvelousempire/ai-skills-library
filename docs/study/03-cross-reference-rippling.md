# 03 — Cross-reference rippling

When you add a new skill, several other files MUST update in lockstep. Drift here is the most common silent failure in the repo (caught 4× as count mismatch in the 2026-05-14 session).

## What ripples when you add a skill

| Target | Why |
|---|---|
| `SKILL-INDEX.md` (root) | Count + new row |
| `README.md` (root) | Fast navigation + cheat-sheet rows |
| `skills/<family>/README.md` | Family catalog (if exists) |
| `docs/yousirjuan-platform-skills-master.md` | If anchored to a category |
| `docs/yousirjuan-upstream-repo-ledger.md` | Same |

Full table: [`docs/standards/cross-references.md`](../standards/cross-references.md). One-page checklist: [`docs/checklists/cross-reference.md`](../checklists/cross-reference.md).

## Why

Without rippling, the repo loses discoverability over time. The agent that comes after you won't find your skill because `SKILL-INDEX.md` doesn't list it.

## Automation

- `scripts/check-skill-count.sh` — automated reconciliation. Run before every commit.
- `scripts/check-cross-references.sh` — sanity check.
- `agents/cross-reference-rippler/` — planned full automation.

## Exercise

Run `bash scripts/check-skill-count.sh` from the repo root. Expected: `✓ all three agree`. If not — fix until it does.

## Next

[`04-verification-gates.md`](04-verification-gates.md).
