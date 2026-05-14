# [App Name]
**managed by the duty and order of AVERY GOODMAN**

> [Tagline — one sentence, present tense. What this does right now.]

<p>
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-22b573?style=flat-square">
  <img alt="Platform" src="https://img.shields.io/badge/platform-macOS%2014%2B-94a3b8?style=flat-square">
  <img alt="No telemetry" src="https://img.shields.io/badge/no%20telemetry-✓-22b573?style=flat-square">
  <img alt="Latest release" src="https://img.shields.io/github/v/release/[org]/[repo]?color=8b5cf6&style=flat-square">
</p>

---

## IDENTITY

[App Name], by AVERY GOODMAN.

[2–3 sentences. What this is. Who uses it. What makes it different from everything else.]
[Smart friend in 10 seconds. No jargon.]

---

## PURPOSE

[Name the specific pain. Not "it helps with X" — name the actual moment that makes someone need this.]

[Example from DustPan:]
> Xcode's caches grow to 20 GB silently and stay there. Every iOS dev has Googled
> "which paths are safe to rm -rf" — and at some point one of us fat-fingered
> Archives and lost crash symbolication for a shipped App Store build.
> This is the fix that should have existed years ago.

---

## START

```sh
git clone https://github.com/[org]/[repo].git
cd [repo]
make ui
```

[One sentence: what the user sees after that command runs. Both URLs if applicable.]

---

## SURFACE

<!-- Replace with a screenshot, GIF, or ASCII mockup before launch -->

```
┌──────────────────────────────────────────────────────────────┐
│  [App Name]                          [version] [theme toggle] │
│  ─────────────────────────────────────────────────────────── │
│  [Left sidebar]    [Main content area]    [Activity log]      │
│                                                               │
│  [Describe what the user sees here in plain terms]           │
└──────────────────────────────────────────────────────────────┘
```

---

## COMMANDS

Run `make help` to see all targets. Key commands:

| Command | WHAT |
|---|---|
| `make ui` | Build + serve dashboard (localhost AND Wi-Fi) |
| `make ui-local` | Same — localhost only |
| `make update` | Pull latest from main, safe from any branch state |
| `make doctor` | Diagnose: branch · version · deps · build state · disk |
| `make check` | Full quality gate — syntax · references · imports · library |
| `make install-cli` | Install `[name]` CLI to `~/.local/bin` |
| `make install-launchd` | Install hourly background agent |

---

## ENGINE

| Layer | Technology | WHY |
|---|---|---|
| [Layer name] | [Technology] | [The specific reason this was chosen over alternatives] |
| [Layer name] | [Technology] | [The specific reason] |
| [Layer name] | [Technology] | [The specific reason] |

---

## INSTALL

Every way to get [App Name]:

- **Web dashboard** — `make ui` (the default — start here)
- **[Surface name]** — `make install-[surface]` → [what it does]
- **[Surface name]** — `make install-[surface]` → [what it does]
- **SSH / headless** — `make run` (no UI required)

---

## STANDARDS

```sh
make check   # AppleScript syntax · referenced files · consumer strings · imports
```

Every PR runs this gate before merge. `make check` → all assertions green → ship.

---

## RELEASES

Version lives in `[canonical file]` as `[version property]`.
Every squash-merge to main auto-tags a GitHub Release with that version.

Full history: [docs/CHANGELOG.md](./docs/CHANGELOG.md)

---

## CREDIT

MIT — free to use, modify, and fork.
No telemetry. No phone-home. No subscription. No account required.

Built by **AVERY GOODMAN**.
