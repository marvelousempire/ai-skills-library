# Workflow — multi-surface build (CLI + MCP + Web UI + Docker)

How to ship a single engine across multiple surfaces so every user/agent finds it at their preferred entry point. Modeled on SEEME.

## Decide which surfaces

Most engines should ship at least:

- **CLI** — the canonical surface (lowest dependency, fastest to test)
- **MCP server** — for AI agent integration (Claude Desktop / Cursor / Claude Code)
- **Web UI** — for interactive use
- **Docker / Compose** — for one-command deployment + hand-off

Optionally:

- **HTTP API** — for programmatic / scripted use
- **VS Code / Raycast extension** — for in-IDE / in-launcher

## Design principle: one engine, many faces

All surfaces share **one** `generate()` / `run()` core. Each surface is a thin shell that:
1. Parses input
2. Calls the core
3. Renders output in its native format

This means: changes to the engine propagate everywhere for free. Bugs land once. Tests cover everything.

```text
   ┌────────────────────────────────────────────────────────────────┐
   │  inputs                                                         │
   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────┐  │
   │  │   CLI    │ │   MCP    │ │  Web UI  │ │  Docker  │ │ API │  │
   │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └──┬──┘  │
   │       └──────┬─────┴────────────┴────────────┴──────────┘     │
   │              ▼                                                  │
   │       ┌──────────────────────────────────┐                      │
   │       │      generate() / core engine     │                      │
   │       │  (one place; all surfaces share)  │                      │
   │       └──────────────────────────────────┘                      │
   └────────────────────────────────────────────────────────────────┘
```

## File layout (per the SEEME pattern)

```
skills/<family>/<slug>/
├── SKILL.md
├── README.md
├── package.json                # if Node-based
├── bin/
│   ├── <slug>                  # CLI shim
│   └── <slug>-mcp              # MCP server shim
├── src/
│   ├── cli.ts                  # CLI surface
│   ├── mcp.ts                  # MCP surface
│   ├── server.ts               # Web UI server
│   ├── ui.html                 # Web UI page
│   ├── generate.ts             # the engine (one place)
│   └── …other modules…
├── docker/
│   ├── Dockerfile
│   └── entrypoint.sh
├── docker-compose.yml          # Compose surface
└── test/
    └── *.test.ts
```

## Per-surface contracts

### CLI

- Single binary, idempotent flags
- `--help` lists everything
- Pipe-friendly output (stdout = diagram / data; stderr = chatter)
- Error UX: friendly message + exit code 1 (no stack traces)

### MCP

- stdio transport (line-delimited JSON-RPC)
- Tools self-describing in `tools/list`
- Read-only by default; write actions explicit
- Server-side credentials (never expose tokens to the client)

### Web UI

- Server: pure Node stdlib (no framework)
- Page: single self-contained HTML (no CDN, no build step)
- Aesthetic: per [`aesthetic-language.md`](../standards/aesthetic-language.md)
- Streaming when possible (SSE for chunked LLM responses)

### Docker

- Multi-stage build, non-root user, `tini` for signals
- Compose file with full label schema
- `make doctor` target on the host wraps `docker compose logs --tail`

## Verification per surface

```sh
# CLI
./bin/<slug> --help
./bin/<slug> <example>     # should produce expected output

# MCP
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | ./bin/<slug>-mcp

# Web UI
./bin/<slug> serve --port 9999 &
curl -fsS http://localhost:9999/api/config

# Docker
docker compose -f docker-compose.yml config
docker compose up -d
curl -fsS http://localhost:<port>/health
docker compose down
```

All four must pass before declaring multi-surface done.

## Real example

[`skills/visual/diagrams/seeme/`](../../skills/visual/diagrams/seeme/) — six surfaces from one engine:

| Surface | Path |
|---|---|
| CLI | `bin/seeme` + `src/cli.ts` |
| MCP | `bin/seeme-mcp` + `src/mcp.ts` |
| Web UI | `src/server.ts` + `src/ui.html` |
| Docker | `Dockerfile` + `docker-compose.yml` |
| Refine loop | `--refine` flag on CLI; same on MCP |
| Chain | `--then` flag on CLI; same on MCP |

## Anti-patterns

- Duplicating engine logic across surfaces — re-derive when fixing a bug
- Per-surface dependency lists — bloats install
- CLI that needs the web UI running — surfaces should be independent
- MCP that requires npm — break-glass scenarios fail
