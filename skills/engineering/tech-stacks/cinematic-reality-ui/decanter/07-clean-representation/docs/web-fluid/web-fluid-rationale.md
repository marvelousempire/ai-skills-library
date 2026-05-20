# Web Fluid Rationale

Explainer ID: FSEXP-001  
Source lines: 25-31  
Related IDs: PRD-005, PRD-018; FSTECH-004-FSTECH-009

## Core Point

Framer Motion is useful for UI motion, but cinematic milk physics requires a real 3D rendering and simulation path. The PRD points to Three.js with React Three Fiber as the practical web route.

## Why

Milk pouring is not a simple entrance animation. It needs geometry, particles or shaders, lighting, opacity, viscosity, splashes, and interaction with a container. Those belong in a 3D scene powered by Three.js/R3F, not in a UI animation library.

## Implementation Implication

Start the web prototype as a 3D scene first. Use motion libraries only for HUD and UI polish, not as the simulation engine.

## Canonical Decision

Use R3F/Three.js/WebGPU for the first solvable prototype and treat UI animation as supporting decoration.
