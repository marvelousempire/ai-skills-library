# GitLab CE vs Forgejo — the decision record

**Decision (May 2026)**: ship the `self-hosted-git` skill with GitLab CE.

This document captures why so future-you doesn't re-litigate it.

## Context

The [yousirjuan platform plan](../../../../docs/yousirjuan-platform-skills-master.md#11-governance-gitops--operational-memory) already lists GitLab CE as the planned private platform with GitLab Runners + GitLab Registry as follow-ons. Forgejo and Gitea are listed as candidates ("lightweight optional smaller deployment", "community open-source alternative"). The decision was: ship the planned target, not the candidates.

## Side-by-side

| Capability | GitLab CE | Forgejo |
|---|---|---|
| Git + issues + PRs/MRs | ✓ | ✓ |
| Web UI for browsing code | ✓ (richer) | ✓ |
| Built-in CI/CD | ✓ (mature, runners are first-class) | ✓ (Forgejo Actions, GitHub-Actions-compatible) |
| Container registry | ✓ (built in, integrated auth) | ✓ (built in, simpler) |
| Package registry | npm, Maven, NuGet, PyPI, Conan, Go, Helm, Composer, generic | npm, Maven, NuGet, PyPI, generic |
| Wiki | ✓ | ✓ |
| Issue boards / agile | ✓ (multi-project, milestones, epics) | ✓ (basic) |
| Code review workflows | ✓ (approval rules, merge trains) | ✓ (basic approvals) |
| SAML / SSO / SCIM | ✓ (CE includes basic SAML; SCIM is Premium) | ✓ (OAuth2 / LDAP / SAML) |
| Code search | ✓ (advanced search; full-code search is Premium) | ✓ (basic) |
| MR rules + protected branches | ✓ (richer rules) | ✓ |
| Update story | manual version-stepping for major upgrades | trivial — `docker pull && up -d` |
| Migration into it | one-click from GitHub via built-in importer | manual mirror or scripted API |
| Migration out of it | painful (proprietary backup format) | easy (standard Git repos + JSON exports) |
| Resource baseline | 4–6 GB RAM, ~5% CPU idle | 200 MB RAM, <1% CPU idle |
| Cold-start time | 1–3 minutes | 5 seconds |
| Official macOS support | ✗ (Docker workaround) | ✗ (Docker is the path for both) |

## The arguments for each

### Arguments for GitLab CE

1. **The yousirjuan plan already commits to it.** Switching means rewriting the platform doc + ledger. Sticking means executing the plan as designed.
2. **Multi-runner CI/CD across the eventual Mac mini + laptop + DGX Spark + Jetson Thor fleet.** GitLab's runner model handles distributed CI natively. Forgejo Actions can do this too but operator experience across many machines is rougher.
3. **Container + package registries on Day 1.** When the user starts pushing private images for the AI stack (fine-tuning images, eval pipelines, ingestion workers), the GitLab registry is integrated with auth/permissions from the same instance. Forgejo's registry is simpler but less integrated.
4. **Future-proofing.** If the user ever starts a real team or company, GitLab scales. Migrating Forgejo → GitLab later means rebuilding CI, registries, permissions. Going the other way is also possible but feels like downgrading.
5. **Mac mini M4 Pro has the headroom.** The "Forgejo wins on resources" argument doesn't apply on a 24-GB+ Mac mini.

### Arguments for Forgejo

1. **Operational simplicity.** Updates are trivial. No major-version-stepping anxiety.
2. **Faster everything.** 5-second cold start vs 1–3 minutes. Snappier UI on weak hardware.
3. **Lower lock-in.** Backup format is standard. Migrating out is painless.
4. **Community-governed.** Some users prefer that to GitLab Inc. as a corporate steward (though GitLab CE is genuinely open-source and stable).
5. **You can always switch later.** Both speak git; both export to standard repo bundles.

## The honest call

For a **personal Git server for one developer**, Forgejo is almost certainly the better tool. Lower friction, lower attack surface, lower mental tax.

For a **sovereign AI infrastructure stack with multi-machine CI, eventual team scale, and a designed-out architecture**, GitLab CE is the right call. The platform plan optimizes for the second case.

The cost of being wrong: ~1 day of migration work to move from one to the other. Both store git as git; both export issues as JSON; neither lock-in is severe.

## Decision summary

- **Default**: GitLab CE (this skill ships it).
- **Escape hatch**: Forgejo as the lightweight alternative — Compose template + Caddyfile would take ~50 lines, lives in the same skill if/when needed.
- **Trigger for switching to Forgejo**: if the user (after a month of GitLab) finds the operational overhead annoying enough that they'd rather lose the registry/package features.
- **Trigger for staying on GitLab**: if registries and multi-runner CI become load-bearing within a month.

## Anchors

- [yousirjuan platform plan — Category 11](../../../../docs/yousirjuan-platform-skills-master.md#11-governance-gitops--operational-memory)
- [yousirjuan upstream ledger — section 11](../../../../docs/yousirjuan-upstream-repo-ledger.md)
