# Product Context — DustPan by AVERY GOODMAN

*Last updated: 2026-05-14 · Drafted from the DustPan v0.21–v0.27 arc. The product is the reference implementation for several skills in this library — when in doubt about how to apply one, study DustPan.*

## Product Overview

**One-liner:** Local macOS disk-recovery app with a conversational AI agent that uses real measurements + cost-annotated cleanups + a sandboxed filesystem peek.

**What it does:** A web dashboard (Vite + React) backed by Python stdlib `http.server`. Finds files macOS users probably don't need and helps delete them safely — Xcode caches, Docker virtual disks, browser data, dev caches, forgotten downloads, and (uniquely) **disk space locked behind previous users' accounts**. On a developer Mac that does real work, recovers 50–150 GB. As of v0.23, ships a **conversational AI agent (SADPA — Smart Auto-Detector Protector Agent)** that the user gives an Anthropic or OpenAI key to. The agent has 17 curated tools, sandboxed filesystem peek, action-approval cards, and can **propose new cleaners and AppleScripts** to grow the library.

**Product category:** Open-source developer utility, MIT-licensed, local-first.

**Repo:** [github.com/marvelousempire/dustpan](https://github.com/marvelousempire/dustpan) (the underlying URL is still `xcode-cleanup-shortcut` from the original Xcode-cleanup origin).

**Business model:** Free. No telemetry. No SaaS. No phone-home. User brings their own AI key.

## What makes DustPan the reference implementation

DustPan is the canonical example for **seven skills** in this library:

| Skill | What DustPan demonstrates |
|---|---|
| `cost-annotation-discipline` | Every action in `web/cleaners.py` carries a `cost` field with curated plain-English text. The agent's approval card pulls from this source — never AI-generated. |
| `ai-proposal-review-inbox` | `propose_new_cleaner` + `propose_new_applescript` tools + JSON-backed inbox at `~/.dustpan/proposals.json` + paste-ready snippet generators that match each source file's existing style. Never auto-edits canonical source. |
| `never-run-sudo-from-app` | Foreign-ownership recovery — finds disk locked by previous users, shows the exact `sudo chown` command with a Copy button + Open Terminal button, never executes sudo itself. The macOS password prompt is the consent gate. |
| `make-check-defense-in-depth` | The `make check` target verifies AppleScript syntax + every referenced file exists + bin/xcc references the current name + Python modules import + every AppleScript library entry compiles. Catches the v0.21.0-class silent regression. |
| `sandboxed-filesystem-peek` | `validate_peek_path()` in `web/agent_tools.py` — allowlist + hard-deny + symlink resolution. `measure_path` and `list_directory` tools never return file contents. |
| `tool-calling-approval-reentry` | `complete_with_tools()` in `web/ai.py` — Anthropic Messages API + OpenAI function-calling, multi-turn loop, approval gate via `tool_approval_needed` SSE event + re-entry with `pending_tool_results`. |
| `make-update-make-doctor` | `make update` (safe pull from any branch state) + `make doctor` (one-shot diagnostic). Added in v0.25.3 after a user got stranded on a stale feature branch. |
| `feature-marketing-md` | `docs/marketing/` folder with 8 files following the eight-section template. Track-A / Track-B channel copy split for multi-audience products. |
| `applescript-native-ui` (already shipped) | `applescripts/` library with native-UI scripts + reusable snippet docs. |

## Target Audience

Three distinct user groups as of v0.25:

1. **iOS / macOS developers** — Xcode caches, simulator runtimes, DerivedData. The original audience (v0.1–v0.20).
2. **General macOS power users** — disk recovery, multi-user-cruft unlock, Photos cache, Docker.raw. Broadened in v0.21+.
3. **LLM / AI early adopters** — conversational disk co-pilot with bring-your-own-key, no telemetry, local-first. Added in v0.23.

The marketing folder has **Track A** copy targeting the AI/MacOS audience (HN, r/MacOS, r/LocalLLaMA) and **Track B** copy targeting iOS devs (Show HN, r/iOSProgramming) — preserved as the proven baseline.

## Architecture in one paragraph

Python stdlib `http.server` (~5000 lines, no FastAPI, no pip installs — runs on any Mac out of the box). SSE for streaming. Vite + React + Tailwind dashboard. AppleScript cleanup engine for native macOS UI (display alerts, progress bars, system notifications). Optional Postgres backend for the AI key vault in Docker mode; SQLite fallback elsewhere. All shell paths are pre-vetted in `cleaners.py` — the AI agent dispatches via category+action IDs, never raw shell. Filesystem peek validates against an allowlist with hard-deny roots + symlink resolution.

## Key design principles (the philosophical core)

1. **Every destructive action declares its cost.** Curated text from source. AI agent uses verbatim, never generates.
2. **AI proposes; humans authorize.** The agent files proposals to a review inbox. Accept generates paste-ready snippets. The user pastes into source and commits. Source stays hand-curated.
3. **The OS password prompt is the consent gate.** DustPan never asks for your Mac password. For sudo operations, it shows the command with a Copy button.
4. **Tier classification is a structural guarantee.** `safe` / `probably_safe` / `caution`. "Clean ALL safe" buttons NEVER reach caution.
5. **Honest signaling.** Real-time UX comes from real signals — the kernel-reported freed-GB after a cleanup, the actual SSE done event from a subprocess. Never `setTimeout(1500)` fake completion.
6. **Native UI affordances.** Every script in the AppleScript library uses `display alert` / `progress` / `display notification`. No echo to Terminal. No dev-style output to a user-facing surface.
7. **CI catches silent regressions.** `make check` validates not just syntax but consumer references — the v0.21.0 rebrand bug class can't ship undetected anymore.

## When to study DustPan as an example

- Building any **AI-augmented dev tool** that needs to grow a hand-curated library without auto-mutating source
- Designing the **approval flow** for an AI agent's destructive tools
- Implementing **filesystem sandbox** for an AI agent
- Authoring **AppleScripts** that should feel native (not dev-style)
- Setting up **CI assertions** that catch rename / refactor silent regressions
- Writing **marketing material** organized as one-file-per-feature
- Solving **"git pull is unfriendly to non-experts"** for a developer tool

## What DustPan is NOT

- Not a general macOS cleaner (no Trash, no Mail downloads, no browser history beyond cache)
- Not for CI / build agents (their filesystems are ephemeral; DustPan is for personal dev Macs)
- Not multi-user / shared-system (designed for personal machines; multi-user-cruft DETECTION is a feature, but the tool itself is single-user)
- Not Linux-compatible by deliberate scope (macOS paths + AppleScript + `osascript` are core)
- Not closed source — open source is part of the trust contract

## Cross-references

- **DustPan repo:** github.com/marvelousempire/dustpan (still `marvelousempire/xcode-cleanup-shortcut` as the literal repo URL)
- **Plans:** `plans/0001-0025.md` — every substantive change has a plan with Context / Approach / Critical files / Verification
- **Marketing:** `docs/marketing/*.md` — eight self-contained feature briefs
- **AppleScript library:** `applescripts/` — 5 scripts + 4 reusable snippet docs
- **AI agent:** `web/agent_tools.py` + `web/agent_chat.py` + `web/ai.py` — 17 tools, 2-provider tool-use loop with approval re-entry
