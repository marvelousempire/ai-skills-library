# The Catchall System
**managed by the duty and order of AVERY GOODMAN**

> Like a domain's catch-all email address — when a request arrives that no specific skill, rule, agent, or context can handle, it lands here. The system processes it, and the library grows to handle it next time.

---

## What it is

The catchall is the self-improvement mechanism of the AI Skills Library. Any request that falls outside known products gets logged here. A GitHub Actions workflow processes the queue using the library itself — finding the closest match, handling what it can, and filing proposals for what it can't.

The library learns from what it can't do.

---

## How a request enters the catchall

Any AI or agent using this library should log to the catchall when:
- No skill matches the user's request by name, trigger phrase, or keyword
- No rule applies to the situation
- The request is genuinely novel — not covered by any product in the library

**Add to the queue by appending to `docs/catchall/queue.md`** with this format:

```markdown
## [DATE] [SHORT TITLE]
**Received:** 2026-05-14T23:00:00Z
**Request:** [Exact or paraphrased user request]
**Session:** [Context or project name]
**Attempted matches:** [Skill/rule names tried, and why they didn't fit]
**Status:** pending
```

---

## How the catchall is processed

A GitHub Actions workflow runs hourly and on every push to `queue.md`.
It calls `scripts/process-catchall.py` which:

1. Reads every `pending` item in the queue
2. Searches the library by keyword and description match
3. If a close match exists: attempts to handle and logs the result
4. If no match: runs the gap-audit pattern and files a skill proposal
5. Updates each item's status: `handled` · `proposed` · `needs-human`

Items marked `needs-human` appear in the library's GitHub Issues for manual review.

---

## How the library auto-improves

When a catchall item triggers a new skill proposal:
- `process-catchall.py` appends to `docs/proposals/catchall-proposals.md`
- The proposal follows the `ai-proposal-review-inbox` pattern
- A human reviews and either accepts (creates the skill) or dismisses
- The new skill handles the same request next time — it never hits the catchall again

---

## Files in this folder

| File | Purpose |
|---|---|
| `queue.md` | The live catchall queue — add unmatched requests here |
| `README.md` | This file — how the catchall works |
