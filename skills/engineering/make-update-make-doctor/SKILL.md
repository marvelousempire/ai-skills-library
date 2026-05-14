---
name: make-update-make-doctor
id: SK-0026
keywords: [pull-latest, diagnose-install, check-version]
hash: ae623a7
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  Every developer-facing tool that ships via `git clone + make` needs two
  safety-net Makefile targets: `make update` (safely pull latest from main no
  matter what branch state, refuses with stash/status hints if dirty) and
  `make doctor` (one-shot diagnostic — branch, git status, version, deps,
  build state, disk free). Prevents the "git pull says 'no tracking
  information'" UX paper-cut for non-git-expert users. Triggers on "git pull
  fails", "no tracking information for the current branch", "user-friendly
  update command", "make doctor diagnostic", "git workflow paper-cut", "stale
  branch after squash-merge", "self-update Makefile target".
---

# make update + make doctor — the UX safety net every git-clone-and-make tool needs

The classic bug: a user clones your repo, does `make ui`, gets shipped a feature, then comes back later to update. They run `git pull`. Git says:

```
There is no tracking information for the current branch.
Please specify which branch you want to rebase against.
  git branch --set-upstream-to=origin/<branch> v0.25.2-marketing-folder
```

The user is stranded on a leftover feature branch — squash-merged + deleted on the remote during a previous session — and that error message is not designed for humans.

The fix: every tool that ships via `git clone + make` carries two safety-net targets — **`make update`** (safely pulls latest no matter what branch state) and **`make doctor`** (one-shot diagnostic). Document them in the README quick-start.

## When to use this skill

- Building or auditing the Makefile of a developer-facing tool that ships via `git clone + make`
- After shipping a long arc of feature branches where users got stranded on stale ones
- The user reports "git pull fails" or "I don't know which branch I'm on"
- Onboarding non-git-expert users to a CLI tool
- The user says "make this self-update" or "make this easier to keep current"

## `make update` — the canonical pattern

```makefile
update: ## Pull the latest from main (safe from any branch state)
    @CURRENT=$$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?"); \
    if [ "$$CURRENT" = "?" ] || [ "$$CURRENT" = "HEAD" ]; then \
        echo "✗ Not in a git repo (or detached HEAD). Re-clone:"; \
        echo "    git clone https://github.com/your/repo.git"; \
        exit 1; \
    fi; \
    echo "→ Currently on: $$CURRENT"; \
    echo "→ Fetching from origin…"; \
    git fetch origin --quiet 2>&1 | sed 's/^/  /'; \
    if ! git diff-index --quiet HEAD --; then \
        echo "⚠ You have uncommitted local changes. Stash or commit them first:"; \
        echo "    git stash       # to save them aside"; \
        echo "    git status      # to review"; \
        exit 1; \
    fi; \
    if [ "$$CURRENT" != "main" ]; then \
        echo "→ Switching to main…"; \
        git checkout main --quiet; \
    fi; \
    echo "→ Pulling latest main from origin…"; \
    BEFORE=$$(git rev-parse HEAD); \
    git pull --ff-only origin main 2>&1 | sed 's/^/  /'; \
    AFTER=$$(git rev-parse HEAD); \
    if [ "$$BEFORE" = "$$AFTER" ]; then \
        echo "✓ Already up to date."; \
    else \
        echo ""; \
        echo "✓ Updated $$BEFORE → $$AFTER"; \
        echo ""; \
        echo "Changes pulled:"; \
        git log --oneline "$$BEFORE..$$AFTER" | head -20 | sed 's/^/  /'; \
    fi; \
    echo ""; \
    echo "Next: run 'make ui' to launch."
```

**What it does:**

1. Detect current branch. Error clearly if detached HEAD / not a git repo.
2. Fetch from origin quietly.
3. Refuse if there are uncommitted local changes (with `git stash` / `git status` hints — not just "abort").
4. Auto-switch to main if on a feature branch.
5. Fast-forward pull.
6. Show what changed via `git log --oneline BEFORE..AFTER | head -20`.

## `make doctor` — the canonical pattern

```makefile
doctor: ## Diagnose the local install (git state, deps, build status)
    @echo "▶ [Product] doctor"
    @echo ""
    @printf "  git branch:        "; git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "(not a git repo)"
    @printf "  git status:        "; \
        if git diff-index --quiet HEAD -- 2>/dev/null; then echo "clean"; \
        else echo "uncommitted changes (run: git status)"; fi
    @printf "  current version:   "; grep 'property kVersion' $(SCRIPT) 2>/dev/null | head -1 | sed -E 's/.*"([^"]+)".*/\1/' || echo "(unknown)"
    @printf "  pnpm installed:    "; if command -v pnpm >/dev/null 2>&1; then pnpm --version; else echo "no (legacy UI will be used)"; fi
    @printf "  python3:           "; python3 --version 2>&1
    @printf "  vite dist/ built:  "; if [ -d apps/web/dist ]; then echo "yes (will use)"; else echo "no (run: make ui)"; fi
    @printf "  disk free:         "; df -h / 2>/dev/null | awk 'NR==2{print $$4" of "$$2" ("$$5" used)"}'
    @echo ""
    @echo "  Common fixes:"
    @echo "    make update   — pull latest from main"
    @echo "    make ui       — build + launch dashboard"
    @echo "    make help     — show every available make target"
```

**Adapt the rows** to your stack — every field should answer a real question a user might ask when filing a bug. Branch + status + version + key deps + build state + disk free.

## The README pairing

In the Quick Start section, add explicit guidance:

```markdown
### To update later — always use `make update`

```sh
make update
```

Pulls the latest [Product] from `main` no matter what branch you're on. **Do not run `git pull` directly** — if you're on a stale feature branch, git will fail with `"There is no tracking information for the current branch"` and that error message is not designed for humans. `make update` handles every branch state, warns you about uncommitted changes, and shows what changed when it's done.

### Something feels off? Run `make doctor`

```sh
make doctor
```

Prints your current branch, git status, [Product] version, key deps, build state, and disk free. Use this when you want to file a bug or just confirm things look right.
```

## Why this matters

For developer-facing tools, the **first interaction after install** is often the highest-friction surface. The user clones, installs, uses, comes back next week, runs `git pull && make ui`, hits an error from git that they don't understand. They give up.

`make update` and `make doctor` add 50 lines to the Makefile and turn that friction into a non-event. The bug-report rate drops noticeably; the support load drops; the user trusts the tool more.

## Anti-patterns

- ❌ Documenting `git pull` in the README as the update command. Hits the no-tracking-info trap on any feature branch.
- ❌ `make doctor` that just prints "All good!" — it has to print SPECIFIC fields the user can paste into a bug report.
- ❌ `make update` that auto-resolves dirty state with `git stash`. **Don't auto-stash.** The user might lose work and not realize. Print the hint, let them decide.
- ❌ `make update` that runs without `--ff-only`. Merge commits in main from a CLI tool's update flow are a code smell.

## Invocation

- "Use **make-update-make-doctor**."
- "Add the user-friendly update commands to this Makefile."
- "The user keeps getting 'no tracking information' — fix the update flow."
- "Audit our Makefile for the missing self-update target."

## Reference implementation

DustPan v0.25.3 — the bug discovery + fix. [`Makefile` targets](https://github.com/marvelousempire/dustpan/blob/main/Makefile) `update` and `doctor`. README quick-start: [first 70 lines](https://github.com/marvelousempire/dustpan/blob/main/README.md) including the explicit `make update` guidance and the `make doctor` callout.

The user-reported bug that triggered the skill is captured in the v0.25.3 commit message:

> ```
> $ git pull && make ui
> There is no tracking information for the current branch.
>   git branch --set-upstream-to=origin/<branch> v0.25.2-marketing-folder
> ```
> That message is technically accurate but useless to non-git-experts.
