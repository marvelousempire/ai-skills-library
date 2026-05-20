# Mandatory post-processing pipeline (exact order)

Part of the [Master Cinematic Quality Bible](README.md).

## Pipeline order

1. Exposure compensation (0.9 – 1.1)
2. Linear ACEScg → ACEScct conversion
3. Cinematic LMT (teal-orange signature)
4. ACEScct → Linear
5. ACES RRT filmic tone mapping
6. Bloom → Film grain (8–12%) → Vignette → Subtle chromatic aberration

## ACEScg ↔ ACEScct math (reference)

**Forward (linear → ACEScct):**

```glsl
y = (x <= 0.0078125) ? 10.5402377416545 * x + 0.0729055341958355 : (log2(x) + 9.72) / 17.52
```

**Inverse (ACEScct → linear):**

```glsl
x = (y <= 0.155) ? (y - 0.0729055341958355) / 10.5402377416545 : pow(2.0, y * 17.52 - 9.72)
```

## Implementation files

| Platform | Path |
|----------|------|
| Metal LMT | [`../shaders/metal-cinematic-lmt.md`](../shaders/metal-cinematic-lmt.md) |
| WGSL full pass | [`../shaders/wgsl-aces-pipeline.md`](../shaders/wgsl-aces-pipeline.md) |
| Deep dive | [`../../rendering/aces-tone-mapping.md`](../../rendering/aces-tone-mapping.md) |
