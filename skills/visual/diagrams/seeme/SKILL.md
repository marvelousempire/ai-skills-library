---
name: seeme
id: SK-0134
keywords: [generate-diagram, visualize-idea, draw-flow]
hash: 33e0bea
relations: []
before: []
governed_by: [global]
meta: dynamic
description: AI visual interpreter — turn any text, file, or idea into a Unicode box-and-arrow diagram in the ascii-flow-diagrams style. Defaults to local Ollama; supports OpenAI, Anthropic Claude, Google Gemini, Perplexity. Five-rule lint loop, prompt caching, MCP server, SVG export, file-watch mode, iterative refinement, multi-step chains. Triggers on "diagram this with seeme", "use seeme on X", "seeme: explain Y", "generate a visual of Z", "draw the architecture of W".
---

# SEEME — AI visual interpreter

SEEME reads any input (prose, code, JSON, CSV, meeting notes, a one-line idea) and produces a diagram in the style defined by the sibling [`ascii-flow-diagrams`](../ascii-flow-diagrams/SKILL.md) skill. The style guide is the system prompt — when the spec is updated, SEEME gets smarter automatically.

## When to use

- `seeme "explain how OAuth works"`
- `cat README.md | seeme`
- `seeme --file architecture.md --style merged`
- `seeme --explain "RAG pipeline"` (diagram + short prose)
- `seeme --watch plan.md` (live re-render on file change)
- `seeme serve --open` (interactive split-pane web UI)
- "Use **seeme** on the auth flow"
- "Diagram the deployment pipeline with seeme"

From an MCP host (Claude Desktop / Cursor / Claude Code) with `seeme-mcp` wired in: call the `generate_diagram` / `refine_diagram` / `list_providers` tools directly.

## Invocation (CLI)

```sh
seeme "explain how OAuth works"                  # auto provider + style
seeme --style annotated "RAG architecture"
seeme --provider anthropic "k8s networking"
seeme --model claude-opus-4-7 "..."
cat notes.md | seeme                             # stdin
seeme --file architecture.md
seeme --copy "..."
seeme --out diagram.svg "..."                    # also export SVG
seeme --watch plan.md                            # re-render on change
seeme --explain "explain RAG"                    # diagram + prose

# Refinement (inherits previous style):
seeme --refine "add a redis cache between API and DB"
seeme --refine "split the API into auth + data" --from prev.txt

# Chain in one call (cached system prompt shared across steps):
seeme "explain OAuth" \
  --then "now add a refresh-token loop" \
  --then "highlight the security boundaries"

# Diagnostics + interactive UI:
seeme providers      # who's reachable?
seeme config         # resolved setup
seeme example        # offline fixture demo
seeme stats          # history summary (requires SEEME_HISTORY=1)
seeme serve --open   # web UI at http://127.0.0.1:7777
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
| `compact` | Topology / who talks to whom | [Ex 1–6](../ascii-flow-diagrams/SKILL.md) |
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

1. **`no-diagram`** — short-circuit if < 3 box-drawing chars. Sub-classifies as `refused` / `wrong-format` (JSON / markdown table / numbered list) / `truncated` so the repair prompt asks for the right correction.
2. **`unicode`** — no ASCII `+---+`, `|...|`, or `---` rails.
3. **`width`** — ≤ 100 columns per line (target ≤ 80).
4. **`closure`** — `┌/┐/└/┘` and `╔/╗/╚/╝` corner counts balance pairwise.
5. **`alignment`** — every `│` has a vertical neighbor above or below.

Failure → re-prompt with line-numbered, rule-specific fix list. Max 3 retries.

**Prompt caching.** The full style guide is sent as a `cache_control: ephemeral` system message — Anthropic caches it for 5 min (1 h with `SEEME_LONG_CACHE=1`, requires beta access; the `extended-cache-ttl-2025-04-11` header is added automatically). OpenAI auto-caches any prefix ≥ 1024 tokens. Refines and `--then` chains all hit the cached prompt.

**Iterative refinement.** Every clean diagram is written to `~/.seeme/last.json` with style + provider + model + timestamp. `seeme --refine "..."` reads it back, inherits the style, and applies your edit. `SEEME_NO_CACHE=1` disables.

## Installation

**Local (Node 24+):**

```sh
cd skills/visual/diagrams/seeme
npm install
npm link                           # makes `seeme` and `seeme-mcp` global
cp .env.example .env               # optional — only needed for cloud providers
seeme example                      # offline preview
seeme "explain RAG"                # first real run (needs Ollama or a key)
```

**Docker (zero host install):**

```sh
cd skills/visual/diagrams/seeme
docker compose up -d               # boots SEEME + Ollama + llama3.1 auto-pull
open http://localhost:7777
```

See [`docker/README.md`](./docker/README.md) for full details.

## MCP server

Wire `seeme-mcp` into Claude Desktop / Cursor / Claude Code:

```json
{
  "mcpServers": {
    "seeme": { "command": "seeme-mcp" }
  }
}
```

Tools:
- `list_providers()` — which providers are reachable. Returns one line per provider with ● / ○ markers + default model. Call this **before** `generate_diagram` if you need to pick a provider.
- `generate_diagram(input, style?, provider?, model?)` — render any input.
- `refine_diagram(instruction, previous?, style?, provider?, model?)` — edit a diagram. `previous` defaults to `~/.seeme/last.json`; style is inherited.

## Verification

- `seeme example` prints a fixture diagram offline.
- `seeme providers` lists all five with availability + default model.
- `seeme config` shows resolved setup, no secrets.
- `seeme "explain a producer/consumer queue"` prints a clean diagram + `✓ clean on first try`.
- `seeme --copy "..."` puts the diagram in the clipboard after exit.
- `seeme --then "step 2" --then "step 3" "step 1"` prints three diagrams + a chain summary with cache hit rate.
- After an Anthropic call, stderr shows `tokens: N in / M out  cache: K read / J written`.
- `npm test` runs 38 unit tests + 1 integration test (self-skips when Ollama isn't reachable).

## Pairing

- **Spec**: [`ascii-flow-diagrams`](../ascii-flow-diagrams/SKILL.md) — the style guide SEEME reads as its system prompt. Editing it changes SEEME's output without any code change.
- **Rule**: [`rules/library/ascii-flow-diagrams/`](../../../../rules/library/ascii-flow-diagrams/) — keeps the style applied by all agents in the repo.
- **Design feel** (future web preview, if any): [`emil-design-eng`](../../design/emil-design-eng/SKILL.md) + [`ui-ux-pro-max`](../../design/ui-ux-pro-max/SKILL.md).
- **Docker UI**: [`dockyard`](../../../infra/dockyard/SKILL.md) — every SEEME container ships the full `ai-skills-library.*` label schema so Dockyard's Compose view renders SEEME + Ollama + the init job with proper names, roles, and per-service URLs.
