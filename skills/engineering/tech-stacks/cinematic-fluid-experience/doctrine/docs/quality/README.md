# Visual quality & AI guardrails

## Start here

**[`master-cinematic-quality-bible.md`](master-cinematic-quality-bible.md)** — index into all quality docs.

## Split structure

| Folder | Contents |
|--------|----------|
| [`bible/`](bible/README.md) | Hard rules, design tokens, post-processing pipeline order |
| [`shaders/`](shaders/README.md) | Metal LMT, WGSL ACES pipeline (locked source) |
| [`fluid-sim/`](fluid-sim/README.md) | WebGPU compute requirement, MLS-MPM technique, WGSL kernel, R3F template |
| [`ai-prompt-templates.md`](ai-prompt-templates.md) | Copy-paste blocks for every AI session |

## Historical

| File | Role |
|------|------|
| [`hard-rules-for-ai.md`](hard-rules-for-ai.md) | Full conversation merge — prefer [`bible/hard-rules.md`](bible/hard-rules.md) |
| [`../../archive/master-cinematic-quality-bible-monolithic.md`](../../archive/master-cinematic-quality-bible-monolithic.md) | Pre-split single file |

## Rendering (sibling folder)

- [`../rendering/aces-tone-mapping.md`](../rendering/aces-tone-mapping.md)
- [`../rendering/screen-space-fluid-rendering.md`](../rendering/screen-space-fluid-rendering.md)
