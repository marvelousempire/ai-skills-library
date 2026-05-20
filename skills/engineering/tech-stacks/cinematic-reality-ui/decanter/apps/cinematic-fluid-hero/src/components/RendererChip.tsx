import { useWebGPU } from "../hooks/useWebGPU";
import { useExperienceStore } from "../store/experienceStore";

export function RendererChip() {
  const webgpu = useWebGPU();
  const rendererMode = useExperienceStore((s) => s.rendererMode);
  const fluidBackend = useExperienceStore((s) => s.fluidBackend);

  let label = "Checking GPU…";
  let className = "renderer-chip";

  if (rendererMode === "webgl") {
    const fluid =
      fluidBackend === "webgpu" ? "MLS-MPM GPU" : fluidBackend === "cpu" ? "fluid CPU" : "fluid…";
    if (webgpu === "supported") {
      label = `WebGL · ACES LMT · ${fluid}`;
      className += " renderer-chip--webgpu";
    } else {
      label = `WebGL · ACES LMT · ${fluid}`;
    }
  }

  return (
    <div className={className} aria-live="polite">
      {label}
    </div>
  );
}
