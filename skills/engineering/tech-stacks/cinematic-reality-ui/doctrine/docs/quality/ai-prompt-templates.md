# AI prompt templates

Copy-paste blocks for every AI coding session. Pair with [`master-cinematic-quality-bible.md`](master-cinematic-quality-bible.md) (index), [`bible/hard-rules.md`](bible/hard-rules.md), and [`../product/canonical-prd.md`](../product/canonical-prd.md).

---

### 7. How to Use This Bible

**Paste this at the top of EVERY prompt you give to any AI (including me):**

```
You are building the Cinematic Interactive Experience. Follow the Cinematic Style Bible (attached) exactly — no exceptions.

STRICT DIRECTIVE: 
The output must look like a Hollywood VFX movie / Pixar short film running in real-time. 
Use volumetric fog, dramatic cinematic lighting, strong but tasteful bloom, PBR materials with subsurface scattering, reactive particles that look like real smoke/fire/embers, and premium holographic UI. 
Never generic, never basic, never default Three.js or flat UI. 
Reference Bruno Simon, top Codrops cinematic demos, and Pixar/ILM quality at all times.

Implement [Feature ID or task] using the exact tokens, mappings, and quality level in the Cinematic Style Bible.
```

**0. Visual Quality Directive & Anti-Generic Guardrails**  
(This section is **mandatory** and must be included in **every single prompt** given to any AI coding agent.)

**Non-Negotiable Visual Standard**  
Every single screen, 3D scene, interaction, and UI element must feel **premium cinematic, video-game quality, and addictive** — never generic, never “clean SaaS”, never default Three.js examples, never flat or basic.

**Hard Rules the AI Must Follow (violation = invalid output):**

- Always use **deep cinematic lighting** (volumetric fog, dynamic spotlights, god rays, bloom, subtle film grain, vignette).
- All materials must be **PBR with subsurface scattering** where appropriate; never plain `MeshStandardMaterial` or flat colors.
- Every interaction must feel **buttery-smooth and satisfying** (spring physics, micro-animations, haptic-synced feedback).
- Dark mode is the primary expression (deep blacks, neon cyan/orange accents, high-contrast holographic surfaces). Light mode must still feel premium.
- Use **ReadyPlay primitives** (`ReadyPlayCard`, `ReadyPlayStatPill`, `ReadyPlayChip`, etc.) but **always translate them into 3D holographic equivalents** using `ViewAttachmentComponent` (iOS) or custom 3D panels (web).
- Never use default fonts. Primary font family: **Satoshi** (or Neue Haas Grotesk / Inter Display as fallback) with variable weights and tight letter-spacing for a premium tech feel.
- Always include **post-processing** (bloom, color grading, subtle chromatic aberration, film grain) driven by the scene state.
- Particle systems, glows, and environmental effects must be present and reactive — never “empty” scenes.
- Reference visual benchmarks: Bruno Simon’s portfolio, Codrops advanced Three.js experiments, Awwwards Site of the Day winners (cinematic 3D category), and Apple’s highest-end RealityKit demos.

**Design Token Archive (must be used)**  
We will maintain a single source of truth for all cinematic values:

- Colors: Deep background `#0a0a0a`, accent neon cyan `#00f5ff`, neon orange `#ff4d00`
- Glow intensity: 1.8–2.5 (strong but not cartoonish)
- Bloom threshold: 0.6, intensity: 1.4
- Easing curves: `cubic-bezier(0.23, 1, 0.32, 1)` (extra bouncy premium feel)
- All motion must respect these shared tokens.

**ReadyPlay 3D Bridge Requirement**  
Every ReadyPlay component must have a holographic 3D counterpart in `ReadyPlayArenaBridge.tsx` (web) / `ReadyPlayArenaBridge.swift` (iOS) so the AI is forced to use the premium system instead of inventing basic UI.

### Reusable AI Prompt Template (Use This Every Time)

Copy and paste this at the top of **every** request you give to any AI:

```
You are building the Cinematic Interactive Experience (PRD + Feature Ledger attached). 

STRICT VISUAL DIRECTIVE: 
- Output must be premium cinematic video-game quality. 
- Never generic, never basic Three.js demo, never flat/minimal SaaS UI. 
- Follow the Visual Quality Directive and Anti-Generic Guardrails section exactly. 
- Use ReadyPlay primitives translated into 3D holographic elements. 
- Apply all cinematic post-processing, PBR materials, volumetric effects, bloom, and reactive particles. 
- Reference the highest-end examples (Bruno Simon, Codrops advanced demos, Awwwards 3D winners).

Implement Feature [F-XXX] with the exact quality level described above.
```
---
### 6. AI Prompt Rule (Copy-Paste This Every Time)

```
You are building the Cinematic Interactive Experience. Follow the Cinematic Style Bible exactly — no exceptions.

STRICT DIRECTIVE: 
The output must look like a Hollywood VFX movie or Pixar short film running in real-time. 
Use dramatic cinematic lighting, volumetric fog, strong but tasteful bloom, rich PBR materials, reactive particles, and premium holographic UI. 
Use the full ACES pipeline (ACEScg → ACEScct → LMT → RRT) with the exact shader code and math from the Style Bible.

Never output generic, basic, or default Three.js visuals. Implement at full Hollywood quality.
```
**Here’s your clean, all-inclusive Hard Rules document.**

**Hard Rules: AI Must Follow**  
**Cinematic Interactive Experience**  
**Version:** 1.0 – Final Locked Edition

This document is **mandatory**. Every single prompt you give to any AI (including me) must start with or include this entire block. It overrides everything else.

### Core Vision (Never Deviate)

The final experience must look and feel like a **Hollywood VFX movie or Pixar short film** running interactively in real-time on web or iPhone.

First reaction from anyone seeing it must be: “How is this running in a browser/phone?”

### Absolute Visual Rules (Violation = Invalid Output)

- **Lighting must be cinematic and dramatic** at all times — volumetric god rays, rich rim lighting, soft bounced light, never flat or default.
- **Atmosphere is required** — volumetric fog, atmospheric scattering, floating dust particles, depth must be visible.
- **Materials must be high-quality PBR** with accurate roughness, metallic values, and subsurface scattering where appropriate. No plain colors or basic materials.
- **Post-processing is mandatory** — strong but tasteful bloom, subtle animated film grain, soft vignette, and very subtle chromatic aberration.
- **Every interaction must feel juicy and expensive** — buttery smooth, heavy, satisfying with spring physics and synced haptics.
- **All UI must be holographic 3D** — floating panels, emissive edges, never flat 2D browser UI.
- **Color palette is locked** — Deep void background (#050505), electric cyan (#00f7ff), hot ember orange (#ff3b00).
- **Bloom and glow must be strong but controlled** — intensity 1.8–2.5, never cartoonish.
- **Particles must look real** — alpha-blended smoke, fire, embers, sparks with proper lighting response.

### Mandatory Technical Pipeline (Use This Exact Order)

1. Exposure compensation (0.9 – 1.1)
2. Linear ACEScg → ACEScct conversion
3. Cinematic LMT (teal-orange signature look)
4. ACEScct → Linear
5. ACES RRT filmic tone mapping
6. Bloom → Film grain → Vignette

### Reference Benchmarks (Study These Closely)

- Bruno Simon’s portfolio (https://bruno-simon.com/) — ultimate benchmark for delightful, polished 3D interaction and premium feel.
- Top Codrops cinematic Three.js/WebGPU experiments (especially scroll-driven and post-processing heavy demos).
- Pixar lighting studies and ILM/Weta real-time VFX reels.

### AI Behavior Rules

- Never output generic, minimal, clean SaaS, or basic Three.js demo visuals.
- Never use default materials, flat lighting, or simple colors.
- Always prioritize emotional, expensive, filmic quality over performance during initial implementation (optimize only after quality is achieved).
- When in doubt, make it more cinematic, not less.

-----

Copy and paste the entire block above at the start of **every** future prompt you give any AI. This is now your master “no compromise” document.
