---
name: library-bridge
id: SK-0139
hash: 3a8f2b1
keywords: [run-library, check-bridge, file-library]
relations: [catchall-processor, question-decomposer, new-repo-setup]
before: []
governed_by: [RL-0045, global]
meta: dynamic
goal: Any AI — Claude, GPT, Gemini, or anything else — gets the full library as its operating brain on startup with zero manual injection.
description: >-
  The four bridge layers that give any AI automatic access to the full AI
  Skills Library without manual context injection. Use when setting up a new
  AI integration, asking "how do I connect the library to an AI", "make this
  AI use the library automatically", "auto-possess this AI", "what's the MCP
  config", "how do I inject the library as a system prompt", "connect the
  brain to any AI".
---

# library-bridge — four paths to auto-possession

True auto-possession means any AI gets the full library on startup — no manual GUIDE.md copy-paste, no "here are the skills," no context injection. The library is the brain. The AI inherits it automatically.

Four paths, ordered from best to most universal:

---

## Path 1 — MCP Server (BEST — works with Claude Desktop, Cursor, Claude Code)

Serves every skill/rule/agent as a callable tool. The AI can search, discover, and invoke them directly.

**Install:**
```bash
# Add to ~/.claude/claude_desktop_config.json
{
  "mcpServers": {
    "ai-skills-library": {
      "command": "python3",
      "args": ["/path/to/ai-skills-library/mcp/server.py"]
    }
  }
}
```

**What the AI gets — 6 tools on startup:**

| Tool | What it does |
|---|---|
| `search_library(query)` | Find matching skills/rules by intent |
| `get_product(name_or_id)` | Get the full content of any product |
| `list_products(category)` | Browse the catalog by category |
| `get_guide()` | Load the Gamer's Guide |
| `decompose_question(raw)` | Strip any input to concise form + function label |
| `add_to_catchall(question)` | Log unmatched requests for processing |

**Result:** The AI never needs to be told what skills exist. It searches and discovers. Same session, every time.

**Files:** `mcp/server.py`, `mcp/README.md`, `mcp/config-example.json`

---

## Path 2 — System Prompt Injector (works with ANY AI)

Compresses the full library into a system prompt that can be prepended to any session.

```bash
# Generate the full prompt (~4,000 tokens)
python3 scripts/generate-system-prompt.py > my-system-prompt.md

# Compact version (~1,200 tokens)
python3 scripts/generate-system-prompt.py --compact > compact-prompt.md

# Just rules (for enforcement-only contexts)
python3 scripts/generate-system-prompt.py --rules-only > rules-prompt.md

# Save to file
python3 scripts/generate-system-prompt.py --output prompt.md
```

The output is a structured Markdown block you paste into any AI's system prompt field. Every ChatGPT custom GPT, every Claude project, every Gemini system instruction — any AI that takes a system prompt gets the full library.

**Files:** `scripts/generate-system-prompt.py`

---

## Path 3 — RAG Index (works with any AI + vector search)

Build a vector embedding index over all 186 products. AI queries by intent, gets the semantically closest skills back. More accurate than keyword matching for ambiguous requests.

```bash
# Build the index (requires an embedding API key)
OPENAI_API_KEY=sk-... python3 scripts/build-rag-index.py   # or Anthropic/local
# → writes docs/rag-index.json

# Query the index
python3 scripts/query-library.py "I want to audit my repo before shipping"
# → Returns top 3 semantically closest products
```

**When to use over MCP:** When requests are long, ambiguous, or conversational — RAG handles semantic similarity; MCP handles exact function calls. Use both when possible.

**Status:** `scripts/build-rag-index.py` — PLANNED. Requires embedding API. Add to GitHub Actions for auto-refresh when skills change.

---

## Path 4 — GitHub API Reader (fallback, works anywhere)

Any AI that can make HTTP requests reads skill content directly from the GitHub API. No local setup required.

```bash
# Fetch a skill by name
curl -s https://api.github.com/repos/marvelousempire/ai-skills-library/contents/skills/engineering/create-skill/SKILL.md \
  | python3 -c "import sys,json,base64; d=json.load(sys.stdin); print(base64.b64decode(d['content']).decode())"

# Search by keyword (via GitHub search API)
curl -s "https://api.github.com/search/code?q=setup-repo+repo:marvelousempire/ai-skills-library&type=file"
```

**When to use:** For AI systems that can't use MCP or aren't running locally. Works from any environment with internet access. Useful for API-based integrations where you want to fetch specific skills on demand.

---

## Setting up auto-possession (the full stack)

For complete auto-possession, run all four in parallel:

```
MCP server    → Claude Desktop + Cursor get tools natively
System prompt → paste into any custom GPT / Claude project / system instruction
RAG index     → semantic search for ambiguous queries
GitHub API    → fallback for any HTTP-capable environment
```

```bash
# One-time setup
python3 scripts/generate-system-prompt.py --output ~/.ai-skills-system-prompt.md
# Add MCP config to Claude Desktop
# Add MCP config to Cursor
# Set up RAG index (when embedding API is available)
```

---

## What "possessed" looks like

Before bridge:
```
You: "Set up a new iOS app repo"
AI: [Generic advice about git init and project structure]
```

After bridge (MCP active):
```
You: "Set up a new iOS app repo"
AI: [calls search_library("set up iOS app repo")]
    → new-repo-setup (SK-0135) matches at score 7.5
    [calls get_product("new-repo-setup")]
    → Returns the full 8-step setup guide with TYPE-001 structure
AI: Follows the exact AVERY GOODMAN procedure. No improvisation.
```

The library is the brain. The AI is the executor.

---

## What this is NOT for

- Not a replacement for the library growing — the bridge only connects what exists; the catchall grows what doesn't
- Not a one-time setup — regenerate the system prompt whenever skills are added

---

## Anti-patterns

- ❌ Using ONLY the system prompt injector — it's a snapshot, gets stale. Use MCP for live access.
- ❌ Pointing MCP at an outdated path — always use the path to the live repo
- ❌ Skipping the bridge entirely and manually pasting GUIDE.md each session — the bridge eliminates this

---

## Invocation

- "Use **library-bridge**."
- "How do I connect the library to this AI?"
- "Set up auto-possession for Claude Desktop."
- "Generate the system prompt."
- "What's the MCP config for this library?"

---

## Reference implementation

`mcp/server.py` — the MCP server (6 tools, works with or without the mcp package).
`scripts/generate-system-prompt.py` — the system prompt injector.
`mcp/README.md` — installation guide for all major AI surfaces.
