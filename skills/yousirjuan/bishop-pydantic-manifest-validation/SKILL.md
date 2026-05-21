---
name: bishop-pydantic-manifest-validation
id: SK-0131
keywords: [check-manifest, run-validator, build-bishop-agent]
hash: pending
relations: [bishop-agent-birth-kit]
before: [bishop-agent-birth-kit]
governed_by: [global]
meta: dynamic
  - bishop manifest
  - AgentManifest
  - AgentValidator
  - pydantic validation
  - manifest.json
goal: Validate Bishop agent manifests and on-disk folders using shipped Pydantic V2 code — not archive prose.
domain: yousirjuan
status: Active
tool: Cursor
description: >
  Use core/schemas.py AgentManifest and core/validation_metrics.py AgentValidator when
  editing manifest.json, birth flows, or kingdom API contracts. Archive Pydantic doc is reference only.
---

# Bishop Pydantic manifest validation

**Canonical code** (not `docs/archive/spec-sources/Pydantic is Perfect for Bishop.md`):

| Module | Role |
|--------|------|
| [`bishop/core/schemas.py`](https://github.com/marvelousempire/bishop/blob/main/core/schemas.py) | `AgentManifest`, `ManifestSchema`, `AgentCreateRequest`, `AgentCreateResponse`, `ErrorResponse` |
| [`bishop/core/validation_metrics.py`](https://github.com/marvelousempire/bishop/blob/main/core/validation_metrics.py) | `ValidationMetrics`, `AgentValidator` (pass threshold **0.88**) |
| [`bishop/docs/archive/ARCHIVE-INDEX.md`](https://github.com/marvelousempire/bishop/blob/main/docs/archive/ARCHIVE-INDEX.md) | Law vs aspirational map |

## When to use

- Creating or editing `agents/<name>/manifest.json`
- Debugging birth failures from `kingdom/manager.py` or `make agents-sync-all`
- Adding API fields to kingdom routes — mirror with Pydantic models in `kingdom/`

## Do not use for

- **Pydantic AI** (`pydantic_ai` agents) — not imported anywhere in Bishop; Phase 2 per plan `0011`
- Pasting archive samples from old `bishop-factory/bishop/api.py` — layout is `kingdom/` today

## Validate a manifest (CLI)

From Bishop repo root:

```bash
python3 -c "
from pathlib import Path
import json
from core.schemas import AgentManifest
from core.validation_metrics import AgentValidator

name = 'archive-reviver'  # change
root = Path('.')
data = json.loads((root / 'agents' / name / 'manifest.json').read_text())
model = AgentManifest.model_validate(data)
m = AgentValidator(root).validate_manifest(model)
print('valid:', m.is_valid, 'score:', m.overall_score)
if m.validation_errors:
    print('errors:', m.validation_errors)
"
```

## Required manifest shape (high signal)

- `agent_name` — kebab-case slug matching folder under `agents/`
- `intent.primary` — non-empty; should relate to `description`
- `intent.keywords` — at least **4** keywords
- `capabilities` — non-empty; SRIC allowlist (`chat`, `task_execution`, `tool_use`, …)
- `parent_blueprint` — must start with `bishop/`
- `hierarchy.boss` — set; must not equal `agent_name`
- On disk: `certificate-of-origin.md`, `memory.md`, `AI_AGENT_RULES/` (validator checks when folder exists)

## Birth flow integration

1. `AgentBirthKit` writes manifest from template.
2. Kingdom create/update paths call `AgentManifest.model_validate`.
3. `AgentValidator.validate_manifest` + `validate_agent_folder` before treating agent as healthy.

Pair with **bishop-agent-birth-kit** for scaffolding; this skill is **validation and schema** only.

## Archive pointer

Full chat export: `bishop/docs/archive/spec-sources/Pydantic is Perfect for Bishop.md` — use [`ARCHIVE-INDEX.md`](../../../bishop/docs/archive/ARCHIVE-INDEX.md) section map; never copy into rules.
