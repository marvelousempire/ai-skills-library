# Master Cinematic Quality Bible

> **Canonical visual + technical quality index.** Version 2.5 — WebGPU compute + MLS-MPM fluid edition · May 19, 2026.

This is the **single source of truth** for visual, cinematic, and technical quality. Content is split into focused folders — open the section you need; do not duplicate tokens or shaders elsewhere.

## Read order

1. [`bible/hard-rules.md`](bible/hard-rules.md) — non-negotiable visual rules
2. [`bible/design-tokens.md`](bible/design-tokens.md) — locked colors, bloom, motion, type
3. [`bible/post-processing-pipeline.md`](bible/post-processing-pipeline.md) — ACES pipeline order
4. [`shaders/`](shaders/README.md) — Metal LMT + WGSL ACES (copy-paste)
5. [`fluid-sim/`](fluid-sim/README.md) — WebGPU compute + MLS-MPM + R3F template
6. [`ai-prompt-templates.md`](ai-prompt-templates.md) — paste into every AI session

## Folder map

```text
docs/quality/
├── master-cinematic-quality-bible.md   ← this index
├── bible/          ← doctrine + tokens + pipeline order
├── shaders/        ← Metal + WGSL source
├── fluid-sim/      ← MLS-MPM compute + R3F wiring
├── ai-prompt-templates.md
└── hard-rules-for-ai.md                ← conversation archive (use bible/ first)
```

## Related rendering docs

| Topic | Path |
|-------|------|
| ACES deep dive | [`../rendering/aces-tone-mapping.md`](../rendering/aces-tone-mapping.md) |
| Screen-space fluid surface | [`../rendering/screen-space-fluid-rendering.md`](../rendering/screen-space-fluid-rendering.md) |

## Monolithic archive

Pre-split single file: [`../../archive/master-cinematic-quality-bible-monolithic.md`](../../archive/master-cinematic-quality-bible-monolithic.md)
