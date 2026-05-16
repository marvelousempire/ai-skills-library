# Full viewport responsive dashboard shell

**Status:** v1  
**Layer:** engineering / tech-stacks — **dashboards**

## Purpose

**[Nephew](https://github.com/marvelousempire/nephew)** (the CLOAK) is the **front door / Dealer**: orientation and catalog live there; **this file is the canonical shelf** for how browser dashboards should use the viewport. Consumer repos and agents follow this text; Nephew’s [`docs/rules/`](https://github.com/marvelousempire/nephew/tree/main/docs/rules) may carry a **stub** that routes here so the living catalog stays discoverable without duplicating doctrine.

Dashboard UIs shipped under the stacks in [`../README.md`](../README.md) **default to viewport-filling layouts** so they behave on a **large wall display** as well as a **small laptop** without horizontal breakage or gutters that waste space.

Use this checklist for operator surfaces, product hubs, and any “dense tools” page unless a charter explicitly chooses otherwise (narrow marketing site, fixed iframe embed, etc.).

## Checklist

### Shell

1. **`min-height: 100dvh`** on the primary app wrapper (prefer `dvh` over `vh` alone for mobile browser chrome).
2. **`html` / `body` / `#root`** carry at least **`min-height: 100dvh`** so standalone builds and webviews match browsers.
3. **No artificial `max-width` on the main shell** for dashboard views. Use **horizontal padding** only (`px-*` scaling by breakpoint), not a fixed `1280px` gutter.
4. **Footer / chrome:** when the main column is short, use a **column flex** shell with **`mt-auto`** on the footer so it sits at the bottom of the viewport; long pages still grow and scroll with the document.

### Grid and sidebars

5. **Side columns:** use **fluid tracks**, not fixed pixel rails only — e.g. **`clamp(11rem, 15vw, 17.25rem)`** for sidebars and **`minmax(0, 1fr)`** for the center so ultrawide and TV widths give width to the main pane.
6. **Breakpoints:** keep a **three-breakpoint ladder** for nav (e.g. `< md` stack, `md` two columns, `lg` third rail when needed). Avoid duplicating the same sub-nav on small screens (e.g. hide the right rail when pills already appear above main).
7. **Multi-column CSS grids:** every **`fr` track** that should shrink must be wrapped in **`minmax(0, …)`** so content cannot force horizontal overflow.

### Multi-pane rows (charts, terminal, cards)

8. **Pane rows** (e.g. hero · chart · console) use **`minmax(0, Nfr)`** column definitions and **stack at smaller breakpoints** (two columns, then one) with explicit **min-height** on spanning cells only when needed for readability.

## Verification

- Resize from ~360px width to fullscreen; no persistent horizontal scrollbar except intentional wide content inside a controlled region (e.g. terminal with its own scroll).
- **Literal check:** `pnpm exec tsc --noEmit` (or project equivalent) after layout refactors.

## Reference implementation

**Dustpan** ([xcode-cleanup-shortcut](https://github.com/marvelousempire/xcode-cleanup-shortcut)): repo plan [`plans/0028-full-viewport-responsive-dashboard-shell.md`](https://github.com/marvelousempire/xcode-cleanup-shortcut/blob/main/plans/0028-full-viewport-responsive-dashboard-shell.md) (shell + `.overview-top` grid hardening).

## Related skills / rules

- [app-launch-workflow](../../../../rules/library/app-launch-workflow/body.md) — canonical web build targets and UI polish expectations when the app ships a Vite dashboard.

## See also (Nephew)

- [Operations Dashboard agent](https://github.com/marvelousempire/nephew/blob/main/docs/agents/operations-dashboard/AGENT.md) — terminal / JSON operator board today; this doc applies when a browser UI is added or extended.
