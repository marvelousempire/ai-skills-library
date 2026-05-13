# App Launch Workflow — Learn Mappers LLC

Every app we ship follows this exact workflow. When building, scaffolding, or maintaining any app:
implement this pattern end-to-end without being asked. This is the canonical way we make apps.

---

## 1. The one-liner that launches every app

```sh
git pull && pnpm install && make ui
```

That's it. It rebuilds, opens the browser automatically, and the terminal tells you everything.
The same command works on day 1, day 100, after any teammate pulls, and on any machine with pnpm.

```sh
make ui-network   # same but reachable on Wi-Fi → iPad, phone, other laptop
```

---

## 2. Build stack

| Layer | Tool | Notes |
|---|---|---|
| Package manager | **pnpm** | workspace mode — never npm or yarn |
| Monorepo orchestration | **Turbo** | `turbo.json` at repo root |
| Primary frontend | **Vite + React + TypeScript** | `apps/web/` |
| Optional second frontend | **Next.js** | `apps/web-next/`, static export |
| Styling | **Tailwind CSS** | design tokens via HSL CSS custom properties |
| Animation | **Motion** (`motion/react`) | component-level only — never in AnimatePresence mode="wait" at the panel switch level |
| Component primitives | **Radix UI** | Dialog, Tooltip, etc. |
| Backend | **Python stdlib** or **Node** | no pip/npm runtime deps for serving |
| Icons | **Lucide React** | |

### Workspace layout

```
my-app/
├── package.json          ← root workspace, devDeps: turbo
├── pnpm-workspace.yaml   ← packages: ["apps/*"]
├── turbo.json            ← pipelines: build / dev / typecheck / lint
├── Makefile              ← canonical make targets
├── apps/
│   ├── web/              ← @my-app/web  (Vite + React, canonical UI)
│   └── web-next/         ← @my-app/web-next  (Next.js, optional)
└── server.py (or server.js)
```

### `turbo.json` template

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "public/**", "*.config.*", "tsconfig.json", "package.json", "index.html"],
      "outputs": ["dist/**", "out/**", ".next/**", "!.next/cache/**"]
    },
    "dev":       { "cache": false, "persistent": true },
    "typecheck": { "dependsOn": ["^typecheck"], "inputs": ["src/**", "*.config.*", "tsconfig.json"] },
    "lint":      { "inputs": ["src/**", ".eslintrc*", "tsconfig.json"] }
  }
}
```

---

## 3. Canonical Makefile targets

Every app has ALL of these in its Makefile. No exceptions.

```makefile
# --- UI targets -------------------------------------------------------
ui:          ## Build Vite app (~6s) + serve localhost + auto-open browser
ui-network:  ## Same but binds 0.0.0.0 — share on Wi-Fi; shows LAN URL
ui-dev:      ## pnpm turbo run dev  (Vite HMR + Next HMR in parallel)
ui-all:      ## pnpm turbo run build (Vite + Next) + serve
ui-legacy:   ## Serve vanilla HTML fallback, no build
ui-next:     ## Build + serve Next.js static export only
```

### `make ui` implementation pattern

```makefile
ui: ## Build Vite app (~6s) + serve localhost + auto-open browser
    @if command -v pnpm >/dev/null 2>&1; then \
        echo "▶ Building Vite UI (apps/web)…"; \
        pnpm install --silent && pnpm --filter @$(APP_NAME)/web build \
          && echo "✓ Built — serving" \
          || echo "⚠ Build failed — falling back to whatever's on disk."; \
    fi
    @python3 server.py          # or: node server.js

ui-network: ## Serve on all interfaces — reachable on Wi-Fi
    @if command -v pnpm >/dev/null 2>&1; then \
        pnpm install --silent && pnpm --filter @$(APP_NAME)/web build || true; \
    fi
    @XCC_HOST=0.0.0.0 python3 server.py
```

**Rule:** `make ui` MUST rebuild the primary frontend before serving. Never just start the server against a stale build — that's how you get "nothing works and I don't know why."

---

## 4. Server startup pattern — exact output format

Whatever language the backend is written in, the startup message must follow this format:

```
  🧹  App Name

  Local      http://127.0.0.1:PORT
  Network    http://192.168.X.X:PORT  ← share with devices on your Wi-Fi  (network mode only)

  ⚠  NETWORK MODE: anyone on your Wi-Fi can use this app.           (network mode only)
     Stop with Ctrl+C when done.

  N features/actions/routes  ·  Press Ctrl+C to stop.
```

In default localhost mode:

```
  🧹  App Name

  URL        http://127.0.0.1:PORT
  Access     Localhost only (run 'make ui-network' to expose on Wi-Fi)

  N features  ·  Press Ctrl+C to stop.
```

### Server auto-open pattern (Python)

```python
import os, socket, threading, webbrowser
from typing import Optional

HOST = os.environ.get("APP_HOST", "127.0.0.1")

def _local_ip() -> Optional[str]:
    """Detect the machine's primary LAN IP via a zero-packet UDP socket."""
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
    # ... bind server ...
    local_url   = f"http://127.0.0.1:{port}"
    network_url = f"http://{_local_ip()}:{port}" if HOST == "0.0.0.0" else None

    print(f"\n  🧹  {APP_NAME}\n")
    if network_url:
        print(f"  {'Local':9}  {local_url}")
        print(f"  {'Network':9}  \033[1;32m{network_url}\033[0m  ← share with devices on your Wi-Fi")
        print(f"\n  ⚠  NETWORK MODE: anyone on your Wi-Fi can use this app.")
    else:
        print(f"  {'URL':9}  \033[1;36m{local_url}\033[0m")
        print(f"  Access     Localhost only (run 'make ui-network' to expose on Wi-Fi)")
    print(f"\n  {n_features}  ·  Press Ctrl+C to stop.\n")

    # Open browser 400ms after serve_forever() starts — avoids race condition.
    if not os.environ.get("APP_NO_OPEN"):
        threading.Timer(0.4, lambda: webbrowser.open(local_url)).start()

    httpd.serve_forever()
```

---

## 5. React/Vite UX conventions

These apply to every web app we build. Implement them by default.

### Theme toggle (Auto / Light / Dark)
- Three-state segmented control pinned to the **bottom of the left sidebar**
- State: `document.documentElement.dataset.theme = "light" | "dark"` (removed = auto)
- Persists to `localStorage` under `{appId}.theme.v{major}`
- Pre-paint inline `<script>` in `index.html` applies saved theme before React mounts — **no flash**
- CSS uses `[data-theme="dark"]` explicit selector + `@media prefers-color-scheme: dark :root:not([data-theme])` for auto

### Modal centering (Radix Dialog)
- **Always** use `Dialog.Overlay` as the flex container: `className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 backdrop-blur-md"`
- `Dialog.Content` is a child of the Overlay — it auto-centers
- **Never** use `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` on Dialog.Content — this drifts under Radix's own transform stack

```tsx
<Dialog.Overlay asChild>
  <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 backdrop-blur-md" ...>
    <Dialog.Content asChild>
      <motion.div className="w-full max-w-[560px] rounded-xl border bg-bg-1 shadow-lg overflow-hidden" ...>
        {/* content */}
      </motion.div>
    </Dialog.Content>
  </motion.div>
</Dialog.Overlay>
```

### Activity terminal / output pane
- Always a **fixed max-height** (320px) with `overflow-y: auto` — never grows with content
- Auto-scrolls to the latest line
- Idle state: italic gray placeholder text
- Toolbar: filter input (Ctrl+F / Cmd+F) + Clear button above the terminal body

### Panel switch (AnimatePresence)
- **Do not** use `<AnimatePresence mode="wait"><motion.div key={tab}>` as the outer panel switch wrapper — it can freeze at opacity:0 under certain Motion + React conditions
- Instead use a plain `<div key={tab}>` for the panel switch; animate INSIDE individual panels that know when they mount

### Sidebar layout
- Left nav: sticky, `sticky top-5 self-start`
- Tab buttons: teal left-border + teal accent when active
- Per-tab GB stat: shows `safe + opt-in + caution` (total footprint, NOT just cleanable)
- Mini-donuts next to GB stat: green / amber / red stroke arcs per tier
- Theme toggle: below tabs, separated by a border-top

### Responsive breakpoints
```
< md (768px)    → 1 column (sidebar stacks on top)
md to lg        → 2 columns (sidebar + main)   ← do NOT skip this
lg+ (1024px+)   → 2 or 3 columns (+ right sidebar when subcategories exist)
```

---

## 6. Design tokens

Use HSL CSS custom properties so light/dark/theme-override all "just work":

```css
:root {
  --bg-1: 0 0% 100%;    --bg-2: 0 0% 98%;    --bg-3: 0 0% 95%;
  --fg: 240 6% 10%;     --fg-dim: 240 4% 35%; --fg-faint: 240 4% 55%;
  --border: 240 6% 88%;
  --accent: 175 60% 40%;   --accent-strong: 175 65% 32%;
  --safe: 152 50% 38%;     --warn: 43 96% 56%;    --danger: 0 84% 60%;
}
[data-theme="dark"] {
  --bg-1: 240 5% 4%;    --bg-2: 240 4% 9%;   --bg-3: 240 4% 14%;
  --fg: 60 9% 95%;      --fg-dim: 240 5% 62%; --fg-faint: 240 4% 42%;
  --accent: 173 80% 50%;
  /* safe / warn / danger shift to their dark-mode versions */
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not([data-theme="dark"]) {
    /* mirror the [data-theme="dark"] block here */
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

## 7. Copyright footer

Every app ships with this exact footer line (per the `learn-mappers-copyright` rule):

```
© 2026 Learn Mappers LLC DBA AVERY GOODMAN · All rights reserved · Intellectual property · UCC 1-308
```

---

## 8. Versioning + release tagging

- Patch fixes: `v0.X.Y` — single PR, auto-release-tagged on merge
- Features: minor bump `v0.(X+1).0`
- CHANGELOG: header format `## [0.X.Y] — YYYY-MM-DD HH:MM:SS Eastern · *short summary*`
- Every merge auto-tags + auto-publishes a GitHub release (via workflow)
- `kVersion` (or equivalent) in the server matches the CHANGELOG top entry

---

## 9. .gitignore entries every project needs

```gitignore
node_modules/
apps/*/node_modules/
apps/*/dist/
apps/*/out/
apps/*/.next/
.turbo/
*.local
.env
```

---

## 10. How to scaffold a new app using this workflow

1. `mkdir my-app && cd my-app && git init`
2. Create root `package.json` (name, private:true, scripts: build/dev/typecheck, devDeps: turbo)
3. Create `pnpm-workspace.yaml` (packages: `["apps/*"]`)
4. Create `turbo.json` from the template above
5. `mkdir apps && pnpm create vite apps/web -- --template react-ts`
6. Rename package in `apps/web/package.json` to `@my-app/web`
7. Wire Tailwind + the design tokens
8. Write `server.py` (or `server.js`) using the startup pattern above
9. Write `Makefile` with all the canonical targets
10. Add `.gitignore` entries
11. `pnpm install && make ui` — browser opens, server shows the clean startup message
12. Done. Every future `git pull && pnpm install && make ui` works identically.

---

## Do not

- Use `create-react-app` (dead), `yarn`, or `npm` (use pnpm)
- Use `fixed left-1/2 top-1/2` centering on Radix Dialog.Content
- Use `AnimatePresence mode="wait"` wrapping the main panel switch
- Let the terminal / output pane grow unbounded (always set `max-height: 320px`)
- Skip the `make ui-network` target
- Hardcode localhost in the LAN IP display — always detect dynamically
- Commit `node_modules/`, `dist/`, `out/`, `.next/`

