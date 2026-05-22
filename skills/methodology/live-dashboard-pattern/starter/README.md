# starter/ — copy these into your target repo

This directory carries the **canonical primitives** the rule expects.
When you fill in this recipe (per CHECKLIST.md Stage 1), each `.template`
file gets replaced with a real file copied verbatim from the Nephew
source of truth.

## Files

| File (after fill-in) | Source of truth | Lines |
|---|---|---|
| `live-dashboard.tsx` | `nephew/apps/control-tower/src/lib/live-dashboard.tsx` | ~270 |
| `os-chrome.tsx` | `nephew/apps/control-tower/src/lib/os-chrome.tsx` | ~200 |
| `ExampleCard.tsx` | (genericized from DustpanSummaryPage.tsx) | ~150 |
| `package-deps.md` | (concrete dep list, already filled) | — |

## How to bring this into a new repo

1. Make sure the target repo has React 18 + TypeScript + Vite + Tailwind
   set up. The 5 minimum deps are listed in `package-deps.md`.
2. Copy `live-dashboard.tsx` + `os-chrome.tsx` to your repo's
   `src/lib/` (or equivalent).
3. Copy `ExampleCard.tsx` to `src/pages/` and wire it to a route.
4. Open the page — you should see the example tween numbers + animate
   meters + populate a sparkline within ~10s.
5. Read `examples/` in the parent folder for two production-grade
   consumer pages.

## Don't fork the primitives

If you find yourself wanting to edit `live-dashboard.tsx` or
`os-chrome.tsx` to add behavior, that change should land in the Nephew
canonical FIRST, then propagate back here. The primitives are shared
across every operator-built repo; forking creates drift.

Per the `rule-propagation-discipline`: canonical first, mirrors second.
