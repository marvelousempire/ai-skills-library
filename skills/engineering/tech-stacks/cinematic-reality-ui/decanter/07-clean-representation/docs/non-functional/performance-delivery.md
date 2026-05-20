# Performance Delivery

Explainer ID: FSEXP-019  
Source lines: 54, 291-295, 569, 692, 817  
Related IDs: PRD-027; FSTECH-035

## Core Point

Fluid sims are heavy. The PRD's performance target is 60 fps minimum, with 120 fps preferred on capable devices.

## Delivery Guidance

| Concern | Response |
|---|---|
| Particle count | Scale with device capability. |
| Shader cost | Profile early and simplify mobile paths. |
| Scene complexity | Use LOD and smart culling. |
| Repeated elements | Use instancing where native/web architecture supports it. |
| Browser support | Provide clear fallback messaging for unsupported WebGPU. |

## Verification Meaning

Every implementation slice should include a frame-rate or performance readout, even if rough. Visual quality is not accepted if interaction collapses under load.

## Slice 1 Acceptance

The first web prototype should run smoothly enough to interact with, and it should expose whether performance problems come from particles, shaders, lighting, or scene complexity.
