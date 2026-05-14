---
name: port-alignment
id: RL-0034
keywords: [port, alignment]
---

# Port Alignment

Every port number in the stack must be defined once and read everywhere. Port numbers hardcoded in two or more places will drift.

## The single source of truth

`.env.example` defines every port. `.env` overrides for local deployments. Code reads from `process.env.PORT` (or equivalent). Docker Compose reads from the same `.env`.

## The ports in You-Sir Juan OS

| Service | Var | Default |
|---|---|---|
| Express API | `PORT` | `4000` |
| Next.js web | (pnpm dev default) | `3000` |
| Ollama | (Docker internal) | `11434` |
| Postgres | (Docker internal) | `5432` |
| Redis | (Docker internal) | `6379` |
| Qdrant | (Docker internal) | `6333` |
| Kokoro TTS | `KOKORO_URL` | `8880` |
| HomeKit bridge | `HOMEKIT_BRIDGE_PORT` | `4002` |

## The failure mode

In this project, `api/server.js` defaulted to `4001`. `docker-compose.runtime.yml` expected `4000`. `apps/README.md` documented `4001`. The iOS app pointed at `4001`. All wrong relative to each other. A developer who ran the stack got silent failures with no clear error.

## The rule

1. Every port is in `.env.example` with a comment
2. `server.js` reads `process.env.PORT || 4000` — never hardcodes
3. `docker-compose.yml` uses `${PORT:-4000}` notation
4. `apps/README.md` documents the resolved default
5. iOS `API.swift` reads from `YOUSIRJUAN_API_URL` env var — never hardcodes

## Check

```bash
grep -rn "4001\|localhost:4001" api/ apps/ docs/ README.md 2>/dev/null
# Should return nothing
```
