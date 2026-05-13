# Canonical Docker stack template — Learn Mappers LLC

Drop these files into any new app that needs state. The pattern is cloned 1:1
from `marvelousempire/claude-chat-reader`, the reference implementation we
already battle-tested.

## What you get

| Service | What it does |
|---|---|
| `db` | Postgres 16 + pgvector. Handles plain SQL *and* AI/RAG vector search out of the box. |
| `app` | Your application. Built from `Dockerfile:runner`. Non-root, tini-init, minimal image. |
| `caddy` | HTTPS reverse proxy. Internal TLS for dev, Let's Encrypt for production. Single entry point. |

Optional (uncomment in `docker-compose.yml`): `watcher` (file-drop ingest),
`metabase` (SQL/BI dashboards), `<name>-db` (independent sub-system Postgres).

## How to bootstrap a new app with this

```sh
# 1. Copy the template files into your new project
cp -r ~/Developer/ai-skills-library/rules/library/app-launch-workflow/templates/docker-stack/* ./my-new-app/

# 2. Rename APP_NAME placeholder in docker-compose.yml + Dockerfile + Makefile snippet
cd ./my-new-app
sed -i '' 's/<APP_NAME>/my-new-app/g' Dockerfile Makefile.docker.snippet docker-compose.yml

# 3. Append the Makefile snippet to your project's Makefile
cat Makefile.docker.snippet >> Makefile
rm Makefile.docker.snippet

# 4. One-time: install Caddy's local CA so https://localhost has no warnings
docker compose run --rm caddy caddy trust

# 5. Bring it up
./go
```

The user opens `https://localhost`. Done.

## The promise

```sh
git clone <repo>
cd <repo>
./go              # one line — server is up, browser opens, HTTPS works
```

Same one-line UX as Dustpan, just with state. The Docker Desktop install is a
one-time thing the user does once per Mac.

## Data persistence — what survives `docker compose down`

| Named volume | What it holds | Survives `down`? |
|---|---|---|
| `<app>_db_data` | Postgres data files | Yes (until explicit `down -v`) |
| `<app>_caddy_data` | Caddy auto-generated certs | Yes |
| `<app>_caddy_config` | Caddy runtime config | Yes |
| `./data/` (host bind) | App data, backups, uploads | Yes (it's a host folder) |

`make reset` requires the explicit confirmation prompt. Opt-in destruction only.

## Backups

```sh
make backup       # → ./data/backups/backup-YYYYMMDD-HHMMSS.sql.gz
make restore      # Loads the most recent backup
make export       # → ~/Downloads/<app>-export-YYYYMMDD.zip (CSV + JSON for humans)
```

## Production deployment

The same compose file you run locally is essentially what runs in production.
Two changes:

1. Set `CADDY_HOST=yourdomain.com` in `.env` — Caddy auto-fetches Let's Encrypt certs on first request.
2. Override `POSTGRES_PASSWORD` to something not in the example file.

Nothing else changes. Same services, same network shape, same `./go` bootstrap.

## When NOT to use this

Stateless apps. Dustpan is the example — it scans your disk and shells out to
`rm`. There's nothing to persist. Stateless apps stay on plain Python + Vite +
`make ui` (no Docker).

The rule: **needs state? → Docker. No state? → no Docker.**

## Files in this template

| File | Purpose |
|---|---|
| [`docker-compose.yml`](docker-compose.yml) | Service definitions. Three required services + three optional patterns. |
| [`Dockerfile`](Dockerfile) | Multi-stage: deps → builder → runner [→ watcher]. Non-root user, tini-init. |
| [`Caddyfile`](Caddyfile) | HTTPS reverse proxy. Security headers. Static-asset caching rules. |
| [`.env.example`](.env.example) | Variable defaults. Copied to `.env` on first `./go`. |
| [`go`](go) | The one-shot bootstrap. Docker check → env → up → health → browser → logs. |
| [`Makefile.docker.snippet`](Makefile.docker.snippet) | Make targets: `go`, `docker-up/down/logs/build`, `backup/restore/reset/export`. |
