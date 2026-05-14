# Checklist — ship (pre-commit, pre-merge, pre-push)

Before any substantive change hits `main`. Catches the failure modes logged in [`docs/improvement/recurring-failures.md`](../improvement/recurring-failures.md).

## Pre-commit

- [ ] Working tree clean except for the intended changes
- [ ] Plan file exists if change is substantive ([`plan-naming.md`](../standards/plan-naming.md))
- [ ] All verification gates pass ([`verification-gates.md`](../standards/verification-gates.md)):
  - [ ] `bash scripts/check-skill-count.sh` → green
  - [ ] `bash scripts/lint-skill-frontmatter.sh` → green
  - [ ] `bash scripts/check-cross-references.sh` → green
  - [ ] Every new shell script: `bash -n` clean
  - [ ] Every new compose file: `docker compose config` parses

## Commit message

- [ ] Conventional-style prefix (`feat`, `fix`, `chore`, `docs`, `refactor`)
- [ ] First line ≤ 70 chars, imperative ("add", "fix", "ship")
- [ ] Body explains **why** in plain language a non-engineer could understand
- [ ] Includes verification summary at the bottom
- [ ] Co-Authored-By line if AI-assisted

## Pre-merge

- [ ] **Branch state confirmed**: `git -C <repo-root> branch --show-current` returns the expected branch
- [ ] Target branch fast-forwardable: `git pull --ff-only origin <branch>` succeeds
- [ ] No diverging history surprises: `git log <branch>..origin/<branch>` is empty
- [ ] Merge commit uses `--no-ff` for traceability
- [ ] Merge commit message references the source branch

## Pre-push

- [ ] Origin reachable: `git ls-remote origin >/dev/null 2>&1`
- [ ] Push uses `--force-with-lease` only if the branch was rebased
- [ ] After push: verify origin matches local
  ```sh
  git log origin/main --oneline -3
  git log main --oneline -3
  # should be identical
  ```

## After-push

- [ ] Auto-push hook output checked for failures
- [ ] If shipping infra: `make doctor` from the affected skill confirms green
- [ ] Recovery tag pushed if this is a major delivery: `git tag -a <name> -m <…>` + `git push origin <name>`

## Why these gates exist

Eight incidents from the 2026-05-14 session are catalogued in [`recurring-failures.md`](../improvement/recurring-failures.md). Every gate above prevents at least one of them.

## Rollback recipe

If the push lands and something's broken:

```sh
# Find the recovery tag before this change:
git tag --sort=-creatordate | head -5

# Roll main back:
git checkout main
git reset --hard <recovery-tag>
git push origin main --force-with-lease
```

Worst-case rollback to today's pre-master-repo-evolution state:
```sh
git reset --hard pre-master-repo-evolution-2026-05-14
```
