# SEEME in Docker

Run SEEME without installing Node, Ollama, or anything else locally — just Docker.

## Full stack (recommended)

The compose file boots three things together:

```text
   ┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐
   │  seeme-ollama-init │───►│    seeme-ollama    │◄───│      seeme-ui      │
   │  pulls llama3.1    │    │  Ollama server     │    │  web UI :7777      │
   │  one-shot, exits   │    │  :11434            │    │  Node 24 + Express │
   └────────────────────┘    └────────────────────┘    └────────────────────┘
                                                                │
                                                                ▼
                                                        ┌────────────────┐
                                                        │  your browser  │
                                                        │  localhost:7777│
                                                        └────────────────┘
```

```sh
cd skills/visual/diagrams/seeme
docker compose up -d
open http://localhost:7777
```

First boot pulls a few hundred MB (llama3.1). Subsequent boots are instant thanks to the `ollama-data` volume.

To stop:
```sh
docker compose down
```

To tear it down completely (delete the model + cache):
```sh
docker compose down -v
```

## Just the SEEME image (no Ollama)

If you already have Ollama running on the host, or you only want to use cloud providers:

```sh
# Build (from inside seeme/):
npm run docker:build         # equivalent to: docker build -f Dockerfile -t seeme:latest ..

# Run with a cloud key:
docker run --rm -p 7777:7777 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -v seeme-data:/home/seeme/.seeme \
  seeme:latest

# Or talk to Ollama on the host:
docker run --rm -p 7777:7777 \
  -e OLLAMA_HOST=http://host.docker.internal:11434 \
  seeme:latest
```

## CLI in Docker

The image also works as a one-shot CLI:

```sh
docker run --rm seeme:latest providers
docker run --rm \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  seeme:latest "explain how OAuth works"
docker run --rm seeme:latest example
```

## Configuration

Drop a `.env` file next to `docker-compose.yml`:

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
PERPLEXITY_API_KEY=pplx-...

# Override the default provider (auto-detected otherwise):
SEEME_PROVIDER=anthropic
SEEME_MODEL=claude-opus-4-7

# 1-hour Anthropic prompt cache (requires beta access):
SEEME_LONG_CACHE=1

# Opt-in history log at /home/seeme/.seeme/history.jsonl:
SEEME_HISTORY=1
```

Compose picks `.env` up automatically. For `docker run`, pass `--env-file .env`.

## Volumes

| Volume | Purpose | What persists |
|---|---|---|
| `ollama-data` | Ollama's model cache | Downloaded models (llama3.1, etc.) |
| `seeme-data` | SEEME state | `~/.seeme/last.json` (refine cache), `~/.seeme/history.jsonl` (opt-in) |

Both survive `docker compose down` but not `down -v`.

## Image details

- Base: `node:24-slim` (Debian-based, ~140MB compressed)
- Multi-stage build: deps installed in a separate layer, runtime image is slim
- Non-root user: runs as `seeme` (uid/gid from useradd, not host-mapped)
- Init: `tini` reaps zombies and forwards signals (so Ctrl-C and `docker stop` are clean)
- Health check: pings `/api/providers` every 30s
- Default port: 7777 (override with `SEEME_PORT` env var)

## Troubleshooting

**"SEEME cannot find the ascii-flow-diagrams style spec"** — you ran `docker build .` from inside the seeme folder. The build context must be the parent `diagrams/` folder so the Dockerfile can vendor the sibling SKILL.md. Use `npm run docker:build` or `docker compose build` instead.

**Ollama not reachable from SEEME** — check that both containers are on the same network and SEEME's `OLLAMA_HOST` is `http://ollama:11434` (the service name), not `localhost`. Compose handles this automatically.

**Port 7777 already in use** — set `ports: - "8888:7777"` in `docker-compose.yml` (or `-p 8888:7777` on `docker run`).
