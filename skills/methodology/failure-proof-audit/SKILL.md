---
name: failure-proof-audit
id: SK-0112
keywords: [run-audit, check-gaps, build-leadsheet]
hash: c9e9f47
relations: [conversation-retrospective-extraction, post-ship-elevation-pass]
before: [gap-audit-and-elevation, plan-first-substantive-changes]
governed_by: [RL-0039, RL-0044, RL-0043]
meta: dynamic
description: >-
  A multi-pass audit methodology for any repo, project, workflow, prompt, or
  system. Run it as if the system already shipped six months ago and failed —
  then surface every hidden gap, root cause, and rework source, convert every
  finding into a Boolean-testable lead sheet item (Yes/No pass/fail), and
  apply a chain-of-command accountability review before final sign-off. Four
  passes: Primary, Hidden Gap Double-Check, Six-Month Failure Simulation,
  Future-Proofing. Triggers on "audit this system", "failure-proof this",
  "run a full audit", "Boolean lead sheet", "find hidden gaps", "what would
  break after six months", "accountability review", "gap and failure review",
  "make this production-safe", "repo audit before shipping".
---

# Failure-Proof Audit — multi-pass audit with Boolean lead sheets and accountability chain

Run this when a system needs to be production-hardened. It treats the subject as if it already shipped, failed in real-world use after six months, and must be fully audited and rebuilt stronger before it ships again. Every finding is converted into a Boolean-testable item. Every task goes through a chain-of-command review before final approval.

---

## The four audit passes

### Pass 1 — Primary Audit

Find the visible issues: gaps, missing systems, weak workflows, unclear logic, unsafe actions, missing files, repeated work, missing safeguards, missing standards, missing documentation, operational risks.

### Pass 2 — Hidden Gap Double-Check

Re-audit Pass 1 specifically looking for: hidden dependencies, edge cases, unclear ownership, missing recovery paths, missing rollback logic, missing validation, hidden duplication, missed automation opportunities, missing Boolean checks.

### Pass 3 — Six-Month Failure Simulation

Act as if the system already failed. Study:
- Why it failed
- What users struggled with
- What broke under scale
- What created technical debt
- What became difficult to maintain
- What became unsafe
- What should have been designed differently

Turn every failure into: stronger standards, workflows, repo structures, automations, safeguards, templates, validation systems, and Boolean lead sheets.

### Pass 4 — Future-Proofing

Identify: scalability risks, future maintenance risks, training risks, onboarding risks, automation opportunities, modularity upgrades, repo intelligence improvements, operational bottlenecks, long-term failure points.

---

## The Boolean lead sheet format

Every finding becomes a testable row. No vague recommendations — every item has a pass condition and a fail condition.

```markdown
| Item ID | Category | Requirement | Boolean Test | Pass Condition | Fail Condition | Status | Evidence Needed | Fix Needed | Owner | Reviewer | Final Approval |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AUD-001 | Repo Safety | Repo has safe branch before edits | Does a safe branch exist? | Yes, named branch exists | No branch was created | Pass / Fail / Blocked | Branch name | Create branch before work | Employee | Mgr | Director |
| GIT-001 | Git Safety | Status checked before changes | Was status reviewed first? | Yes, output confirmed clean | No status check performed | Pass / Fail | Status output | Run git status before edit | Employee | Mgr | Director |
```

**Boolean test statuses:** `Pass` · `Fail` · `Blocked` · `Needs Fix` · `Needs Review` · `Ready` · `Approved`

**Every lead sheet row must include:**
1. Item ID
2. Category
3. Requirement
4. Boolean Test (Yes/No question)
5. Pass Condition
6. Fail Condition
7. Status
8. Evidence Needed
9. Fix Needed
10. Owner / Role
11. Reviewer
12. Final Approval

---

## The chain-of-command review structure

No task is complete without verification and review through the full chain:

**Employee** — Performs the task, documents the work, records proof, lists findings, identifies blockers, marks completion status.

**Assistant Manager** — Reviews the employee's work, checks for visible gaps, validates proof, checks standards, identifies missing items, returns corrections when needed.

**Manager** — Validates both prior reviews, checks operational quality, validates repo safety, checks scalability and maintainability, confirms readiness.

**Director** — Reviews the full chain, validates all audit passes, checks long-term operational safety, approves final standards, authorizes shipment only if the work is fully green.

**No task may advance without:** proof → review → correction → re-validation → approval.

---

## The 32-section required output

When running a full audit, the output must include all 32 sections:

1. Executive Audit Summary
2. Six-Month Failure Review
3. Primary Gap List
4. Hidden Gap Double-Check
5. Root Cause Analysis
6. Lessons Learned
7. Rework Prevention Plan
8. Skills To Build
9. Skills To Improve
10. Rules To Add
11. Context Files To Create
12. Agents To Create
13. Templates To Save
14. Docs To Write
15. Checklists To Enforce
16. Workflows To Improve
17. Repo Structures To Add
18. Filing Structure Plan
19. DRY Method Upgrades
20. Automation Opportunities
21. Validation Systems
22. Safety Systems
23. Monitoring Systems
24. Git Safety Plan
25. Scalability Improvements
26. Future-Proofing Improvements
27. Boolean Lead Sheet
28. Checklist-Ready Audit Table
29. Final Action Checklist
30. Repo Filing Map
31. Approval Chain Records
32. Final Director-Level Readiness Confirmation

---

## Git safety requirements (always run before filing findings)

Before any audit findings are filed into a repo, verify the repo is safe:

| Item ID | Category | Requirement | Boolean Test | Pass | Fail |
|---|---|---|---|---|---|
| GIT-001 | Git Safety | Status checked before changes | Status reviewed first? | Yes, output confirmed clean | No check performed |
| GIT-002 | Git Safety | Safe working branch exists | Branch created before edits? | Yes, named branch active | Working on main directly |
| GIT-003 | Git Safety | Diff reviewed before commit | Diff reviewed? | Yes, diff confirmed | No diff review |
| GIT-004 | Git Safety | Rollback is possible | Can this be undone? | Yes, branch can be deleted | Irreversible change made |
| GIT-005 | Git Safety | Repo state confirmed after | Status clean after commit? | Yes, nothing unexpected staged | Uncommitted or stray files |

---

## DRY method trigger — when to create a reusable fix

Any finding that appears more than once across passes must be promoted to a reusable solution:

| If it repeats... | Build this |
|---|---|
| A manual step | Template or automation |
| A configuration decision | Config file + standard |
| A check that's done by hand | Validation script or checklist |
| A workflow that's rebuilt from memory | Documented workflow + template |
| A class of bug | Rule + CI assertion |
| A formatting standard | Template |
| An approval step | Approval checklist with Boolean rows |

---

## Finding categories and their right homes

| Finding type | Where it goes |
|---|---|
| Reusable process with trigger | `skills/<category>/<name>/SKILL.md` |
| Always-on behavior rule | `rules/library/<name>/` |
| Step-by-step gate | `docs/checklists/<name>.md` |
| Starter structure | `templates/<category>/<name>/` |
| Audit report | `docs/audits/<date>-<subject>.md` |
| Recurring failure pattern | `docs/improvement/recurring-failures.md` |
| Product/system context | `context/<name>-context.md` |

---

## Quality gates — before calling any audit complete

- [ ] All four passes completed
- [ ] Every finding has a Boolean lead sheet row
- [ ] Every row has a pass condition, fail condition, and evidence requirement
- [ ] Every row has an owner role and reviewer role
- [ ] Git safety items verified and in the lead sheet
- [ ] All findings classified and routed to correct homes
- [ ] DRY method applied — repeated steps have proposed reusable fixes
- [ ] Six-month failure simulation produced at least 3 structural improvements
- [ ] Final Director-level readiness confirmed (or documented as blocked with reason)

---

## Anti-patterns

- ❌ Running only Pass 1 and calling it a full audit
- ❌ Vague findings without Boolean test — "needs improvement" is not a finding
- ❌ No evidence requirement — every pass/fail must specify what proof is needed
- ❌ Skipping the failure simulation — the most valuable pass is imagining what breaks after six months
- ❌ Findings filed without a fix path — every finding needs a proposed resolution
- ❌ No chain-of-command sign-off for high-stakes changes

---

## Relationship to other skills

- `conversation-retrospective-extraction` — extracts all findings from a session; this skill AUDITS a system for failures
- `skill-nutrients-decanter` — filters what's worth filing (nutrients); this skill runs the four-pass audit that surfaces what needs to be filtered
- `post-ship-elevation-pass` — the lightweight version run after every individual ship; this is the full enterprise-grade audit for systems at scale
- `what-makes-a-good-skill` — the quality gate for skills; this skill's Boolean lead sheet applies the same pattern to any system

---

## Invocation

- "Use **failure-proof-audit**."
- "Audit this system as if it failed after six months."
- "Run the full audit with Boolean lead sheets."
- "Apply the failure-proof audit to [repo / project / system]."
- "Find every hidden gap and convert it to a testable checklist."

## Reference implementation

The DustPan v0.21–v0.27 arc is the closest lived example: after each ship, the gap audit (Pass 1) and hidden-gap double-check (Pass 2) caught: the fake-setTimeout completion bug, the stale bin/xcc references, the missing plan files 0021-0024, the misplaced Skill Nutrients Decanter and Failure-Proof Audit files. The six-month failure simulation (Pass 3) surfaced: the rebrand-sweep anti-pattern now codified as `make-check-defense-in-depth`.
