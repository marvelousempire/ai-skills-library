# Native Fluid Rationale

Explainer ID: FSEXP-006  
Source lines: 34-36, 709-716  
Related IDs: PRD-005, PRD-019; FSTECH-016-FSTECH-021

## Core Point

RealityKit is excellent for native rendering, AR, physics, particles, manipulation, and HUD attachments, but it is not a complete out-of-the-box milk fluid solver.

## Why Metal Still Matters

True cinematic fluid requires custom simulation work: particles, compute shaders, mesh deformation, or a custom solver. RealityKit can host and render the scene, but Metal supplies the lower-level GPU path for heavy fluid behavior and post-processing.

## Implementation Meaning

The native phase should reuse the visual parameters and interaction lessons from the web prototype, then implement Apple-native performance with RealityKit and Metal.

## Boundary

Do not start native and web simultaneously for the first proof. Prove the milk illusion on web, then port the winning model to native.
