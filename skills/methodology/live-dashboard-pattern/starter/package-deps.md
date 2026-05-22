# package-deps.md — the 5 dependencies you actually need

This is the **complete** dependency list for the live-dashboard
pattern. No animation library, no charting library, no state management
library, no HTTP client. The six primitives + Apple-precedent OS chrome
use nothing but React + browser APIs + Tailwind utility classes.

## Runtime dependencies (3)

```bash
pnpm add react react-dom react-router-dom
```

| Package | Min version | Why |
|---|---|---|
| `react` | `^18.0.0` | Functional components, `useEffect`, `useRef`, `useState`, `useMemo` |
| `react-dom` | `^18.0.0` | Renderer |
| `react-router-dom` | `^7.0.0` | Client-side routing — required for `<NavLink>` in the DustpanNav-style sub-tab pattern |

## Dev dependencies (5)

```bash
pnpm add -D typescript vite @vitejs/plugin-react tailwindcss postcss autoprefixer
```

| Package | Min version | Why |
|---|---|---|
| `typescript` | `^5.0.0` | Type-safety for the primitive signatures |
| `vite` | `^6.0.0` | Dev server + bundler. The `proxy` config in `vite.config.ts` is how cross-origin agent API calls avoid CORS in dev |
| `@vitejs/plugin-react` | `^4.0.0` | React refresh + JSX support in Vite |
| `tailwindcss` | `^3.4.0` | All styling — utility classes are compiled into the JS bundle, no separate stylesheet to load |
| `postcss` + `autoprefixer` | `^8.0.0`, `^10.0.0` | Tailwind's build chain |

## What you do NOT need

Reject any PR that adds:

- `framer-motion`, `react-spring`, `@motionone/*`, `motion/react` — `<AnimatedNumber>` does numeric tweens with bare RAF + easeOutCubic in ~30 lines
- `swr`, `@tanstack/react-query`, `react-query` — `useLivePoll` does fetch + polling + ring buffer + cancellation in ~50 lines
- `recharts`, `victory`, `@nivo/*`, `visx`, `d3-shape` — `<Sparkline>` is one `<svg><path d="..."/></svg>` with a normalized point computation in ~30 lines
- `axios`, `ky`, `ofetch` — `fetch()` + `AbortController` are the right shape
- `zustand`, `jotai`, `redux`, `valtio` — `useState` + `useRef` carry the whole component state including the 60-sample ring buffer
- `classnames`, `clsx` — Tailwind class strings concatenate fine with template literals or simple ternaries

## Tailwind config minimum

Your `tailwind.config.js` `content` array must include the paths where
you place the primitives and consumer pages:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The primitives reference these custom colors. Add them.
        bg:    "hsl(0 0% 4%)",         // page background
        "bg-2": "hsl(0 0% 8%)",        // card background
        "bg-3": "hsl(0 0% 14%)",       // meter track background
        fg:    "hsl(0 0% 96%)",        // primary text
        "fg-dim":   "hsl(0 0% 70%)",   // secondary text
        "fg-faint": "hsl(0 0% 50%)",   // tertiary text
        border:     "hsl(0 0% 24%)",   // hairlines
        accent:     "hsl(48 95% 60%)", // operator yellow
      },
    },
  },
  plugins: [],
};
```

Or copy the exact theme from
`~/Developer/nephew/apps/control-tower/tailwind.config.js`.

## Vite proxy minimum

For dev-mode cross-origin fetches without CORS, add to `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      // Add one entry per agent you'll be calling.
      // Pattern: /api/agents/<id>/<path> → <agent base url>/api/<path>
      "/api/agents/<id>": {
        target: "http://127.0.0.1:<port>",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/agents\/<id>/, "/api"),
      },
    },
  },
});
```

Reference: `~/Developer/nephew/apps/control-tower/vite.config.ts`.

## Final dependency count

- **3 runtime deps**
- **5 dev deps**
- **0 animation deps**
- **0 charting deps**
- **0 state-management deps**
- **0 HTTP-client deps**

That's the whole stack.
