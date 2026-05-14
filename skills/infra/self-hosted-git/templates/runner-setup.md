# Runner setup

The Compose file ships one Docker-executor runner on the same host as GitLab. It needs a one-time registration step to bind to your instance. Add more runners on other machines (laptop, NVIDIA DGX Spark, Jetson Thor) using the same procedure.

## Register the local runner (one-time)

```sh
# 1. In the GitLab UI: Admin Area → CI/CD → Runners → "New instance runner".
#    Pick tags (e.g. `docker`, `mac-mini`) and click "Create".
#    Copy the registration token shown — it appears ONCE.

# 2. Register the runner via the container shell:
docker exec -it gitlab-runner gitlab-runner register \
  --non-interactive \
  --url "https://${GITLAB_HOSTNAME}/" \
  --token "<paste-the-token>" \
  --executor docker \
  --docker-image alpine:latest \
  --docker-privileged \
  --description "mac-mini-local" \
  --tag-list "docker,mac-mini"

# 3. Verify in the GitLab UI — the runner should appear as "online" within seconds.
```

The runner's config persists in `./data/runner/config.toml`. Container restarts pick it back up automatically.

## Add a runner on another machine

```sh
# On the new host (laptop, second Mac, Linux box):
docker run -d --name gitlab-runner --restart unless-stopped \
  -v gitlab-runner-config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest

# Then register the same way:
docker exec -it gitlab-runner gitlab-runner register \
  --non-interactive \
  --url "https://${GITLAB_HOSTNAME}/" \
  --token "<token-from-GitLab-UI>" \
  --executor docker \
  --docker-image alpine:latest \
  --docker-privileged \
  --description "laptop-runner" \
  --tag-list "docker,laptop"
```

## Useful runner tags for the yousirjuan stack

| Tag | Use for |
|---|---|
| `mac-mini` | runs on the always-on persistent node |
| `laptop` | runs only when your laptop is online (good for batch jobs) |
| `cuda` | requires NVIDIA hardware (DGX Spark or Jetson Thor) |
| `arm64` | ARM-only build targets |
| `large-mem` | jobs that need >8 GB RAM |
| `slow-network` | jobs that download big artifacts — pin to a fast host |

Tag your CI jobs in `.gitlab-ci.yml`:

```yaml
build-model:
  tags: [cuda, large-mem]
  image: nvidia/cuda:12.6.0-base-ubuntu22.04
  script:
    - ./scripts/train.sh
```

## When a runner needs more disk / RAM

Runners spawn a sibling Docker container per job. Limits come from Docker, not the runner itself:

```sh
# Edit ./data/runner/config.toml, find the [runners.docker] section, add:
#   memory = "8g"
#   memory_swap = "8g"
#   cpus = "4.0"
# Then bounce the runner:
docker compose -f templates/gitlab-compose.yml restart runner
```

## Removing a stale runner

In the GitLab UI: Admin Area → CI/CD → Runners → find it → "Delete runner". Then on the host:

```sh
docker exec -it gitlab-runner gitlab-runner unregister --all-runners
```
