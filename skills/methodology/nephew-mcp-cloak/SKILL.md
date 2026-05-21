---
name: nephew-mcp-cloak
id: SK-NEPHEW-MCP
keywords: [audit-nephew, check-mcp, build-cloak]
goal: Wire Claude Code and other MCP clients to Nephew CLOAK native tools before opening the full skills library.
hash: pending
relations: [nephew-cloak-amending-mission]
before: [nephew-cloak-amending-mission]
governed_by: [global]
meta: dynamic
description: >-
  Use Nephew's native MCP server for dispatch evaluate, fidelity check, orchestration
  plan, and Grok archive search. Triggers: nephew mcp, CLOAK MCP tools, dispatch gate
  in Claude Code, fidelity before witness.
---

# nephew-mcp-cloak

## When to use

- Claude Code project has `.mcp.json` with `nephew` server  
- Need **dispatch gate** or **fidelity** without shelling out manually  
- Need **orchestrate plan** (four hand-offs + JSONL trace)

## Setup (consumer repo)

```json
{
  "mcpServers": {
    "nephew": {
      "command": "nephew",
      "args": ["mcp", "start"]
    }
  }
}
```

Upstream Ruflo memory/swarm: second server with `"args": ["mcp", "ruflo"]`.

## Tools (canonical names)

| MCP tool | Purpose |
|----------|---------|
| `nephew_dispatch_evaluate` | Full CLOAK gate |
| `nephew_fidelity_check` | RFE before witness |
| `nephew_preflight_check` | Patrol + intent + bloat |
| `nephew_orchestrate_plan` | Four-agent plan + trace |
| `nephew_archive_search` | Quarry FTS (needs archive.db) |

## Source of truth

Repo: `marvelousempire/nephew` — [`docs/mcp/cloak-tools.md`](https://github.com/marvelousempire/nephew/blob/main/docs/mcp/cloak-tools.md)

Read `orientation/README.md` in nephew before destructive work.
