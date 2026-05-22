# Changelog — AI Skills Library

All notable changes to the AI Skills Library federation hub are documented here.

## 2026-05-22 ET (even later) — Recipe references `@nephew/live-dashboard` package

The primitives are now an installable workspace package
(`@nephew/live-dashboard` v0.1.0+ in
`~/Developer/nephew/packages/live-dashboard/`). The recipe templates +
CHECKLIST + PROMPT updated to lead with `pnpm add @nephew/live-dashboard`
instead of "copy verbatim from canonical."

### Changed

- **`CHECKLIST.md` Stage 1** — was "Copy verbatim into starter/live-dashboard.tsx
  and starter/os-chrome.tsx (10 min)"; now "Add `@nephew/live-dashboard`
  as a dep (2 min). Fallback: copy-verbatim only when install is blocked."
- **`PROMPT.md`** — the verbatim hand-off prompt now says "install via
  `pnpm add @nephew/live-dashboard`" instead of "copy from canonical."
- **`starter/live-dashboard.tsx.template`** + **`starter/os-chrome.tsx.template`**
  — content rewritten to lead with the install path. Files become
  obsolete in the receiving repo once the package is installed (delete
  them after install).

### Why

Per the operator's 2026-05-22 question "do the files travel with
features or is it just static?" — answered by making the primitives
installable. Files travel as a versioned package dep, not as copies.
Updates flow via `pnpm update`. No drift.

Reference: Nephew commit e8f1cb8 ships the package at v0.1.0.

---

## 2026-05-22 ET (later) — Portable recipe folder for live-dashboard-pattern

### Added — `skills/methodology/live-dashboard-pattern/` becomes a portable recipe

The methodology skill is no longer just SKILL.md + README.md. It's now a
self-contained recipe folder that any AI can read in one place to build the
live-dashboard pattern in a target repo:

- **`CHECKLIST.md`** — 6-stage fill-in order: Orient → Starter primitives →
  Reference page → Worked examples → Apply rules → Ship. Cross-references
  every canonical source path in Nephew.
- **`PROMPT.md`** — verbatim hand-off prompt the operator pastes to any AI
  ("Read CHECKLIST.md and build a live dashboard for [DOMAIN]"). Includes
  the success criteria, the anti-patterns to forbid, and the one-line version.
- **`starter/`** — drop-in primitives:
  - `README.md` — how to import the primitives into a new repo
  - `live-dashboard.tsx.template` — skeleton pointing at the canonical
    `nephew/apps/control-tower/src/lib/live-dashboard.tsx`
  - `os-chrome.tsx.template` — same, pointing at `os-chrome.tsx`
  - `ExampleCard.tsx.template` — ~100-LoC distilled exemplar using all
    six primitives + OSChrome, with a fake fetcher so the example runs
    standalone
  - `package-deps.md` — the exhaustive 5-runtime + 5-dev dependency list
    (no animation lib, no charting lib, no state-management lib)
- **`examples/`** — verbatim copies of the two production cards:
  - `README.md` — what to learn from each
  - `disks-card.tsx.template` — copy of `DustpanSummaryPage.tsx`
  - `processes-card.tsx.template` — copy of `DustpanProcessesPage.tsx`

The `.template` extension is intentional — files are skeletons containing
canonical reference paths and TODO markers. The receiving AI replaces
`.template` with the proper extension when filling each one in.

### Why

The operator asked (2026-05-22): "How can I explain to another AI that this
is how I want it to build for me … is this a folder or just a single file
because it will be great if we can do a folder like that to where I can
come up immediately."

Before this rollout, the live-dashboard pattern was scattered across
~7 files in 2 repos. Now there's ONE folder path the operator can hand to
any AI agent with a single sentence. The receiving AI follows CHECKLIST.md
top to bottom and produces a faithful implementation.

### Validation of the recipe

The "done" criterion (CHECKLIST.md Stage 6): hand the folder to a fresh AI
session. If that session can produce a working live dashboard card without
further operator hand-holding, the recipe is portable. If not, the gap
gets added back to PROMPT.md or to the templates.

---



This CHANGELOG was created on 2026-05-22 alongside the
`version-bump-and-changelog` rule adoption. Pre-existing skills,
agents, and rules are documented in git history and the
`LIBRARY-PLUGIN-CATALOG.md` index.

---

## 2026-05-22 ET — Cross-stack rule + skill rollout (3 batches)

### Added — five canonical rule mirrors

Verbatim mirrors from the Nephew federation canonical at
`nephew/.claude/rules/*` (both `.claude/rules/*.md` and
`.cursor/rules/*.mdc` formats):

- `live-dashboard-pattern` — every dashboard surface must feel alive
  (auto-poll + tweened numbers + transitioned meters + sparkline history
  + live pulse)
- `rule-propagation-discipline` — every new rule lands on every active
  AI-agent surface in one coordinated rollout (Nephew + Cursor + AISL +
  each operator-built repo + memory + commits + PRs + MRs, every time)
- `os-pill-and-about-modal` — every operator app top-left platform
  indicator (OS label + family glyph + health LED) opens an Apple
  "About This Mac"-precedent modal on click
- `apple-native-scripting-preference` — prefer `osascript` / `defaults` /
  `launchctl` / `shortcuts run` / `open -a` over manual click-path
  instructions for sophisticated Mac host automation
- `version-bump-and-changelog` — every PR that ships user-visible or
  operator-visible behavior bumps the package version + adds a CHANGELOG
  entry, in the same PR. **This entry is itself an example of the rule
  applied.**

### Added — five methodology skills

New skill directories under `skills/methodology/` carrying SKILL.md +
README.md pairs that bridge the rules into the federation catalog:

- `skills/methodology/live-dashboard-pattern/`
- `skills/methodology/os-pill-and-about-modal/`
- `skills/methodology/apple-native-scripting-preference/`
- `skills/methodology/version-bump-and-changelog/`
- (Sister rule `rule-propagation-discipline` lives only as a rule —
  intentionally not duplicated as a skill since it governs propagation
  rather than codifying a methodology.)

### Why

Per the new `rule-propagation-discipline` rule, the AI Skills Library
is the federation hub — every new operator-stack rule lands here as
BOTH a rule (`.claude/rules/*` + `.cursor/rules/*`) AND, when it codifies
a reusable methodology, as a skill under `skills/methodology/*`. This
rollout closes the gap for five rules adopted in the 2026-05-22 Nephew
Control Tower session.

Canonical bodies live at `nephew/.claude/rules/*`. Breakthrough writeup
at `nephew/docs/breakthroughs/2026-05-22-live-dashboard-pattern.md`.
