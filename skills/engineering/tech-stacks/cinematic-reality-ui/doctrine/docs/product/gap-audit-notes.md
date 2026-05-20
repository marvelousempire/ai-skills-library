# Gap audit notes

Mid-conversation audit of items missing from earlier PRD drafts. Superseded by [`canonical-prd.md`](canonical-prd.md) for build work.

---

**I just did a full audit of our entire conversation.**

Here's what we **missed** that should be in the PRD:

### Missing Items:
- **Design Tokens** — We talked about this early as a core way to keep web and native visually consistent (colors, easing, glow intensity, fluid parameters). It's not in the current PRD.
- **Performance Optimization details** — We mentioned LOD tricks, smart culling, and mobile performance, but it only has a passing mention.
- **Sound Design implementation** — We listed matching audio, but didn't specify using AVFoundation on Apple side or Howler.js/Web Audio API on web.
- **Specific fluid characteristics** — The original vision was *pouring milk specifically* (opacity, viscosity, creamy look, splashes). The PRD is too generic about "fluid."
- **User Flow & Interactions** — We called this out as important early but never expanded or added concrete details.

Everything else (platforms, scanning, AI Blender cleanup, WebGPU, Apple Watch as controller, haptics, LiDAR, etc.) is covered.

**Got it. I did a full audit of our entire conversation to make sure we don't miss anything.**

After carefully reviewing every point we've discussed, here are the items that were missing or only lightly mentioned in the last PRD version:

- **Design Tokens** — Shared across web and native for consistent colors, easing curves, cinematic parameters, glow, blur, and fluid visuals.
- **Specific Fluid Characteristics** — Focused on realistic **pouring milk** (milky opacity, specific viscosity, creamy look, splashes, foam).
- **Sound Design Details** — Using AVFoundation on Apple side and Web Audio API on web.
- **Performance Optimization** — Explicit mention of LOD, smart culling, and mobile optimization techniques.
- **User Flow & Interactions** — Detailed definition of how users will actually interact with the experience.
- **Asset Pipeline** — How 3D models, textures, and shaders are managed and kept in sync.

These were brought up earlier but didn't make it fully into the last version.
