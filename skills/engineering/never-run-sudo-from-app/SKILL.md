---
name: never-run-sudo-from-app
id: SK-0029
keywords: [show-command, copy-command, open-terminal]
goal: No app ever asks for a Mac password — the OS password prompt is always the consent gate.
hash: 774b137
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  Security + UX boundary — when a tool needs elevated privileges (sudo,
  ownership transfer, system file modification, password unlock), it MUST NOT
  prompt for the user's password itself or use `with administrator privileges`.
  Instead: show the exact command via native dialog with a Copy button. The OS
  password prompt in Terminal is the correct consent gate for irreversible
  operations. Triggers on "sudo from app", "needs admin privileges", "chown
  recovery", "permission error", "ownership transfer", "irreversible
  operation", "macOS password prompt", "with administrator privileges",
  "elevation boundary", "consent gate for permanent change".
---

# Never run sudo from the app — show the command, let macOS prompt

The boundary: **third-party apps must not be the surface that asks for your Mac password for irreversible operations.** That prompt belongs to macOS itself, not to a tool you downloaded — even one you trust.

So when your tool needs `sudo chown -R $(whoami) /opt/homebrew` or `sudo rm -rf /Users/oldperson`, it:

1. **Discovers** the need (e.g. by scanning ownership UIDs)
2. **Measures** the consequence (size, owner, account-still-exists status)
3. **Surfaces the exact command** in a native dialog with a Copy button
4. **Opens Terminal** with the command pre-copied
5. **Stays out of the sudo prompt itself**

The user pastes ⌘V, hits ⏎, macOS prompts for their Mac password directly. The tool was the discovery + the copy-paste assistant, not the executor.

## When to use this skill

- Building any macOS tool that touches ownership transfer, system files, or other ops requiring sudo
- The user asks "why doesn't it just run sudo for me?" (give them this answer)
- Designing recovery flows for shared/migrated Macs where `/opt/homebrew` or `/Users/<oldname>/` is owned by a previous user
- Auditing a tool that uses `do shell script "..." with administrator privileges` or similar
- The user says "make this safer" and the tool currently bypasses the OS password prompt

## Why this matters

**Irreversible operations need the strongest consent gate available.** macOS's own password prompt is that gate. Specifically:

1. **It can't be tricked.** Users recognize it. Phishing it requires kernel-level malware.
2. **It's the user's mental model.** Every sudo command they've ever seen ended at this prompt.
3. **It's auditable.** macOS logs it. Third-party apps' attempts to prompt are not.
4. **It's the right place to ask.** The OS is the one doing the privileged operation, not your app. The OS should ask.

**Third-party password prompts are a security smell.** They train users to type their Mac password into arbitrary GUI dialogs. Even when implemented honestly, they normalize a bad pattern.

## The pattern (AppleScript example)

```applescript
set commandToShow to "sudo chown -R $(whoami) /opt/homebrew"

set userChoice to display dialog "Run this in Terminal:" ¬
    with title "Takeover command" ¬
    default answer commandToShow ¬   -- `default answer` makes the text selectable!
    buttons {"Done", "Copy to Clipboard", "Open Terminal"} ¬
    default button "Copy to Clipboard"

if button returned of userChoice is "Copy to Clipboard" then
    set the clipboard to commandToShow
    display notification "✓ Copied — paste with ⌘V in Terminal" ¬
        with title "Your-App" sound name "Glass"
else if button returned of userChoice is "Open Terminal" then
    set the clipboard to commandToShow
    tell application "Terminal" to activate
end if
```

Two affordances stacked: **Copy** (just to clipboard) and **Open Terminal** (clipboard + activate Terminal.app so the user can paste with one keystroke). Neither one runs sudo.

## What to NEVER do

```applescript
-- ❌ Bypasses the macOS password prompt that protects irreversible operations.
do shell script "sudo chown -R $(whoami) /opt/homebrew" with administrator privileges

-- ❌ Same issue, different framing.
osascript -e 'do shell script "sudo …" with administrator privileges'

-- ❌ Even worse — bundling sudo with a custom GUI password prompt.
[some Electron-style dialog asking "Enter your Mac password to continue"]
```

If your tool has any of these, refactor to the show-and-copy pattern.

## The narrow case where this rule has nuance

If your tool is the **installer** (i.e. you ARE the OS-level component), `with administrator privileges` may be legitimate for a one-time installation step. But for **ongoing operations**, the rule stands. DustPan installs as a user-space tool and does no sudo at runtime; an installer that runs once with admin privileges to put a launchd plist into `/Library/LaunchDaemons/` is a different category.

## Discovery + measurement, before the copy

A great show-and-copy flow does more than display a string. It:

1. **Discovers** the need with scoped read access (in DustPan: `stat -f '%Su'` per candidate root, `du -sh` for size)
2. **Cross-references** for severity (e.g. `dscl . list /Users` to check if the owner account still exists — a deleted owner means `sudo rm -rf` deletes orphaned data with no recovery path)
3. **Picks an interactive UI** for findings (`choose from list` for the candidates, `display dialog default answer` for the resulting command)
4. **Distinguishes options** when there are multiple (delete OR chown for old user homes)

The user gets a curated, contextual recommendation. The sudo step is still theirs to run.

## Invocation

- "Use **never-run-sudo-from-app**."
- "I need elevated privileges from this tool — what's the right pattern?"
- "Audit this AppleScript for `with administrator privileges` violations."
- "Build the ownership-takeover flow for this Mac cleanup tool."

## Reference implementation

DustPan v0.24 + v0.26. The foreign-ownership recovery feature is the canonical example:
- Backend discovery: [`discover_foreign_ownership` in `web/server.py`](https://github.com/marvelousempire/dustpan/blob/main/web/server.py)
- Native AppleScript surface: [`applescripts/show-locked-space.applescript`](https://github.com/marvelousempire/dustpan/blob/main/applescripts/show-locked-space.applescript) (`dscl` cross-reference, `choose from list`, Copy + Open Terminal buttons, never runs sudo)
- Marketing rationale: [`docs/marketing/locked-space-recovery.md`](https://github.com/marvelousempire/dustpan/blob/main/docs/marketing/locked-space-recovery.md) (the boundary discussion at length)

Pairs with: `applescript-native-ui` (for the native-UI affordances this skill assumes), `sandboxed-filesystem-peek` (for the discovery layer).
