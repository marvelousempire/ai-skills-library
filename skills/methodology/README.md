# Methodology skills

How we work, not what we build. 12 methodology skills extracted from the 2026-05-14 sovereign-stack session, codifying the patterns that produced clean shipments.

| Skill | What it codifies |
|---|---|
| [`plan-first/`](plan-first/) | Write the plan before substantive work |
| [`gap-audit-and-elevation/`](gap-audit-and-elevation/) | After-ship audit pattern |
| [`idempotent-commands/`](idempotent-commands/) | `make ui` design philosophy |
| [`cross-reference-rippling/`](cross-reference-rippling/) | Add X → update Y, Z, W |
| [`verification-gates/`](verification-gates/) | Green checks before ship |
| [`multi-surface-design/`](multi-surface-design/) | CLI + MCP + Web + Docker for one engine |
| [`decision-records/`](decision-records/) | When + how to write |
| [`compliance-matrix/`](compliance-matrix/) | Per-stack compliance snapshots |
| [`aesthetic-consistency/`](aesthetic-consistency/) | Shared UI/CLI design language |
| [`graceful-degradation/`](graceful-degradation/) | "Down → pill, not crash" |
| [`migration-guide-format/`](migration-guide-format/) | "From X to Y" guides |
| [`doctor-script-pattern/`](doctor-script-pattern/) | Bash doctor scripts with color codes |

## Why a methodology family

The repo is a master report / study / training / improvement / filing system. The **method** behind every artifact is just as worth shipping as the artifacts themselves. Methodology skills are the standards-as-skills — invokable by name, citable in plans, drillable in training.

## Status

All 12 ship as **stubs with full frontmatter + intro** in this commit. Bodies flesh out over future sessions as we use each pattern more. The stubs are tracked so future agents know the name exists and can complete them.
