import { create } from "zustand";
import type { RendererMode } from "../renderer/createCinematicRenderer";
import type { SimBackend } from "../fluid/WebGPUParticleSim";

type ExperienceState = {
  rendererMode: RendererMode | null;
  fluidBackend: SimBackend | null;
  setRendererMode: (mode: RendererMode) => void;
  setFluidBackend: (backend: SimBackend) => void;
};

export const useExperienceStore = create<ExperienceState>((set) => ({
  rendererMode: null,
  fluidBackend: null,
  setRendererMode: (mode) => set({ rendererMode: mode }),
  setFluidBackend: (backend) => set({ fluidBackend: backend }),
}));
