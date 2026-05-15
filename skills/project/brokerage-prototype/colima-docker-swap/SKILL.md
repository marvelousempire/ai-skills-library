---
name: colima-docker-swap
description: >-
  Detect a wedged Docker Desktop on macOS Tahoe + Apple Silicon and swap in
  Colima as the docker runtime — native arm64, same docker socket, no
  Electron VM. Installs colima + lima as direct binaries to `~/.local/bin/`
  (no brew, no sudo) when Homebrew is broken. Pairs with Dockyard for the
  UI. Use when `docker info` hangs, Docker Desktop won't start, or the user
  says "Docker is broken / I don't see anything in Docker."
trigger: >-
  Use when (a) `docker info` hangs on macOS, (b) `docker desktop restart`
  returns "context deadline exceeded", (c) socket exists at
  `~/.docker/run/docker.sock` but `/_ping` returns 500 or hangs, or (d) the
  user says Docker is broken / not showing containers / unable to start.
  Diagnose first (5-second probe), don't kill Docker Desktop processes.
---

# /colima-docker-swap

## What this skill does

1. **5-second diagnostic** to confirm the wedged-Docker-Desktop signature:
   ```bash
   ls -la ~/.docker/run/docker.sock
   (echo "GET /_ping HTTP/1.0"; echo "") | nc -U -w 2 ~/.docker/run/docker.sock
   docker info --format '{{.ServerVersion}}'   # without `timeout`; hangs if wedged
   ```
2. **Install Colima + lima as direct arm64 binaries** to `~/.local/bin/` — bypasses brew (handles both x86 `/usr/local` brew producing wrong arch + arm64 `/opt/homebrew` brew that doesn't recognize the OS)
3. **Start Colima** with sensible defaults: `colima start --cpu 4 --memory 4 --disk 60`
4. **Switch docker context** to `colima` so subsequent commands use the new socket
5. **Pair with Dockyard** for the UI: pin `dockyard.config.json`'s `socket` to `/Users/<you>/.colima/default/docker.sock`, then `python3 server.py`
6. **Update the consuming project's README + STACK.md** to document the swap (Colima runtime row + Dockyard UI row)

## How to invoke

```
/colima-docker-swap
```

Or naturally:

> "Docker is broken — I don't see anything in Docker."

## Inputs / outputs

- **Inputs:** macOS host + Apple Silicon + wedged Docker Desktop (or any docker-runtime gap)
- **Outputs:** Colima installed + running + context active; Dockyard UI optionally up; README/STACK.md updated

## Anti-patterns this skill blocks

- Killing Docker Desktop processes (sandbox refuses; not a recovery path)
- Trying to fix Homebrew's arm64 install before installing colima (direct binary is faster)
- Using `timeout` in polling loops (not in stock macOS)
- Trusting `docker desktop restart` exit code (returns 0 on failure)

## When NOT to use this skill

- Linux or Intel Mac — Docker Desktop's pain is different there
- Production deploy planning (Colima is dev-environment, not orchestration)
- Docker Desktop is already healthy — no need to swap

## Related

- Decision: [`docs/improvement/decision-records/0002-colima-over-docker-desktop.md`](../../../docs/improvement/decision-records/0002-colima-over-docker-desktop.md)
- Pain: [`docs/pain-journal/2026-05-14-dual-homebrew-arch-mismatch.md`](../../../docs/pain-journal/2026-05-14-dual-homebrew-arch-mismatch.md)
- Pain: [`docs/pain-journal/2026-05-14-stock-macos-missing-timeout.md`](../../../docs/pain-journal/2026-05-14-stock-macos-missing-timeout.md)
- Pain: [`docs/pain-journal/2026-05-14-launchctl-bootstrap-io-error.md`](../../../docs/pain-journal/2026-05-14-launchctl-bootstrap-io-error.md)
- Pain: [`docs/pain-journal/2026-05-14-colima-status-on-stderr.md`](../../../docs/pain-journal/2026-05-14-colima-status-on-stderr.md)
- Playbook: [`docs/playbooks/wedged-docker-recovery.md`](../../../docs/playbooks/wedged-docker-recovery.md)

## Origin

Built 2026-05-14 in `marvelousempire/brokerage-prototype` during the first live `make docker-up`. Docker Desktop wedged on macOS 26.3.1 + Apple Silicon; pivoted to Colima via the user's `claude-chat-reader/dockyard` repo's `make doctor` pointing the way. Native binaries chosen after `/usr/local/bin/brew` installed x86 binaries that couldn't run lima.

## Reference install script

```bash
#!/usr/bin/env bash
set -euo pipefail
LOCAL_BIN="$HOME/.local/bin"
LIMA_DIR="$HOME/.local/lima"
mkdir -p "$LOCAL_BIN" "$LIMA_DIR"

COLIMA_VER="${COLIMA_VER:-v0.10.1}"
LIMA_VER="${LIMA_VER:-v2.1.1}"
LIMA_TARBALL_VER="${LIMA_VER#v}"

curl -sSL -o "$LOCAL_BIN/colima" \
  "https://github.com/abiosoft/colima/releases/download/$COLIMA_VER/colima-Darwin-arm64"
chmod +x "$LOCAL_BIN/colima"

curl -sSL "https://github.com/lima-vm/lima/releases/download/$LIMA_VER/lima-$LIMA_TARBALL_VER-Darwin-arm64.tar.gz" \
  | tar -xz -C "$LIMA_DIR"
for b in limactl nerdctl.lima; do
  [ -f "$LIMA_DIR/bin/$b" ] && ln -sf "$LIMA_DIR/bin/$b" "$LOCAL_BIN/$b"
done

file "$LOCAL_BIN/colima" "$LOCAL_BIN/limactl"   # verify arm64
echo "✓ installed; start: colima start --cpu 4 --memory 4 --disk 60"
```
