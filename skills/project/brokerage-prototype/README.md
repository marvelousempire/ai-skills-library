# brokerage-prototype skills

Skills extracted from sessions on `marvelousempire/brokerage-prototype`. Each is portable to any project — the brokerage-prototype name marks origin, not scope.

| Skill | What it does | Use in any project? |
|---|---|---|
| [`launcher-makefile-shim`](launcher-makefile-shim/SKILL.md) | Add a Makefile that proxies `./go`-style launcher; gives consistent `make` verbs | Yes |
| [`colima-docker-swap`](colima-docker-swap/SKILL.md) | Swap wedged Docker Desktop for Colima on macOS Tahoe + Apple Silicon | Yes |
| [`port-drift-detector`](port-drift-detector/SKILL.md) | Cross-repo drift detection between paired implementations | Adaptable |

Companion artifacts in the same library:

- Decisions: [`docs/improvement/decision-records/000{1,2,3}-*.md`](../../../docs/improvement/decision-records/)
- Audit: [`docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md`](../../../docs/improvement/audits/2026-05-14-brokerage-make-shim-docker-colima.md)
- Session report: [`docs/reports/2026-05-14-brokerage-make-shim-docker-colima.md`](../../../docs/reports/2026-05-14-brokerage-make-shim-docker-colima.md)
- Playbook: [`docs/playbooks/wedged-docker-recovery.md`](../../../docs/playbooks/wedged-docker-recovery.md)
- Pain journal: 9 entries dated `2026-05-14-*` in [`docs/pain-journal/`](../../../docs/pain-journal/)
