# Checklist — release verification

Run after every `gh pr merge --squash` to confirm the release actually fired.

---

## Immediately after merge

- [ ] `gh pr view <N> --json state,mergedAt` shows `"state":"MERGED"` and a `mergedAt` timestamp
- [ ] `gh release list --limit 3` shows the new version tag at the top as "Latest"
- [ ] The release tag matches the version in `dustpan.applescript` (`grep kVersion`) / `package.json` / wherever the canonical version lives
- [ ] `git fetch origin && git log --oneline origin/main -1` shows the merge commit

## If the release tag didn't fire

The auto-release workflow triggers on push to main. If it didn't fire:

```sh
gh run list --limit 5              # see recent workflow runs
gh run view <run-id>               # see why it failed
```

Common causes:
- The PR was merged with conflicts → the auto-release script couldn't find the version bump
- The version bump was not included in the squash commit → tag already exists

## Confirming the product is actually running the new version

```sh
# For DustPan:
grep "kVersion" dustpan.applescript   # source of truth
curl http://127.0.0.1:8765/api/status | python3 -c "import sys,json; d=json.loads(sys.stdin.read()); print('version:', d['version'])"

# For web apps:
curl https://your-url/api/version
```

## The confirmation format

When confirming a release to the user, always show all four:

```
✅ vX.Y.Z shipped.
- Release tag:  vX.Y.Z (github.com/.../releases/tag/vX.Y.Z)
- PR #N:        MERGED at [timestamp]
- Commit:       [sha] on main
- kVersion:     property kVersion : "X.Y.Z"
```

Never leave ship state ambiguous.
