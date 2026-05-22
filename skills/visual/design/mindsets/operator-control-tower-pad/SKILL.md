---
name: operator-control-tower-pad
category: design/mindsets
keywords: [operator-mindset, control-tower, automata-pad, mpc-aesthetic, diagram-first]
goal: Capture the full psychological frame an agent uses when designing UI/UX surfaces for Avery Goodman's Automata Pad (and the wider Learn Mappers stack control tower).
relations: [ui-design-diagram-first, rule-propagation-discipline, contracts-and-prudence, changelog-and-versioning]
governed_by: [global, design]
---

# Operator Control Tower Pad — design mindset

**One-sentence frame**: design as if you're building the cockpit of a single operator who already runs a multi-repo control tower, who thinks in MPC hardware metaphors, who values diagrams over prose, and who measures every UI choice against a named real-world product precedent.

## The 12 nodes (the every-single-node ask)

Each node is something the agent does implicitly when working on the Pad. Each is a sub-skill of this mindset.

1. **Visual-first cognition** — diagram before prose, always.
2. **Precedent citation** — every design choice names a product the vocabulary borrows from.
3. **Operator-grade primitives** — tools that compound, idempotent operations, no-cost re-runs.
4. **Real shell execution** — buttons must DO things, not stub.
5. **Native + browser parity** — same script, two transports (Tauri IPC + FastAPI HTTP).
6. **Whitelisted security model** — frontend never passes arbitrary paths; lockstep across Rust + Python whitelists.
7. **Skin × theme orthogonality** — two independent axes; six valid combinations.
8. **Game-like haptics** — glow, scale, pulse, smooth transitions; UI feels alive.
9. **Honest disclosures** — name what doesn't work (LIDAR is iOS-only; WebGPU may be unavailable) instead of hiding it.
10. **Append-only history** — journal/intentions captures the why behind every plan change.
11. **Contracts are load-bearing** — every "I'll" commitment is kept or explicitly re-negotiated.
12. **DRY across surfaces** — one canonical whitelist mirrored across transports; one canonical mindset mirrored across agent surfaces.

## How to apply

See [`body.md`](./body.md) for the full report — every node expanded with triggers, anti-patterns, and reference implementations from the live codebase.

Also see the parent folder's [`lead-sheet.md`](../lead-sheet.md) for the order of operations that this mindset overlays on.

## When this mindset fires

- Any work in `marvelousempire/automata` (the workspace this mindset was extracted from)
- Any work in `marvelousempire/nephew` (the orchestrator above)
- Any work in any of the operator's product apps that share the Pad's design vocabulary (currently: the Automata Pad itself; future: any iOS companion, marketing site, admin dashboard the operator builds in this stack)
- New `.claude/rules/*` proposals that touch UI/UX behavior

## Mirrored as a rule

This mindset has a companion rule that enforces it across operator repos:

- `nephew/.claude/rules/operator-control-tower-mindset.md`
- `ai-skills-library/.claude/rules/operator-control-tower-mindset.md`
- Plus `.cursor/rules/*.mdc` mirrors per the [`rule-propagation-discipline`](../../../../.claude/rules/rule-propagation-discipline.md)

## Origin

Stated by Avery 2026-05-22 as a *psychological report* request: "I want to know every single node of what we're doing and what are we doing and how we're thinking how we get this type of result. Take that and make a skill out of it and make a rule for it. We're going to file them in the AI skills library."

This SKILL is the indexed summary. The full report is in [`body.md`](./body.md). The lead-sheet runbook is in [`../lead-sheet.md`](../lead-sheet.md). The companion rule is in `.claude/rules/operator-control-tower-mindset.md`.
