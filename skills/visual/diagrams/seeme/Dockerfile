# SEEME — multi-stage Docker build
#
# Build context expected: skills/visual/diagrams/   (the parent of seeme/)
# This lets us copy the neighboring ascii-flow-diagrams/SKILL.md into the
# image so the system prompt loader works without depending on a sibling
# folder at runtime.
#
# Build:
#   docker compose build              # (recommended — sets context for you)
#   docker build -f seeme/Dockerfile -t seeme .   # from skills/visual/diagrams/
#   npm run docker:build              # (handles the context flag for you)
#
# Run:
#   docker compose up -d              # full stack (SEEME + Ollama + llama3.1)
#   docker run -p 7777:7777 seeme     # just the web UI (no provider unless --env-file)

# ─── stage 1: install dependencies ─────────────────────────────────────────
FROM node:24-slim AS deps
WORKDIR /app

# Install only what's needed for production. We prefer pnpm when a lockfile
# is present (matches local dev), otherwise fall back to npm.
COPY seeme/package.json seeme/pnpm-lock.yaml* seeme/package-lock.json* ./

RUN if [ -f pnpm-lock.yaml ]; then \
      corepack enable && corepack prepare pnpm@10 --activate && \
      pnpm install --frozen-lockfile --prod; \
    elif [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi

# ─── stage 2: runtime image ────────────────────────────────────────────────
FROM node:24-slim AS runtime

WORKDIR /app

# Bring in deps + source. tini is a tiny init that reaps zombies and
# forwards signals — needed so Ctrl-C from `docker run` and SIGTERM from
# orchestrators reach our Node process cleanly.
RUN apt-get update && apt-get install -y --no-install-recommends tini wget \
    && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY seeme/package.json seeme/tsconfig.json ./
COPY seeme/src ./src
COPY seeme/bin ./bin
COPY seeme/test/fixtures ./test/fixtures

# Vendor the neighboring style spec into the image. SEEME_STYLE_SPEC overrides
# the default `../ascii-flow-diagrams/SKILL.md` lookup, which doesn't work
# inside the container because we only ship the seeme folder.
COPY ascii-flow-diagrams/SKILL.md /app/skill/SKILL.md
ENV SEEME_STYLE_SPEC=/app/skill/SKILL.md

# Entrypoint dispatches: no args / "serve" → web UI bound to 0.0.0.0;
# anything else → pass through to the seeme CLI.
COPY seeme/docker/entrypoint.sh /entrypoint.sh

# Make everything executable + create a non-root user. Doing both in one
# RUN keeps the image lean (single layer).
RUN chmod +x /entrypoint.sh /app/bin/seeme /app/bin/seeme-mcp \
    && groupadd -r seeme \
    && useradd -r -g seeme -m -d /home/seeme seeme \
    && chown -R seeme:seeme /app /home/seeme

# Make `seeme` and `seeme-mcp` callable without a path.
ENV PATH="/app/bin:${PATH}"

# Persisted state: ~/.seeme/{last.json, history.jsonl}. Mount a volume here
# in production so refines + stats survive container restarts.
VOLUME ["/home/seeme/.seeme"]

EXPOSE 7777

# Health check pings the providers endpoint — proves the server is up AND
# the SKILL.md loader didn't crash on startup.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:7777/api/providers || exit 1

USER seeme

ENTRYPOINT ["/usr/bin/tini", "--", "/entrypoint.sh"]
CMD ["serve"]
