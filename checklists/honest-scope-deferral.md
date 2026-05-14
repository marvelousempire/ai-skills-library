# Honest-scope deferral checklist

Use when the user's ask exceeds session capacity at quality bar.

## Step 1: Assess the gap

- [ ] What's the asked scope, in concrete deliverables?
- [ ] What's the realistic in-session capacity at quality bar?
- [ ] What's the gap, named explicitly?

## Step 2: Reply with the honest framing

Template:

> "Hearing you. I'll be honest about scope and ambitious about delivery.
>
> **Honest framing:** The full thing is a <N>-month roadmap. Shipping all of it in one session at quality bar would require <X, Y, Z>. That's not <T> hours of work — and per the quality-bar rule I refuse to fake any of those.
>
> **What I CAN ship today as a fully working, end-to-end skeleton — every layer real, every layer tested, every layer green:**
> 1. <Item 1>
> 2. <Item 2>
> 3. <Item 3>
>
> That's the bar I'll hit."

## Step 3: Register the deferred items

For each deferred item:
- [ ] Has a feature row in the ledger? If not, register via `ledger-orchestrator` agent
- [ ] Has a one-sentence reason for deferral?
- [ ] Has an owner or "next-PR" tag?

## Step 4: Execute the realistic scope

- [ ] Proceed with the realistic-scope work
- [ ] Note in the final delivery report what was deferred and where it lives

## Step 5: Confirm

The user may redirect ("no, just do everything anyway"). If they do, re-affirm:

> "I'll do as much as I can but I won't ship a hack at the boundaries. If I hit a wall on <specific item>, I'll register it and move on."

## Anti-patterns

- ❌ Saying "yes 100% done" then silently shipping stubs
- ❌ Hiding the deferral inside a long response that buries the truth
- ❌ Making the user discover the deferral when they go to use the "shipped" feature

## Origin

`rules/library/honest-scope-reply`. Real example: trainer-marketplace session, where "100% delivery" of an 18-feature plan was asked but only 2 PRs of foundation fit at quality bar.
