# Recurring failures — what to avoid

Incidents catalogued from the 2026-05-14 session. Each one has a preventative now in place. Future-me + every agent should read this before doing similar work.

## 1. Docker daemon crashes mid-build

**Incidents:** 3 separate crashes during the SEEME Docker build + Dockyard integration day. Docker Desktop 4.70.0 on macOS Tahoe 26.3.1 (Apple Silicon) hits compatibility regressions on every restart.

**Symptoms:** `docker build` hangs at 0% CPU but stays "running" for 30+ minutes. `docker info` blocks for 30s then returns 503. `pkill` required.

**Root cause:** Docker Desktop's Linux VM enters an unrecoverable state on macOS Tahoe + Apple Silicon. Stale vsock files block restart.

**Preventatives now in place:**
- [`skills/infra/dockyard/`](../../skills/infra/dockyard/) — full skill ships Colima migration guide
- [`docs/standards/long-running-commands.md`](../standards/long-running-commands.md) — timeout policy
- [`docs/standards/doctor-script.md`](../standards/doctor-script.md) — every infra skill ships a doctor
- `skills/infra/console/Makefile` `make doctor` — checks Docker daemon

**Recovery recipe:**
```sh
pkill -9 -f "Docker.app|com.docker" 2>/dev/null
sleep 3
open -a Docker     # or colima start
```

## 2. Disk full (99% / 2.9 GB free)

**Incidents:** 1 build failure during SEEME Docker work. Disk at 199 / 228 GB. Builds choked.

**Symptoms:** `docker build` fails immediately with "no space left on device." `docker images` returns nothing.

**Root cause:** Stale Docker images + node_modules + Xcode DerivedData accumulating.

**Preventatives now in place:**
- `doctor` reports disk %; rule: doctor must be green before committing
- [`docs/standards/long-running-commands.md`](../standards/long-running-commands.md) — disk awareness

**Recovery recipe:**
```sh
docker builder prune --all --force
docker image prune --all --force
docker container prune --force
find ~ -type d -name node_modules -prune -size +500M
rm -rf ~/Library/Developer/Xcode/DerivedData
```

## 3. Parent repo on wrong branch during merge

**Incidents:** 1× — tried to merge `claude/<branch>` into "main" but the parent repo was on `add-applescript-native-ui-skill`. `git merge` said "Already up to date" because I'd been merging into the wrong branch.

**Symptoms:** Merge appears to succeed but `main` log doesn't show the new commit. Auto-push hook reports "Everything up-to-date" misleadingly.

**Preventatives now in place:**
- [`docs/checklists/ship.md`](../checklists/ship.md) — Gate 6: branch state confirmation before merge

**Recovery recipe:**
```sh
git -C ~/Developer/ai-skills-library branch --show-current
# If wrong: stash, checkout main, merge, push, restore.
```

## 4. SKILL count drift (76 → 73 → 77 → 78)

**Incidents:** 4× over the session. SKILL-INDEX claimed 73; actual was 76. Later: indexed 77, actual 78. Manual edits never matched `find skills -name SKILL.md | wc -l`.

**Symptoms:** Count in `SKILL-INDEX.md`, root `README.md`, and actual file count diverged silently.

**Root cause:** Manual count maintenance is unreliable. Parallel commits land skills without notifying us.

**Preventatives now in place:**
- [`scripts/check-skill-count.sh`](../../scripts/check-skill-count.sh) — automated reconciliation
- [`docs/standards/verification-gates.md`](../standards/verification-gates.md) — Gate 1
- [`agents/count-keeper/`](../../agents/count-keeper/) — planned automation

## 5. Hung Docker builds with no timeout

**Incidents:** 3 separate hangs (one from a parallel `iowre:test` build, two from buildkit oversubscription). Each consumed ~30 min wall time before forced kill.

**Symptoms:** Build process stays alive at 0% CPU. Build output empty. buildkit daemon stops responding.

**Root cause:** No watchdog kill on long builds. buildkit hangs when oversubscribed by concurrent builds.

**Preventatives now in place:**
- [`docs/standards/long-running-commands.md`](../standards/long-running-commands.md) — every long-running command has a timeout
- Recovery commands documented

**Recovery recipe:**
```sh
pkill -f "buildx build|docker build" 2>/dev/null
# Then re-evaluate whether to restart Docker entirely
```

## 6. Plan-file naming convention drift

**Incidents:** 1× — confusion over whether plans use `NNNN-` prefix or descriptive names. The user-global `CLAUDE.md` says numbered, the existing `~/.claude/plans/` uses descriptive.

**Preventatives now in place:**
- [`docs/standards/plan-naming.md`](../standards/plan-naming.md) — documents both conventions + when each applies

## 7. Cross-references skipped on skill add

**Incidents:** 1× — early skill addition missed updating `skills/visual/diagrams/README.md` for SEEME.

**Preventatives now in place:**
- [`docs/checklists/cross-reference.md`](../checklists/cross-reference.md) — one-page checklist
- [`docs/standards/cross-references.md`](../standards/cross-references.md) — full reference
- `rules/library/cross-reference-on-skill-add/` — `alwaysApply` rule

## 8. Decisions re-litigated

**Incidents:** 1× — Forgejo vs GitLab CE briefly re-opened after the initial decision.

**Preventatives now in place:**
- [`decision-records/INDEX.md`](decision-records/INDEX.md) — central index of decisions
- Decision-record template + workflow

## Pattern

Every failure → preventative file + automated check (where possible) + recovery recipe. Document the failure here so the next agent doesn't repeat it.

---

## N. "Code shipped" treated as "feature shipped" — bug-let-through rate

**Incidents:** 4 separate occurrences in the 2026-05-14 brokerage-make-shim-docker-colima session (port-drift never run during commit; `.dockerignore` excluded `nginx.conf`; Stack-badge close button + ESC + backdrop all failed initially; launchd output written to TCC-blocked `~/Documents/`).

**Symptoms:** Typecheck passes. Lint passes. Commit goes through. User opens the feature → it doesn't work. "I don't see this in my Docker at all." "Did the modal close work?"

**Root cause:** Code-correctness gates (typecheck, lint, syntax) fire before commit; behavior-correctness gates require running the feature. Easy to satisfy the former without the latter, especially when the runtime is broken (Docker Desktop wedged), the path is restricted (TCC), or the bug is framework-specific (AnimatePresence + portal).

**Preventative now in place:**
- Checklist: [`checklists/post-ship-live-verification.md`](../../checklists/post-ship-live-verification.md) — every meaningful ship gets the 4-row test
- Pain journal: [`docs/pain-journal/2026-05-14-code-shipped-not-feature-shipped.md`](../pain-journal/2026-05-14-code-shipped-not-feature-shipped.md)
- Rule (deferred to next session): `rules/library/probe-tool-before-assume/` — verify tooling assumption before relying on it

**Future-me reminder:** if I'm about to write "✓ shipped" in a session summary and I haven't actually RUN the feature end-to-end since writing it, the answer is "✓ committed, live-verification pending."

