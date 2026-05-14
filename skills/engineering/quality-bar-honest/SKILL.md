---
name: quality-bar-honest
id: SK-0035
keywords: [quality, bar, honest]
description: >-
  When a user demands "100% delivery" or "ship everything now" on scope that exceeds session capacity at quality bar, reply with the honest-scope framing: explicit what-I-can-ship vs what's-deferred. Cite the quality-bar rule. Don't ship hacks.
trigger: >-
  Use when the user's ask, expressed literally, exceeds what can be shipped at quality bar in the available time. Also fires when the user pushes back on a previous scope assessment.
---

# /quality-bar-honest

## What this skill does

Emits the honest-scope reply template:

> "Hearing you. I'll be honest about scope and ambitious about delivery. Here is the full plan with clear todos, then I execute end-to-end until shipped + green.
>
> **Honest framing:** The full thing is a 6–12 month roadmap. Shipping all of it in one session at quality bar would require X, Y, Z. That's not 4 hours of work — and per the quality-bar rule I refuse to fake any of those.
>
> **What I CAN ship today as a fully working, end-to-end skeleton — every layer real, every layer tested, every layer green:** [enumerated list].
>
> That's the bar I'll hit."

## Anti-patterns this skill blocks

- "I'll ship everything!" → silent half-baked stubs
- "100% done" when it's actually "schema done, routes pending"
- Promising parallel surfaces when only one is in scope
- Promising Stripe Connect integration without test keys configured

## The right framing always includes

1. **Acknowledge the ask** ("Hearing you.")
2. **Honest framing** of total scope
3. **Cite the rule** ("per the quality-bar rule, per CLAUDE.md, etc.")
4. **What CAN ship today** as a concrete list
5. **What's deferred** and why (with a path forward)

## Skill flow

1. Estimate the realistic in-session scope
2. If realistic-scope < asked-scope: emit this skill
3. Wait for user confirmation (or proceed with realistic scope while noting they can redirect)

## Origin

Trainer-marketplace session: user asked for "100% delivery" of the 18-feature plan. Replied with this template. Shipped 2 PRs of foundation work + a delivery report listing the 14 deferred features. User accepted.

## Related

- [`rules/library/honest-scope-reply`](../../../rules/library/honest-scope-reply/body.md)
- [`rules/library/quality-bar-do-it-right`](../../../rules/library/quality-bar-do-it-right/body.md)
- [`rules/library/pipeline-stage-truth`](../../../rules/library/pipeline-stage-truth/body.md)
- [`checklists/honest-scope-deferral.md`](../../../checklists/honest-scope-deferral.md)
