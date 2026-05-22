# Changelog — AI Skills Library

All notable changes to the AI Skills Library federation hub are documented here.

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
