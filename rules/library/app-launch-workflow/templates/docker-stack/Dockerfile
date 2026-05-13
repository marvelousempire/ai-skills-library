# Canonical multi-stage Dockerfile — cloned from claude-chat-reader.
# Three targets:
#   deps    — install dependencies (cached layer)
#   builder — produce the production build artefacts
#   runner  — minimal runtime image (final stage by default)
#   watcher — alternative stage that runs a file-watcher process
#
# Build: docker compose build  (compose passes GIT_SHA/GIT_BRANCH/BUILT_AT).

ARG NODE_VERSION=22.12.0
ARG PNPM_VERSION=10.13.1

# ─── Stage 1: deps ──────────────────────────────────────────────────────────
# Install pnpm + node_modules. Cached aggressively so rebuilds are fast.
FROM node:${NODE_VERSION}-bookworm-slim AS deps
ARG PNPM_VERSION
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/package.json
# Mount pnpm cache for fast rebuilds.
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ─── Stage 2: builder ──────────────────────────────────────────────────────
# Produce the standalone production build.
FROM node:${NODE_VERSION}-bookworm-slim AS builder
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .
RUN pnpm --filter @<APP_NAME>/web build

# ─── Stage 3: runner (default — minimal runtime) ───────────────────────────
FROM node:${NODE_VERSION}-bookworm-slim AS runner
ARG GIT_SHA=unknown
ARG GIT_BRANCH=unknown
ARG BUILT_AT=unknown
ENV NODE_ENV=production
ENV GIT_SHA=${GIT_SHA}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV BUILT_AT=${BUILT_AT}
ENV PORT=3000
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates tini \
 && rm -rf /var/lib/apt/lists/* \
 && groupadd --system --gid 1001 app \
 && useradd  --system --uid 1001 --gid 1001 --no-create-home app
WORKDIR /app
# Copy ONLY the standalone production output (much smaller than full node_modules).
COPY --from=builder --chown=app:app /app/apps/web/.next/standalone ./
COPY --from=builder --chown=app:app /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=app:app /app/apps/web/public ./apps/web/public
USER app
EXPOSE 3000
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "apps/web/server.js"]

# ─── Stage 4: watcher (optional — file-watch ingestion sidecar) ────────────
# Build with: docker build --target watcher -t <app>-watcher .
FROM node:${NODE_VERSION}-bookworm-slim AS watcher
ARG PNPM_VERSION
ARG GIT_SHA=unknown
ENV NODE_ENV=production
ENV GIT_SHA=${GIT_SHA}
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates tini \
 && rm -rf /var/lib/apt/lists/* \
 && npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.json ./
COPY src ./src
RUN mkdir -p /app/data /watch
ENV WATCH_DIR=/watch
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["pnpm", "watch"]
