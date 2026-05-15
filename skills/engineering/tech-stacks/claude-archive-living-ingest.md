# Tech stack — Claude Archive living ingest

**Witness repo:** [marvelousempire/claude-chat-reader](https://github.com/marvelousempire/claude-chat-reader)  
**Quarry thread:** Watch folder triggers (Mac/Linux) → maps to ZIP + LLM history watchers  
**Handoff:** [nephew watch-folder-to-living-ingest](https://github.com/marvelousempire/nephew/blob/main/docs/handoffs/watch-folder-to-living-ingest.md)

## Summary

| Surface | Command | What it watches |
|---------|---------|-----------------|
| Export ZIP drop | `pnpm watch` | `WATCH_DIR` (default `./data/incoming/`) |
| LLM app history | `pnpm harvest --watch` | Adapter roots (Plan 0016/0017) |
| One-shot harvest | `pnpm harvest [--source=ID]` | All adapters |
| macOS daemon | `make install-launchd` | LaunchAgent for watch |

Disable harvest in watch: `HARVEST_DISABLED=1`.

## Stack

- **SQLite** + FTS5 + optional **Postgres/pgvector** mirror  
- **Ingest:** `ingestZip()`, `ingest-grok.ts`, `src/lib/harvest/` adapters  
- **UI:** Next.js dashboard `:3000`

## Not the same as

- Automata folder micro-slices on VPS (see `automata-monorepo.md`)  
- Grok-pasted `fswatch` one-liners without repo witness

## Verify

```bash
cd ~/Developer/claude-chat-reader
pnpm watch   # or pnpm harvest --list
```
