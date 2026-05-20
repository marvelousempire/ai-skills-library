# Tech stack — Cinematic Fluid Experience

**Canonical tree:** [`cinematic-fluid-experience/`](./cinematic-fluid-experience/README.md)  
**Witness / plans:** [nephew](https://github.com/marvelousempire/nephew) plans `0036`, `0037`, `0046`  
**Guardian agent:** [`cinematic-fluid-stack-guardian`](../../agents/cinematic-fluid-stack-guardian.md) — SRIC-enforced; declines out-of-scope work.

## Summary

| Layer | Choice | Notes |
|-------|--------|--------|
| Web UI | **Vite + React 19 + TypeScript** | Reference: `decanter/apps/cinematic-fluid-hero/` |
| GPU | **WebGPU** | Screen-space fluid, post-processing |
| Color | **ACES filmic** | See `doctrine/docs/rendering/aces-tone-mapping.md` |
| Fluid surface | **Screen-space fluid** | `doctrine/docs/rendering/screen-space-fluid-rendering.md` |
| Quality SSOT | **Master Cinematic Quality Bible** | `doctrine/docs/quality/master-cinematic-quality-bible.md` → `bible/`, `shaders/`, `fluid-sim/` |
| Native arena | **RealityKit 4** (iOS) | `doctrine/docs/arena/cinematic-broadcast-arena.md` |
| PRD | **canonical-prd.md** | `PRD-001` … `PRD-029` |

## Read order

1. [`cinematic-fluid-experience/SRIC.md`](./cinematic-fluid-experience/SRIC.md) — what agents may and may not do.
2. [`doctrine/docs/product/canonical-prd.md`](./cinematic-fluid-experience/doctrine/docs/product/canonical-prd.md)
3. [`doctrine/docs/quality/master-cinematic-quality-bible.md`](./cinematic-fluid-experience/doctrine/docs/quality/master-cinematic-quality-bible.md)
4. [`decanter/07-clean-representation/first-build-slice.md`](./cinematic-fluid-experience/decanter/07-clean-representation/first-build-slice.md) — first shippable web slice.

## Development (reference hero app)

```sh
cd skills/engineering/tech-stacks/cinematic-fluid-experience/decanter/apps/cinematic-fluid-hero
pnpm install && make ui-local
```

## SRIC

Agents bound to this stack must use **Strict Registered Intent & Capabilities** ([`SRIC.md`](./cinematic-fluid-experience/SRIC.md)). No implementation claims outside the capability registry; missing resources → structured decline with in-scope alternatives.

Bishop-born agents inherit generic SRIC from `AI_AGENT_RULES/SRIC.md`; optional `stack_bible_path` in manifest points here.
