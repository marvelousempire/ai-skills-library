---
name: bishop-seven-houses-pipeline
id: SK-0132
keywords: [run-houses, check-pipeline, build-decision]
hash: pending
relations: [bishop-pydantic-manifest-validation]
before: []
governed_by: [global]
meta: dynamic
  - seven houses
  - Kingdom Hotel
  - house pipeline
  - Automata chain
goal: Run or extend Bishop's Seven Houses stub; map Automata doctrine to operational house names.
domain: yousirjuan
status: Active
tool: Cursor
description: >
  core/houses.py SevenHousesPipeline — async stub with optional house_runner. Documents Automata
  pipeline names vs shipped HOUSE_NAMES. LangGraph engine is not installed (Phase 2).
---

# Bishop Seven Houses pipeline

## Shipped implementation

| Symbol | Path |
|--------|------|
| `HOUSE_NAMES` | Operational labels used by `SevenHousesPipeline` |
| `AUTOMATA_PIPELINE_NAMES` | Automata / Kingdom Hotel doctrine (archive-aligned) |
| `SevenHousesPipeline` | [`bishop/core/houses.py`](https://github.com/marvelousempire/bishop/blob/main/core/houses.py) |

### Operational houses (default runner)

1. Intent  
2. Context  
3. Constraints  
4. Resources  
5. Risk  
6. Ethics  
7. Action (Empire)  

### Automata pipeline (doctrine — archive + Nephew)

1. Intent  
2. Valid Intent  
3. Concept  
4. Notion  
5. Solvency  
6. Microslice  
7. Action  

Map with `house_name_for_automata_step(n)` when bridging to Automata docs or Nephew micro-slice rules.

## Usage

```python
import asyncio
from core.houses import SevenHousesPipeline, HOUSE_NAMES, AUTOMATA_PIPELINE_NAMES

async def custom_runner(number: int, name: str, task: str) -> str:
    return f"house-{number}-{name}: ok"

async def main():
    pipe = SevenHousesPipeline(house_runner=custom_runner)
    results = await pipe.run_full_pipeline("Ship manifest validation")
    for r in results:
        print(r.house_number, r.house_name, r.decision, r.confidence)

asyncio.run(main())
```

Without `house_runner`, the stub returns `proceed-<house>` with rising confidence — safe for wiring tests only.

## When to plug a real engine

| Need | Use |
|------|-----|
| Folder + LEAD-SHEET orchestration | Nephew / Bishop agents + talents (default) |
| Stateful graph, checkpoints | **LangGraph** — Phase 2; not in `requirements.txt` |
| Role-based crews | CrewAI — optional; see agent-orchestration-frameworks |
| Typed tool agents | Pydantic AI — Phase 2; dep unused today |

Archive [`The Kingdom Hotel Framework.md`](../../../bishop/docs/archive/spec-sources/The%20Kingdom%20Hotel%20Framework.md) described LangGraph + pydantic_ai in `houses.py` — **not implemented**. See [`ARCHIVE-INDEX.md`](../../../bishop/docs/archive/ARCHIVE-INDEX.md).

## Extension pattern

1. Implement `HouseRunner` async callable `(number, name, task) -> str`.
2. Pass into `SevenHousesPipeline(house_runner=...)`.
3. Keep `HOUSE_NAMES` stable for API responses unless versioned.

Do not import LangGraph in Phase 1 without plan `0012` Phase 2 approval.
