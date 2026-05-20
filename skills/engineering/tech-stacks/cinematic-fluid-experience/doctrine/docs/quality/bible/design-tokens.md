# Design tokens (locked values)

Part of the [Master Cinematic Quality Bible](README.md). Use these everywhere — web and native.

## Colors

| Token | Value | Role |
|-------|-------|------|
| Background | `#050505` | Deep cinematic void |
| Primary accent | `#00f7ff` | Electric cyan |
| Secondary accent | `#ff3b00` | Hot ember orange |
| Fog / atmosphere | `#112233` | Teal-black mix |

## Bloom and glow

| Parameter | Range |
|-----------|--------|
| Glow intensity | 1.8 – 2.5 |
| Bloom threshold | 0.55 – 0.65 |
| Bloom intensity | 1.4 – 1.8 |

## Atmosphere and lighting

| Parameter | Range |
|-----------|--------|
| Volumetric fog density | 0.012 – 0.028 |
| Ambient light | 0.05 – 0.12 (very low) |

## Motion

- **Primary easing:** `cubic-bezier(0.23, 1, 0.32, 1)`

## Typography

- **Primary font:** Satoshi Variable (fallback: Neue Haas Grotesk or Inter Display)
- **Letter-spacing:** -0.02em to -0.04em

## Implementation

Web reference: [`../../../../decanter/apps/cinematic-fluid-hero/src/tokens.ts`](../../../../decanter/apps/cinematic-fluid-hero/src/tokens.ts)
