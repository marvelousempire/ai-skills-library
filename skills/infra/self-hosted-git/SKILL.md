---
name: self-hosted-git
description: Stand up a private GitLab CE Git server on a Mac mini (or any spare box) with Docker Compose, Caddy auto-HTTPS, and a Tailscale-or-WireGuard tunnel for remote access. Includes GitHub-Actions-equivalent CI/CD via GitLab Runners (5 ready-to-use .gitlab-ci.yml templates + a tutorial), a self-contained CI overview dashboard, container registry, GitHub repo migration, daily backups to Backblaze B2, and an upgrade-stepping checklist. Anchors in the yousirjuan platform Category 11 (Governance, GitOps & Operational Memory). Triggers on "set up private git", "self-host git", "GitLab on Mac mini", "private git server", "private repo hosting", "migrate from GitHub", "self-hosted GitHub Actions", "private CI/CD", "GitLab CI", "replace GitHub Actions".
---

# self-hosted-git — private GitLab CE playbook

End-to-end playbook for running a private GitLab CE instance on your own hardware, with CI runners, container registry, and a remote-access tunnel. Designed for the [yousirjuan platform Category 11 vision](../../../docs/yousirjuan-platform-skills-master.md) (private governance + GitOps + operational memory).

## When to use

- "Set up a private git server"
- "Self-host git on the Mac mini"
- "Replace GitHub with my own"
- "Set up GitLab CE for personal/small-team use"
- "Migrate my repos off GitHub"
- "Add private CI runners"
- "Stand up a container registry"

## The decision in one diagram

```text
   ┌────────────────────────────────────────────────────────────────────┐
   │  WHICH PATH ARE YOU ON?                                             │
   ├────────────────────────────────────────────────────────────────────┤
   │  Mac mini M4 Pro already on order?     ───►  Path B (target arch)  │
   │  Spare Mac / Linux box for now?        ───►  Path A (start now)    │
   │  Lightweight + simple > full features? ───►  switch to Forgejo     │
   │                                              (see references/      │
   │                                               gitlab-vs-forgejo.md)│
   └────────────────────────────────────────────────────────────────────┘
```

**Path A — start today**: Any host + Tailscale for remote access. Zero networking config. Free for personal use. Migrate to Path B when the Mac mini arrives.

**Path B — target architecture**: Mac mini M4 Pro + Flint 2 + WireGuard. Identical software stack to Path A; just better hardware and your own router doing the tunnel.

The Docker Compose, Caddyfile, runner config, backup script, and upgrade checklist are identical for both. **Only the network entry point differs.**

## The stack

```text
   ┌─────────────────┐   tunnel    ┌────────────────────────────┐
   │  laptop/phone   │◄────────────┤   reverse proxy (Caddy)    │
   │  anywhere       │  HTTPS      │   git.your.tld  :443       │
   └─────────────────┘             │   registry.your.tld :443   │
                                   └──────────────┬─────────────┘
                                                  │
                                                  ▼
                                   ┌────────────────────────────┐
                                   │   gitlab-ce  (Omnibus)     │
                                   │   ┌────────┐ ┌──────────┐  │
                                   │   │ Puma   │ │ Sidekiq  │  │
                                   │   ├────────┤ ├──────────┤  │
                                   │   │Gitaly  │ │ Postgres │  │
                                   │   ├────────┤ ├──────────┤  │
                                   │   │Workhorse│ │ Redis   │  │
                                   │   └────────┘ └──────────┘  │
                                   └──────────────┬─────────────┘
                                                  │  Docker socket
                                                  ▼
                                   ┌────────────────────────────┐
                                   │   gitlab-runner (Docker    │
                                   │   executor) — registers    │
                                   │   itself on first start    │
                                   └────────────────────────────┘
```

## Quick start (Path A — Tailscale today)

```sh
# 1. Get into the skill folder.
cd skills/infra/self-hosted-git

# 2. Pick a hostname for Tailscale Funnel (free) OR a real domain you own.
#    For Tailscale: hostname becomes `<machine>.<tailnet>.ts.net`.
export GITLAB_HOSTNAME=git.your-tailnet.ts.net

# 3. Set an initial root password (used only for first login).
export GITLAB_ROOT_PASSWORD="change-me-after-first-login"

# 4. Pre-create the data directories (avoids root-owned bind-mount surprises).
mkdir -p ./data/{config,logs,data,caddy-config,caddy-data,runner}

# 5. Boot the stack.
docker compose -f templates/gitlab-compose.yml up -d

# 6. First boot takes 1–3 minutes — GitLab cold-starts every subsystem.
#    Tail logs until you see "GitLab is now ready":
docker compose -f templates/gitlab-compose.yml logs -f gitlab

# 7. Once ready, log in at https://$GITLAB_HOSTNAME with username `root`
#    and the password you set above. Change it.

# 8. Register the runner (the runner container will auto-register on first
#    successful contact — see templates/runner-setup.md if it doesn't).
```

Tailscale setup details: [`templates/tailscale-quickstart.md`](templates/tailscale-quickstart.md).

WireGuard / Flint 2 target setup: [`templates/wireguard-quickstart.md`](templates/wireguard-quickstart.md).

## What you get out of the box

| Surface | URL |
|---|---|
| Web UI + issues + MRs | `https://$GITLAB_HOSTNAME/` |
| Git clone (HTTPS) | `https://$GITLAB_HOSTNAME/<group>/<repo>.git` |
| Git clone (SSH) | `git@$GITLAB_HOSTNAME:<group>/<repo>.git` (port 2222 in compose; remap to 22 if you control the host's port 22) |
| Container registry | `https://registry.$GITLAB_HOSTNAME/` |
| Package registry | Auth via the same web UI |
| CI / pipelines | one Docker-executor runner auto-registers on boot |
| Health endpoint | `https://$GITLAB_HOSTNAME/-/health` |

## Resource expectations on a Mac mini M4 Pro

| Component | RAM | CPU at idle | Notes |
|---|---|---|---|
| `gitlab-ce` (Omnibus) | 4–6 GB | <5% | bursts on every CI start, web request, sidekiq tick |
| `gitlab-runner` | 100 MB | <1% | each running job spawns a sibling Docker container |
| `caddy` | 50 MB | <1% | basically free |
| Total at rest | **~4.5 GB** | low single-digit % | |
| Total during a CI job | ~6 GB + job RAM | depends | |

A 24-GB Mac mini M4 Pro runs this comfortably with room left for Open WebUI, Qdrant, PostgreSQL, and Ollama (per the [yousirjuan platform plan](../../../docs/yousirjuan-platform-skills-master.md#10-infrastructure--deployment)).

## CI/CD — your private GitHub Actions

GitLab CE includes a full CI/CD system (`.gitlab-ci.yml` + Runners). One runner auto-registers when you boot the stack. Five ready-to-use workflow templates ship in [`templates/ci/`](templates/ci/):

| Template | What it does |
|---|---|
| [`node-test-and-build.gitlab-ci.yml`](templates/ci/node-test-and-build.gitlab-ci.yml) | install → typecheck → test → bundle, with pnpm/npm cache |
| [`docker-build-and-push.gitlab-ci.yml`](templates/ci/docker-build-and-push.gitlab-ci.yml) | build image, push to your private container registry |
| [`static-site-deploy.gitlab-ci.yml`](templates/ci/static-site-deploy.gitlab-ci.yml) | build + rsync-deploy to Caddy on the Mac mini |
| [`scheduled-eval.gitlab-ci.yml`](templates/ci/scheduled-eval.gitlab-ci.yml) | cron-triggered evals, with JUnit reports + 90-day artifacts |
| [`seeme-self-test.gitlab-ci.yml`](templates/ci/seeme-self-test.gitlab-ci.yml) | reference: Node 24 + `--experimental-strip-types` + 42-test suite |

10-minute tutorial: [`templates/ci/TUTORIAL.md`](templates/ci/TUTORIAL.md) — your first pipeline running in ~10 lines of YAML.

## CI overview dashboard

Self-contained "what's green and what's red right now" page across every project. Live status, calm aesthetic (matches SEEME). Runs locally, polls the GitLab API every 15 seconds:

```sh
cd dashboard
cp .env.example .env       # add GITLAB_URL + GITLAB_TOKEN (read_api scope)
./serve.sh                 # → http://127.0.0.1:7778/
```

Full setup: [`dashboard/README.md`](dashboard/README.md).

## Day-2 operations

| Task | How |
|---|---|
| Daily backup | `templates/backup.sh` runs `gitlab-backup create`, ships to Backblaze B2 (~$0.005/GB/mo) |
| Upgrade GitLab | [`templates/upgrade-checklist.md`](templates/upgrade-checklist.md) — never skip versions across major boundaries |
| Add a runner on another box | [`templates/runner-setup.md`](templates/runner-setup.md) |
| Migrate repos out of GitHub | [`templates/migrate-from-github.sh`](templates/migrate-from-github.sh) — uses GitLab's built-in importer |
| Restore from backup | step-by-step in [`templates/upgrade-checklist.md`](templates/upgrade-checklist.md#disaster-recovery) |
| Watch all pipelines at a glance | [`dashboard/`](dashboard/) — local CI overview |

## Pairing

- **Platform vision**: [`docs/yousirjuan-platform-skills-master.md`](../../../docs/yousirjuan-platform-skills-master.md) — Category 11 (Governance, GitOps & Operational Memory) lists GitLab CE as the planned platform; this skill ships it.
- **Upstream ledger**: [`docs/yousirjuan-upstream-repo-ledger.md`](../../../docs/yousirjuan-upstream-repo-ledger.md) — section 11 (Infrastructure, Network & Governance) and section 12 (Hardware) confirm the Mac-mini-on-WireGuard-via-Flint-2 target.
- **Why not Forgejo**: [`references/gitlab-vs-forgejo.md`](references/gitlab-vs-forgejo.md) — the explicit decision record.
- **Why this skill exists**: [`references/yousirjuan-context.md`](references/yousirjuan-context.md) — connects this playbook to the broader sovereign-stack vision.

## Status of the yousirjuan plan after running this

- Category 11 / GitLab CE → **Active** (from Planned)
- Category 11 / Gitea, Forgejo → **Alternative (not selected)**
- Category 11 / GitLab Runners → **Active** (auto-registered by this skill)
- Category 11 / GitLab Registry → **Active** (enabled in the Compose template)
- Update the ledger when you've run the playbook: a one-line edit per entry.
