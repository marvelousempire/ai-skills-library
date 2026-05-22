---
name: apple-native-scripting-preference
id: RL-0064
keywords: [enforce-scripts, check-applescript, build-automation, power-user-apple]
goal: When automating a sophisticated power-user task on an Apple host, reach for Apple-native scripting (AppleScript / osascript / shortcuts / launchctl / shell + defaults) instead of click-paths or hand-instruction whenever the action is reproducible.
hash: pending
relations: [contracts-and-prudence, ask-when-blocked, operator-control-tower-mindset]
before: []
governed_by: [global]
meta: dynamic
---

# Apple-native scripting preference — script the power-user move

## The verbatim source (stated by Avery 2026-05-22)

> scripts when necessary and when possible and when most preferred to run
> the easiest, most prolific, and sophisticated power user type of things
> on an Apple.

## The rule

When the next action is a sophisticated macOS operator task — opening
specific apps with specific tabs, toggling system settings, talking to
the menubar, watching a folder, building a Spotlight-class index,
scheduling a recurring agent, sending a notification, manipulating a
window, controlling iTerm/Terminal, driving Finder, signing into a
service, mounting a volume, etc. — **prefer an Apple-native scripted
form** over any of:

- A manual click-path instruction ("open System Settings → … → toggle X")
- A long English description of what to do
- A third-party CLI tool when a stdlib Apple-native one exists
- A Python wrapper around a shell call when AppleScript would express it
  in one line

### The Apple-native toolbox (in order of preference)

| Tool | Use for |
|------|---------|
| **`osascript -e '…'`** / **`.applescript`** files | Driving GUI apps (Mail, Calendar, Notes, Finder, Music, Photos), reading/writing app state via the Scripting Dictionary, opening specific URLs/files |
| **`osascript -l JavaScript`** (JXA) | When a task needs a real expression language but still wants Scripting Bridge — JS over AppleScript for non-trivial logic |
| **`shortcuts run "<Name>"`** | Triggering an operator-authored Shortcuts.app workflow (best for cross-app multi-step automations the operator has already wired) |
| **`defaults read` / `defaults write`** | Plist-backed settings (hidden prefs, dev menus, Finder behavior, screenshot location) — reversible, idempotent |
| **`launchctl` + `~/Library/LaunchAgents/*.plist`** | Scheduling, background daemons, "do this every hour" — never `cron` on a Mac |
| **`brew` / `mas` (Mac App Store CLI)** | Software install — reproducible, scriptable, beats the operator clicking "Get" |
| **`open -a <App> [path]`** / **`open -na <App>`** | Launching an app pointed at a file/folder/URL. `-n` for a new instance |
| **`pmset` / `caffeinate`** | Power management — sleep, wake, prevent sleep during a long task |
| **`networksetup`** | Wi-Fi / network configuration scripting |
| **`mdfind`** / **`mdls`** | Spotlight metadata queries — `mdfind 'kMDItemAppStoreReceiptStatus == 1'` etc |
| **`tccutil`** | Reset TCC permissions for a specific bundle ID (with care) |
| **Shell + stdlib (`/bin/sh`, `/usr/bin/awk`, `/usr/bin/sed`, jq via brew)** | Glue, pipelines, JSON manipulation — when the answer isn't in a GUI app's scripting dictionary |

### When to write a script vs run a one-liner

- **One-shot, single-line action** → `osascript -e '…'` inline in the
  command. Don't write a file.
- **Multi-step, reusable, or wants comments** → write a `.applescript` or
  `.sh` file in the appropriate repo's `scripts/` directory, give it a
  shebang, `chmod +x`, and document it in the repo's `scripts/README.md`.
- **Operator-facing GUI workflow** → expose it through Shortcuts.app
  AND a CLI entry (`shortcuts run`), so both the GUI button and the agent
  can invoke it the same way.

## When this fires

- The next action is reproducible (will likely happen again)
- The action touches Mac-specific surfaces: System Settings, menubar
  apps, GUI app state, LaunchAgents, Shortcuts.app, defaults
- You're about to write a paste-block in chat that contains 3+ clickable
  steps — script it instead
- Reviewing a PR that adds operator-facing automation without a
  scripted form

## When this does NOT fire

- One-off interactive operator action that genuinely never repeats
- Cross-platform code that has to run on Linux + Windows (use POSIX shell
  or Python instead — Apple-native preference is for Apple-host work)
- Security-sensitive actions where the operator explicitly wants manual
  confirmation in System Settings each time (e.g. granting Full Disk
  Access — no, that's a manual click by design)

## Examples

### ✓ Compliant — open DustPan + Nephew CT in two tabs

```applescript
tell application "Google Chrome"
  activate
  set winRef to (make new window)
  tell winRef
    set URL of active tab to "http://localhost:5175/mcp"
    set newTab to make new tab at end of tabs with properties {URL:"http://localhost:5175/dustpan"}
  end tell
end tell
```

One file at `automata/scripts/open-control-tower.applescript`, invokable
via `osascript automata/scripts/open-control-tower.applescript` from a
LaunchAgent or a Shortcuts trigger.

### ✓ Compliant — schedule DustPan's daily growth scan

```xml
<!-- ~/Library/LaunchAgents/ai.yousirjuan.dustpan.daily-scan.plist -->
<plist version="1.0"><dict>
  <key>Label</key><string>ai.yousirjuan.dustpan.daily-scan</string>
  <key>ProgramArguments</key><array>
    <string>/usr/bin/curl</string>
    <string>-s</string>
    <string>http://127.0.0.1:8765/api/category/llm-caches/scan</string>
  </array>
  <key>StartCalendarInterval</key><dict>
    <key>Hour</key><integer>9</integer>
    <key>Minute</key><integer>30</integer>
  </dict>
</dict></plist>
```

Loaded once via `launchctl bootstrap gui/$UID ~/Library/LaunchAgents/…plist`,
runs every morning at 9:30 forever.

### ✗ Violation — "open System Settings → General → AirDrop & Handoff and toggle X"

Paste-block in chat with no scripted form. The operator runs this 5
times across machines and the agent never compounds the knowledge.

The compliant alternative is one line:

```sh
defaults write com.apple.coreservices.useractivityd ActivityAdvertisingAllowed -bool false
```

…wrapped in a `scripts/disable-handoff.sh`, documented in `scripts/README.md`,
with a reverse pair (`enable-handoff.sh`) that flips the same default to
`true`.

## Propagation

Per [`rule-propagation-discipline`](rule-propagation-discipline.md), this
rule lives in every operator-built repo and the AI Skills Library.

## Related

- **Sibling:** [`ask-when-blocked`](ask-when-blocked.md) — when you're
  about to write a paste-block, that rule says "ask"; this rule says "if
  you're already going to act, make the action a script the operator can
  re-run"
- **Philosophy:** [`contracts-and-prudence`](contracts-and-prudence.md) —
  scripts ARE the prudent form of "I'll do this again later"
- **Mindset:** [`operator-control-tower-mindset`](operator-control-tower-mindset.md) — node 4 (real shell execution: buttons must DO things; scripts ARE the buttons)
