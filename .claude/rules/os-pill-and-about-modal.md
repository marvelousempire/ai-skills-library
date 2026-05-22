---
name: os-pill-and-about-modal
id: RL-0063
keywords: [enforce-os-pill, check-about-modal, build-platform-indicator, apple-about-this-mac]
goal: Every operator app surface must carry a top-left OS pill (platform + version + health LED + click-for-about) that opens a modal in the visual model of Apple "About This Mac".
hash: pending
relations: [operator-control-tower-mindset, live-dashboard-pattern, contracts-and-prudence]
before: []
governed_by: [global]
meta: dynamic
---

# OS pill + About modal — every operator app, top-left, every time

## The verbatim source (stated by Avery 2026-05-22)

> Apple Scripps when necessary whenever we are Apple we need to have a
> little in the top left a little indication that says we will macOS says
> which operating system on what we're Linux he says it will Linux and
> what thing of Lenoxville are you doing to it also says the version
> number it also has an LED that shows the status red yellow green red
> being not working dreaming good yellow needs working with issues. If I
> tap that Modell comes up gives us full details about the change lullaby
> version about this just like the Apple when you choose about this app
> same thing.

## The rule

Every operator app surface in this stack (Nephew CT, DustPan, Clinic,
Historia, Automata Pad, every native CT agent card, every future operator
UI) MUST display a top-left **OS pill** that surfaces three things at a
glance and one thing on click:

### At a glance — the pill

1. **Platform label.** "macOS 14.5" / "Ubuntu 22.04 LTS" / "Debian 12
   Bookworm" / "Fedora 40" / "Windows 11" — read live from the agent's
   `/api/v1/about` endpoint, never hardcoded.
2. **Family glyph.** `` for macOS, `🐧` for Linux, `⊞` for Windows, `⚙`
   for WSL — so the operator's eye can flick to it without reading the
   label.
3. **Health LED.** A small colored dot, color-coded:
   - 🟢 **green** — all systems nominal
   - 🟡 **amber** — working but has warnings (high disk %, a non-critical
     error, an SMART warning, etc.) — pulses slowly
   - 🔴 **red** — backend down OR critical error
   - ⚪ **gray** — status unknown / not yet probed

### On click — the modal

The modal is the visual model of Apple's `` → **About This Mac** panel,
with parity expectations:

- **Hero row**: app icon (42–56px) on the left, app name in bold, version
  + build under it (e.g. "Version 0.37.2 (cffd7f5)"), author byline.
- **Spec table** (label / value, monospace values):
  - Operating System
  - Architecture
  - Kernel
  - Backend (e.g. "Python 3.9 · :8765")
  - Uptime
  - Memory in use
  - Status (LED + label + optional one-line note)
  - Any agent-specific `extras` rows
- **Action row** at the bottom: at minimum a Close/OK button. Other
  buttons (System Report, Software Update, View Logs) are allowed but
  must mirror Apple's modal shape — bottom-right, secondary styling.

## Use the canonical primitives — do not roll your own

The Nephew repo ships these primitives at
`apps/control-tower/src/lib/os-chrome.tsx`:

| Primitive | Purpose |
|-----------|---------|
| `<OSPill info onClick />` | The pill itself — platform + glyph + LED + chevron, click-anywhere |
| `<AboutModal info open onClose />` | The Apple About-This-Mac modal — hero + spec table + action row |
| `<OSChrome info />` | Convenience composite — pill + modal, single import for agent pages |

The shape `info: AboutInfo` carries:

```ts
{ app, version, by?, icon?, os, family?, arch?, kernel?, backend?,
  uptime?, memory?, status, statusNote?, extras? }
```

Agents populate this from their `/api/v1/about` endpoint (see "Backend
contract" below).

If you find yourself rendering a custom platform indicator, a hand-rolled
About modal, or hardcoding the OS string anywhere in an operator app,
STOP — import the primitive and add a missing field to `AboutInfo`
instead.

## Backend contract — every agent exposes /api/v1/about

Every operator app that has an HTTP backend MUST expose `GET /api/v1/about`
returning the JSON shape `AboutInfo` (or a superset). The reference
implementation is DustPan: `web/server.py` `_build_about()` →
`/api/v1/about`. Fields are populated from:

- `os` — `platform.mac_ver()` on macOS, `/etc/os-release` on Linux,
  `platform.release()` on Windows
- `family` — derived from `platform.system()`
- `arch` — `platform.machine()`
- `kernel` — `platform.platform()`
- `backend` — `f"Python {platform.python_version()} · :{PORT}"` (or the
  appropriate runtime)
- `uptime` — `time.time() - SERVER_START_TIME` formatted as "Hh Mm"
- `memory` — `resource.getrusage(resource.RUSAGE_SELF).ru_maxrss` (stdlib
  only — note macOS reports bytes, Linux reports KB)
- `version` — read from `package.json` or equivalent — single source of
  truth, never hardcoded twice
- `status` — for v1: `"healthy"` if the server is responding (the fact
  that the endpoint returned implies up); compute richer states in the
  client by combining `/api/v1/about` with the agent's domain endpoints
  (e.g. DustPan's disks payload — any disk > 90% = warning)

The CT frontend polls this endpoint via `useLivePoll` at 30s intervals
(slow data — OS doesn't change between polls; uptime increments naturally
through the AnimatedNumber tween).

## When this fires

- Building a new operator app surface (Nephew CT page, DustPan tab,
  Clinic panel, Historia view, native CT agent card)
- Adding any "About This App" surface to any operator app
- Reviewing a PR that introduces a new top-level UI route in any operator
  repo

## When this does NOT fire

- Embedded iframes of third-party apps that we don't own (Portainer,
  n8n, Uptime Kuma, etc.) — they have their own chrome. The OSPill goes
  in CT's host page wrapping the iframe, not inside the iframe.
- The modal action row's contents (System Report, Software Update, etc.)
  are app-specific — only the pill + modal shape is mandatory.

## Examples

### ✓ Compliant — DustPan summary card (`nephew/apps/control-tower/src/pages/DustpanSummaryPage.tsx`)

- Renders `<OSChrome info={aboutInfo} />` above the existing Topbar
- `aboutInfo` populated from `useLivePoll` against `/api/agents/dustpan/v1/about`
- Composite health computed locally: `down` if backend errored, `warning`
  if any disk > 90%, else `healthy`
- Backend at `dustpan/web/server.py` `_build_about()` returns the
  AboutInfo shape

### ✗ Violation — a page that shows the platform as plain text

```jsx
<header>
  <p>Running on macOS</p>      {/* hardcoded — no LED, not the pill */}
  <h1>Page Title</h1>
</header>
```

No pill, no LED, no modal-on-click, the OS string will lie when the
operator's other machine runs it.

## Propagation

Per [`rule-propagation-discipline`](rule-propagation-discipline.md), this
rule is mirrored to every operator-built repo and the AI Skills Library.

## Related

- **Code (canonical):** [`apps/control-tower/src/lib/os-chrome.tsx`](../../apps/control-tower/src/lib/os-chrome.tsx) — the primitives
- **Reference impl:** [`apps/control-tower/src/pages/DustpanSummaryPage.tsx`](../../apps/control-tower/src/pages/DustpanSummaryPage.tsx)
- **Backend reference:** [`dustpan/web/server.py`](../../../dustpan/web/server.py) — `_build_about()` and the `/api/v1/about` route
- **Mindset node:** [`operator-control-tower-mindset`](operator-control-tower-mindset.md) — node 2 (precedent citation: Apple's About This Mac) and node 9 (honest disclosures: the LED tells the truth)
- **Sibling rule:** [`live-dashboard-pattern`](live-dashboard-pattern.md) — the about endpoint is polled by `useLivePoll`, the LED uses the same color band as the dashboard primitives
