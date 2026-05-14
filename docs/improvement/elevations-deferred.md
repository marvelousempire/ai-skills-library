# Elevations — deferred

Items the user proposed (or the audit surfaced) but didn't pick this round. Tracked here so they don't evaporate.

## Format

```
- [<scope>] <Title>. <One-line on what it is + why it'd matter>. (audit: <link>)
```

## Deferred

### SEEME

- [seeme] **Public npm publish for `@diagrammer/cli`** — would unlock `npx seeme` for any user. (audit: [2026-05-14-seeme-v1](audits/2026-05-14-seeme-v1.md))
- [seeme] **Cornhole Arena diagram integration** — connect SEEME to the broader red-e-play project surface. (audit: [2026-05-14-seeme-v1](audits/2026-05-14-seeme-v1.md))
- [seeme] **`seeme stats` cross-session aggregation + dashboard** — JSONL log already exists; need a visualization. (audit: [2026-05-14-seeme-v1](audits/2026-05-14-seeme-v1.md))
- [seeme] **Sub-classifier improvements** — more no-diagram failure types (truncated-without-fence, json-only, etc. — currently 4 categories; could be 8+). (audit: [2026-05-14-seeme-v1](audits/2026-05-14-seeme-v1.md))
- [seeme] **Web preview app (Next.js)** — was Phase 2 in the original plan; replaced by MCP server but the web app remains latent. (audit: [2026-05-14-seeme-v1](audits/2026-05-14-seeme-v1.md))

### self-hosted-git

- [self-hosted-git] **Multi-architecture image builds** — straightforward with `buildx` once an ARM runner is added. (audit: [2026-05-14-gitlab-ce-skill](audits/2026-05-14-gitlab-ce-skill.md))
- [self-hosted-git] **Slack/Discord webhook notifications on pipeline failure** — GitLab has built-in Integrations; not yet wired. (audit: [2026-05-14-gitlab-ce-skill](audits/2026-05-14-gitlab-ce-skill.md))
- [self-hosted-git] **`gitlab-runner` auto-registration on first boot** — currently manual; can be scripted with the registration token API. (audit: [2026-05-14-gitlab-ce-skill](audits/2026-05-14-gitlab-ce-skill.md))

### Homelab Console + CI dashboard

- [console] **"Open in Dockyard" deep-link per service card** in the console — wired in `/api/status` but the UI shows only top-level links. (audit: [2026-05-14-homelab-console](audits/2026-05-14-homelab-console.md))
- [console] **Engine-swap automation** — `make migrate-to-colima` target that handles the full Docker Desktop → Colima migration. (audit: [2026-05-14-homelab-console](audits/2026-05-14-homelab-console.md))
- [ci-dashboard] **Trigger a manual pipeline from the dashboard** — requires `api` scope on the token; currently read-only. (audit: [2026-05-14-gitlab-ce-skill](audits/2026-05-14-gitlab-ce-skill.md))
- [ci-dashboard] **Live log streaming for the currently-running job**. (audit: [2026-05-14-gitlab-ce-skill](audits/2026-05-14-gitlab-ce-skill.md))

### Dockyard integration

- [dockyard] **MCP register_skill self-publish** — speculative; once SEEME is wired into one MCP host, all the others auto-discover it. (audit: [2026-05-14-dockyard-integration](audits/2026-05-14-dockyard-integration.md))
- [dockyard] **`docker context inspect` fallback** for engine detection when Dockyard is down. (audit: [2026-05-14-dockyard-integration](audits/2026-05-14-dockyard-integration.md))

### Repo-level

- [repo] **`make audit` consolidated target** — runs every verification gate from one command (planned for next session).
- [repo] **Pre-commit Git hook** that runs the gates automatically.
- [repo] **CI workflow that runs the gates on every push** to `main` — once GitLab CE is up, point a runner at this repo.
- [repo] **Automated cross-reference rippler** ([`agents/cross-reference-rippler/`](../../agents/cross-reference-rippler/) is a stub).
- [repo] **Automated count-keeper** ([`agents/count-keeper/`](../../agents/count-keeper/) is a stub).
- [repo] **Quarterly skill-audit pass** — periodically review every skill for staleness, broken links, drifted dependencies.

## Anti-patterns

- Letting this list grow forever without pruning — quarterly review to either pick up or de-scope
- Putting "minor polish" items here — those should just ship
- Items without a scope tag — un-grep-able

## Promoting an elevation

When an elevation is picked:
1. Move from this file to a new plan
2. Build per [`docs/workflows/build-new-skill.md`](../workflows/build-new-skill.md) (or appropriate workflow)
3. Footnote here: `[picked YYYY-MM-DD: <commit hash>]`
4. Remove the bullet

### Brokerage make-shim / Docker / Colima session (2026-05-14)

- [brokerage-prototype] **A. `tech-stack-sync-check.sh`** — diff `STACK.md` shipped-rows against `src/data/tech-stack.ts`; fail CI on drift. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [brokerage-prototype] **B. `port-drift.sh` v2 — target file existence probe** — auto-suggest ✅ for Flow 1 rows whose canonical-side path exists. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [brokerage-prototype] **C. Portable launchd plist** — render with `$HOME` at install time; ports between users. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [brokerage-prototype] **D. Tier 1 — four more scripts** — doc-drift, auth-middleware audit, compliance tickler, witness signer; follow `port-drift.sh` template. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [brokerage-prototype] **E. `make docker-up --dry-run`** — render compose plan without launching daemons; user sees image pulls before they start. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [brokerage-prototype] **F. Stack modal `Cmd+,` shortcut** — keyboard-discoverable reference panel, matches cmdk pattern. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [skills-library] **G. `scripts/cleanup-ruflo.sh`** — uninstall script for Ruflo plugins + marketplace. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [brokerage-prototype / FOP] **H. Tier 2 coordinated multi-agent** for prototype ↔ canonical port handoff. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- [skills-library] **I. `STRUCTURE.md` reconciliation** — `docs/master-reports/` (per STRUCTURE.md) vs `docs/reports/` (per gap-audit-and-elevation skill + Dockyard audit) — pick one canonical dir. (audit: docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
