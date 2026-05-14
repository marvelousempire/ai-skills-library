# Framer Motion AnimatePresence + createPortal + body mount fails to unmount

**First seen:** 2026-05-14 (brokerage-prototype, session: brokerage-make-shim-docker-colima)
**Session:** [`2026-05-14-brokerage-make-shim-docker-colima`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
**Category:** ui / framer-motion / react-portal

## Symptom

Modal opens fine. User clicks close (button, backdrop, or ESC) → opacity animates to 0, transforms apply → elements stay in the DOM. `document.body.style.overflow` is reset (so `useEffect` cleanup ran, meaning `open=false`), but `[role="dialog"]` still queryable.

## Diagnose (30 seconds)

```bash
# In the preview's browser console:
document.querySelector('[role="dialog"]')                            # truthy after "close"
getComputedStyle(document.querySelector('[role="dialog"]')).opacity  # "0"
document.body.style.overflow                                          # "" (cleanup ran)
```

If all three → AnimatePresence is running exit animation but never unmounting children.

## Fix

Drop `AnimatePresence` entirely. Render conditionally and keep only the entry animation:

```tsx
if (!open) return null;
return createPortal(
  <>
    <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
    <motion.div role="dialog" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {children}
    </motion.div>
  </>,
  document.body
);
```

Loses the exit animation. Functionally correct.

## Root cause

When `AnimatePresence` is inside `createPortal` pointing at `document.body`, React reconciliation through the portal boundary loses the signal AnimatePresence needs to unmount its tracked children after exit. Tried wrapping in a single keyed `motion.div`; didn't help.

## Prevention

- Spike-test `AnimatePresence` in the target portal context before adopting in a production Modal.
- If you need an exit animation across portal boundary, use Radix UI Dialog (which handles this) or unmount manually with a `setTimeout` after `exit` duration.

## Related

- Pain: [`2026-05-14-backdrop-filter-fixed-positioning-trap.md`](2026-05-14-backdrop-filter-fixed-positioning-trap.md) (the bug that motivated the portal)
- Skill: [`skills/project/brokerage-prototype/launcher-makefile-shim/SKILL.md`](../../skills/project/brokerage-prototype/launcher-makefile-shim/SKILL.md) (unrelated; just the session)
- Master Report: [`2026-05-14-brokerage-make-shim-docker-colima.md`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md) Section "Patterns that failed"
