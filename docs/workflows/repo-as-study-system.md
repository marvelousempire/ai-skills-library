# Workflow — repo as study system

How to onboard yourself (or a new agent / future-you) by treating this repo as a curriculum.

## Reading order

```text
   1. README.md (root)                                ←  the orientation
   2. SKILL-INDEX.md                                  ←  what skills exist
   3. docs/study/00-orientation.md                    ←  the curriculum entry point
   4. docs/study/01-skill-anatomy.md                  ←  what a skill is
   5. docs/study/02-plan-first.md
   6. docs/study/03-cross-reference-rippling.md
   7. docs/study/04-verification-gates.md
   8. docs/study/05-aesthetic-language.md
   9. docs/study/06-multi-surface-design.md
  10. docs/study/07-label-contract.md
  11. docs/study/08-idempotent-commands.md
  12. docs/study/09-yousirjuan-alignment.md
  13. docs/study/10-improvement-loops.md
```

## Then practice

`docs/training/drills/` has 8 hands-on exercises. Each ~10–30 min, verifiable.

## Then read the canonical examples

| Pattern | Canonical example in repo |
|---|---|
| Multi-surface engine | [`skills/visual/diagrams/seeme/`](../../skills/visual/diagrams/seeme/) |
| Integration layer skill | [`skills/infra/dockyard/`](../../skills/infra/dockyard/) |
| Operational console | [`skills/infra/console/`](../../skills/infra/console/) |
| Containerized platform | [`skills/infra/self-hosted-git/`](../../skills/infra/self-hosted-git/) |
| Decision record | [`skills/infra/self-hosted-git/references/gitlab-vs-forgejo.md`](../../skills/infra/self-hosted-git/references/gitlab-vs-forgejo.md) |
| Migration guide | [`skills/infra/dockyard/references/switching-from-docker-desktop.md`](../../skills/infra/dockyard/references/switching-from-docker-desktop.md) |
| Compliance matrix | [`skills/infra/dockyard/references/integration-checklist.md`](../../skills/infra/dockyard/references/integration-checklist.md) |
| Make ui (one-command) | [`skills/infra/console/Makefile`](../../skills/infra/console/Makefile) |

## Then read the audits + reports

`docs/improvement/audits/` and `docs/reports/` are where the *method* shows up. Reading two session reports teaches more than reading any one skill.

## Then build

Pick a small skill from [`docs/improvement/gaps-open.md`](../improvement/gaps-open.md) or [`elevations-deferred.md`](../improvement/elevations-deferred.md) and ship it end-to-end per [`build-new-skill.md`](build-new-skill.md).

## Graduation

You're "done" with the study system when you can:

1. Author a new skill from `docs/templates/SKILL.md.template` in 30 minutes
2. Write a decision record without referring back to the template
3. Run the verification gates from memory
4. Cross-reference correctly without checking [`cross-reference.md`](../checklists/cross-reference.md)
5. Run an after-ship audit unprompted

## Why this exists

```text
   The repo is a memory + a curriculum + an audit trail + a filing cabinet
   + a generator — all in one Git history.

   Reading it is faster than rediscovering it.
```
