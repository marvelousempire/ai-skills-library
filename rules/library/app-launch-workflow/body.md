# App Launch Workflow — Learn Mappers LLC / AVERY GOODMAN

Every app we ship follows this workflow. Implement it end-to-end on every project without being asked.
This document is the single source of truth for how we build, design, and launch apps.

---

## The one-liner that launches every app

```sh
git pull && pnpm install && make ui          # localhost — browser auto-opens
git pull && pnpm install && make ui-network  # Wi-Fi visible — browser auto-opens
```

That is the promise. It works on day 1, day 100, and on any machine with pnpm installed.

---

## Part 1 — Design first, always

**This is the step that was missing from every app that felt inconsistent.**
Run the design system before writing a single component.

### Step 1A — Generate the design system with ui-ux-pro-max

```bash
python3 skills/visual/design/ui-ux-pro-max/scripts/search.py \
  "<product_type> <industry> <keywords>" \
  --design-system --persist -p "Project Name"
```

This generates and saves:
- `design-system/MASTER.md` — colors, typography, spacing, motion, component patterns
- `design-system/pages/` — per-page overrides

**Never start coding without running this.** The design system is the contract the entire UI is built against. If it is skipped, every component drifts and the result looks inconsistent.

For page-specific overrides:
```bash
python3 ... --design-system --persist -p "Project Name" --page "dashboard"
```

Supplement with domain searches as needed:

| Need | Command |
|---|---|
| Animation/motion UX | `--domain ux "animation accessibility fluidity"` |
| Chart/data viz | `--domain chart "real-time dashboard"` |
| Typography | `--domain typography "clean readable sans"` |
| Component patterns | `--stack react` or `--stack nextjs` |

### Step 1B — Source pre-built components from 21st.dev

**21st.dev** is the component library that should be the first stop whenever you need a UI piece.
It offers a community gallery of production-ready React/Next.js components (heroes, navbars, cards,
animations, AI chat UIs, pricing sections, testimonials, data tables, and more) that you can copy
directly into any project and restyle with your Tailwind tokens.

**Community gallery** — browse and copy:
- [21st.dev/community](https://21st.dev/community) — all published components
- [21st.dev/community/components/s/hero](https://21st.dev/community/components/s/hero) — hero sections
- Filter by category, style, framework, and popularity

**Magic MCP — generate custom components inside your editor:**
Magic is 21st.dev's AI-powered component generator that runs as an MCP server inside Cursor,
Windsurf, and VS Code (Cline). Install once, then describe what you need and get multiple
production-ready styled variants to choose from — TypeScript props, responsive Tailwind, Motion
animations included. No licensing restrictions on anything generated.

Install:
```bash
npx @21st-dev/magic@latest
# then add to Cursor: Settings → MCP → Add server → paste the npx command
```

In Cursor chat:
```
/ui Create a sidebar nav with icons, a GB stat next to each tab, and a theme toggle at the bottom
```

You get 2–4 variants. Pick one, paste it into your project, apply your design tokens.

**How 21st.dev + ui-ux-pro-max + Motion work together:**

The three tools form a pipeline. Use them in this order on every feature:

1. **ui-ux-pro-max** → run `--design-system --persist` → produces `design-system/MASTER.md`
   with your accent color, border radius, shadow scale, type scale, and motion curves.

2. **21st.dev** → browse the community gallery or use `/ui` in Cursor to find a component
   that matches your layout need. Copy it into your project.

3. **Apply your design tokens** → replace the component's placeholder colors, radii, and
   shadows with your CSS custom property tokens (`hsl(var(--accent))`, `var(--r-lg)`, etc.).

4. **Emil's motion review** → before shipping any interactive component, run it through
   the emil-design-eng checklist: ease-out enters, scale(0.96) not scale(0), named transition
   properties, 0.97 press feedback on buttons, correct transform-origin on popovers.

Result: a polished, on-brand, well-animated component in minutes instead of hours.

**Rule:** always check 21st.dev before building any component from scratch. Good match → copy
and adapt. No match → build using design-system + Emil principles from the start. Never
build from nothing without checking first.

### Step 1C — Apply Emil design engineering philosophy

Before any interactive component is built, consult `emil-design-eng`. It governs:

- **Easing**: always `ease-out` or a custom spring for things that enter. `ease-in` feels sluggish. Never `ease-in` for UI elements appearing.
- **Scale**: never animate from `scale(0)` — nothing in the real world appears from nothing. Use `scale(0.96)` + `opacity: 0`.
- **Specificity**: never `transition: all 300ms`. Always name the exact property: `transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms`.
- **Press feedback**: every button must have a `:active` state — `transform: scale(0.97)` — so it feels physically responsive.
- **Transform origin**: popovers and tooltips must use `transform-origin: var(--radix-popover-content-transform-origin)` so they expand from their trigger, not from a random corner.
- **Duration**: 150–250ms for UI responses (too slow reads as laggy; too fast reads as broken). 300–500ms for layout shifts and page transitions.
- **Invisible details compound**: users rarely notice each detail. That is the point. When many invisible details work together, the interface feels calm, fast, and intentional.

---

## Part 2 — Build stack

| Layer | Tool |
|---|---|
| Package manager | **pnpm** — workspace mode, always |
| Monorepo | **Turbo** — `turbo.json` at root |
| Primary frontend | **Vite + React + TypeScript** at `apps/web/` |
| Optional second surface | **Next.js static export** at `apps/web-next/` |
| Styling | **Tailwind CSS** + HSL design tokens |
| Animation | **Motion** (`motion/react`) — see the Motion rules below |
| Component primitives | **Radix UI** — Dialog, Tooltip, etc. |
| Icons | **Lucide React** |
| Backend | Python stdlib or Node — no runtime deps for serving |

### Workspace layout

```
my-app/
├── package.json            # root, devDeps: turbo
├── pnpm-workspace.yaml     # packages: ["apps/*"]
├── turbo.json              # build / dev / typecheck / lint
├── Makefile                # all 6 make targets
├── design-system/          # generated by ui-ux-pro-max
│   ├── MASTER.md
│   └── pages/
├── apps/
│   ├── web/                # @my-app/web — Vite app, canonical
│   └── web-next/           # @my-app/web-next — Next.js, optional
└── server.py (or server.js)
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build":     { "dependsOn": ["^build"], "inputs": ["src/**","*.config.*","tsconfig.json","index.html"], "outputs": ["dist/**","out/**",".next/**","!.next/cache/**"] },
    "dev":       { "cache": false, "persistent": true },
    "typecheck": { "dependsOn": ["^typecheck"], "inputs": ["src/**","*.config.*","tsconfig.json"] },
    "lint":      { "inputs": ["src/**",".eslintrc*","tsconfig.json"] }
  }
}
```

---

## Part 3 — Canonical Makefile targets

Every app ships with all six. No exceptions.

```
make ui          Vite build (~6s) + localhost + browser auto-opens
make ui-network  Same but 0.0.0.0 — shows Local + Network (LAN) URL
make ui-dev      pnpm turbo run dev (Vite :5174 + Next :5175 in parallel, HMR)
make ui-all      Full turbo build (Vite + Next) + serve
make ui-legacy   Serve vanilla HTML fallback — no build required
make ui-next     Build + serve Next.js static export only
```

Implementation pattern:

```makefile
ui: ## Vite build (~6s) + serve localhost + browser auto-opens
    @if command -v pnpm >/dev/null 2>&1; then \
        echo "▶ Building Vite UI…"; \
        pnpm install --silent && pnpm --filter @$(APP)/web build \
          && echo "✓ Built" \
          || echo "⚠ Build failed — serving stale dist if present."; \
    fi
    @python3 server.py

ui-network: ## Serve on all interfaces — reachable on Wi-Fi
    @pnpm install --silent && pnpm --filter @$(APP)/web build || true
    @XCC_HOST=0.0.0.0 python3 server.py
```

**Critical rule:** `make ui` must always rebuild before serving. A stale build is invisible bugs waiting to happen.

---

## Part 4 — Server startup: exact output format

Whatever language serves the backend, the startup output follows this format exactly.

**Default (localhost):**
```
  🧹  App Name

  URL        http://127.0.0.1:PORT
  Access     Localhost only (run 'make ui-network' to expose on Wi-Fi)

  N features  ·  Press Ctrl+C to stop.
```

**Network mode (0.0.0.0):**
```
  🧹  App Name

  Local      http://127.0.0.1:PORT
  Network    http://192.168.X.X:PORT  ← share with devices on your Wi-Fi

  ⚠  NETWORK MODE: anyone on your Wi-Fi can trigger actions in this app.
     Use on a trusted home network. Stop with Ctrl+C when done.

  N features  ·  Press Ctrl+C to stop.
```

### Server pattern (Python)

```python
import os, socket, threading, webbrowser
from typing import Optional

HOST = os.environ.get("APP_HOST", "127.0.0.1")

def _local_ip() -> Optional[str]:
    """Zero-packet UDP trick: OS picks the outbound interface, revealing LAN IP."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    except Exception:
        return None
    finally:
        try: s.close()
        except: pass

def main():
    # ... bind httpd ...
    local_url   = f"http://127.0.0.1:{port}"
    lan_ip      = _local_ip() if HOST == "0.0.0.0" else None
    network_url = f"http://{lan_ip}:{port}" if lan_ip else None

    print(f"\n  🧹  {APP_NAME}\n")
    if network_url:
        print(f"  {'Local':9}  {local_url}")
        print(f"  {'Network':9}  \033[1;32m{network_url}\033[0m  ← share with devices on your Wi-Fi")
        print(f"\n  ⚠  NETWORK MODE: anyone on your Wi-Fi can trigger actions.")
    else:
        print(f"  {'URL':9}  \033[1;36m{local_url}\033[0m")
        print(f"  Access     Localhost only (run 'make ui-network' to expose on Wi-Fi)")
    print(f"\n  {n_features}  ·  Press Ctrl+C to stop.\n")

    # Open browser 0.4s after serve_forever() so the socket is ready.
    if not os.environ.get("APP_NO_OPEN"):
        threading.Timer(0.4, lambda: webbrowser.open(local_url)).start()

    httpd.serve_forever()
```

---

## Part 5 — Motion / animation rules

These rules prevent the specific bugs that appeared in this app. Follow them on every project.

### What to do

- Use `motion/react` (`framer-motion`) for all meaningful transitions.
- Animate `opacity`, `transform` (scale/translate), and `height` for layout shifts.
- Use `ease-out` or spring for anything that enters: `ease: [0.22, 1, 0.36, 1]`.
- Keep enter durations at 150–220ms. Exit can be faster (120–180ms).
- Give every interactive element press feedback: `whileTap={{ scale: 0.97 }}`.
- Use `AnimatePresence` with `initial={false}` on list items so they don't all animate in on first mount.

### What to never do

| Never | Instead | Why |
|---|---|---|
| `<AnimatePresence mode="wait">` wrapping the main panel switch | `<div key={tab}>` (instant) | Motion can freeze the wrapper at `opacity: 0` during initial render; the whole page disappears |
| `transition: all 300ms` in CSS | `transition: opacity 180ms ease-out, transform 180ms ease-out` | `all` catches properties you didn't intend, causes repaints |
| `initial={{ scale: 0 }}` | `initial={{ scale: 0.96, opacity: 0 }}` | Nothing in the real world appears from nothing |
| `ease-in` on a modal or dropdown | `ease-out` or spring | `ease-in` starts slow, reads as laggy on UI elements |
| `animate={{ opacity: 1 }}` with no `initial` | Set `initial` explicitly | Motion infers initial from the component tree, which can produce unexpected flashes |

### Motion card patterns (use these)

```tsx
// Modal entrance
initial={{ opacity: 0, scale: 0.96, y: 6 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.96, y: 6 }}
transition={{ duration: 0.22, ease: [0.34, 1.56, 0.64, 1] }}

// List item stagger
initial={{ opacity: 0, y: 4 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.025, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}

// Sidebar panel tab switch (instant — no AnimatePresence wrapper)
<div key={activeTab}>…</div>

// Button press
whileTap={{ scale: 0.97 }}
transition={{ duration: 0.1 }}
```

---

## Part 6 — UX layout rules

These are non-negotiable. Every one of them was learned from a real bug in production.

### Modals — always centered

Use `Dialog.Overlay` as the flex container. Never position `Dialog.Content` with `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` — that pattern drifts under Radix's own transform stack.

```tsx
// ✅ Correct — Overlay is the flex container
<Dialog.Overlay className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 backdrop-blur-md" style={{ background: "hsl(240 5% 4% / 0.55)" }}>
  <Dialog.Content className="w-full max-w-[520px] rounded-xl border border-border/20 bg-bg-1 shadow-lg overflow-hidden">
    {/* content */}
  </Dialog.Content>
</Dialog.Overlay>

// ❌ Wrong — Content positions itself; drifts under Radix transforms
<Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ...">
```

Apply this to every modal in every app: confirm dialogs, changelog, settings, alerts — all of them.

### Responsive layout — three breakpoints, never two

```
< md (768px)     → 1 column: sidebar stacks above main, scrolls normally
md to lg         → 2 columns: sidebar left, main fills right  ← NEVER SKIP THIS
lg+ (1024px+)    → 2 or 3 columns: add right sidebar when subcategories exist
```

In Tailwind:
```tsx
className={cn(
  "grid items-start gap-4",
  "md:grid-cols-[220px_1fr]",       // ← 768px+ gets sidebar + main
  hasSub && "lg:grid-cols-[220px_1fr_220px]",
)}
```

Skipping the `md:` breakpoint causes the sidebar to take the full viewport width below 1024px, making the main panel invisible below the fold. This is the exact bug that appeared in this app.

### Terminal / output pane — always fixed height

Output panes must never grow with their content. Set a hard cap and let them scroll internally.

```tsx
// React
<div className="overflow-y-auto font-mono text-[12px]" style={{ maxHeight: 320, minHeight: 180 }}>

// CSS
.terminal-body { max-height: 320px; overflow-y: auto; min-height: 180px; }
```

### Theme toggle — bottom of left sidebar

Three-state segmented control (Auto / Light / Dark) pinned below the nav list.

- Applies `document.documentElement.dataset.theme = "light" | "dark"` (removed = Auto)
- Persists to `localStorage.{appId}.theme.v{major}`
- Pre-paint inline `<script>` in `index.html` applies the saved theme before React mounts — no flash

```html
<script>
  (function() {
    try {
      var v = localStorage.getItem("{appId}.theme.v1");
      if (v === "light" || v === "dark") document.documentElement.setAttribute("data-theme", v);
    } catch(e) {}
  })();
</script>
```

### Sidebar GB stats — show total footprint

Each sidebar tab shows `safe + opt-in + caution` (total footprint), not just `cleanable` (safe + opt-in). Tabs with heavy caution-tier content (e.g. Docker.raw) would otherwise show blank — which looks broken even when the data is there.

---

## Part 7 — Design tokens

Define these as HSL CSS custom properties so light, dark, and any future theme override all "just work" without touching component code.

```css
:root {
  /* Surfaces */
  --bg-1: 0 0% 100%;        --bg-2: 0 0% 98%;         --bg-3: 0 0% 95%;
  /* Text */
  --fg: 240 6% 10%;         --fg-dim: 240 4% 35%;     --fg-faint: 240 4% 55%;
  /* Structure */
  --border: 240 6% 88%;
  /* Brand accent — teal by default */
  --accent: 175 60% 40%;    --accent-strong: 175 65% 32%;   --accent-soft: 175 50% 92%;
  /* Semantic tiers */
  --safe: 152 50% 38%;      --warn: 43 96% 56%;       --danger: 0 84% 60%;
}

[data-theme="dark"] {
  --bg-1: 240 5% 4%;        --bg-2: 240 4% 9%;        --bg-3: 240 4% 14%;
  --fg: 60 9% 95%;          --fg-dim: 240 5% 62%;     --fg-faint: 240 4% 42%;
  --border: 240 5% 22%;
  --accent: 173 80% 50%;    --accent-strong: 173 75% 65%;
  --safe: 142 71% 45%;      --warn: 43 96% 56%;       --danger: 0 84% 60%;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not([data-theme="dark"]) {
    /* mirror the [data-theme="dark"] block */
  }
}
```

Tailwind config:
```ts
colors: {
  bg: { 1: "hsl(var(--bg-1))", 2: "hsl(var(--bg-2))", 3: "hsl(var(--bg-3))" },
  fg: { DEFAULT: "hsl(var(--fg))", dim: "hsl(var(--fg-dim))", faint: "hsl(var(--fg-faint))" },
  accent: { DEFAULT: "hsl(var(--accent))", strong: "hsl(var(--accent-strong))" },
  safe: "hsl(var(--safe))", warn: "hsl(var(--warn))", danger: "hsl(var(--danger))",
}
```

---

## Part 8 — The "done" definition

A feature or screen is not done until it passes all of these:

- [ ] Modals open centered — horizontally and vertically — at every viewport width
- [ ] Sidebar shows on the left at ≥ 768px; stacks on top only below 768px
- [ ] Output/terminal panes have a fixed max-height and scroll internally
- [ ] Theme toggle (Auto/Light/Dark) is present, persistent, and flash-free
- [ ] Browser auto-opens when `make ui` runs
- [ ] `make ui-network` exposes on Wi-Fi and prints the LAN URL
- [ ] All animations use `ease-out` or spring curves; nothing uses `ease-in` for UI entry
- [ ] No component freezes at `opacity: 0` — test by observing the page after load
- [ ] Copyright footer: `© 2026 Learn Mappers LLC DBA AVERY GOODMAN · All rights reserved · Intellectual property · UCC 1-308`
- [ ] TypeScript strict-mode passes (`pnpm typecheck`) with no errors
- [ ] `make ui` and `make ui-network` both work from a cold clone

---

## Part 9 — Scaffolding a new app from scratch

1. `mkdir my-app && cd my-app && git init`
2. Create `package.json` (name, private: true, devDeps: turbo, scripts: build/dev/typecheck)
3. Create `pnpm-workspace.yaml` (`packages: ["apps/*"]`)
4. Create `turbo.json` from the template in Part 2
5. **Run ui-ux-pro-max** → `--design-system --persist` → `design-system/MASTER.md`
6. **Install Magic MCP** (`npx @21st-dev/magic@latest`) in Cursor — ready for `/ui` prompts
7. `pnpm create vite apps/web -- --template react-ts`
8. Rename package to `@my-app/web`, wire Tailwind + the design tokens from Part 7
9. Build components: check 21st.dev first, copy + adapt, then apply design tokens + Emil checklist
10. Write `server.py` using the startup pattern from Part 4
11. Write `Makefile` with all 6 targets from Part 3
12. Add pre-paint theme script to `apps/web/index.html`
13. Implement theme toggle, modal centering pattern, sidebar responsive grid, terminal max-height
14. `pnpm install && make ui` — browser opens, startup message appears, dashboard is ready
15. Verify against the "done" checklist in Part 8 before calling it shipped

---

## Part 10 — What not to do

- `yarn` or `npm` — use pnpm
- `AnimatePresence mode="wait"` wrapping the main panel switch — use `<div key={tab}>`
- `fixed left-1/2 top-1/2` on Radix Dialog.Content — use a flex-centered Overlay
- `transition: all` in CSS — name exact properties
- `ease-in` for UI elements entering — use ease-out
- `maxHeight: undefined` on output panes — always set a hard cap
- Starting to code before running ui-ux-pro-max — design system comes first
- Skipping the `md:grid-cols-[sidebar_1fr]` breakpoint — always include 768px
- Committing `node_modules/`, `dist/`, `out/`, `.next/`, `.turbo/`

---

## References

### Design tools (use all three on every feature — in this order)

- **ui-ux-pro-max** — design system generator, colors/typography/spacing/motion  
  Run `--design-system --persist` before any component. Produces `design-system/MASTER.md`.  
  `skills/visual/design/ui-ux-pro-max/`

- **21st.dev** — community component library + Magic MCP component generator  
  Browse: https://21st.dev/community  
  Hero sections: https://21st.dev/community/components/s/hero  
  Magic MCP (Cursor/Windsurf/VSCode): `npx @21st-dev/magic@latest` then `/ui describe what you need`  
  Check here before building any component from scratch.

- **emil-design-eng** — animation and interaction quality (ease-out, scale(0.96), press feedback)  
  Run through this checklist before shipping any interactive component.  
  `skills/visual/design/emil-design-eng/`

### Project rules

- **learn-mappers-copyright** — copyright footer (AVERY GOODMAN all-caps, UCC 1-308)  
  `rules/library/learn-mappers-copyright/`
- **changelog-and-versioning** — version numbering, CHANGELOG format, auto-release tagging  
  `rules/library/changelog-and-versioning/`
- **dev-discipline** — session opener/closer, git discipline  
  `rules/library/dev-discipline/`
