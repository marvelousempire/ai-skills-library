---
name: question-decomposer
id: SK-0138
hash: 2c7f4a1
keywords: [run-question, check-decomposer, file-question]
relations: [catchall-processor, gap-audit-and-elevation]
before: []
governed_by: [RL-0045, global]
meta: dynamic
goal: Every incoming question has a clean concise form and a function label before any routing happens so the system matches from signal not noise.
description: >-
  The intake layer for the AI Skills Library. Before any skill or rule is
  invoked, the question decomposer strips the raw input to its ≤20-word
  concise essence and classifies its function type (a verb-object label that
  maps to a skill). Logs both to docs/faq/question-log.md. Triggers on
  "decompose this question", "strip this request", "what type of question is
  this", "normalize this input", "classify this request", "what function is
  this", "clean up this prompt before routing", "two-part question".
---

# question-decomposer — strip every input to concise form + function label

Raw questions are messy. They have filler, context noise, hedging language, and false starts. The router needs clean signal. This skill produces it — every time, before routing, automatically.

---

## When to use this skill

- Before any skill or rule is invoked — ideally as the first step in any session
- When a question is long, rambling, or unclear about what it's asking
- When you need to log what was asked (for FAQ and routing intelligence)
- Orchestrator agents should call this on every incoming request

---

## The two outputs

**Part 1 — Concise form (≤20 words)**
The stripped-down essence. No filler. No context noise. The signal.

**Part 2 — Function label**
The action-verb category. `verb-object` format. Maps to a skill keyword.

```
RAW:       "I need to know if we can set up a repo for the new iOS app
            we're building you know like the standard AVERY GOODMAN way"

CONCISE:   Set up new iOS app repo with AVERY GOODMAN standard

FUNCTION:  setup-repo → SK-0135 (new-repo-setup)
```

---

## The function label taxonomy

Function labels follow the same `verb-object` format as skill keywords. 18 known functions as of today:

| Function | Maps to | When it fires |
|---|---|---|
| `setup-repo` | new-repo-setup | "set up", "create", "init", "scaffold", "new repo" |
| `align-repo` | existing-repo-alignment | "align", "reshape", "bring to standard" |
| `brand-repo` | avery-goodman-repo-standard | "brand", "AVERY GOODMAN", "readme sections" |
| `audit-gaps` | gap-audit-and-elevation | "audit", "gap", "what's left", "elevation" |
| `run-audit` | failure-proof-audit | "full audit", "six month", "boolean lead" |
| `run-check` | make-check-defense-in-depth | "check", "verify", "validate", "test" |
| `write-skill` | create-skill | "write a skill", "new skill", "add skill" |
| `extract-lessons` | conversation-retrospective-extraction | "extract", "retrospective", "what did we learn" |
| `filter-nutrients` | skill-nutrients-decanter | "nutrient", "worth filing", "filter" |
| `verify-merge` | confirm-ship-clearly | "ship", "release", "is it live", "confirm" |
| `pull-latest` | make-update-make-doctor | "update", "pull", "git pull" |
| `design-structure` | product-repo-architecture | "architecture", "structure", "how organized" |
| `write-feature-md` | feature-marketing-md | "marketing", "launch", "channel copy" |
| `route-catchall` | catchall-processor | "nothing matches", "no skill", "can't handle" |
| `annotate-cost` | cost-annotation-discipline | "cost", "what do I lose", "before clicking" |
| `unlock-space` | never-run-sudo-from-app | "sudo", "permission", "ownership" |
| `show-approval` | tool-calling-approval-reentry | "approval", "tool calling", "AI action" |
| `review-proposal` | ai-proposal-review-inbox | "propose", "review inbox", "proposal" |

---

## How to run it

```bash
# Decompose a single question
python3 scripts/decompose-question.py "Your question here"

# With session context (for better log entries)
python3 scripts/decompose-question.py --session my-project "Your question"

# Dry run — preview without logging
python3 scripts/decompose-question.py --dry-run "Your question"

# Batch — one question per line
python3 scripts/decompose-question.py --batch questions.txt

# From stdin (for piping)
echo "Your question" | python3 scripts/decompose-question.py --stdin
```

---

## How the FAQ builds from the log

Every logged entry in `docs/faq/question-log.md` has a concise form and a function label. Over time:

- **Repeated function labels** → those are the high-traffic skills — elevate them
- **Repeated concise forms** → those are FAQ entries — give them canonical answers
- **Function labels without matching skills** → catchall candidates — file proposals
- **The function map** (`docs/faq/function-map.md`) → the routing intelligence, auto-updated

The system gets smarter from every question it's ever seen.

---

## What this is NOT for

- Not a question answerer — it strips and classifies, it doesn't respond
- Not a filter that blocks questions — everything gets logged, nothing is rejected
- Not a replacement for the router — it feeds the router; the router invokes the skill

---

## Anti-patterns

- ❌ Routing from the raw question without decomposing first — noisy signal, worse matches
- ❌ Skipping the log — the FAQ and function map only grow if everything is logged
- ❌ Editing logged entries — the log is append-only, never retroactively corrected
- ❌ Setting outcome to "handled" before confirming the skill actually ran

---

## Invocation

- "Use **question-decomposer**."
- "Decompose this question before routing."
- "What function type is this request?"
- "Strip this to its two-part form."
- "Normalize this input."

---

## Reference implementation

`scripts/decompose-question.py` — the Python implementation (18 function patterns, concise-form extractor, append-only log writer, function-map updater).
`agents/question-decomposer/AGENT.md` — the agent spec for orchestrator use.
`docs/faq/` — the FAQ folder that grows from the log.
