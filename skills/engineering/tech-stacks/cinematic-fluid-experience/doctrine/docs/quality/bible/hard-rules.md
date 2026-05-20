# Hard rules — AI must follow (non-negotiable)

Part of the [Master Cinematic Quality Bible](README.md). Violation = invalid output.

## Core vision

The experience must look and feel like a **Hollywood VFX movie or Pixar short film** running interactively in real-time in a browser or on an iPhone.

Anyone seeing it for the first time must immediately think: **“How the hell is this running in a browser/phone?”**

## Absolute rules

- Lighting must be dramatic and cinematic at all times (volumetric god rays, rim lighting, soft bounced light).
- Atmosphere is mandatory (volumetric fog, floating dust, depth and air).
- All materials must be high-quality PBR with proper subsurface scattering where appropriate.
- Post-processing is always on: strong but tasteful bloom, animated film grain, vignette, subtle chromatic aberration.
- Every interaction must feel heavy, juicy, buttery-smooth, and expensive.
- All UI must appear as glowing holographic 3D objects floating in the scene — never flat 2D overlays.
- Color palette is locked — see [`design-tokens.md`](design-tokens.md).
- Bloom and glow must be strong but controlled (intensity 1.8–2.5).
- Particles must look physically real (alpha-blended smoke, fire, embers, sparks with proper lighting).
- Never output generic, minimal, clean SaaS, basic Three.js demos, or flat visuals.

## See also

- [`design-tokens.md`](design-tokens.md)
- [`post-processing-pipeline.md`](post-processing-pipeline.md)
- [`../shaders/README.md`](../shaders/README.md)
- [`../fluid-sim/README.md`](../fluid-sim/README.md)
- [`../ai-prompt-templates.md`](../ai-prompt-templates.md)
