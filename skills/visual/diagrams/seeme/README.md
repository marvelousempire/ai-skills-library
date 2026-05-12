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

Default provider: **Ollama** (local, free, private). Cloud fallback: **Anthropic / OpenAI / Gemini / Perplexity** with an API key.

Output follows the [`ascii-flow-diagrams`](../ascii-flow-diagrams/SKILL.md) style spec verbatim — same style guide loaded as the system prompt on every call, so the tool and the spec stay locked together.

## Install

Requires **Node ≥ 22.6** (uses native TypeScript stripping).

```sh
cd skills/visual/diagrams/seeme
npm install
npm link            # makes `seeme` globally available
cp .env.example .env
```

## Use

```sh
seeme "explain OAuth"                            # auto everything
seeme --style annotated "RAG architecture"       # pick a style
seeme --provider anthropic "k8s networking"      # pick a provider
seeme --model claude-opus-4-7 "..."              # pick a model
cat notes.md | seeme                             # stdin
seeme --file plan.md                             # file input
seeme --copy "..."                               # also clipboard
seeme providers                                  # who's reachable?
seeme --help

# Iterative refinement — edits the last clean diagram, inherits its style:
seeme --refine "add a redis cache between API and database"
seeme --refine "split the API into auth + data" --from prev.txt

# Chain a generate + N refines in one call (cached system prompt shared):
seeme "explain OAuth" \
  --then "now add a refresh-token loop" \
  --then "highlight the security boundaries in heavy banners"
```

## Refine + cache

Every clean diagram is written to `~/.seeme/last.json` with `{diagram, style, provider, model, input, timestamp}`. `seeme --refine "..."` reads it back, inherits the previous style, and applies your edit instruction — same style guide, same provider, just a targeted change. Legacy `~/.seeme/last.txt` from v0.1 still readable. Set `SEEME_NO_CACHE=1` to disable.

## MCP server

`seeme-mcp` is a stdio MCP server that exposes SEEME to Claude Desktop / Cursor / Claude Code. Wire it up in your MCP config:

```json
{
  "mcpServers": {
    "seeme": { "command": "seeme-mcp" }
  }
}
```

Tools:
- **`generate_diagram(input, style?, provider?, model?)`** — render any input.
- **`refine_diagram(instruction, previous?, style?, provider?, model?)`** — edit a diagram. `previous` defaults to the user's last cached diagram.

Once registered, the assistant can call SEEME mid-conversation and inline the resulting fenced `text` block.

## Prompt caching

The ~30KB style guide is the system prompt on every call, marked `cache_control: ephemeral`. Anthropic caches it for 5 min, OpenAI auto-caches any prefix ≥ 1024 tokens — repeat calls and refines cost ~90% less than the first one.

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

Provider resolution order when `--provider` is not passed:

1. `SEEME_PROVIDER` env var if set
2. Ollama if reachable at `OLLAMA_HOST`
3. First cloud provider with a key set in `.env`
4. Error with a useful message

## How the lint loop works

Every model response goes through four checks, in order:

- **`no-diagram`** — short-circuit if the response has fewer than 3 box-drawing characters. Saves three round-trips when the model returns prose or refusal.
- **`unicode`** — flags `+---+` ASCII corners, `|...|` ASCII rails, `---` ASCII horizontals.
- **`width`** — every line must be ≤ 100 columns (target ≤ 80).
- **`closure`** — `┌/┐/└/┘` and `╔/╗/╚/╝` counts must balance pairwise.

A failure → re-prompt with a line-numbered fix list. Up to 3 retries. If retries are exhausted, the best-effort output prints with `⚠ N lint warning(s) remain` on stderr.

## Usage telemetry

After each run, stderr shows:

```
provider: anthropic  model: claude-opus-4-7  attempts: 1
tokens: 312 in / 184 out  cache: 28041 read / 0 written
✓ clean on first try
```

`cache: N read` means N tokens were served from the cached system prompt (Anthropic ephemeral cache, or OpenAI auto-cache). First call within a 5-min window writes; later calls read. Disable the on-disk diagram cache (separate from prompt caching) with `SEEME_NO_CACHE=1`.

## Tests

```sh
npm test
```

Runs `node --test` against fixtures in `test/fixtures/{good,broken}/`. Adds a new broken fixture is the right way to teach a new lint rule.

## Layout

```
seeme/
├── SKILL.md             # how to invoke (Claude Code / agents read this)
├── README.md            # you are here
├── bin/seeme            # node shebang → src/cli.ts
├── src/
│   ├── cli.ts           # cac CLI surface
│   ├── generate.ts      # public API
│   ├── retry.ts         # lint → repair → regenerate
│   ├── env.ts           # dotenv + zod validation
│   ├── types.ts
│   ├── prompt/
│   │   ├── system.ts    # reads ../ascii-flow-diagrams/SKILL.md
│   │   └── repair.ts
│   ├── providers/index.ts
│   └── lint/{extract,unicode,width,closure,index}.ts
└── test/
    ├── lint.test.ts
    ├── extract.test.ts
    └── fixtures/{good,broken}/*.txt
```

## Future

Phase 2 (web preview / MCP server), Phase 3 (Raycast / VS Code) and the rest of the gap audit + elevation list are sketched in `~/.claude/plans/diagrammer-app.md` — not built yet.
