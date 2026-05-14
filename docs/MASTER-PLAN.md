# AI Skills Library — Master Plan

*Living document. Last major update: DustPan v0.21–v0.27 arc retrospective.*
*Run `conversation-retrospective-extraction` after every significant session to extend this.*

---

## What this library IS

The AI Skills Library is the **compounding asset** — every lesson learned, every pattern discovered, every process refined gets preserved so the NEXT session starts smarter than the last one ended.

| Role | What it means |
|---|---|
| **Master report system** | Every significant arc produces a report capturing what was built, what failed, what was learned |
| **Study system** | Every pattern becomes a skill so future sessions invoke it by name |
| **Training system** | Context docs and rules shape AI agent behavior without being asked |
| **Improvement system** | Every repeated friction → skill; every repeated mistake → rule; every repeated question → doc |
| **Filing system** | The correct home for everything that shouldn't live only in a project repo |

---

## What belongs where

| Type | Location | When to file |
|---|---|---|
| **Skill** | `skills/<category>/<name>/SKILL.md` | Reusable process, invocable, narrow trigger |
| **Rule** | `rules/library/<name>/` | Always-on behavior, applies without being invoked |
| **Context** | `context/<product>-product-context.md` | Product positioning + design principles |
| **Doc** | `docs/<name>.md` | Process guides, lessons, master plans |
| **Template** | `templates/<category>/<name>/` | Starter files with standard structure |
| **Checklist** | `docs/checklists/<name>.md` | Step-by-step verification |

---

## Current state (as of DustPan arc completion)

### Skills filed — from the DustPan v0.21–v0.27 arc

| Skill | Filed | The lesson |
|---|---|---|
| `applescript-native-ui` | ✅ | Native macOS UI — display alert, progress, notification |
| `cost-annotation-discipline` | ✅ | Every destructive action declares its cost before the click |
| `ai-proposal-review-inbox` | ✅ | AI proposes → review → paste-ready snippet → never auto-mutates source |
| `never-run-sudo-from-app` | ✅ | OS password prompt is the consent gate |
| `make-check-defense-in-depth` | ✅ | CI catches renamed-strings-without-updated-consumers |
| `sandboxed-filesystem-peek` | ✅ | Allowlist + hard-deny + symlink-resolution for AI agent FS |
| `tool-calling-approval-reentry` | ✅ | Multi-turn AI loop pauses on destructive tools |
| `make-update-make-doctor` | ✅ | UX safety net for git-clone-and-make tools |
| `feature-marketing-md` | ✅ | One MD per feature, eight sections, paste-ready copy |
| `conversation-retrospective-extraction` | ✅ | The 7-step extraction workflow |
| `real-time-honest-signaling` | ✅ | Wire to SSE done event — never setTimeout |
| `library-plus-doc-template` | ✅ | Every library entry paired with a doc |
| `three-tier-safety-classification` | ✅ | safe/probably_safe/caution as structural guarantee |
| `post-ship-elevation-pass` | ✅ | Gap audit + elevation pass after every ship |
| `plan-first-substantive-changes` | ✅ | Plan document before any >2-file change |
| `post-sse-via-fetch-readablestream` | ✅ | POST + SSE via fetch() + ReadableStream |
| `product-repo-architecture` | ✅ | The DustPan repo design pattern |
| `avery-goodman-repo-standard` | ✅ | Branded schema — brand mark, one-word labels, folder system |
| `confirm-ship-clearly` | ✅ | Four receipts: tag + PR + commit + kVersion |
| `streaming-sse-event-vocabulary` | ✅ | Canonical AI agent SSE event types |
| `emergency-auto-navigate-on-condition` | ✅ | SADPA pattern — monitor + auto-navigate on threshold |
| `multi-surface-single-engine` | ✅ | One engine, multiple UX surface adapters |

### Templates filed
- `templates/engineering/plan-document/TEMPLATE.md` ✅
- `templates/engineering/skill-md/SKILL.template.md` ✅
- `templates/engineering/avery-goodman-repo/README.template.md` ✅

### Checklists filed
- `docs/checklists/rebrand-sweep.md` ✅
- `docs/checklists/release-verification.md` ✅
- `docs/checklists/pre-merge-verification.md` ✅

### Docs filed
- `docs/dustpan-arc-master-report.md` ✅
- `docs/cross-repo-classifier-dance.md` ✅
- `docs/what-makes-a-good-skill.md` ✅
- `docs/MASTER-PLAN.md` (this file) ✅

### Context docs filed
- `context/dustpan-product-context.md` ✅

### Scripts
- `scripts/finalize-skills-index.sh` ✅ — auto-detects skills, updates index, idempotent
- `scripts/install-hooks.sh` ✅ — wires pre-push hook that enforces count sync

### Automation wired
- Pre-push hook: `SKILL-INDEX.md` count must match on-disk total before push ✅

---

## Outstanding items (genuinely not done)

### MEDIUM priority skills
- [ ] `confirm-ship-clearly` ← confirm: is this actually filed? check via `find skills -name SKILL.md | xargs grep -l "confirm-ship-clearly"`
- [ ] Skill candidate scanner — script that scans a conversation transcript and pre-populates a candidate list
- [ ] Plan file template generator — `./scripts/new-plan.sh "feature"` creates `plans/NNNN-feature.md`
- [ ] `make check` as git pre-commit hook in PRODUCT repos (not this repo — DustPan, red-e-play, etc.)

---

## The extraction workflow

1. Read the full conversation backward — focus on user messages, repeated patterns, failures, elevations
2. Classify every finding: skill / rule / context / doc / template / checklist
3. Apply the four-gate filter (scope / trigger / substance / origin)
4. File using the cross-repo heredoc pattern (see `docs/cross-repo-classifier-dance.md`)
5. Run `python3 scripts/validate-skill-frontmatter.py`
6. Run `./scripts/finalize-skills-index.sh` to sync SKILL-INDEX.md
7. Confirm with a master report

---

## The quality bar

Before filing anything, pass it through four gates:

| Gate | The question |
|---|---|
| Scope | Does it apply beyond this specific project? |
| Trigger | Is the trigger narrow enough not to fire on every task? |
| Substance | Does it contain concrete executable code, not just principles? |
| Origin | Can you name the specific bug/pain/moment that triggered it? |

See `docs/what-makes-a-good-skill.md` for the full guide.

---

## Repo standards

1. Every new skill gets a `SKILL-INDEX.md` row on the same day → `./scripts/finalize-skills-index.sh`
2. Validator must pass before any PR merges → `python3 scripts/validate-skill-frontmatter.py`
3. Pre-push hook enforces count sync → installed via `./scripts/install-hooks.sh`
4. PRs are thematic, not bulk — one PR per extraction session
5. Context docs are canonical in the product repo — re-vendor here after editing there
