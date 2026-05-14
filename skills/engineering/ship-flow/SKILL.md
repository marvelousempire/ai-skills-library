---
name: ship-flow
description: >-
  Run the full commit → push → PR → CI watch → merge → deploy → smoke-test pipeline. Names the pipeline stage at every step. Stops + reports if anything fails (CI red, conflict, deploy failure, smoke gap). Pre-authorized for backend/admin/marketing per red-e-play CLAUDE.md.
trigger: >-
  Use when work is ready to ship — "ship it", "merge and deploy", "let's get this live", or at the end of any session where code lands at quality bar. Also fires automatically when CI goes green on a PR that's already open.
---

# /ship-flow

## What this skill does

Runs the full 7-stage shipping pipeline:

1. **Stage files by explicit path** (no `git add -A`)
2. **Commit** with a structured message + Co-Authored-By trailer
3. **Push** via `git push --force-with-lease origin HEAD:<branch-name>` (force-with-lease, never force)
4. **Open PR** via `gh pr create` with a structured body (Summary / What's in the diff / Test plan)
5. **Watch CI** until `[.statusCheckRollup[]?.conclusion] | join(",")` is all SUCCESS — report and stop if anything FAILS
6. **Merge** via `gh pr merge --squash` from the main checkout (never from inside the worktree being merged)
7. **Deploy** by triggering the surface-specific workflow (`Deploy backend to api.readyplay.app`, `Deploy admin to admin.readyplay.app`, `Deploy marketing to VPS`, etc.)
8. **Smoke test** the live URL — `curl /health`, check the new endpoint, verify expected shape

After each stage, the skill announces the pipeline stage explicitly (per [`pipeline-stage-truth`](../../../rules/library/pipeline-stage-truth/body.md)).

## When to stop the flow

- CI fails — stop, report, wait for human direction (do not retry blindly)
- Merge conflict on rebase — escalate to [`rebase-changelog-resolver`](../rebase-changelog-resolver/SKILL.md) skill
- Deploy fails — investigate logs, propose forward-only fix (per [`forward-only-migration-fix`](../../../rules/library/forward-only-migration-fix/body.md))
- Smoke gap — open a fix PR same session (don't leave a half-deployed feature)

## Pre-authorization scope (red-e-play)

Per red-e-play's CLAUDE.md "Auto-merge & deploy authorization":

- ✅ **backend, admin, marketing** — pre-authorized for full ship cycle
- ⚠️ **iOS** — pre-authorized through TestFlight; App Store submission requires explicit user sign-off
- ⚠️ **Substantive multi-PR plans** — per user's `feedback_deploy_authorization_scope` memory, deploy needs explicit "deploy" go-ahead

## The final report shape

```
| PR | Title | Files | Status | Deployed |
|---|---|---|---|---|
| #NNN | ... | ... | ✅ MERGED | ✅ Live (smoke ✓) |
```

## Origin

Trainer-marketplace session: 3 PRs each went through this exact pipeline. The final delivery report named the stage of each. See `docs/master-reports/2026-05-14-trainer-marketplace-session.md`.

## Related

- [`agents/ship-flow-runner.md`](../../../agents/ship-flow-runner.md) — agentic version that runs all stages background
- [`checklists/pre-merge.md`](../../../checklists/pre-merge.md)
- [`checklists/post-deploy-smoke.md`](../../../checklists/post-deploy-smoke.md)
