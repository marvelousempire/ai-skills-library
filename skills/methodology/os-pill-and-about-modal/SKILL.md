---
name: os-pill-and-about-modal
id: pending
keywords: [os-pill, about-modal, about-this-mac, platform-indicator, health-led, top-left-chrome]
goal: Every operator app surface carries a top-left OS pill (platform + version + health LED) that opens an Apple "About This Mac"-style modal on click.
hash: pending
relations: [aesthetic-consistency, live-dashboard-pattern, operator-control-tower-mindset]
before: []
governed_by: [global]
meta: dynamic
description: Triggers on "about modal", "OS pill", "platform indicator", "About This Mac", "top-left chrome", "health LED", "version chip", "what version am I running", "which OS / distro is this", "Apple about panel parallel", or any prompt about building the operator-app top-left platform indicator.
---

# os-pill-and-about-modal — methodology skill

Every operator app surface (Nephew CT, DustPan, Clinic, Historia, Automata
Pad, every native CT agent card) carries a top-left **OS pill** + **About
modal** so the operator can see at a glance: which platform am I on, is
this thing healthy, and one click away — full version + arch + uptime +
memory like Apple's About This Mac.

## When to use

Triggers: any prompt about building or upgrading an operator app's
top-level chrome — "about modal", "OS pill", "platform indicator", "what
version am I running", "Apple about panel parallel".

## The rule

The pill carries: platform label (read live from `/api/v1/about`), family
glyph (` 🐧 ⊞ ⚙`), health LED (🟢 healthy / 🟡 warning / 🔴 down).

Click → modal in the visual model of Apple → About This Mac: hero (app
icon + name + version + byline) → spec table (OS, arch, kernel, backend,
uptime, memory, status) → action row (OK + agent-specific buttons).

Canonical primitives: `nephew/apps/control-tower/src/lib/os-chrome.tsx`
exports `<OSPill>`, `<AboutModal>`, `<OSChrome>` (composite). Backend
contract: every operator app exposes `GET /api/v1/about` returning the
`AboutInfo` JSON shape. Reference impl: DustPan's `web/server.py`
`_build_about()`.

## How

1. Import `OSChrome` from `live-dashboard.tsx`'s sibling `os-chrome.tsx`.
2. Add `GET /api/v1/about` to your agent's backend — see DustPan reference.
3. Use `useLivePoll` on `/api/v1/about` at 30s.
4. Render `<OSChrome info={aboutInfo} />` at the top-left of the page.
5. Compute composite health locally if your app has signals the backend
   doesn't (e.g. CT computes "warning" when any disk > 90%).

## Why this exists

Codified from the 2026-05-22 Nephew Control Tower session. The operator's
verbatim trigger names Apple's "About This Mac" as the precedent and asks
for the same modal layout on every operator app, with a top-left pill
carrying the LED.

Per the [operator-control-tower-mindset] node 2 (precedent citation),
naming the precedent IS the design decision — "Apple About This Mac"
tells every future agent what the modal should look and feel like
without re-deriving it from prose.

## Pairing

- **Sibling:** [live-dashboard-pattern] — the about endpoint is polled by
  `useLivePoll`, the LED uses the same color band as live dashboard meters
- **Mindset:** [operator-control-tower-mindset] — this is node 2 + node 9
  applied to top-level chrome
- **Visual sibling:** [aesthetic-consistency] — defines the dark-mode +
  monospace + ascii language the pill + modal inherit

## Reference impls

- Frontend (primitives): `nephew/apps/control-tower/src/lib/os-chrome.tsx`
- Frontend (consumer): `nephew/apps/control-tower/src/pages/DustpanSummaryPage.tsx`
- Backend: `dustpan/web/server.py` `_build_about()` + `/api/v1/about`
- Rule: `nephew/.claude/rules/os-pill-and-about-modal.md`
