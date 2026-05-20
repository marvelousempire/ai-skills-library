# ReadyPlay Arena Bridge

Explainer ID: FSEXP-011  
Source lines: 514-520, 624-638, 762-768  
Related IDs: PRD-004, PRD-019, PRD-023; FSTECH-016-FSTECH-017, FSTECH-034

## Core Point

The PRD wants 2D interface primitives to preview their RealityKit counterparts. This keeps the UI system connected to the immersive 3D arena instead of becoming a separate flat app.

## Bridge Map

| 2D Primitive | 3D / RealityKit Counterpart |
|---|---|
| `ReadyPlayCard` | `ViewAttachmentComponent` holographic panel. |
| `ReadyPlayStatPill` / `ReadyPlayChip` | Metallic interactive elements with manipulation behavior. |
| Neon / glow tokens | `ParticleEmitterComponent` plus Metal bloom. |
| Live fluid parameters | Observable entity binding and dynamic scene effects. |

## Hybrid Preview Requirement

All key primitives should eventually have optional RealityView + attachment previews, likely in `ReadyPlayArenaBridge.swift`, so agents and developers can see the 2D and 3D interpretations together.

## Scope Note

Slice 1 only needs minimal tokens. Full ReadyPlay bridge previews belong with the native RealityKit phase.
