---
name: applescript-native-ui
id: SK-0002
keywords: [write-applescript, show-dialog, send-notification]
goal: Deliver applescript native ui output correctly and completely.
hash: a9299ae
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  Author AppleScripts that use native macOS UI (display alert, display dialog,
  progress block, display notification, choose from list, set the clipboard)
  instead of Terminal output. Reference patterns, anti-patterns, sound matrix,
  icon tone matrix, the default-answer-selectable-text trick, the never-run-sudo
  boundary, and the belt-and-suspenders notification + alert pattern. Triggers
  on "write an AppleScript", "macOS automation script", "native Mac dialog",
  "AppleScript progress bar", "AppleScript notification", "display alert vs
  display dialog", "macOS one-tap action", "Mac Shortcut script", "make this
  feel like macOS not a dev tool".
---

# AppleScript native UI — author scripts that look like System Settings, not like Terminal

When the user asks for an AppleScript — for a Shortcut, a launchd agent, a SwiftBar plugin, a one-tap utility — every output must use **native macOS UI affordances**. No `echo` to Terminal, no streaming logs, no monospace command output in a black box. Use `display dialog`, `display alert`, `display notification`, the `progress` block, and `choose from list` — the same affordances Apple uses in System Settings.

The user will feel the difference immediately. macOS-native scripts feel like the OS; dev-style scripts feel out of place even when they work.

## When to use this skill

- The user says "write an AppleScript for X"
- The user wants a one-tap action (Shortcut binding, SwiftBar plugin, Stream Deck, Touch Bar, hotkey)
- The user wants a macOS-native dialog for a confirmation, picker, progress display, or completion notice
- The user is converting a shell script with `echo`/`read` to something more polished
- The user asks specifically about `display alert` vs `display dialog`, `progress` blocks, `display notification` sounds, `choose from list`, or `set the clipboard to`
- The user mentions DustPan — the reference implementation library lives at [marvelousempire/dustpan/applescripts/](https://github.com/marvelousempire/dustpan/tree/main/applescripts)

## The pattern table — what to use when

| User intent | Use | Don't use |
|---|---|---|
| "Are you sure?" before a destructive action | `display alert "..." buttons {"Cancel", "Run"} default button "Run" cancel button "Cancel" as warning` | `echo "y/n?" && read` |
| Long-running operation with phases | `progress total steps to N` + per-phase `progress additional description` | `echo "Phase 1…"`, `echo "Phase 2…"` to Terminal |
| Show completion result | `display notification "..." with title "..." sound name "Glass"` | `echo "✓ Done."` |
| Pick from a list of runtime options | `choose from list {…} with prompt "..." OK button name "..."` | `echo "1) … 2) … 3) …"` + `read` |
| Free-form text input | `display dialog "..." default answer ""` | `read -p "..." var` |
| Show a multi-line command to copy | `display dialog "..." default answer cmdString buttons {"Done","Copy to Clipboard"}` (default answer is selectable!) | `echo` the command and hope the user copies it manually |
| Put something on the user's clipboard | `set the clipboard to "..."` + `display notification "Copied"` | Print to Terminal and tell them to copy it |
| Need sudo to do something | **Show the command via `display dialog` with a Copy button.** Never `do shell script ... with administrator privileges`. | Bypass the macOS password prompt — that's the consent gate for irreversible operations |

## The four canonical patterns

### 1. Confirmation alert

```applescript
set confirmResult to display alert "Clean Xcode caches?" ¬
    message "About to delete:" & return & ¬
        "  • ~/Library/Developer/Xcode/DerivedData/*" & return & ¬
        "  • ~/Library/Caches/com.apple.dt.Xcode/*" & return & return & ¬
        "Cost: one slightly slower Xcode build the next time you build." ¬
    buttons {"Cancel", "Clean caches"} ¬
    default button "Clean caches" ¬
    cancel button "Cancel" ¬
    as warning

if button returned of confirmResult is "Cancel" then return
```

**Icon tone matrix:**
- `as critical` — red ⨯ icon. Irreversible / dangerous. Reformat drive. Delete account.
- `as warning` — yellow ⚠ icon. Significant but recoverable. Cache clears. Resets.
- (omit `as` clause) — blue ℹ icon. Informational results.

**Button tone:** verbs, not yes/no. `{"Cancel", "Clean caches"}` not `{"No", "Yes"}`. The user should know what they're agreeing to from the button label alone.

### 2. Progress block (determinate)

```applescript
set progress total steps to 5
set progress completed steps to 0
set progress description to "DustPan Cleanup"
set progress additional description to "Starting…"

-- Phase 1
set progress additional description to "① Clearing DerivedData…"
do shell script "rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null; true"
set progress completed steps to 1

-- Phase 2
set progress additional description to "② Clearing iOS DeviceSupport…"
do shell script "rm -rf ~/Library/Developer/Xcode/'iOS DeviceSupport'/* 2>/dev/null; true"
set progress completed steps to 2

-- … etc up to total steps
```

**Indeterminate variant** (when you can't predict step count):

```applescript
set progress total steps to -1   -- "-1" = marching ants
set progress description to "Scanning…"
set progress additional description to "Walking the filesystem"

do shell script "long-running-thing"
```

**Critical rules:**

1. Always set `progress description` **before** the first shell call (otherwise the first phase shows a generic "Running script" header).
2. Update `progress additional description` **before** the operation, not after. The user wants to see "Clearing X…" while X is happening.
3. Don't fake slowness with `delay`. If a phase finishes in 50ms, let the bar jump.
4. `total steps = -1` overrides `completed steps`. Indeterminate is indeterminate.

### 3. Completion notification

```applescript
display notification "Freed 6.4 GB of disk space." ¬
    with title "DustPan" ¬
    subtitle "Quick Rescue complete" ¬
    sound name "Glass"
```

**Sound name matrix** (system sounds live at `/System/Library/Sounds/`):

| Sound | Use for |
|---|---|
| `"Glass"` | ✅ Success / completion. The most pleasing sound — reserve for happy outcomes. |
| `"Funk"` | ℹ Informational / neutral. "Fine, here's the info." |
| `"Pop"` | Quick acknowledgment for short toasts. |
| `"Hero"` | Major accomplishment. Use sparingly. |
| `"Submarine"` | "Your action is needed." Earnest. |
| (omit `sound name`) | Silent. Use for chatty / repeating events. |

**Belt-and-suspenders pattern** (when the result matters): notification AND alert. Notifications can be silently swallowed by Do Not Disturb or denied notification permission. The alert is your guaranteed-render fallback.

```applescript
display notification "Freed 6.4 GB" with title "DustPan" sound name "Glass"

display alert "✅ Cleanup complete" ¬
    message "Freed 6.4 GB. You now have 13.5 GB free on /." ¬
    buttons {"Done"} default button "Done"
```

### 4. Clipboard copy with feedback

```applescript
set commandToShow to "sudo chown -R $(whoami) /opt/homebrew"

set userChoice to display dialog "Run this in Terminal:" ¬
    with title "DustPan — Takeover command" ¬
    default answer commandToShow ¬
    buttons {"Done", "Copy to Clipboard", "Open Terminal"} ¬
    default button "Copy to Clipboard"

if button returned of userChoice is "Copy to Clipboard" then
    set the clipboard to commandToShow
    display notification "✓ Copied — paste with ⌘V in Terminal" ¬
        with title "DustPan" sound name "Glass"
else if button returned of userChoice is "Open Terminal" then
    set the clipboard to commandToShow
    tell application "Terminal" to activate
end if
```

**The `default answer` trick** is the key: plain `display dialog` text is *not selectable*. Putting the string into `default answer` renders it as a text field, which **is** selectable and copyable. Just don't read `text returned` if you only intended to display.

## The hard rules — never break these

1. **No `echo` to Terminal.** Every output the user sees must be a native macOS UI element.
2. **No `do shell script "..." with administrator privileges`.** Don't ask for sudo from a script. macOS's own password prompt is the correct consent gate for irreversible operations (ownership transfers, system file modifications, etc.). Show the command via `display dialog` with a Copy button and let the user paste into Terminal.
3. **Always include `on run` and proper exit feedback.** Either a `display alert` or a `display notification` — the user should never be left wondering "did it finish?"
4. **Quote shell arguments correctly.** Use `quoted form of pathString` whenever a path is interpolated into `do shell script`. AppleScript provides this — use it.
5. **Catch user cancellation cleanly.** `display alert ... cancel button "Cancel"` throws error `-128` on Esc / Cancel. Catch with `try ... on error number -128`.

## What the user actually sees

Done right, an AppleScript looks like this from the user's perspective:

```
   ┌─────────────────────────────────────┐
   │  ⚠   DustPan Cleanup                │
   │                                       │
   │  About to delete:                    │
   │    • Xcode DerivedData               │
   │    • iOS DeviceSupport               │
   │                                       │
   │  Cost: one slower Xcode build.       │
   │                                       │
   │           [ Cancel ]  [ Run ]        │
   └─────────────────────────────────────┘
                    ↓ click Run
   ┌─────────────────────────────────────┐
   │  DustPan Cleanup                    │
   │  ② Clearing iOS DeviceSupport…      │
   │  ▓▓▓▓▓▓▓▓░░░░░░░░░░  40%  [ Stop ]  │
   └─────────────────────────────────────┘
                    ↓ phases run
   🔔  DustPan  •  Quick Rescue complete
       Freed 6.4 GB of disk space.
```

System Settings vibes, not Terminal vibes.

## Reference implementation

The canonical reference library lives in DustPan's repo:

- **[applescripts/README.md](https://github.com/marvelousempire/dustpan/blob/main/applescripts/README.md)** — library index, philosophy, add-new template
- **[applescripts/snippets/native-confirmation.md](https://github.com/marvelousempire/dustpan/blob/main/applescripts/snippets/native-confirmation.md)** — confirmation alert in isolation with tone matrix
- **[applescripts/snippets/native-progress-bar.md](https://github.com/marvelousempire/dustpan/blob/main/applescripts/snippets/native-progress-bar.md)** — determinate + indeterminate progress
- **[applescripts/snippets/native-notification.md](https://github.com/marvelousempire/dustpan/blob/main/applescripts/snippets/native-notification.md)** — notification with sound matrix
- **[applescripts/snippets/native-clipboard-copy.md](https://github.com/marvelousempire/dustpan/blob/main/applescripts/snippets/native-clipboard-copy.md)** — clipboard with Open Terminal pattern

Three production scripts using these patterns end-to-end:

- **[show-disk-status.applescript](https://github.com/marvelousempire/dustpan/blob/main/applescripts/show-disk-status.applescript)** — native dialog with live disk stats, three-button flow with launching sub-scripts
- **[quick-rescue.applescript](https://github.com/marvelousempire/dustpan/blob/main/applescripts/quick-rescue.applescript)** — 5-phase determinate progress + belt-and-suspenders notification + alert
- **[show-locked-space.applescript](https://github.com/marvelousempire/dustpan/blob/main/applescripts/show-locked-space.applescript)** — `choose from list` picker + `default answer` selectable command + Copy to Clipboard / Open Terminal buttons + the never-run-sudo boundary

## Author workflow

When asked to write a new AppleScript:

1. **Identify the moment** — what user pain triggered this? Capture it for the doc.
2. **Pick the patterns** — confirmation alert? Progress block? Notification? Clipboard?
3. **Start from a snippet** — copy the pattern from `applescripts/snippets/native-*.md` rather than recall from memory.
4. **Add fail-safes** — if invoking another script, wrap in `try ... on error`. If `do shell script` runs anything destructive, follow with verification.
5. **Test `osacompile`** — every `.applescript` must compile cleanly. `osacompile -o /tmp/check.scpt foo.applescript` should produce no warnings.
6. **Write the doc alongside** — use the DustPan library template (What it does / The moment that prompted it / Native macOS UI patterns used / Full script / How to invoke / Variations / Related).

## Invoke

- "Use **applescript-native-ui**."
- "Write an AppleScript that does X — make it macOS-native, not dev-style."
- "Follow the DustPan AppleScript library conventions for this script."
