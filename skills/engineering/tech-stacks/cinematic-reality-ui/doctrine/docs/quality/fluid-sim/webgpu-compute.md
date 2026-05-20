# WebGPU compute shaders (mandatory)

Master Bible §3.7.

All dynamic physics, large-scale particle systems, and complex simulations **must** be implemented using **WebGPU compute shaders**. Keep the entire simulation on the GPU using storage buffers.

## Rules

- No per-frame CPU iteration over thousands of particles for production paths.
- Use `GPUBufferUsage.STORAGE` buffers and compute pipelines.
- Dispatch from R3F `useFrame` via `commandEncoder.beginComputePass()`.

## Next

- Fluid-specific: [`mls-mpm-technique.md`](mls-mpm-technique.md)
- Kernel: [`mls-mpm-wgsl-kernel.md`](mls-mpm-wgsl-kernel.md)
- R3F wiring: [`mls-mpm-r3f-template.md`](mls-mpm-r3f-template.md)
