# AI_AGENT_RULES — cinematic-fluid-hero

## SSOT (read before every session)

| Doc | Path |
|-----|------|
| Canonical PRD | [`../../../../doctrine/docs/product/canonical-prd.md`](../../../../doctrine/docs/product/canonical-prd.md) |
| Master Cinematic Quality Bible | [`../../../../doctrine/docs/quality/master-cinematic-quality-bible.md`](../../../../doctrine/docs/quality/master-cinematic-quality-bible.md) (index → `bible/`, `shaders/`, `fluid-sim/`) |
| AI prompt templates | [`../../../../doctrine/docs/quality/ai-prompt-templates.md`](../../../../doctrine/docs/quality/ai-prompt-templates.md) |
| Plan 0037 | [`../../../../../plans/0037-cinematic-fluid-experience-v2.md`](../../../../../plans/0037-cinematic-fluid-experience-v2.md) |

## Mandatory session directive (paste at top of prompts)

```
You are building the Cinematic Interactive Experience. Follow the Cinematic Style Bible (attached) exactly — no exceptions.

STRICT DIRECTIVE:
The output must look like a Hollywood VFX movie / Pixar short film running in real-time.
Use volumetric fog, dramatic cinematic lighting, strong but tasteful bloom, PBR materials with subsurface scattering, reactive particles that look like real smoke/fire/embers, and premium holographic UI.
Never generic, never basic, never default Three.js or flat UI.
Reference Bruno Simon, top Codrops cinematic demos, and Pixar/ILM quality at all times.

Implement [Feature ID or task] using the exact tokens, mappings, and quality level in the Cinematic Style Bible.
```

## Product intent

Premium cinematic **interactive PWA showcase** — not a milk simulator. `../milk-pour/` is lab-only.

## Violation test

Default R3F demo or clean SaaS landing = invalid output even if build passes.
