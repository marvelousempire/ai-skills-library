---
name: root-cause-not-symptom
id: RL-0037
keywords: [enforce-root, check-cause, build-symptom]
goal: Deliver root cause not symptom output correctly and completely.
hash: 6968b7f
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Root cause, not symptom

## The rule

Before shipping any fix, pass two tests:

1. **Mechanism test** — Can you name the specific mechanism that caused the
   bug, and explain in one sentence why your change eliminates that mechanism?
2. **Regression test** — If you removed your change, would the bug reappear
   exactly as before? (Not in a different form — exactly.)

If you can't pass both tests, you are addressing a symptom, not the cause.
A symptom fix makes the problem invisible in one place and visible somewhere
else. It also guarantees a follow-up fix — usually a more confusing one.

---

## What "symptom" vs "root cause" looks like

### Symptom fix (wrong)

> Bug: mega menu panel renders 400px to the right of center.
> Fix: change `position: fixed` to `position: absolute` with a different
> containing block.
> Result: panel now renders only 200px to the right. Slightly less wrong.
> Root cause: untouched.

The panel moved because the containing block changed, which changed the
reference frame for `left: 50%`. But the centering math was still
`left: 50%` with no x-offset — still wrong. Moving the containing block
moved the symptom; it did not fix the centering.

### Root cause fix (right)

> Root cause: framer-motion's inline `transform` style (set during `y` and
> `scale` animation) overrides the Tailwind `-translate-x-1/2` CSS class.
> The CSS class is silently ignored. `left: 50%` puts the left edge at
> center; with no x-translation the panel extends right.
> Fix: use `style={{ x: "-50%" }}` so framer-motion manages all transform
> components and no CSS class conflicts.
> Mechanism eliminated: there is no longer a CSS class making a claim on
> `transform` that framer-motion can override.

After this fix, no possible future change to the containing block, the
header's position property, or the animation values can re-introduce the
centering problem. The mechanism is gone.

---

## The two-question test (run before every fix)

**Q1: What exactly causes this bug?**
Write it out in one sentence. Not "the element is in the wrong position" —
that's the symptom. "framer-motion's inline style overrides the CSS class" —
that's the mechanism.

If you can't write the mechanism sentence, you don't understand the bug well
enough to fix it. Keep reading code.

**Q2: After your fix, how is it impossible for this bug to occur again?**
Not "the test passes" — test passing means the symptom is gone. Explain why
the mechanism no longer exists.

If your fix is "I moved X so it doesn't conflict with Y," ask: can X and Y
conflict in any other configuration? If yes, you fixed a case, not the cause.

---

## The cost of symptom fixes

Each symptom fix shipped produces:
- One follow-up bug report ("still broken in this other case")
- One more debug cycle (now with a confusing intermediate state)
- Accumulated technical debt (the symptom fix stays in the code alongside
  the eventual root fix, doing nothing useful)
- Erosion of trust in the system ("we fixed this three times")

Real-world cost from this codebase: the mega menu centering bug required
**3 PRs, 3 deploy cycles, and 2 user regression tests** before the root
cause (framer-motion transform override) was found and eliminated. The first
two PRs each addressed a different symptom. Total time lost: ~45 minutes.
Time to find the root cause once symptoms were set aside: 5 minutes.

---

## How to find the root cause when you can't see it

1. **Confirm the version is deployed.** If the symptom looks the same after
   a fix you were confident about, the deploy may not have landed.
   See [`live-version-before-debug`](live-version-before-debug.mdc).

2. **Remove all your changes and re-observe the raw bug.** Don't start with
   your assumptions. Start with what the browser/runtime actually shows.

3. **Work backwards from the output.** The panel is to the right → the
   x-translation is missing → something is overriding the class that applies
   it → what can override a CSS class? → inline styles → what sets inline
   styles on this element? → framer-motion.

4. **Search for the system that owns the property.** In CSS, `transform` is
   owned by exactly one declaration (the highest-specificity one). Find every
   declaration that writes `transform` on this element. The winner is the cause.

5. **Verify by removing the winner.** Remove the framer-motion animation → does
   the CSS class now work? Yes → framer-motion's inline style was the mechanism.

---

## Related rules

- [`live-version-before-debug`](live-version-before-debug.mdc) — confirm version first; eliminates a whole class of false root causes
- [`framer-motion-transform-guard`](framer-motion-transform-guard.mdc) — the specific pattern that burned us here
- [`dev-discipline`](dev-discipline.mdc) — the "quality bar" principle: do it right the first time
