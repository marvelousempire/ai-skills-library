# CI workflows for self-hosted GitLab CE

GitLab's CI/CD is the GitHub-Actions-equivalent. Drop a `.gitlab-ci.yml` file at the root of any project and GitLab + your runner do the rest. These templates cover the five most common shapes; copy whichever fits, tweak the names, commit.

| Template | What it does | When to use |
|---|---|---|
| [`node-test-and-build.gitlab-ci.yml`](node-test-and-build.gitlab-ci.yml) | `npm install` → typecheck → test → artifact the `dist/` folder | Any Node/TypeScript project (SEEME, the dashboard itself, web apps) |
| [`docker-build-and-push.gitlab-ci.yml`](docker-build-and-push.gitlab-ci.yml) | Builds an image, pushes to the GitLab Container Registry | When you have a Dockerfile and want to publish images privately |
| [`static-site-deploy.gitlab-ci.yml`](static-site-deploy.gitlab-ci.yml) | Builds a static site, rsync-deploys to a Caddy directory on the Mac mini | Personal site, docs site, marketing pages |
| [`scheduled-eval.gitlab-ci.yml`](scheduled-eval.gitlab-ci.yml) | Cron-triggered pipeline that runs an evaluation/check and stores artifacts | Daily eval runs, ingestion jobs, health audits |
| [`seeme-self-test.gitlab-ci.yml`](seeme-self-test.gitlab-ci.yml) | The SEEME package's own CI — runs typecheck + 42 unit tests + lints diagrams | Reference for "how do I CI a Node 24 project with --experimental-strip-types" |

## How it actually works (vs GitHub Actions)

```text
   ┌─────────────────────────────────┐         ┌──────────────────────────┐
   │  GitHub Actions (.github/        │         │  GitLab CI (.gitlab-     │
   │      workflows/*.yml)            │   ←→    │      ci.yml at root)     │
   ├─────────────────────────────────┤         ├──────────────────────────┤
   │  jobs:                           │         │  stages: [test, build]    │
   │    test:                         │         │  test-job:                │
   │      runs-on: ubuntu-latest      │         │    stage: test           │
   │      steps:                      │         │    image: node:24-slim    │
   │        - uses: actions/checkout  │         │    tags: [docker]         │
   │        - run: npm test           │         │    script:                │
   │                                  │         │      - npm test           │
   └─────────────────────────────────┘         └──────────────────────────┘
        runs on GitHub-owned VMs                  runs on YOUR runner
        you pay per minute over 2k                $0 — your hardware
        depend on github.com                      depend on yourself
```

GitLab also supports:
- Manual jobs (`when: manual`) — same as GitHub Actions' `workflow_dispatch`
- Scheduled pipelines — same as GitHub Actions' `schedule: cron:`
- Multi-stage pipelines with artifact passing — richer than GitHub's needs(...)
- Environments + deployment tracking — built-in, no extra app needed
- Manual approval gates between stages
- Runner tags to pin jobs to specific machines (mac-mini, cuda, large-mem)
- Job dependencies, parallel execution, matrix builds

## Tagging strategy

Every job in these templates includes `tags: [docker]` so it lands on the runner that auto-registered with the `self-hosted-git` skill. If you add specialized runners later (DGX Spark for CUDA, Jetson Thor for edge inference), tag those jobs accordingly:

```yaml
train-model:
  stage: train
  tags: [cuda, large-mem]
  image: nvidia/cuda:12.6.0-base-ubuntu22.04
  script:
    - ./scripts/train.sh
```

See [`../runner-setup.md`](../runner-setup.md) for adding more runners.

## Secrets

GitLab has a Secrets-equivalent: **CI/CD Variables** (Project → Settings → CI/CD → Variables). Mark sensitive ones as **Masked + Protected**. They're injected as environment variables into every job.

These templates use the following variable names:
- `DEPLOY_TARGET_HOST` — for the static-site template
- `DEPLOY_TARGET_USER` — same
- `DEPLOY_SSH_KEY` — file-type variable holding the deploy SSH private key
- `CI_REGISTRY_USER`, `CI_REGISTRY_PASSWORD`, `CI_REGISTRY_IMAGE` — auto-set by GitLab for the container-registry template, no manual config needed

## First pipeline — the 90-second test

```sh
# 1. In any repo, add this minimal .gitlab-ci.yml:
cat > .gitlab-ci.yml <<'YAML'
hello:
  image: alpine:latest
  tags: [docker]
  script:
    - echo "Hello from self-hosted CI!"
    - uname -a
    - date
YAML

# 2. Commit + push:
git add .gitlab-ci.yml && git commit -m "ci: hello world" && git push

# 3. In GitLab UI: Project → Build → Pipelines. You should see a pipeline
#    appear within seconds, status running → success.

# 4. Click into it → "hello" job → see the script output.
```

If it doesn't appear: check **Project → Settings → CI/CD → Runners** — your local runner should be online (green dot). If not, see [`../runner-setup.md`](../runner-setup.md).

## What's NOT here yet

- **Multi-architecture builds** — straightforward with `buildx` once you have an ARM runner (the Mac mini IS ARM); template can be added later.
- **Auto-deploy on tag** — included as a stage in `static-site-deploy` but pattern is the same for any deploy target.
- **Slack/Discord notifications on failure** — GitLab has built-in webhooks (Project → Settings → Webhooks) and Integrations (Slack, Discord, Microsoft Teams). Configure in the UI, no YAML.

Add new templates here as the patterns emerge.
