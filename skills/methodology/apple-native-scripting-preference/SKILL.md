---
name: apple-native-scripting-preference
id: pending
keywords: [applescript, osascript, shortcuts-run, defaults-write, launchctl, mac-automation, power-user]
goal: When automating a sophisticated power-user task on an Apple host, reach for Apple-native scripting (AppleScript / osascript / shortcuts / launchctl / defaults / shell) before click-paths or hand-instruction.
hash: pending
relations: [contracts-and-prudence, ask-when-blocked]
before: []
governed_by: [global]
meta: dynamic
description: Triggers on "applescript", "osascript", "shortcuts run", "defaults write", "launchctl", "mac automation", "open System Settings → …", "schedule on Mac", "Apple-native scripting", or any prompt about sophisticated Apple host automation. Counterpart: any time you're about to write a paste-block of 3+ clickable steps on macOS — script it instead.
---

# apple-native-scripting-preference — methodology skill

When the next action is a sophisticated macOS operator task — opening
specific apps with specific tabs, toggling system settings, talking to
the menubar, watching a folder, scheduling a recurring agent, etc. —
prefer an Apple-native scripted form over a click-path instruction.

## When to use

Triggers: any prompt about Apple-host automation, scheduling, system
settings manipulation, GUI app driving, or any time you're about to
write a paste-block with 3+ clickable steps on macOS.

## The toolbox (in preference order)

| Tool | Use for |
|------|---------|
| `osascript -e '…'` / `.applescript` | Driving GUI apps (Mail, Calendar, Finder, etc.) |
| `osascript -l JavaScript` (JXA) | Non-trivial logic with Scripting Bridge |
| `shortcuts run "<Name>"` | Cross-app workflows the operator has authored |
| `defaults read` / `defaults write` | Plist-backed settings — reversible, idempotent |
| `launchctl` + `~/Library/LaunchAgents/*.plist` | Scheduling / background daemons (NEVER cron on Mac) |
| `brew` / `mas` | Software install — reproducible |
| `open -a <App> [path]` / `open -na` | Launch apps pointed at files/URLs |
| `pmset` / `caffeinate` | Power management |
| `networksetup` | Wi-Fi / network config |
| `mdfind` / `mdls` | Spotlight metadata queries |

## How

- **One-shot single line** → inline `osascript -e '…'`
- **Multi-step / reusable / commented** → `.applescript` or `.sh` file in
  the appropriate repo's `scripts/` dir + entry in `scripts/README.md`
- **Operator-facing GUI workflow** → expose through Shortcuts.app AND a
  CLI entry (`shortcuts run`) so button and agent invoke identically

## Why this exists

Codified from the 2026-05-22 Nephew Control Tower session. Operator's
verbatim trigger: "scripts when necessary and when possible and when most
preferred to run the easiest, most prolific, and sophisticated power user
type of things on an Apple."

Scripts compound across sessions. Click-paths don't. A reproducible
operator action that gets done as a script today is done with one
keystroke or one cron tick tomorrow.

## Pairing

- **Sister rule:** [ask-when-blocked] — that rule says "ask before
  punting to a paste-block." This skill says "if you're going to act,
  make the action a script the operator can re-run."
- **Mindset:** [operator-control-tower-mindset] — node 4 (real shell
  execution: buttons must DO things; scripts ARE the buttons)
- **Philosophy:** [contracts-and-prudence] — scripts are the prudent
  form of "I'll do this again later"

## Reference

- Rule body: `nephew/.claude/rules/apple-native-scripting-preference.md`
- Operator memory: `feedback_apple_native_scripting.md`
