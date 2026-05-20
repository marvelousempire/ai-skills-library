# WGSL — ACES Hollywood pipeline (WebGPU)

Part of [Master Bible §4.2](../bible/README.md). Fragment pass for React Three Fiber + `WebGPURenderer`.

```wgsl
// ======================== ACES Hollywood Pipeline – WGSL (WebGPU) ========================
struct Uniforms {
    exposure: f32,
    time: f32,
}

@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var inputTexture: texture_2d<f32>;
@group(0) @binding(2) var inputSampler: sampler;

@fragment
fn main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
    var color: vec3<f32> = textureSample(inputTexture, inputSampler, fragUV).rgb;

    color *= u.exposure;
    color = linearToACEScctVec3(color);
    color = applyCinematicLMT(color);
    color = acescctToLinearVec3(color);
    color = acesRRT(color);

    let grain = fract(sin(dot(fragUV + u.time * 0.1, vec2<f32>(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.025;

    return vec4<f32>(color, 1.0);
}

// ACEScg ↔ ACEScct + LMT + RRT helper functions — see ../../rendering/aces-tone-mapping.md
```

## See also

- [`metal-cinematic-lmt.md`](metal-cinematic-lmt.md) — equivalent LMT logic in Metal
- [`../../rendering/aces-tone-mapping.md`](../../rendering/aces-tone-mapping.md) — full WGSL with conversion helpers
