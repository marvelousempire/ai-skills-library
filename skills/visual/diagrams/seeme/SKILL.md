---
name: seeme
description: AI visual interpreter — turn any text, file, or idea into a Unicode box-and-arrow diagram in the ascii-flow-diagrams style. Defaults to local Ollama; supports OpenAI, Anthropic Claude, Google Gemini, and Perplexity. Triggers on "diagram this with seeme", "use seeme on X", "seeme: explain Y", "generate a visual of Z".
---

# SEEME — AI visual interpreter

SEEME reads any input (prose, code, JSON, CSV, meeting notes, a one-line idea) and produces a diagram in the style defined by the sibling [`ascii-flow-diagrams`](../ascii-flow-diagrams/SKILL.md) skill. The style guide is the system prompt — when the spec is updated, SEEME gets smarter automatically.

## When to use

- `seeme "explain how OAuth works"`
- `cat README.md | seeme`
- `seeme --file architecture.md --style merged`
- "Use **seeme** on the auth flow"
- "Diagram the deployment pipeline with seeme"

## Invocation

```sh
seeme "explain how OAuth works"                  # auto provider + style
seeme --style annotated "RAG architecture"       # explicit style
seeme --provider anthropic "k8s networking"
seeme --model claude-opus-4-7 "..."
cat notes.md | seeme                             # stdin
seeme --file architecture.md                     # read from file
seeme --copy "..."                               # also copy to clipboard
seeme providers                                  # list available + reachable

# Iterative refinement (uses the last clean diagram from ~/.seeme/last.txt):
seeme --refine "add a redis cache between the API and the database"
seeme --refine "split the API box into auth and data" --from prev.txt
```

## Providers

Defaults to **Ollama** at `http://localhost:11434` (model `llama3.1`). Falls back to whichever cloud provider has a key set in `.env`:

| Provider | Env var | Default model |
|---|---|---|
| Ollama (local) | `OLLAMA_HOST` (optional) | `llama3.1` |
| Anthropic Claude | `ANTHROPIC_API_KEY` | `claude-opus-4-7` |
| OpenAI | `OPENAI_API_KEY` | `gpt-4o` |
| Google Gemini | `GOOGLE_API_KEY` | `gemini-2.0-flash` |
| Perplexity | `PERPLEXITY_API_KEY` | `sonar-pro` |

## Styles

| `--style` | Use for | Source example |
|---|---|---|
| `compact` | Topology / who talks to whom | [`ascii-flow-diagrams` Ex 1–6](../ascii-flow-diagrams/SKILL.md) |
| `annotated` | Teaching diagrams with decision logic in each box | [Ex 7](../ascii-flow-diagrams/SKILL.md) |
| `sequence` | Time-ordered request/response across actors | [Ex 3](../ascii-flow-diagrams/SKILL.md) |
| `merged` | Both topology and decision logic | [Ex 8](../ascii-flow-diagrams/SKILL.md) |
| `auto` *(default)* | Let the model pick | — |

## How it works

```text
   ┌──────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────┐
   │  input   │──►│  provider    │──►│  lint loop   │──►│  output  │
   │ (CLI/IO) │   │ (autodetect) │   │  ≤ 3 retries │   │ (stdout) │
   └──────────┘   └──────────────┘   └──────────────┘   └──────────┘
                          │                 ▲
                          │ system prompt   │ targeted fix prompt
                          ▼                 │ on lint failure
                  ┌──────────────────────────┴──────┐
                  │  ../ascii-flow-diagrams/SKILL.md│
                  │  (the style spec, verbatim)     │
                  └─────────────────────────────────┘
```

Lint rules applied to every model response, in this order:
1. **`no-diagram`** — short-circuit if the response has fewer than 3 box-drawing characters. Fires when the model returns prose or refusal instead of a diagram; repair prompt asks for a diagram, not line-level fixes.
2. **`unicode`** — no ASCII `+---+`, `|...|`, or `---` rails.
3. **`width`** — ≤ 100 columns per line (target ≤ 80).
4. **`closure`** — `┌/┐/└/┘` and `╔/╗/╚/╝` corner counts balance pairwise.

Failure → re-prompt with line-numbered fix list, max 3 attempts.

**Prompt caching.** The full style guide is sent as a `cache_control: ephemeral` system message — Anthropic caches it for 5 min and OpenAI auto-caches any prefix ≥ 1024 tokens. Repeat calls within the window cost ~90% less. Refine calls reuse the same cached system prompt, so iterating on a diagram is cheap.

**Iterative refinement.** Every clean diagram is written to `~/.seeme/last.txt`. `seeme --refine "..."` reads it back, sends the previous diagram + your edit instruction, and renders the update. Set `SEEME_NO_CACHE=1` to disable the cache file.

## Installation

```sh
cd skills/visual/diagrams/seeme
npm install
npm link               # makes `seeme` globally available
cp .env.example .env   # then fill in any keys you want (or just run Ollama)
```

## Verification

- `seeme providers` lists all five with availability flags.
- `seeme "explain a producer/consumer queue"` against Ollama prints a clean diagram with `✓ clean on first try` or `✓ clean after N attempts`.
- After a successful run against Anthropic, the stderr footer shows `cache: N read / M written` — first call writes, subsequent calls within 5 min read.
- `npm test` runs the unit suite (lint + extract + cache + refine + no-diagram). If Ollama is running, also exercises an end-to-end smoke test; otherwise it self-skips.

## Pairing

- **Spec**: [`ascii-flow-diagrams`](../ascii-flow-diagrams/SKILL.md) — the style guide SEEME reads as its system prompt. Editing it changes SEEME's output without any code change.
- **Rule**: [`rules/library/ascii-flow-diagrams/`](../../../../rules/library/ascii-flow-diagrams/) — keeps the style applied by all agents in the repo, not just SEEME.
- **Design feel** (when the web preview ships): [`emil-design-eng`](../../design/emil-design-eng/SKILL.md) + [`ui-ux-pro-max`](../../design/ui-ux-pro-max/SKILL.md).
