# Operator Control Tower Pad — psychological report

**Subject:** Avery Goodman / Learn Mappers stack
**Project:** Automata Pad (one of multiple surfaces in his control tower)
**Period observed:** 2026-05-21 → 2026-05-22 (one continuous session, ~30 commits)
**Reporting agent:** Claude Opus 4.7 (1M context), reflecting on its own session work

## Who the operator is (in design terms)

Avery is not a user. He is an **operator** — a single human running a multi-repo control tower (`automata`, `nephew`, `ai-skills-library`, `dustpan`, `clinic`, `historia`, `red-e-play-app`, and more), who builds tools for himself at the pace of a producer building beats. The Pad is his cockpit.

Design implications:

- **One operator, no multi-tenant concerns** — security model is whitelist-based, not auth-based. Authn/authz is "is this running on my Mac?"
- **Daily-use surfaces matter most** — features used hourly get more polish than features used monthly. The Skins HUD ships before iOS scaffolding.
- **Hardware-producer mental model** — the MPC chassis isn't decoration. He thinks in pads, banks, transports, LCDs. The vocabulary maps to how he plans work.
- **Compounding > one-offs** — every shipped feature should either extend a reusable skill in `ai-skills-library` or extend the repo with witnessed code (per `WP-AUTOMATA-001`).

## What the project is (in design terms)

The Automata Pad is a **three-page Tauri 2 desktop control tower with a FastAPI browser-mode fallback**. It is the operator surface where the operator does daily work that would otherwise require multiple terminal windows + browser tabs + remembering CLI invocations.

```
┌─ The Pad as cockpit (the design pitch in one diagram) ──────────────┐
│                                                                      │
│  [ Pad ] [ Scanner ] [ Runners ]      ◐ Skins   ⚙ Settings           │
│                                                                      │
│   ↓                ↓             ↓                                    │
│   workflow         capture       execution                            │
│   - slice          - camera      - build / lint / test                │
│   - WP shop        - WebGPU      - boot / kill stack                  │
│   - stack runner   - LIDAR-ready - git status / log                   │
│   - intent input   - PNG snap    - open URLs                          │
└──────────────────────────────────────────────────────────────────────┘
```

Apple Vision Pro spatial-UI / Linear dashboard / Akai MPC controller — three lineages, one surface.

## The 12 nodes — full expansion

### 1. Visual-first cognition

The operator's working memory is visual. He approves or redirects UI changes faster from an ASCII diagram than from a paragraph of prose. **Lead with a diagram every time** (see the [`ui-design-diagram-first`](../../../../rules/library/ui-design-diagram-first/body.md) rule).

- **Trigger**: any UI/UX discussion at all.
- **Anti-pattern**: "the right rack now has tabs instead of accordion sections" (prose only — forces him to imagine the layout).
- **Correct**: Unicode box-and-arrow diagram showing the tab strip + active content pane, then one sentence naming the Linear segmented control as precedent.

### 2. Precedent citation

Every design choice is justified by naming a real-world product whose vocabulary the choice borrows from. This is not name-dropping; it's how the operator's stack stays internally consistent. If a UI element doesn't have a precedent, that's a smell — either invent a precedent or change the choice.

- **Apple System Settings** — segmented vertical nav + content pane (Settings modal)
- **Apple Cmd+Tab** — floating overlay with hover-preview + revert on Esc (Skins HUD)
- **Linear** — segmented pill controls, soft-shadow cards, sentence-case labels
- **Figma** — tabbed property panels, color-coded categories
- **Stripe Dashboard** — flat clean modern web-app vocabulary (shadcn skin)
- **Vision OS** — frosted translucent floating cards over animated background (Glass skin)
- **macOS menu bar** — top-right status icon button placement (Skins/Settings)
- **Akai MPC** — chassis bezels, gradient pads, LCD glow, banks, transports
- **App Store** — large launcher tiles with category sections (Runners page)

### 3. Operator-grade primitives

Tools must compound. A primitive built once should be the canonical version reused everywhere.

- `useLivePoll` (when shipped) is the canonical polling primitive.
- `useSkin` is the canonical skin state.
- `RUNNER_SCRIPTS` (Rust + Python whitelists) is the canonical "what can run" — touching one without the other is a bug.
- `runnerCatalog.ts` is the canonical button definition.

**Anti-pattern**: hand-rolling `setInterval` in a component when a `useLivePoll` exists. Hand-rolling a slider when a `settings-slider` exists. Inventing a new modal pattern when `SettingsModal` already handles backdrop / Esc / scroll lock.

### 4. Real shell execution

Buttons must DO things. "Tap this to ring up code" means actually run `wp post create`. "Boot stack" means actually start the four services. "Open Dockyard" means actually open `http://localhost:4321`.

Stubs are forbidden in shipped UI. Every button is either:
- **State-only** (toggles a useState) — fine, but be explicit about it
- **Wired** (executes a real script or opens a real URL)
- **Marked "coming soon"** with a stub component (acceptable temporarily, never silently)

### 5. Native + browser parity

The Pad runs as a Tauri 2 desktop app (`make ui`) and as a plain browser SPA (`make ui-local`). The same buttons must work in both modes.

- **Native**: React → Tauri `invoke()` → Rust command → bash script
- **Browser**: React → `fetch()` → FastAPI endpoint → bash script

The frontend tries Tauri first (`isTauriRuntime()`), falls back to HTTP. **The script is the truth** — both transports route to the same `.sh` file.

This means: every new Tauri command needs a paired FastAPI endpoint. Every whitelist update is two-sided.

### 6. Whitelisted security model

Frontend NEVER passes arbitrary script paths. Frontend passes a `kind` string (e.g. `"build"`, `"git-status"`); Rust + Python each map that string to a hardcoded path. Adding a new kind is intentional friction across four files:

- `scripts/<bucket>/<kind>.sh` — the script
- `apps/pad-desktop/src-tauri/src/stack.rs` — `runner_script_for_kind` (or whichever whitelist)
- `api/main.py` — the matching whitelist dict
- `apps/pad-desktop/src/runners/runnerCatalog.ts` — the frontend button

The friction IS the security feature. If you can't be bothered to touch four files, the button shouldn't exist.

### 7. Skin × theme orthogonality

Two independent axes:
- **Skin** (visual vocabulary): MPC / shadcn / Glass
- **Theme** (color mode): light / dark / auto

Every cell of the 3×2 matrix is a valid combination. The skin determines layout + typography + component vocabulary; the theme determines colors. **Never conflate them.** A "dark mode toggle" that also changes skin is a bug.

Persistence:
- `localStorage["automata-skin"]` → `"mpc" | "shadcn" | "glass"`
- `localStorage["automata-theme"]` → `"light" | "dark"` (absent = auto)
- Both reflected on `<html>` as `data-skin` + `data-theme` attributes.

### 8. Game-like haptics

The Pad feels alive because every interaction has a visual + (optional) audio response:

- **Pad press**: box-shadow glow + `transform: scale(0.96)` while pressed
- **Active state**: gradient + glow halo + colored icon shadow
- **Running state**: amber pulse (`status-pulse` 0.7s keyframe), pulsing dot
- **Card hover**: `translateY(-1px)` + heavier shadow
- **Modal open**: `modal-pop-in` keyframe (220ms cubic-bezier with bounce)
- **HUD open**: `hud-drop-in` keyframe (220ms cubic-bezier from above)
- **Tab swap**: `rack-tab-swap` keyframe (220ms fade + slight lift)
- **Skin card insert**: `card-slide-in` keyframe with 60ms stagger
- **LED pulse**: `led-pulse` keyframe (1.6s loop on equipped skin)
- **Service status dot**: `status-pulse` when alive
- **Audio tick** (opt-in): 35ms 720Hz square-wave on pad press

Motion has purpose. Random motion is forbidden. **Every animation answers the question "what just happened?"**

### 9. Honest disclosures

The Pad is honest about its limits:

- **LIDAR**: the Scanner page's idle placeholder explicitly states "true LIDAR depth is iOS-only — desktop Macs can't expose ARKit data over web APIs."
- **WebGPU**: the WebGPU edge-pass toggle disables itself with the label "WebGPU unavailable in this runtime" if `navigator.gpu` is absent.
- **Tauri-only features**: shell exec falls back to FastAPI in browser mode with a clear error if FastAPI is also down: "Is the FastAPI running on :39737? (make api)".
- **Camera denied**: status pill shows red dot + "grant in System Settings → Privacy → Camera for Automata Pad" — the exact recovery path.

**Anti-pattern**: hiding a feature that doesn't work yet, or worse, claiming it works when it doesn't.

### 10. Append-only history

Every plan change appends to the `Modifications` section of the active intention doc with `YYYY-MM-DD · what · why`. The `Original plan` section is frozen after first write — never edit it.

This gives future agents (and future-self) a clear record of:
- What we set out to do (the original ask, verbatim)
- Every course correction with reasoning
- The current state (separate section, updated freely)

The journal is the source of truth for *how we got here*. Commit messages tell what shipped; the journal tells why.

### 11. Contracts are load-bearing

Every "I'll do X" or "I won't do Y" the agent emits is a commitment. Default is keep. Re-negotiate before breaking. Quiet breaks are worse than loud breaks.

- **Stated**: "I installed Rust with `--no-modify-path` so I don't touch `~/.zshrc`" → for the rest of the session, don't touch `~/.zshrc`. If a follow-up makes touching it necessary, say so out loud and ask.
- **Implied**: "I'll add the runner button" → also add it to the whitelist, the catalog, and the documentation. Half-completing is a contract break.

This is the [`contracts-and-prudence`](../../../../.claude/rules/contracts-and-prudence.md) rule in design form.

### 12. DRY across surfaces

One canonical source for anything that exists in multiple places:

- **Whitelists**: Rust + Python kept in lockstep.
- **Skins**: one CSS file with `[data-skin="…"]` blocks. Never duplicate component code per skin.
- **Rules**: one canonical body in the AI Skills Library; mirrored to every operator repo's `.claude/rules/` + `.cursor/rules/` per the [`rule-propagation-discipline`](../../../../.claude/rules/rule-propagation-discipline.md).
- **Documentation**: same diagram appears in the help doc, the whitepaper, and the README — but lives canonically in one file and is linked from the others. (Pragmatic exception: tiny diagrams are duplicated for inline readability; large diagrams are linked.)

## What the operator likes that they haven't asked for yet (predictive)

Based on observed patterns in this session, the operator probably also wants:

- **Recording the LCD** — a Journal → reports/ rollup of runner output, so a Tuesday morning can see what Monday ran.
- **Plugin runners** — `~/.automata/runners/*.sh` discovery so the user can add their own without editing the catalog.
- **Multi-window for Scanner** — Scanner is a candidate for a tear-out floating window (two-display setups).
- **iOS companion** — with a Swift LIDAR plugin, for real depth data. Already wired into the Scanner page; needs Xcode + plugin.
- **Skin presets** — "Avery Studio Dark" as a saved combination of (skin, theme, pad size, animation speed) that switches all four at once.
- **Live preview of WordPress cart on a localhost WP install** — currently the cart ships a `wp post create` command; the operator probably wants to also preview the assembled HTML in the LCD preview iframe pointed at a local WP install.
- **Operator profile in Settings** — name, agent affiliations, GitHub handle — used by commit messages and journal entries.

If any of these come up: they'll come up framed as "can it also do X" — not "from scratch." Match the existing vocabulary.

## What the operator dislikes (negative space)

From observed corrections in this session, the operator dislikes:

- **Tiny ambiguous controls** — the original 3-pill skin switcher was rejected for being un-readable; replaced with labeled segment buttons + later with the labeled HUD.
- **Stacked accordion when tabs would fit** — the right rack's three open-at-once sections were rejected for overlap; converted to tabs.
- **Stubs claiming to work** — the WordPress board's original "28 stubs of 32" was rejected; the user wanted all 32 to be real templates.
- **Visual prose** — every prose-only explanation of a UI change gets rejected with "make me a diagram."
- **Pipe-to-tail commits that hide failures** — shipped a broken build once because `pnpm lint | tail -5` swallowed the exit code; will not happen again.
- **Modifying user config silently** — touching `~/.zshrc` or `~/.gitconfig` without explicit per-edit auth is forbidden.

## The default agent posture

When the agent reads a prompt in this stack, the default posture is:

1. **What's the analogy?** (Cmd+Tab? MPC pad? Linear tab?) — if absent, name a candidate and check.
2. **What's the scope?** (state-only? URL open? whitelisted shell? all four?)
3. **What's the current state?** (lint clean? branch ahead of main? docs current?)
4. **What's the precedent?** — must be cited or invented before the work starts.
5. **What gets bumped?** — version, changelog, journal modification.
6. **What gets propagated?** — does this rule belong in `.claude/rules/`? In `ai-skills-library`?

The agent is not "responding" — the agent is *shipping* every turn. The turn ends when something is committed, pushed, and journaled.

## Continuation note

This report is living. When the operator's behavior reveals a new expectation, append a node to the "12 nodes" section (it'll be 13, 14, …). When a new mindset deserves its own subfolder in `mindsets/`, create one and copy this format.

The mindset is a moving target. The discipline of capturing it is not.
