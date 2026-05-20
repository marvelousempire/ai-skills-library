# MLS-MPM — WGSL compute kernel

Master Bible §3.8. Simplified production-ready pattern; extend with full P2G/G2P transfers and pressure projection.

```wgsl
@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;  // position, velocity, mass, etc.

@compute @workgroup_size(64)
fn simulateFluid(@builtin(global_invocation_id) id: vec3<u32>) {
    let i = id.x;
    if (i >= arrayLength(&particles)) { return; }

    // MLS-MPM core steps (Particle → Grid → Forces → Grid → Particle)
    // 1. Particle-to-Grid transfer
    // 2. Grid velocity update (gravity, viscosity, pressure projection)
    // 3. Grid-to-Particle transfer + position integration
    // 4. Collision response, surface tension, etc.

    // Example simplified physics step:
    particles[i].velocity += vec3<f32>(0.0, -9.81 * 0.016, 0.0) * particles[i].mass;
    particles[i].position += particles[i].velocity * 0.016;
}
```

## See also

- [`mls-mpm-r3f-template.md`](mls-mpm-r3f-template.md) — dispatch from React Three Fiber
- [`mls-mpm-technique.md`](mls-mpm-technique.md) — when to use MLS-MPM vs fallbacks
- Three.js `webgpu_compute_particles_fluid` example · community `r3f-fluid-sim` repos
