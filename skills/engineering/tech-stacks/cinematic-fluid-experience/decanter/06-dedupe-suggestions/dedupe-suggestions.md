# Dedupe Suggestions

Status: suggestions only. Do not apply until the operator approves a cleanup pass.

## Suggestion 1 - Preserve Original, Create Canonical PRD Separately

Keep [`../doctrine/archive/PRD for Fluid Simulation App.md`](../doctrine/archive/PRD%20for%20Fluid%20Simulation%20App.md) unchanged as source history. Create a future `canonical-prd.md` from the final block only after coverage is accepted.

Why: the source file contains conversation evolution, audits, and repeated final blocks. Rewriting it in place would lose provenance.

## Suggestion 2 - Treat The Last PRD Block As Canonical Planning Input

Use lines 738-849 as the current canonical content for implementation planning.

Why: it includes the most complete version of the vision, platform strategy, design system, feature list, hardware integration, tech stack, non-functional requirements, implementation patterns, hardware requirements, and handoff instructions.

## Suggestion 3 - Move Earlier Gap Notes Into A Permanent Gap Ledger

Keep the earlier gap audit even though later text says no gaps remain.

Why: the earlier gap notes are still useful as solvency warnings. "No gaps remain" is not true until each implementation choice has acceptance criteria and verification.

## Suggestion 4 - Split Product Into Implementation Phases

Do not implement Web, iOS, Watch, scanning, Blender, Firebase, and 3D printing together.

Recommended phase order:

1. Web cinematic milk-pour prototype.
2. Shared fluid/design token schema.
3. Device Motion tilt on web.
4. Native RealityKit/Metal prototype.
5. Watch companion controller.
6. Scanning and Blender cleanup pipeline.
7. Auth/sync/storage.
8. Export and 3D-printing validation.

## Suggestion 5 - Rename The Comparison File Later

`../PRD Full to complare.md` appears to be a typo-bearing comparison snapshot.

Suggested future name: `source-drafts/prd-numbered-comparison.md`

Do not rename in this pass unless the operator asks for a cleanup/restructure pass.
