# PROMPT — give this folder to any AI to build a live dashboard

This is the verbatim prompt the operator (Avery Goodman) hands to any
AI when they want a live dashboard card built somewhere new.

---

## The prompt

> Build me a native live dashboard card in this repo, following the
> recipe at `ai-skills-library/skills/methodology/live-dashboard-pattern/`.
>
> Start by reading `CHECKLIST.md` in that folder, then follow it stage
> by stage. The card must auto-poll its data, tween numbers via
> requestAnimationFrame, transition meter bars via CSS, carry sparkline
> history from a client-side ring buffer, show a live pulse dot in the
> topbar, and degrade gracefully if the backend is down.
>
> Use the canonical primitives from the **`@nephew/live-dashboard`**
> package (workspace at `~/Developer/nephew/packages/live-dashboard/`).
> Install it with `pnpm add @nephew/live-dashboard` (or `workspace:*`
> if your repo is in the Nephew monorepo). Do NOT copy the files unless
> the install path is blocked.
>
> Imports look like:
>   `import { useLivePoll, AnimatedNumber, MeterBar, Sparkline, LiveDot,
>    LiveTile, OSChrome, type AboutInfo } from "@nephew/live-dashboard";`
>
> Carry the top-left OS pill + Apple "About This Mac"-precedent modal
> via `<OSChrome>` from the same package.
>
> Bump the repo version + add a CHANGELOG entry per the
> `version-bump-and-changelog` rule (mirrored in this repo's
> `.claude/rules/` already).
>
> Reference impl I want to match the feel of:
> http://localhost:5175/dustpan (disks) and
> http://localhost:5175/dustpan/processes (processes).

---

## Why this prompt works

- **Single path.** The receiving AI opens one folder and finds:
  CHECKLIST.md (order of operations), SKILL.md (contract), starter/
  (primitives to copy), examples/ (worked references).
- **Verbatim references.** Every "build X" instruction names the
  canonical file to copy from. No re-derivation, no creative
  interpretation.
- **Rules already mirrored.** The rule-propagation-discipline rollout
  ensures the receiving repo already has the behavioral rules in
  `.claude/rules/` and `.cursor/rules/`.
- **Done criterion.** The end of CHECKLIST.md states what success
  looks like — the next AI session can ship from this folder alone.

## Success criteria for the fill-in

When the receiving AI is done, the following must be true:

1. **Speed.** Open the new card in a browser, first paint < 100ms,
   first data 50–300ms after that, polling fires every 2.5s for fast
   data (3s default if the agent didn't override `intervalMs`).
2. **Motion.** Numeric values tween via easeOutCubic (~700ms). Meter
   bar widths transition via CSS. Sparklines populate from a
   client-side ring buffer (default 60 samples).
3. **Liveness.** A `<LiveDot>` pulses in the topbar; tooltip shows
   "last update Ns ago".
4. **Graceful degradation.** Backend down → page shows the exact
   recovery command + keeps polling silently. Backend returns → page
   auto-recovers.
5. **Apple-precedent chrome.** Top-left `<OSPill>` with platform label
   + family glyph + health LED; click → `<AboutModal>` with hero +
   spec table + action row.
6. **No third-party charting / animation / state libraries.** Six
   primitives + React + Tailwind + browser APIs. That's it.

## Anti-patterns to forbid in the fill-in

Reject the fill-in if the receiving AI:

- Pulls in `framer-motion`, `recharts`, `react-spring`, `swr`,
  `tanstack-query`, `axios`, or anything else that duplicates what the
  six primitives already do.
- Writes inline `setInterval` / `setTimeout` for polling — must use
  `useLivePoll`.
- Writes inline `requestAnimationFrame` for number tweens — must use
  `<AnimatedNumber>`.
- Sets `style={{width: ...}}` directly on a meter — must use
  `<MeterBar>` with the CSS transition.
- Hardcodes the OS string anywhere — must come from
  `/api/v1/about` via `<OSChrome>`.
- Skips the version bump or CHANGELOG entry.

## How to extend

If the operator's next ask is a NEW dashboard type that the six
primitives don't quite cover (a heatmap, a treemap, a topology graph),
the right move is to ADD a seventh primitive to
`nephew/apps/control-tower/src/lib/live-dashboard.tsx` and propagate
the addition through the recipe folder.

Do NOT introduce a one-off primitive inside the consumer page. The
shared library is canonical.

## One-line version

> "Read `ai-skills-library/skills/methodology/live-dashboard-pattern/CHECKLIST.md`
> and ship a live dashboard card for [DOMAIN] following it."

The receiving AI takes it from there.
