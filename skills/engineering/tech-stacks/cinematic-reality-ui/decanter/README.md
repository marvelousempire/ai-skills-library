# Fluid Simulation PRD Decanter

Status: decanter pass v1

## Source

- Primary source: [`../doctrine/docs/product/canonical-prd.md`](../doctrine/docs/product/canonical-prd.md)
- Conversation archive: [`../doctrine/archive/PRD for Fluid Simulation App.md`](../doctrine/archive/PRD%20for%20Fluid%20Simulation%20App.md)
- Comparison source: `../PRD Full to complare.md`

## Route

```text
Parsing Agent -> Sensemaking Decanter
```

This folder preserves the source PRD and turns it into working artifacts without deleting or rewriting the original document.

## Artifacts

| Artifact | Path | Purpose |
|---|---|---|
| Parsed items ledger | `01-parsed-items/parsed-items-ledger.md` | Stable requirement items extracted from the PRD. |
| Group review notes | `02-groups/group-review-notes.md` | Related requirements grouped by build domain. |
| Placement map | `04-placement-map/placement-map.md` | Where each requirement belongs in a future implementation/docs tree. |
| Duplicate clusters | `05-similarity-duplicates/duplicate-clusters.md` | Exact and near-duplicate PRD blocks. |
| Dedupe suggestions | `06-dedupe-suggestions/dedupe-suggestions.md` | Cleanup recommendations that preserve source history. |
| Clean PRD README | `07-clean-representation/README.md` | Read order and truth contract for the clean PRD package. |
| Canonical PRD draft | `07-clean-representation/canonical-prd-draft.md` | Sound consolidated PRD draft synthesized from decanter artifacts. |
| Requirement table | `07-clean-representation/requirement-table.md` | Stable `PRD-*` requirement table with traceability (29 rows ↔ `FSPRD-*`). |
| Complete inventory | `07-clean-representation/complete-inventory-table.md` | **37 unique** conversation inventory rows (`PRD-001`–`PRD-037`); F-ledger duplicates archived at bottom. |
| Tech stack table | `07-clean-representation/tech-stack-table.md` | Stable `FSTECH-*` technology checklist with phases. |
| Explainer ledger | `07-clean-representation/explainer-ledger.md` | Stable `FSEXP-*` rationale/tutorial/handoff map. |
| Explainer docs tree | `07-clean-representation/docs/README.md` | Expanded explainer docs, one canonical page per topic. |
| Gap ledger | `07-clean-representation/gap-ledger.md` | Missing decisions, risks, and unresolved implementation choices. |
| First build slice | `07-clean-representation/first-build-slice.md` | Smallest solvable implementation slice recommended by Nephew. |
| Coverage checklist | `coverage-checklist.md` | Proof that major source claims were represented. |

## Decanter Finding

The PRD is not ready for direct full-stack implementation as one pass. It is ready for a staged product plan beginning with one narrow cinematic WebGPU/R3F milk-pour prototype, while native RealityKit/Metal, Watch, scanning, backend, and 3D-printing pipelines remain later slices.
