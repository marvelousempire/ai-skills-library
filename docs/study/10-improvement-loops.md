# 10 — Improvement loops

The repo improves over time only because of explicit loops. Each loop has a trigger, a worker, and a place where the output lands.

## The four loops

### Loop 1 — plan → ship

**Trigger:** Substantive change requested
**Worker:** Write a plan, scaffold, ship, verify green
**Output:** Commit on `main` + recovery tag
**Workflow:** [`docs/workflows/build-new-skill.md`](../workflows/build-new-skill.md)

### Loop 2 — ship → audit → improve

**Trigger:** Meaningful work just shipped
**Worker:** Run the gap audit + elevation pass
**Output:** `docs/improvement/audits/<date>-<scope>.md` + append to `gaps-open.md` / `elevations-deferred.md`
**Workflow:** [`docs/workflows/audit-and-elevate.md`](../workflows/audit-and-elevate.md)

### Loop 3 — failure → preventative

**Trigger:** Something broke (Docker daemon, count drift, missed cross-ref)
**Worker:** Document the incident, add a preventative (standard + rule + script)
**Output:** Row in `docs/improvement/recurring-failures.md` + new file under standards/checklists/scripts
**Catalogue:** [`docs/improvement/recurring-failures.md`](../improvement/recurring-failures.md)

### Loop 4 — pattern → codify

**Trigger:** Something worked repeatedly across sessions
**Worker:** Extract the pattern, codify as standard + template + skill
**Output:** Row in `docs/improvement/recurring-wins.md` + new artifact under `docs/standards/`, `docs/templates/`, `skills/methodology/`
**Catalogue:** [`docs/improvement/recurring-wins.md`](../improvement/recurring-wins.md)

## How loops compound

```text
   each session
     │
     ├──► Loop 1 → ship
     │             │
     │             ├──► Loop 2 → audit → gaps-open.md + elevations-deferred.md
     │             │                                │
     │             │                                └──► next session reads
     │             │                                     and picks from these
     │             │
     │             └──► Loop 3 (when something broke)
     │                       └──► preventative under standards/
     │                              └──► next session never re-hits
     │
     └──► Loop 4 (when something worked)
              └──► codified pattern under templates/
                     └──► next session reuses
```

After N sessions, the repo accumulates more knowledge than any single agent can hold. Every future agent starts at session-N's baseline.

## Exercise

Open [`docs/improvement/gaps-open.md`](../improvement/gaps-open.md). Pick one open gap. Plan how you'd close it per [`docs/workflows/build-new-skill.md`](../workflows/build-new-skill.md).

## Done

You've completed the curriculum. Now go practice in [`docs/training/drills/`](../training/drills/).
