# framer-motion + CSS transform compositing

Reference doc for how framer-motion and CSS utility classes interact on the
`transform` property — and how to avoid the silent override bug.

---

## The core problem

CSS `transform` is a **single shorthand property**. Every declaration that
writes to it overwrites the entire value — including the parts it doesn't
mention.

```css
/* Class sets this: */
transform: translateX(-50%);

/* Inline style sets this (framer-motion, at runtime): */
transform: translateY(0px) scale(1);

/* Result: the class is gone. translateX(-50%) does not apply. */
```

Inline styles have higher specificity than class-based styles in CSS. When
framer-motion renders an animated element, it owns the `transform` property
via inline style. Every Tailwind class that writes `transform` is silently
ignored.

---

## Which Tailwind classes write `transform`

Any class from these groups expands to a CSS `transform: ...` declaration:

| Class group | Example | CSS output |
|---|---|---|
| Translate | `-translate-x-1/2` | `transform: translateX(-50%)` |
| Scale | `scale-95` | `transform: scale(0.95)` |
| Rotate | `rotate-3` | `transform: rotate(3deg)` |
| Skew | `skew-x-6` | `transform: skewX(6deg)` |
| `translate-y-4` | | `transform: translateY(1rem)` |

All of these are overridden when framer-motion animates any transform on
the same element.

---

## How framer-motion manages transforms

framer-motion tracks transforms as individual **motion values**: `x`, `y`,
`scale`, `scaleX`, `scaleY`, `rotate`, `rotateX`, `rotateY`, `skewX`,
`skewY`, `originX`, `originY`.

At render time, it composes all active motion values into a single `transform`
inline style. In framer-motion v10+, it uses CSS custom properties:

```css
/* What framer-motion actually writes to the DOM: */
--motion-translate-x: 0px;
--motion-translate-y: 0px;
--motion-scale: 1;
transform: translateX(var(--motion-translate-x))
           translateY(var(--motion-translate-y))
           scale(var(--motion-scale));
```

This inline `transform` wins over any stylesheet declaration, including
Tailwind classes.

---

## The safe pattern

**Do not use Tailwind transform classes on elements that framer-motion animates.**
Pass all transforms to framer-motion via `style` (motion values) or `animate`/`initial`:

```tsx
// ❌ CSS class is silently overridden
<motion.div
  animate={{ y: 0, scale: 1 }}
  className="-translate-x-1/2 absolute left-1/2"
/>

// ✅ framer-motion owns all transforms
<motion.div
  animate={{ y: 0, scale: 1 }}
  style={{ x: "-50%" }}
  className="absolute left-1/2"
/>
```

The `style` prop on `motion.*` components accepts motion values directly.
Setting `x: "-50%"` tells framer-motion to include it in the composite
transform it manages. No CSS class needed, no conflict possible.

---

## Motion value → Tailwind class mapping

| Tailwind class | motion `style` equivalent | Notes |
|---|---|---|
| `-translate-x-1/2` | `style={{ x: "-50%" }}` | Most common case |
| `translate-x-4` | `style={{ x: 16 }}` or `style={{ x: "1rem" }}` | px or rem |
| `-translate-y-full` | `style={{ y: "-100%" }}` | |
| `translate-y-2` | `style={{ y: 8 }}` | |
| `scale-95` | `style={{ scale: 0.95 }}` | Or `initial={{ scale: 0.95 }}` |
| `rotate-3` | `style={{ rotate: 3 }}` | Degrees |
| `skew-x-6` | `style={{ skewX: 6 }}` | |

---

## What IS safe on animated elements

Tailwind classes that don't write to `transform` are unaffected:

- Positioning: `absolute`, `fixed`, `relative`, `left-*`, `top-*`, `right-*`, `bottom-*`
- Size: `w-*`, `h-*`, `max-w-*`
- Display/flex: `flex`, `grid`, `hidden`, `block`, `items-*`, `justify-*`
- Spacing: `p-*`, `px-*`, `m-*`, `gap-*`
- Color/appearance: `bg-*`, `text-*`, `border-*`, `shadow-*`, `rounded-*`
- Z-index: `z-*`
- Origin: `origin-top`, `origin-center`, etc. (safe — sets `transform-origin`, not `transform`)
- `overflow-*`, `pointer-events-*`, `cursor-*`

Only the transform group is dangerous.

---

## Detecting the problem in an existing codebase

```bash
# Find motion elements with CSS transform classes
grep -rn "motion\." --include="*.tsx" --include="*.jsx" . \
  | grep -v "^.*//.*motion" \
  | grep -E "\-translate-|\bscale-|\brotate-|\bskew-"
```

For each match: check whether the same element has `animate=`, `initial=`,
or `exit=` props. If yes, the CSS transform class is being ignored silently.

---

## Historical incident

**2026-05-14, readyplay.app mega menu** (PR #734 → #736):

The marketing site mega menu was rendering ~400px right of center. First fix
changed `position: fixed` to `position: absolute` to use a different containing
block. Still wrong. Second investigation found the root cause: the `<motion.div>`
had `animate={{ y: -6, scale: 0.98 }}` which caused framer-motion to own the
`transform` inline style. The `-translate-x-1/2` Tailwind class was silently
dropped. Menu's left edge sat at `left: 50%` with no x-offset.

Fix: removed `-translate-x-1/2` from `className`, added `style={{ x: "-50%" }}`.
One line. Fixed permanently.

Cost of not knowing this rule upfront: 2 PRs, 3 deploy cycles, ~45 minutes.

---

## See also

- Rule: [`framer-motion-transform-guard`](../rules/library/framer-motion-transform-guard/body.md) — the enforcement rule for this doc
- Rule: [`root-cause-not-symptom`](../rules/library/root-cause-not-symptom/body.md) — how we found this after two failed fixes
