# Native Scene Architecture

Explainer ID: FSEXP-007  
Source lines: 577-580, 700-707, 825-828  
Related IDs: PRD-019, PRD-025; FSTECH-016-FSTECH-021

## Core Point

The native scene centers on `CinematicFluidArenaView`: a RealityView-based arena with root entities, a glass/container, fluid particles, HUD attachments, and post-processing.

## Architecture Shape

| Element | Role |
|---|---|
| Root entity hierarchy | Owns scene organization and lifecycle. |
| Glass/container entity | Gives the user a physical object to tilt, rotate, or inspect. |
| Fluid particles/effects | Represent milk, splashes, foam, and viscosity cues. |
| HUD attachments | Keep SwiftUI controls embedded without breaking immersion. |
| `postProcess` closure | Adds bloom, vignette, film grain, color grading, or distortion. |
| Model-driven updates | Lets state changes update the scene predictably. |

## Event Pattern

Tilt and pour gestures apply forces or impulses. Collision callbacks create particle bursts, haptics, and audio. The scene remains immersive while small attachments expose controls and stats.
