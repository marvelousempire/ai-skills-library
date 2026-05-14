---
name: framer-motion-transform-guard
id: RL-0016
keywords: [enforce-framer, check-motion, build-transform]
goal: Deliver framer motion transform guard output correctly and completely.
hash: fe55f32
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# framer-motion transform guard

## The bug

Tailwind transform classes (`-translate-x-1/2`, `translate-y-4`, `scale-95`,
`rotate-3`, etc.) are silently overridden when framer-motion animates any
transform property on the same element. The CSS class appears to work in
static code, but as soon as framer-motion renders even one animated transform
(`y`, `scale`, `opacity` with transform side-effects), the element's
`transform` inline style is owned by framer-motion and the CSS class is
completely ignored.

**This failure is silent.** TypeScript, ESLint, and the browser console
produce zero warnings. The element simply doesn't move to where you intended.

---

## Why it happens

The CSS `transform` property is a single shorthand. Both Tailwind and
framer-motion write to it:

- Tailwind class: `transform: translateX(-50%)` → applied via stylesheet
- framer-motion: `transform: translateY(0px) scale(1)` → applied via inline style

Inline styles have higher specificity than class-based styles in CSS. When
framer-motion sets an inline `transform`, the Tailwind class is overridden
for every transform function — including ones framer-motion isn't explicitly
managing.

Modern framer-motion (v10+) uses CSS custom properties (`--motion-translate-x`,
`--motion-scale`, etc.) for individual transform components, but still writes
an inline `transform` that consumes those variables. The result is the same:
Tailwind's `transform` declaration loses.

---

## The wrong pattern

```tsx
// ❌ -translate-x-1/2 is silently ignored because framer-motion
//    owns `transform` via animate={{ y, scale }}
<motion.div
  initial={{ opacity: 0, y: -6, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  className="absolute left-1/2 -translate-x-1/2"
>
```

The panel's left edge sits at `left: 50%` and extends rightward instead of
being centered. The fix that looks right in a static diff will be invisible
at runtime.

---

## The right pattern

Pass the centering offset as a motion value via `style` so framer-motion
manages the full transform composite:

```tsx
// ✅ x is owned by framer-motion alongside y and scale — no conflict
<motion.div
  initial={{ opacity: 0, y: -6, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  style={{ x: "-50%" }}
  className="absolute left-1/2"
>
```

The `style` prop on a `motion.*` component accepts individual transform
motion values (`x`, `y`, `scale`, `rotate`, `skewX`, `skewY`). Setting
`x: "-50%"` tells framer-motion to include the horizontal shift in its
managed transform composite. No conflict, no override.

---

## Detection checklist

Before opening a PR that uses framer-motion, scan every `motion.*` element
for this pattern:

```bash
# Find motion elements that combine animate/initial with CSS transform classes
grep -rn "motion\." --include="*.tsx" --include="*.jsx" . \
  | grep -v "//.*motion" \
  | grep "translate-\|scale-\|rotate-\|skew-"
```

For each hit, check whether the same element also has `animate=`, `initial=`,
or `exit=` props. If yes — move those CSS transform classes to `style=` motion
values.

---

## Transform class → motion value mapping

| Tailwind class | framer-motion `style` equivalent |
|---|---|
| `-translate-x-1/2` | `x: "-50%"` |
| `translate-x-4` | `x: "1rem"` or `x: 16` (px) |
| `translate-y-2` | `y: "0.5rem"` or `y: 8` |
| `-translate-y-full` | `y: "-100%"` |
| `scale-95` | `scale: 0.95` |
| `rotate-3` | `rotate: 3` |
| `skew-x-6` | `skewX: 6` |

---

## When CSS classes ARE safe on motion elements

Tailwind classes that don't write to `transform` are unaffected:
`position`, `top/left/right/bottom`, `width`, `height`, `z-index`,
`opacity` (only if framer-motion is NOT animating opacity), `padding`,
`border-radius`, `background`, `shadow`, `overflow`, etc.

Only classes that expand to a CSS `transform: ...` declaration conflict.

---

## Related rules

- [`parallel-surfaces-from-day-one`](parallel-surfaces-from-day-one.mdc) — architecture context
- [`dev-discipline`](dev-discipline.mdc) — diagnose root cause before attempting a second fix;
  if the first fix moved the symptom rather than eliminating it, you're not done
