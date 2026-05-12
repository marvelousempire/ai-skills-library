---
name: ascii-flow-diagrams
description: When the user asks for a visual of a flow, system, architecture, request lifecycle, or how parts talk to each other — render a Unicode box-and-arrow diagram in a fenced text block. Triggers on phrases like "show me a visual", "draw the flow", "diagram this", "how does X talk to Y", "what does the architecture look like".
---

# ASCII Flow Diagrams

## Purpose

This is the **default** visualization format for any request where the user wants to see how parts of a system relate — services, auth flows, data paths, deployment topologies, hardware nodes, event pipelines, request lifecycles.

The user has confirmed this style "is very easy for me to understand." Reach for it without being asked.

---

## When to use

Trigger on any of:

- "show me a visual / picture / diagram of …"
- "draw the flow / draw out how …"
- "diagram this / map this out"
- "how does X talk to Y" / "how does X connect to Y"
- "what does the architecture look like"
- "walk me through the request / event / signup flow"
- Any time **prose alone** would be a worse explanation than a picture.

When in doubt: render a diagram first, then add 1–3 sentences of caption underneath.

---

## Style rules

1. **Unicode box-drawing chars only.** `┌ ┐ └ ┘ │ ─ ├ ┤ ┬ ┴ ┼ ▲ ▼ ◄ ►`. Never fall back to ASCII `+ - |`.
2. **Always wrap in a fenced `text` block.** ```` ```text ... ``` ```` — guarantees monospace rendering in every surface (terminal, GitHub, Notion, Claude.ai).
3. **Stack related actors in one column** using `├──┤` dividers. The canonical example stacks iOS / Website / Admin into one client box — three actors, one box.
4. **Wire labels sit on the arrow itself:** `◄──── HTTPS + JWT ────►`. Don't bury wire details in the prose below the diagram.
5. **Side attachments (DBs, queues, caches) extend off the right** of a box with a single horizontal arrow and a parenthetical caveat: `◄──── PostgreSQL  (loopback only)`.
6. **Loop-back / shared-path arrows drop below the main row.** Use `▲ │ └──── label ────┘` to indicate "this also happens / reads go the same way."
7. **Width ≤ ~80 cols** so it doesn't wrap in narrow terminals.
8. **One concept per diagram.** If the picture is getting wider than 80 cols or taller than ~20 lines, split it into two.
9. **Caption afterward, not before.** Let the picture land first; explain only what isn't obvious from looking at it.

---

## What NOT to do

- Mermaid / PlantUML / GraphViz — they don't render in plain chat and most terminals.
- ASCII-only `+---+` boxes — Unicode renders cleanly everywhere.
- Burying wire details (`auth`, `JWT`, `polling`, `webhook`) in a prose paragraph below the diagram instead of on the arrow.
- A single mega-diagram with 12 boxes — split it.
- Walls of prose where a diagram would do.

---

## Worked examples

### Example 1 — Client ↔ API ↔ DB (the canonical style reference)

This is the diagram the user pasted as the gold standard for the **style** — multiple clients stacked into one column, labeled wires, a side-attached DB, and a loop-back arrow. The contents are illustrative, not a claim about any specific system.

```text
   ┌──────────────┐                          ┌──────────────┐
   │  iOS / iPad  │◄──── HTTPS + JWT ───────►│              │
   ├──────────────┤                          │              │
   │   Website    │◄──── HTTPS + JWT ───────►│   Backend    │
   │ (player-web) │                          │     API      │◄──── PostgreSQL
   ├──────────────┤                          │  (Express)   │     (loopback only)
   │ Admin panel  │◄──── HTTPS + admin JWT ─►│              │
   └──────────────┘                          └──────────────┘
        ▲                                          │
        │                                          │
        └────── reads go through the same API ─────┘
```

### Example 2 — Event bus / queue fanout

Producer pushes one message; queue fans out to N consumers; failures drop into a dead-letter queue.

```text
   ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
   │   Producer   │─enqueue►│              │──pop───►│ Consumer A   │
   │   (worker)   │         │              │         └──────────────┘
   └──────────────┘         │    Queue     │         ┌──────────────┐
                            │   (Redis)    │──pop───►│ Consumer B   │
                            │              │         └──────────────┘
                            │              │         ┌──────────────┐
                            │              │──pop───►│ Consumer C   │
                            └──────┬───────┘         └──────────────┘
                                   │
                                   │ retries exhausted
                                   ▼
                            ┌──────────────┐
                            │ Dead-letter  │
                            │    queue     │
                            └──────────────┘
```

### Example 3 — OAuth handshake (sequence-style)

Three actors across the top, time flowing downward, request/response pairs as labeled arrows. The closest the ASCII style gets to a sequence diagram.

```text
   ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
   │     User     │         │     App      │         │   Identity   │
   │  (browser)   │         │  (frontend)  │         │   Provider   │
   └──────┬───────┘         └──────┬───────┘         └──────┬───────┘
          │  click "Sign in"       │                        │
          │───────────────────────►│                        │
          │                        │  redirect to IdP       │
          │                        │───────────────────────►│
          │  login form                                     │
          │◄────────────────────────────────────────────────│
          │  credentials                                    │
          │────────────────────────────────────────────────►│
          │                        │  auth code             │
          │                        │◄───────────────────────│
          │                        │  exchange code → JWT   │
          │                        │───────────────────────►│
          │                        │  access + refresh      │
          │                        │◄───────────────────────│
          │  signed in             │                        │
          │◄───────────────────────│                        │
```

### Example 4 — Deployment pipeline

Linear left-to-right with a failure side-branch and a rollback loop-back from the far right to a previous artifact.

```text
   ┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────────┐
   │ git push │───►│      CI      │───►│ Staging  │───►│  Production  │
   │  (main)  │    │ (build+test) │    │  deploy  │    │    deploy    │
   └──────────┘    └──────┬───────┘    └──────────┘    └──────┬───────┘
                          │                                   │
                          │ tests fail                        │ smoke fail
                          ▼                                   │
                   ┌──────────────┐                           │
                   │   Block PR   │                           │
                   │    notify    │                           │
                   └──────────────┘                           │
                                                              │
   ┌──────────────────────────────────────────────────────────┘
   │ rollback to previous artifact
   ▼
   ┌──────────────┐
   │  Production  │
   │  (prev tag)  │
   └──────────────┘
```

### Example 5 — Hardware / nodes topology

Physical machines, their roles, and the wires between them. Complement to a list-style "what's on each box" doc.

```text
   ┌──────────────────┐              ┌──────────────────┐
   │ MacBook Pro M5   │◄─Tailscale──►│   Mac mini M4    │
   │      Max         │              │       Pro        │
   │ (dev + UI work)  │              │ (always-on API,  │
   └──────────────────┘              │  orchestration)  │
            ▲                        └────────┬─────────┘
            │                                 │
            │ ssh + git                       │ inference jobs
            │                                 ▼
            │                        ┌──────────────────┐
            │                        │   DGX Spark      │
            │                        │ (model serving,  │
            │                        │   fine-tunes)    │
            │                        └────────┬─────────┘
            │                                 │
            │                                 │ datasets, weights
            │                                 ▼
            │                        ┌──────────────────┐
            └────────── NFS ────────►│   NAS / NVMe     │
                                     │ (storage, RAG)   │
                                     └──────────────────┘
```

### Example 6 — Request lifecycle with cache short-circuit

Single request traversing edge → API → cache → DB, with the cache-hit path returning early.

```text
   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │  Client  │───►│   Edge   │───►│   API    │───►│  Cache   │
   │          │    │  (CDN)   │    │ (Express)│    │ (Redis)  │
   └──────────┘    └──────────┘    └────┬─────┘    └────┬─────┘
        ▲                               │               │
        │                               │ cache miss    │ HIT
        │                               ▼               │
        │                          ┌──────────┐         │
        │                          │ Postgres │         │
        │                          │   (RW)   │         │
        │                          └────┬─────┘         │
        │                               │               │
        └────────── response ───────────┴───────────────┘
```

---

## Variant — the "annotated decision-logic" style

Examples 1–6 above are the **compact topology** style: small boxes, one label per wire, layout carries most of the meaning. There's a second equally good style worth reaching for when the user is trying to **understand** something (not just see the topology), or when each node is itself a non-trivial decision point. The user calls this "another good way." Both styles are valid; sometimes you'll merge them.

### When to use this style instead

- The user is asking "explain X" with a visual, not just "show me X."
- Each node has internal decision logic worth listing (`if A then…, else if B…`).
- You want to show **what flows over each wire**, not just that a wire exists.
- The full picture is long enough that a "simplest view" recap at the end will help.

### Style rules layered on top of the base rules

1. **Bigger boxes with bulleted decision logic inside.** A box can hold 4–8 lines of contents — title at top, then `•` bullets describing what the node decides or owns.
2. **Every arrow gets `in:` / `out:` micro-labels** sitting just under it on their own indented lines. Example:
   ```text
             │  in: words / voice
             │ out: user intent
             ▼
   ```
3. **Side-quests return to the main spine.** When a sub-flow branches off (RAG search, tool call) and rejoins, draw it on the right with its own column of small boxes, and let the rejoining arrow come back across with `◄────────────────┘`.
4. **End with a "Simplest View" recap.** After a long annotated diagram, render a much smaller version showing the same flow in 6–8 boxes max. Lets the reader confirm the mental model.
5. **Optional "Where X lives" mini-diagrams.** For each tricky concept (RAG, routing, tool dispatch), a 3–5 box mini-diagram zooming into that one slice.
6. **Top header banner** with `╔══╗ ║ ║ ╚══╝` for the title — signals "this is a teaching diagram, take your time."

### Example 7 — Annotated AI-stack flow (canonical reference for this style)

This is the user's diagram, kept verbatim as the gold standard. Note the title banner, the bulleted decision boxes, the `in:` / `out:` on every arrow, the RAG side-quest that rejoins the main spine, and the "Simplest View" recap at the bottom.

```text
╔══════════════════════════════════════════════════════════════════════════════╗
║          YOUR OWN AI STACK: WHERE THE PROMPT GOES, RAG, MODEL, TOOLS        ║
╚══════════════════════════════════════════════════════════════════════════════╝


┌────────────────────┐
│  YOU               │
│  "Build my app"    │
└─────────┬──────────┘
          │  in: words / voice
          │ out: user intent
          ▼

┌────────────────────┐
│  YOUR UI           │
│  GUI / CLI / App   │
└─────────┬──────────┘
          │  in: raw prompt
          │ out: clean request
          ▼

┌──────────────────────────────────────────────┐
│  CONDUCTOR / AGENT ORCHESTRATOR              │
│                                              │
│  This is YOUR middleman brain.               │
│                                              │
│  It decides:                                 │
│  • What is the task?                         │
│  • Do we need RAG?                           │
│  • Do we need files?                         │
│  • Do we need terminal?                      │
│  • Which model should answer?                │
│  • Which tools should run?                   │
└───────┬───────────────┬──────────────────────┘
        │               │
        │               │ in: question needing facts
        │               │ out: search query
        │               ▼
        │      ┌────────────────────┐
        │      │        RAG         │
        │      │ Retrieval System   │
        │      └─────────┬──────────┘
        │                │ in: search query
        │                │ out: matching chunks
        │                ▼
        │      ┌────────────────────┐
        │      │  VECTOR DATABASE   │
        │      │  Chroma / Qdrant   │
        │      │  LanceDB / Weaviate│
        │      └─────────┬──────────┘
        │                │ out: docs / notes / code
        │                ▼
        │      ┌────────────────────┐
        │      │  CONTEXT PACKER    │
        │      │  Adds found info   │
        │      │  into prompt       │
        │      └─────────┬──────────┘
        │                │ out: prompt + facts
        │                │
        ◄────────────────┘
        │
        │ in: task + context
        │ out: selected model name
        ▼

┌──────────────────────────────────────────────┐
│  MODEL ROUTER                                │
│                                              │
│  Example rules:                              │
│  • Coding task → deepseek-coder              │
│  • Fast chat → llama3                        │
│  • Long writing → mistral                    │
│  • Math/reasoning → qwen                     │
└─────────┬────────────────────────────────────┘
          │  in: model choice
          │ out: Ollama request
          ▼

┌──────────────────────────────────────────────┐
│  OLLAMA  (engine — NOT the conductor)        │
│                                              │
│  Receives:                                   │
│  • model name                                │
│  • prompt                                    │
│  • context from RAG                          │
└─────────┬────────────────────────────────────┘
          │  in: prompt + model name
          │ out: model response
          ▼

┌────────────────────┐
│  LOCAL MODEL       │
│  deepseek / llama  │
│  qwen / mistral    │
└─────────┬──────────┘
          │  in: packed prompt
          │ out: answer / code / plan
          ▼

┌──────────────────────────────────────────────┐
│  CONDUCTOR CHECKS RESPONSE                   │
│                                              │
│  • Should files be written?                  │
│  • Should terminal run?                      │
│  • Should another model review it?           │
│  • Should RAG search again?                  │
└───────┬───────────────┬──────────────────────┘
        │               │
        │               │ in: command request
        │               │ out: result
        │               ▼
        │      ┌────────────────────┐
        │      │ TOOLS              │
        │      │ files / terminal   │
        │      │ browser / database │
        │      └────────────────────┘
        │
        ▼

┌────────────────────┐
│  YOUR UI           │
│  Shows final result│
└─────────┬──────────┘
          │  in: finished answer
          │ out: visible result
          ▼

┌────────────────────┐
│  YOU               │
│  See answer / app  │
└────────────────────┘
```

**Simplest View** recap — same flow, fewer boxes:

```text
┌─────┐   prompt   ┌───────────┐   maybe search   ┌─────┐
│ YOU │───────────►│ CONDUCTOR │─────────────────►│ RAG │
└─────┘            └─────┬─────┘                  └──┬──┘
                         │   docs found              │
                         ◄────────────────────────────┘
                         │
                         │ choose model
                         ▼
                    ┌────────┐
                    │ OLLAMA │
                    └───┬────┘
                        │ run selected model
                        ▼
                    ┌────────┐
                    │ MODEL  │
                    └───┬────┘
                        │ answer
                        ▼
                    ┌───────────┐
                    │ CONDUCTOR │
                    └─────┬─────┘
                          │ final output
                          ▼
                       ┌─────┐
                       │ YOU │
                       └─────┘
```

**Where X lives** — pull-out mini-diagrams for tricky concepts:

```text
WHERE RAG LIVES:                 WHERE MODEL CHOICE HAPPENS:

prompt                           task type
  → Conductor sees facts needed    → Router applies rules
  → RAG searches saved docs        → if "code" → deepseek-coder
  → returns useful chunks          → if "chat" → llama3
  → chunks packed into prompt      → if "writing" → mistral
  → Model answers using them       → Ollama runs that model
```

---

## Variant — merged style (compact topology + annotated callouts)

The two styles aren't either/or. When a system has **both** parallel actors AND non-trivial decision logic, merge them: stacked actor columns from the compact style, plus bulleted decision boxes and `in:` / `out:` labels from the annotated style.

### Example 8 — AI-stack with stacked clients + annotated conductor

```text
   ┌──────────────┐
   │   iOS app    │◄──┐
   ├──────────────┤   │  in: voice/text
   │   Website    │◄──┤  out: clean request
   ├──────────────┤   │
   │   CLI tool   │◄──┤
   └──────────────┘   │
          ▲           ▼
          │   ┌──────────────────────────────────┐
          │   │  CONDUCTOR                       │
          │   │  • Parse intent                  │
          │   │  • Need RAG?  → side-quest right │
          │   │  • Pick model (router)           │
          │   │  • Need tools after?             │
          │   └────┬───────────────┬─────────────┘
          │        │               │ in:  needs facts
          │        │               │ out: search query
          │        │               ▼
          │        │      ┌──────────────────┐
          │        │      │  RAG + Vector DB │◄── Qdrant /
          │        │      │  (chunks)        │     LanceDB
          │        │      └────────┬─────────┘
          │        │               │ out: top-k chunks
          │        │◄──────────────┘
          │        │ in: task + ctx
          │        │ out: model name
          │        ▼
          │   ┌──────────────────────────────────┐
          │   │  OLLAMA (engine, not conductor)  │◄── Tools
          │   │  • runs the picked model         │    (files,
          │   │  • returns answer to conductor   │     term,
          │   └────┬─────────────────────────────┘     db)
          │        │ out: answer
          └────────┘  (back to whichever client sent it)
```

The compact style gives you the "where do messages enter and exit"; the annotated style gives you the "what does each box actually decide." Merging them is the right move when both questions matter.

---

## Pairing with the repo's other flow doc

[`docs/system-flow.md`](../../../../docs/system-flow.md) uses a simpler vertical ladder (`User → Frontend → Assistant → …`) — good when the story is strictly layered and there are no parallel actors or labeled wires. This skill is the richer **parallel-actors + labeled-wires + loop-backs** variant; reach for it whenever the system has more than one client, more than one downstream, a side-attached datastore, or a non-trivial wire (auth, transport, retry, fallback).

When unsure: this skill is the default. The vertical ladder is the fallback for strictly linear stacks.

---

## Future extensions / roadmap

These are the elevations identified in the gap audit when this skill was first shipped. None are required to use the skill; they extend it.

1. **Sequence-diagram sibling skill.** Example 3 (OAuth handshake) is already sequence-style; pull it out into its own `skills/visual/diagrams/sequence-diagrams/` with stricter rules (vertical time axis, only request/response arrows, explicit lane lifelines).
2. **`scripts/render-diagram-check.sh`** — greps repo markdown for ```` ```text ```` blocks and warns when it spots `+---+` or ASCII pipe boxes. Keeps the style consistent over time.
3. **Backfill [`docs/system-flow.md`](../../../../docs/system-flow.md)** with a box-and-arrow companion diagram at the top — puts the style on the most-visited flow doc.
4. **`/diagram <topic>` slash command** wired to this skill so the diagram can be summoned by name.
5. **Auto-update the SKILL count** in [`SKILL-INDEX.md`](../../../../SKILL-INDEX.md) via a post-skill-create hook — manual bumps drift.
6. **Memory pointer in `~/.claude/CLAUDE.md`** as belt-and-suspenders for the per-project memory entry.
7. **Schema/style via web design skills.** Pair with [`skills/visual/design/ui-ux-pro-max/`](../../design/ui-ux-pro-max/) — the chart-type recommendation data in `data/charts.csv` could be referenced when picking *which* of these ASCII shapes (compact topology vs annotated flow vs sequence vs merged) is right for a given dataset or question.
8. **AI diagram-generator app** — a quick tool that takes any text or data and renders a diagram in this skill's style. Multi-provider (Ollama default, OpenAI / Claude / Perplexity / Gemini via keys). See the proposal sketch below.

### Diagram-generator app — proposal sketch

The skill describes the *style*; the app would automate *applying* the style to arbitrary input. High-level shape:

```text
   ┌──────────────┐
   │  Paste text  │◄──┐
   ├──────────────┤   │  in: docs, notes, code,
   │  Drop file   │◄──┤      meeting transcript,
   ├──────────────┤   │      JSON, CSV, anything
   │  Type idea   │◄──┘
   └──────┬───────┘
          │  out: raw input + chosen style
          ▼
   ┌────────────────────────────────────┐
   │  STYLE PICKER                      │
   │  • compact topology                │
   │  • annotated decision flow         │
   │  • sequence diagram                │
   │  • merged                          │
   └──────┬─────────────────────────────┘
          │  out: prompt + style hint
          ▼
   ┌────────────────────────────────────┐
   │  PROVIDER ROUTER                   │
   │  • Ollama (default, local)         │
   │  • OpenAI / Claude / Gemini /      │
   │    Perplexity (via API keys)       │
   └──────┬─────────────────────────────┘
          │  out: LLM response = ```text ...``` block
          ▼
   ┌────────────────────────────────────┐
   │  RENDER + LINT                     │
   │  • check Unicode-only boxes        │
   │  • check ≤ 80 cols                 │
   │  • offer download / copy           │
   └──────┬─────────────────────────────┘
          │ out: clean ASCII diagram + .md / .png export
          ▼
   ┌──────────────┐
   │  Preview UI  │
   └──────────────┘
```

Companion skills that would compose into the build: [`emil-design-eng`](../../design/emil-design-eng/) for UI feel, [`ui-ux-pro-max`](../../design/ui-ux-pro-max/) for layout + chart-type schema, [`claude-api`](../../../../skills/external/) for prompt-caching and multi-provider key management. Not implemented yet — see the response that followed this skill update for a concrete build plan if/when greenlit.
