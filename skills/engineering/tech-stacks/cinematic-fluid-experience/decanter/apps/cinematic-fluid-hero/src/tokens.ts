/**
 * Locked design tokens — bible/design-tokens.md + hard-rules.md
 * SSOT: doctrine/docs/quality/bible/
 */
export const tokens = {
  color: {
    bg: "#050505",
    bgElevated: "#0a0a0a",
    fog: "#112233",
    fg: "#f2f4f8",
    fgDim: "rgba(242, 244, 248, 0.65)",
    highlight: "rgba(255, 255, 255, 0.2)",
    cyan: "#00f7ff",
    orange: "#ff3b00",
    accent: "#00f7ff",
    accentSecondary: "#ff3b00",
    hologram: "rgba(0, 247, 255, 0.18)",
    hologramBorder: "rgba(0, 247, 255, 0.45)",
    border: "rgba(255, 255, 255, 0.1)",
  },
  effect: {
    /** post-processing-pipeline.md step 1 */
    exposure: 1.0,
    glowIntensity: 2.0,
    glowIntensityMin: 1.8,
    glowIntensityMax: 2.5,
    bloomThreshold: 0.6,
    bloomIntensity: 1.6,
    bloomRadius: 1.0,
    /** film grain 8–12% */
    filmGrain: 0.1,
    vignette: 0.55,
    chromaticAberration: 0.0015,
    /** atmosphere 0.012 – 0.028 */
    fogDensity: 0.02,
    fogNear: 2.5,
    fogFar: 16,
    ambientLight: 0.08,
    godRayIntensity: 3.2,
    rimIntensity: 1.8,
  },
  motion: {
    easePremium: "cubic-bezier(0.23, 1, 0.32, 1)",
    easeOut: [0.22, 1, 0.36, 1] as const,
    spring: { stiffness: 280, damping: 24 },
  },
  typography: {
    fontFamily: '"Satoshi", "Inter Display", "Inter", system-ui, sans-serif',
    letterSpacing: "-0.03em",
  },
  fluid: {
    /** mls-mpm-technique.md — 32k–64k slice */
    particleCount: 32768,
    workgroupSize: 64,
  },
} as const;
