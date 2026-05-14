# Playbook — Wedged Docker recovery (macOS Tahoe + Apple Silicon)

When `docker info` hangs or Docker Desktop won't start. ~5 minutes end-to-end.

## 0 · Confirm the signature (30 seconds)

```bash
ls -la ~/.docker/run/docker.sock                                              # socket exists
(echo "GET /_ping HTTP/1.0"; echo "") | nc -U -w 2 ~/.docker/run/docker.sock  # 500 / hang / 200
docker info --format '{{.ServerVersion}}'                                     # hangs if wedged
```

If socket exists + nc gets a response + `docker info` hangs → wedged Docker Desktop. Proceed.

**Do NOT:** `pkill Docker Desktop` (sandbox refuses + affects whole machine), `docker desktop restart` (returns "context deadline exceeded").

## 1 · Install Colima native arm64 (60 seconds)

Bypasses Homebrew (which has known issues on dual-arch Macs):

```bash
mkdir -p ~/.local/bin ~/.local/lima

curl -sSL -o ~/.local/bin/colima \
  https://github.com/abiosoft/colima/releases/latest/download/colima-Darwin-arm64
chmod +x ~/.local/bin/colima

curl -sSL https://github.com/lima-vm/lima/releases/latest/download/lima-2.1.1-Darwin-arm64.tar.gz \
  | tar -xz -C ~/.local/lima
ln -sf ~/.local/lima/bin/limactl ~/.local/bin/limactl

file ~/.local/bin/colima ~/.local/bin/limactl   # confirm arm64
```

## 2 · Start Colima (60-180 seconds first boot)

```bash
colima start --cpu 4 --memory 4 --disk 60   # add --verbose if it fails silently
docker context use colima
docker info --format '{{.ServerVersion}}'   # should return immediately
```

## 3 · Verify with a real build

```bash
cd <your project with a Dockerfile>
docker build -t test .
docker run --rm -p 8080:80 test &
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:8080/
```

## 4 · (Optional) Wire up Dockyard UI

```bash
cd ~/Developer/claude-chat-reader/dockyard
# Pin to Colima socket
python3 -c "import json; c=json.load(open('dockyard.config.json')); c['socket']='/Users/$USER/.colima/default/docker.sock'; json.dump(c, open('dockyard.config.json','w'), indent=2)"
python3 server.py &
open http://localhost:4321
```

## 5 · Cleanup if reverting to Docker Desktop later

```bash
colima stop
colima delete                       # destroys the VM
docker context use desktop-linux    # or `default`
# Docker Desktop will show its UI again when launched
```

## Common pitfalls (linked to pain journal)

- **`/usr/local/bin/brew install colima` produces x86 binaries** — [`pain-journal/2026-05-14-dual-homebrew-arch-mismatch.md`](../pain-journal/2026-05-14-dual-homebrew-arch-mismatch.md)
- **`colima start` produces no output** — re-run with `--verbose`
- **`docker info` hangs (not just first time)** — daemon's wedged again; `colima stop && colima start --verbose`
- **`make doctor` reports Colima not running while it is** — colima writes "running" to stderr ([`pain-journal/2026-05-14-colima-status-on-stderr.md`](../pain-journal/2026-05-14-colima-status-on-stderr.md))

## Related

- Skill: [`skills/project/brokerage-prototype/colima-docker-swap/SKILL.md`](../../skills/project/brokerage-prototype/colima-docker-swap/SKILL.md)
- DR: [`docs/improvement/decision-records/0002-colima-over-docker-desktop.md`](../improvement/decision-records/0002-colima-over-docker-desktop.md)
