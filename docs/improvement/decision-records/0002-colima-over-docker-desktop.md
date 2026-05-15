# 0002 — Use Colima (not Docker Desktop) as docker runtime on macOS Tahoe + Apple Silicon

**Date:** 2026-05-14
**Status:** Accepted
**Context:** brokerage-prototype session — Docker Desktop wedged into unstartable state mid-build

## Decision

On macOS Tahoe (26.x) + Apple Silicon, default to Colima + lima as the docker runtime. Install native arm64 binaries direct from upstream releases to `~/.local/bin/` rather than via Homebrew. Docker CLI + buildx works unchanged; just switch context (`docker context use colima`).

## Rationale

- **Docker Desktop wedges** on macOS Tahoe + Apple Silicon. Socket exists, processes run, but `/_ping` hangs and `docker desktop restart` returns "context deadline exceeded." Multiple `pkill` attempts denied by sandbox.
- **Colima is native Apple Silicon.** No Electron VM, no sign-in prompt, ~78 MB final container vs Docker Desktop's ~1.5 GB install.
- **Same docker socket.** All `docker` and `docker compose` commands work unchanged — only `docker context use colima` needed.
- **Dockyard sees Colima** transparently via its socket-pinning config. UI works.

## When to use Docker Desktop instead

- Revisit once Docker Desktop is no longer wedging on macOS Tahoe (track Docker's release notes)
- If you specifically need Docker Desktop's GUI file-mount integration or Settings → Resources tuning
- On Intel Macs / Linux where Docker Desktop's pain is different

## Install gotchas captured

- **Two Homebrews coexist on dual-arch Macs.** `/usr/local/bin/brew` (x86) vs `/opt/homebrew/bin/brew` (arm64). `which brew` decides which one runs. x86 brew installs x86 binaries that won't run lima on Apple Silicon. (See `docs/pain-journal/2026-05-14-dual-homebrew-arch-mismatch.md`.)
- **arm64 brew can be broken in unrelated ways**: not writable (`sudo chown`), or unknown macOS version. Don't try to fix both ailments inside a 5-minute swap — fall through to direct binary install.
- **`timeout` is GNU coreutils, not in stock macOS.** Polling loops with `until timeout 2 docker info; do ...` silently fail forever. (See `docs/pain-journal/2026-05-14-stock-macos-missing-timeout.md`.)

## Reference implementation

`skills/project/brokerage-prototype/colima-docker-swap/SKILL.md` + brokerage-prototype's [README "Runtime: Colima, not Docker Desktop" section](https://github.com/marvelousempire/brokerage-prototype/blob/main/README.md#runtime-colima-not-docker-desktop).
