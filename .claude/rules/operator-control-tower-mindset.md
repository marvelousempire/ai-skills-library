# Operator Control Tower mindset rule

## The verbatim source (stated by Avery 2026-05-22)

> The rules, the logic, the expertise the ideas, the focus the thought process the mindset, all the things that you're using whenever I use a prompt to get you to do anything for this app you always know what to do, and you always have the right idea in mind you have the right shape and what do you think that I want and they were also things that you know that I might like based on what you know that I want I need you to keep track of exactly what that is and then drew me out a full report. Report a psychological report on what we're doing here and why we have such a project we have I wanna know every single node of what we're doing and what are we doing and how we're thinking how we get this type of result. take that and make a skill out of it and make a rule for it.

## The rule

When working in any repo in the Avery Goodman / Learn Mappers operator stack (currently: `automata`, `nephew`, `ai-skills-library`, `dustpan`, `clinic`, `historia`, `red-e-play-app`, and any future surface), apply the **Operator Control Tower Pad** mindset captured in [`skills/visual/design/mindsets/operator-control-tower-pad/`](../../skills/visual/design/mindsets/operator-control-tower-pad/) on every UI/UX decision.

The mindset's 12 nodes must inform every choice:

1. Visual-first cognition (diagram before prose, always)
2. Precedent citation (every design choice names a real-world product)
3. Operator-grade primitives (reuse canonical hooks/components)
4. Real shell execution (buttons must DO things)
5. Native + browser parity (Tauri IPC + FastAPI HTTP fallback)
6. Whitelisted security model (frontend never passes arbitrary paths)
7. Skin × theme orthogonality (two independent axes)
8. Game-like haptics (motion has purpose)
9. Honest disclosures (name what doesn't work)
10. Append-only history (journal modifications log)
11. Contracts are load-bearing (every "I'll" is kept or re-negotiated)
12. DRY across surfaces (one canonical source, mirrored)

Apply the [`lead-sheet.md`](../../skills/visual/design/mindsets/lead-sheet.md) 11-step runbook in order on every change.

## When this rule fires

- Any UI/UX change in any operator repo
- Any new component, page, modal, HUD, or control surface
- Any change to navigation, skins, themes, or layout structure
- Any new whitelisted shell exec surface
- Any new behavioral rule proposal — check it against the 12 nodes for consistency

## What you must do

- Read `skills/visual/design/mindsets/operator-control-tower-pad/SKILL.md` (the indexed summary) at session start when working in any operator repo.
- Apply the [lead sheet](../../skills/visual/design/mindsets/lead-sheet.md) order of operations (11 steps) for every change.
- When operator behavior reveals a new expectation NOT in the 12 nodes, **append it** to `body.md` as a new node — the mindset is a living document.

## What goes wrong without it

- Each session re-derives the operator's preferences from scratch.
- UI choices drift toward agent-invented patterns instead of named precedents.
- The "feels alive" standard for the Pad gets diluted into snapshot UIs.
- Whitelists fall out of lockstep across Rust + Python (security regression).
- Plan changes happen without `Modifications` entries — history is lost.

## What good result we get when followed correctly

- The operator approves UI changes on first read (one-glance diagrams + precedent).
- Native and browser modes maintain perfect parity (same scripts, two transports).
- The vocabulary stays internally consistent across every surface in the stack.
- Future agents reading the journal can reconstruct the operator's standing instructions without a fresh conversation.
- The control tower compounds — every shipped feature extends a reusable primitive or skill.

## Propagation

Per [`rule-propagation-discipline`](rule-propagation-discipline.md): this rule lives in:

- **Canonical (here)**: `ai-skills-library/.claude/rules/operator-control-tower-mindset.md`
- **Cursor mirror**: `ai-skills-library/.cursor/rules/operator-control-tower-mindset.mdc`
- **Nephew**: `nephew/.claude/rules/operator-control-tower-mindset.md` + `.cursor/rules/operator-control-tower-mindset.mdc`
- **Skill body**: `ai-skills-library/skills/visual/design/mindsets/operator-control-tower-pad/{SKILL.md, body.md}`
- **Lead sheet**: `ai-skills-library/skills/visual/design/mindsets/lead-sheet.md`
- **Operator memory**: `~/.claude/projects/.../memory/feedback_operator_mindset.md` (pointer entry)

Future operator repos that fork from this stack inherit the rule via the standard `.claude/rules/` propagation pass.

## Related

- [`ui-design-diagram-first`](../../rules/library/ui-design-diagram-first/body.md) — the diagram-first habit that node 1 enforces
- [`rule-propagation-discipline`](rule-propagation-discipline.md) — how this rule got mirrored
- [`contracts-and-prudence`](contracts-and-prudence.md) — the operating philosophy beneath node 11
- [`changelog-and-versioning`](changelog-and-versioning.md) — what step 10 of the lead sheet refers to
- [`live-dashboard-pattern`](live-dashboard-pattern.md) — a concrete instance of node 8 (game-like haptics) in dashboard form

## Origin

This rule formalizes a request Avery made on 2026-05-22 after a ~30-commit session on `feature/wp-stack-boards` rebuilding the Automata Pad into a three-page operator control tower. The full session journal is at `automata/journal/intentions/2026-05-22-automata-pad-control-tower.md`. The psychological report this rule references is at `skills/visual/design/mindsets/operator-control-tower-pad/body.md`.

Is there any part of this rule that you do not understand?

-----
