# Fluid simulation — GPU-driven

Master Bible §3.7–3.8. **Primary stack:** MLS-MPM compute + [screen-space fluid rendering](../../rendering/screen-space-fluid-rendering.md).

## Per-frame order

1. **MLS-MPM compute** — update particle positions ([`mls-mpm-wgsl-kernel.md`](mls-mpm-wgsl-kernel.md), [`mls-mpm-r3f-template.md`](mls-mpm-r3f-template.md))
2. **Screen-space surface** — depth/thickness → shade ([`../../rendering/screen-space-fluid-rendering.md`](../../rendering/screen-space-fluid-rendering.md))
3. **ACES post-process** — [`../shaders/wgsl-aces-pipeline.md`](../shaders/wgsl-aces-pipeline.md)

## Files

| File | Content |
|------|---------|
| [`webgpu-compute.md`](webgpu-compute.md) | Mandatory WebGPU compute for physics & particles |
| [`mls-mpm-technique.md`](mls-mpm-technique.md) | Technique comparison + primary recommendation |
| [`mls-mpm-wgsl-kernel.md`](mls-mpm-wgsl-kernel.md) | WGSL compute kernel (simplified pattern) |
| [`mls-mpm-r3f-template.md`](mls-mpm-r3f-template.md) | React Three Fiber + WebGPU integration template |

## Requirement

All dynamic physics, large-scale particle systems, and fluid simulations **must** run on the GPU via WebGPU compute shaders and storage buffers — not CPU-side loops per frame.
