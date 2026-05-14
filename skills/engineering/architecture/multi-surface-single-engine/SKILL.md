---
name: multi-surface-single-engine
id: SK-0006
keywords: [route-surface, call-engine, adapt-output]
goal: One engine powers every surface — the logic is never duplicated across CLI, web, Shortcut, or launchd.
hash: 7dc96a6
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  One core engine — a shell script, AppleScript, API, or binary — wrapped by
  multiple UX surfaces that each reach different users: a web dashboard, a CLI
  command, a Shortcut, a menu-bar widget, a background agent, an SSH-safe
  headless mode. Each surface is a thin adapter. The engine never changes to
  accommodate a surface. Triggers on "multiple ways to run this", "add a CLI
  for this tool", "same tool as a Shortcut and a web UI", "don't duplicate
  the logic", "headless mode for CI", "menu bar and dashboard", "single
  source of truth for the cleanup logic".
---

# Multi-surface single-engine — one engine, many ways to reach it

The wrong design: build the web UI, then rebuild the logic again for the CLI, then rebuild it for the Shortcut. Three versions of the same logic that drift apart over time.

The right design: **one engine** with a thin adapter layer per surface. Each surface is ~20 lines. The engine is the only thing that ever changes when behavior changes.

## The DustPan surface map

```
dustpan.applescript  ← THE ENGINE
(AppleScript, ~250 lines, runs the actual cleanup + native macOS UI)
         │
         ├── bin/xcc            ← CLI adapter (bash wrapper, 50 lines)
         │   xcc --dry-run      ← sets DUSTPAN_DRY_RUN=1, calls osascript
         │
         ├── make run           ← Makefile adapter (1 line)
         │   @osascript $(SCRIPT)
         │
         ├── Shortcut           ← Shortcuts.app adapter
         │   "Run AppleScript"  ← single action, calls the engine
         │
         ├── launchd plist      ← Background agent adapter
         │   <key>ProgramArguments</key>
         │   <string>osascript</string>
         │   <string>/path/to/dustpan.applescript</string>
         │
         ├── SwiftBar plugin    ← Menu bar adapter (30-line shell script)
         │   calls xcc and displays the result as a menu item
         │
         └── web/server.py      ← Web dashboard (Python HTTP server)
             /api/run?category=xcode&action=clear-deriveddata
             → runs the same underlying shell commands as the engine
```

## The adapter contract

Every surface must honor:

1. **No logic in the adapter.** The adapter passes flags to the engine. It doesn't decide what to clean.
2. **Env vars are the protocol.** `DUSTPAN_DRY_RUN=1`, `DUSTPAN_FORCE=1`, `DUSTPAN_AUTO_CONFIRM=1`. The engine reads these. Surfaces set them.
3. **The engine owns the UI.** The AppleScript shows dialogs and progress bars. The CLI does not add its own output for things the engine already handles.
4. **New surface = new adapter, not new logic.** If you want a Stream Deck button, write a 10-line adapter. Don't copy-paste the cleanup logic.

## The CLI adapter pattern (bin/xcc)

```bash
#!/bin/bash
SCRIPT="$(dirname "${BASH_SOURCE[0]}")/../dustpan.applescript"

env_args=()
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run)  env_args+=("DUSTPAN_DRY_RUN=1");  shift ;;
    --force)    env_args+=("DUSTPAN_FORCE=1");     shift ;;
    --version)  grep 'property kVersion' "$SCRIPT" | awk -F'"' '{print "xcc " $2}'; exit 0 ;;
    *)          echo "Unknown flag: $1"; exit 1 ;;
  esac
done

exec env "${env_args[@]}" osascript "$SCRIPT"
```

The CLI is 50 lines of flag-parsing that passes control to the engine. Zero cleanup logic.

## The web surface pattern

The web dashboard doesn't call the AppleScript directly — it has its own server (`web/server.py`) that runs the same shell commands via `subprocess`. This is the correct separation: the web UI is a completely parallel surface to the AppleScript UI, sharing only the *what to clean* (from `cleaners.py`), not the *how to show it*.

```
cleaners.py          ← SECOND ENGINE (the "what" — categories + paths)
         │
         ├── AppleScript UI   ← surface: native macOS dialogs
         └── Web dashboard    ← surface: Vite + React, SSE streaming
```

Two engines? Yes — cleaners.py is the "what to clean" engine. `dustpan.applescript` is the "how to run it with native UI" engine. Both have multiple surfaces adapting to them.

## What this prevents

- ✅ CLI behavior matches web behavior — both read from `cleaners.py`
- ✅ Bug fix in the engine automatically fixes all surfaces
- ✅ New surface adds zero new logic to test
- ✅ The engine can be tested headlessly (`DUSTPAN_DRY_RUN=1 DUSTPAN_AUTO_CONFIRM=1 osascript dustpan.applescript`)

## Anti-patterns

- ❌ Copy-paste the cleanup logic from the web into the CLI "just for now"
- ❌ Surface-specific special cases in the engine ("if running from CLI, skip this check")
- ❌ Different cleanup paths for different surfaces — they'll drift
- ❌ The adapter does its own `rm -rf` instead of calling the engine

## Invocation

- "Use **multi-surface-single-engine**."
- "Add a CLI to this tool without duplicating the logic."
- "Design the surfaces for this tool."
- "Why doesn't the CLI share code with the web UI?"

## Reference implementation

DustPan — all six surfaces. `dustpan.applescript` is the engine. `bin/xcc` is the CLI adapter. `launchd/com.marvelousempire.dustpan.plist` is the background agent adapter. `swiftbar/dustpan.30m.sh` is the menu-bar adapter. `web/server.py` is the web surface with `cleaners.py` as its engine. All in [github.com/marvelousempire/dustpan](https://github.com/marvelousempire/xcode-cleanup-shortcut).
