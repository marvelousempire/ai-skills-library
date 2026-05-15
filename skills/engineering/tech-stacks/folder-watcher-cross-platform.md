# Tech stack — Cross-platform folder watcher (reference)

**Quarry:** Watch-folder thread (Mac Folder Actions, Linux inotify, **fswatch**)  
**Witness patterns:** claude-chat-reader watchers + automata `packages/watcher` scaffold

## Mac

| Tool | Use |
|------|-----|
| **fswatch** | `brew install fswatch` — same CLI on Mac and Linux |
| Folder Actions | Finder → folder → AppleScript/Automator (quarry examples only) |
| LaunchAgent | ccr `make install-launchd` for export ZIP path |

## Linux / VPS

| Tool | Use |
|------|-----|
| **fswatch** or **inotifywait** | Trigger on `CLOSE_WRITE` in upload dirs |
| **rsync** + **WireGuard** | automata `scripts/sync.sh`, `wireguard-peer.example.conf` |

## Product wiring

| Repo | Witness |
|------|---------|
| claude-chat-reader | `pnpm watch`, harvest debounce (Plan 0017) |
| automata | `@automata/watcher` package scaffold — backlog for generic file→slice |

## Grok gap

Chat described virus-scan / resize pipelines on VPS — **not shipped** in v1; see automata `docs/WATCH-FOLDER-QUARRY.md` backlog.
