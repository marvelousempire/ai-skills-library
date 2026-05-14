# Your first self-hosted CI pipeline — 10-minute tutorial

End-to-end walkthrough. Assumes GitLab is up (per the main [SKILL.md](../../SKILL.md)) and the local runner registered (per [`runner-setup.md`](../runner-setup.md)).

## 1. Verify the runner is online (30 seconds)

In the GitLab UI:

```text
   Admin Area → CI/CD → Runners → all runners
```

You should see one entry, status **online** (green dot). If not — the runner container hasn't registered yet. Re-run the registration command from [`runner-setup.md`](../runner-setup.md).

## 2. Create a test project (2 minutes)

In the GitLab UI:

```text
   ☰ → Projects → New project → Create blank project
        Name:                 hello-ci
        Visibility:           Private
        Initialize with README: ✓
```

Then clone it locally:

```sh
git clone https://$GITLAB_HOSTNAME/<your-user>/hello-ci.git
cd hello-ci
```

## 3. Drop in a minimal `.gitlab-ci.yml` (1 minute)

```sh
cat > .gitlab-ci.yml <<'YAML'
hello:
  image: alpine:latest
  tags: [docker]
  script:
    - echo "Hello from self-hosted CI!"
    - echo "Branch: $CI_COMMIT_BRANCH"
    - echo "Commit: $CI_COMMIT_SHORT_SHA"
    - echo "Triggered by: $GITLAB_USER_LOGIN"
    - uname -a
    - date
YAML

git add .gitlab-ci.yml
git commit -m "ci: hello world"
git push
```

## 4. Watch the pipeline run (2 minutes)

In the GitLab UI of your project:

```text
   Build → Pipelines
```

You should see a new pipeline appear within ~10 seconds with status `running`. Click into it → click the `hello` job → watch the live log.

When it finishes (~15 seconds), the status badge turns green: ✓ **passed**.

```text
   ┌─────────────────────────────────────────────────────────────┐
   │  Pipeline #1  ✓ passed   for main                            │
   ├─────────────────────────────────────────────────────────────┤
   │  $ echo "Hello from self-hosted CI!"                         │
   │  Hello from self-hosted CI!                                  │
   │  $ echo "Branch: $CI_COMMIT_BRANCH"                          │
   │  Branch: main                                                │
   │  $ uname -a                                                  │
   │  Linux runner-xyz 6.6.0 #1 SMP aarch64 GNU/Linux             │
   │  Job succeeded                                               │
   └─────────────────────────────────────────────────────────────┘
```

**That's it. You just ran a self-hosted CI job. No GitHub. No third party.**

## 5. Graduate to a real workflow (5 minutes)

Pick the template that matches your project from [`README.md`](README.md) and copy it in:

```sh
# Example: SEEME's own CI shape
curl -fsSL ../seeme-self-test.gitlab-ci.yml > .gitlab-ci.yml
# or just copy from your local clone of the skill folder

git add .gitlab-ci.yml
git commit -m "ci: full test pipeline"
git push
```

The new pipeline appears, runs `typecheck` + `test` in parallel, and shows pass/fail in the UI.

## 6. See it in the dashboard (1 minute)

Open the CI overview dashboard (see [`../../dashboard/README.md`](../../dashboard/README.md)):

```sh
cd skills/infra/self-hosted-git/dashboard
./serve.sh
open http://127.0.0.1:7778/
```

Your `hello-ci` project shows up with the green ✓ badge. Any subsequent pushes update the dashboard within 15 seconds.

## What's actually happening under the hood

```text
   ┌────────────┐  push    ┌──────────┐  trigger   ┌────────────────┐
   │  git push  │─────────►│ GitLab   │───────────►│ pipeline       │
   │ (.gitlab-  │          │ CE       │            │ created        │
   │  ci.yml)   │          │          │            │ status=pending │
   └────────────┘          └──────────┘            └────────┬───────┘
                                                            │ assign to
                                                            ▼ runner w/
                                                       matching tags
                                                   ┌────────────────┐
                                                   │  gitlab-runner │
                                                   │  (Docker exec) │
                                                   ├────────────────┤
                                                   │ pulls image    │
                                                   │ clones repo    │
                                                   │ runs script    │
                                                   │ streams log    │
                                                   │ uploads        │
                                                   │   artifacts    │
                                                   └────────────────┘
```

Every job runs in a fresh Docker container. The runner cleans up after each job. Cache + artifacts persist where you tell them to.

## Common gotchas

| Symptom | Fix |
|---|---|
| Pipeline stuck on `pending` for >30s | Runner offline. Check `docker compose -f templates/gitlab-compose.yml logs runner`. |
| `ERROR: Job failed: prepare environment` | Runner can't reach the Docker daemon. Re-mount `/var/run/docker.sock`. |
| `image: <name>` fails to pull | Check `docker pull <name>` works on the host; if it does, your runner needs the same network access. |
| `tags: [docker]` doesn't match | Re-register the runner with `--tag-list docker` (see runner-setup.md). |
| Pipeline runs but artifacts not visible | Check the `paths:` in `artifacts:` — they must exist at the moment the job ends. |

## What changes once you have more hardware

When the DGX Spark / Jetson Thor / Mac mini fleet from the yousirjuan plan comes online:

```yaml
train-model:
  image: nvidia/cuda:12.6.0-base-ubuntu22.04
  tags: [cuda, large-mem]   # ← lands only on a runner with these tags
  script:
    - ./scripts/train.sh

build-arm-image:
  image: docker:27
  tags: [arm64]             # ← lands on the Mac mini (ARM-native)
  script:
    - docker buildx build --platform linux/arm64 .
```

Tag conventions in [`runner-setup.md`](../runner-setup.md).

## Next steps

- Move existing projects off GitHub Actions: replace `.github/workflows/*.yml` with `.gitlab-ci.yml`. Most workflows port in 15 minutes.
- Wire Slack/Discord notifications in GitLab UI: Project → Settings → Integrations.
- Set up [scheduled pipelines](scheduled-eval.gitlab-ci.yml) for nightly evals / audits.
- Push private Docker images to your registry via [`docker-build-and-push.gitlab-ci.yml`](docker-build-and-push.gitlab-ci.yml).
