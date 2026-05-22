# examples/ — verbatim copies of two production cards

These files are not templates — they are **verbatim copies** of two
production-grade dashboard cards shipped in Nephew Control Tower on
2026-05-22. Read them to see the pattern at two different domains
(disks + processes) before building your own.

## Files

| File (after fill-in) | Source of truth | Shows |
|---|---|---|
| `disks-card.tsx` | `nephew/apps/control-tower/src/pages/DustpanSummaryPage.tsx` | Per-disk meter grid, aggregate header tiles, per-disk sparkline of free-GB trend |
| `processes-card.tsx` | `nephew/apps/control-tower/src/pages/DustpanProcessesPage.tsx` | Per-process list with CPU + MEM meters, sortable, per-process CPU sparkline keyed by PID |

## What to learn from each

### `disks-card.tsx`
- How to build a **GRID layout** (md:grid-cols-2 xl:grid-cols-3) of
  resource tiles
- How to use `LiveTile` for the aggregate header row
- How to derive per-item sparkline series from the ring buffer by
  KEYING on a stable id (here: `mount` path)
- How to compute composite health from multiple signals (any disk ≥
  90% used = warning)

### `processes-card.tsx`
- How to build a **LIST layout** of rows (each row = one process)
- How to add a **SORT control** that re-orders the rendered list
  without losing the ring-buffer history
- How to render TWO meters per row (CPU + MEM) side by side
- How to key per-item sparklines by a NUMERIC id (here: `pid`)

## DO NOT modify these files

If you find yourself wanting to edit either file, the right move is to
edit the canonical in Nephew first, then re-copy here. Forking creates
drift.
