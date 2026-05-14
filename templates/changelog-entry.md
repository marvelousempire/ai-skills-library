## [<surface> <version>] — YYYY-MM-DD HH:MM:SS Eastern · *<short tagline>*

> **<Surface>** (`<package.json>` **<version>**): <full description>. <What's in it>. <What's intentionally not in it>. <How to verify it landed>.
>
> **Files:** `<path1>` · `<path2>` · `<path3>`.

---

## Surface-specific variants

### Backend-only
```
## [<backend-version> backend] — TS · *<tagline>*

> **Backend** (`backend/package.json` **<v>**): <body>.
>
> **Files:** `backend/src/db/migrations/NNNN_*.sql` (new), ...
```

### Marketing-only (touches `marketing/**`)
```
## [<marketing-version> marketing] — TS · *<tagline>*

> **Marketing** (`marketing/package.json` **<v>**): <body>.
>
> **Files:** `marketing/app/<page>/page.tsx` (new), ...
```

### Docs/ledger-only (no surface version bump)
```
## [docs] — TS · *<tagline>*

> **<Affected surface>**: <body>. Zero schema/code/UI; ledger-only registration. Implementation lands in subsequent PRs.
>
> **Files:** `backend/src/db/migrations/NNNN_seed_*.sql`, `docs/Plan-*.md`, `docs/Feature Ledger.md`.
```

### Multi-surface (touches >1 surface)
```
## [<m-v> marketing + <a-v> admin + <b-v> backend] — TS · *<tagline>*

> <body> — broken into sections per surface, version per package.json file, files at the end.
```
