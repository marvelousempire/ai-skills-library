# Tech stack — Grok API (xAI) + archive quarry

**Witness (doctrine):** [nephew `docs/whitepapers/grok-api-tech-stack.md`](https://github.com/marvelousempire/nephew/blob/main/docs/whitepapers/grok-api-tech-stack.md)  
**Investigation:** [nephew `docs/investigations/grok-api-capabilities-index.md`](https://github.com/marvelousempire/nephew/blob/main/docs/investigations/grok-api-capabilities-index.md)  
**Ingest:** [claude-chat-reader `src/lib/ingest-grok.ts`](https://github.com/marvelousempire/claude-chat-reader/blob/main/src/lib/ingest-grok.ts) — `source = 'grok'`

## Summary

| Layer | Choice |
|-------|--------|
| Export format | `prod-grok-backend.json` (xAI export) |
| Local archive | claude-chat-reader SQLite + Postgres mirror |
| Reconstruction | nephew `scripts/reconstruct_grok_archive.py` |
| Routing heuristic | nephew `nephew route` / DSMRP rules |

## Quarry closure

Grok claimed **`tech-stacks/grok-api/`** with `manifest.json` on nephew `main` — **simulation**. This doc + nephew whitepaper replace that path. Do not expect a separate `grok-api/` package in nephew.

## Operator

```bash
cd ~/Developer/claude-chat-reader && pnpm ingest /path/to/export.zip
export CLAUDE_ARCHIVE_DB=~/Developer/claude-chat-reader/data/archive.db
cd ~/Developer/nephew && node bin/nephew archive search "witness" --source grok -n 5
```

## Secrets

xAI API keys — env / settings only; Patrol **Credentials** officer in Nephew dispatch.
