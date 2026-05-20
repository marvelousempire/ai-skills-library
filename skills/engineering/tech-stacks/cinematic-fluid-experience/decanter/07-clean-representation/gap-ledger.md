# Gap Ledger

Purpose: list unresolved decisions that must be answered before implementation claims can be considered solved.

## G1 - WebGPU Fluid Implementation Choice

Status: open

The PRD names several possible paths: official Three.js `webgpu_compute_particles_fluid`, r3f-fluid-sim style work, Water Pro-style systems, custom compute shaders, SPH/PIC-FLIP/Grid solvers, and GPUComputationRenderer-era examples.

Decision needed: pick the first prototype approach and fallback plan.

Recommended answer: start with a Vite/R3F scene using the simplest available WebGPU particle/fluid example or a controlled custom particle approximation, then iterate toward milk-specific viscosity/scattering.

## G2 - RealityKit 4 Availability And Target OS

Status: open

The PRD references iOS 19+, Xcode 17+, RealityKit 4, RealityView post-processing, and specific RealityKit components. These may depend on current SDK availability and local Xcode install.

Decision needed: verify local Xcode/iOS SDK support before native planning.

## G3 - Product Surface Scope

Status: open

The PRD includes Web, iOS, iPadOS, Watch, Dynamic Island, Apple Pencil, LiDAR, Blender, Firebase, and 3D printing.

Decision needed: decide whether this is a multi-surface product app or a staged prototype.

Recommended answer: treat it as staged prototype first, product app later.

## G4 - Backend Necessity

Status: open

The PRD includes Firebase Auth/Firestore and FastAPI/Blender, but the first cinematic fluid prototype does not need persisted user state.

Decision needed: only add backend when scans, saved creations, sync, or exports exist.

Recommended answer: no backend in slice 1.

## G5 - Milk Realism Acceptance Criteria

Status: open

The PRD says "hyper-realistic" but does not define measurable visual acceptance criteria.

Decision needed: define the minimum credible illusion for slice 1.

Recommended acceptance criteria:

- opaque off-white material with subsurface-like softness;
- visible viscosity difference from water;
- splash/foam hints on impact;
- lighting and shadows sell depth;
- stable interactive frame rate on target browser.

## G6 - Accessibility And Motion Sensitivity

Status: open

The PRD requires reduced fluid motion and low-vision support, but no UI behavior is specified.

Decision needed: define first accessibility controls.

Recommended answer: add a reduced-motion toggle and keep controls keyboard/pointer accessible in slice 1.

## G7 - Source Canonicalization

Status: open

The PRD contains multiple final blocks and "no gaps remain" claims.

Decision needed: approve a future canonical rewrite if desired.

Recommended answer: keep source draft unchanged; use decanter artifacts for planning.
