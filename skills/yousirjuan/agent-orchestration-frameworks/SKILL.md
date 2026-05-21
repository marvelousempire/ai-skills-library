---
name: agent-orchestration-frameworks
id: SK-0133
keywords: [choose-orchestration, check-langgraph, build-crew]
hash: pending
relations: [parallel-agent-coordination]
before: []
governed_by: [global]
meta: dynamic
  - LangGraph
  - CrewAI
  - LangChain
  - LEAD-SHEET orchestration
  - multi-agent
goal: Choose folder-first orchestration vs LangGraph/CrewAI; LangChain remains candidate until dependency is chosen.
domain: yousirjuan
status: Active
tool: Cursor
description: >
  Decision tree for Nephew/Bishop orchestration. Default is Application→Agent→Skill→Tool→Action→Intent
  and LEAD-SHEET conductors — not LangChain packages.
---

# Agent orchestration frameworks

## Default (use first)

**Folder + LEAD-SHEET orchestration** — no extra Python orchestration package.

| Layer | Where |
|-------|--------|
| Application | Repo root (`bishop/`, `nephew/`, product app) |
| Agent | `bishop/agents/<name>/` |
| Skill / Tool / Action / Intent | `Skills/.../Tools/.../Actions/...` per APPLICATION_STRUCTURE |
| Conductor | Nephew CLOAK MCP, chain-of-command agents in AISL |
| Checkpoint pattern | Nephew `src/checkpoint.js` (LangGraph-*inspired*, not LangGraph runtime) |

References:

- Nephew [`talents/Agent Orchestration.md`](../../../nephew/talents/Agent%20Orchestration.md)
- Nephew [`docs/whitepapers/multi-agent-orchestration.md`](../../../nephew/docs/whitepapers/multi-agent-orchestration.md) — Nephew **above** frameworks; LangGraph adapter **future**
- AISL **parallel-agent-coordination** — multi-surface Cursor work, not LangChain

## Decision tree

```
Need orchestration?
├─ Single repo, human+IDE agents, manifest/LEAD-SHEET already present?
│  └─ YES → LEAD-SHEET + Bishop/Nephew agents (no new dep)
├─ Must have graph state machine, durable checkpoints, conditional edges in Python?
│  └─ YES → Plan Phase 2: add langgraph + adapter; read bishop plan 0012
├─ Role-based "crew" with minimal custom code?
│  └─ YES → Evaluate CrewAI (separate plan; watch conflict with folder-first)
└─ LangChain chains / LCEL only?
   └─ LangChain is **Candidate** in platform master — do not add to requirements until
      operator picks LangChain vs LangGraph vs neither (billing + complexity)
```

## Framework comparison (2026)

| Framework | Best for | Bishop/Nephew today |
|-----------|----------|---------------------|
| **LEAD-SHEET / folders** | Your hierarchy, git-tracked plans, per-agent law | **Primary** |
| **LangGraph** | Stateful production graphs | **Not installed** — future adapter |
| **CrewAI** | Role crews | Optional later |
| **LangChain** | Chains, tools, retrievers | **Not installed** — Candidate only in [`docs/yousirjuan-platform-skills-master.md`](../../docs/yousirjuan-platform-skills-master.md) |
| **AutoGen** | Conversational multi-agent | Not default |

## LangChain status

- **Not** in `bishop/requirements.txt` or Nephew Node deps for orchestration.
- Listing in platform master remains **Candidate** until:
  1. A numbered plan chooses LangChain *or* LangGraph *or* stays folder-only.
  2. Skill + requirements.txt updated together.
- Do not tell operators "merge and Actions will run LangChain" — CLI-first / laptop deploy rules apply.

## Bishop-specific

- Pydantic manifests: **bishop-pydantic-manifest-validation**
- Seven Houses stub: **bishop-seven-houses-pipeline** (not LangGraph engine)
- Birth: **bishop-agent-birth-kit**

## Nephew-specific

- Session load / dispatch: `nephew-cloak` MCP tools (`nephew_dispatch_evaluate`, `nephew_orchestrate_plan`)
- Do not replace CLOAK with LangChain without ADR + plan

## Phase 2 checklist (when user asks for LangGraph)

1. Write `bishop/plans/00NN-langgraph-adapter.md` or Nephew equivalent.
2. Add `langgraph` to requirements with version pin; implement adapter behind `SevenHousesPipeline.house_runner` or separate module.
3. Update this skill and ARCHIVE-INDEX "aspirational → shipped".
4. Run tests + `make cursor-skills-link` on consumer repos.
