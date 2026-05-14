---
name: smoke-test-after-deploy
id: RL-0040
keywords: [smoke, test, after]
---

# Smoke test after every deploy

CI green != live working. Smoke testing is the final mile: `curl` the live endpoint, click the live page, `psql` the live row count. It catches the gaps CI can't:

- Schema default columns you forgot (the `is_public` gotcha)
- Environment variables not set on prod
- Routes that load but return `{}` instead of expected shape
- Migrations that ran successfully but didn't insert because of `ON CONFLICT`
- Permissions on uploaded files
- DNS / cache / CDN propagation

## The minimum smoke test per surface

### Backend

```bash
curl -sS https://api.your-domain.com/health | jq .ok
curl -sS https://api.your-domain.com/<new-endpoint>
psql $PROD_DATABASE_URL -c "SELECT ... FROM <new-table>;"
```

### Marketing / player-web

```bash
curl -sS -o /dev/null -w 'HTTP %{http_code}' https://your-site.com/<new-page>
```

Plus a visual click-through if the change is visual.

### Admin

- Open `/admin/<new-page>`
- Verify the new feature appears in `/admin/features` if registered
- Verify the new plan appears in `/admin/plans` if registered

## What to do when smoke fails

1. Re-read the failed query/response carefully — most "smoke fails" are off-by-one in the smoke script itself
2. If it's a real prod gap: open a fix PR same session. Don't leave a half-deployed feature
3. If the gap is gnarly, roll back via `git revert` of the merge commit + redeploy

## Origin

Trainer-marketplace session: PR #817 deployed successfully (CI green, backend healthy). But `curl /public/plans/trainer-marketplace` returned `plan_not_found`. Root cause: `is_public` defaults FALSE. Caught only because I ran the smoke test rather than declaring "merged, done."
