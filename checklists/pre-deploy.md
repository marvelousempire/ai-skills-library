# Pre-deploy checklist

Run before triggering `Deploy backend / admin / marketing` workflow.

## Migration safety

- [ ] New migration files reviewed against `migration-shipping` skill checklist
- [ ] BEGIN/COMMIT semantics correct (ALTER TYPE outside, everything else inside)
- [ ] Idempotency confirmed — file can re-run without side effects
- [ ] FK types verified against parent tables
- [ ] is_public flips explicit on plan inserts

## Environment

- [ ] `.env.production` exists on prod (per `Web-3` pain journal entry)
- [ ] No new `process.env.XXX` references without the var being set
- [ ] Stripe / OpenAI / Anthropic / Resend keys exist on prod if newly required

## Surface readiness

- [ ] Backend: `npm test` green locally (if tests exist for the changed surface)
- [ ] Marketing: `cd marketing && pnpm build` succeeds locally (catches lint + tsc)
- [ ] Admin: same `pnpm build` check
- [ ] iOS: `xcodebuild -destination 'generic/platform=iOS Simulator'` clean if `project.pbxproj` touched

## Rollback path

- [ ] If deploy fails, do you know the forward-only fix?
- [ ] If deploy succeeds but smoke fails, is `git revert` of the merge commit clean?

## Authorization

- [ ] Pre-authorized surface (backend / admin / marketing) per CLAUDE.md OR explicit user "deploy" go-ahead for substantive multi-PR plans
