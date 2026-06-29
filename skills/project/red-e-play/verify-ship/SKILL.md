---
name: verify-ship
id: SK-0124
keywords: [verify-ship, check-deploy, confirm-release]
goal: Deliver verify ship output correctly and completely.
hash: f850b2d
relations: []
before: []
governed_by: [global]
meta: dynamic
description: Audit whether work has actually shipped — committed, pushed, merged, deployed. Use when the user asks variants of "did it ship", "is it on origin", "are we backed up", "did we merge", "is this in main yet", "is the build live", "is the redesign deployed", "show me the state". Returns a concrete table of git state + PR state + version on each surface so the user can confirm at a glance instead of getting piecemeal answers.
---

# verify-ship — confirm work has actually shipped

When the user asks any variant of "did it really ship?", run a complete state audit instead of verbally claiming "yes, done." This skill produces the table they want.

## What to check

Always run these in parallel via the Bash tool, then assemble a single table:

1. **Local git state** (current worktree)
   - `git status --short` → uncommitted edits
   - `git log @{u}..HEAD --oneline` → commits ahead of upstream
   - `git rev-parse --abbrev-ref HEAD` → current branch

2. **origin/main vs local** (the source of truth)
   - `git fetch origin --quiet`
   - `git log origin/main --oneline -5` → recent merges
   - `git log @{u}..origin/main --oneline 2>/dev/null` → main is ahead of branch (rebase needed?)

3. **Version on each surface** (only the ones touched in this session)
   - **iOS:** `git show origin/main:"Red-E Play/RedEPlay.xcodeproj/project.pbxproj" | grep -E "MARKETING_VERSION = |CURRENT_PROJECT_VERSION = " | sort -u`
   - **Marketing:** `git show origin/main:marketing/package.json | grep version`
   - **Admin:** `git show origin/main:admin/package.json | grep version`

4. **Open PRs touched in this session** — list state + mergedAt for each
   - `gh pr view <id> --json state,mergedAt,mergeCommit`

## Output format

A markdown table the user can scan in 3 seconds:

```
| What                       | Where                          | State        |
|----------------------------|--------------------------------|--------------|
| iOS profile redesign       | origin/main commit abc123      | ✅ Merged    |
| Marketing flat sections    | origin/main commit def456      | ✅ Merged    |
| Compare tab + pin-to-home  | PR #484                        | ⏳ CI pending |
| Local working tree         | clever-chatelet-3b05a5         | clean        |
| Versions on origin/main    | iOS 0.18.55 / build 178        | —            |
|                            | marketing 0.13.5               | —            |
```

## Hard rules

- **Never claim merged without checking origin.** Always run `gh pr view <id> --json state` and assert `state == MERGED`. Hopeful "I think it merged" is the failure mode.
- **Surface gaps in plain language.** If something is local-only, say "⚠️ N commits on <branch> not pushed yet." Don't bury bad news in a table.
- **Be specific about TestFlight (operator-only).** iOS PRs merging to main does NOT mean the app on the user's phone is updated. Agent "done" = verify build green + merged. Always note: "clean bill delivered — operator archives/uploads TestFlight in Xcode when ready." Agents do **not** archive, upload, or watch TestFlight processing unless explicitly asked (see `ios-testflight-operator-only`).

## When to pair with hooks

The `auto-push-after-commit.sh`, `verify-pr-merged.sh`, `preflight-gh-auth.sh`, and `end-of-session-audit.sh` hooks at `~/.claude/hooks/` enforce these things automatically on every relevant tool call. This skill is the **on-demand audit** the user pulls when they want a complete picture beyond what the per-tool hook prints.

## Example prompts that should trigger this

- "did we merge?"
- "is it on origin?"
- "are we backed up?"
- "did that ship?"
- "is the redesign in main yet?"
- "show me the state"
- "what version is on origin?"
- "i don't see the change yet — where is it?"
