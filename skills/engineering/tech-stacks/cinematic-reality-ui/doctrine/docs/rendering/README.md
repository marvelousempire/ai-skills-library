# Rendering

Rendering docs complement [`../quality/bible/post-processing-pipeline.md`](../quality/bible/post-processing-pipeline.md), [`../quality/shaders/`](../quality/shaders/README.md), and [`../quality/fluid-sim/`](../quality/fluid-sim/README.md).

| File | Topic |
|------|--------|
| [`aces-tone-mapping.md`](aces-tone-mapping.md) | ACES / ACEScct / LMT / RRT — GLSL, WGSL, Metal, R3F integration |
| [`screen-space-fluid-rendering.md`](screen-space-fluid-rendering.md) | Depth/thickness buffers, bilateral smooth, surface normals — pairs with MLS-MPM compute |

## Pipeline order (per frame)

1. **MLS-MPM compute** — [`../quality/fluid-sim/`](../quality/fluid-sim/README.md)
2. **Screen-space fluid** — this folder
3. **ACES post-process** — `aces-tone-mapping.md` + [`../quality/shaders/`](../quality/shaders/README.md)
