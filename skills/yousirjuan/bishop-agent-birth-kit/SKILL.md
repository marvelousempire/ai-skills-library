---
name: bishop-agent-birth-kit
id: SK-0127
keywords: [run-bishop, check-agent, build-birth]
hash: 7685c2c
relations: []
before: []
governed_by: [global]
meta: dynamic
  - bishop create agent
  - certificate of origin
  - agent birth
  - memory.md
  - AI_AGENT_RULES
goal: Scaffold Bishop-born agents with birth certificate, memory, and rules binder.
domain: yousirjuan
status: Active
tool: Cursor
description: >
  When Bishop creates an agent, always issue certificate-of-origin.md, memory.md,
  and AI_AGENT_RULES/. Single DRY path via bishop/manager.py and core/agent_birth_kit.py.
---

# Bishop Agent Birth Kit

## Mandatory on every birth

| File | Role |
|------|------|
| `certificate-of-origin.md` | Immutable birth certificate |
| `memory.md` | Mutable facts (not rules) |
| `AI_AGENT_RULES/` | Must-follow law (child of Nephew master schema) |
| `AI_AGENT_RULES/SRIC.md` | **Mandatory** — Strict Registered Intent & Capabilities; decline out-of-scope with reason + alternatives |

## SRIC on every birth

- Template ships `SRIC.md` + `OPERATING_RULES.md` decline discipline.
- Manifest may set `stack_bible_path` (AISL tech-stack **ledger index** — `stack.ledger.yaml`) and `sric_capabilities` (ids from `ledger/capabilities.yaml`). If `stack_bible_path` is set, `sric_capabilities` must be non-empty.
- Generic `capabilities` on manifest must be non-empty (e.g. `chat`, `task_execution`).
- Cinematic stack example: `skills/engineering/tech-stacks/cinematic-reality-ui/stack.ledger.yaml` + `SRIC.md`

## DRY paths (do not duplicate)

- `bishop/bishop/manager.py` → `create_agent()`
- `bishop/core/agent_birth_kit.py` → `install_birth_kit()`
- `bishop/core/certificate_of_origin.py` → render certificate
- `bishop/agents/manifests/_template/` → clone source

## Backfill existing agents

```bash
cd /Users/nivram/Developer/bishop
python scripts/backfill-agent-birth-kit.py --dry-run
python scripts/backfill-agent-birth-kit.py
```

## Docs

- `bishop/docs/agent-anatomy.md`
- `bishop/docs/nephew-alignment.md`
- `bishop/AI_AGENT_RULES/OPERATING_RULES.md`

## Not passports

Nephew `registries/passports/` is routing only. Birth certificates are Bishop-only.
