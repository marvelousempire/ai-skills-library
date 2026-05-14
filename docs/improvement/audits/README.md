# Audits

After-ship gap-audits + elevation-passes. Each one is dated, scoped, and links back to the commits / plan / session report that produced it.

## How to add an audit

```sh
cp docs/templates/gap-audit.md.template docs/improvement/audits/$(date +%Y-%m-%d)-<scope>.md
```

Fill in: gaps (numbered, specific), elevations (lettered), what the user picked.

Then:

- Append open gaps to [`../gaps-open.md`](../gaps-open.md)
- Append deferred elevations to [`../elevations-deferred.md`](../elevations-deferred.md)
- Cross-link from the session report

## Index (newest first)

| Date | Scope | Audit |
|---|---|---|
| 2026-05-14 | SEEME 1.0 (CLI + MCP + Web UI + Docker) | [`2026-05-14-seeme-v1.md`](2026-05-14-seeme-v1.md) |
| 2026-05-14 | SEEME Docker setup | [`2026-05-14-seeme-docker.md`](2026-05-14-seeme-docker.md) |
| 2026-05-14 | Homelab Console | [`2026-05-14-homelab-console.md`](2026-05-14-homelab-console.md) |
| 2026-05-14 | self-hosted-git (GitLab CE + CI templates + dashboard) | [`2026-05-14-gitlab-ce-skill.md`](2026-05-14-gitlab-ce-skill.md) |
| 2026-05-14 | Dockyard integration | [`2026-05-14-dockyard-integration.md`](2026-05-14-dockyard-integration.md) |

## Template

[`_template.md`](_template.md)
