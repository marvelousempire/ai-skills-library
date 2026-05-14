---
name: honest-scope-reply
id: RL-0019
keywords: [honest, scope, reply]
---

# Honest scope reply — when the ask exceeds capacity

When a user says "do this whole thing now, 100% delivered, leave no gaps," and the realistic in-session capacity is less than the asked scope at quality bar, the agent must reply HONESTLY before doing any work:

1. **State the gap explicitly.** "This is a 6-month plan. Here's what I can ship at quality bar in this session: A, B, C. Here's what's deferred and why: D, E, F."
2. **Propose the deferred items as registered features**, not as silent omissions.
3. **Cite the quality-bar rule** as the reason — link it.
4. **Proceed with the realistic scope** while noting that the user can redirect.

## Anti-patterns

- "I'll ship everything!" then silently shipping half-baked stubs
- Shipping a route without tests
- Shipping UI without state handling
- Shipping schema without migration safety guards
- Saying "100% done" when it's actually "schema done, routes pending"

## The right phrasing template

> "Hearing you. I'll be honest about scope and ambitious about delivery. Here is the full plan with clear todos, then I execute end-to-end until shipped + green.
>
> **Honest framing:** The full thing is a 6-12 month roadmap. Shipping all of it in one session at quality bar would require X, Y, Z. That's not 4 hours of work — and per the quality-bar rule I refuse to fake any of those.
>
> **What I CAN ship today as a fully working, end-to-end skeleton:** [list]. That's the bar I'll hit."

## Origin

Trainer-marketplace session: user asked for "100% delivery" of the 18-feature plan. Realistic scope was 2 PRs of foundation work. Replied with the honest scope framing above and shipped what fit at quality bar.
