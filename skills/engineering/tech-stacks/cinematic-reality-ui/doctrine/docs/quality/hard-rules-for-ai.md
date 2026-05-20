# Hard rules for AI (conversation archive)

> **Prefer [`bible/`](bible/README.md)**, [`shaders/`](shaders/README.md), and [`fluid-sim/`](fluid-sim/README.md) over this file.  
> **Prefer [`ai-prompt-templates.md`](ai-prompt-templates.md)** for copy-paste prompts.  
> This file preserves the full unedited conversation merge (multiple overlapping style-bible drafts).

---

Even with WebGPU, React Three Fiber, RealityKit 4, and all the advanced tech in our PRD, AI (including me or any other model) will default to “clean, modern, minimal” or “basic Three.js demo” unless we give it **extremely strict, non-negotiable visual guardrails**.

Here’s the complete system we’re adding to the model right now so the AI **cannot** waiver into generic/mediocre territory.


**Cinematic Style Bible – Cinematic Interactive Experience**

**Document Type:** Visual Quality Enforcement Bible  
**Version:** 1.0 – God Mode Edition  
**Date:** May 19, 2026  
**Purpose:** This is the single source of truth for visual and cinematic quality. **Every single AI prompt, every code file, every 3D scene, and every UI element must follow this bible exactly.** It exists to prevent any generic, basic, or mediocre output even when using the most advanced tech (WebGPU, React Three Fiber, RealityKit 4, Metal).

### 1. Vision & Non-Negotiable Standard

The entire experience must look and feel like a **big-budget Hollywood VFX movie or Pixar short film that has been made fully interactive and real-time**.

Think:

- ILM / Weta Digital real-time VFX reels
- Pixar lighting and material quality (e.g., the way light scatters through translucent surfaces in *Soul* or *Elemental*)
- Real After Effects VFX with alpha-channel smoke, fire, embers, and volumetric effects
- The most breathtaking cinematic Three.js / RealityKit demos ever made

When someone sees a screenshot or uses the app, their immediate reaction must be:  
**“How the hell is this running in a browser / on my iPhone?”**

**Hard Rules (violation = invalid output):**

- No flat lighting, no default materials, no basic Three.js examples, no “clean SaaS UI”.
- Every scene must have **depth, atmosphere, and emotion**.
- Every interaction must feel **buttery, heavy, juicy, and expensive**.
- Dark cinematic mode is the hero expression. Light mode must still feel premium and expensive.

### 2. Design Tokens (Exact Values – Use These Everywhere)

**Color Palette**

- Background (deep cinematic void): `#050505` / `#0a0a0a`
- Primary Accent (electric cyan): `#00f7ff`
- Secondary Accent (hot ember orange): `#ff3b00`
- Neutral highlights: `#ffffff` with 10–30% opacity for holographic glows
- Fog / Atmosphere color: Deep teal-black mix `#112233`

**Glow & Bloom**

- Glow intensity: 1.8 – 2.5 (strong but controlled)
- Bloom threshold: 0.55 – 0.65
- Bloom intensity: 1.4 – 1.8
- Bloom radius: 0.8 – 1.2

**Lighting & Atmosphere**

- Volumetric fog density: 0.012 – 0.028 (rich and visible)
- God ray strength: Strong but soft-edged
- Ambient light: Very low (0.05 – 0.12) to force dramatic lighting

**Motion & Easing**

- Primary easing curve: `cubic-bezier(0.23, 1, 0.32, 1)` (premium bouncy spring feel)
- All physics: High-quality spring simulation with custom damping and mass for “heavy but responsive” feel
- Micro-animations: 60–120 fps minimum, no jank

**Typography**

- Primary font: **Satoshi Variable** (or Neue Haas Grotesk / Inter Display as fallback)
- Weights: 400 (regular), 500 (medium), 700 (bold)
- Letter-spacing: -0.02em to -0.04em for premium tech feel
- All text in 3D must have subtle emissive glow and soft drop shadow

### 3. Post-Processing Settings (Always On)

- **Bloom**: Strong but tasteful
- **Film Grain**: Subtle, animated, 8–12% intensity
- **Vignette**: Soft dark edges
- **Chromatic Aberration**: Very subtle on high-contrast edges
- **Color Grading**: Teal-orange cinematic or rich moody tones (inspired by modern blockbusters)
- **Tone Mapping**: ACES or Filmic for that expensive film look

### 4. VFX & Particle Guidelines

- Particles must behave like **real smoke, fire, embers, sparks, and dust** (alpha-blended, realistic motion, proper lighting response).
- Every major interaction (grab, collision, tilt, throw) must trigger juicy VFX.
- Use GPU compute shaders or RealityKit `ParticleEmitterComponent` for thousands of particles at 60–120 fps.

### 5. ReadyPlay 3D Mappings (2D → Holographic 3D)

Every ReadyPlay primitive **must** be translated into a glowing holographic 3D counterpart:

|ReadyPlay Primitive      |3D Holographic Equivalent                                                             |Implementation Notes                      |
|-------------------------|--------------------------------------------------------------------------------------|------------------------------------------|
|ReadyPlayCard            |Floating holographic panel with `ViewAttachmentComponent` + emissive edges + soft glow|Semi-transparent with inner neon frame    |
|ReadyPlayStatPill / Chip |Metallic floating orb with `ManipulationComponent`                                    |Can be grabbed, spun, and inspected in 3D |
|ReadyPlaySectionHeader   |Large floating 3D text with volumetric glow and god rays                              |Text has subtle particle halo             |
|ReadyPlayActionRow       |Horizontal holographic bar with interactive buttons                                   |Buttons have reactive bloom on hover/touch|
|ReadyPlayScreenBackground|Full-scene cinematic environment (fog, god rays, particles)                           |Always active                             |
|ReadyPlayDrawerSurface   |Sliding holographic panel that emerges from the environment                           |Physics-based slide with spring           |

**File:** `ReadyPlayArenaBridge.tsx` (web) and `ReadyPlayArenaBridge.swift` (iOS) — these files must exist and contain all mappings.

### 6. Visual Reference Gallery (Study These Closely)

Use these as your visual benchmark **every single time**:

- **Bruno Simon’s Portfolio** – https://bruno-simon.com/ (ultimate benchmark for delightful, polished 3D interaction)
- **Codrops Advanced Three.js Experiments** – https://tympanus.net/codrops/ (filter for “WebGL”, “Three.js”, “cinematic”)
- **High-end WebGPU / RealityKit Demos** – Search for “WebGPU cinematic post-processing” and “RealityKit 4 volumetric” on threejs.org/examples and developer.apple.com
- **Pixar / ILM Reference Reel** – Any recent Pixar short film lighting study (YouTube: “Pixar lighting breakdown”)
- **Weta Digital Real-Time VFX** – Look for their real-time demos on YouTube/Vimeo

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

**Got it. We’re going full God mode.**

Here’s the **strong, no-compromise visual directive** you can paste at the very top of every prompt. This version is much more specific, vivid, and cinematic — no more vague “premium” language.

-----

**0. Visual Quality Directive (MANDATORY – Never Violate)**

This project must look and feel like a **Hollywood VFX movie** that somehow runs in real-time in a browser or on an iPhone. Think Pixar-level beauty mixed with ILM and Weta Digital cinematic quality.

**Hard Visual Rules (AI must follow every single one):**

- **Lighting:** Use dramatic, cinematic lighting only — volumetric god rays cutting through volumetric fog, strong rim lighting, soft bounced light, and beautiful god rays. The lighting must feel expensive and emotional, never flat or default.
- **Atmosphere:** Always have rich volumetric fog, atmospheric scattering, floating dust particles, and subtle god rays. The scene must feel alive with depth and air.
- **Materials:** Every surface must use high-quality PBR with accurate roughness, metallic, and subsurface scattering. Materials must look physically real — soft translucent surfaces, rich metallic reflections, and creamy light scattering.
- **Post-Processing:** Heavy but tasteful post-processing is required at all times: strong bloom on bright areas, subtle film grain, vignette, chromatic aberration on edges, and cinematic color grading (teal-orange or rich moody tones).
- **Effects:** Real-looking particle systems that behave like actual smoke, fire, sparks, and embers. Use alpha-blended particles with realistic motion. Every interaction must trigger beautiful, juicy VFX.
- **Overall Feel:** The entire experience must look like it came from a big-budget movie trailer or a Pixar short film, but interactive. When someone sees it, their first reaction should be “How the hell is this running in a browser?”

**Visual References (Study These Closely):**

- Bruno Simon’s portfolio (for delightful interactivity and polish)
- Top Codrops Three.js experiments (especially cinematic scroll and post-processing demos)
- ILM and Weta Digital real-time VFX work
- Pixar lighting and material quality
- High-end After Effects VFX with real smoke, fire, and volumetric effects

**Design Tokens (Use These Exact Values):**

- Background: Deep cinematic black (`#050505`)
- Primary accent: Electric cyan (`#00f7ff`)
- Secondary accent: Hot ember orange (`#ff3b00`)
- Bloom intensity: Strong but controlled (1.6–2.2)
- Fog density: Rich and atmospheric
- All motion must feel buttery, heavy, and expensive — use custom spring physics with high quality easing

**ReadyPlay 3D Rule:** Every UI element must appear as a glowing holographic 3D object floating in the scene, never flat 2D overlays.

-----

This is now **extremely specific** so even basic AIs can’t fall back to generic output. It paints a very clear picture of “movie-level VFX in the browser.”


### What This Achieves

- The AI can no longer “decide” to make it basic — the rules are now part of the contract.
- The ReadyPlay + token system acts as a **style enforcement layer**.
- The visual benchmarks (Bruno Simon, etc.) give the AI concrete high-quality targets instead of vague “make it nice”.



**Here’s your clean, complete, brand new Cinematic Style Bible.**

**Cinematic Style Bible**  
**Cinematic Interactive Experience**  
**Version:** 2.0 – Complete Hollywood ACES Edition  
**Date:** May 19, 2026

This is the single source of truth for all visual quality. Every prompt, every scene, every shader, and every UI element **must** follow this document exactly. No exceptions.

### 1. Vision & Non-Negotiable Standard

The experience must look and feel like a **big-budget Hollywood VFX movie or Pixar short film** running interactively in real-time in a browser or on an iPhone.

When someone sees it, their first reaction must be: “How the hell is this running in a browser?”

**Hard Rules (Never Break These):**

- Cinematic, dramatic, expensive lighting at all times
- Rich volumetric atmosphere and depth
- No flat lighting, no default materials, no generic Three.js look
- Every interaction must feel heavy, juicy, buttery, and satisfying
- Dark cinematic mood is primary

### 2. Design Tokens

**Colors**

- Background: `#050505`
- Primary Accent: `#00f7ff` (Electric Cyan)
- Secondary Accent: `#ff3b00` (Hot Ember Orange)
- Fog/Atmosphere: `#112233`

**Bloom & Glow**

- Glow Intensity: 1.8 – 2.5
- Bloom Threshold: 0.55 – 0.65
- Bloom Intensity: 1.4 – 1.8

**Atmosphere**

- Volumetric Fog Density: 0.012 – 0.028
- Ambient Light: 0.05 – 0.12 (very low to force dramatic lighting)

**Motion**

- Primary Easing: `cubic-bezier(0.23, 1, 0.32, 1)`

**Typography**

- Primary Font: **Satoshi Variable** (fallback: Neue Haas Grotesk or Inter Display)
- Letter-spacing: -0.02em to -0.04em

### 3. Post-Processing Pipeline (Mandatory Order)

**3.1 Exposure** – Apply first (recommended range 0.9 – 1.1)

**3.2 ACEScg → ACEScct Conversion**

```metal
float linearToACEScct(float x) {
    const float toe = 0.0078125;
    if (x <= toe) return 10.5402377416545 * x + 0.0729055341958355;
    return (log2(x) + 9.72) / 17.52;
}
```

**3.3 Cinematic LMT (Creative Grading Layer)**
Our signature teal-orange cinematic look.

**3.4 ACEScct → Linear Conversion**

**3.5 ACES RRT Filmic Tone Mapping**
The final filmic curve that gives the Hollywood look.

**3.6 Final Effects**

- Bloom (1.4–1.8 intensity)
- Subtle animated film grain (8–12%)
- Soft vignette
- Very subtle chromatic aberration

### 4. Full Metal Shader (RealityKit)

```metal
float3 applyCinematicLMT(float3 color) {
    float3 c = max(color, 0.0);
    float3 slope  = float3(1.05, 0.98, 1.08);
    float3 offset = float3(0.0, 0.005, 0.01);
    float3 power  = float3(1.12, 1.08, 1.05);
    float sat     = 1.15;

    c = pow(c * slope + offset, power);
    float luma = dot(c, float3(0.2126, 0.7152, 0.0722));
    c = luma + sat * (c - luma);

    float lum = dot(c, float3(0.299, 0.587, 0.114));
    float3 tealTint   = float3(0.85, 1.05, 1.15);
    float3 orangeTint = float3(1.15, 1.05, 0.85);
    c = mix(c * tealTint, c * orangeTint, smoothstep(0.2, 0.85, lum));

    c = pow(c, 1.05);
    return clamp(c, 0.0, 100.0);
}
```

### 5. ReadyPlay 3D Mappings

|ReadyPlay Primitive     |3D Holographic Equivalent                       |
|------------------------|------------------------------------------------|
|ReadyPlayCard           |Floating holographic panel with emissive edges  |
|ReadyPlayStatPill / Chip|Metallic floating orb with ManipulationComponent|
|ReadyPlaySectionHeader  |Large 3D text with volumetric glow              |
|ReadyPlayActionRow      |Horizontal holographic bar                      |

All UI must exist as glowing 3D holographic objects floating in the scene — never flat 2D overlays.

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
