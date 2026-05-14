# FAQ — Question Intelligence Layer
**managed by the duty and order of AVERY GOODMAN**

> Every question ever posed to this library gets logged here. Every question gets decomposed into two things: what it's really asking (concise form) and what type of work it calls for (function label). Over time, this folder becomes the institutional memory and routing intelligence of the entire system.

---

## What gets logged

Every incoming question, prompt, or task request that reaches the orchestrator agent or any skill invocation. Not just unanswered questions — every question, answered or not.

## The two-part decomposition

For every input, the question decomposer produces:

**Part 1 — Concise form:**
The stripped-down essence of the request. 20 words or fewer. No filler. No context noise. Just what it's asking.

**Part 2 — Function label:**
The action-verb category of what this question type calls for. Maps directly to a skill keyword or type.

```
RAW:       "I need to know if we can set up a repo for the new iOS app
            we're building, you know like the standard way we do things"

CONCISE:   Set up new iOS app repo using the AVERY GOODMAN standard

FUNCTION:  setup-repo → SK-0135 (new-repo-setup)
```

## What the log becomes over time

- **Repeated concise forms** = FAQ entries — common questions get canonical answers
- **Clustered function labels** = coverage map — shows which skills are used most and what's missing
- **Unclustered functions** = catchall candidates — questions that don't map to any skill yet
- **Pattern pairs** = routing training data — teaches the system to route faster

## Files in this folder

| File | Purpose |
|---|---|
| `question-log.md` | Every decomposed question, chronological |
| `function-map.md` | Discovered question-type → function mappings |
| `faq-answers.md` | Canonical answers to the most common questions |
