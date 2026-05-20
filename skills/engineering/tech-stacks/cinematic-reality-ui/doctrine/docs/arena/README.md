# Cinematic Broadcast Arena

Native iOS blueprint for **immersive cinematic sports broadcast** experiences (RealityKit 4, Metal, HealthKit, WHOOP).

- **[`cinematic-broadcast-arena.md`](cinematic-broadcast-arena.md)** — Full PRD / skill handoff (v1.0, May 12, 2026)

## Web bridge

The fluid web hero maps arena patterns to React Three Fiber — see:

[`../../../decanter/07-clean-representation/docs/product/cinematic-broadcast-arena-bridge.md`](../../../decanter/07-clean-representation/docs/product/cinematic-broadcast-arena-bridge.md)

## Shared with fluid project

| Principle | Arena (native) | Fluid (web) |
|-----------|----------------|-------------|
| Canvas | Full-screen `RealityView` | Full-viewport R3F |
| Mood | Dark + neon cyan/orange | Same design tokens |
| HUD | `ViewAttachmentComponent` | Drei overlay / scene panels |
| Post-process | MPS bloom, grain, vignette | Bloom-style emissive + CSS vignette |
