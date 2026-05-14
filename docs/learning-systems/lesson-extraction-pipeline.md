# Lesson extraction pipeline

How session lessons flow into the library as durable artifacts.

## The 4-stage flow

```
Session ends
   │
   ▼
1. Master Report
   docs/master-reports/YYYY-MM-DD-<session>.md
   │
   ▼
2. Per-incident pain entries
   docs/pain-journal/YYYY-MM-DD-<slug>.md
   │
   ▼
3. Filed artifacts
   rules/library/<rule>/ + skills/engineering/<skill>/ + templates/ + checklists/
   │
   ▼
4. Index updates
   SKILL-INDEX.md + README.md + AGENTS.md + rules/packs/*.json
```

## Stage 1 — Master Report

At the end of every substantive session, produce a master report:
- Timeline of what happened
- Lessons extracted, ranked by leverage
- Filed-as table pointing at the artifacts shipped in the same PR
- Cross-references everywhere

Template: [`docs/learning-systems/session-retrospective-template.md`](session-retrospective-template.md).

## Stage 2 — Pain Journal entries

For each specific incident the master report surfaces, produce a per-incident write-up:
- Symptom
- Diagnose (30-second confirmation)
- Fix
- Root cause
- First seen (date + PR + SHA)
- Prevention

Format: [`docs/pain-journal/format.md`](../pain-journal/format.md).

## Stage 3 — Filed artifacts

Each lesson gets a concrete artifact:

| Lesson shape | Artifact type | Directory |
|---|---|---|
| "Always do X before Y" | Rule | `rules/library/<name>/` |
| "When you need to do X, here's how" | Skill | `skills/engineering/<name>/` |
| "When in situation X, run these checks" | Checklist | `checklists/<name>.md` |
| "Here's the scaffold for X" | Template | `templates/<name>` |
| "When you need a full agentic loop for X" | Agent | `agents/<name>.md` |
| "Here's the step-by-step for X situation" | Playbook | `docs/playbooks/<name>.md` |

## Stage 4 — Index updates

Every new artifact updates the indexes in the same PR:
- `SKILL-INDEX.md` lists every skill
- `README.md` fast-nav table
- `AGENTS.md` agent registry
- `rules/packs/*.json` for rules that should auto-load in consumer repos

## Trigger criteria

Run the pipeline when:
- A session took >2 hours of focused work
- ≥3 distinct lessons surfaced
- A pattern recurred ≥2 times in the session
- A bug fired in production that wasn't already documented
- An elevation discussion happened

Skip when:
- Session was a single typo fix
- Session was reading-only / research-only
- No new patterns emerged

## Repeated-pattern detector

See [`repeated-pattern-detector.md`](repeated-pattern-detector.md) — when the same pattern recurs ≥3 times, propose extracting it as a skill / rule.

## Origin

Formalized 2026-05-14 trainer-marketplace session. This file IS the meta — the library learns about its own gaps via this pipeline.
