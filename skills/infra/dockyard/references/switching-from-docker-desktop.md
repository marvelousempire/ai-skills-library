# Switching from Docker Desktop to Colima — migration guide

Step-by-step. No data loss. Reversible. ~20 minutes if Docker Desktop is currently healthy; ~5 minutes if it's already broken (you skip the export step).

This guide assumes Apple Silicon + recent macOS. For Intel Macs the steps are identical but Colima's `--vm-type vz` flag is replaced with `--vm-type qemu`.

## 1. Decide what data to preserve

Three categories live inside Docker Desktop's VM:

| What | Where | Survives migration? |
|---|---|---|
| **Named volumes** (`postgres_data`, `gitlab-config`, etc.) | Inside the VM filesystem | **No** — must export + re-import |
| **Bind mounts** (`./data:/var/lib/postgres`) | On your Mac filesystem | **Yes** — no action needed |
| **Images** | Inside the VM filesystem | Optional — Colima will re-pull on demand |

If your library stacks use **bind mounts** (the seeme + gitlab compose files mostly do), you can skip the volume-export step entirely. Migration becomes:

```sh
# 1. Stop everything
docker compose -f skills/visual/diagrams/seeme/docker-compose.yml down
docker compose -f skills/infra/self-hosted-git/templates/gitlab-compose.yml down

# 2. Quit Docker Desktop
osascript -e 'quit app "Docker"'

# 3. Install + start Colima
brew install colima docker docker-compose docker-buildx
colima start --cpu 4 --memory 8 --disk 60

# 4. Re-up everything
docker compose -f skills/visual/diagrams/seeme/docker-compose.yml up -d
docker compose -f skills/infra/self-hosted-git/templates/gitlab-compose.yml up -d
```

Done. Containers come up against bind-mounted data that's still on your Mac filesystem; Colima pulls images from the registry as needed.

## 2. If you DO have named volumes (full version)

```sh
# 2a. While Docker Desktop is still running, export each named volume.
mkdir -p ~/volume-backups
for vol in $(docker volume ls --format '{{.Name}}'); do
  echo "Exporting $vol..."
  docker run --rm -v "$vol:/source:ro" -v ~/volume-backups:/backup \
    alpine:latest sh -c "cd /source && tar czf /backup/${vol}.tar.gz ."
done

# 2b. Stop containers + quit Docker Desktop
docker compose -f skills/visual/diagrams/seeme/docker-compose.yml down
docker compose -f skills/infra/self-hosted-git/templates/gitlab-compose.yml down
osascript -e 'quit app "Docker"'

# 2c. Install + start Colima
brew install colima docker docker-compose docker-buildx
colima start --cpu 4 --memory 8 --disk 60

# 2d. Recreate each volume + import its data
for backup in ~/volume-backups/*.tar.gz; do
  vol=$(basename "$backup" .tar.gz)
  echo "Restoring $vol..."
  docker volume create "$vol"
  docker run --rm -v "$vol:/target" -v ~/volume-backups:/backup \
    alpine:latest sh -c "cd /target && tar xzf /backup/${vol}.tar.gz"
done

# 2e. Boot the stacks
docker compose -f skills/visual/diagrams/seeme/docker-compose.yml up -d
docker compose -f skills/infra/self-hosted-git/templates/gitlab-compose.yml up -d
```

## 3. Verify

```sh
# Engine is Colima now
docker context show       # → "colima" or "default" pointing at colima's socket
docker info | grep -E 'Server Version|Operating System'

# Library stacks are healthy
curl -fsS http://localhost:7777/api/providers  # SEEME
curl -fsS "https://$GITLAB_HOSTNAME/-/health"  # GitLab (if hostname set)

# Boot Dockyard so you have a UI for what's running
bash skills/infra/dockyard/templates/install.sh
open http://localhost:4321/
```

## 4. Optional: reclaim Docker Desktop's disk

Docker Desktop leaves a 50+ GB `Docker.raw` image behind even after you quit it. To reclaim:

```sh
# WARNING: this deletes Docker Desktop's VM data permanently. Confirm
# that you've stopped using Docker Desktop and Colima is working first.
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/Library/Group\ Containers/group.com.docker
rm -rf ~/Library/Application\ Support/Docker\ Desktop
df -h ~                # confirm GBs reclaimed
```

You can also reinstall Docker Desktop later if you change your mind — nothing about this migration is permanent.

## 5. Rolling back

If Colima doesn't work for you (rare), rollback is symmetrical:

```sh
# Quit Colima
docker compose down -t 30
colima stop

# Reopen Docker Desktop
open -a Docker
# Wait for the whale icon to go solid, then:
docker compose up -d
```

Same bind-mounted data; same compose files; same containers.

## Common issues during migration

| Symptom | Cause | Fix |
|---|---|---|
| `Cannot connect to the Docker daemon at unix:///var/run/docker.sock` | Colima hasn't started yet | `colima start` |
| `Error response from daemon: image XYZ not found` | Images stayed in Docker Desktop's VM | Colima pulls them fresh: `docker pull XYZ` or just `docker compose up` (it pulls on demand) |
| `bind: address already in use` for port 7777 / 4321 / 11434 | Old Docker Desktop containers still bound to ports | Re-quit Docker Desktop fully: `pkill -f "Docker.app"` then verify with `lsof -i :7777` |
| Containers boot but performance is slow | Colima defaults to 2 CPU / 4 GB RAM | `colima stop && colima start --cpu 4 --memory 8` |
| Compose can't find `--platform linux/amd64` images | Colima defaults to native arch (ARM64 on Apple Silicon) | `colima start --arch x86_64` for an Intel-emulating VM, OR add `platform: linux/amd64` per service |

## Why Colima specifically

Per [`engines-compared.md`](engines-compared.md): Colima is free, open source, Apple-Silicon-native, doesn't require a sign-in, doesn't ship 1.5 GB of Electron, doesn't have the macOS Tahoe + Apple Silicon regressions that plague Docker Desktop 4.70.0. The trade-off is "no GUI" — and Dockyard fills that gap.

For a paid alternative with a polished native UI, OrbStack also works — same migration steps, just `brew install --cask orbstack && open -a OrbStack` instead.
