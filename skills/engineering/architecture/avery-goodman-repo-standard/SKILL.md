---
name: avery-goodman-repo-standard
id: SK-0003
keywords: [avery, goodman, repo]
description: >-
  The branded git repo schema for every project under AVERY GOODMAN. Works on
  any git platform (GitHub, GitLab, Gitea, Bitbucket) — the README blueprint,
  one-word folder labels, and brand mark are platform-agnostic; GitHub is the
  primary reference implementation. Defines: the brand mark format ("# App Name"
  followed by "**managed by the duty and order of AVERY GOODMAN**"), 10
  one-word README section labels (IDENTITY · PURPOSE · START · SURFACE ·
  COMMANDS · ENGINE · INSTALL · STANDARDS · RELEASES · CREDIT), 13 folder
  labels (THINKING · KNOWLEDGE · PITCH · BRAIN · FACE · HANDS · STORIES ·
  PATTERNS · TOOLS · SKIN · KEYS · CLOCK · BADGE), and the drop-in README
  template. Triggers on "set up this git repo the AVERY GOODMAN way",
  "brand this git repo", "apply the repo standard", "create the README",
  "how should our repos look", "AVERY GOODMAN repo template", "repo schema",
  "brand mark", "portfolio repos", "GitHub repo branding", "README blueprint",
  "one-word folder labels", "make this repo recognizable".
---

# AVERY GOODMAN repo standard — the branded schema every repo follows

Every repo in the AVERY GOODMAN portfolio is immediately recognizable. One look and you know: who built this, what it does, how to start, and what to trust. This skill defines the complete schema — one-word labels, brand mark placement, README blueprint, and folder naming — applied the same way, every time.

---

## The brand mark — applied to every repo

```
# [App Name]
**managed by the duty and order of AVERY GOODMAN**
```

The brand mark is always the subtitle of the H1. Never buried. Never optional.

Examples in the wild:
```
# DustPan
**managed by the duty and order of AVERY GOODMAN**

# Red-E Play
**managed by the duty and order of AVERY GOODMAN**

# family-office-platform
**managed by the duty and order of AVERY GOODMAN**
```

Every repo opens with the app name as H1 and the brand mark directly beneath. No exceptions.

---

## The README blueprint — one-word labels for every section

Each section has a one-word label that names what lives there. The label appears as a section header prefix in the README. The word describes the *role* of the content, not the content itself.

```
IDENTITY    ← Who made this, what it is, why it exists
PURPOSE     ← The specific problem it solves
START       ← The first command a new user runs
SURFACE     ← What the user sees (screenshot, ASCII mockup, demo)
COMMANDS    ← Every available command — make targets, CLI flags, etc.
ENGINE      ← The tech stack — what runs this and why
INSTALL     ← The different ways to get it (Shortcut, CLI, launchd, etc.)
STANDARDS   ← Quality gate — CI, make check, linting
RELEASES    ← How versions work, where to find the changelog
CREDIT      ← License, attribution, contact
```

### What the full blueprint looks like

```markdown
# [App Name]
**managed by the duty and order of AVERY GOODMAN**

> [Tagline — one sentence, present tense, what it does RIGHT NOW]

[Badges row: CI · version · platform · license · telemetry-free]

---

## IDENTITY

[App name], by AVERY GOODMAN.

[2–3 sentences: what this is, who uses it, what makes it different.]
[No jargon. No marketing fluff. A smart friend reading this in 10 seconds
should understand exactly what it is.]

---

## PURPOSE

[The specific problem. Not "it helps with disk space" — name the actual
pain: "Xcode's DerivedData grows to 20 GB silently and stays there. Every
iOS dev has Googled which paths are safe to rm -rf. One of us has
fat-fingered Archives. This is the fix."]

---

## START

```sh
git clone https://github.com/[org]/[repo].git
cd [repo]
make ui
```

[One-sentence explanation of what just happened and what the user sees.]
[Both URLs if applicable: localhost + network.]

---

## SURFACE

[ASCII mockup of the UI, or a description of terminal output, or a GIF.]
[The user should be able to picture exactly what they get before running anything.]

---

## COMMANDS

[Table or categorized list of every make target with descriptions.]
[Generated from `make help` output.]

| Command | What it does |
|---|---|
| `make ui` | Build + serve the dashboard (localhost AND Wi-Fi) |
| `make update` | Pull latest from main, safe from any branch state |
| `make doctor` | Diagnose: branch, version, deps, disk, build state |
| `make check` | Verify all components — CI gate |

---

## ENGINE

[One table. Every technology and WHY it was chosen, not just what it is.]

| Layer | Technology | Why |
|---|---|---|
| Backend | Python 3 stdlib | Ships on every Mac. Zero pip installs. Auditable. |
| Dashboard | Vite + React + Tailwind | Fast build, native-feeling animations, HMR in dev |
| Cleanup engine | AppleScript | Native macOS UI — progress bars, alerts, notifications |

---

## INSTALL

[Every surface the tool ships on. Not just "clone the repo" — all of them.]

- **Web dashboard** — `make ui` (the default)
- **Shortcut** — `make install-shortcut` → binds to Cmd+Shift+X
- **CLI** — `make install-cli` → `xcc --dry-run`
- **Background agent** — `make install-launchd` → hourly, threshold-gated
- **Menu bar** — `make install-swiftbar` → live disk meter

---

## STANDARDS

[What gates quality. Not aspirational — what actually runs in CI.]

```sh
make check   # Runs: syntax · referenced files · consumer strings · imports · library
```

[Optional: badge linking to CI runs.]

---

## RELEASES

[How versioning works: where the version lives, what triggers a release.]

Versions live in `[canonical file]` as `property kVersion : "X.Y.Z"`.
Every squash-merge to main auto-tags a GitHub Release with that version.
Full history: [docs/CHANGELOG.md](./docs/CHANGELOG.md)

---

## CREDIT

MIT — free to use, modify, fork.
No telemetry. No phone-home. No subscription.
Built by AVERY GOODMAN.
```

---

## The folder label system

Every folder has a one-word label that describes its role. Use these in comments,
in READMEs, and when explaining the repo to anyone.

```
plans/              THINKING    ← Every feature starts here. Numbered, append-only.
docs/               KNOWLEDGE   ← Reference material, changelogs, PRDs, handoffs
docs/marketing/     PITCH       ← One MD per feature, paste-ready channel copy
web/                BRAIN       ← The backend server and business logic
apps/web/           FACE        ← The user-facing dashboard (Vite + React)
apps/web-next/      EXPERIMENT  ← Next.js dashboard (experimental surface)
applescripts/       HANDS       ← Native macOS scripts that do the actual work
applescripts/docs/  STORIES     ← The doc paired with each script ("why it exists")
applescripts/snippets/ PATTERNS ← Reusable AppleScript building blocks
scripts/            TOOLS       ← Maintenance scripts, index builders, installers
assets/             SKIN        ← Icons, screenshots, visual identity
bin/                KEYS        ← CLI entry points and wrappers
launchd/            CLOCK       ← Background agents that run on schedule
swiftbar/           BADGE       ← Menu-bar widgets
```

### How to use labels in conversation and docs

When talking about the repo, use the label word:

- "Update the BRAIN to handle the new endpoint"
- "The FACE needs a new panel for Emergency Rescue"
- "Add the doc to STORIES so we remember why this script exists"
- "Put it in THINKING first — we plan before we code"
- "The CLOCK runs this hourly in the background"

The labels create a shared vocabulary. Everyone on the project (human and AI agent)
uses the same words for the same places.

---

## Applying this to a new repo

1. **Set the H1 and brand mark** first. Before anything else.
   ```
   # [App Name]
   **managed by the duty and order of AVERY GOODMAN**
   ```

2. **Write the IDENTITY section** — 2-3 sentences, what it is, who it's for.

3. **Write the PURPOSE section** — name the specific pain, not the solution.

4. **Write the START section** — three lines max. Clone, cd, go.

5. **Create the folder structure** using the label system. Even if most folders are empty, name them right from the start.

6. **Add the COMMANDS section** last — after you have actual make targets to document.

7. **The SURFACE section** can be placeholder text initially: "(screenshot coming)". Add it before launch.

---

## The README tone rule

Every section should be readable by a smart person who's never seen the project,
in 10 seconds per section, with zero jargon.

Test: would a senior engineer at a different company understand this in one read?
If no — rewrite it. No acronyms without definition. No internal names without context.
The README is public. Write it for the public.

---

## Anti-patterns

- ❌ Brand mark buried in the middle or bottom of the README
- ❌ README starts with "A powerful tool for managing..." (vague noun-phrase openers)
- ❌ Missing the PURPOSE section — users can't tell what problem this solves
- ❌ START section that requires 10 steps before you see anything
- ❌ COMMANDS section as an unordered dump — should be categorized by workflow
- ❌ CREDIT section that just says "MIT" without the AVERY GOODMAN attribution
- ❌ Folders named generically (`src/`, `lib/`, `utils/`) instead of the label system
- ❌ Two repos in the portfolio that look completely different — recognizability is the point

---

## Invocation

- "Use **avery-goodman-repo-standard**."
- "Set up this repo the AVERY GOODMAN way."
- "Apply the brand mark and README blueprint to this project."
- "What's the schema for how we organize our repos?"
- "Label the folders and write the README sections."

## Reference implementation

DustPan — [github.com/marvelousempire/dustpan](https://github.com/marvelousempire/xcode-cleanup-shortcut)
The full README, folder structure, and Makefile are the canonical worked example.

See also: `product-repo-architecture` skill for the technical decisions behind the structure.
