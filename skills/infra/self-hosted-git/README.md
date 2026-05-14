# self-hosted-git

> Private GitLab CE on your own Mac mini (or any Docker host). With CI runners, container registry, auto-HTTPS, daily backups, and a Tailscale-or-WireGuard tunnel for remote access.

```text
   ┌─────────────────┐   tunnel    ┌────────────────────────────┐
   │  laptop/phone   │◄────────────┤   Caddy reverse proxy      │
   │  anywhere       │  HTTPS      │   :443                     │
   └─────────────────┘             └──────────────┬─────────────┘
                                                  │
                                                  ▼
                                   ┌────────────────────────────┐
                                   │   GitLab CE Omnibus        │
                                   │   web UI + git + registry  │
                                   │   + runners + packages     │
                                   └────────────────────────────┘
```

Zero monthly operational cost once the hardware is bought. Yours. Private. Reachable from anywhere.

## Quick start

```sh
cd skills/infra/self-hosted-git
export GITLAB_HOSTNAME=git.your-tailnet.ts.net   # or a real domain you own
export GITLAB_ROOT_PASSWORD="change-me-on-first-login"
mkdir -p ./data/{config,logs,data,caddy-config,caddy-data,runner}
docker compose -f templates/gitlab-compose.yml up -d
docker compose -f templates/gitlab-compose.yml logs -f gitlab
# wait for "GitLab is now ready", then visit https://$GITLAB_HOSTNAME
```

Full playbook + decision tree: [`SKILL.md`](SKILL.md).

## What lives where

```
self-hosted-git/
├── SKILL.md                              # the playbook (read this first)
├── README.md                             # you are here
├── templates/
│   ├── gitlab-compose.yml                # 3-service stack: gitlab + runner + caddy
│   ├── Caddyfile                         # auto-HTTPS for gitlab + registry hostnames
│   ├── tailscale-quickstart.md           # Path A — start today, no router work
│   ├── wireguard-quickstart.md           # Path B — Mac mini + Flint 2 target
│   ├── runner-setup.md                   # how to register more runners on more boxes
│   ├── migrate-from-github.sh            # bulk-import via GitLab's built-in importer
│   ├── backup.sh                         # daily gitlab-backup → Backblaze B2
│   ├── upgrade-checklist.md              # major-version stepping + disaster recovery
│   └── ci/                               # GitHub-Actions-equivalent workflow templates
│       ├── README.md                     # what each template does
│       ├── TUTORIAL.md                   # your first pipeline in 10 minutes
│       ├── node-test-and-build.gitlab-ci.yml
│       ├── docker-build-and-push.gitlab-ci.yml
│       ├── static-site-deploy.gitlab-ci.yml
│       ├── scheduled-eval.gitlab-ci.yml
│       └── seeme-self-test.gitlab-ci.yml
├── dashboard/                            # CI overview UI (live pipeline status)
│   ├── README.md
│   ├── server.ts                         # Node stdlib http server + GitLab API proxy
│   ├── serve.sh                          # one-line launcher
│   ├── index.html                        # self-contained UI (matches SEEME aesthetic)
│   └── .env.example                      # GITLAB_URL + GITLAB_TOKEN
└── references/
    ├── gitlab-vs-forgejo.md              # decision record (why GitLab, not Forgejo)
    └── yousirjuan-context.md             # connection to the broader platform vision
```

## CI/CD — drop-in GitHub Actions replacement

GitLab CE ships its own CI/CD system, fully equivalent to GitHub Actions for most workflows. Drop a `.gitlab-ci.yml` file at the root of any repo and the runner picks it up. Pick a template from [`templates/ci/`](templates/ci/) and you're running in minutes:

```sh
# Your first pipeline (in any cloned repo):
cp ../../infra/self-hosted-git/templates/ci/node-test-and-build.gitlab-ci.yml .gitlab-ci.yml
git add .gitlab-ci.yml && git commit -m "ci: drop-in pipeline" && git push
# → pipeline appears in GitLab UI within seconds
```

Full 10-minute walkthrough: [`templates/ci/TUTORIAL.md`](templates/ci/TUTORIAL.md).

For cross-project "what's green / what's red right now" visibility:

```sh
cd dashboard
cp .env.example .env  # add GITLAB_URL + read_api token
./serve.sh            # → http://127.0.0.1:7778/
```

## Two paths, one Compose file

The Compose stack is identical for both paths. The only thing that changes is how traffic reaches the box.

- **Path A — Tailscale today**: works on any Mac or Linux host. Tailscale Funnel exposes the box on a stable `*.ts.net` hostname with auto-HTTPS. Free for personal use.
- **Path B — Mac mini + Flint 2 (the yousirjuan target)**: WireGuard server on the Flint 2 router. Mac mini exposes the GitLab port on the LAN. Devices on your tailnet/wireguard mesh reach it directly.

Migrating from Path A to Path B is a 10-minute job: stop containers, move volumes, re-point DNS, restart.

## Costs

| Component | Cost |
|---|---|
| Hardware (Mac mini M4 Pro) | one-time purchase |
| Network (Flint 2 + WireGuard) | one-time purchase |
| Domain (optional, for nicer URLs) | ~$10/yr |
| Backblaze B2 backups | ~$0.005/GB/mo — typically $0.05–$0.50/mo for a personal git server |
| Tailscale (Path A only) | $0 for personal use |
| GitLab CE, Caddy, GitLab Runner | $0 (open source) |

Recurring cost: **basically nothing.**

## Compatible with Dockyard

Every container in this stack (`gitlab`, `gitlab-caddy`, `gitlab-runner`) ships with the canonical `ai-skills-library.*` label schema, so [Dockyard](../dockyard/) renders the GitLab stack as a clean Compose project with names, roles, and per-service URLs. Recommended Docker UI in place of Docker Desktop — see [`../dockyard/references/engines-compared.md`](../dockyard/references/engines-compared.md).

## Anchors

- yousirjuan platform plan: [`docs/yousirjuan-platform-skills-master.md`](../../../docs/yousirjuan-platform-skills-master.md)
- yousirjuan upstream ledger: [`docs/yousirjuan-upstream-repo-ledger.md`](../../../docs/yousirjuan-upstream-repo-ledger.md)
- Dockyard (recommended Docker UI): [`../dockyard/`](../dockyard/)
