# User Flow Questions

Explainer ID: FSEXP-012  
Source lines: 47-55, 60-64, 691-698  
Related IDs: PRD-007, PRD-025; FSTECH-010-FSTECH-011

## Core Point

The source PRD names interactions but does not fully define the user flow. The first implementation must decide how someone actually uses the experience.

## Questions To Resolve

| Question | Why It Matters |
|---|---|
| Is the experience interactive, ambient, or both? | Changes control density and scene pacing. |
| Does the user tilt a glass, swipe to pour, or use sliders? | Defines the first input model. |
| Is viscosity adjustable? | Affects UI, state, and simulation parameters. |
| Does Watch or DeviceMotion control come later? | Prevents scope creep in Slice 1. |
| How minimal should the HUD be? | Protects the immersion-first product principle. |

## Recommended Slice 1 Answer

Use pointer/touch tilt and pour controls, a minimal HUD, a reduced-motion toggle, and a visible performance readout. Defer DeviceMotion, Watch, and native sensor controls.
