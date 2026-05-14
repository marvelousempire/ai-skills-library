# 09 — yousirjuan alignment

Every skill that ships infrastructure or operational tooling anchors back to a yousirjuan platform-plan category. This keeps the library + the plan in lockstep — no skill exists in a vacuum.

## The 12 categories

| # | Category | Example skill |
|---|---|---|
| 1 | Inputs & ingestion | — |
| 2 | Knowledge & embeddings | — |
| 3 | Reasoning & generation | seeme (multi-provider) |
| 4 | AI assistants & UIs | seeme (web UI + MCP) |
| 5 | Voice | (external skills) |
| 6 | Media generation | (external skills) |
| 7 | Evaluation & QA | (planned) |
| 8 | Orchestration | (planned) |
| 9 | Workspaces & namespaces | — |
| 10 | Infrastructure & deployment | dockyard, self-hosted-git, console |
| 11 | Governance, GitOps & operational memory | self-hosted-git (GitLab CE) |
| 12 | Hardware & compute roles | (Mac mini target documented) |

Full list: [`docs/yousirjuan-platform-skills-master.md`](../yousirjuan-platform-skills-master.md).

## When a skill ships

Add a row to:
- `docs/yousirjuan-platform-skills-master.md` (if anchored)
- `docs/yousirjuan-upstream-repo-ledger.md` (if it consumes an upstream tool)

Status values: `Active` (skill ready), `Planned` (in the plan, not yet built), `Alternative` (considered, not selected), `Legacy` (was active, now superseded).

## Why

The plan describes what should exist; skills describe how to bring each piece into existence. When a skill ships, the plan should reflect it. Otherwise the plan drifts into fiction.

## Exercise

Open [`docs/yousirjuan-platform-skills-master.md`](../yousirjuan-platform-skills-master.md), find Category 10 (Infrastructure). Verify that Dockyard, Colima, OrbStack are all listed with appropriate statuses.

## Next

[`10-improvement-loops.md`](10-improvement-loops.md).
