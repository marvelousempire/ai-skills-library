---
name: ascii-flow-diagrams
id: RL-0004
keywords: [ascii, flow, diagrams]
---

# ASCII flow diagrams — default visualization style

When the user asks for a **visual** of a flow, system, architecture, request lifecycle, or how parts of something connect — render a **Unicode box-and-arrow diagram inside a fenced `text` block**. Don't reach for prose, Mermaid, or ASCII `+---+`.

## Triggers (default on)

- "show me a visual / picture / diagram of …"
- "draw the flow / draw out how …"
- "how does X talk to Y" / "how does X connect to Y"
- "what does the architecture look like" / "map this out"
- "walk me through the … flow"

## Style — the non-negotiables

- Unicode box chars only: `┌ ┐ └ ┘ │ ─ ├ ┤ ▲ ▼ ◄ ►`.
- Always inside a fenced ```` ```text ```` block (monospace everywhere).
- Stack related actors in one column with `├──┤` dividers; don't draw three separate boxes when one stacked box says the same thing.
- **Wire labels sit on the arrow**: `◄──── HTTPS + JWT ────►`. Never bury wire details in the prose below.
- Side attachments (DBs, queues) extend off the right of a box with a single horizontal arrow plus a parenthetical caveat.
- Loop-back / shared-path arrows drop below the main row.
- Width ≤ ~80 cols. One concept per diagram — split if it grows.
- Caption *after* the picture, not before.

## Full style guide + 6 worked examples

[`skills/visual/diagrams/ascii-flow-diagrams/SKILL.md`](__SKILLS__/visual/diagrams/ascii-flow-diagrams/SKILL.md) — canonical reference (client/API/DB, queue fanout, OAuth handshake, deployment pipeline, hardware topology, request lifecycle).

For strictly linear, no-parallel-actors stacks, [`docs/system-flow.md`](__DOCS__/system-flow.md) covers the simpler vertical-ladder variant.
