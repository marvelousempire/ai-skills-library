# Cinematic Broadcast Arena ↔ Fluid Web Bridge

Source skills:
- [`../../../../../doctrine/docs/arena/cinematic-broadcast-arena.md`](../../../../../doctrine/docs/arena/cinematic-broadcast-arena.md) (native iOS broadcast arena blueprint)
- [`../../../../../doctrine/docs/prd-variants/fluid-experience-tech-stack.md`](../../../../../doctrine/docs/prd-variants/fluid-experience-tech-stack.md) (corrected web intention)
- `canonical-prd-draft.md`

## Shared philosophy (both skills)

| Principle | Native (`cinematic-broadcast-arena`) | Web (this project) |
|---|---|---|
| Immersion-first | Full-screen `RealityView`, hidden chrome | Full-viewport R3F canvas, minimal HUD |
| No crummy UI | SwiftUI only for auto-hiding overlays | Marketing chrome is glass/holographic, not flat panels |
| Mood | Dark blacks, neon cyan/orange, broadcast glow | Same token palette on web |
| Motion | Physics impulses, particles, slow-mo beats | Springy interactions, particle bursts, smooth 60fps |
| HUD in 3D | `ViewAttachmentComponent` scoreboards | Drei HTML overlay or mesh panels in scene space |
| Post-process | MPS bloom, vignette, film grain | `CinematicPostProcess` (ACES tone + bloom + grain + vignette) |
| Interactivity | `ManipulationComponent` stat orbs | Pointer tilt, drag orbit, pinch-scale hero objects |

## Corrected product intent (not milk)

The fluid PRD used “smooth as milk” as a **metaphor for motion quality**, not as the product subject. The web app is a **premium cinematic interactive PWA** — a technical showcase where users engage 3D objects with tilt, drag, pinch, and rotate. Native broadcast arena is the iOS counterpart; `apps/cinematic-fluid-hero` is the web hero/marketing + foundation surface.

## Web implementation mapping

From `cinematic-broadcast-arena.md` §4 entity hierarchy → web hero (`HeroFluidScene`):

| Arena native (`CinematicBroadcastArenaView`) | Web (`cinematic-fluid-hero`) | Status |
|---|---|---|
| `EnvironmentResource` + additive blending | `fog` + dark `color` background + dual accent spotlights | Hero |
| Sport central object + physics | `CinematicFluidVolume` (GPU/CPU particles + screen-space shading) | Hero v0.2 |
| `ViewAttachmentComponent` scoreboard | Future: Drei `Html` lower-third in scene | Slice 2 |
| Play-by-play ticker entities | Future: scrolling HUD strip | Slice 2 |
| Stat orbs + `ManipulationComponent` | `StatOrb` meshes (float + emissive) | Hero |
| HR aura + strain-driven particles | Orange/cyan `Sparkles` layers (strain hook later) | Hero |
| `BroadcastRing` / stadium rim | `Torus` broadcast ring | Hero |
| MPS bloom / vignette / film grain | `CinematicPostProcess` + CSS vignette fallback (reduced motion) | Hero v0.2 |
| `BroadcastArenaModel` + `onChange` | Zustand + `useFrame` reactions | Slice D |
| Drag orbit camera | `OrbitControls` (reduced motion aware) | Hero v0.2 |
| `replayThrow` physics impulse | R3F physics / impulse burst on interaction | Slice 3 |
| HealthKit / WHOOP strain → post-process | Web: optional DeviceMotion + future API proxy | Later |

## Apps in this repo

| App | Role |
|---|---|
| `apps/cinematic-fluid-hero` | High-grade hero marketing site + arena aesthetic |
| `apps/milk-pour` | Deprecated interaction spike — do not treat as product direction |
