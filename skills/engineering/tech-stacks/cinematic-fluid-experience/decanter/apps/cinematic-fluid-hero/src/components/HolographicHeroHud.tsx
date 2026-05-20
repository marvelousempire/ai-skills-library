import { Html } from "@react-three/drei";

/** hard-rules: holographic 3D UI in scene — not flat page chrome */
export function HolographicHeroHud() {
  return (
    <Html
      transform
      position={[-2.2, 0.2, 0.5]}
      distanceFactor={4.2}
      style={{ pointerEvents: "auto", width: "min(420px, 90vw)" }}
    >
      <div className="holographic-panel holographic-panel--hero">
        <p className="eyebrow">Cinematic Fluid Experience</p>
        <h1>
          Hollywood-grade
          <span className="gradient-text"> fluid</span>
        </h1>
        <p className="hero-lead">
          Master Bible pipeline: ACES LMT, bloom, volumetric atmosphere, WebGPU MLS-MPM particles.
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#experience">
            Experience model
          </a>
          <a className="btn btn-ghost" href="#stack">
            Stack
          </a>
        </div>
      </div>
    </Html>
  );
}
