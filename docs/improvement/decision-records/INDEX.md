# Decision records — index

Central index of all decision records across the library. Records themselves live in the relevant skill's `references/` folder.

## Active decisions

| Date | Decision | Skill | Record |
|---|---|---|---|
| 2026-05-14 | GitLab CE over Forgejo for the private Git platform | self-hosted-git | [`gitlab-vs-forgejo.md`](../../../skills/infra/self-hosted-git/references/gitlab-vs-forgejo.md) |
| 2026-05-14 | Colima over Docker Desktop / OrbStack for the Docker engine | dockyard | [`engines-compared.md`](../../../skills/infra/dockyard/references/engines-compared.md) |
| 2026-05-14 | Dockyard over native Docker Desktop UI as the Docker manager | dockyard | (implicit in skill) |
| 2026-05-14 | Anthropic Claude as the primary AI provider for SEEME (Ollama default for local) | seeme | (implicit in skill) |
| 2026-05-14 | Node 24 + `--experimental-strip-types` over Bun for SEEME | seeme | (implicit in `package.json`) |
| 2026-05-14 | Tailscale Path A → WireGuard via Flint 2 Path B for sovereign-stack networking | self-hosted-git | [`wireguard-quickstart.md`](../../../skills/infra/self-hosted-git/templates/wireguard-quickstart.md) (functional decision doc) |

| 2026-05-14 | launchd (not MCP scheduled tasks) for autonomous shell-script schedules | brokerage-prototype | [`0001-launchd-over-mcp-for-cron.md`](0001-launchd-over-mcp-for-cron.md) |
| 2026-05-14 | Colima (not Docker Desktop) as docker runtime on macOS Tahoe + Apple Silicon | brokerage-prototype | [`0002-colima-over-docker-desktop.md`](0002-colima-over-docker-desktop.md) |
| 2026-05-14 | Drop Ruflo Path A — not yet load-bearing for this workflow | brokerage-prototype | [`0003-drop-ruflo-not-yet-load-bearing.md`](0003-drop-ruflo-not-yet-load-bearing.md) |

## How to add a decision record

1. Pick A over B? Write the record:
   ```sh
   cp docs/templates/decision-record.md.template skills/<family>/<slug>/references/<X-vs-Y>.md
   ```
2. Fill in: Context, Options A/B with pros/cons, Decision + Why, Trigger for revisiting, Cost of being wrong.
3. Add a row to this index.
4. Cross-link from the skill's SKILL.md "Pairing" section.

## When to revisit

Each record has a "Trigger for revisiting" section. When that trigger fires, open a new record:

- New record cites the old one
- Old record gets a footer: `[superseded by <new>, YYYY-MM-DD]`
- Both stay in the index (history matters)

## Anti-patterns

- Decisions made in chat with no record — they evaporate
- Records that don't include the trigger for revisiting — they get re-litigated
- Records hidden in commit messages — discoverable only by `git log`
