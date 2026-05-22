# Mindsets

This folder is for design *mindsets* — captured psychologies of how a specific designer or operator thinks about a specific project. Each subfolder is one mindset.

## Why this folder exists (verbatim source, paraphrased line-by-line from Avery 2026-05-22)

The original ask, broken into the points it makes:

1. **"The rules, the logic, the expertise the ideas, the focus the thought process the mindset"** — every dimension of how an agent approaches a project is worth capturing, not just the rules or the code conventions.

2. **"all the things that you're using whenever I use a prompt to get you to do anything for this app"** — the goal is to capture what an agent does *implicitly* when working in a specific operator's stack, so that knowledge survives the conversation.

3. **"you always know what to do, and you always have the right idea in mind"** — the standard for "capturing" is that another agent reading this folder later can match the same instincts on first read.

4. **"you have the right shape and what do you think that I want"** — design choices have a *shape*. The mindset must encode the shape, not just the surface choices.

5. **"and they were also things that you know that I might like based on what you know that I want"** — predictive judgement matters. The mindset must include what the operator hasn't asked for yet but probably will.

6. **"I need you to keep track of exactly what that is and then drew me out a full report"** — explicitness is required. The report must be exhaustive enough that nothing operates on tacit knowledge alone.

7. **"Report a psychological report on what we're doing here and why we have such a project"** — the *why* is part of the capture. Not just "what to do" but "what problem this exists to solve."

8. **"I wanna know every single node of what we're doing"** — granularity matters. Every micro-decision goes in.

9. **"and what are we doing and how we're thinking how we get this type of result"** — the *thinking* between input and output is the thing being captured. Process > artifacts.

10. **"take that and make a skill out of it and make a rule for it"** — two deliverables per mindset:
    - **Skill**: the body that explains. Lives in this folder (`mindsets/<name>/SKILL.md` + `body.md`).
    - **Rule**: the enforcement layer. Lives in `.claude/rules/<name>.md` + `.cursor/rules/<name>.mdc` mirrored to every operator repo per the [`rule-propagation-discipline`](../../../../.claude/rules/rule-propagation-discipline.md) rule.

11. **"I really could buy them and we're going to file them in the AI skills library"** — the AI Skills Library is the federation hub. Anything captured here is reusable across every operator repo.

12. **"We're going to put it in the design section"** — yes, this folder lives under `skills/visual/design/`.

13. **"the design folder inside of the AI skills library and this will be what this folder is about"** — this README defines the folder's purpose. Future mindsets get their own subfolder and an entry in the index below.

14. **"and then there's another file in a folder called lead sheet"** — see [`lead-sheet.md`](./lead-sheet.md). It's the order-of-operations runbook.

15. **"the lead sheet is going to provide instructions on what should happen, and in what order it should happen with all the items that are subject to that folder"** — the lead sheet is global to the mindsets folder; every mindset in this folder is "subject to" it. Following the lead sheet is required when applying any of the captured mindsets.

## Structure

```
mindsets/
  README.md                              ← this file
  lead-sheet.md                          ← global order-of-operations
  <mindset-slug>/                        ← one folder per mindset
    SKILL.md                             ← short skill manifest (indexed)
    body.md                              ← long-form psych report
```

Future-author note: when adding a new mindset, also add a row to the index below and ensure the rule mirror lands per the propagation discipline.

## Index

| Mindset | Skill folder | Rule (propagated) |
|---------|--------------|-------------------|
| **Operator Control Tower Pad** — Avery Goodman / Learn Mappers stack | [`operator-control-tower-pad/`](./operator-control-tower-pad/) | `.claude/rules/operator-control-tower-mindset.md` |

## Related skills + rules

- [`rules/library/ui-design-diagram-first`](../../../../rules/library/ui-design-diagram-first/) — UI design responses lead with an ASCII diagram + precedent citation. Every mindset in this folder must operate on top of this rule.
- [`.claude/rules/rule-propagation-discipline.md`](../../../../.claude/rules/rule-propagation-discipline.md) — how to mirror any rule (including the rules that come out of each mindset) across the operator's repos.
- [`.claude/rules/contracts-and-prudence.md`](../../../../.claude/rules/contracts-and-prudence.md) — the operating philosophy beneath every mindset.

## How to use this folder

When an agent boots into an operator's stack:

1. Read this README.
2. Read [`lead-sheet.md`](./lead-sheet.md) for the order of operations.
3. Match the project to a mindset in the index above. If no match → write a new mindset before doing significant work; capture the operator's expectations explicitly.
4. Read that mindset's `SKILL.md` for the indexed summary, then `body.md` for the full report.
5. Apply the mindset to every decision in the session. When the operator's behavior reveals a NEW expectation, append it to the mindset's `body.md` (the mindsets are living documents).
