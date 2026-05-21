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
  AI_AGENT_RULES/ (with LEAD-SHEET.md), Core/, Talents/, and Skills/. Single DRY path via
  kingdom/manager.py, core/agent_birth_kit.py, and core/agent_surfaces_kit.py.
---

# Bishop Agent Birth Kit

## Mandatory on every birth (football team kit)

Bishop **dresses the whole team**. Every change in `_template` **must trickle down** via `make agents-sync-all` to **every** agent under `bishop/agents/`.

| Gear | Artifacts | Role |
|------|-----------|------|
| **Helmet** | `AI_AGENT_RULES/` + `LEAD-SHEET.md` + `SRIC.md` | Law binder (child of Nephew master schema) |
| **Shoulder pads** | `WORKSPACE_HOST.json` + `AI_AGENT_RULES/WORKSPACE_FRONT_DOOR_RULE.md` | Agent answers **own door** — not Nephew, not Bishop factory |
| **Wristbands** | `.cursor/rules/<agent>-workspace-host.mdc`, `AGENTS.md`, `CLAUDE.md` | IDE surfaces show host identity |
| **Lessons** | `Profile/Lessons/` + `journal.pointer.json` | Reasoning library — symlinks to `NEPHEW_ROOT/Journal/learnings/` on `make agents-sync-all` |

| File | Role |
|------|------|
| `certificate-of-origin.md` | Immutable birth certificate |
| `memory.md` | Mutable facts (not rules) |
| `Core/api`, `Core/mcp`, `Core/brain` | **Core add-ons** — `CORE_FOLDER_RULE.md` (not under `Tools/`) |
| `Talents/*.md` | Capability shop — product cards; acquire → equip `Skills/` |
| `Skills/<skill_id>/` | Equipped skills (after acquiring a talent) |
| `Skills/<skill>/Tools/<tool>/Actions/...` | **Workflow tools** per APPLICATION_STRUCTURE (intents at bottom) |

**Front door:** Host greets users in this agent card. Use `pass_to_nephew` / `pass_to_bishop` to relay — do not impersonate upstream.

**Core vs Tools:** Core = birth kit (`Core/api|mcp|brain`). **Tools/** reserved only under `Skills/.../Tools/.../Actions/...`. See `CORE_FOLDER_RULE.md` and `bishop/AI_AGENT_RULES/APPLICATION_STRUCTURE.md`.

## SRIC on every birth

- Template ships `SRIC.md` + `OPERATING_RULES.md` decline discipline.
- Manifest may set `stack_bible_path` (AISL tech-stack **ledger index** — `stack.ledger.yaml`) and `sric_capabilities` (ids from `ledger/capabilities.yaml`). If `stack_bible_path` is set, `sric_capabilities` must be non-empty.
- Generic `capabilities` on manifest must be non-empty (e.g. `chat`, `task_execution`).
- Cinematic stack example: `skills/engineering/tech-stacks/cinematic-reality-ui/stack.ledger.yaml` + `SRIC.md`

## DRY paths (do not duplicate)

- `bishop/kingdom/manager.py` → `create_agent()`
- `bishop/core/agent_birth_kit.py` → `install_birth_kit()`
- `bishop/core/agent_surfaces_kit.py` → `Core/` add-ons
- `bishop/core/agent_structure_kit.py` → validate folder tree
- `bishop/core/agent_canonical_sync.py` → backfill existing agents
- `bishop/core/workspace_host_kit.py` → shoulder pads + wristbands (`install_workspace_host`)
- `bishop/core/agent_lessons_kit.py` → `Profile/Lessons/` symlinks from Nephew `Journal/learnings/`

## Fast spawn (Makefile soldiers)

```bash
cd ~/Developer/bishop
make agent-soldier AGENT=scout-alpha          # one pure node
make agent-soldiers AGENTS='alpha bravo'      # batch
make agents-sync-all                          # upgrade every existing agent
make agents-validate                          # structure check only
```
- `bishop/core/certificate_of_origin.py` → render certificate
- `bishop/agents/manifests/_template/` → clone source

## Backfill existing agents

```bash
cd /Users/nivram/Developer/bishop
python scripts/backfill-agent-birth-kit.py --dry-run
python scripts/backfill-agent-birth-kit.py
```

## Docs (canonical in Bishop only)

- `bishop/AI_AGENT_RULES/APPLICATION_STRUCTURE.md` — six-level hierarchy + dual Tool paths
- `bishop/docs/agent-birth-canal.md` — **primary** born-agent structure + play-by-play
- `bishop/docs/agent-anatomy.md` — short summary
- `bishop/docs/nephew-alignment.md`
- `bishop/AI_AGENT_RULES/OPERATING_RULES.md`

Product repos (e.g. scene-skout) must **bridge** to Bishop — not duplicate structure docs.

## Legacy layout

Agents born before Plan 0006 may have `api/`, `mcp/`, `brain/` at agent root. Migrate:

```bash
python scripts/migrate-agent-tools-layout.py --dry-run
```

## Not passports

Nephew `registries/passports/` is routing only. Birth certificates are Bishop-only.
