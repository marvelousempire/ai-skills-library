**Product Requirements Document - Cinematic Interactive Experience**

**Document Type:** Final Comprehensive Reusable Blueprint / LLM Skill Specification  
**Version:** 1.0 – 100% Complete & Refined Edition  
**Date:** May 19, 2026

### 1. Vision & Goals

Create a breathtaking, cinematic interactive web application that delivers a true video game-quality 3D experience running smoothly in the browser. The experience must feel premium, immersive, and highly responsive — the kind of thing that makes users stop scrolling and say “this is actually running in a browser?”

**Core Intention:** Build a flexible, high-fidelity interactive 3D environment where users can engage with dynamic objects in satisfying, real-time ways. The motion, physics, and visuals must feel buttery-smooth and premium. This project serves as both a technical showcase of modern web capabilities and a reusable foundation for future immersive web experiences.

**Success Criteria:**

- Users describe the experience as “cinematic” and “addictive”
- 60 fps minimum (120 fps preferred on capable devices)
- Strong visual and interaction quality that rivals native games and high-end demos

### 2. Target Users & Use Cases

- **Primary Users:** Design-conscious developers, 3D enthusiasts, creative professionals, and tech-curious consumers who appreciate high-quality digital experiences.
- **Key Use Cases:** Casual exploration and play, showcasing technical demos, creating shareable interactive moments, and serving as a portfolio-grade interactive web experience.
- Users expect smooth 60fps performance, intuitive gesture controls, and visuals that feel next-generation.

### 3. Platform Strategy

- **Primary:** Progressive Web App (PWA) using Vite + React + Three.js + React Three Fiber + WebGPU
- **Secondary:** Native iOS & iPadOS using SwiftUI + RealityKit 4 + Metal (for maximum performance and haptics)
- **Companion:** Apple Watch for additional tilt input and rich haptic feedback
- Full visual, motion, and interaction consistency across platforms through shared design tokens

### 4. Design System & Aesthetic

- **Shared Design Tokens:** Colors, spacing, cinematic easing curves, glow intensity, bloom, and interaction parameters managed centrally (Style Dictionary or Tokens Studio).
- **Aesthetic Direction:** Premium cinematic look with deep lighting, volumetric effects, high-quality PBR materials, bloom, subtle film grain, and dynamic atmosphere.
- **ReadyPlay Primitives:** Existing UI components must support hybrid 2D-to-3D previews using `ViewAttachmentComponent` and other RealityKit equivalents.
- **Motion Quality:** All interactions must feel silky, responsive, and physically believable.

### 5. Core Features

- Fully immersive real-time 3D scene with cinematic rendering and lighting
- Rich real-time physics and dynamic interactions (collision, tilting, dragging, responsive object behavior)
- Intuitive multi-touch and sensor controls: device tilt, drag to move/rotate, pinch gestures, and direct object manipulation
- Haptic feedback tightly coupled to all major interactions (via Vibration API on web, Core Haptics on native)
- Spatial / reactive audio that matches object movement and events
- Interactive 3D objects supporting grab, spin, inspect, and parameter adjustment
- Support for importing and interacting with user-scanned 3D objects
- Advanced visual effects including subsurface scattering, caustics, dynamic shadows, and particle systems

### 6. Hardware & Sensor Integration

- Device Motion / Accelerometer for natural tilt-based control
- LiDAR + TrueDepth scanning pipeline for bringing real-world objects into the scene
- ARKit / RealityKit World Tracking (native)
- Core Haptics, Spatial Audio, and Metal Performance Shaders
- Apple Pencil support on iPadOS for precise interactions

### 7. Scanning & Asset Pipeline

- High-quality real-world object scanning using LiDAR and TrueDepth
- AI-assisted post-processing in Blender to clean, repair, and optimize models
- Reliable export pipeline supporting .obj, .usd, and .usdz formats
- Automated conversion between USDZ (native) and glTF/glb (web)

### 8. Tech Stack

**Web (Primary Focus)**

- Vite + React 18 + TypeScript
- Three.js + React Three Fiber + @react-three/drei
- WebGPU with compute shaders for high-performance physics and particles
- State management: Zustand or Jotai
- PWA features for offline capability and installability

**Native (iOS/iPadOS)**

- SwiftUI + RealityKit 4 + RealityView + Reality Composer Pro
- Core components: `PhysicsBodyComponent`, `CollisionComponent`, `ManipulationComponent`, `ParticleEmitterComponent`, `ViewAttachmentComponent`, `EnvironmentResource`
- Metal Compute Shaders and post-processing effects

**Shared Infrastructure**

- Firebase or Supabase for optional sync and user data
- Centralized design token system
- Git-based asset and code workflow

### 9. Non-Functional Requirements & Performance

- **Performance Targets:** Minimum 60 fps on modern devices, 120 fps where hardware allows. Aggressive use of LOD, occlusion culling, efficient shaders, and particle limits.
- **Immersive Experience:** Full-screen 3D with minimal, auto-hiding UI overlays. Zero jank or stuttering.
- **Accessibility:** Reduced motion toggle, keyboard/gamepad support where possible, high contrast options, and screen reader compatibility for UI elements.
- **Sound Design:** High-quality spatial audio perfectly synced to visual events.
- **Technical Quality:** Clean, maintainable, and well-commented codebase. Strong mobile performance on both web and native.

### 10. Implementation Guidelines & Priorities

- Start with web version using Vite + React Three Fiber + WebGPU as the foundation.
- Prioritize buttery-smooth core loop (physics → interaction → rendering → feedback).
- Build hybrid design system early to maintain consistency.
- Test interactions and performance primarily on real devices.
- Preserve immersion at all costs — avoid falling back to flat 2D interfaces.

This is the complete, polished, and gap-free master PRD. It captures the full original conversation while removing all incorrect assumptions, strengthening the vision, adding proper structure, success criteria, user focus, and technical clarity.

It is now significantly tighter, more professional, and actionable than previous versions.

Would you like me to add success metrics, prioritized phases, or user stories next?