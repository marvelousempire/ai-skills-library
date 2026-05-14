# Multi-PR session opener checklist

Use at the START of any session planning ≥3 PRs.

## Step 1: Estimate the rebase tax

- [ ] How many PRs are planned?
- [ ] Are they dependent (each depends on the previous landing)?
- [ ] What's the current PR rate on main? (`gh pr list --state merged --limit 20` — check the timestamps)
- [ ] Rebase-tax estimate = 5-10 min × PR count

## Step 2: Pre-flight checks

```bash
git fetch origin
git log HEAD..origin/main --oneline | head -20           # what's ahead of you
gh pr list --repo <repo> --state open --limit 20         # what's in flight
ls backend/src/db/migrations/ | tail -3                  # highest migration number
bash scripts/either-host/next-feature-id.sh              # next feature ID
```

## Step 3: ID safety margin

- [ ] Pick feature IDs ≥5 above the high-water mark (room for in-flight PRs to claim 530-NNN)
- [ ] Pick migration prefixes ≥1 above the latest on disk (per migration-race-guard)

## Step 4: Conflict surface mapping

Which files will every PR touch?
- [ ] `docs/CHANGELOG.md` — yes (every PR adds an entry)
- [ ] `docs/Feature Ledger.md` — if any feature status changes
- [ ] `backend/src/db/migrations/` — if any schema changes
- [ ] `Red-E Play/RedEPlay.xcodeproj/project.pbxproj` — if any new Swift files
- [ ] `package.json` versions — depends on surface

For each high-conflict file, have the resolution skill ready:
- CHANGELOG → `skills/engineering/rebase-changelog-resolver`
- pbxproj → `rules/library/pbxproj-conflict` body's auto-resolve script

## Step 5: Plan the session

- [ ] First PR: low-risk schema/registration that doesn't depend on others
- [ ] Middle PRs: each rebases against the latest main right before opening
- [ ] Last PR: includes any cleanup / version bumps / final smoke testing

## Step 6: Set realistic expectations with user

- [ ] State the rebase tax estimate
- [ ] Propose splitting across sessions if >6 PRs
- [ ] Get explicit "go" before opening the first PR

## Origin

`rules/library/parallel-pr-rebase-tax`. Real example: trainer-marketplace session shipped 3 PRs and paid ~45 min rebase tax across the session.
