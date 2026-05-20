# First Build Slice

## Slice Name

Web cinematic fluid hero v2 (ACES + WebGPU fluid showcase).

## SSOT

| Topic | Canonical path |
|-------|----------------|
| Product | [`../../doctrine/docs/product/canonical-prd.md`](../../doctrine/docs/product/canonical-prd.md) |
| Visual quality | [`../../doctrine/docs/quality/bible/`](../../doctrine/docs/quality/bible/README.md) + [`shaders/`](../../doctrine/docs/quality/shaders/README.md) |
| AI session prompts | [`../../doctrine/docs/quality/ai-prompt-templates.md`](../../doctrine/docs/quality/ai-prompt-templates.md) |
| Implementation plan | [`../../../../plans/0037-cinematic-fluid-experience-v2.md`](../../../../plans/0037-cinematic-fluid-experience-v2.md) |

## Why This Slice First

The corrected product intent is a **premium cinematic interactive PWA** — not a milk-pour simulator. The web path proves Hollywood-grade motion, ACES post-processing, and GPU fluid in the browser before native RealityKit, Watch, scanning, or backend multiply scope.

## Micro-Slice Formula

```text
Intent: Prove broadcast-smooth cinematic fluid in the browser.
Valid Intent: One web app (hero v2) instead of full multi-platform stack.
Concept: R3F + ACES post + WebGPU/credible fluid volume + arena garnish orbs.
Notion: Pointer orbit + Device Motion tilt; defer native arena HUD slice D.
Solvency: Master Bible + canonical PRD name Vite/React/R3F/WebGPU.
Environment: apps/cinematic-fluid-hero under decanter.
Micro-slice: Bible-aligned tokens, post, fluid center, reduced-motion.
Action: Plan 0037 — implement slices A–C, commit docs + app.
Witness: tsc, build, make ui, WebGPU chip, reduced-motion toggle.
```

## Scope

Build:

- [`../apps/cinematic-fluid-hero/`](../apps/cinematic-fluid-hero/) v0.2 — locked tokens, ACES-style post, fluid volume hero, WebGPU with fallback.
- Cross-links from decanter to `doctrine/` SSOT.

Defer:

- Native `CinematicBroadcastArenaView` (see [`../../doctrine/docs/arena/cinematic-broadcast-arena.md`](../../doctrine/docs/arena/cinematic-broadcast-arena.md)).
- Scoreboard / play-by-play HUD (slice D).
- Firebase, Blender, Watch, scanning, 3D printing.

## Lab app (not product direction)

[`../apps/milk-pour/`](../apps/milk-pour/) — interaction spike only; do not treat as the product subject.

## Acceptance Criteria

- App runs with `make ui` on port 5179.
- Scene reads cinematic (bloom, grain, dark void, cyan/orange) — not flat SaaS.
- Center fluid volume responds to time and tilt; orbit controls work.
- Reduced-motion dampens post and sim.
- WebGPU unsupported shows chip; WebGL fallback still runs.

## Recommended Next Slice

Slice D — holographic scoreboard + `BroadcastArenaModel` (Zustand) per arena bridge doc.
