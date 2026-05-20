import type { WebGLRenderer } from "three";

export type RendererMode = "webgl";

export type CinematicRendererResult = {
  renderer: WebGLRenderer;
  mode: RendererMode;
};

/**
 * WebGL renderer for R3F + @react-three/postprocessing (EffectComposer needs WebGL
 * getContextAttributes). WebGPU compute for fluid is deferred until post stack
 * supports WebGPURenderer; probe API separately via useWebGPU for the status chip.
 */
export async function createCinematicRenderer(
  canvas: HTMLCanvasElement,
): Promise<CinematicRendererResult> {
  const { WebGLRenderer } = await import("three");
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  return { renderer, mode: "webgl" };
}
