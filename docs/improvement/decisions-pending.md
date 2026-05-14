# Decisions — pending

Architectural choices the repo hasn't made yet. Each entry has enough detail for a future session to pick it up.

## Format

```
- [<scope>] <Title> — <one paragraph: what's open + when it'll force a choice>
```

## Pending

### Repo-level

- **Public vs private repo** — currently private at `marvelousempire/ai-skills-library`. If we publish methodology skills externally, decision needed on visibility model (separate `ai-skills-library-public` mirror? Public methodology + private project skills?).
- **`@diagrammer/cli` npm publication** — see `elevations-deferred.md`. Needs decision on package naming + ownership before any push to npm.
- **CI runner topology** — single runner on Mac mini vs runner-per-machine (laptop + Mac mini + future DGX Spark + Jetson Thor). Tag conventions are documented but the actual deployment isn't decided.

### Skills

- **Skill versioning** — when a skill substantively changes (e.g. SEEME 0.1 → 0.2 → 1.0), do we version the folder (`seeme-v2`), the frontmatter, or just Git history? Currently Git history only.
- **Cross-family skills** — a skill that legitimately spans two families (e.g. an analytics skill that's both `marketing/` and `engineering/`). Currently we pick one family arbitrarily.

### Infrastructure

- **Hardware decision** — Mac mini M4 Pro is the yousirjuan plan target. Has it been ordered? When it lands, the whole sovereign stack migrates from "any host" to "Mac mini specifically." Timeline drives Path A → Path B migration urgency.
- **DNS for the sovereign stack** — Tailscale Funnel (current Path A) vs a real domain. Tailscale gets us 95% there; a real domain unlocks the registry subdomain and proper certs.
- **Backup strategy beyond Backblaze B2** — currently the only backup. Off-site mirror? Local NAS? Cross-region?

## Forcing a decision

When a "pending" decision has been touched in 3+ sessions, force the record:

1. Open a new plan file
2. Use [`decision-record.md.template`](../templates/decision-record.md.template)
3. List options A vs B with pros / cons
4. Pick + write the rationale
5. Move from this file to the relevant skill's `references/` folder
6. Index in [`decision-records/INDEX.md`](decision-records/INDEX.md)
