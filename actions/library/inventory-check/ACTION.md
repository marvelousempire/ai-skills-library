---
name: inventory-check
description: >-
  Scan the library for an existing rule, skill, agent, or action that handles
  the given input. Returns match + handler reference on hit, or a
  deficiency-hint on miss. The non-negotiable first step on every input
  Nephew sees.
inputs:
  query:
    type: string
    required: true
    description: The user's input text, verbatim — what to match against.
  surfaces:
    type: array
    required: false
    description: Which inventory surfaces to scan. Default is all four.
    default: [rules, skills, agents, actions/library]
outputs:
  match:
    type: bool
    description: true when at least one inventory surface confidently handles the query.
  handler:
    type: string?
    description: The matched product id (e.g. "page-cro", "scope-filtering"). Only present when match=true.
  handler_type:
    type: enum
    description: rule | skill | agent | action — which surface owns the match.
  deficiency_hint:
    type: string?
    description: When match=false, plain-language description of what the library would need to absorb the input. Feeds deficiency-to-microskill.
side_effects:
  - Reads SKILL-INDEX.md, AGENTS.md, rules/RULES-CATALOG.md, actions/library/.
  - Does NOT write — purely a lookup. Read-only.
governed_by:
  - add-agent-to-skills-library
---

# inventory-check

## What this action does

Reads the library's catalogues and tries to find the best handler for the given input. Confidence threshold is set by the implementing runner — for Nephew today, "confident" means the candidate skill / rule / agent's `triggers` field literally names a phrase in the input, or its description has high cosine similarity.

## When to use it in a workflow

As Step 1 of any `on-input-arrives` workflow. It is the inventory check the user described as Nephew's non-negotiable first move. Skipping it leads to capability duplication — silently creating a skill that already exists under a different name.

## Failure modes

- **False match.** Two skills with overlapping triggers — the action returns the first by alphabetical id. Mitigation: workflow can re-run with a tighter query, or fall through to `deficiency-to-microskill` with `proposed_type: rule` for a disambiguation rule.
- **False miss.** A handler exists but its triggers don't yet name the input's phrasing. Mitigation: when Automata emits the new skill, its first action is to expand the original's `triggers` list — so the next similar input matches.
- **Catalog drift.** If SKILL-INDEX.md is stale (the count-keeper hook missed a commit), inventory-check undercounts. Mitigation: `cross-reference-on-skill-add` (RL-0009) is `alwaysApply` and CI catches the drift before merge.
