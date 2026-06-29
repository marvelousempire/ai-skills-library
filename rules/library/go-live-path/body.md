---
name: go-live-path
id: RL-0017
keywords: [enforce-live, check-path, file-live]
goal: Deliver go live path output correctly and completely.
hash: 9d57415
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Go live path — never defer

When this repo’s work **ships** (code, migrations, config that affects production), you **must** treat **“what you need to do to see it live”** as part of the **same deliverable** as the implementation—not a follow-up chat, not “documentation later.”

Git/PR/deploy law (Red-E Play and aligned repos): Nephew `AI_AGENT_RULES/GIT_REPO_COMMIT_MERGE_AND_SQUASH_PUSH_PR_MR_RULE.md` — branch, heredoc commit/PR, squash merge, **zero GitHub Actions**, laptop `make deploy-*`.

## Mandatory behavior

1. **Execute the full ship cycle in one pass** when authorized: code → explicit-path stage → heredoc commit → push → heredoc `gh pr create` → `gh pr merge --squash --delete-branch` → **`make deploy-<surface>`** from the Mac (Red-E Play) or repo-documented SSH deploy → smoke-test live URLs.
2. **State** which surfaces changed (**backend** / **admin** / **marketing** / **player-web** / **iOS**), **Postgres migrations**, and **how to verify** (URLs, curls, admin paths).
3. **Do this immediately** in the same turn as the code/docs—do not wait for the user to ask.
4. **No exceptions for forced or urgent ships** — deploy + smoke still required.

## Forbidden

- `gh workflow run`, `gh run watch`, waiting on GitHub Actions for deploy or merge gates
- “Merge when ready; CI will deploy”

## Align with pipeline truth

Per `dev-discipline`: **committed → pushed → PR’d → merged → deployed**. “Done” without a stage is not status.

## Minimum checklist shape

- **DB:** `npm run migrate` on production during backend deploy; name new migration files.
- **API:** `make deploy-backend` from laptop (Red-E Play).
- **Web:** `make deploy-admin` / `make deploy-marketing` / `make deploy-player-web`; local `pnpm build` before push when rules require it.
- **iOS:** zero-error zero-warning `xcodebuild` verify only — report version + build as the clean bill. **Operator** uploads TestFlight in Xcode; agents do not (see `ios-testflight-operator-only`).
- **Verify:** concrete curls and version checks.

## Version confirmation

After deploy, confirm live version before calling work done:

```bash
curl -s "https://readyplay.app/" | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+'
```

See `live-version-before-debug` and `root-cause-not-symptom`.

## Anti-patterns

- Assuming CI or Actions handles deploy
- Reporting “deployed” without `make deploy-*` smoke proof

This rule applies to every assistant under this repo’s rules: **go-live discipline is not optional.**
