# Web Fluid Implementation Options — Side-by-Side Comparison (2026)

Explainer ID: FSEXP-004 (expanded)  
Source: conversation WebGPU repo comparison block  
Related IDs: PRD-011, PRD-018; FSTECH-008–FSTECH-009  
Companion: `webgpu-explainer.md`, `canonical-prd-draft.md` section 18

## Overview

Detailed side-by-side comparison of the **best current (2026) repos, resources, and payloads** for high-quality WebGPU fluid simulation in the cinematic pouring milk project (React Three Fiber).

## Comparison Table

| Rank & Resource | Type | Strengths for Milk Pouring | Weaknesses | Difficulty | Cost | Best For |
|---|---|---|---|---|---|---|
| **1. Three.js Water Pro** (Dan Greenheck) | Commercial WebGPU ocean system | Most cinematic and production-ready; FFT waves, dynamic foam, caustics, subsurface scattering, reflections, buoyancy; TSL + WebGPU (strong milk opacity + creamy look); easy R3F integration; WebGL fallback | Paid asset | Medium (drop-in + tweak) | $149 one-time | **Top recommendation** for “wow, video game” cinematic feel |
| **2. Three.js Official `webgpu_compute_particles_fluid`** | Official Three.js example (MLS-MPM) | Pure compute-shader particle fluid; thousands of particles smoothly; strong base for viscosity, splashes, pouring into container; fully open and modifiable | More “particle soup” than beautiful surface; needs custom rendering for milk look | Medium–high (shader work) | Free | Realistic physics + pouring behavior |
| **3. matsuoka-601 / WebGPU-Ocean** | Open-source 3D fluid sim | Real-time 3D fluid in a box; MLS-MPM + screen-space fluid rendering; performant, impressive waves/splashes | Box-contained (needs adaptation for free pouring) | Medium | Free | High-quality open-source 3D fluid base |
| **4. jeantimex / fluid** | Open-source SPH + PIC/FLIP | Port of Sebastian Lague’s Unity fluid sim; full GPU physics (SPH + PIC/FLIP); good interactive pouring and splashes | Rendering more technical; less out-of-box beauty | High | Free | Most physically accurate milk behavior |
| **5. kishimisu / WebGPU-Fluid-Simulation** | Jos Stam stable fluids | Simple, very fast grid-based solver; great WebGPU/TSL learning resource | 2D-ish feel; less suited to 3D pouring milk | Low | Free | Quick prototyping or background effects |
| **6. R3F-WaterSurface** + custom TSL | R3F component library | Easy React integration; good reflections/distortion; many Codrops-style fluid reveal demos | Not full physics sim — mostly surface effects | Low–medium | Free | Quick UI + surface beauty layer |

## Recommendation for This Project

**Start with #1 (Three.js Water Pro) and combine with #2 (official MLS-MPM particles).**

- Use **Water Pro** for beautiful surface, caustics, foam, and subsurface scattering (creamy milk look).
- Layer or extend with **MLS-MPM particles** for pouring physics, viscosity control, and splashes on impact.
- This combo is the fastest path to “holy shit this looks real” while staying in R3F.

## Quick Start Payload (Vite + R3F)

```bash
npm create vite@latest milk-pour -- --template react-ts
cd milk-pour
npm install three @react-three/fiber @react-three/drei
# Then add Water Pro or start from official fluid example
```

## Additional Strong Resources (2026)

| Resource | Use |
|---|---|
| **Codrops WebGPU fluid tutorials** | Step-by-step TSL + ping-pong simulation guides |
| **Wawasensei WebGPU/TSL course** | Structured learning for R3F + WebGPU shaders |
| **Three.js official examples** | Most up-to-date WebGPU patterns |

## First-Slice Discipline

Treat rows 3–6 as research and fallback paths. **Slice 1** should not block on evaluating every repo — pick Water Pro + MLS-MPM **or** MLS-MPM-only if budget forbids Water Pro, then iterate milk shaders.
