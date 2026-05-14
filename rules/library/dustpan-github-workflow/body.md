---
name: dustpan-github-workflow
id: RL-0011
keywords: [enforce-dustpan, check-github, build-workflow]
hash: afbcffa
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Dustpan GitHub workflow — ship discipline

Repository: `marvelousempire/xcode-cleanup-shortcut`  
Applies to all agents working on this repo.

---

## The non-negotiable rule

**Every substantive change starts with a numbered plan in `plans/`.** No plan, no ship.

> "Cosmetic" exception: typo fixes, one-line bug fixes, README polish under two sentences. If explaining *why* would take more than two sentences in a commit message, write a plan first.

---

## Plans folder convention

```
plans/
  0001-slug.md   ← shipped
  0002-slug.md   ← shipped
  0003-slug.md   ← in progress
  README.md      ← index table of all plans
```

### Plan file format

```markdown
Status: in progress

# Plan NNNN — Title

## Context
Why this change. What prompted it. What outcome is expected.

## Approach
The one approach we're picking (not all alternatives).
Concrete: filenames, columns, endpoints, function signatures.

## Critical files
| File | Change |
|---|---|

## Verification
How to confirm it worked end-to-end.
```

### Status line lifecycle

```
Status: in progress     ← set when plan is written (before any code)
Status: shipped (commit <sha>, v<version>)   ← set in a post-merge chore PR
Status: partially shipped — <what> done, <what> deferred to plan NNNN
```

### Plans README index

Every plan gets a row:
```
| [NNNN](NNNN-slug.md) | Title | shipped/in progress | v0.X.Y |
```

Never re-number. Never delete old plans. Supersede with a new plan that links back.

---

## kVersion

`xcode-cleanup.applescript` line 1:
```applescript
property kVersion : "0.20.4"
```

**Rule:** kVersion always matches the latest CHANGELOG header, even on doc-only changes.

---

## CHANGELOG format

```markdown
## [0.X.Y] — YYYY-MM-DD HH:MM:SS Eastern · *one-line summary*

### Changed — section title

Prose. What changed, why, what it fixes.

### Added — section title

...

### kVersion
`0.X.Y-1` → `0.X.Y`

---
```

CHANGELOG lives at `docs/CHANGELOG.md`. Every PR adds a header at the top.

---

## Version numbering

- `MAJOR.MINOR.PATCH`
- **PATCH** (0.19.x → 0.19.x+1): bug fix, polish, doc change, small addition
- **MINOR** (0.19.x → 0.20.0): new feature, new category, new dependency
- **MAJOR**: not used yet

---

## Branch → PR → squash merge → auto-release

### Branch naming

```
v0.20.4-short-description      ← feature/fix branches
chore/flip-plan-0006-status    ← post-merge status-flip PRs
```

### Commit message

```
v0.20.4: brief imperative description (plan 0006)

Detailed explanation of what changed and why.
- bullet 1
- bullet 2

kVersion 0.20.3 → 0.20.4

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

**First line format:** `v{version}: {description}` — the auto-release workflow parses this.

### PR pattern

```sh
git checkout -b v0.X.Y-slug
# ... implement ...
git add <specific files>
git commit -m "v0.X.Y: ..."
git push -u origin v0.X.Y-slug
gh pr create --title "v0.X.Y: ..." --body "..."
gh pr merge <n> --squash
```

After squash-merge, GitHub Actions auto-tags `v0.X.Y` and creates a release.

### Post-merge chore

After every feature merge, open a follow-up chore PR to:
1. Flip `plans/NNNN.md` status line to `shipped (commit <sha>, vX.Y.Z)`
2. Update `plans/README.md` index row status

```sh
git checkout -b chore/flip-plan-NNNN-status
# edit plan + README
git add plans/
git commit -m "chore: mark plan NNNN shipped (commit <sha>, vX.Y.Z)"
gh pr create --title "chore: ..."
gh pr merge --squash
```

---

## File structure cheat sheet

```
xcode-cleanup-shortcut/
├── xcode-cleanup.applescript   ← kVersion here
├── Makefile                    ← make ui / make check / make install-*
├── web/
│   ├── server.py               ← Python HTTP server (stdlib only for make ui)
│   ├── cleaners.py             ← ALL disk-scan category definitions
│   ├── db.py                   ← optional Postgres (Docker mode)
│   ├── sqlite_store.py         ← default local persistence (stdlib sqlite3)
│   ├── ai.py                   ← AI provider dispatch (urllib only)
│   └── requirements.txt        ← Docker-mode pip deps only
├── apps/web/                   ← Vite + React 18 + TypeScript dashboard
│   └── src/
│       ├── components/         ← all UI components
│       ├── state/              ← DashboardContext (all app state)
│       └── lib/                ← api.ts, types.ts, utils.ts
├── docker/                     ← opt-in Docker stack (app + db + caddy + ollama)
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── Caddyfile
│   ├── .env.example
│   └── go                      ← one-shot bootstrap
├── plans/                      ← numbered plans (source of truth for "why")
├── docs/
│   └── CHANGELOG.md
└── README.md                   ← primary user-facing doc
```

---

## What NOT to clean (user data, not caches)

These paths must **never** appear in the `safe` tier of cleaners.py:

| Path | Why |
|---|---|
| `~/Library/Preferences/` | All app settings |
| `~/Library/Application Support/com.apple.sharedfilelist/` | Finder sidebar favorites |
| `~/Library/Application Support/com.apple.dock.launchpad-*/` | Launchpad layout |
| `~/.ssh/` | SSH keys |
| `~/Library/Keychains/` | Passwords |
| `~/Library/Safari/Bookmarks.plist` | Browser bookmarks |
| `~/Library/Messages/` | iMessage history |
| Any `~/Library/Group Containers/group.com.apple.*` unless specifically audited |

---

## Persistence architecture

```
make ui (no Docker):
  sqlite_store.py → ~/Library/Application Support/dustpan/history.db
  API keys: localStorage (browser)

./docker/go (Docker mode):
  db.py → Postgres (pgvector/pg16)
  API keys: AES-256-GCM encrypted in DB
  Ollama: docker compose --profile ollama up
```

`_init_store()` in server.py picks the right backend at startup.

---

## GitHub Actions auto-release trigger

The `.github/workflows/` release workflow fires on merge to `main` when the
squash-merge commit title starts with `v{semver}:`. It:
1. Extracts the version from the commit title
2. Creates a `vX.Y.Z` git tag
3. Creates a GitHub release with that tag as "Latest"

This is why commit messages MUST start with `v0.X.Y: description`.
