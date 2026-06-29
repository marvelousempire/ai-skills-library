# Rules catalog

| Rule id | Always apply | Globs | Pack |
|---------|----------------|-------|------|
| `dev-discipline` | yes | — | red-e-play-core |
| `changelog-and-versioning` | yes | — | red-e-play-core |
| `go-live-path` | yes | — | red-e-play-core |
| `ios-testflight-operator-only` | yes | — | red-e-play-core, ios-build |
| `parallel-surfaces-from-day-one` | yes | — | red-e-play-core |
| `ascii-flow-diagrams` | yes | — | global-communication |
| `pbxproj-conflict` | yes | `**/*.pbxproj` | ios-build |
| `migration-race-guard` | yes | `**/migrations/*.sql` | backend-discipline |
| `swift-codable-guard` | no | `**/*.swift` | ios-build |
| `shared-util-extraction` | yes | `**/routes/*.js, **/*.swift` | backend-discipline |
| `add-agent-to-skills-library` | yes | `agents/**, docs/external-tools.manifest.json, skills/external/**` | (uncategorized) |
| `metadata-post-or-product-mode` | no | `skills/**, agents/**, rules/library/**, **/post-meta.json, AI_AGENT_RULES/**` | repo-discipline |

Edit a rule in `rules/library/<id>/` then re-run [`scripts/sync-rules-into-repo.sh`](../scripts/sync-rules-into-repo.sh).

---

## Rules added 2026-05-14 — You-Sir Juan OS session learnings

| Rule ID | What it enforces | Severity |
|---|---|---|
| `associate-agent-terminology` | "Associate Agent" not "butler" — everywhere, always | error |
| `readme-reflects-reality` | README must describe current built state, not aspirational | warning |
| `port-alignment` | Ports defined once in .env.example, read everywhere | error |
| `marketing-doc-per-feature` | Every shipped feature gets docs/marketing/NN-name.md | warning |
| `hardware-before-installer` | Write hardware compat doc before writing the installer | warning |
| `yousirjuan-skills-pack-path` | You-Sir Juan skills only under `skills/yousirjuan/` — never `skills/project/yousirjuan/` | error |

Full rule bodies: `rules/library/<rule-id>/body.md`
