# Master plan — ai-skills-library as a master report / study / training / improvement / filing system

**Date:** 2026-05-14
**Recovery tag:** `pre-master-repo-evolution-2026-05-14`
**Status:** Shipping in this commit.

This is the canonical plan extracted from a single working session (commits `be12ab0` → `b5d1bac` on `main`). The session produced real artifacts: SEEME 1.0 (multi-surface AI diagram generator), `self-hosted-git` (GitLab CE playbook with CI), the Homelab Console (unified UI + Makefile with `make ui`), Dockyard integration, and the canonical `ai-skills-library.*` label schema.

The repo absorbs everything the session taught — not just the artifacts, but the **method**.

---

## The five systems

```text
   ┌────────────────────────────────────────────────────────────────────┐
   │  ai-skills-library                                                  │
   ├────────────────────────────────────────────────────────────────────┤
   │  📋 master report system    every session lands a written report    │
   │  📚 study system            curriculum to onboard agents + future-me│
   │  🏋️ training system          repeatable drills with green-checks    │
   │  🔄 improvement system      open-gaps + deferred-elevations tracking│
   │  🗂️ filing system            canonical home for every artifact type │
   └────────────────────────────────────────────────────────────────────┘
```

---

## Patterns from this session that should become repo-resident knowledge

Eight patterns observed repeatedly:

| Pattern | Observed in | Codified as |
|---|---|---|
| **Plan-first** for substantive work | `~/.claude/plans/diagrammer-app.md`, `~/.claude/plans/dockyard-integration.md` | `rules/library/plan-first-for-substantive/` + `skills/methodology/plan-first/` + `docs/templates/PLAN.md.template` |
| **Gap audit + elevation pass** after every meaningful ship | 5 separate audits in this session | `skills/methodology/gap-audit-and-elevation/` + `docs/templates/gap-audit.md.template` + `docs/improvement/audits/` archive |
| **Skill scaffolding** — `SKILL.md` + `README` + `templates/` + `references/` | Every skill we built | `docs/standards/skill-anatomy.md` + `docs/checklists/new-skill.md` + `docs/templates/SKILL.md.template` |
| **Label schema as contract** — `ai-skills-library.*` labels | `skills/infra/dockyard/templates/labels-reference.md` (already shipped) | `rules/library/ai-skills-library-labels/` |
| **One-command idempotent UX** — `make ui` | `skills/infra/console/Makefile` | `skills/methodology/idempotent-commands/` + `docs/templates/Makefile.template` |
| **Multi-surface engine** — CLI + MCP + Web UI + Docker | SEEME's 6 surfaces | `skills/methodology/multi-surface-design/` + workflow doc |
| **Cross-reference rippling** — add X → update Y, Z, W | Every new skill required updates to ~8 docs | `rules/library/cross-reference-on-skill-add/` + `docs/checklists/cross-reference.md` + agent |
| **Aesthetic consistency** — dark mode + monospace + ascii box-drawing | SEEME UI, CI dashboard, Console | `docs/standards/aesthetic-language.md` + `docs/templates/single-page-ui.html.template` |

## Failure modes from this session that should become safeguards

Eight failure modes hit during the session:

| Failure | Count | Preventative |
|---|---|---|
| Docker daemon crashed mid-build | 3× | `docs/standards/doctor-script.md` + every infra skill ships `doctor.sh` |
| Disk-full builds | 2× | `doctor` checks disk %; rule against committing without doctor green |
| Parent repo on wrong branch during merge | 1× | `docs/checklists/ship.md` — verify branch before merge |
| SKILL count drift (76 → 73 → 77 → 78) | 4× | `scripts/check-skill-count.sh` — automated reconciliation |
| Hung Docker builds with no timeout | 3× | `docs/standards/long-running-commands.md` — explicit timeouts + Monitor pattern |
| Plan-file naming convention drift | 1× | `docs/standards/plan-naming.md` |
| Cross-references skipped on skill add | 1× | `rules/library/cross-reference-on-skill-add/` |
| Forgejo vs GitLab CE decision re-litigated | 1× | `docs/improvement/decision-records/INDEX.md` — central index |

## Outcomes shipped earlier in the session (provenance for context)

12 commits to `origin/main` on 2026-05-14:

```text
   b5d1bac  Merge: reconcile SKILL count to 78
   4c87ed1  chore: reconcile SKILL count to 78
   d1b3279  Merge: make ui — one-command stack boot
   956f9e1  make ui — one command, idempotent, boots + opens
   423184f  feat: 2 rules + 1 skill (copy-language-audit)
   f91e79b  Merge: ai-skills-library ↔ Dockyard integration
   0561aaa  ai-skills-library ↔ Dockyard integration — full delivery
   9fa0ee5  Merge homelab console
   b7af767  Add homelab console: unified UI + Makefile
   7014726  Merge: CI workflows + dashboard + root README clarity
   5cbdbd8  self-hosted-git: ship CI workflows + dashboard
   a7b2fd5  Merge self-hosted-git skill (GitLab CE for Mac mini)
```

Five new operational surfaces are now reachable via `make ui` in `skills/infra/console/`:

- SEEME (`:7777`)
- GitLab CE (`https://$GITLAB_HOSTNAME`)
- CI dashboard (`:7778`)
- Homelab Console (`:7779`)
- Dockyard (`:4321`)

---

## File inventory — everything this commit ships

```text
ai-skills-library/
├── docs/
│   ├── master-plans/
│   │   └── 2026-05-14-master-repo-evolution.md         ← this file
│   ├── standards/
│   │   ├── README.md
│   │   ├── skill-anatomy.md
│   │   ├── rule-anatomy.md
│   │   ├── frontmatter.md
│   │   ├── container-labels.md
│   │   ├── cross-references.md
│   │   ├── verification-gates.md
│   │   ├── color-codes.md
│   │   ├── aesthetic-language.md
│   │   ├── plan-naming.md
│   │   ├── doctor-script.md
│   │   └── long-running-commands.md
│   ├── checklists/
│   │   ├── README.md
│   │   ├── new-skill.md
│   │   ├── ship.md
│   │   ├── cross-reference.md
│   │   ├── container-labels.md
│   │   ├── doctor.md
│   │   └── after-ship-audit.md
│   ├── templates/
│   │   ├── README.md
│   │   ├── SKILL.md.template
│   │   ├── rule-body.md.template
│   │   ├── rule-meta.json.template
│   │   ├── decision-record.md.template
│   │   ├── migration-guide.md.template
│   │   ├── integration-checklist.md.template
│   │   ├── PLAN.md.template
│   │   ├── gap-audit.md.template
│   │   ├── session-report.md.template
│   │   ├── Makefile.template
│   │   ├── server.ts.template
│   │   ├── single-page-ui.html.template
│   │   ├── docker-compose.with-labels.yml.template
│   │   ├── doctor.sh.template
│   │   └── install.sh.template
│   ├── workflows/
│   │   ├── README.md
│   │   ├── build-new-skill.md
│   │   ├── audit-and-elevate.md
│   │   ├── rip-and-replace-a-tool.md
│   │   ├── multi-surface-build.md
│   │   └── repo-as-study-system.md
│   ├── reports/
│   │   ├── README.md
│   │   ├── INDEX.md
│   │   ├── _template.md
│   │   └── 2026-05-14-sovereign-stack-and-master-repo.md
│   ├── improvement/
│   │   ├── README.md
│   │   ├── gaps-open.md
│   │   ├── elevations-deferred.md
│   │   ├── decisions-pending.md
│   │   ├── recurring-failures.md
│   │   ├── recurring-wins.md
│   │   ├── audits/
│   │   │   ├── README.md
│   │   │   ├── _template.md
│   │   │   ├── 2026-05-14-seeme-v1.md
│   │   │   ├── 2026-05-14-seeme-docker.md
│   │   │   ├── 2026-05-14-homelab-console.md
│   │   │   ├── 2026-05-14-gitlab-ce-skill.md
│   │   │   └── 2026-05-14-dockyard-integration.md
│   │   └── decision-records/
│   │       ├── INDEX.md
│   │       └── _template.md
│   ├── study/
│   │   ├── README.md
│   │   ├── 00-orientation.md
│   │   ├── 01-skill-anatomy.md
│   │   ├── 02-plan-first.md
│   │   ├── 03-cross-reference-rippling.md
│   │   ├── 04-verification-gates.md
│   │   ├── 05-aesthetic-language.md
│   │   ├── 06-multi-surface-design.md
│   │   ├── 07-label-contract.md
│   │   ├── 08-idempotent-commands.md
│   │   ├── 09-yousirjuan-alignment.md
│   │   └── 10-improvement-loops.md
│   └── training/
│       ├── README.md
│       └── drills/
│           ├── d01-skill-scaffold.md
│           ├── d02-add-container-labels.md
│           ├── d03-cross-reference-ripple.md
│           ├── d04-doctor-script.md
│           ├── d05-makefile-make-ui.md
│           ├── d06-plan-first.md
│           ├── d07-gap-audit.md
│           └── d08-decision-record.md
├── skills/
│   └── methodology/                                    ← NEW family (12 skills)
│       ├── README.md
│       ├── plan-first/
│       ├── gap-audit-and-elevation/
│       ├── idempotent-commands/
│       ├── cross-reference-rippling/
│       ├── verification-gates/
│       ├── multi-surface-design/
│       ├── decision-records/
│       ├── compliance-matrix/
│       ├── aesthetic-consistency/
│       ├── graceful-degradation/
│       ├── migration-guide-format/
│       └── doctor-script-pattern/
├── agents/                                             ← NEW top-level folder (6 agents)
│   ├── README.md
│   ├── skill-scaffolder/
│   ├── cross-reference-rippler/
│   ├── ship-auditor/
│   ├── gap-audit-runner/
│   ├── count-keeper/
│   └── label-linter/
├── rules/
│   └── library/                                        ← 5 new alwaysApply rules
│       ├── plan-first-for-substantive/
│       ├── ai-skills-library-labels/
│       ├── cross-reference-on-skill-add/
│       ├── verification-before-ship/
│       └── skill-frontmatter/
├── scripts/                                            ← 3 helper scripts
│   ├── check-skill-count.sh
│   ├── lint-skill-frontmatter.sh
│   └── check-cross-references.sh
└── (modified) README.md + SKILL-INDEX.md + skills/README.md + 2 yousirjuan docs
```

**Total new files:** ~95. **Modified files:** 5.

---

## Execution sequence

This commit ships everything above in one atomic delivery. The recovery tag `pre-master-repo-evolution-2026-05-14` is in place at `origin` so the entire change is reversible with one `git reset --hard`.

Phases (executed in this commit):

1. **Filing system foundation** — `docs/standards/`, `docs/checklists/`, `docs/templates/`, `docs/workflows/` skeletons with real content
2. **Improvement system** — `docs/improvement/` populated with this session's audits, gaps, elevations, failure log
3. **Report system** — `docs/reports/` with this session's report
4. **Study system** — `docs/study/` curriculum
5. **Training system** — `docs/training/` drills
6. **Methodology skills** — `skills/methodology/` (12 stub skills with full frontmatter + intro + TODO sections)
7. **Agents** — `agents/` (6 operational agents as stubs)
8. **Rules** — `rules/library/` (5 new alwaysApply rules)
9. **Scripts** — `scripts/` (3 helper scripts: count, frontmatter, cross-refs)
10. **Cross-reference rippling** — root README + SKILL-INDEX + skills/README + yousirjuan docs
11. **Verification** — count consistency + frontmatter lint + script syntax + link sanity
12. **Commit + merge + push**

## Verification gates (must all be green before ship)

```sh
# 1. SKILL count consistency
actual=$(find skills -name SKILL.md | wc -l | tr -d ' ')
indexed=$(grep -oE '\*\*[0-9]+\*\* total' SKILL-INDEX.md | grep -oE '[0-9]+')
readme=$(grep -oE '[0-9]+ SKILL.md' README.md | grep -oE '[0-9]+')
test "$actual" = "$indexed" && test "$actual" = "$readme"
# expected: silent (success)

# 2. Frontmatter on every new methodology skill
bash scripts/lint-skill-frontmatter.sh skills/methodology/
# expected: all green

# 3. New scripts are syntactically valid
for s in scripts/*.sh; do bash -n "$s" || exit 1; done
# expected: silent (success)

# 4. Help scripts work
bash scripts/check-skill-count.sh
# expected: "all three agree"

# 5. Every doctor.sh template + Makefile template parses
make -C skills/infra/console -n ui 2>&1 | head -1
# expected: shows the first line of the recipe
```

## Out of scope (not in this commit)

- Fleshing out the body of every methodology skill (stubs are first; content over time)
- Fleshing out the body of every agent (stubs ship; logic over time)
- Automating the cross-reference rippler into a Git pre-commit hook (next session)
- A `make audit` target that runs every verification gate (next session)
- Public-facing docs (this repo is private)

## Recovery

If anything in this commit breaks the repo or surprises you on `main`:

```sh
# Roll back to the state right before this commit:
cd ~/Developer/ai-skills-library
git checkout main
git reset --hard pre-master-repo-evolution-2026-05-14
git push origin main --force-with-lease
```

The recovery tag points at `b5d1bac` (the state immediately before this commit). No data loss, no partial state.

## Long-term: the repo as a compounding system

```text
   each session  →  produces:
                     1 report      (docs/reports/<date>-<topic>.md)
                     N audits      (docs/improvement/audits/<date>-<scope>.md)
                     M gaps        (appended to docs/improvement/gaps-open.md)
                     K elevations  (appended to docs/improvement/elevations-deferred.md)
                     1+ decisions  (skills/*/references/<X-vs-Y>.md + indexed)
                     ?  patterns   (folded into skills/methodology/ over time)

   over time     →  the repo accumulates more knowledge than any single agent
                    can hold; every future agent reads docs/study/ as their
                    onboarding curriculum and works at a higher baseline.
```

That is what this commit operationalizes.
