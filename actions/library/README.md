# Action library

Reusable composable units of work invoked by name from workflow steps. Direct analogue to GitHub Actions' `actions/checkout@v4`-style reusable actions — except instead of running on a CI runner, these are dispatched by Nephew.

## Contract

Each action lives in its own folder:

```
library/<action-id>/
├── ACTION.md      # Machine-readable spec — frontmatter inputs/outputs, side effects, governing rules
└── README.md      # Human-readable — what it does, when to use it, failure modes
```

The schema for `ACTION.md` is documented in [`../README.md`](../README.md#reusable-action-actionmd-schema).

## Index

| Action | Purpose |
|---|---|
| [`inventory-check/`](./inventory-check/) | Nephew's first move on every input — scan the library for an existing handler before creating a new one. |
| [`piranha-dispatch/`](./piranha-dispatch/) | Fan a job out into N parallel slices for a swarm. |
| [`inspect-slice/`](./inspect-slice/) | Inspector pass: rate a slice for health + flag deficiencies. |
| [`deficiency-to-microskill/`](./deficiency-to-microskill/) | Hand a flagged deficiency to Automata for the philosophical flow. |
| [`witness-record/`](./witness-record/) | Sign the workflow's outcome into `data/witness.json`. |

## Why this small set first

These five cover one closed loop:

```
inventory-check ──► (no match) ──► deficiency-to-microskill ──► witness-record
       │
       └─► (match) ──► piranha-dispatch ──► inspect-slice ──► witness-record
                                                  │
                                                  └─► (deficiency) ──► on-deficiency-detected workflow
```

Together they make Nephew's full decision tree executable as YAML. Future actions (`route-to-agent`, `swarm-converge`, `escalate-to-human`, `record-decision`, etc.) plug into the same model.

## Adding a new action

1. `mkdir -p library/<new-action-id>/`
2. Copy `inventory-check/ACTION.md` as a starting frontmatter shape.
3. Write the body of `README.md` (what, when, how, failure modes).
4. Reference the action from at least one workflow.
5. Update this README's index.
