---
name: live-dashboard-pattern
id: RL-0061
keywords: [enforce-dashboard, check-live, build-realtime, ui-motion]
goal: Every native CT agent card must feel like a live dashboard — auto-polling, tweened numbers, transitioned meters, sparkline history, live pulse — using the shared primitives, not hand-rolled timers.
hash: pending
relations: [contracts-and-prudence, quality-bar-do-it-right, plan-first-for-substantive]
before: []
governed_by: [global]
meta: dynamic
---

# Live dashboard pattern — every agent card must FEEL alive

## The verbatim source (stated by Avery 2026-05-22)

> Do those seed pages offer the same real time analytics in animations as a
> sophisticated dashboard would? Or are they just static they need to be real
> time animated live moving instances, each item in each graph and each chart.

Said in response to the first native CT card (`/dustpan`) which was a snapshot
UI — fetched once, sat there. The operator's standard for "dashboard" is
**live motion**, not "rendered HTML."

## The rule

Every native Control Tower agent summary card (and every dashboard-shaped
surface in this stack — Clinic, Historia, Nephew, AI Skills Library product
pages, anything that displays operational metrics) MUST:

1. **Auto-poll**, not poll-on-click. Default 2.5s for fast-changing data
   (disks, processes, executions), 30s for slow data (PR lists, project
   counts), 5–10s in between. Pause polling when `document.visibilityState`
   is not `visible`.
2. **Animate numeric changes.** Use `<AnimatedNumber>` so 166.46 → 167.12 GB
   tweens via easeOutCubic over ~700ms rather than snapping.
3. **Transition meter bars.** Width changes must run through
   `transition-all duration-700 ease-out`, not jump.
4. **Show sparklines / trend lines** for every interesting tile. Build the
   history client-side from a ring buffer (default 60 samples) — no
   server-side history endpoint is required for v1.
5. **Indicate liveness.** A `<LiveDot>` pulse beside the title or topbar
   subtitle tells the operator the data is fresh, with a tooltip carrying
   the last-fetch age.
6. **Degrade gracefully.** If the backend is unreachable, surface the
   error state with the exact one-line command to bring it back up, AND
   keep polling silently so the page recovers the moment the backend
   returns. Never freeze the UI.

## Use the canonical primitives — do not roll your own

The Nephew repo ships these primitives at
`apps/control-tower/src/lib/live-dashboard.tsx`:

| Primitive | Purpose |
|-----------|---------|
| `useLivePoll<T>(fetcher, opts)` | Auto-polling hook with ring buffer + visibility-pause + cancellation |
| `<AnimatedNumber value fmt durationMs />` | requestAnimationFrame tween between numeric values |
| `<MeterBar pct height />` | CSS-transitioned width bar with auto color band (green / amber / rose) |
| `<Sparkline series width height />` | Inline SVG trend line driven by client-side history |
| `<LiveDot fetchedAt error loading />` | Pulsing indicator with age tooltip |
| `<LiveTile label value fmt series unit />` | Composed tile (label + animated number + sparkline) for aggregate headers |

If you find yourself writing `setInterval`, `requestAnimationFrame`, or an
inline SVG path for a sparkline inside an agent card, STOP — import the
primitive instead.

## When this fires

- Building a new native CT agent summary card (every entry in
  `data/mcp-registry.json` with an HTTP API)
- Building any product page in Clinic, Historia, or the AI Skills Library
  that surfaces operational counts, percentages, or "is this thing alive"
- Adding metrics to an existing static page in any operator-built repo
- Reviewing a PR that introduces a new dashboard surface

If the page is showing **state that changes** and is intended to be looked
at for more than a few seconds, this rule applies.

## When this does NOT fire

- Genuinely static lists: skill catalogs, plugin directories, operator
  documentation tables. These are reference content and should stay quiet.
- Form-driven editors: settings panes, marketplace product editors. These
  are write surfaces, not read surfaces.
- The MCP Status page (`/mcp`) is a hybrid — the registry IS static (built
  at bundle time) but the reachability probe is live. It already follows
  this rule for the probe.

## Examples

### ✓ Compliant — DustPan summary card (`apps/control-tower/src/pages/DustpanSummaryPage.tsx`)

- `useLivePoll<DisksPayload>(fetcher, { intervalMs: 2500, historySize: 60 })`
- Aggregate header: 4 `<LiveTile>` with `<AnimatedNumber>` + per-metric `<Sparkline>`
- Per-disk grid: `<AnimatedNumber>` for free / used%, `<MeterBar>` for the
  width bar, per-disk `<Sparkline>` of `free_gb` history
- `<LiveDot>` in the topbar title
- Error state visible but polling continues — page auto-recovers when
  DustPan comes back up

### ✗ Violation — the v1 of the same page (commit 31b36b1, superseded)

- Single `fetch` on mount, no auto-poll
- Bare HTML `<div style={{ width: '17.9%' }} />` meter — snaps on update
- Plain numeric text — jumps from 166.4 to 167.1
- No sparkline, no history, no live indicator

That page rendered. It did not feel alive. The user's reaction was the
trigger for this rule.

## Why

A control tower's job is to give the operator a **felt sense** of system
state, not just a rendered representation. Static snapshots train the eye
to ignore the page; live motion trains the eye to glance at it and trust
the answer. The cost of building this correctly once (the shared primitives
above) is amortized across every agent card we ever build.

## Related

- **Plan:** [`plans/0059-native-ct-agent-cards.md`](../../plans/0059-native-ct-agent-cards.md) — the rollout this rule formalizes
- **Code:** [`apps/control-tower/src/lib/live-dashboard.tsx`](../../apps/control-tower/src/lib/live-dashboard.tsx) — the primitives
- **Reference impl:** [`apps/control-tower/src/pages/DustpanSummaryPage.tsx`](../../apps/control-tower/src/pages/DustpanSummaryPage.tsx) — the compliant page to copy
- **Report:** [`docs/breakthroughs/2026-05-22-live-dashboard-pattern.md`](../../docs/breakthroughs/2026-05-22-live-dashboard-pattern.md) — the narrative writeup
- **Philosophy:** [contracts-and-prudence](contracts-and-prudence.md) — building the right primitives once IS the prudent path
