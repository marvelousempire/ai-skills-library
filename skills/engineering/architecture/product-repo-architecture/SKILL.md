---
name: product-repo-architecture
id: SK-0007
keywords: [setup-repo, configure-release, name-branch]
goal: Every git repo starts with the right structure from the first commit so no architectural debt accumulates.
hash: 8e05ad7
relations: [avery-goodman-repo-standard, make-check-defense-in-depth]
before: []
governed_by: [RL-0039, RL-0032, global]
meta: dynamic
description: >-
  The opinionated git repo structure, Makefile interface, GitHub Actions
  auto-release workflow, version-tracking pattern, git branch and PR naming
  conventions, folder hierarchy, and single-source-of-truth file discipline for
  any macOS developer tool or local-first web app that ships via git clone + make.
  This is a git + GitHub-specific pattern: uses gh CLI, GitHub Actions for
  auto-tagging releases on every squash-merge to main, git branch naming that
  embeds the version number, and GitHub Releases for distribution. Covers:
  Makefile as primary UX, kVersion in one canonical file, squash-merge + auto-tag,
  numbered append-only plan docs, PR body format, and the make check CI gate.
  Triggers on "set up this git repo", "git repo structure", "GitHub repo
  architecture", "GitHub Actions release workflow", "auto-release on merge",
  "git branch naming", "version tracking in git", "how should I set up this
  repo", "Makefile conventions", "where do plans go", "GitHub releases",
  "single source of truth for version", "how did we organize the DustPan repo".
---

# Product repo architecture — the DustPan opinionated repo design

This is the complete repo design pattern extracted from building DustPan (a macOS disk-recovery tool, v0.1.0 → v0.27.2). Every decision here was arrived at the hard way — by shipping real work and noticing what friction points kept recurring.

Adapt freely. The pattern fits any tool that ships via `git clone + make` and has a web UI alongside a native macOS component.

## The core philosophy

**The Makefile is the user's primary interface.** Not README instructions to copy-paste, not `npm run` scripts nobody can remember, not a Wiki. One command — `make help` — shows everything. Every command is a make target. Users who clone the repo can be productive in 60 seconds without reading anything.

**Version lives in one canonical place.** Every other place that mentions the version is synced to it, not authoritative. When the canonical place changes, everything else updates.

**Squash-merge to main = release.** There is no separate "release step." When a PR merges to main, the auto-release fires. No manual tagging, no release branch, no deploy step.

---

## Folder structure

```
project-root/
├── Makefile                    ← USER INTERFACE — every command lives here
├── dustpan.applescript         ← THE CLEANUP ENGINE — AppleScript for native macOS UI
├── bin/
│   └── xcc                     ← CLI wrapper for the AppleScript
├── web/
│   ├── server.py               ← HTTP server (Python stdlib, no FastAPI)
│   ├── cleaners.py             ← SINGLE SOURCE OF TRUTH for cleanup rules
│   ├── ai.py                   ← AI provider dispatch
│   ├── agent_tools.py          ← Tool registry for the AI agent
│   ├── agent_chat.py           ← AI chat orchestrator
│   └── proposals_store.py      ← AI proposal inbox storage
├── apps/
│   ├── web/                    ← Vite + React + Tailwind dashboard (canonical UI)
│   └── web-next/               ← Next.js dashboard (experimental)
├── applescripts/               ← AppleScript library (native UI scripts)
│   ├── README.md               ← Library index + philosophy
│   ├── docs/                   ← One doc per script
│   └── snippets/               ← Reusable AppleScript patterns
├── plans/                      ← Numbered plan documents (append-only)
│   ├── README.md
│   ├── 0001-first-feature.md
│   └── 0025-last-feature.md
├── docs/
│   ├── marketing/              ← One MD per shipped feature (8-section template)
│   ├── checklists/             ← Step-by-step verification lists
│   ├── CHANGELOG.md
│   ├── HANDOFF.md
│   └── PRD.md
├── scripts/                    ← Maintenance scripts
│   ├── finalize-skills-index.sh
│   ├── report.py
│   └── remote-cleanup.sh
├── launchd/                    ← macOS launchd plist for hourly background run
├── swiftbar/                   ← SwiftBar menu-bar plugin
├── assets/                     ← Icons, screenshots
└── .github/
    └── workflows/
        └── release.yml         ← AUTO-RELEASE on squash-merge to main
```

**The key structural decisions:**

- `web/` holds the Python backend. `apps/web/` holds the Vite frontend. They coexist without interfering.
- `cleaners.py` is never auto-edited by any tool. It's the hand-curated source of truth. The AI agent proposes additions; humans paste and commit.
- `plans/` is append-only and git-tracked. Every substantive feature has a numbered plan before coding starts.
- `docs/marketing/` is the external-facing counterpart of `plans/` — one file per feature, marketing-shaped.

---

## Version tracking — one canonical place

The version lives in `dustpan.applescript`:

```applescript
property kVersion : "0.27.2"
```

**Everything else is synced to it — not authoritative:**

```json
// package.json (root)
{ "version": "0.27.2" }

// apps/web/package.json
{ "name": "@dustpan/web", "version": "0.27.2" }

// apps/web-next/package.json
{ "name": "@dustpan/web-next", "version": "0.27.2" }
```

**The server exposes it:**
```python
# web/server.py
def get_version() -> str:
    # reads kVersion from dustpan.applescript at startup
    ...

# /api/status returns: { free_gb, used_gb, total_gb, used_pct, version }
```

**Version bump protocol** (every PR that changes behavior):
```sh
# 1. Bump dustpan.applescript kVersion
sed -i '' 's/0\.26\.1/0.27.0/' dustpan.applescript

# 2. Sync all package.json files atomically
sed -i '' 's/"version": "0\.26\.1"/"version": "0.27.0"/' \
  package.json apps/web/package.json apps/web-next/package.json

# 3. Verify all four match
grep 'kVersion\|"version"' dustpan.applescript package.json apps/web/package.json
```

Never leave version numbers inconsistent across these four files. They bump together, in the same commit, always.

---

## Auto-release workflow — squash-merge = release

`.github/workflows/release.yml` fires on every push to main. It reads `kVersion` from `dustpan.applescript` and creates a GitHub Release with that tag. No manual tagging. No release branch.

**The critical design:** PRs are squash-merged. The squash commit lands on main. The workflow reads the version from `dustpan.applescript` in that commit and creates `v0.27.0`. The release body is auto-populated from the PR body.

```yaml
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Read version
        id: ver
        run: echo "version=$(grep 'property kVersion' dustpan.applescript | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')" >> $GITHUB_OUTPUT
      - name: Create release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: v${{ steps.ver.outputs.version }}
          generate_release_notes: true
```

**Implication:** the version number in `dustpan.applescript` IS the release version. Bump it in the PR branch. When the PR merges, that version ships.

---

## Branch naming convention

Format: `v{MAJOR}.{MINOR}.{PATCH}-{feature-name}`

Examples:
- `v0.23.0-conversational-agent`
- `v0.25.3-makefile-update-guard`
- `v0.27.1-skills-library-extraction`

**Why include the version in the branch name:** You can see at a glance from `git branch -a` which version each branch is shipping. No ambiguity about whether a branch is stale or current.

---

## PR naming + body convention

**Title format:** `v{VERSION}: Short plain-English description of what shipped`

Examples:
- `v0.27.0: Final delivery — every deferred item shipped, every elevation included (plan 0025)`
- `v0.23.0: Conversational SADPA agent with tool-calling (plan 0023, Ship 1)`

**Body format:**
```markdown
## What this is
[One paragraph — the "why" for non-engineers]

## What ships
[Bullets or table of specific items]

## Verification
[How to confirm it works — the literal steps]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

The `🤖 Generated with Claude Code` footer is standard. It's honest attribution and signals to future maintainers that the commit message was AI-assisted.

---

## The Makefile — complete interface design

`make help` shows every target with a description. Every user-facing command is a make target. No exceptions.

**Core targets every repo like this should have:**

```makefile
# ── User interface ─────────────────────────────────────────────────────────
ui          Build Vite UI (~6s) + serve on localhost AND Wi-Fi
ui-local    Same but localhost-only
ui-dev      Dev mode with hot-reload

# ── Maintenance ────────────────────────────────────────────────────────────
update      Pull latest from main, safe from any branch state
doctor      Diagnose: branch, git status, version, deps, build state, disk
check       Verify AppleScript, bin/cli, Python imports, library compiles

# ── Cleanup engine (the actual product) ────────────────────────────────────
run         Run the cleanup directly
dry-run     Show what would be freed without deleting
force       Skip the threshold check

# ── Install surfaces ───────────────────────────────────────────────────────
install-cli        Install CLI wrapper to ~/.local/bin
install-launchd    Install hourly background agent
install-swiftbar   Install menu-bar widget
install-applescripts  Copy AppleScript library to ~/Library/Application Scripts/

# ── Uninstall ──────────────────────────────────────────────────────────────
uninstall-cli uninstall-launchd uninstall-swiftbar uninstall-applescripts
```

**The make help pattern** (auto-generates from `##` comments):
```makefile
help:
    @grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
        | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'
```

Any target with `## Description` after the colon appears in `make help`. This forces documentation to live next to the target, not in a README.

---

## The `make check` CI gate

**What it verifies** (minimum viable gate for this kind of repo):

```makefile
check:
    # 1. Main AppleScript compiles
    @osacompile -o /tmp/check.scpt $(SCRIPT) && rm /tmp/check.scpt
    @echo "✓ AppleScript syntax OK"

    # 2. Every file the Makefile references actually exists on disk
    @for f in $(SCRIPT) launchd/*.plist swiftbar/*.sh bin/*; do \
        [ -e "$$f" ] || { echo "✗ Missing: $$f" >&2; exit 1; }; done

    # 3. CLI wrapper references the CURRENT script name and env-var prefix
    @grep -q 'dustpan.applescript' bin/xcc && grep -q 'DUSTPAN_DRY_RUN' bin/xcc \
        || { echo "✗ bin/xcc has stale references" >&2; exit 1; }
    @echo "✓ CLI references correct"

    # 4. Python modules all import cleanly
    @cd web && python3 -c "import server, cleaners, ai, agent_tools, proposals_store"
    @echo "✓ Python modules import"

    # 5. Every script in the AppleScript library compiles
    @for f in applescripts/*.applescript; do \
        osacompile -o /tmp/asc-check.scpt "$$f" 2>/dev/null && rm -f /tmp/asc-check.scpt \
        || { echo "✗ Fails to compile: $$f" >&2; exit 1; }; done
    @echo "✓ AppleScript library compiles"
```

This check catches the v0.21.0-class regression (rename the file but not the consumers) that `make ui` silently broke for 65 days.

---

## Plan documents — numbered, append-only, git-tracked

```
plans/
├── README.md              ← conventions + index table
├── 0001-first-feature.md
├── 0022-space-survey.md
└── 0025-final-delivery.md
```

**Format** (four mandatory sections):
```markdown
# Plan NNNN — [Title]

## Context
Why. What prompted it. The intended outcome.

## Tasks
Numbered. Each has: file path, function name, exact change, dependencies.

## Critical files
| File | Action |
|---|---|
| `path/to/file` | NEW / EXTEND / MODIFY |

## Verification
Literal commands + expected output. NOT "test that it works."

## Out of scope
What is deliberately NOT being done and why.
```

**The numbering rule:** look at the existing plans, take the next integer, zero-pad to 4 digits. Never reuse. Never renumber.

**When a plan ships:** add `Status: shipped (commit <sha>, v<version>)` at the top.

---

## The three-dashboard pattern

One Python server, three distinct frontend experiences at different URLs:

| URL | Frontend | When to use |
|---|---|---|
| `http://127.0.0.1:8765/` | Vite + React (canonical) | Default — full animations, charts, live updates |
| `http://127.0.0.1:8765/?legacy=1` | Vanilla HTML | Works without pnpm install; fallback for airgap/dev environments |
| `http://127.0.0.1:8765/next/` | Next.js (experimental) | Static export — built separately with `make ui-all` |

The server detects which build is available and falls back gracefully. `make ui` always builds and serves the Vite version. `make ui-legacy` forces the vanilla fallback.

---

## The cleaners.py single-source-of-truth discipline

`cleaners.py` is the canonical registry of everything the tool knows how to clean. Every action in the UI, every AI agent tool call, every emergency command card — they all dispatch into `cleaners.py`, never around it.

**The key rules:**
1. No tool or agent ever writes to `cleaners.py` automatically
2. AI agents can PROPOSE additions via the review-inbox pattern (see `ai-proposal-review-inbox` skill)
3. Every action has a `cost` field with curated text — the approval card in the AI chat pulls from this verbatim (see `cost-annotation-discipline` skill)
4. Three safety tiers (`safe`, `probably_safe`, `caution`) are structurally enforced — "clean ALL safe" is hard-gated in the server (see `three-tier-safety-classification` skill)

---

## Anti-patterns this architecture avoids

| Problem | The fix |
|---|---|
| "Which command do I run?" confusion | `make help` shows everything. Users never have to read the README. |
| Manual tagging for releases | Auto-release on squash-merge — bump the version in the PR, merge, it ships. |
| Version number inconsistency | One canonical place (AppleScript `kVersion`), four synced files, version bump protocol. |
| "Why did we do this?" in 6 months | Numbered plan documents in git — `plans/0022-space-survey.md` explains it. |
| Silent CI regressions after renames | `make check` gates on referenced files + consumer string correctness. |
| Marketing copy scattered everywhere | `docs/marketing/` with one file per feature, eight-section template. |
| AI agent mutating canonical source | Proposal review inbox — AI proposes, human pastes. Source stays curated. |

---

## Invocation

- "Use **product-repo-architecture**."
- "How should I set up this repo?"
- "How did we design the DustPan repo structure?"
- "What's the convention for branches, PRs, versions, plans?"
- "Set up the Makefile for this project the DustPan way."

## Reference implementation

DustPan v0.1.0 → v0.27.2 at [github.com/marvelousempire/dustpan](https://github.com/marvelousempire/xcode-cleanup-shortcut). The entire arc of 60+ PRs and 27 versions is the worked example of this architecture in practice.

Related skills that implement specific subsystems of this pattern:
- `plan-first-substantive-changes` — the plan document convention
- `make-check-defense-in-depth` — the CI gate
- `make-update-make-doctor` — the `make update` + `make doctor` safety targets
- `feature-marketing-md` — the `docs/marketing/` folder pattern
- `cost-annotation-discipline` — the `cleaners.py` annotation convention
- `three-tier-safety-classification` — the safe/probably_safe/caution enforcement
- `ai-proposal-review-inbox` — the AI proposal flow for curated source files
