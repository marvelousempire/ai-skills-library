# Cinematic Fluid Hero — v0.2

Bible-aligned cinematic interactive web showcase (Plan 0037). Vite, React 19, R3F, Drei, ACES-style post-processing, WebGPU-first fluid volume with WebGL fallback.

## Run

```bash
cd skills/engineering/tech-stacks/cinematic-reality-ui/decanter/apps/cinematic-fluid-hero
make ui
```

http://127.0.0.1:5179

## SSOT

Doctrine lives in [`../../doctrine/`](../../doctrine/README.md) — not in the decanter folder alone.

## Stack

- Locked tokens from Master Bible §2
- `CinematicPostProcess` — bloom, grain, vignette, ACES filmic tone mapping (WebGL; required by postprocessing)
- `CinematicFluidVolume` — particle fluid + screen-space-style shading (WebGPU compute deferred)
- Arena garnish: stat orbs, broadcast ring, sparkles
- `OrbitControls` + Device Motion tilt
- Reduced-motion toggle

## Related

| App | Role |
|-----|------|
| This app | Product-direction web hero + PWA foundation |
| `../milk-pour/` | Lab spike only — do not treat as product subject |
| Native arena | [`../../doctrine/docs/arena/cinematic-broadcast-arena.md`](../../doctrine/docs/arena/cinematic-broadcast-arena.md) |

## Build

```bash
pnpm install && pnpm build
```
