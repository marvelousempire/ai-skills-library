---
name: live-dashboard-pattern
id: pending
keywords: [enforce-dashboard, check-live, build-realtime, ui-motion, animated-metrics]
goal: Make every operational dashboard surface FEEL alive — auto-polling, tweened numbers, transitioned meters, sparkline history — using shared primitives, never hand-rolled timers or inline SVGs.
hash: pending
relations: [aesthetic-consistency]
before: []
governed_by: [global]
meta: dynamic
description: Triggers on "live dashboard", "real-time UI", "animated metrics", "sparkline", "tween numbers", "auto-poll", "agent card", "control tower card", "static vs live", "moving meters", "felt sense of motion", "operations dashboard", "monitoring UI", "Nephew Control Tower native card", or any prompt asking whether a metrics page is "really live."
---

# live-dashboard-pattern — methodology skill

A control tower's job is to give the operator a felt sense of system state,
not just a rendered representation. Static snapshots train the eye to ignore
the page; live motion trains the eye to glance and trust. This skill is the
canonical recipe.

## When to use

Triggers: a prompt about building or upgrading a dashboard, monitoring UI,
agent card, ops surface, or any page that displays state that changes.
Specifically: "live dashboard", "real-time UI", "animated metrics", "is
this page actually live?", "feels static", "needs motion".

## The rule

Every dashboard-shaped surface MUST:

1. **Auto-poll**, not poll-on-click. 2.5s for fast data, 5–10s for medium,
   30s for slow. Pause when the tab is hidden.
2. **Tween numeric changes** via `requestAnimationFrame` + easeOutCubic
   (~700ms). Numbers must NEVER snap.
3. **Transition meter bars** via CSS `transition-all duration-700 ease-out`.
   Width changes ease, never jump.
4. **Carry sparklines** built from a client-side ring buffer (default 60
   samples). No server-side history endpoint required for v1.
5. **Show liveness** with a pulsing dot bearing a "last update Ns ago"
   tooltip.
6. **Degrade gracefully** — backend down, page keeps polling silently and
   surfaces the exact recovery command. Never freeze.

## How (canonical implementation)

Reference: `apps/control-tower/src/lib/live-dashboard.tsx` in the Nephew
repo ships six primitives that every dashboard must reuse:

| Primitive | Purpose |
|-----------|---------|
| `useLivePoll<T>(fetcher, opts)` | Polling + ring buffer + visibility-pause + cancellation |
| `<AnimatedNumber />` | RAF tween between numeric values |
| `<MeterBar />` | CSS-transitioned width bar with auto color band |
| `<Sparkline />` | Inline SVG trend driven by client-side history |
| `<LiveDot />` | Pulsing indicator + age tooltip |
| `<LiveTile />` | Composed: label + animated number + sparkline |

Reference page that uses all six: `apps/control-tower/src/pages/DustpanSummaryPage.tsx`.

If you find yourself writing `setInterval`, `requestAnimationFrame`, or an
inline SVG path inside a dashboard card, STOP — import the primitive.

## Why this exists

Codified from the 2026-05-22 Nephew Control Tower session. The operator's
verbatim trigger:

> "Do those seed pages offer the same real time analytics in animations as
> a sophisticated dashboard would? Or are they just static they need to be
> real time animated live moving instances, each item in each graph and
> each chart."

That moved the bar from "fast first paint" to **"live + animated + felt
sense of motion."** Documented in `nephew/docs/breakthroughs/2026-05-22-live-dashboard-pattern.md`.

## Pairing

- **Sister rule:** [rule-propagation-discipline] — propagated this skill
  to every operator-built surface in the same rollout
- **Aesthetic sibling:** [aesthetic-consistency] — defines the visual
  language; this skill adds the motion language
- **Plan:** Nephew plan 0059 — the rollout that produced the primitives
- **Reference impl:** `nephew/apps/control-tower/src/pages/DustpanSummaryPage.tsx`
