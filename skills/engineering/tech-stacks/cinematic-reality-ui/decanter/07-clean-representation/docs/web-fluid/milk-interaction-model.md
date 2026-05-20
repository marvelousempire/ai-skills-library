# Milk Interaction Model

Explainer ID: FSEXP-005  
Source lines: 287-295  
Related IDs: PRD-005, PRD-006, PRD-007, PRD-010, PRD-027; FSTECH-007-FSTECH-011, FSTECH-035

## Core Point

The milk interaction model turns user input into believable liquid behavior: tilt changes gravity, container rotation releases particles, opacity/scattering sells creaminess, and performance fallbacks keep it usable.

## Interaction Pieces

| Piece | Meaning |
|---|---|
| Tilt | Changes the apparent gravity vector or pour angle. |
| Container rotation | Opens the pour path and lets particles or shader flow leave the glass. |
| Opacity and scattering | Make the liquid read as milk, not clear water. |
| Splash / foam hints | Communicate impact and viscosity without requiring a perfect solver. |
| LOD fallback | Keeps frame rate stable on weaker devices. |

## Slice 1 Boundary

Use pointer or touch tilt first. DeviceMotion can come after the model proves it is fun and visually credible.
