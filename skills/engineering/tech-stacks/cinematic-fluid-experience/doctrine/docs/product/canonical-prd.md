# Canonical PRD — Cinematic Fluid Experience

> **Canonical product source.** Extracted from the final `PRD-001` … `PRD-029` block in the conversation archive. For full history see [`conversation-source-archive.md`](conversation-source-archive.md).

**Product Requirements Document - Cinematic Fluid Experience**  
**Document Type:** Final Comprehensive Reusable Blueprint / LLM Skill Specification (`skill.md` equivalent)  
**Version:** 1.0 – 100% Complete Edition (Scraped & Synthesized from Full Conversation)  
**Date:** May 18, 2026

### 1. Vision & Goals  
**PRD-001**  
Create a stunning, cinematic web and Apple ecosystem experience featuring hyper-realistic fluid simulation — specifically pouring milk that moves and looks completely real. The goal is for users to see it and immediately think “this looks like a video game” or “this is beautiful.”

**Non-Negotiable Philosophy:** Immersion-first. Full-screen `RealityView` canvas (`ignoresSafeArea()`, system chrome hidden). SwiftUI used only for minimal auto-hiding overlays and HUD attachments. Everything must feel premium, game-like, cinematic, satisfying, and addictive. No “crummy basic” interfaces and no playful or cartoonish styling.

### 2. Platform Strategy  
**PRD-002** • **PRD-003**  
- **Web**: Vite + React + Three.js + React Three Fiber + WebGPU  
- **iOS & iPadOS**: SwiftUI + RealityKit 4 + RealityView + Metal + Metal Performance Shaders (target iOS 19+ with Xcode 17+ and Reality Composer Pro)  
- **Apple Watch**: Companion controller for tilt input, haptics, and simple controls  

Full visual and behavioral consistency across all platforms using shared design tokens.  
iPadOS advantages: larger screen real estate, better multi-touch gestures, Apple Pencil support, Stage Manager. Apple Watch acts as companion device (tilt/haptics controller) while heavy rendering runs on iPhone/iPad/web.

### 3. Design System  
**PRD-004**  
Implement shared Design Tokens across web and native for colors, spacing, animations, cinematic easing curves, glow, blur, fluid parameters, and visual consistency so the fluid motion and visuals feel identical across platforms. Use **Style Dictionary** or **Tokens Studio**.

**Mood, Aesthetic & Design System Bridge (ReadyPlay 2026)**  
**Core Feeling:** Premium cinematic experience with dark-mode depth and neon/glow accents.  
**Lighting & Effects:** Volumetric fog, dynamic spotlights, bloom, vignette, film grain.  
**Motion:** Physics impulses, spring collisions, slow-mo on key fluid events, subtle pulses.  
**Design System Rules (ReadyPlay Primitives):** `ReadyPlayCard`, `ReadyPlayStatPill`, `ReadyPlayChip`, `ReadyPlaySectionHeader`, `ReadyPlayActionRow`, `ReadyPlayScreenBackground`, `ReadyPlayDrawerSurface`.  
**Bridge to 3D Arena (2D → 3D):** Every primitive must preview its RealityKit counterpart.  
**Hybrid Preview Requirement:** All primitives must have optional `RealityView` + `ViewAttachmentComponent` previews in `ReadyPlayArenaBridge.swift`.

### 4. Core Features  
**PRD-005** • **PRD-006** • **PRD-007** • **PRD-008** • **PRD-009**  
- Hyper-realistic pouring milk simulation (milky opacity, realistic viscosity, splashes, foam, creamy look)  
- Advanced real-time lighting and materials (PBR, subsurface scattering for milky look, caustics, dynamic shadows)  
- Touch/gesture interactions (tilt glass, swipe to pour, pinch to adjust viscosity, rotate/inspect) with haptics  
- Matching spatial audio (sloshing, pouring, impact sounds)  
- Interactive 3D elements (grab/spin glass or fluid containers, inspect parameters)

### 5. Hardware & Sensor Integration  
**PRD-010** • **PRD-011** • **PRD-012** • **PRD-013** • **PRD-014**  
- Device Motion / Accelerometer on web and Core Motion on iOS for tilt control  
- LiDAR and TrueDepth scanning for objects, environments, and faces (import into fluid scenes)  
- ARKit / RealityKit World Tracking  
- Core Haptics and Spatial Audio  
- Metal Performance Shaders  
- Dynamic Island / Live Activities  
- Apple Pencil support on iPadOS

### 6. Scanning & 3D Printing Pipeline  
**PRD-015** • **PRD-016** • **PRD-017**  
- Object scanning using LiDAR and TrueDepth camera  
- AI-powered post-processing that cleans and optimizes scanned models in Blender (fixing topology, repairing holes, smoothing surfaces, retopologizing)  
- Export scanned models as .obj or .usd for high-quality 3D printing

### 7. Tech Stack  
**PRD-018** • **PRD-019** • **PRD-020** • **PRD-021** • **PRD-022** • **PRD-023** • **PRD-024**  

**Web Platform**  
- Vite + React + TypeScript + Three.js + React Three Fiber + @react-three/drei + WebGPU (compute shaders, TSL)  
- Fluid Simulation: GPU-based (r3f-fluid-sim style, official `webgpu_compute_particles_fluid`, Water Pro–style systems with custom viscosity, splashes, caustics, subsurface scattering)  
- State Management: Zustand or Jotai  

**Apple Platforms – RealityKit 4 (Primary Canvas)**  
- Swift + SwiftUI + RealityKit 4 + RealityView + Reality Composer Pro  
- **Mandatory RealityKit 4 Components:** `PhysicsBodyComponent`, `CollisionComponent`, `ManipulationComponent`, `ViewAttachmentComponent`, `ParticleEmitterComponent`, `MeshInstancesComponent`, `EnvironmentBlendingComponent`, `GestureComponent`, Observable entities  
- **Metal Post-Processing:** `RealityView.postProcess` closure with Metal Performance Shaders (bloom, vignette, film grain, color grading, distortion)  
- Fluid Simulation: Metal Compute Shaders + RealityKit particle system  
- Haptics: Core Haptics / `UIImpactFeedbackGenerator`  
- Audio: AVFoundation + `SpatialAudioComponent` + `AVAudioEngine`  

**Backend & AI Pipeline**  
- Python + FastAPI + Claude 3.5/GPT-4o + Blender Python API (`bpy`)  
- Real-time Sync: Firebase (Firestore + Authentication)  
- Primary 3D format: USDZ (with glTF conversion for web)

### 8. Non-Functional Requirements & Performance Delivery  
**PRD-025** • **PRD-026** • **PRD-027** • **PRD-028** • **PRD-029**  
- **Performance:** 60 fps minimum (120 fps preferred on capable devices). Full GPU-native rendering via RealityKit 4 and WebGPU. Profile with Instruments. Use LOD, smart culling, `MeshInstancesComponent`, and simplified shaders on mobile.  
- **User Flow & Interactions:** Intuitive tilt/pour/pinch gestures, real-time fluid response, Apple Watch companion control, immersive full-screen experience with minimal HUD overlays.  
- **Asset Pipeline:** Reality Composer Pro → USDZ workflow for models, textures, and shaders. Keep everything in sync across web, iOS, and Blender.  
- **Accessibility:** Motion sensitivity options (reduce fluid motion), VoiceOver support on attachments, low vision considerations.  
- **Sound Design Implementation:** AVFoundation + Spatial Audio on Apple; Web Audio API on web. Audio tightly synced to fluid events.  
- **Deployment Strategy:** Web app + native iOS/iPadOS (with Watch companion) connected via Firebase.  
- Privacy (explicit consents for sensors/scanning), extensibility, and phased implementation.

### 9. Core Implementation Patterns (iOS/RealityKit)  
**RealityView Structure (`CinematicFluidArenaView`):** Root Entity hierarchy with glass/container, fluid particles, HUD attachments, and `postProcess` closure. Live updates via `onChange(of: model)`.  
**Physics & Fluid Interaction Pattern:** Clone templates, apply impulses/forces based on tilt/pour gestures, collision callbacks → particle bursts (splashes/foam), haptics, and audio.  
**Design System Integration:** Runtime toggle + hybrid previews in `ReadyPlayArenaBridge.swift`.

### 10. Hardware Required for Development  
- MacBook (M1 or newer) — mandatory for iOS/RealityKit development  
- iPhone 12 Pro or newer (for LiDAR)  
- iPad Pro (recommended)  
- Apple Watch (for testing companion features)

### Handoff Instructions for Developers / AI Agents  
1. Start with design system toggle + ReadyPlay primitives + hybrid previews.  
2. Build RealityView fluid scene following exact component and post-process patterns.  
3. Test exclusively on-device for physics, GPU performance, haptics, and sensors.  
4. Preserve full immersion — never reduce to static 2D interfaces.

---

This document is now the **single source of truth**.  
Every single thing we discussed across the entire chat is present, tracked with IDs, and fully integrated.

You can copy this entire block and save it as your master `PRD.md`.
