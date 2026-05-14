---
name: catchall-processor
id: SK-0137
hash: e4b9c3f
keywords: [run-catchall, check-processor, file-catchall]
relations: [gap-audit-and-elevation, create-skill, ai-proposal-review-inbox]
before: []
governed_by: [RL-0045, global]
meta: dynamic
goal: Every unmatched request either finds the right skill or files a proposal so the library grows to handle it next time.
description: >-
  The AI Skills Library catchall — when no skill, rule, agent, or context
  matches a request, log it to the catchall queue and let the processor handle
  it. Like a domain's catch-all email address. Unmatched requests become skill
  proposals. The library grows from its own gaps. Triggers on "nothing matches
  this", "log this to catchall", "no skill found", "add to catchall queue",
  "the library can't handle this yet", "unmatched request", "what do we do
  when no skill fits", "library gap found".
---

# catchall-processor — the library learns from what it can't do

When a request arrives that no existing product can handle, it's not an error — it's a learning opportunity. This skill defines how to log it, how it gets processed, and how the library grows to handle it next time.

---

## When to use this skill

- You've tried to match a user request to a skill, rule, agent, or context and found nothing
- The request is genuinely novel — outside the current library's scope
- Any AI using this library encounters a gap in its coverage

---

## The catchall flow

```
Request arrives
     ↓
Router tries to match (name → trigger phrase → keywords → category)
     ↓ NO MATCH
Log to docs/catchall/queue.md (structured entry, status: pending)
     ↓
GitHub Actions workflow triggers (on push or hourly)
     ↓
process-catchall.py runs — scores every product against the request
     ↓
Score ≥ 4.0 → HANDLED      — strong match found, invokes the skill
Score ≥ 2.0 → NEEDS-HUMAN  — partial match, GitHub Issue opened
Score < 2.0 → PROPOSED     — no match, skill proposal filed
     ↓
Library grows — the proposal becomes a new skill that handles
                this request type in every future session
```

---

## How to log a catchall item

Append to `docs/catchall/queue.md`:

```markdown
## [YYYY-MM-DD] [Short title describing the request]
**Received:** 2026-05-14T23:00:00Z
**Request:** The exact or paraphrased user request that had no match
**Session:** The project or conversation context
**Attempted matches:** Skill names tried and why they didn't fit
**Status:** pending
```

---

## The scoring system

`process-catchall.py` scores each product against the request:

| Score threshold | Result | What happens |
|---|---|---|
| ≥ 4.0 | `handled` | Strong match — skill invoked, result logged |
| 2.0–3.9 | `needs-human` | Partial match — GitHub Issue opened for review |
| < 2.0 | `proposed` | No match — skill proposal filed |

Scoring uses: action keyword overlap (3 pts each), name token match (2 pts each), description word match (1 pt each), goal word match (0.5 pts each).

---

## The self-improvement loop

Every `proposed` item feeds a skill proposal to `docs/proposals/catchall-proposals.md`.
This follows the same review-inbox pattern as `ai-proposal-review-inbox` (SK-0001).

A human reviews and accepts (creates the skill) or dismisses. Once accepted:
- The new skill is in the library
- The same request type never hits the catchall again
- The processor's scoring immediately finds the new skill

The library has no permanent blind spots — only temporary ones that heal themselves.

---

## Running the processor manually

```bash
# Process the full queue
python3 scripts/process-catchall.py

# Dry run (preview changes without writing)
python3 scripts/process-catchall.py --dry-run

# Test a single request against the library
python3 scripts/process-catchall.py --item "set up a new iOS app repo"
```

---

## What this is NOT for

- Not for requests that DO have a matching skill — just invoke that skill directly
- Not for requests the user hasn't made yet — the catchall is reactive, not predictive
- Not a replacement for `create-skill` — the catchall proposes; `create-skill` builds

---

## Anti-patterns

- ❌ Using the catchall as a trash bin — every item gets processed, nothing is ignored
- ❌ Logging vague requests ("help me") — the matcher needs enough signal to score
- ❌ Never reviewing `needs-human` items — GitHub Issues are the escalation path
- ❌ Dismissing proposals without reading them — the proposal IS the library learning

---

## Invocation

- "Use **catchall-processor**."
- "No skill matched this — log it to the catchall."
- "Add this to the catchall queue."
- "What do we do when the library can't handle something?"

---

## Reference implementation

`docs/catchall/queue.md` — the live queue.
`scripts/process-catchall.py` — the matcher and proposal filer.
`.github/workflows/catchall-processor.yml` — the automation.
