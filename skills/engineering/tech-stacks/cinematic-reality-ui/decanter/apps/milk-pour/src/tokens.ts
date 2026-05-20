/** Minimal cinematic + fluid tokens — slice 1 shared object for later native bridge. */
export const tokens = {
  color: {
    bg: "#08080f",
    milk: "#f4f0ea",
    milkDim: "#d8d2c8",
    accent: "#6ec4ff",
    hud: "rgba(12, 14, 22, 0.72)",
    hudText: "#e8eaef",
    warn: "#f0b429",
  },
  fluid: {
    particleCount: 320,
    particleCountReduced: 80,
    viscosity: 0.92,
    opacity: 0.94,
    pourRate: 1.2,
    gravity: 9.2,
  },
  motion: {
    easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  glow: {
    bloomIntensity: 0.35,
  },
} as const;
