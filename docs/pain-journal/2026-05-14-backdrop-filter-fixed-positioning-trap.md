# `backdrop-filter` creates a containing block — `fixed inset-0` children trapped inside ancestor

**First seen:** 2026-05-14 (brokerage-prototype, Stack badge / modal work)
**Session:** [`2026-05-14-brokerage-make-shim-docker-colima`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
**Category:** ui / css / containing-block

## Symptom

Modal rendered when triggered from header button. `getBoundingClientRect()` shows `top: -365px` — partially off-screen. Tabs + eyebrow + title scrolled above viewport, only middle content visible. Centering with `flex items-center` not working.

## Diagnose (30 seconds)

```js
// Walk the parent chain looking for an ancestor with backdrop-filter
let el = document.querySelector('[role="dialog"]');
while (el) {
  const bf = getComputedStyle(el).backdropFilter;
  if (bf && bf !== 'none') { console.log('CULPRIT:', el.className); break; }
  el = el.parentElement;
}
```

If any ancestor has `backdrop-filter` (Tailwind `backdrop-blur-*`) → containing-block trap.

## Fix

Render modal contents via `createPortal(..., document.body)` so they escape the ancestor's containing block:

```tsx
import { createPortal } from 'react-dom';
return createPortal(<>...</>, document.body);
```

## Root cause

Per CSS spec, `backdrop-filter` (and `filter`, `transform`, `perspective`, `will-change`, `contain`) on an ancestor creates a new containing block. Descendants with `position: fixed` resolve against that ancestor's box, not the viewport.

## Prevention

- When adopting a modal/popover/tooltip into a new layout, render via portal to `document.body`. Don't trust ancestor-relative `fixed` positioning.
- Add CSS lint rule: if a component uses `position: fixed` AND an ancestor uses `backdrop-filter`, flag it.

## Related

- Pain: [`2026-05-14-framer-motion-portal-animatepresence-unmount.md`](2026-05-14-framer-motion-portal-animatepresence-unmount.md) (the bug the portal-fix uncovered)
- Master Report: [`2026-05-14-brokerage-make-shim-docker-colima.md`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md) Section "Patterns that failed"
