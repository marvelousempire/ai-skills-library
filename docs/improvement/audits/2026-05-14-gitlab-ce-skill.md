# Gap audit — self-hosted-git skill (GitLab CE + CI templates + dashboard)

**Date:** 2026-05-14
**Shipped:** `skills/infra/self-hosted-git/` — gitlab-compose.yml + 5 CI templates + TUTORIAL.md + dashboard + backup.sh + upgrade-checklist + migration-from-github + Forgejo decision record + yousirjuan-context
**Commits:** `be12ab0` → `5cbdbd8` → `7014726`

## Gaps

1. **GitLab CE Docker build untested end-to-end** — local Docker daemon hung 3× during the session.
2. **`backup.sh` not wired into launchd plist** — daily cron is manual.
3. **Runner registration is manual** — token + `gitlab-runner register` command. Auto-registration via the registration token API is possible.
4. **CI dashboard token never refreshed** — token entered in `.env` is permanent; no rotation guidance.
5. **No CI integration test against a real GitLab instance** — CI templates ship but haven't run against the actual self-hosted instance.

## Elevations

A. **Auto-pull repos from GitHub on first boot** — `migrate-from-github.sh` exists but doesn't trigger automatically.
B. **GitLab webhook → Slack/Discord** integration for pipeline failures.
C. **Multi-arch CI builds** — `buildx` with both ARM64 (Mac mini) and AMD64 runners.
D. **Trigger pipelines from the CI dashboard** — currently read-only. Adding `api` scope on the token unlocks this.
E. **Live log streaming for the currently-running CI job** in the dashboard.
F. **GitLab Pages for the Homelab Console + SEEME web UI** — host them inside GitLab's web surface.

## Decision

Foundation shipped; everything above deferred until Mac mini + Docker daemon health are stable.

## Open items (deferred)

→ `gaps-open.md`: 1, 2, 3
→ `elevations-deferred.md`: A, B, C, D, E

## Linked

- **Plan:** none — direct execution from the user's "build that" reply
- **Session report:** [`docs/reports/2026-05-14-sovereign-stack-and-master-repo.md`](../../reports/2026-05-14-sovereign-stack-and-master-repo.md)
- **Decision record:** [`skills/infra/self-hosted-git/references/gitlab-vs-forgejo.md`](../../../skills/infra/self-hosted-git/references/gitlab-vs-forgejo.md)
