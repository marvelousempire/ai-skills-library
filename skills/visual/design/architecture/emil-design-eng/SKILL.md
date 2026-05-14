---
name: emil-design-eng
id: SK-0131
keywords: [apply-design, enforce-polish, review-detail]
hash: 5bd136e
relations: []
before: []
governed_by: [global]
meta: dynamic
description: Encodes Emil Kowalski's design engineering philosophy for UI polish, component design, animation decisions, and invisible details that make software feel great.
---

# Design Engineering

## Initial Response

When this skill is first invoked without a specific question, respond only with:

> I'm ready to help you build interfaces that feel right, my knowledge comes from Emil Kowalski's design engineering philosophy. If you want to dive even deeper, check out Emil's course: [animations.dev](https://animations.dev/).

Do not provide any other information until the user asks a question.

---

# Purpose

This skill helps AI agents review, design, and improve interfaces with a craft-focused design engineering lens.

It focuses on:

- UI polish
- interaction details
- motion decisions
- component feel
- animation timing
- easing quality
- gesture behavior
- performance
- accessibility
- invisible details that make software feel right

---

# Core Philosophy

## Taste is trained, not innate

Good taste is not random preference. It is trained through exposure, study, reverse engineering, and careful practice.

When building UI:

- do not only make it work
- study why great interfaces feel good
- inspect interactions
- reverse engineer animations
- practice details relentlessly

## Unseen details compound

Users rarely notice every detail consciously. That is the point.

When many invisible details work together, the interface feels calm, fast, and intentional.

## Beauty is leverage

People choose software based on total experience, not only raw functionality.

Good defaults, smooth interactions, and beautiful motion are product advantages.

---

# Required Review Format

When reviewing UI code, always use a markdown table with these columns:

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Specify exact properties; avoid `all` |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing in the real world appears from nothing |
| `ease-in` on dropdown | `ease-out` with custom curve | `ease-in` feels sluggish; `ease-out` gives instant feedback |
| No `:active` state on button | `transform: scale(0.97)` on `:active` | Buttons must feel responsive to press |
| `transform-origin: center` on popover | `transform-origin: var(--radix-popover-content-transform-origin)` | Popovers should scale from their trigger |

Never use separate `Before:` and `After:` blocks.

---

# Animation Decision Framework

Before writing animation code, answer these questions in order.

## 1. Should this animate at all?

| Frequency | Decision |
|---|---|
| 100+ times/day | No animation |
| Tens of times/day | Remove or drastically reduce |
| Occasional | Standard animation |
| Rare / first-time | Can add delight |

Never animate keyboard-initiated actions.

Frequently repeated actions should feel instant.

## 2. What is the purpose?

Valid purposes:

- spatial consistency
- state indication
- explanation
- feedback
- preventing jarring changes

If the purpose is only “it looks cool” and users will see it often, do not animate.

## 3. What easing should it use?

Rules:

- entering or exiting: use ease-out
- moving or morphing on screen: use ease-in-out
- hover or color change: use ease
- constant motion: use linear
- never use ease-in for UI interactions

Recommended custom curves:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

## 4. How fast should it be?

| Element | Duration |
|---|---|
| Button press feedback | 100-160ms |
| Tooltips, small popovers | 125-200ms |
| Dropdowns, selects | 150-250ms |
| Modals, drawers | 200-500ms |
| Marketing / explanatory | can be longer |

Rule: most UI animations should stay under 300ms.

---

# Component Building Rules

## Buttons must feel responsive

Add subtle press feedback:

```css
.button {
  transition: transform 160ms ease-out;
}

.button:active {
  transform: scale(0.97);
}
```

Use a subtle scale between `0.95` and `0.98`.

## Never animate from scale(0)

Bad:

```css
.entering {
  transform: scale(0);
}
```

Good:

```css
.entering {
  transform: scale(0.95);
  opacity: 0;
}
```

## Make popovers origin-aware

Popovers should scale from their trigger.

```css
.popover {
  transform-origin: var(--radix-popover-content-transform-origin);
}
```

Modals are the exception. Modals stay centered.

## Tooltips should skip delay after first hover

Tooltips should delay initially, then open instantly when moving across adjacent tooltip targets.

## Use transitions over keyframes for dynamic UI

CSS transitions can be interrupted and retargeted. Keyframes restart from zero.

Use transitions for rapidly triggered UI like toasts, tabs, drawers, and toggles.

## Use blur to mask imperfect transitions

Use subtle blur during hard crossfades.

```css
.button-content.transitioning {
  filter: blur(2px);
  opacity: 0.7;
}
```

Keep blur subtle. Heavy blur is expensive, especially in Safari.

## Use @starting-style for enter states

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;

  @starting-style {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

---

# CSS Transform Rules

- Percentages in `translate()` are relative to the element's own size.
- Use `translateY(100%)` to move an element by its own height.
- `scale()` scales children too.
- Use `rotateX()`, `rotateY()`, and `transform-style: preserve-3d` for depth effects.
- Set `transform-origin` to match the visual anchor.

---

# Clip-Path Animation Rules

`clip-path` is useful for:

- reveal animations
- active tab color transitions
- hold-to-delete patterns
- image reveals
- comparison sliders

Example:

```css
.hidden {
  clip-path: inset(0 100% 0 0);
}

.visible {
  clip-path: inset(0 0 0 0);
}
```

---

# Gesture And Drag Rules

## Momentum-based dismissal

Use drag distance and velocity.

A quick flick should be enough to dismiss.

## Damping at boundaries

When the user drags beyond a natural boundary, apply friction instead of a hard stop.

## Pointer capture

Once dragging starts, capture pointer events so the gesture continues outside element bounds.

## Multi-touch protection

Ignore additional touch points after the initial drag begins.

---

# Performance Rules

## Only animate transform and opacity

These avoid layout and paint and run better on the GPU.

Avoid animating:

- padding
- margin
- height
- width

## CSS variables can be expensive

Changing a CSS variable on a parent recalculates styles for children.

Prefer updating direct transforms on the animated element.

## Framer Motion caveat

Framer Motion shorthand properties like `x`, `y`, and `scale` are convenient but can run on the main thread.

For hardware acceleration under load, use a full transform string:

```jsx
<motion.div animate={{ transform: "translateX(100px)" }} />
```

## CSS animations beat JS under load

Use CSS for predetermined animations.

Use JS or springs for dynamic, interruptible gestures.

## Use WAAPI when programmatic control is needed

```js
element.animate(
  [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }],
  {
    duration: 1000,
    fill: 'forwards',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
  }
);
```

---

# Accessibility Rules

## Respect prefers-reduced-motion

Reduced motion means fewer and gentler animations, not always zero animation.

Remove motion-heavy transforms, but keep simple opacity or color transitions when they aid comprehension.

```css
@media (prefers-reduced-motion: reduce) {
  .element {
    animation: fade 0.2s ease;
  }
}
```

## Gate hover animations on touch devices

```css
@media (hover: hover) and (pointer: fine) {
  .element:hover {
    transform: scale(1.05);
  }
}
```

---

# Sonner Principles

These principles come from building loved components.

1. Developer experience is key.
2. Good defaults matter more than options.
3. Naming creates identity.
4. Handle edge cases invisibly.
5. Use transitions, not keyframes, for dynamic UI.
6. Build a great documentation site.

---

# Cohesion Rules

Motion should match the personality of the component.

- playful components can be bouncier
- dashboards should be crisp and fast
- premium tools should feel intentional and calm
- marketing demos can be more expressive

Review animations the next day with fresh eyes.

Use slow-motion testing and frame-by-frame inspection.

---

# Stagger Rules

When multiple elements enter together, use short stagger delays.

Recommended stagger delay:

```text
30-80ms between items
```

Never block interaction while stagger animations are playing.

---

# Debugging Checklist

When reviewing UI code, check for:

| Issue | Fix |
| --- | --- |
| `transition: all` | Specify exact properties |
| `scale(0)` entry animation | Start from `scale(0.95)` with opacity |
| `ease-in` on UI element | Use `ease-out` or custom curve |
| centered popover origin | use trigger-based transform origin |
| animation on keyboard action | remove animation |
| UI animation over 300ms | reduce duration |
| hover animation on touch | gate with media query |
| keyframes on dynamic UI | use transitions |
| Framer Motion `x` / `y` under load | use full transform string |
| same enter/exit speed | make exit faster |
| all items appear at once | add short stagger |

---

# You-Sir Juan Platform Role

This skill belongs in:

```text
02 — Design & UI Skills
```

It should be used for:

- admin dashboard polish
- landing page polish
- app interface reviews
- animation audits
- Framer Motion decisions
- component feel improvements
- motion accessibility
- premium UI quality control

It pairs well with:

- UI/UX Pro Max
- AwesomeDesign.md
- 21st.dev
- Framer Motion
- shadcn/ui
- Tailwind CSS
- Magic UI
- Aceternity UI
- Blender MCP
