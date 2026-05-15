---
name: deficiency-to-microskill
description: >-
  Hand a flagged deficiency to Automata for the philosophical flow (Intent →
  Valid Intent → Concept → Notion → Solvency → Micro-slice → Action). Emits
  the new product id and path when Automata returns successfully.
inputs:
  gap:
    type: string
    required: true
    description: Plain-language description of what's missing.
  proposed_type:
    type: enum
    required: false
    description: skill | rule | action | agent — Automata may override.
  seed_input:
    type: string
    required: false
    description: Optional — the original input that produced the slice the inspector flagged.
outputs:
  product_id:
    type: string
    description: The new product's kebab-case id (e.g. `entity-slug-validation`).
  product_type:
    type: enum
    description: What Automata decided to emit. May differ from proposed_type.
  path:
    type: string
    description: Where the new product landed (e.g. `skills/methodology/entity-slug-validation/SKILL.md`).
side_effects:
  - Writes a new product folder under skills/, rules/library/, agents/, or actions/library/.
  - Updates SKILL-INDEX.md / RULES-CATALOG.md / AGENTS.md as appropriate (calls cross-reference-on-skill-add per RL-0009).
governed_by:
  - add-agent-to-skills-library
  - cross-reference-on-skill-add
---

# deficiency-to-microskill

## What this action does

Acts as the bridge between the inspector and Automata. Inspector flags a deficiency in natural language; this action reformulates it as a properly-scoped Intent and hands it off to the philosophical flow:

```
gap (natural language)
   │
   ▼
Intent — "I need a way to <do X>"
   │
   ▼ Automata validates (90%+ scoring)
   │
Valid Intent
   │
   ▼
Concept (A + B) — "<X> = <combine known capabilities Y and Z>"
   │
   ▼
Notion
   │
   ▼
Solvency Review — does this fit? Should we ship?
   │
   ▼
Micro-slice — the smallest shippable unit
   │
   ▼
Action — files written under the correct top-level folder
```

The output of Automata is what this action returns.

## When to use it in a workflow

- Whenever `inspect-slice` emits `deficiency-detected` with `severity >= warn`.
- Whenever a user explicitly asks "make a skill out of this" — the human-triggered path.
- Whenever `inventory-check` returns `match=false` (the `on-input-arrives` workflow uses it for exactly that).

## Failure modes

- **Solvency rejects.** Automata decides the gap is too small / too vague / overlaps an existing product. Behaviour: action returns `product_id=null` + a reason. The workflow can re-emit with a sharpened seed or accept the rejection.
- **Intent validation fails (sub-90%).** The gap as phrased isn't a coherent intent. Behaviour: same — null + reason. Inspector is asked to resubmit with sharper framing.
- **Type mismatch.** Inspector proposed skill, Automata emits rule. Behaviour: workflow honours Automata's decision; downstream `on-<type>-shipped` workflow fires accordingly.
