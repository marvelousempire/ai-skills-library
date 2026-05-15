# Actions

> The missing layer between *what the library knows* (skills, rules, agents) and *how Nephew makes them work together*. Modeled directly on GitHub Actions; runner is **Nephew** (the Dealer / Managing Trustee).

## Mental model

| GitHub Actions | This folder | What it means |
|---|---|---|
| **Workflows** (`.github/workflows/*.yml`) | [`workflows/`](./workflows/) | YAML files defining what fires when an event happens. Nephew reads these. |
| **Triggers** (`on: push`, `on: pull_request`, …) | The `on:` field of each workflow | The event Nephew watches for. Examples: `on: input-arrives`, `on: deficiency-detected`, `on: skill-shipped`. |
| **Reusable actions** (`actions/checkout@v4`) | [`library/`](./library/) | Composable units of work invoked from workflow steps. Each has an `ACTION.md` (machine-readable spec) and a `README.md` (human). |
| **Runner** (GitHub-hosted / self-hosted) | **Nephew** | The Dealer reads the workflow YAML, sets up the swarm (jobs), and executes each step. |
| **Jobs** (groups of steps, possibly with matrix) | A "swarm" in this folder's language | The piranha pattern — multiple agents take parallel slices of the work. |
| **Steps** (individual commands or action invocations) | Step in a workflow | A single invocation of a skill / rule / agent / library action. |
| **Outputs** | Step outputs + the witness chain | What downstream steps consume. Final outputs are recorded by `witness-record`. |
| **Secrets** | Repo-level secrets + `~/.nephew/keys/` | Trust material the runner has access to but never logs. |

## The closed loop this folder makes executable

```
                          INPUT arrives
                               │
                               ▼
                    Nephew opens a workflow run
                               │
                  ① inventory-check action runs:
                       scan rules/, skills/, agents/, actions/library/
                               │
                ┌──────────────┴──────────────┐
              MATCH                         NO MATCH
                │                              │
                ▼                              ▼
       ② route via the matched         ② trigger Automata:
          Orchestrator                    Intent → Valid Intent →
                │                         Concept → Notion →
                ▼                         Solvency → Micro-slice →
       ③ piranha-dispatch action          new skill / rule / action
          fans out a swarm                       │
                │                                ▼
                ▼                       ③ register product +
       ④ each piranha emits a slice         re-run the workflow
                │                            with the new capability
                ▼
       ⑤ inspect-slice action evaluates
          each slice
                │
        ┌───────┴───────┐
      health         deficiency
       ✓           detected
       │                │
       │                ▼
       │       triggers `on: deficiency-detected`
       │       another workflow run
       │
       ▼
       witness-record action signs the outcome
       into data/witness.json
```

## What ships in this initial commit

### Workflows (4)

| File | Trigger | What it does |
|---|---|---|
| [`workflows/on-input-arrives.yml`](./workflows/on-input-arrives.yml) | `on: input-arrives` | The canonical entry path. Inventory-check first, then route OR create. |
| [`workflows/on-deficiency-detected.yml`](./workflows/on-deficiency-detected.yml) | `on: deficiency-detected` | The Automata feed. Inspector deficiency → micro-skill. |
| [`workflows/on-skill-shipped.yml`](./workflows/on-skill-shipped.yml) | `on: skill-shipped` | Cross-reference rippling (uses [`RL-0009`](../rules/library/cross-reference-on-skill-add/body.md)). |
| [`workflows/on-plugin-installed.yml`](./workflows/on-plugin-installed.yml) | `on: plugin-installed` | Plugin-economy enforcement — document or uninstall, no silent installs. |

### Reusable actions (5)

| Folder | Purpose |
|---|---|
| [`library/inventory-check/`](./library/inventory-check/) | Nephew's first move on every input — scan the library for an existing handler. |
| [`library/piranha-dispatch/`](./library/piranha-dispatch/) | Fan a job out into N parallel slices for a swarm. |
| [`library/inspect-slice/`](./library/inspect-slice/) | Inspector pass: rate a slice for health + flag deficiencies. |
| [`library/deficiency-to-microskill/`](./library/deficiency-to-microskill/) | Hand a flagged deficiency to Automata for the philosophical flow. |
| [`library/witness-record/`](./library/witness-record/) | Sign the workflow's outcome into the witness manifest. |

## Authoring conventions

### Workflow YAML schema

```yaml
name: <kebab-case-name>                          # Workflow display name.
description: >-                                  # Single-paragraph what + when.
  …
on:                                              # Trigger event(s).
  <event-name>:                                  #   input-arrives, deficiency-detected,
    payload:                                     #   skill-shipped, plugin-installed, …
      <field>: <type>                            # Expected payload fields.
dispatched_by: nephew                            # The runner. Currently always Nephew.
governed_by:                                     # Library rules this workflow honours.
  - add-agent-to-skills-library                  #   (RL-0046)
  - cross-reference-on-skill-add                 #   (RL-0009)
  - plugin-economy                                #   (RL-NEW)
jobs:
  <job-name>:                                    # A swarm. Job = swarm.
    needs: [<other-job>]                         # Sequencing.
    swarm: piranha                               # Distribution shape.
    steps:
      - uses: ./actions/library/<action-id>      # Reusable action invocation.
        with:
          <param>: <value>
      - run: <agent-or-skill-invocation>         # Direct invocation form.
```

Workflows are intentionally NOT executed by a script in this commit — they are the SPEC Nephew (and future runners) read. The closed-loop execution lives in the [`automata/`](../automata/) tree per its own PRD.

### Reusable-action `ACTION.md` schema

```yaml
---
name: <kebab-case-action-id>
description: >-
  Single-paragraph what + when.
inputs:
  <input-name>:
    type: <string|number|object|enum>
    required: true|false
    description: <one line>
outputs:
  <output-name>:
    type: <…>
    description: <one line>
side_effects:
  - <named effect, e.g. "writes data/witness.json">
governed_by:
  - <rule-id>
---

# <Action display name>

## What this action does

…

## When to use it in a workflow

…

## Failure modes

…
```

## Relationship to existing folders

- [`rules/`](../rules/) — *constraints*. Workflows honour them via `governed_by:` references.
- [`skills/`](../skills/) — *capabilities*. Workflow steps invoke them by name.
- [`agents/`](../agents/) — *actors*. Workflow steps invoke them via `@<namespace>:<agent-name>`.
- [`automata/`](../automata/) — *the micro-skill factory*. The downstream of `on: deficiency-detected`.
- [`actions/`](.) (this folder) — *the pipelines that compose all of the above*. Nephew dispatches.

## Adding a new workflow or action

1. Copy [`workflows/on-input-arrives.yml`](./workflows/on-input-arrives.yml) or [`library/inventory-check/ACTION.md`](./library/inventory-check/ACTION.md) as a template.
2. Fill in the schema fields.
3. Reference any rules it honours via `governed_by:`.
4. Cross-link from this README's tables.
5. Commit surgically — `git add <path>` per file (per [RL-0046](../rules/library/add-agent-to-skills-library/body.md) discipline; same surgical pattern applies here).

## Why this folder exists

The library had three product types — skill, rule, agent. They tell Nephew *what's available* but not *what to do with all of it when an input arrives*. Workflows are that fourth product type. Without them, every routing decision lives in Nephew's prompt; with them, decisions are versioned, auditable, and re-runnable.

This is the DRY-method factory's pipeline layer.

---

*Catalogued by Nephew — the Dealer / Managing Trustee. The runner that reads these workflows is the same agent that decided to add this folder.*
