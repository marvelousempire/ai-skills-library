# Workflows

Triggered pipelines that Nephew (the Dealer) reads to know what to dispatch on each event.

Direct analogue to `.github/workflows/*.yml`. Same shape, same `on:` semantics, same `jobs/steps` structure. The runner is Nephew instead of GitHub-hosted CI.

## Index

| File | Trigger | What it orchestrates |
|---|---|---|
| [`on-input-arrives.yml`](./on-input-arrives.yml) | `input-arrives` | The canonical entry path. Every new input hits this workflow. Inventory check first; route OR create. |
| [`on-deficiency-detected.yml`](./on-deficiency-detected.yml) | `deficiency-detected` | An inspector flagged a slice. Hand the deficiency to Automata for the micro-slice flow. |
| [`on-skill-shipped.yml`](./on-skill-shipped.yml) | `skill-shipped` | A new skill landed. Ripple references per [RL-0009](../../rules/library/cross-reference-on-skill-add/body.md). |
| [`on-plugin-installed.yml`](./on-plugin-installed.yml) | `plugin-installed` | A new plugin is on disk. Per the plugin-economy rule, document it in the agent's spec + STACK.md or uninstall. |

## Authoring

Copy any existing workflow as a template. The schema is documented in [`../README.md`](../README.md#workflow-yaml-schema).

## Why these four to start

These four cover Nephew's most-frequent decision points:

- **Every input** triggers `on-input-arrives` — the gate the user described as "the inventory check."
- **Every flagged slice** triggers `on-deficiency-detected` — the inspector → Automata seam.
- **Every shipped skill** triggers `on-skill-shipped` — keeps the catalog in sync (the rule already exists; this workflow is its executable form).
- **Every new plugin** triggers `on-plugin-installed` — enforces the no-silent-installs rule.

The next batch (when the system is in active use) will include `on-agent-shipped`, `on-rule-shipped`, `on-action-shipped`, and `on-witness-entry-finalized`. All follow the same shape.
