---
name: ai-proposal-review-inbox
id: SK-0001
keywords: [proposal, review, inbox]
description: >-
  Pattern for letting an AI agent "grow" a hand-curated source file (cleaners,
  rules, fixtures, prompts, library entries) without ever auto-mutating it.
  AI proposes → record lands in a review inbox → user accepts → server
  generates a paste-ready snippet → user pastes into source and commits.
  Canonical source stays human-authored. Triggers on "AI proposes new", "let
  the AI add to", "review inbox", "paste-ready snippet", "never auto-edit
  source", "AI suggestion queue", "human-in-the-loop AI tool", "self-extending
  library", "propose new cleaner", "propose new rule", "propose new fixture".
---

# AI proposal review inbox — let an AI agent grow your library without touching source

The pattern: you have a hand-curated source file (cleaners, rules, prompts, fixture data, library entries). You want an AI agent to suggest additions because it sees patterns you don't. But you DO NOT want the AI to auto-mutate the canonical file — every entry has been reviewed, has curated text, and the git diff should always read "human wrote this."

The answer: **proposals**. AI calls a `propose_*` tool with structured input. Server validates and persists to an inbox file (JSON). UI surfaces a queue. User accepts → server generates a paste-ready snippet matching the existing source style. User pastes the snippet, commits, ships. The AI's contribution is the **research, structure, and formatting** — never the source edit itself.

## When to use this skill

- Building an AI agent that should "learn" a curated library over time (cleaners, fixtures, prompts, examples, recipes)
- Designing how an AI tool augments a hand-maintained config / source file
- The user says "let the AI suggest additions" or "let it propose new X"
- You want AI participation without losing source-file authorship
- You want the git history to remain a record of human decisions

## The architecture (six pieces)

1. **`propose_*` tool** — strict input schema; never executes, only files a record
2. **JSON storage** at `~/.<app>/proposals.json` (or a Postgres table in server mode). Atomic writes (tmp + rename)
3. **Status state machine** — `pending → accepted | dismissed`. Never goes back; history preserved
4. **Snippet generator** — converts proposal → paste-ready snippet matching the source's existing style (Python tuples, JSON entries, YAML, Markdown rows — whatever the canonical file format is)
5. **Review inbox UI** — filter tabs (pending / accepted / dismissed / all), per-proposal expand showing rationale + cost + paths, accept/dismiss buttons
6. **Pending count badge** — surface unreviewed proposals in the sidebar so they don't pile up unseen

## The hard rules

1. **The canonical source file is never mutated by the AI tool.** Period. Accept generates a snippet; the user pastes.
2. **The snippet matches the existing source style exactly** — same indentation, same quote style, same comment format. A snippet that requires reformatting is a bug in the generator.
3. **Status transitions are one-way.** Accept can become a follow-up dismiss only by manual file edit. Dismissed proposals stay visible in history.
4. **The AI tool that files the proposal has a strict input_schema.** Required fields are required. Validation catches malformed proposals before they reach the inbox.
5. **The inbox surface tells the user what changes between cleaner and AppleScript** (or whatever your kinds are). Different `kind` values → different snippet templates → different UI rendering.

## Concrete schema (lifted from DustPan)

```python
{
  "id":                    "<uuid-12>",
  "created_at":            <unix>,
  "status":                "pending" | "accepted" | "dismissed",
  "name":                  "<short label>",
  "category_id_suggested": "<which category this fits>",
  "rationale":             "<why this matters>",
  "cost_to_user":          "<what rebuilds / what's lost>",
  "paths":                 [{"label": "...", "path": "...", "tier": "safe|probably_safe|caution"}],
  "shell":                 "<optional custom action>",
  "kind":                  "cleaner" | "applescript" | "...",  # determines snippet template
  "script_body":           "<for applescript kind: the full source>",
  "file_name":             "<suggested filename>",
  "source":                "<origin tag>",   # e.g. "ai-chat", "ai-chat-applescript"
}
```

## Two-artifact accept (the AppleScript pattern)

For proposals where one accept produces **multiple paste-ready artifacts** (e.g. AppleScript + its doc), the snippet endpoint returns a structured artifacts dict, not a single string:

```json
{
  "proposal": { ... },
  "snippet": "<combined text blob>",
  "applescript": {
    "script":      "<full .applescript source>",
    "script_path": "applescripts/foo.applescript",
    "doc":         "<full markdown doc>",
    "doc_path":    "applescripts/docs/0005-foo.md",
    "file_name":   "foo.applescript",
    "doc_number":  5
  }
}
```

The UI renders TWO copy blocks with the suggested target paths shown verbatim. The user pastes each into the suggested location.

## Inline editing (the v0.27 elevation)

Pending proposals can be edited before accept. The PATCH endpoint accepts a whitelist of fields (no status flips, no id changes). The UI has an Edit button that swaps the card for an inline form. This solves "the AI's wording was off but the idea is right" without requiring re-prompting.

## What this preserves

- **Authorship.** The git log still says "person wrote this."
- **Reviewability.** Every line in the canonical file has been read by a human at least twice (when proposed, when pasted).
- **Trust contract.** The user knows every entry was reviewed — the AI's hallucinations can't sneak in.
- **Cost transparency.** The cost annotation (see `cost-annotation-discipline`) is reviewed at accept time, not generated at runtime.

## Anti-patterns

- ❌ Auto-applying proposals after a "high confidence" threshold. There is no such threshold.
- ❌ Accept directly modifies source. Defeats the entire purpose.
- ❌ Inbox without a pending-count surface. Proposals pile up unseen.
- ❌ AI-generated cost text shipped without curation. Hallucinations become facts.
- ❌ Snippet that doesn't match source style. User has to reformat → friction → users stop accepting → AI growth path dead.

## Invocation

- "Use **ai-proposal-review-inbox**."
- "Let the AI propose new entries to this library without auto-mutating the source."
- "Design the review flow for an AI-augmented config tool."
- "Add a `propose_*` tool that files to a review inbox."

## Reference implementation

DustPan v0.23–v0.27. Backend: [`web/proposals_store.py`](https://github.com/marvelousempire/dustpan/blob/main/web/proposals_store.py) (storage + snippet generators for two kinds). Tool: `propose_new_cleaner` + `propose_new_applescript` in [`web/agent_tools.py`](https://github.com/marvelousempire/dustpan/blob/main/web/agent_tools.py). Endpoints: `GET /api/ai/proposals[?status]`, `GET /api/ai/proposals/count`, `GET /api/ai/proposals/<id>/snippet`, `POST .../accept`, `POST .../dismiss`, `POST .../edit`. UI: [`apps/web/src/components/ProposalsInbox.tsx`](https://github.com/marvelousempire/dustpan/blob/main/apps/web/src/components/ProposalsInbox.tsx).

Marketing brief: [`docs/marketing/cleaner-proposals.md`](https://github.com/marvelousempire/dustpan/blob/main/docs/marketing/cleaner-proposals.md).
