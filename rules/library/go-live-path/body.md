---
name: go-live-path
id: RL-0017
keywords: [enforce-live, check-path, file-live]
hash: 9d57415
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Go live path — never defer

When this repo’s work **ships** (code, migrations, config that affects production), you **must** treat **“what you need to do to see it live”** as part of the **same deliverable** as the implementation—not a follow-up chat, not “documentation later.”

## Mandatory behavior

1. **State the go-live path in your response** before considering the task done: which surfaces changed (**backend** / **admin** / **marketing** / **iOS**), **Postgres migrations** (run `migrate` / which new `.sql` files), **deploy mechanism** (merge to `main`, then **Actions → Run workflow** on `deploy-{backend,admin,marketing}.yml` → `pm2 reload` on success), and **how to verify** (URLs, admin pages, API curls).
2. **Do this immediately** in the same turn as the code/docs—do not wait for the user to ask.
3. **No exceptions for “forced” or urgent ships.** Hotfix, emergency merge, or “just push it” **still** require the go-live checklist in writing. Forcing live does not remove the obligation to name migrations, deploy targets, and smoke checks—it tightens the need for clarity so nobody merges blind.

## Align with pipeline truth

Per [`dev-discipline.mdc`](dev-discipline.mdc), name the real stage: **committed → pushed → PR’d → merged → deployed**. “Done” without a stage is not status. If you only committed locally, say so and give **`git push`** / **PR** / **migrate** as the next steps.

## Minimum checklist shape

Adapt to the diff; always hit these when relevant:

- **DB:** `npm run migrate` (or project equivalent) on **production**; name new migration files.
- **API:** run **Deploy backend** workflow after merge; `pm2` is handled inside the workflow.
- **Web:** run **Deploy admin** / **Deploy marketing** workflows after merge; **`pnpm build`** for `marketing/**` when rules require it before push.
- **Verify:** concrete checks (e.g. `GET /public/…`, admin page path, feature flag).

If production access is not available from the agent environment, **still** publish the exact steps so the operator can run them in order—same requirement.

## Version confirmation step (added 2026-05-14)

After deploy CI shows green, **confirm the live version matches your commit
before calling the work done or debugging any reported issue:**

```bash
curl -s “https://readyplay.app/” | grep -o ‘[0-9]\+\.[0-9]\+\.[0-9]\+’
```

The smoke test checks HTTP 200. It does NOT check which version is responding
or whether the specific change works. A deploy can show green while the VPS
still serves an old build.

If a user reports “still broken” after a green deploy — check the version
first. If the version is old, the deploy didn’t fully land. If the version
is correct and the bug persists, the fix is wrong.
See [`live-version-before-debug`](live-version-before-debug.mdc) and
[`root-cause-not-symptom`](root-cause-not-symptom.mdc).

## Anti-patterns

- Shipping a migration file without saying **where** it must run and **after** which deploy step.
- Closing with “merge when ready” without **migrate + reload + smoke** when the change isn’t live until those run.
- Assuming “CI handles it” without naming **which workflow** and **what green means** for this change.
- Reporting “deployed” without confirming the live version matches the deployed commit.

This rule applies to **Cursor, Claude Code, ChatGPT, or any assistant** operating under this repo’s rules: **go-live discipline is not optional.**
