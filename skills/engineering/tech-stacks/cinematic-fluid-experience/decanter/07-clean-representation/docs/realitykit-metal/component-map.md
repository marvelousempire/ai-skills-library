# RealityKit Component Map

Explainer ID: FSEXP-008  
Source lines: 671-680  
Related IDs: PRD-019; FSTECH-016-FSTECH-021

## Core Point

The PRD names RealityKit components as implementation building blocks. Each component should have a clear job instead of becoming a buzzword checklist.

## Component Roles

| Component | Role |
|---|---|
| `PhysicsBodyComponent` | Gives containers or particles physical behavior. |
| `CollisionComponent` | Enables container/fluid interactions and impact events. |
| `ManipulationComponent` | Supports grabbing, rotating, and inspecting glass or fluid objects. |
| `ViewAttachmentComponent` | Embeds SwiftUI HUDs as in-world controls or stats. |
| `ParticleEmitterComponent` | Drives splashes, foam, bubbles, and glow effects. |
| `MeshInstancesComponent` | Improves performance for repeated fluid or effect elements. |
| `EnvironmentResource` / `EnvironmentBlendingComponent` | Supports cinematic fog, lighting, and environment feel. |
| `GestureComponent` | Routes direct 3D interaction. |
| Observable entities | Bind sensor, fluid, and UI state into the scene. |

## Use

Use this map when planning the native slice so each component exists for a scene behavior, not just because the PRD listed it.
