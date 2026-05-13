# Rules catalog

| Rule id | Always apply | Globs | Pack |
|---------|----------------|-------|------|
| `dev-discipline` | yes | — | red-e-play-core |
| `changelog-and-versioning` | yes | — | red-e-play-core |
| `go-live-path` | yes | — | red-e-play-core |
| `parallel-surfaces-from-day-one` | yes | — | red-e-play-core |
| `ascii-flow-diagrams` | yes | — | global-communication |
| `pbxproj-conflict` | yes | `**/*.pbxproj` | ios-build |
| `migration-race-guard` | yes | `**/migrations/*.sql` | backend-discipline |
| `swift-codable-guard` | no | `**/*.swift` | ios-build |
| `shared-util-extraction` | yes | `**/routes/*.js, **/*.swift` | backend-discipline |

Edit a rule in `rules/library/<id>/` then re-run [`scripts/sync-rules-into-repo.sh`](../scripts/sync-rules-into-repo.sh).
