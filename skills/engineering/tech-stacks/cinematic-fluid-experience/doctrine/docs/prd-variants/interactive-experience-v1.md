**Product Requirements Document - Cinematic Interactive Experience**

**Document Type:** Final Comprehensive Reusable Blueprint / LLM Skill Specification  
**Version:** 1.0 – 100% Complete Edition  
**Date:** May 18, 2026

### 1. Vision & Goals

Create a stunning, cinematic interactive web application that delivers a premium, video game-quality 3D experience directly in the browser. The goal is for users to open the app and immediately think “this looks and feels like a real video game.”

**Non-Negotiable Philosophy:** Immersion-first. Full-screen 3D canvas with buttery-smooth, highly responsive interactions. The experience must feel premium, satisfying, and addictive. Every motion should feel silky and high-quality.

The core focus is building an immersive, dynamic 3D environment where users can freely interact with objects using intuitive gestures — tilting, dragging, pinching, and rotating — with real-time physics and cinematic visuals.

### 2. Platform Strategy

- **Primary Platform**: Progressive Web App (PWA) built with Vite + React + Three.js + React Three Fiber + WebGPU
- **Secondary Platform**: Native iOS & iPadOS using SwiftUI + RealityKit 4 + Metal
- **Companion Device**: Apple Watch for tilt input and haptic feedback
- Full visual and behavioral consistency across all platforms using shared design tokens

### 3. Design System

Implement shared Design Tokens across web and native for colors, spacing, animations, easing curves, glow intensity, cinematic parameters, and interaction behavior. This ensures the experience feels identical whether accessed on web or native.

**Mood & Aesthetic:** Premium cinematic environment with deep lighting, volumetric effects, bloom, and high-quality materials. Support both dark and light modes with appropriate emphasis.

**Design System Bridge:** ReadyPlay primitives (cards, pills, chips, etc.) must have hybrid 2D-to-3D previews, mapping to RealityKit components like `ViewAttachmentComponent` and `ManipulationComponent` where applicable.

### 4. Core Features

- Highly immersive real-time 3D environment with premium cinematic rendering
- Advanced physics and dynamic object interactions (tilting, pouring-style flow, collisions, splashes)
- Intuitive gesture controls: device tilt, drag to move/rotate, pinch to scale or adjust parameters
- Haptic feedback synced to all major interactions
- Spatial audio that reacts to object movement and collisions
- Interactive 3D objects that users can grab, spin, and inspect
- Cinematic lighting with PBR materials, subsurface scattering, dynamic shadows, and caustics
- Support for importing user-scanned 3D objects into the scene

### 5. Hardware & Sensor Integration

- Device Motion / Accelerometer for real-time tilt control
- LiDAR + TrueDepth scanning support (for object import on supported devices)
- Core Haptics and Spatial Audio
- Apple Pencil support on iPadOS
- Metal Performance Shaders for advanced effects

### 6. Scanning & 3D Asset Pipeline

- Real-world object scanning using LiDAR and TrueDepth camera
- AI-powered post-processing that automatically cleans and optimizes scanned models in Blender
- Export support for .obj and .usd formats
- Smooth asset pipeline between Blender, web, and native platforms (USDZ primary, glTF for web)

### 7. Tech Stack

**Web (Primary)**

- Vite + React + TypeScript + Three.js + React Three Fiber + @react-three/drei + WebGPU
- Advanced GPU compute shaders for physics and particle systems
- State Management: Zustand or Jotai
- Progressive Web App capabilities

**Native (iOS/iPadOS)**

- Swift + SwiftUI + RealityKit 4 + RealityView + Reality Composer Pro
- Key Components: `PhysicsBodyComponent`, `CollisionComponent`, `ManipulationComponent`, `ViewAttachmentComponent`, `ParticleEmitterComponent`, `EnvironmentResource`
- Metal Post-Processing and Compute Shaders

**Shared**

- Design Tokens managed via Style Dictionary or Tokens Studio
- Firebase for real-time sync and authentication
- USDZ ↔ glTF asset conversion pipeline

### 8. Non-Functional Requirements

- **Performance:** Target 60fps (120fps preferred on capable devices). Use LOD, smart culling, and efficient GPU techniques.
- **User Experience:** Fully immersive with minimal UI. Intuitive gesture-based interactions. Apple Watch as companion controller.
- **Accessibility:** Reduced motion options, VoiceOver support, and low-vision considerations.
- **Sound Design:** Spatial audio tightly synced to visual interactions.
- **Deployment:** Deployed as a Progressive Web App with native iOS companion app option.

### 9. Core Implementation Approach

**Web:** Start with a Vite + React Three Fiber + WebGPU template. Use GPU compute shaders for high-performance physics and particle systems. Leverage Device Motion for tilt controls.

**iOS:** Build around a full-screen `RealityView` with minimal SwiftUI overlays. Use RealityKit 4 components and Metal post-processing for cinematic quality.

**Design Integration:** Maintain a hybrid design system with 2D-to-3D component mapping for consistency.

This document is the single source of truth for the project — a high-quality, cinematic, immersive interactive 3D web experience built with modern real-time graphics technologies. It captures the complete technical direction and requirements without any leftover references to the original placeholder concept.

Would you like me to expand any specific section?