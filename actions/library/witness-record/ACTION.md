---
name: witness-record
description: >-
  Append a signed entry to the consuming repo's witness manifest (ADR-103).
  The last step of every workflow run that produces something durable — a
  routing decision, a new product, a regression fix. Ed25519-signed against
  the operator's key.
inputs:
  summary:
    type: string
    required: true
    description: Single-line description of what shipped or was decided.
  verifier:
    type: string
    required: true
    description: A verifier-DSL expression (e.g. "exists:NEPHEW.md AND match:.mcp.json:nephew").
  narrative_ref:
    type: string
    required: false
    description: Optional — anchor reference into WITNESS.md (auto-generated if omitted).
  manifest_path:
    type: string
    required: false
    description: Path to data/witness.json in the consuming repo. Defaults to ./data/witness.json.
    default: ./data/witness.json
outputs:
  entry_id:
    type: string
    description: The new entry's id (e.g. w-2026-05-15-004).
  signature:
    type: string
    description: Base64-encoded Ed25519 signature.
side_effects:
  - Writes a new entry to data/witness.json (chained, signed).
  - Appends a narrative block to WITNESS.md.
governed_by:
  - add-agent-to-skills-library
---

# witness-record

## What this action does

The last step of any durable workflow run. Records what was decided / routed / created into the cryptographic chain so:

- "Did we already fix that?" becomes a deterministic check via `nephew witness verify`.
- "Who decided to add X?" is answerable by reading the narrative_ref.
- Cross-repo `nephew witness fed find` queries can surface this entry from any paired peer.

This is what makes the library auditable — every routing decision Nephew makes is recordable, signed, and chained.

## When to use it in a workflow

As the FINAL step of any job that produced a real artefact:

- `on-input-arrives` → records the routing decision (`Routed input-XXX to handler-YYY`).
- `on-deficiency-detected` → records the new product (`Automata absorbed deficiency '...'`).
- `on-skill-shipped` → records the ripple completion.
- `on-plugin-installed` → records the document-or-uninstall choice.

DO NOT use for ephemeral state (which slice a piranha returned, which inspector flagged what). The chain is for shipped outcomes only.

## Failure modes

- **Missing private key.** `~/.nephew/keys/witness-signing.priv.json` not present. Behaviour: action fails fast with a clear error pointing at `nephew witness keygen`.
- **Chain drift.** A prior entry's verifier no longer matches the tree. Behaviour: action calls `witness verify` first; if drift detected, refuses to append and surfaces the drift report.
- **Key rotation.** Local priv key differs from repo's committed pub key. Behaviour: handled by v0.2.1's rotation-resilient `fedExport` — entries sign under the repo's trust root, envelope under local. See nephew/PR-2 for the design.
