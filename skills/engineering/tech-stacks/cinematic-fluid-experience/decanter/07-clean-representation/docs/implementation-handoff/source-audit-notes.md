# Source Audit Notes

Explainer ID: FSEXP-024  
Source lines: 348-372  
Related IDs: PRD-004-PRD-006, PRD-009, PRD-025-PRD-027; FSTECH-013, FSTECH-034-FSTECH-035

## Core Point

The source PRD contains an audit that identified items that were missing or lightly represented in earlier versions. Those notes remain useful even though later blocks claim everything is complete.

## Audit Findings

| Missing / Light Item | Meaning |
|---|---|
| Design tokens | Needed for colors, easing, glow, blur, and fluid parameters. |
| Performance details | Needed for LOD, culling, mobile strategy, and profiling. |
| Sound implementation | Needed for AVFoundation, Spatial Audio, Web Audio API, or Howler.js choices. |
| Milk-specific traits | Needed for opacity, viscosity, creamy look, splashes, and foam. |
| User flow | Needed to define tilt, pour, pinch, sliders, ambient mode, or interaction mode. |
| Asset pipeline | Needed to keep models, textures, shaders, web, iOS, and Blender aligned. |

## Handling

Keep these audit notes as solvency warnings. A later polished PRD block does not prove these areas are implemented or verified.
