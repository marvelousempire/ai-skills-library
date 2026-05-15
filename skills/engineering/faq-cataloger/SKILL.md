---
name: faq-cataloger
id: SK-0140
hash: 6c4d9e1
keywords: [run-faq, check-cataloger, file-faq]
relations: [question-decomposer, catchall-processor]
before: [question-decomposer]
governed_by: [RL-0045, global]
meta: dynamic
goal: Every processed question type has its own MD file in the FAQ database so repeated questions are immediately answered from the catalog without re-processing.
description: >-
  Catalogs processed questions into individual MD files in docs/faq/ — one file
  per question TYPE forming a structured database. Each file accumulates examples,
  the canonical answer, how many times asked, first seen, and last seen. Triggers
  on "catalog this question", "add to FAQ database", "create a FAQ entry",
  "log this to the FAQ", "build the FAQ", "update the FAQ file".
---

# faq-cataloger — build the FAQ database, one file per question type

Every time a question is processed through the Receiving Chain and given a function label, it gets catalogued into its own MD file. Not just logged — catalogued. The question-log.md is the raw ledger; these individual files are the structured database.

---

## When to use this skill

- After the question-decomposer produces a function label for any question
- When building the FAQ database from an existing question log
- When a question type has been asked more than once (canonical answer needed)
- "Create a FAQ entry for this question type"

---

## The FAQ file structure

One file per function label. Stored at `docs/faq/{function-label}.md`:

```markdown
# FAQ: {function-label}
**Skill:** {skill-name} ({skill-id})
**Times asked:** {count}
**First seen:** {date}
**Last seen:** {date}

## Canonical answer

[The definitive, concise answer to this question type.]

## Example questions (concise form)

- "{concise form 1}"
- "{concise form 2}"

## Raw examples (first 3)

1. "{raw question 1}" — {date}
2. "{raw question 2}" — {date}
3. "{raw question 3}" — {date}
```

---

## How to run it

```bash
# Catalog all questions in question-log.md into individual FAQ files
python3 scripts/catalog-faq.py

# Catalog a single function label
python3 scripts/catalog-faq.py --function setup-repo

# Dry run
python3 scripts/catalog-faq.py --dry-run
```

---

## The database grows automatically

Every time the question-decomposer logs a question, `catalog-faq.py` is called:
- If a file for that function-label already exists → increments count, adds the example, updates `last seen`
- If no file exists → creates a new one with this question as the first entry
- The canonical answer is left blank for human completion (or AI can populate from the matching skill's goal)

---

## What this is NOT for

- Not for storing every raw question — that's `docs/faq/question-log.md`
- Not for answering questions — that's the skill the function-label maps to
- Not for routing — that's the Orchestrator's job

---

## Anti-patterns

- ❌ One giant FAQ file — every function label gets its OWN file
- ❌ Cataloging without decomposing first — always run question-decomposer before cataloging
- ❌ Editing raw examples — they are the unmodified record

---

## Invocation

- "Use **faq-cataloger**."
- "Catalog this question into the FAQ database."
- "Create a FAQ entry for {function-label}."
