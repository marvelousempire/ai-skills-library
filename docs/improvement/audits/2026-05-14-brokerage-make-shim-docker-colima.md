# Gap audit + elevation pass + Boolean lead sheet — brokerage make-shim, port-drift, Stack badge, Docker→Colima

**Date:** 2026-05-14
**Shipped:** brokerage-prototype commits `5b6f30d` → `7023e3e` (9 commits) + FOP commit `b5fad59` + system-level Colima VM + launchd job
**Scope:** brokerage-prototype session — Makefile shim, port-drift autonomous reporting, in-app Stack badge, Docker prod build, Colima runtime swap

## Gaps

1. **`Modal.tsx` lost exit animation** — stripped during AnimatePresence-portal unmount debug. Functionally correct but visually instant close. Affects `Modal.tsx` lines ~39-83.
2. **Docker image is 77.7 MB**, not the ~25 MB I advertised in commit message. `docs/` (markdown policy docs) ships into the image because the SPA lazy-loads them. Could split: keep runtime docs, exclude EIN/Trust SOPs.
3. **`tech-stack.ts` ↔ `STACK.md` will drift** — manual sync only. The in-app Stack badge will silently misrepresent the actual stack as STACK.md evolves.
4. **`port-drift.sh` v2 missing target-file-existence check** — script tells you "23 pending Flow 1 ports" but doesn't probe whether the target paths named in each row already exist in family-office-platform. Easy to mark ✅ rows as done automatically.
5. **`com.brokerage.port-drift.plist` hardcodes `/Users/nivram`** — three absolute paths embedded. Will break if user renames home, won't work for collaborators.
6. **Dual-Homebrew problem not resolved** — `/opt/homebrew` is unwritable + doesn't recognize macOS 26. We routed around with direct binary install but the user's brew is still broken for future installs.
7. **`dockyard.config.json` socket pin** edited locally in `~/Developer/claude-chat-reader/dockyard/` but not committed back to that repo.
8. **Stack modal close handler** uses document-level keydown listener — could leak if Modal mounts twice simultaneously.
9. **`make port-drift` has no test** — runs once weekly; if PORTING_NOTES.md format ever changes, the parser will silently produce wrong reports.
10. **`HANDOFF_make-shim.md` + `HANDOFF_colima-swap.md`** still live in worktree root, gitignored under `.claude/worktrees/`, never made it to ai-skills-library until this session.

## Elevations

A. **`tech-stack-sync-check.sh`** — diff `STACK.md` shipped-rows against `src/data/tech-stack.ts` entries; fail CI if drift exceeds threshold.
B. **`port-drift.sh` v2 — target file existence probe** — for each Flow 1 row, check if the named target path exists in family-office-platform; auto-suggest ✅ for ones that do.
C. **`scripts/install-port-drift-schedule.sh` portable plist** — template the plist with `$HOME` at install time, write rendered version to LaunchAgents. Ports to any user.
D. **Tier 1 — four more autonomous scripts**: doc-drift detector, auth-middleware audit, compliance tickler, witness signer. Each follows `port-drift.sh` template.
E. **`make docker-up --dry-run`** — render the would-be docker-compose plan without launching daemons, so the user sees what's about to happen before the build pulls 500 MB of base images.
F. **Stack modal `Cmd+,` shortcut** — make the reference panel keyboard-discoverable (matches cmdk command palette pattern in this repo).
G. **`brokerage-prototype` skill family in ai-skills-library** — under `skills/project/brokerage-prototype/`, mirroring `red-e-play/` and `yousirjuan/` patterns. (This audit is the first deliverable of that.)
H. **`scripts/cleanup-ruflo.sh`** — uninstall script for `ruflo-core` + `ruflo-federation` (still installed at user scope, ~628 always-on tokens/session).

## Decision

Foundation shipped in brokerage-prototype + family-office-platform main. **All gaps and elevations remain open** — this audit is filed; user (Director) picks which to execute next session.

Highest-leverage in my read: **A** (sync-check) + **C** (portable plist) + **H** (Ruflo cleanup) — each closes a real fragility without inventing new scope.

## Boolean lead sheet (per `failure-proof-audit`)

| ID | Category | Requirement | Boolean Test | Pass Condition | Fail Condition | Status | Evidence | Fix | Owner | Reviewer | Final Approval |
|---|---|---|---|---|---|---|---|---|---|---|---|
| BRK-001 | Live-verification | Every meaningful ship gets a live execution test before "done" | Was the artifact run end-to-end after writing? | Yes, output observed matches intent | No, only typecheck/lint ran | **Fail** | `make docker-up` failed first time, port-drift never run during commit | Adopt `checklists/post-ship-live-verification.md` | Employee | Mgr | Director |
| BRK-002 | Docker | `.dockerignore` excludes files NOT in any `COPY` of `Dockerfile` | Cross-reference: every `COPY <src>` source is allowed by `.dockerignore` | Yes, all sources reachable | At least one `COPY` source excluded | **Pass** (after fix `f38a1ab`) | `.dockerignore` no longer lists `nginx.conf` | n/a | Employee | Mgr | Director |
| BRK-003 | macOS portability | Shell artifacts use `$HOME`, not `/Users/<user>` | Grep all shipped `.sh`/`.plist` for `/Users/[a-z]+` | No hardcoded paths | At least one absolute home path | **Fail** | `com.brokerage.port-drift.plist` contains 3 hardcoded paths | Render at install time | Employee | Mgr | Director |
| BRK-004 | Runtime portability | macOS TCC paths NOT used as launchd output destinations | Grep launchd plists for `~/Documents`, `~/Desktop`, `~/Downloads` | No TCC-protected paths | TCC path present | **Pass** | Output writes to `~/.claude/state/` | n/a | Employee | Mgr | Director |
| BRK-005 | Drift detection | Single-source-of-truth for stack metadata | One file generates the others, OR sync-check fails CI on drift | One source OR sync-check exists | Two sources, no sync-check | **Fail** | `STACK.md` + `src/data/tech-stack.ts` both editable, no check | Build `tech-stack-sync-check.sh` (Elevation A) | Employee | Mgr | Director |
| BRK-006 | Plugin economy | Installed plugins justify their always-on token cost | Each installed plugin has documented active use | Yes — at least one invocation logged | Plugin installed, never invoked | **Fail** | `ruflo-core` + `ruflo-federation` installed, never used | Run `claude plugin uninstall` (Elevation H) | Employee | Mgr | Director |
| BRK-007 | Cross-repo state hygiene | Edits to sibling repos get committed to those repos | `git status` clean in every sibling repo touched | All clean | At least one repo has uncommitted edits | **Fail** | `dockyard.config.json` modified in `claude-chat-reader/`, not committed | Open PR to dockyard with socket-pin commit | Employee | Mgr | Director |
| BRK-008 | Animation infrastructure | `AnimatePresence` not used with `createPortal` + body mount until tested | Spike-test before adopting in production component | Yes — proved in throwaway component first | Adopted without spike test | **Fail** | Modal.tsx had to be debugged live and stripped | Pain journal entry + spike-test pattern in playbook | Employee | Mgr | Director |
| GIT-001 | Git Safety | Status checked before changes | Was `git status` reviewed first? | Yes, output confirmed clean | No check performed | **Pass** | Pre-flight in this audit | n/a | Employee | Mgr | Director |
| GIT-002 | Git Safety | Safe working branch before edits | Was a non-main branch created? | Yes, named `claude/2026-05-14-brokerage-audit` | Working on main directly | **Pass** | Branch exists | n/a | Employee | Mgr | Director |
| GIT-003 | Git Safety | Diff reviewed before commit | Was the diff visually inspected? | Yes, diff confirmed | No diff review | **Pending** | Awaiting user (Director) review | Director scans before merge | Employee | Mgr | Director |
| GIT-004 | Git Safety | Rollback path exists | Can this be undone cleanly? | Yes, branch can be deleted | Irreversible change | **Pass** | All work on feature branch | n/a | Employee | Mgr | Director |

**Pass / Fail / Pending totals:** 4 Pass · 6 Fail · 2 Pending · 0 Blocked

## DRY method — repeating findings promoted to reusable

| Repeats in this session | Promoted to |
|---|---|
| "Code shipped without live test" (4×) | `checklists/post-ship-live-verification.md` |
| "Tooling fails silently because tool assumption was wrong" (3×: `timeout`, `bootstrap`, AnimatePresence) | `rules/library/probe-tool-before-assume/` (deferred to next session) |
| "Tool wedge worked around instead of fixed" (2×: Docker Desktop, dual-Homebrew) | `docs/improvement/recurring-failures.md` — log as recurring pattern |

## Open items (deferred)

→ `gaps-open.md`: 1–10 above
→ `elevations-deferred.md`: A–H above

## Linked

- **Session report:** [`docs/reports/2026-05-14-brokerage-make-shim-docker-colima.md`](../../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
- **Pain journal entries (8):** see `docs/pain-journal/2026-05-14-*` (this session)
- **New skills (3):** see `skills/project/brokerage-prototype/`
- **New playbook:** `docs/playbooks/wedged-docker-recovery.md`
- **New checklist:** `checklists/post-ship-live-verification.md`
- **New rule:** `rules/library/honest-dead-end-with-rollback/`
- **Decisions (3):** `docs/improvement/decision-records/0001`-`0003`

---

**Pattern:** [`docs/checklists/after-ship-audit.md`](../../../checklists/after-ship-audit.md) · **Template:** [`docs/improvement/audits/_template.md`](_template.md)
