# Tech stack — Nephew CLOAK runtime

**Witness repo:** [marvelousempire/nephew](https://github.com/marvelousempire/nephew)  
**Orientation:** [`orientation/README.md`](https://github.com/marvelousempire/nephew/blob/main/orientation/README.md)

## Summary

| Layer | Modules / CLI |
|-------|----------------|
| Witness chain | `nephew witness`, `data/witness.json` |
| Patrol | `nephew patrol check` |
| Intent (90%) | `nephew intent check` |
| Bloat | `nephew bloat scan` |
| Preflight | `nephew preflight check` |
| Dispatch | `nephew dispatch evaluate` |
| Persona / crew | `nephew persona build`, `nephew crew plan` |
| Make-Sense | `nephew scatter` |
| Routing | `nephew route` |
| Retention hints | `nephew retention suggest` |
| Quarry | `nephew quarry list`, `audit`, `triage`, `reconcile` |
| Automata bridge | `nephew automata slice\|flow\|scatter` |
| Archive | `nephew archive search` → claude-chat-reader DB |

## Agent docs (witnessed paths)

Under `docs/agents/` — not always duplicate `agents/` at repo root:

- `skills-access-bridge`, `retention-fidelity-engine`, `witness-proof-layer`  
- Grok sometimes cited `agents/retention-and-fidelity-engine/` — use **`docs/agents/retention-fidelity-engine/`**

## Quarry

Nephew orchestrator thread (~287 msgs) — simulation rows for fake pushes; use `reconstruction/conversations/nephew-orchestrator/`.
