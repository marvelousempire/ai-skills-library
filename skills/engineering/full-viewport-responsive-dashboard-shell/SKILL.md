---
name: full-viewport-responsive-dashboard-shell
description: Build and review browser dashboard shells that fill the viewport cleanly across phone, laptop, ultrawide, and wall/TV displays. Use when creating or auditing operator dashboards, product hubs, dense tools pages, responsive dashboard grids, sidebar layouts, or full-viewport web app shells.
disable-model-invocation: true
---

# Full Viewport Responsive Dashboard Shell

## Use This Skill When

- Building or reviewing a browser dashboard, operator surface, product hub, or dense tools page.
- A UI wastes width with fixed `max-width` gutters.
- Sidebars, charts, terminals, or card grids overflow horizontally.
- The same dashboard must work from phone width to wall / TV display width.

## Required Pattern

1. Put `min-height: 100dvh` on the primary app wrapper.
2. Ensure `html`, `body`, and `#root` also support full-height rendering.
3. Do not put an artificial fixed `max-width` on the main dashboard shell.
4. Use responsive horizontal padding instead of fixed page gutters.
5. Use fluid side columns such as `clamp(11rem, 15vw, 17.25rem)`.
6. Use `minmax(0, 1fr)` for center tracks and any `fr` track that must shrink.
7. Keep a three-breakpoint ladder: stacked below `md`, two columns at `md`, optional third rail at `lg`.
8. Give terminals and output panes internal scroll regions instead of letting them stretch the page.
9. Verify from about `360px` wide through fullscreen with no persistent horizontal scrollbar.

## Default Verification

Run the project equivalent of:

```bash
pnpm exec tsc --noEmit
```

Then manually resize the dashboard from phone width to fullscreen. Horizontal overflow is allowed only inside intentional controlled regions, such as a terminal with its own scroll.

## Reference

For the full checklist and reference implementation, read:

- [`../tech-stacks/dashboards/full-viewport-responsive-dashboard-shell.md`](../tech-stacks/dashboards/full-viewport-responsive-dashboard-shell.md)
