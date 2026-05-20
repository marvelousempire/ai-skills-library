# WebGPU Explainer — Cinematic Pouring Milk (May 2026)

Explainer ID: FSEXP-003 (expanded)  
Source: conversation WebGPU research block + PRD lines 267–300  
Related IDs: PRD-005, PRD-011, PRD-018, PRD-027 (inventory); PRD-018, PRD-027 (decanter); FSTECH-007–FSTECH-009, FSTECH-035

## Summary

**WebGPU fluid simulation is currently one of the strongest paths for the cinematic pouring milk experience on the web.** It gives direct GPU access via compute shaders, enabling thousands of particles or grid-based solvers to run in real time with realistic viscosity, splashes, foam, and subsurface scattering for that creamy milk look.

## Current State (as of May 2026)

WebGPU is mature and widely supported. Three.js has excellent integration via **WebGPURenderer** and **Three Shading Language (TSL)** — a node-based system that is much easier than raw WGSL. React Three Fiber (R3F) works well with it.

### Key Strengths for This Project

- Handles **10k+ particles** smoothly on modern devices.
- **Compute shaders** for physics (viscosity, surface tension, collisions).
- Easy integration with **PBR materials**, caustics, reflections, and post-processing (bloom, subsurface scattering).
- **Device Motion** tilt control works well with simulation gravity updates.

## Best Options Right Now

### 1. Three.js Official MLS-MPM Fluid Particles (strong starting point)

- Official example: `webgpu_compute_particles_fluid`
- Uses **MLS-MPM** (Material Point Method) — strong for liquids like milk.
- Runs fully on compute shaders.
- Good base for pouring, splashes, and container interactions.

### 2. Three.js Water Pro (most cinematic / recommended)

- Commercial/high-end physically based ocean/water system on **WebGPU + TSL**.
- Features: FFT waves, dynamic foam, caustics, subsurface scattering, reflections, buoyancy.
- Looks premium and game-like; adaptable for **contained pouring milk** (viscosity tweaks, opacity).
- Includes WebGL fallback.

### 3. Open-Source 3D Fluid Sims

| Project | Notes |
|---|---|
| **matsuoka-601/WebGPU-Ocean** and **Splash** | Real-time 3D particle fluids with screen-space fluid rendering; good for interactive pouring. |
| **kishimisu/WebGPU-Fluid-Simulation** | Jos Stam stable fluids (grid-based); simpler, very performant for 2D/3D effects. |

### 4. R3F-Specific Helpers

- `R3F-WaterSurface` components for reflections/distortion.
- Codrops-style fluid reveal + particle demos using TSL.

See also: `implementation-options.md` for the full option matrix.

## How It Fits the Pouring Milk Vision

| Interaction | Approach |
|---|---|
| **Tilt / pour** | Device Motion (or pointer first) applies gravity/forces to the simulation. |
| **Milk look** | Custom TSL material: subsurface scattering + opacity + foam. |
| **Controls** | Pinch for viscosity, swipe for pour, collisions with glass mesh. |
| **Performance** | LOD + simplified shaders on mobile; **60–120 fps** achievable on capable hardware. |

## Reality Check

Nothing is **100% drop-in** for perfect milk pouring yet — expect shader tweaking (viscosity, opacity, splashes on contact). **Water Pro** or the official **MLS-MPM** example gets roughly **70–80%** of the target quickly (source conversation range; plan iteration for the rest).

## Quick Start Recommendation

```bash
npm create vite@latest my-fluid-app -- --template react-ts
cd my-fluid-app
npm install three @react-three/fiber @react-three/drei
```

Then import `WebGPURenderer` and start with the official fluid particles example or Water Pro.

Pair with: `first-prototype-tutorial.md`, `milk-interaction-model.md`, `canonical-prd-draft.md` section 17.

## Suggested Follow-Ups

- Starter template: tilting glass + pouring milk (not in repo until implementation slice starts).
- Side-by-side repo comparison (extend `implementation-options.md`).
- Deeper PRD integration: `canonical-prd-draft.md` §4.12–4.13, §17, inventory **PRD-011**.

## Acceptance Meaning

The prototype should check WebGPU support and explain the requirement if unsupported instead of crashing or silently degrading into a broken visual.
