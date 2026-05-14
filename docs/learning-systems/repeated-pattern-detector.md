# Repeated-pattern detector

When the same pattern recurs ≥3 times across sessions, propose extracting it as a library artifact.

## Examples of patterns to watch for

| Pattern | After N recurrences |
|---|---|
| Same migration safety check needed | 2 → propose a rule |
| Same workflow steps repeated | 2 → propose a skill |
| Same conflict-resolution mechanic | 2 → propose a skill + checklist |
| Same incident shape | 3 → promote pain-journal entry to a rule |
| Same scaffold cobbled together | 2 → promote to a template |

## The detection process

After each session, scan the master report's "What happened" timeline for repetition signals:

```python
# Pseudo-code; this is a manual review process today
for incident in master_report.incidents:
    similar = search_pain_journal(incident.shape)
    if len(similar) >= 2:
        propose_promotion(incident)
```

## Promotion paths

### Pattern → Rule
When the recurring pattern is "always do X before Y" — write a `rules/library/<name>/body.md` + `meta.json` with `alwaysApply: true` if it should fire on every relevant file.

### Pattern → Skill
When the recurring pattern is "here's a workflow you can invoke" — write a `skills/engineering/<name>/SKILL.md` with explicit trigger phrases.

### Pattern → Checklist
When the recurring pattern is "here's the list of things to check at moment X" — write a `checklists/<name>.md`.

### Pattern → Template
When the recurring pattern is "I keep cobbling together this same scaffold" — write a `templates/<name>` for reuse.

### Pattern → Agent
When the recurring pattern is "I keep running this multi-tool agentic loop" — write an `agents/<name>.md` spec.

## Anti-pattern: over-extraction

Not every recurrence deserves an artifact. Heuristics for "leave it as one-off":
- The recurrence is plausibly random / unrelated incidents
- The cost of the recurrence is < 5 min each time
- The extraction would be more confusing than helpful
- The pattern is too specific to be portable

## Process

This file is currently a manual review process. Future automation:
- A script that diffs the latest master report against pain-journal entries
- A skill that proposes promotions
- A CI job that flags 3+ recurrences in a 30-day window

## Origin

Formalized 2026-05-14 trainer-marketplace session.
