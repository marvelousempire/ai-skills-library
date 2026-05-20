# Tech stack recommendations (conversation)

Gap-fill recommendations before the canonical PRD was finalized.

---

### 1. Fluid Simulation (The Core Challenge)
- **Web (React Three Fiber)**:  
  Use **r3f-fluid-sim** or similar GPU-based solutions (heinergiehl/r3f-fluid-sim or ardeshiir's stable fluid demo). For premium milk-like results, combine **Three.js Water Pro** style WebGPU shaders with custom particle systems. Add **@react-three/drei** helpers and compute shaders for viscosity/splashing. This gets you cinematic, real-time pouring.

- **iOS / iPadOS (RealityKit + Metal)**:  
  RealityKit has improved particle systems and Low Level Mesh API. Use **Metal Compute Shaders** for real-time fluid (interactive examples already exist using Marching Cubes or custom solvers). Combine with RealityKit's post-processing for caustics and subsurface scattering. Not fully "out-of-the-box" but very powerful on Apple Silicon.

### 2. Backend & AI-Powered Blender Post-Processing
- Use **Blender MCP** (Model Context Protocol) + Claude 3.5 / GPT-4o or local Ollama models. This lets an AI agent directly control Blender's Python API (`bpy`) to clean topology, repair meshes, smooth, retopologize, and optimize for printing. There are mature multi-agent setups for this now.
- Run it via a **FastAPI** or lightweight Node backend that receives scans and returns polished models.

### 3. 3D Asset Format (Cross-Platform)
- **Primary**: **USDZ** — Native king for Apple (RealityKit loads it perfectly, great for iOS/iPadOS/Watch export).  
- **Web fallback**: Convert USDZ → **glTF / .glb** (Three.js loves glTF). Use tools like Reality Converter or `usd` Python tools for automated conversion. This gives the best of both worlds.

### 4. Real-Time State Sync (Watch ↔ iPhone/iPad ↔ Web)
- **Firebase** (Firestore + Realtime Database) is still the simplest and works well across web, iOS, and Watch (with some Watch limitations handled via the companion iPhone app).  
- Strong alternatives if you want to avoid Google: **Supabase** (PostgreSQL + realtime) or **Convex** for reactive TypeScript sync.

### 5. Authentication & User Data
- Stick with **Firebase Auth** or **Supabase Auth** — both handle web + Apple Sign-In easily and let users save scans/creations.

