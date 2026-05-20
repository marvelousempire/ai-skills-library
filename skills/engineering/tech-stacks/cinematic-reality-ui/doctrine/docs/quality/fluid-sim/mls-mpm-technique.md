# MLS-MPM — technique selection

Master Bible §3.8.

## Recommendation

**Primary technique:** MLS-MPM (Moving Least Squares Material Point Method) + **screen-space fluid rendering**.

Gold-standard for real-time cinematic fluids in WebGPU: **70k–180k+ particles at 60–120 fps**. Delivers silky, viscous, opaque liquid behavior while staying fully GPU-driven.

## Technique comparison

| Technique | Max particles (real-time) | Visual quality | Stability | Best for this project |
|-----------|---------------------------|----------------|------------|------------------------|
| **MLS-MPM** | 70k–180k+ | ★★★★★ | Very high | **Primary choice** |
| SPH / PCISPH | 10k–50k | ★★★★ | Good | Good fallback |
| PIC/FLIP | 50k–100k | ★★★★ | High | Excellent |
| Grid-based (Stam) | Large grids | ★★★ | Very stable | Ambient effects |

## Implementation

| Step | Doc |
|------|-----|
| Compute | [`mls-mpm-wgsl-kernel.md`](mls-mpm-wgsl-kernel.md), [`mls-mpm-r3f-template.md`](mls-mpm-r3f-template.md) |
| Surface render | [`../../rendering/screen-space-fluid-rendering.md`](../../rendering/screen-space-fluid-rendering.md) |
