# Infrastructure skills

Self-hosted, sovereign infrastructure playbooks for the You-Sir Juan stack.

| Pack | Path |
|------|------|
| **Self-hosted Git** *(GitLab CE)* | [`self-hosted-git/`](self-hosted-git/) — [`SKILL.md`](self-hosted-git/SKILL.md) · [`README.md`](self-hosted-git/README.md) |
| **Homelab Console** *(unified UI + Makefile)* | [`console/`](console/) — [`SKILL.md`](console/SKILL.md) · [`README.md`](console/README.md) |
| **Dockyard integration** *(label schema + engine setup)* | [`dockyard/`](dockyard/) — [`SKILL.md`](dockyard/SKILL.md) · [`README.md`](dockyard/README.md) |

Each pack is a Mac-mini-friendly playbook with Docker Compose templates, network options (Tailscale start → WireGuard target), HTTPS via Caddy, automated backups, and migration paths. All anchored in the [yousirjuan platform vision](../../docs/yousirjuan-platform-skills-master.md).

## The console ties them together

[`console/`](console/) is a single web UI + `Makefile` that boots / monitors / stops every service in this folder. Run `make start` once and the whole sovereign stack (Dockyard + SEEME + GitLab CE + Runners + CI dashboard + this console) comes up. `make doctor` health-checks everything (including which Docker engine is in use). `make open` shows you all of it at a glance.

## Dockyard is the recommended Docker UI

[`dockyard/`](dockyard/) integrates [Dockyard](https://github.com/marvelousempire/claude-chat-reader/tree/main/dockyard) — the user's Python-stdlib Docker manager UI — with every other stack in this folder. Every container ships the `ai-skills-library.*` label schema so Dockyard's Compose view renders the stacks with names, roles, and per-service URLs. Includes a Docker Desktop → Colima migration guide. Use Dockyard instead of Docker Desktop on Apple Silicon + macOS Tahoe.
