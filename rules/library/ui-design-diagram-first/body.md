---
name: ui-design-diagram-first
keywords: [ui-design, layout-explain, precedent-cite]
goal: Lead UI/UX design responses with a Unicode box diagram and a one-sentence precedent citation.
relations: [ascii-flow-diagrams]
before: []
governed_by: [global]
meta: dynamic
---

# UI design — diagram first, precedent second

When the user asks about, proposes, or gives feedback on a **user interface layout** — lead with a Unicode ASCII box diagram inside a fenced `text` block, then write a single sentence naming the real-world product precedent the design follows (Apple System Settings, Linear, Figma, Stripe Dashboard, Vercel, Vision OS, macOS menu bar, etc.).

Plain-prose descriptions of UI changes are insufficient. The diagram comes first, the precedent comes second, and any further detail comes after both.

## Triggers (default on)

- Designing or proposing any new UI layout, control, modal, page, dock, rack, panel, etc.
- Responding to UI feedback like "this overlaps", "make it bigger", "give it more space", "totally different layout".
- Explaining what a UI change will look like before shipping it.
- Verifying that a change matches the operator's mental model before code.
- Anything involving skins, themes, layouts, navigation patterns.

## The non-negotiables

- **Diagram first.** Unicode box chars only: `┌ ┐ └ ┘ │ ─ ├ ┤ ▲ ▼ ◄ ►`. Inside a fenced ```` ```text ```` block (monospace everywhere).
- **Concrete zone labels** matching what the user will actually see (e.g. "Top nav", "LCD", "Dock", "Pad bay", "Right rack tabs"). No generic "Section A" / "Box 1" placeholders.
- **Compact symbols when they help meaning**: `☀` light theme, `🌙` dark, `◐` skin, `▶` run, `ⓘ` info, `⚙` settings, `●` active dot, `►` pointer.
- **Precedent sentence after the diagram.** Name at least one real-world product. The sentence does the justification work — explain the design vocabulary the choice borrows from.
- **Then and only then** any additional implementation detail, interaction notes, follow-up questions.

## Correct example

```
┌─────────────────────────────────────────────────┐
│  ☀ Light (top row)                              │
│  ┌────────┐ ┌────────┐ ┌────────┐               │
│  │  MPC   │ │ shadcn │ │ Glass  │               │
│  └────────┘ └────────┘ └────────┘               │
│  🌙 Dark (bottom row)                            │
│  ┌────────┐ ┌────────┐ ┌────────┐               │
│  │  MPC   │ │ shadcn │ │ Glass  │               │
│  └────────┘ └────────┘ └────────┘               │
└─────────────────────────────────────────────────┘
```

Sun on top, moon on bottom — matches Apple System Settings, Linear, Figma.

## Another correct example

```
┌─ Top nav ──────────────────────────────────────────┐
│   [ Pad ] [ Scanner ] [ Runners ]    ◐ Skins  ⚙   │
└────────────────────────────────────────────────────┘
```

Three center tabs + two right-side icon buttons — Linear-style segmented control, gear placement borrowed from macOS menu bar status items.

## Anti-patterns

- "The Settings modal now has tabs on the left for each category." (No diagram. No precedent. Reader has to imagine.)
- "I made the skins button open a HUD." (Same — words only.)
- "Light is at the top and dark is at the bottom." (Same.)
- Prose-only descriptions of ANY UI element, even small ones like "I moved the button to the right."
- A diagram without the precedent sentence (the user can SEE it but can't tell where the design vocabulary came from — design decisions become opaque).
- A precedent without the diagram (the user has to imagine where the precedent applies in the actual layout).

## Recovery if violated

1. Stop the response mid-paragraph if you catch yourself writing prose-only UI explanation.
2. Draw the diagram.
3. Add the precedent sentence.
4. Continue with the rest of the response.

If the response has already been sent without a diagram, send a follow-up message that opens with the diagram and the precedent. Do not let prose-only UI explanations stand.

## Why this matters

Avery thinks visually. Plain prose descriptions of UI layouts force him to reconstruct the layout in his head from words, which slows feedback loops and produces miscommunication that only surfaces after the change ships. A small ASCII diagram + a single sentence of precedent reasoning lets him verify intent at a single glance and either approve or redirect immediately. The precedent citation also keeps the design vocabulary consistent across the entire control tower — every UI choice rooted in a named, well-known reference instead of drifting into agent-invented patterns.

## Origin

Stated by Avery on 2026-05-22 after the SkinsHud row-order swap (light on top, dark on bottom). He said the way the response opened — with the ASCII diagram and the "matches Apple System Settings, Linear, Figma" sentence — was exactly how he wants every UI conversation to start. Cross-tool mirror: `nephew/AI_AGENT_RULES/UI_DESIGN_DIAGRAM_FIRST_RULE.md`.

## Relation to ascii-flow-diagrams

The [`ascii-flow-diagrams`](../ascii-flow-diagrams/body.md) rule is the parent — it establishes Unicode-box-in-fenced-text as the default for ANY visual (architecture, flow, system, request lifecycle). This rule narrows the scope to **UI/UX design specifically** and adds the **precedent citation** requirement. Both rules can fire together; this rule does not replace the general one, it specializes it.
