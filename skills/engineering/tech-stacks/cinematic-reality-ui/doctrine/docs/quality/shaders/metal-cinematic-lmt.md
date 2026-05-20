# Metal — cinematic LMT (RealityKit)

Part of [Master Bible §4.1](../bible/README.md). Use inside `RealityView` post-process after ACEScct conversion.

```metal
float3 applyCinematicLMT(float3 color) {
    float3 c = max(color, 0.0);
    float3 slope = float3(1.05, 0.98, 1.08);
    float3 offset = float3(0.0, 0.005, 0.01);
    float3 power = float3(1.12, 1.08, 1.05);
    float sat = 1.15;

    c = pow(c * slope + offset, power);
    float luma = dot(c, float3(0.2126, 0.7152, 0.0722));
    c = luma + sat * (c - luma);

    float lum = dot(c, float3(0.299, 0.587, 0.114));
    float3 teal = float3(0.85, 1.05, 1.15);
    float3 orange = float3(1.15, 1.05, 0.85);
    c = mix(c * teal, c * orange, smoothstep(0.2, 0.85, lum));

    c = pow(c, 1.05);
    return clamp(c, 0.0, 100.0);
}
```

## See also

- [`../bible/post-processing-pipeline.md`](../bible/post-processing-pipeline.md)
- [`../../rendering/aces-tone-mapping.md`](../../rendering/aces-tone-mapping.md) — full Metal post-process + RealityKit integration
