# Tech Stacks Depository — Sealed construction kits

Each folder under `skills/engineering/tech-stacks/<stack-id>/` is a **sealed kit** (a box). The **ledger** is the exhaustive allowlist of what the kit may use or produce. If it is not on the ledger, it does not exist for that project.

## Anatomy of a kit

```
<stack-id>/
├── stack.plugin.json       # Catalog card (machine) — required
├── stack.plugin.md         # Product page (human) — required
├── assets/icon.svg         # Catalog thumbnail — required
├── stack.ledger.yaml       # Index → ledger/* — required
├── ledger/
│   ├── dependencies.yaml   # npm/cargo/swift allowlist (closed policy)
│   ├── ui-kits.yaml        # tokens, frameworks, mood, bible paths
│   ├── payloads.yaml       # producible artifacts
│   └── capabilities.yaml   # agent tasks (subset of payloads + files)
├── SRIC.md                 # Strict Registered Intent & Capabilities
├── doctrine/               # Quality bible, PRD, rendering (optional)
├── decanter/               # Reference apps — must match dependencies.yaml
└── README.md
```

## Rules

1. **Closed ledger** — `enforcement: closed` in `stack.ledger.yaml`. No new dependency, UI kit, or payload without a ledger PR.
2. **Reference apps ⊆ ledger** — every `package.json` dependency must appear in `ledger/dependencies.yaml`. CI: `python3 scripts/validate-stack-ledger.py`.
3. **Project binding** — Bishop/Nephew manifests: `stack_bible_path` → `.../<stack-id>/stack.ledger.yaml`. `sric_capabilities` ids must exist in `ledger/capabilities.yaml`.
4. **Graceful decline** — Off-ledger requests return `reason`, `missing_resources`, `in_scope_alternatives` (from ledger only).
5. **Catalog** — Every kit appears in [`TECH-STACKS-PLUGIN-DIRECTORY.md`](./TECH-STACKS-PLUGIN-DIRECTORY.md) and unified [`LIBRARY-PLUGIN-CATALOG.md`](../../../LIBRARY-PLUGIN-CATALOG.md).

## Add a new stack

1. Copy [`templates/stack.plugin.json`](../../../templates/stack.plugin.json) and [`templates/stack.plugin.md`](../../../templates/stack.plugin.md).
2. Create `ledger/*.yaml` and seed `dependencies.yaml` from reference lockfiles.
3. Add `SRIC.md` pointing at the ledger as supreme law.
4. Optional: guardian agent `agents/<stack-id>-guardian.md`.
5. Run:

```bash
python3 scripts/validate-stack-ledger.py --stack <stack-id>
python3 scripts/validate-stack-plugin-manifests.py
python3 scripts/generate-library-plugin-catalog.py
```

6. Register row in [`README.md`](./README.md) index table.

## Yarn-only metaphor

| Metaphor | Meaning |
|----------|---------|
| The box | `tech-stacks/<stack-id>/` |
| The ledger | `ledger/*.yaml` |
| Yarn only | Only listed deps, UI kits, payloads |
| Fishing wire | Off-ledger npm/UI/framework — **decline** |

## Current kits

See [`README.md`](./README.md) and [`TECH-STACKS-PLUGIN-DIRECTORY.md`](./TECH-STACKS-PLUGIN-DIRECTORY.md).
