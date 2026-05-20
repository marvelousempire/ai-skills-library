# WebGPU fluid research

Research notes on WebGPU for cinematic real-time fluid. See also [`../rendering/screen-space-fluid-rendering.md`](../rendering/screen-space-fluid-rendering.md) and Master Bible §3.8.

---

**WebGPU is currently the best path for high-quality, real-time fluid simulation on the web** — especially for your cinematic pouring milk vision. It gives you direct access to **compute shaders**, which let the GPU run heavy physics calculations (like particle interactions, viscosity, and splashes) in parallel, far beyond what old WebGL could handle.

### Why WebGPU Excels Here
- **Performance**: Handles thousands to tens of thousands of particles in real time (e.g., 10k+ fluid particles demonstrated in Three.js setups).
- **Realism Features**: Easy to add viscosity (for thick milk), surface tension, splashes, caustics, subsurface scattering (milky opacity), and dynamic foam.
- **Integration**: Works seamlessly with **React Three Fiber (R3F)** via Three.js's `WebGPURenderer` and **Three Shading Language (TSL)** — a node-based system that’s much nicer than raw WGSL shaders.

### Top Practical Options for Your Project (2026)
1. **Three.js Official / Built-in Examples** (Best starting point)  
   - `webgpu_compute_particles_fluid` — MLS-MPM particle simulation running fully in compute shaders. Great base for liquid pouring.  
   - Water-related examples with caustics, reflections, and refraction.

2. **Commercial / Production-Ready**  
   - **Three.js Water Pro** — The most advanced realistic water/ocean system available right now. Uses FFT wave simulation, physically-based shading, caustics, foam, and subsurface scattering. Built on WebGPU + TSL. Looks extremely cinematic and is designed to be dropped into R3F projects.

3. **Open-Source & Custom**  
   - SPH / PIC-FLIP solvers (e.g., jeantimex/fluid on GitHub) — Full GPU-accelerated particle hydrodynamics.  
   - Jos Stam-style grid-based solvers ported to WebGPU (kishimisu repo).  
   - Custom TSL compute shaders in R3F — Many recent tutorials and Codrops-style demos for fluid reveal, interactive liquids, etc.

### How It Fits Your Milk Pouring Vision
You can:
- Tilt the glass using Device Motion (already in our PRD) → affects gravity in the sim.
- Pour by rotating a container mesh → particles flow out realistically.
- Add opacity + scattering for that creamy milk look.
- Combine with PBR materials, dynamic lighting, and sound for full immersion.
- Run at 60fps on modern laptops/phones (with LOD fallbacks).

**Reality Check**: It won’t be 100% “out of the box” like a game engine’s Niagara system, but Water Pro + R3F gets you ~80% there very quickly. The remaining 20% (custom milk viscosity, splashes on contact, etc.) is shader tweaking you can do iteratively.

### Next Steps Recommendation
- Start with a Vite + R3F + WebGPU template.
- Import and test the official fluid particles example + Water Pro (or a free water demo).
- We can prototype the pouring glass interaction next.
