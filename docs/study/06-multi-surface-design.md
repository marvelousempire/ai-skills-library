# 06 — Multi-surface design

One engine, many faces. SEEME ships as CLI + MCP + Web UI + Docker + Refine + Chain — six entry points, one `generate()` function.

## The principle

```text
   inputs                  ┌─────────────┐
   ┌───────┐ ┌───────┐ ┌──►│             │
   │  CLI  │ │  MCP  │ │   │ generate()  │
   └───┬───┘ └───┬───┘ │   │ — the engine│
       └────────┴─────┘   └─────────────┘
   ┌───────┐ ┌───────┐ ┌───┐
   │WebUI  │ │Docker │ │API│
   └───┬───┘ └───┬───┘ └─┬─┘
       └────────┴───────┘
           thin shells
```

Changes to the engine propagate everywhere for free. Bugs land once. Tests cover everything.

## When to apply

When you build an engine (a SEEME, a search, an analyzer, a renderer), expose at least:

- **CLI** — canonical surface
- **MCP** — for AI agent integration
- **Web UI** — for interactive use
- **Docker** — for one-command deploy

Optional: HTTP API, Raycast extension, VS Code extension.

## Workflow

[`docs/workflows/multi-surface-build.md`](../workflows/multi-surface-build.md) — start to ship.

## Real example

[`skills/visual/diagrams/seeme/`](../../skills/visual/diagrams/seeme/) — six surfaces, one engine. Read its `src/cli.ts`, `src/mcp.ts`, `src/server.ts` — note how all three call the same `src/generate.ts`.

## Exercise

Identify the engine in SEEME (`generate()` in `src/generate.ts`). Trace one input — a `seeme "explain X"` invocation — from CLI through engine to output.

## Next

[`07-label-contract.md`](07-label-contract.md).
