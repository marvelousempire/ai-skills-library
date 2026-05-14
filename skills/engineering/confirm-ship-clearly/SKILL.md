---
name: confirm-ship-clearly
id: SK-0016
keywords: [confirm, ship, clearly]
description: >-
  Every shipping confirmation must be unambiguous. Show all four: release
  tag, PR state+mergedAt, commit hash on main, and kVersion in the canonical
  file. Never say "it should be shipped" or "the merge went through" — show
  the receipts. Triggers on "is it shipped", "confirm delivery", "did it
  merge", "verify it went through", "show me the release", "is the tag fired",
  "confirm ship state", "check if it landed".
---

# Confirm ship clearly — show the four receipts, every time

The failure: "the PR merged so it should be live." Three hours later the user discovers the auto-release workflow failed silently. The fix: after every merge, confirm all four checkpoints before calling it shipped.

## When to use

After every `gh pr merge`, every deploy, every release — without being asked. The user should never have to wonder whether something actually shipped.

## The four receipts

```
✅ v0.27.0 shipped.

Release tag:   v0.27.0  (github.com/.../releases/tag/v0.27.0)
PR #64:        MERGED at 2026-05-14T16:46:18Z
Commit:        21c5532 on main
kVersion:      property kVersion : "0.27.0"
```

**How to get each one:**

```sh
# Release tag
gh release list --limit 3

# PR state
gh pr view <N> --json state,mergedAt

# Latest commit on main
git fetch origin && git log --oneline origin/main -1

# kVersion (DustPan)
grep "kVersion" dustpan.applescript | head -1

# Version (Node/web apps)
grep '"version"' package.json | head -1

# Version (any API)
curl -s http://127.0.0.1:8765/api/status | python3 -c "import sys,json; d=json.loads(sys.stdin.read()); print('version:', d.get('version','?'))"
```

## What "shipped" actually means (all must be true)

- [ ] PR state is `MERGED` (not just "closed")
- [ ] `mergedAt` timestamp exists
- [ ] The release tag appears in `gh release list` as `Latest`
- [ ] The tag version matches the canonical version file
- [ ] `git log origin/main -1` shows the merge commit

If ANY of these are missing — it's not shipped. Investigate before declaring.

## Anti-patterns

- ❌ "The PR went through" — PR closed ≠ PR merged ≠ release fired
- ❌ "It should be live" — should is not confirmed
- ❌ Showing only the PR number without the state
- ❌ Not checking whether the auto-release workflow actually ran
- ❌ Declaring shipped before `gh release list` shows the new tag

## Invocation

- "Use **confirm-ship-clearly**."
- The skill fires automatically after every merge — no prompt needed.
