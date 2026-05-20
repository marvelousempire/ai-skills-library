# Token Bridge

Explainer ID: FSEXP-010  
Source lines: 41-45, 512-520, 621-638  
Related IDs: PRD-003, PRD-004, PRD-023; FSTECH-034

## Core Point

Shared tokens are the cross-platform glue. They should unify not only colors and spacing, but also motion timing, easing, glow, blur, shader parameters, and fluid behavior.

## Token Categories

| Category | Examples |
|---|---|
| Color | Background depth, milk color, glow accents, highlight tones. |
| Motion | Easing, pulse speed, slow-motion timing, spring response. |
| Effects | Bloom intensity, blur, vignette, fog, film grain. |
| Fluid parameters | Viscosity, opacity, foam intensity, splash scale, gravity multiplier. |
| Interaction | Tilt sensitivity, pour threshold, haptic intensity, HUD timing. |

## Why It Matters

Web and native can use different rendering engines while still feeling like the same product if the sensory parameters are shared.

## First Slice

Start with a small token object for cinematic colors, glow, easing, and fluid parameters. Expand to Style Dictionary or Tokens Studio once multiple surfaces need the same values.
