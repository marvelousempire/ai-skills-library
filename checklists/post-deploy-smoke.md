# Post-deploy smoke checklist

Run after every deploy completes (`gh run list` shows `success`). Don't declare "live" without these.

## Backend

```bash
curl -sS https://api.your-domain.com/health | jq .ok                  # service up
curl -sS https://api.your-domain.com/<new-endpoint> | jq .             # new endpoint live + correct shape
curl -sS https://api.your-domain.com/public/plans/<new-plan> | jq .id  # if plan registered
psql $PROD_DATABASE_URL -c "SELECT COUNT(*) FROM <new-table>;"         # schema landed (where safe)
psql $PROD_DATABASE_URL -c "SELECT id, status FROM features WHERE id BETWEEN '<min>' AND '<max>';"
```

## Marketing / player-web

```bash
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' https://your-site.com/<new-page>
# Expected: 200, not 404 or 500
```

Plus a visual click-through if the change is visual.

## Admin

- [ ] `/admin/plans` shows new plan card (if registered)
- [ ] `/admin/features?section=<section>` shows new features (if registered)
- [ ] Sidebar entries visible if new (see `sidebar.tsx` AND `admin-nav.ts` — both must list the entry, per the 0.18.1 pain entry)

## Specific gotchas

- [ ] **plans.is_public**: if a new plan was registered, `curl /public/plans/<slug>` must NOT return `plan_not_found`
- [ ] **feature_surfaces**: every feature should have ≥1 surface row
- [ ] **CHANGELOG.md** on prod: did the entry actually land?
- [ ] **Version bumps**: `curl /health` should return the new version

## What to do when smoke fails

1. Re-read the failed query/response carefully — most "smoke fails" are off-by-one in the smoke script itself
2. If it's a real prod gap: open a fix PR same session
3. If gnarly: `git revert` the merge commit + redeploy
