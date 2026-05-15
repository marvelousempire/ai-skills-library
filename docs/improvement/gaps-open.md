# Gaps — open

Items where we said "skipping for now." Each gap links back to the audit that surfaced it. Closed gaps are removed (and footnoted in the originating audit).

## Format

```
- [<scope>] <Specific gap — name file or function>. <Why it matters>. (audit: <link>)
```

## Open

### SEEME (audits: 2026-05-14-seeme-v1, -seeme-docker)

- [seeme] **No alignment lint visualization** — the rule fires but doesn't render which `│` is offset. Future-me will hit a failure with low context. (audit: [2026-05-14-seeme-v1](audits/2026-05-14-seeme-v1.md))
- [seeme] **No CI integration test against real Anthropic API** — caching path is unverified end-to-end. (audit: [2026-05-14-seeme-v1](audits/2026-05-14-seeme-v1.md))
- [seeme] **No automated label-schema linter** for compose files (`scripts/lint-container-labels.sh` is planned). (audit: [2026-05-14-dockyard-integration](audits/2026-05-14-dockyard-integration.md))
- [seeme] **`createOllama` rebuilt per call** — fine for CLI, wasteful in library mode (MCP). (audit: [2026-05-14-seeme-v1](audits/2026-05-14-seeme-v1.md))
- [seeme] **`extractUsage` returns zeros silently** when provider gives no telemetry — no test asserts this is suppressed correctly. (audit: [2026-05-14-seeme-v1](audits/2026-05-14-seeme-v1.md))

### self-hosted-git

- [self-hosted-git] **GitLab CE Docker build untested end-to-end** — local Docker daemon hung 3× during the session. Compose file is correct but the build itself isn't proven. (audit: [2026-05-14-gitlab-ce-skill](audits/2026-05-14-gitlab-ce-skill.md))
- [self-hosted-git] **Backups not yet wired into a launchd plist** — `backup.sh` exists but cron-style scheduling is manual. (audit: [2026-05-14-gitlab-ce-skill](audits/2026-05-14-gitlab-ce-skill.md))
- [self-hosted-git] **Runner registration is a manual step** — auto-registration would be a UX win. (audit: [2026-05-14-gitlab-ce-skill](audits/2026-05-14-gitlab-ce-skill.md))

### Homelab Console

- [console] **Console doesn't yet read Docker labels via the engine API directly** — relies on Dockyard's API for engine detection. Console could probe `docker context` itself. (audit: [2026-05-14-homelab-console](audits/2026-05-14-homelab-console.md))
- [console] **`make stats` doesn't exist** — `seeme stats` does, but a console-wide stats aggregator would tie everything together. (audit: [2026-05-14-homelab-console](audits/2026-05-14-homelab-console.md))
- [console] **No `seeme history` aggregation across sessions** — JSONL log exists but no analysis. (audit: [2026-05-14-seeme-v1](audits/2026-05-14-seeme-v1.md))

### Dockyard integration

- [dockyard] **`SEEME_LONG_CACHE=1` unverified end-to-end** — wiring is correct but no real Anthropic call has confirmed the 1h beta header is accepted. (audit: [2026-05-14-dockyard-integration](audits/2026-05-14-dockyard-integration.md))
- [dockyard] **No `scripts/lint-container-labels.sh`** — labels schema is documented but not automatically enforced. (audit: [2026-05-14-dockyard-integration](audits/2026-05-14-dockyard-integration.md))

### Repo-level

- [repo] **No pre-commit hook** runs the verification gates. (audit: [2026-05-14-master-repo-evolution](audits/_template.md) — placeholder until written)
- [repo] **`make audit` / `make gates` target** doesn't exist yet — manually invoked scripts. (this commit lays the foundation but the consolidated `make` target is deferred)
- [repo] **No automated link checker for cross-references** — `scripts/check-cross-references.sh` is basic.
- [repo] **No tracked "migration-guides index"** (e.g. `docs/migration-guides-index.md`) — guides are discoverable per-skill but not centrally indexed.


### Brokerage make-shim / Docker / Colima session (2026-05-14)

- [brokerage-prototype] **`Modal.tsx` has no exit animation** — stripped during AnimatePresence portal-unmount debug; functionally correct but visually instant close. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [brokerage-prototype] **Docker image 77.7 MB, not advertised ~25 MB** — `docs/` ships into image because SPA lazy-loads them; could split runtime docs from EIN/Trust SOPs. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [brokerage-prototype] **`src/data/tech-stack.ts` ↔ `STACK.md` drift inevitable** — manual sync only; in-app Stack badge will misrepresent stack as STACK.md evolves. Needs sync-check script. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [brokerage-prototype] **`port-drift.sh` v2 lacks target-file-existence check** — pending Flow 1 rows could auto-suggest ✅ if target paths exist in canonical. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [brokerage-prototype] **`com.brokerage.port-drift.plist` hardcodes `/Users/nivram`** — won't port between users. Render with `$HOME` at install time. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [system] **Dual-Homebrew problem not resolved** — `/opt/homebrew` unwritable + doesn't recognize macOS 26; routed around with direct binary install but brew still broken. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [dockyard] **`dockyard.config.json` socket pin edited locally, not committed** — left as uncommitted change in `~/Developer/claude-chat-reader/dockyard/`. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [brokerage-prototype] **`Modal.tsx` ESC handler uses document-level keydown** — could leak if Modal mounts twice. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [brokerage-prototype] **`port-drift.sh` has no tests** — runs weekly; if PORTING_NOTES.md format changes, parser silently produces wrong reports. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [host] **`ruflo-core` + `ruflo-federation` plugins still installed** — never invoked, ~628 always-on tokens/session. Run `claude plugin uninstall`. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)

## Closed (footnote each in its audit)

*(none yet — will accumulate as gaps are closed)*
