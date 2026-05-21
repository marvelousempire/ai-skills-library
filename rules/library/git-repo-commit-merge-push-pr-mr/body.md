# GIT REPO COMMIT MERGE AND SQUASH PUSH PR MR RULE

Whenever you change code that must ship, you must work on a branch (never commit directly on `main`), verify on the laptop, stage explicit paths only, commit and open a PR with Bash heredocs, squash-merge with `gh`, and deploy without GitHub Actions.

Whenever you name a branch, you must use `feature/short-name` or `fix/short-name` branched from `origin/main`, and rebase onto current `origin/main` before merge.

Whenever you write a commit message, a PR body, or a PR comment, you must use the shell and a heredoc. You must not use the GitHub web UI as the only way to create the PR.

Whenever you merge, you must use `gh pr merge --squash --delete-branch` from the main checkout (not from inside a worktree that will be deleted).

Whenever you deploy Red-E Play surfaces, you must use laptop `make deploy-*` after merge. You must not use `gh workflow run`, `gh run watch`, or wait for GitHub Actions to deploy or check the build.

**What you must do**

- Create a branch; never commit on `main`.
- Run local verify before push (`make nephew-verify`, or the repo’s documented build/test commands).
- `git add` only explicit file paths. Never `git add -A` or `git add .` in monorepos.
- Commit with a heredoc message that states why and what changed.
- Push with `git push -u origin HEAD`.
- Open a PR with `gh pr create` and a heredoc body (Summary, Test plan, Surfaces).
- Squash-merge when approved; deploy touched surfaces; smoke-test live URLs.
- Report pipeline stage: `committed` → `pushed` → `PR'd` → `merged` → `deployed` (with curl proof when web/API changed).

**Why we want it done this way**

- Branch + PR history stays readable.
- Heredocs let us write full commit and PR text in the terminal (no one-line slop).
- GitHub Actions cost money and fail when billing blocks; laptop deploy is the path we proved.
- `gh` for PRs uses the free API, not Actions runner minutes.

**What will go wrong if you do not follow it**

- `main` gets messy and loses track of what shipped.
- One-line commits and PRs hide what to test and what surfaces changed.
- `git add -A` bundles unrelated files into the PR.
- Agents say “CI will deploy” but nothing reaches production, or prod stays on an old build while Actions looks green.
- Merge from inside a deleted worktree breaks the shell cwd.

**What good result we get when you follow it correctly**

- One squash commit on `main` per PR with a clear message.
- A visible PR with a test plan the reviewer can run.
- Production matches the merged SHA after `make deploy-*` and smoke curls.
- No surprise GitHub Actions bills.

**Correct examples**

```bash
git checkout -B fix/deploy-docs origin/main
git add docs/operations/Laptop-Deploy-Setup.md AGENTS.md
git commit -m "$(cat <<'EOF'
Docs: laptop deploy is the only ship path.

Surfaces: marketing doctrine only.
EOF
)"
git push -u origin HEAD
gh pr create --repo marvelousempire/red-e-play-app \
  --title "Docs: laptop deploy only" \
  --body "$(cat <<'EOF'
## Summary
- Point agents at make deploy-* instead of GitHub Actions.

## Test plan
- [x] Read AGENTS.md + go-live-path.mdc for stale Actions text

## Surfaces
Docs only.
EOF
)"
cd /Users/nivram/Developer/red-e-play-app
gh pr merge 123 --squash --delete-branch
git pull origin main
make deploy-marketing
curl -sS -o /dev/null -w '%{http_code}\n' https://readyplay.app/
```

```bash
gh pr comment 123 --repo marvelousempire/red-e-play-app --body "$(cat <<'EOF'
Merged. Deploying backend via make deploy-backend; will curl /health next.
EOF
)"
```

**Incorrect examples (never do these)**

- `git commit -m "fix"`
- `gh pr create --title "updates" --body "stuff"`
- `gh workflow run "Deploy backend"`
- `gh run watch <id>`
- “Merge when ready; Actions will deploy.”
- `git add -A`
- Open the PR only in the browser and skip `gh pr create`
- `make deploy-backend` on the VPS (deploy runs from the Mac; `config.local` is on the laptop)

Is there any part of this rule that you do not understand?

## Technical reference — Red-E Play monorepo

One-time on the laptop:

```bash
cd ~/Developer/red-e-play-app
make deploy-setup
```

Set `scripts/mac-to-vps/deploy/config.local`: `DEPLOY_SSH_OPTS='-p 2222'`, `DEPLOY_REPO_ROOT="/opt/readyplay/build"`.

After merge to `main`:

```bash
git pull origin main
make deploy-backend
make deploy-admin
make deploy-marketing
make deploy-player-web
```

VPS git: use `/opt/readyplay/build` only. If `git fetch` fails on the server, use `SKIP_GIT_PULL=1` when the laptop already synced a known SHA.

Full naming law for binder filenames: `RULE_FOR_NAMING_THINGS.md`.

-----
