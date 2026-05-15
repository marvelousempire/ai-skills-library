# Format measurements for display — never show raw numbers

Raw numeric values must never be displayed without unit formatting. A raw
`heightInches = 69` displaying as `69"` instead of `5′9″` is a UI bug that
looks like a data bug. Formatters already exist — they just need to be shared.

---

## The rule

Create a shared formatter for any unit-based value in `lib/`. Never inline
the format logic at the display site. If the formatter already exists in one
file, extract it to `lib/` immediately (see `shared-util-extraction`).

| Raw value | Correct display | Wrong display |
|-----------|-----------------|---------------|
| `69` (height in inches) | `5′9″` | `69"`, `69 in`, `5.75 ft` |
| `242` (weight in lbs) | `242 lbs` | `242`, `242.0` |
| `3600` (duration in seconds) | `60 min` | `3600`, `3600s` |
| `72` (heart rate in bpm) | `72 bpm` | `72`, `72.0 bpm` |
| `26.2` (distance in miles) | `26.2 mi` | `26.2`, `26.20miles` |

---

## Canonical height formatter

```ts
// lib/format-measurements.ts

export function formatHeight(totalInches: number): string {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}′${inches}″`;
}

export function formatWeight(lbs: number): string {
  return `${lbs} lbs`;
}

export function formatHeartRate(bpm: number): string {
  return `${bpm} bpm`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}
```

Import at every display site:

```tsx
import { formatHeight } from "@/lib/format-measurements";

<span>{formatHeight(player.heightInches)}</span>  // → 5′9″
```

---

## Where this bites in a monorepo

The same raw value is displayed in multiple surfaces: iOS, admin dashboard,
player-web profile. Each display site has its own format logic, and they
drift. The canonical fix: one formatter in `lib/`, imported by all surfaces.
If iOS uses Swift, write the formatter in a Swift extension
(`Player+DisplayName.swift`) that every view imports.

---

## Enforcement

Add a lint rule or code review checklist item:

> No `heightInches` or `weightLbs` reference may appear in a JSX/TSX
> expression without being wrapped in a formatter function from `lib/`.

---

## First seen

Red-E Play admin player page + player-web profile, 2026-05-14. `heightInches
= 69` displayed as `69"` on the admin detail page. `formatHeight` already
existed in `admin/app/(dashboard)/players/[id]/measurables/page.tsx` but was
not shared with the main player detail page or player-web.
