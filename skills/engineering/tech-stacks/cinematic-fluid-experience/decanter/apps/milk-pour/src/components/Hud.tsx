import type { WebGPUStatus } from "../hooks/useWebGPU";

type HudProps = {
  webgpu: WebGPUStatus;
  fps: number;
  reducedMotion: boolean;
  onReducedMotionChange: (value: boolean) => void;
};

export function Hud({ webgpu, fps, reducedMotion, onReducedMotionChange }: HudProps) {
  const webgpuClass =
    webgpu === "supported"
      ? "status-supported"
      : webgpu === "unsupported"
        ? "status-unsupported"
        : "status-checking";

  return (
    <>
      <div className="hud hud-top-left">
        <div className="hud-panel">
          <h1>Cinematic Milk Pour</h1>
          <p>Plan 0034 prototype — pointer tilt + hold to pour.</p>
          <label>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => onReducedMotionChange(e.target.checked)}
            />
            Reduce motion
          </label>
          {webgpu === "unsupported" && (
            <div className="fallback-banner">
              WebGPU is not available in this browser. Running WebGL particle approximation.
              For MLS-MPM compute shaders, use a WebGPU-capable browser (Chrome/Edge recent).
            </div>
          )}
        </div>
      </div>
      <div className="hud hud-top-right">
        <div className="hud-panel">
          <div className="metric">
            <span>WebGPU</span>
            <strong className={webgpuClass}>{webgpu}</strong>
          </div>
          <div className="metric">
            <span>FPS (approx)</span>
            <strong>{fps}</strong>
          </div>
        </div>
      </div>
      <div className="hud hud-bottom">
        Drag to orbit · Move pointer to tilt · Hold click/touch to pour
      </div>
    </>
  );
}
