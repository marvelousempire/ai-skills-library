# AI Skills Library — MCP Server

**Auto-possess any AI** with the full library on startup. No manual injection.

## What it does

Once installed, every Claude Desktop / Cursor / Claude Code session has:

- `search_library(query)` — find the right skill for any request
- `get_product(name_or_id)` — get the full skill/rule/agent content
- `list_products(category)` — browse the full catalog
- `get_guide()` — load the Gamer's Guide (the operating manual)
- `decompose_question(raw)` — strip any question to concise form + function label
- `add_to_catchall(question)` — log unmatched requests for processing

The AI no longer needs to be told what skills exist. It can search, discover, and invoke them directly.

## Install (Claude Desktop)

**Step 1:** Add to `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ai-skills-library": {
      "command": "python3",
      "args": ["/Users/you/Developer/ai-skills-library/mcp/server.py"]
    }
  }
}
```

**Step 2:** Restart Claude Desktop.

**Step 3:** Ask Claude: "Search the library for a skill about setting up a new repo." It will call `search_library` and return results from the live library.

## Install (Cursor)

Add to `.cursor/mcp.json` in any project:

```json
{
  "mcpServers": {
    "ai-skills-library": {
      "command": "python3",
      "args": ["/Users/you/Developer/ai-skills-library/mcp/server.py"]
    }
  }
}
```

Or install globally via Cursor settings → MCP.

## Install (Claude Code)

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "ai-skills-library": {
      "command": "python3",
      "args": ["/Users/you/Developer/ai-skills-library/mcp/server.py"]
    }
  }
}
```

## No dependencies required

The server works without any packages installed (falls back to raw stdio). For the full MCP experience:

```bash
pip install mcp          # Anthropic's official MCP library
# or
uv pip install mcp
```

## Test it

```bash
# Quick smoke test
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | python3 mcp/server.py

# Search the library
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_library","arguments":{"query":"set up a new repo"}}}' | python3 mcp/server.py
```

## What "auto-possession" looks like in practice

Before MCP:
```
User: "Set up a new iOS app repo"
AI: [tries to remember what skill to use, may be wrong or generic]
```

After MCP:
```
User: "Set up a new iOS app repo"
AI: [calls search_library("set up iOS app repo")]
    → Returns: new-repo-setup (SK-0135), score 7.5
AI: [calls get_product("new-repo-setup")]
    → Returns: full 7-step setup guide with folder structure
AI: Follows the exact procedure from the library
```

The library is the brain. The AI is the executor.
