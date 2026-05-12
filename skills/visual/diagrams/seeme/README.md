# SEEME

> AI visual interpreter — turn any text into a Unicode box-and-arrow diagram.

```sh
seeme "explain how RAG works"
```

```text
   ┌──────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────┐
   │  input   │──►│  provider    │──►│  lint loop   │──►│  diagram │
   │ (CLI/IO) │   │ (autodetect) │   │  ≤ 3 retries │   │ (stdout) │
   └──────────┘   └──────────────┘   └──────────────┘   └──────────┘
```

Default provider: **Ollama** (local, free, private). Cloud fallback: **Anthropic / OpenAI / Gemini / Perplexity** with an API key. Output follows the [`ascii-flow-diagrams`](../ascii-flow-diagrams/SKILL.md) style spec verbatim.

## Quick start (60 seconds)

```sh
# 1. See what the output looks like — no install, no provider needed:
cd skills/visual/diagrams/seeme
npm run --silent start example     # prints a fixture diagram

# 2. Install dependencies + link globally:
npm install
npm link                            # makes `seeme` and `seeme-mcp` global

# 3. Pick ONE path:
#    Path A — local + private (recommended):
brew install ollama && ollama serve &
ollama pull llama3.1
seeme "explain how OAuth works"

#    Path B — cloud (need an API key):
cp .env.example .env                # then edit and add one key
seeme "explain how OAuth works"
```

Once anything works: `seeme config` shows your resolved setup, `seeme providers` shows what's reachable.

## Web UI

For an interactive split-pane interface — type, stream-preview, refine, copy, download SVG — run:

```sh
seeme serve --open
```

Opens `http://127.0.0.1:7777/` in your browser. Self-contained: no CDN deps, dark mode, monospace-forward, designed in the same Unicode box-and-arrow style the tool outputs. The page talks to a tiny local HTTP server that wraps the same `generate()` engine the CLI uses — same lint loop, same prompt caching, same provider routing. ⌘+↵ generates, click "Refine last" to iterate.

## Docker

Run the full stack (SEEME + Ollama + llama3.1 auto-pull) without installing anything on the host:

```sh
cd skills/visual/diagrams/seeme
docker compose up -d
open http://localhost:7777
```

See [`docker/README.md`](docker/README.md) for the full Docker setup — image details, environment variables, troubleshooting, and how to run just the CLI in a one-shot container.

## Use

```sh
seeme "explain OAuth"                            # auto everything
seeme --style annotated "RAG architecture"       # pick a style
seeme --provider anthropic "k8s networking"      # pick a provider
seeme --model claude-opus-4-7 "..."              # pick a model
cat notes.md | seeme                             # stdin
seeme --file plan.md                             # file input
seeme --copy "..."                               # also clipboard
seeme --out diagram.svg "..."                    # also write SVG
seeme --watch plan.md                            # re-render on file change
seeme --explain "explain RAG"                    # diagram + short prose

# Iterative refinement — edits the last clean diagram, inherits its style:
seeme --refine "add a redis cache between API and database"
seeme --refine "split the API into auth + data" --from prev.txt

# Chain a generate + N refines in one call (cached system prompt shared):
seeme "explain OAuth" \
  --then "now add a refresh-token loop" \
  --then "highlight the security boundaries in heavy banners"

# Diagnostics:
seeme providers      # who's reachable?
seeme config         # resolved setup (no secrets shown)
seeme example        # offline demo
seeme stats          # history summary (requires SEEME_HISTORY=1)
seeme --help
```

## Styles

| `--style` | Best for |
|---|---|
| `compact` | Topology — who talks to whom |
| `annotated` | Teaching diagrams with bulleted decision logic per box |
| `sequence` | Time-ordered request/response across actors |
| `merged` | Topology **and** decision logic |
| `auto` *(default)* | Model picks |

## Providers

| Provider | Env var | Default model |
|---|---|---|
| Ollama (local) | `OLLAMA_HOST` (optional) | `llama3.1` |
| Anthropic | `ANTHROPIC_API_KEY` | `claude-opus-4-7` |
| OpenAI | `OPENAI_API_KEY` | `gpt-4o` |
| Gemini | `GOOGLE_API_KEY` | `gemini-2.0-flash` |
| Perplexity | `PERPLEXITY_API_KEY` | `sonar-pro` |

Resolution order when `--provider` is not passed:

1. `SEEME_PROVIDER` env var if set
2. Ollama if reachable at `OLLAMA_HOST`
3. First cloud provider with a key set in `.env`
4. Error with a useful message

## How the lint loop works

Every model response goes through five checks, in order:

- **`no-diagram`** — short-circuit if the response has < 3 box-drawing characters. Sub-classifies as `refused` / `wrong-format` / `truncated` / generic so the repair prompt asks for the right correction.
- **`unicode`** — flags `+---+` ASCII corners, `|...|` ASCII rails, `---` ASCII horizontals.
- **`width`** — every line must be ≤ 100 columns (target ≤ 80).
- **`closure`** — `┌/┐/└/┘` and `╔/╗/╚/╝` counts must balance pairwise.
- **`alignment`** — every `│` must have a vertical neighbor (`│`, corner, tee, banner edge) directly above or below.

A failure → re-prompt with a line-numbered, rule-specific fix list. Up to 3 retries. If retries exhaust, the best-effort output prints with `⚠ N lint warning(s) remain` on stderr.

## Refine + cache

Every clean diagram is written to `~/.seeme/last.json` with `{diagram, style, provider, model, input, timestamp}`. `seeme --refine "..."` reads it back, inherits the previous style, and applies your edit instruction. Set `SEEME_NO_CACHE=1` to disable.

## Prompt caching

The ~30KB style guide is sent as a `cache_control: ephemeral` system message. Anthropic caches it for 5 min by default; set `SEEME_LONG_CACHE=1` to extend to 1 h (requires beta access — the `extended-cache-ttl-2025-04-11` header is added automatically). OpenAI auto-caches any prefix ≥ 1024 tokens. Refines and `--then` chains all hit the cached prompt — only the small user-payload delta is charged in full.

## Stats (opt-in)

`SEEME_HISTORY=1` enables a JSONL log at `~/.seeme/history.jsonl` (one line per generate/refine). Then:

```sh
seeme stats
```

shows total calls, tokens in/out, cache hit rate, and a per-provider breakdown.

## SVG export

`seeme --out diagram.svg "..."` writes a self-contained SVG alongside stdout. Open it in any browser. Convert to PNG with `rsvg-convert` or `inkscape --export-type=png`. Pass `.txt` instead of `.svg` to write the raw text.

## MCP server

`seeme-mcp` is a stdio MCP server that exposes SEEME to Claude Desktop / Cursor / Claude Code. Add to your MCP config:

```json
{
  "mcpServers": {
    "seeme": { "command": "seeme-mcp" }
  }
}
```

Tools:
- **`list_providers()`** — reachability + default model per provider.
- **`generate_diagram(input, style?, provider?, model?)`** — render any input.
- **`refine_diagram(instruction, previous?, style?, provider?, model?)`** — edit a diagram. `previous` defaults to the cached last diagram; style inherited.

Once registered, the assistant can call SEEME mid-conversation and inline the resulting fenced `text` block.

## Tests

```sh
npm test          # 38 unit tests; 1 integration test self-skips if Ollama isn't up
npm run typecheck # tsc --noEmit
npm run check     # both
```

## Layout

```
seeme/
├── SKILL.md              # how to invoke (Claude Code / agents read this)
├── README.md             # you are here
├── bin/
│   ├── seeme             # node shebang → src/cli.ts
│   └── seeme-mcp         # node shebang → src/mcp.ts (MCP stdio server)
├── src/
│   ├── cli.ts            # cac CLI surface (generate, refine, then, watch, explain, out, config, example, stats, providers)
│   ├── mcp.ts            # MCP server (list_providers, generate_diagram, refine_diagram)
│   ├── generate.ts       # public API
│   ├── retry.ts          # lint → repair → regenerate, with usage telemetry
│   ├── env.ts            # dotenv + zod validation
│   ├── cache.ts          # ~/.seeme/last.json (single-slot)
│   ├── history.ts        # ~/.seeme/history.jsonl (opt-in JSONL log)
│   ├── example.ts        # offline fixture viewer
│   ├── watch.ts          # --watch <file> file-change re-render
│   ├── explain.ts        # --explain post-diagram prose
│   ├── export-svg.ts     # --out diagram.svg
│   ├── types.ts
│   ├── prompt/
│   │   ├── system.ts     # reads ../ascii-flow-diagrams/SKILL.md (or SEEME_STYLE_SPEC)
│   │   ├── repair.ts     # targeted fix prompt
│   │   └── refine.ts     # natural-language edit prompt
│   ├── providers/index.ts # router + autodetect + listProviders
│   └── lint/
│       ├── extract.ts          # pull ```text fenced block
│       ├── diagram-present.ts  # no-diagram + sub-classify refused/wrong-format/truncated
│       ├── unicode.ts          # no ASCII +-| as box chars
│       ├── width.ts            # ≤ 100 col
│       ├── closure.ts          # ┌/┐/└/┘ balance
│       ├── alignment.ts        # │ column consistency
│       └── index.ts            # composer (short-circuits on no-diagram)
└── test/
    ├── *.test.ts         # 38 unit tests + 1 integration test
    └── fixtures/{good,broken}/*.txt
```
