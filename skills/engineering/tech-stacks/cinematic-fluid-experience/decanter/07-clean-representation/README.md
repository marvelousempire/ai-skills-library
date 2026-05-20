# Fluid Simulation Clean PRD Representation

Source PRD: [`../../doctrine/docs/product/canonical-prd.md`](../../doctrine/docs/product/canonical-prd.md)  
Route: `Parsing Agent -> Sensemaking Decanter`  
Status: clean representation draft

## What This Is

This folder turns the huge source PRD into a usable product package without rewriting or deleting the original. The source file contains repeated "final" blocks, early advice, audits, requirements, stack notes, and explainer prose. This clean representation separates those layers so implementation can start from stable artifacts.

## Read This First

| File | Purpose |
|---|---|
| `canonical-prd-draft.md` | The sound, truthful PRD draft synthesized from the parsed requirements, tech stack, and explainer docs. **Section 4** restores the full source PRD requirement set (PRD-001–029 plus implementation patterns, gap-audit items, library research, and toolchain constraints). **Section 15** embeds the source’s final “100% Complete Edition” PRD block verbatim. **Section 16** embeds a snapshot of the complete inventory (authoritative copy: `complete-inventory-table.md`). **Section 17** embeds the WebGPU fluid simulation guide (May 2026). **Section 18** embeds the 2026 repo side-by-side comparison (Water Pro + MLS-MPM recommended). |
| `requirement-table.md` | Stable `PRD-*` requirement table with decanter traceability (29 consolidated rows ↔ `FSPRD-*`). |
| `complete-inventory-table.md` | **37 unique** conversation inventory rows (`PRD-001`–`PRD-037`); semantic dedup applied; duplicate F-ledgers archived at bottom. Distinct ID scheme from `requirement-table.md`. |
| `tech-stack-table.md` | Stable `FSTECH-*` technology checklist with phases. |
| `explainer-ledger.md` | Stable `FSEXP-*` map for rationale, tutorials, warnings, and handoff notes. |
| `docs/README.md` | Expanded explainer docs tree, one page per canonical explainer. |
| `first-build-slice.md` | The smallest recommended implementation slice. |
| `gap-ledger.md` | Open decisions that must be answered before implementation claims are considered solved. |

## Truth Contract

This PRD package does not claim the entire multi-platform product is ready to build in one pass. The truthful state is:

- The product vision is clear: cinematic, premium, hyper-realistic milk pouring.
- The first solvable build is web-only: Vite + React + R3F + Three.js + WebGPU-style prototype.
- Native RealityKit/Metal, Watch, scanning, Blender cleanup, Firebase, and 3D printing are real roadmap requirements, but they are later slices.
- Earlier "no gaps remain" language in the source is not accepted as implementation proof. The gap ledger remains active.

## Recommended Read Order

1. `canonical-prd-draft.md`
2. `requirement-table.md`
3. `tech-stack-table.md`
4. `docs/README.md`
5. `gap-ledger.md`
6. `first-build-slice.md`

## Source Preservation

The original PRD remains source history. Future planning should cite these clean artifacts rather than copying repeated prose out of the source file.
