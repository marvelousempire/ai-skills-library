# Docker engines compared — Colima vs OrbStack vs Docker Desktop

Decision matrix for which Docker engine to run under Dockyard + the ai-skills-library stacks on Apple Silicon (M1/M2/M3/M4) macOS Tahoe (26.x). All three expose a Unix Docker socket; Dockyard's `socket=auto` finds any of them. The library's stacks work identically on all three.

## TL;DR

| | **Colima** | **OrbStack** | **Docker Desktop** |
|---|---|---|---|
| License | Open source (Apache 2.0) | Closed source, paid | Closed source, paid (free for hobby) |
| Cost | $0 | $8/mo personal · $16/mo per dev | $0 hobby · $5/mo individual · $9/mo business |
| Apple Silicon native | ✓ | ✓ | ✓ (via VM) |
| GUI | none (Dockyard fills this) | yes, polished | yes, but bloated |
| Resource overhead | minimal | minimal | high (1.5 GB Electron + VM bloat) |
| VM image bloat | none observed | none observed | 228 GB seen in production |
| macOS Tahoe stability | excellent | excellent | **broken — repeated startup failures (May 2026)** |
| Survives sleep | yes | yes | mostly, but sometimes hangs |
| Sign-in required | no | optional account | yes (since 2022) |
| `docker compose` parity | 100% | 100% | 100% |
| Plugin compat | works without plugins | works without plugins | sometimes stale plugins block CLI |

**Recommendation per the library**: **Colima** as the default. **OrbStack** if you want a paid native UI alongside Dockyard. **Docker Desktop** if you're already invested and the May 2026 reliability problems haven't hit you.

## Why this decision matters

The user hit a hard Docker Desktop failure during the build of this library — `docker compose build` hung indefinitely, the daemon stopped responding, and `docker info` blocked for 30+ seconds before returning a 503. This is the exact pattern that motivated [Dockyard's existence](https://github.com/marvelousempire/claude-chat-reader/blob/main/dockyard/PRD.md): Docker Desktop 4.70.0 on macOS Tahoe + Apple Silicon has compatibility regressions that no amount of workaround fixes.

Colima ships the same `dockerd` underneath, on a different VM substrate that doesn't have this failure mode.

## Decision tree

```text
   Are you on Apple Silicon + macOS Tahoe?
   ├─ NO → any of the three works; pick by preference.
   └─ YES → are you running Docker Desktop 4.70.0?
            ├─ NO  → you're probably fine; keep what you have, install Dockyard.
            └─ YES → migrate to Colima today.
                     See references/switching-from-docker-desktop.md.
```

## Detail per engine

### Colima — recommended default

```sh
brew install colima docker docker-compose docker-buildx
colima start --cpu 4 --memory 8 --disk 60
```

What you get:
- A lightweight Lima-based VM running `dockerd`.
- The exact same `/var/run/docker.sock` API every `docker` command expects.
- `docker compose up`, `docker logs`, `docker exec` — all identical.
- Native ARM64 perf (no Rosetta needed for ARM images).
- Free, open source, MIT licensed dependencies.

What you lose:
- No GUI. (Dockyard fills the gap.)
- No one-click "reset Docker" button. Use `colima stop && colima delete && colima start`.
- No Docker Hub integration in the menu bar.

When to NOT pick Colima:
- You rely on `docker.dockerHost` integrations specific to Docker Desktop (rare).
- You actively use Docker Desktop's GUI to inspect containers (Dockyard replaces this).

### OrbStack — paid native alternative

```sh
brew install --cask orbstack
open -a OrbStack
```

What you get:
- A polished native macOS daemon UI (file browser, log viewer, debug tools).
- Excellent performance (faster cold start than Colima or Docker Desktop on most workloads).
- Built-in Linux machine support if you also want a real Linux VM.
- Same `/var/run/docker.sock` for `docker` CLI compatibility.

What you lose:
- Money. $8/mo personal, $16/mo business per developer.
- Closed source.

When to pick OrbStack:
- You want a polished native UI and don't mind the subscription.
- You also want Linux machines (`orb create linux-default`).
- Cold-start time matters more than the cost.

OrbStack + Dockyard is genuinely great — you get OrbStack's native daemon UI for "the engine itself" and Dockyard for "my containers and Compose projects."

### Docker Desktop — legacy

```sh
open -a Docker
```

Status as of May 2026 on Apple Silicon + macOS Tahoe: **regression-prone**.

If you must use it, mitigations:
- Quit and reopen if `docker info` hangs.
- Periodically clear the VM with Preferences → Troubleshoot → Reset.
- Avoid the `docker-ai` CLI plugin (caused independent hangs).
- Keep an eye on disk: `Docker.raw` quietly grows to 100+ GB.

Why we keep it on the supported list:
- It still works on Intel Macs, Linux, and earlier macOS versions.
- Some corporate environments mandate it.
- Dockyard's `socket=auto` falls through to `/var/run/docker.sock` so it works either way.

## Migration

Switching engines does NOT change anything about how the ai-skills-library stacks run — the compose files, Dockerfiles, Makefiles all behave identically. The only thing that changes is the startup command (`colima start` vs `open -a OrbStack` vs `open -a Docker`).

For an explicit Docker Desktop → Colima migration with no data loss, see [`switching-from-docker-desktop.md`](switching-from-docker-desktop.md).

## How Dockyard renders the engine

Dockyard's `system_info` MCP tool + the `/api/config` HTTP endpoint both expose which socket Dockyard is currently talking to. The Homelab Console reads this and shows it as a badge in the footer:

```text
   engine: ● colima  (v0.7.0)
```

If the engine changes (e.g. you stop Colima and start OrbStack), the badge updates within one console poll cycle (default 15 s).
