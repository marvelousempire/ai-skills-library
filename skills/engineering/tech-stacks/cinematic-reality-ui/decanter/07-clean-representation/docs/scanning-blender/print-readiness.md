# Print Readiness

Explainer ID: FSEXP-016  
Source lines: 140-148  
Related IDs: PRD-011, PRD-015, PRD-016, PRD-017; FSTECH-025, FSTECH-030

## Core Point

Phone scans are useful for AR and visual use, but they are usually not print-ready without cleanup.

## Why Cleanup Is Needed

LiDAR and TrueDepth scans can contain holes, rough topology, noisy surfaces, and geometry that looks acceptable in AR but fails as a high-quality printable model.

## Cleanup Jobs

- Repair holes.
- Smooth noisy surfaces.
- Fix topology.
- Retopologize when needed.
- Prepare scale, manifold geometry, and export settings for printing.

## Boundary

Scanning and 3D printing are a separate product subsystem. They should not block the first web milk-pour prototype.
